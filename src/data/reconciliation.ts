import { HDFC_DUPONT, HDFC_FUNDAMENTALS, BANKING_PEERS, generateTimeSeries } from "./hdfcData";
import { MARKET_SNAPSHOT, MARKET_CAP_CR } from "./marketSnapshot";
import { ALPHA_BRIDGE, INITIAL_CAPITAL, METRICS, PERIOD_YEARS } from "./metrics";

export interface CheckResult {
  id: string;
  label: string;
  pass: boolean;
  detail: string;
}

export const dupontProduct = (d: { netProfitMargin: number; assetTurnover: number; leverageMultiplier: number }) =>
  (d.netProfitMargin / 100) * (d.assetTurnover / 100) * d.leverageMultiplier * 100;

// Real, computed checks: nothing here is a hard-coded "pass".
export function runReconciliationChecks(): CheckResult[] {
  const results: CheckResult[] = [];

  const series = generateTimeSeries().technical;
  const lastClose = series[series.length - 1]?.close ?? NaN;
  results.push({
    id: "price",
    label: "One price across modules",
    pass: Math.abs(lastClose - MARKET_SNAPSHOT.price) < 0.01 && Math.abs(BANKING_PEERS[0].cmp - MARKET_SNAPSHOT.price) < 0.01,
    detail: `Header ₹${MARKET_SNAPSHOT.price.toFixed(2)} · technical series last close ₹${lastClose.toFixed(2)} · peer table ₹${BANKING_PEERS[0].cmp.toFixed(2)}`,
  });

  const maxDupont = Math.max(...HDFC_DUPONT.map((d) => Math.abs(dupontProduct(d) - d.reportedRoe)));
  results.push({
    id: "dupont",
    label: "DuPont product = reported ROE",
    pass: maxDupont <= 0.05,
    detail: `Max variance ${maxDupont.toFixed(3)} pp across ${HDFC_DUPONT.length} fiscal years (tolerance 0.05 pp)`,
  });

  const badPnl = HDFC_FUNDAMENTALS.filter(
    (f) =>
      f.nii + f.nonInterestIncome !== f.netRevenue ||
      f.netRevenue - f.operatingExpenses !== f.ppop ||
      f.ppop - f.provisions !== f.pbt,
  );
  results.push({
    id: "pnl",
    label: "P&L arithmetic (revenue → PPOP → PBT)",
    pass: badPnl.length === 0,
    detail: badPnl.length === 0 ? `All ${HDFC_FUNDAMENTALS.length} years tie exactly` : `Mismatch in ${badPnl.map((f) => f.fiscalYear).join(", ")}`,
  });

  const bridgeSum = ALPHA_BRIDGE.sector + ALPHA_BRIDGE.factor + ALPHA_BRIDGE.selection + ALPHA_BRIDGE.friction;
  results.push({
    id: "alpha",
    label: "Alpha bridge sums to net alpha",
    pass: Math.abs(bridgeSum - ALPHA_BRIDGE.net) < 0.005,
    detail: `${ALPHA_BRIDGE.sector.toFixed(2)} + ${ALPHA_BRIDGE.factor.toFixed(2)} + ${ALPHA_BRIDGE.selection.toFixed(2)} (selection/interaction) − ${Math.abs(ALPHA_BRIDGE.friction).toFixed(2)} = ${bridgeSum.toFixed(2)}`,
  });

  const back = INITIAL_CAPITAL * Math.pow(1 + METRICS.cagr.active / 100, PERIOD_YEARS);
  results.push({
    id: "cagr",
    label: "CAGR reproduces terminal value",
    pass: Math.abs(back / METRICS.terminal.active - 1) < 0.001,
    detail: `${METRICS.cagr.active.toFixed(2)}% over ${PERIOD_YEARS} yrs → ₹${Math.round(back).toLocaleString("en-US")}`,
  });

  const perf = generateTimeSeries().performance;
  const pe = perf[perf.length - 1];
  const tgt = (k: "active" | "passive" | "benchmark") => METRICS.terminal[k] / INITIAL_CAPITAL * 100;
  results.push({
    id: "paths",
    label: "Chart end points = tear-sheet terminal values",
    pass:
      !!pe &&
      Math.abs(pe.activePortfolio - tgt("active")) < 0.5 &&
      Math.abs(pe.passivePortfolio - tgt("passive")) < 0.5 &&
      Math.abs(pe.benchmarkNiftyBank - tgt("benchmark")) < 0.5,
    detail: pe
      ? `Active ${pe.activePortfolio.toFixed(1)} / ${tgt("active").toFixed(1)} · Passive ${pe.passivePortfolio.toFixed(1)} / ${tgt("passive").toFixed(1)} · Nifty Bank ${pe.benchmarkNiftyBank.toFixed(1)} / ${tgt("benchmark").toFixed(1)}`
      : "no data",
  });

  const last = HDFC_FUNDAMENTALS[HDFC_FUNDAMENTALS.length - 1];
  const hdfc = BANKING_PEERS[0];
  results.push({
    id: "ratios",
    label: "Peer-table ratios match FY25E fundamentals",
    pass: hdfc.roe === last.roe && hdfc.nim === last.nim && hdfc.gnpa === last.gnpa,
    detail: `ROE ${hdfc.roe}/${last.roe} · NIM ${hdfc.nim}/${last.nim} · GNPA ${hdfc.gnpa}/${last.gnpa}`,
  });

  results.push({
    id: "mcap",
    label: "Market cap = price × shares",
    pass: hdfc.marketCapCr === MARKET_CAP_CR,
    detail: `₹${MARKET_SNAPSHOT.price.toFixed(2)} × ${MARKET_SNAPSHOT.sharesOutstandingCr.toLocaleString("en-US")} Cr shares = ₹${MARKET_CAP_CR.toLocaleString("en-IN")} Cr`,
  });

  return results;
}