import { INSTITUTIONAL_TEARSHEET, HDFC_FUNDAMENTALS, dataThrough } from "@/data/hdfcData";
import { MARKET_SNAPSHOT } from "@/data/marketSnapshot";
import { COMPLIANCE } from "@/data/compliance";

const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export function exportTearSheetCsv() {
  const rows: string[][] = [
    ["PERFORMANCE & METRICS TEAR SHEET — HDFC BANK MANDATE (ILLUSTRATIVE)"],
    ["Generated on: " + new Date().toISOString()],
    ["Mandate benchmark: Nifty Bank Index (all deltas are versus Nifty Bank unless stated)"],
    [`Data status: ${MARKET_SNAPSHOT.statusLabel}; technical series simulated through ${dataThrough()}`],
    [COMPLIANCE.gipsStatement],
    [COMPLIANCE.riskFreeSource],
    [],
    ["Performance Dimension", "Category", "Active Strategy", "Passive Strategy", "Benchmark (Nifty Bank)", "Active Delta", "Classification Tag", "Definition / Basis"],
  ];

  INSTITUTIONAL_TEARSHEET.forEach((item) => {
    rows.push([
      q(item.metric),
      q(item.category),
      q(item.activeStrategy),
      q(item.passiveStrategy),
      q(item.benchmarkNiftyBank),
      q(item.deltaVsPassive),
      q(item.badge),
      q(item.formulaExplanation),
    ]);
  });

  rows.push([]);
  rows.push(["HISTORICAL FINANCIALS (FY20–FY24 reported; FY25E = model estimate, not audited)"]);
  rows.push([
    "Fiscal Year", "Status", "Net Interest Income (Cr)", "Operating Profit PPOP (Cr)", "Net Profit PAT (Cr)",
    "Diluted EPS (Bonus Adj)", "BVPS (Bonus Adj)", "NIM %", "ROE %", "ROA %", "Gross NPA %", "Net NPA %", "Total CAR %",
  ]);

  HDFC_FUNDAMENTALS.forEach((f) => {
    rows.push([
      q(f.fiscalYear),
      q(f.fiscalYear.endsWith("E") ? "Estimate" : "Reported"),
      f.nii.toString(), f.ppop.toString(), f.pat.toString(),
      f.eps.toFixed(2), f.bvps.toFixed(2), f.nim.toFixed(2), f.roe.toFixed(2),
      f.roa.toFixed(2), f.gnpa.toFixed(2), f.nnpa.toFixed(2), f.totalCar.toFixed(2),
    ]);
  });

  const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent).replace(/#/g, "%23"));
  link.setAttribute("download", `HDFC_Bank_TearSheet_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}