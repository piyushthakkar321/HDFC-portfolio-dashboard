import { INSTITUTIONAL_TEARSHEET, HDFC_FUNDAMENTALS } from "@/data/hdfcData";

export function exportTearSheetCsv() {
  const rows = [
    ["INSTITUTIONAL PERFORMANCE & METRICS TEAR SHEET — HDFC BANK MANDATE"],
    ["Generated on: " + new Date().toISOString()],
    ["Mandate: Active vs Passive Portfolio Management (BFSI Alpha)"],
    ["Benchmark: Nifty Bank Index | Indian Sovereign Benchmark Rf = 6.80%"],
    [],
    [
      "Performance Dimension",
      "Category",
      "Active Strategy",
      "Passive Strategy",
      "Benchmark (Nifty Bank)",
      "Active Delta",
      "Classification Tag",
      "Mathematical Definition",
    ],
  ];

  INSTITUTIONAL_TEARSHEET.forEach((item) => {
    rows.push([
      `"${item.metric}"`,
      `"${item.category}"`,
      `"${item.activeStrategy}"`,
      `"${item.passiveStrategy}"`,
      `"${item.benchmarkNiftyBank}"`,
      `"${item.deltaVsPassive}"`,
      `"${item.badge}"`,
      `"${item.formulaExplanation.replace(/"/g, '""')}"`,
    ]);
  });

  rows.push([]);
  rows.push(["AUDITED HISTORICAL FUNDAMENTAL SUMMARY (FY20 - FY24)"]);
  rows.push([
    "Fiscal Year",
    "Net Interest Income (Cr)",
    "Operating Profit PPOP (Cr)",
    "Net Profit PAT (Cr)",
    "Diluted EPS (Bonus Adj)",
    "BVPS (Bonus Adj)",
    "NIM %",
    "ROE %",
    "ROA %",
    "Gross NPA %",
    "Net NPA %",
    "Total CAR %",
  ]);

  HDFC_FUNDAMENTALS.forEach((f) => {
    rows.push([
      `"${f.fiscalYear}"`,
      f.nii.toString(),
      f.ppop.toString(),
      f.pat.toString(),
      f.eps.toFixed(2),
      f.bvps.toFixed(2),
      f.nim.toFixed(2),
      f.roe.toFixed(2),
      f.roa.toFixed(2),
      f.gnpa.toFixed(2),
      f.nnpa.toFixed(2),
      f.totalCar.toFixed(2),
    ]);
  });

  const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `HDFC_Bank_Institutional_TearSheet_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
