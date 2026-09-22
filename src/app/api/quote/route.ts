export const runtime = "nodejs";

import { NextResponse } from "next/server";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
};

// ---------------------------------------------------------------------------
// In-memory state (per server instance). Two jobs:
//  1. Cache the last good quote so a transient upstream failure never blanks
//     the UI — we can always return *something* plus an honest status.
//  2. Track a crumb/cookie pair for Yahoo (required since 2024 — unauthenticated
//     requests are now frequently rejected) and a simple backoff timer so a
//     failing upstream doesn't get hammered every 45s (which just gets the
//     server IP rate-limited harder).
// ---------------------------------------------------------------------------
type CacheEntry = {
  price: number;
  change: number;
  changePct: number;
  low52?: number;
  high52?: number;
  marketState?: string;
  timestamp: string;
};

const lastGood = new Map<string, CacheEntry>();
let yahooAuth: { cookie: string; crumb: string; fetchedAt: number } | null = null;
let backoffUntil = 0;
let backoffMs = 0;

const MIN_BACKOFF = 30_000; // 30s
const MAX_BACKOFF = 10 * 60_000; // 10 min

function bumpBackoff() {
  backoffMs = backoffMs ? Math.min(backoffMs * 2, MAX_BACKOFF) : MIN_BACKOFF;
  backoffUntil = Date.now() + backoffMs;
}

function clearBackoff() {
  backoffMs = 0;
  backoffUntil = 0;
}

async function getYahooAuth(): Promise<{ cookie: string; crumb: string }> {
  // Cached crumb/cookie pair is reused for ~55 minutes.
  if (yahooAuth && Date.now() - yahooAuth.fetchedAt < 55 * 60_000) {
    return yahooAuth;
  }

  const cookieRes = await fetch("https://fc.yahoo.com", {
    headers: BROWSER_HEADERS,
    cache: "no-store",
    redirect: "manual",
  });
  const setCookie = cookieRes.headers.get("set-cookie");
  if (!setCookie) throw new Error("Yahoo auth: no cookie returned");
  const cookie = setCookie.split(";")[0];

  const crumbRes = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
    headers: { ...BROWSER_HEADERS, Cookie: cookie },
    cache: "no-store",
  });
  if (!crumbRes.ok) throw new Error(`Yahoo auth: crumb request failed (${crumbRes.status})`);
  const crumb = (await crumbRes.text()).trim();
  if (!crumb) throw new Error("Yahoo auth: empty crumb");

  yahooAuth = { cookie, crumb, fetchedAt: Date.now() };
  return yahooAuth;
}

async function fetchFromYahoo(yahooSymbol: string) {
  const auth = await getYahooAuth();
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    yahooSymbol
  )}?crumb=${encodeURIComponent(auth.crumb)}`;

  const res = await fetch(url, {
    headers: { ...BROWSER_HEADERS, Cookie: auth.cookie },
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    // Stale crumb/cookie — force a re-auth on the *next* call.
    yahooAuth = null;
    throw new Error(`Yahoo auth rejected (${res.status})`);
  }
  if (res.status === 429) {
    throw new RateLimitError("Yahoo rate-limited this request (429)");
  }
  if (!res.ok) throw new Error(`Yahoo responded ${res.status}`);

  const data = await res.json();
  const result = data?.chart?.result?.[0];
  const meta = result?.meta;
  if (!meta || typeof meta.regularMarketPrice !== "number") {
    throw new Error("Unexpected Yahoo response shape");
  }

  const price = meta.regularMarketPrice;
  const prevClose = meta.previousClose ?? meta.chartPreviousClose;
  return {
    price,
    change: prevClose != null ? price - prevClose : 0,
    changePct: prevClose ? ((price - prevClose) / prevClose) * 100 : 0,
    low52: meta.fiftyTwoWeekLow,
    high52: meta.fiftyTwoWeekHigh,
    marketState: meta.marketState as string | undefined, // PRE, REGULAR, POST, CLOSED
  };
}

// Fallback source: Stooq's free CSV quote endpoint. No auth, generous limits,
// used only when Yahoo is down/blocked so the badge doesn't just go dark.
async function fetchFromStooq(symbol: string) {
  const stooqSymbol = `${symbol.toLowerCase()}.in`; // Stooq's NSE suffix
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(stooqSymbol)}&f=sd2t2ohlcv&h&e=csv`;
  const res = await fetch(url, { headers: BROWSER_HEADERS, cache: "no-store" });
  if (!res.ok) throw new Error(`Stooq responded ${res.status}`);

  const csv = (await res.text()).trim();
  const [, dataLine] = csv.split("\n");
  if (!dataLine) throw new Error("Stooq: empty response");
  const cols = dataLine.split(",");
  // Symbol,Date,Time,Open,High,Low,Close,Volume
  const close = Number(cols[6]);
  const open = Number(cols[3]);
  if (!Number.isFinite(close) || close <= 0) throw new Error("Stooq: no price for symbol");

  return {
    price: close,
    change: Number.isFinite(open) ? close - open : 0,
    changePct: Number.isFinite(open) && open ? ((close - open) / open) * 100 : 0,
    low52: undefined,
    high52: undefined,
    marketState: undefined,
  };
}

class RateLimitError extends Error {}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") ?? "HDFCBANK";
  const yahooSymbol = `${symbol}.NS`; // .NS = NSE suffix on Yahoo Finance
  const cached = lastGood.get(symbol);

  if (Date.now() < backoffUntil) {
    return NextResponse.json(
      {
        status: "ERROR" as const,
        message: `Upstream backing off after repeated failures, retrying after ${new Date(
          backoffUntil
        ).toLocaleTimeString()}`,
        lastGood: cached ?? null,
      },
      { status: 503 }
    );
  }

  let quote: Awaited<ReturnType<typeof fetchFromYahoo>> | null = null;
  let source: "yahoo" | "stooq" = "yahoo";
  let firstError: Error | null = null;

  try {
    quote = await fetchFromYahoo(yahooSymbol);
  } catch (err) {
    firstError = err instanceof Error ? err : new Error("Unknown Yahoo error");
    try {
      quote = await fetchFromStooq(symbol);
      source = "stooq";
    } catch (fallbackErr) {
      // Both sources failed.
      bumpBackoff();
      return NextResponse.json(
        {
          status: "ERROR" as const,
          message: `Primary (Yahoo) failed: ${firstError.message}. Fallback (Stooq) failed: ${
            fallbackErr instanceof Error ? fallbackErr.message : "unknown error"
          }`,
          rateLimited: firstError instanceof RateLimitError,
          lastGood: cached ?? null,
        },
        { status: 502 }
      );
    }
  }

  clearBackoff();
  const entry: CacheEntry = {
    price: quote.price,
    change: quote.change,
    changePct: quote.changePct,
    low52: quote.low52,
    high52: quote.high52,
    marketState: quote.marketState,
    timestamp: new Date().toISOString(),
  };
  lastGood.set(symbol, entry);

  return NextResponse.json({
    symbol,
    ...entry,
    source,
    degraded: source !== "yahoo" || firstError !== null,
    status: "LIVE" as const,
  });
}
