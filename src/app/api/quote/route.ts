export const runtime = "nodejs";

import { NextResponse } from "next/server";

const API_KEY = process.env.TWELVE_DATA_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") ?? "HDFCBANK";

  if (!API_KEY) {
    return NextResponse.json(
      { status: "ERROR" as const, message: "Missing TWELVE_DATA_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&exchange=NSE&apikey=${API_KEY}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (data.status === "error" || !data.close) {
      throw new Error(data.message || "Unexpected Twelve Data response");
    }

    const price = parseFloat(data.close);
    const change = parseFloat(data.change);
    const changePct = parseFloat(data.percent_change);
    const low52 = parseFloat(data.fifty_two_week?.low);
    const high52 = parseFloat(data.fifty_two_week?.high);

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