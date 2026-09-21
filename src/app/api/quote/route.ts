import { NextResponse } from "next/server";

// NSE's public quote endpoint is unofficial and requires a session cookie
// obtained from their homepage first, plus browser-like headers, or it
// returns 403. This route does that handshake server-side so the browser
// never talks to NSE directly (avoids CORS + protects against blocking).

const NSE_BASE = "https://www.nseindia.com";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") ?? "HDFCBANK";

  try {
    // Step 1: hit the homepage to get session cookies NSE requires
    const homeRes = await fetch(NSE_BASE, { headers: HEADERS, cache: "no-store" });
    const cookies = homeRes.headers.get("set-cookie") ?? "";

    // Step 2: request the quote using those cookies
    const quoteRes = await fetch(
      `${NSE_BASE}/api/quote-equity?symbol=${encodeURIComponent(symbol)}`,
      {
        headers: { ...HEADERS, Cookie: cookies, Referer: `${NSE_BASE}/get-quotes/equity?symbol=${symbol}` },
        cache: "no-store",
      }
    );

    if (!quoteRes.ok) {
      throw new Error(`NSE responded ${quoteRes.status}`);
    }

    const data = await quoteRes.json();

    const price = data?.priceInfo?.lastPrice;
    const change = data?.priceInfo?.change;
    const changePct = data?.priceInfo?.pChange;
    const low52 = data?.priceInfo?.weekHighLow?.min;
    const high52 = data?.priceInfo?.weekHighLow?.max;

    if (typeof price !== "number") {
      throw new Error("Unexpected NSE response shape");
    }

    return NextResponse.json({
      symbol,
      price,
      change,
      changePct,
      low52,
      high52,
      status: "LIVE" as const,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Fail soft: the client falls back to the static snapshot on any error
    return NextResponse.json(
      { status: "ERROR" as const, message: err instanceof Error ? err.message : "Unknown error" },
      { status: 502 }
    );
  }
}