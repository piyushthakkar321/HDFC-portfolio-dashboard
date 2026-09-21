export const runtime = "nodejs";

import { NextResponse } from "next/server";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") ?? "HDFCBANK";
  const yahooSymbol = `${symbol}.NS`; // .NS = NSE suffix on Yahoo Finance

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}`;
    const res = await fetch(url, { headers: HEADERS, cache: "no-store" });

    if (!res.ok) throw new Error(`Yahoo responded ${res.status}`);

    const data = await res.json();
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;

    if (!meta || typeof meta.regularMarketPrice !== "number") {
      throw new Error("Unexpected Yahoo response shape");
    }

    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose ?? meta.chartPreviousClose;
    const change = prevClose != null ? price - prevClose : 0;
    const changePct = prevClose ? (change / prevClose) * 100 : 0;
    const low52 = meta.fiftyTwoWeekLow;
    const high52 = meta.fiftyTwoWeekHigh;

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
    return NextResponse.json(
      { status: "ERROR" as const, message: err instanceof Error ? err.message : "Unknown error" },
      { status: 502 }
    );
  }
}