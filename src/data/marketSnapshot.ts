// Single source of truth for every price-dependent figure in the dashboard.
// Header, peer table, scenario engine, technical series and mandate scorecard all read from here.
// To go live: replace these constants with a feed and set `status` to "LIVE" plus a real timestamp.

export const MARKET_SNAPSHOT = {
  symbol: "HDFCBANK",
  price: 731.0, // post 1:1 bonus (Aug 2025) basis
  change: 18.0,
  changePct: 2.52,
  low52: 681.9,
  high52: 1020.5,
  sharesOutstandingCr: 1541, // 15.41 bn shares after the 1:1 bonus
  usdInr: 83.3, // assumption used only for the USD market-cap display
  status: "STATIC" as "STATIC" | "LIVE",
  statusLabel: "Static reference price (no live feed connected)",
  asOfDate: "20 Mar 2025", // analysis date: this model is frozen here; later real-world events (e.g. the Aug 2025 bonus) are noted as subsequent events, not baked into the series
} as const;

export const MARKET_CAP_CR = Math.round(MARKET_SNAPSHOT.price * MARKET_SNAPSHOT.sharesOutstandingCr);
export const MARKET_CAP_USD_BN = (MARKET_CAP_CR * 1e7) / MARKET_SNAPSHOT.usdInr / 1e9;