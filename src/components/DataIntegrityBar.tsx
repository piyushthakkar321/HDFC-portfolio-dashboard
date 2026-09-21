"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";
import { dataThrough } from "@/data/hdfcData";
import { MARKET_SNAPSHOT } from "@/data/marketSnapshot";
import { runReconciliationChecks } from "@/data/reconciliation";
import { BadgeLegend } from "./BadgeLegend";

interface DataIntegrityBarProps {
  benchmark: "NIFTY_BANK" | "NIFTY_50";
}

type Tone = "ok" | "warn" | "info";
const TONE: Record<Tone, string> = {
  ok: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warn: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-cyan-200 bg-cyan-50 text-cyan-800",
};

const LINEAGE: { name: string; path: string }[] = [
  { name: "Price", path: "MARKET_SNAPSHOT (static constant) → header, peer table, scenario engine, technical series anchor, mandate scorecard" },
  { name: "Technical series", path: "Deterministic simulation → rescaled so last close = reference price → 20/50/200 DMA, RSI, MACD computed in code" },
  { name: "Portfolio performance", path: "Illustrative inputs in metrics.ts (terminal values, volatility, beta, tracking error) → CAGR, Sharpe, Treynor, Sortino, IR, alpha bridge derived" },
  { name: "Financials FY20–FY24", path: "Entered from company annual reports in hdfcData.ts → ratios and DuPont recomputed and checked" },
  { name: "FY25E", path: "Model estimate in hdfcData.ts, shown shaded and labelled EST; not audited" },
];

const CORPORATE_ACTIONS: { series: string; treatment: string; note: string }[] = [
  { series: "Per-share series (EPS, BVPS, price, moving averages)", treatment: "Adjusted for the 1:1 bonus (factor 0.5)", note: "Ex-date 26 Aug 2025" },
  { series: "Absolute series (NII, PAT, advances, deposits)", treatment: "Not adjusted", note: "As reported" },
  { series: "FY24 onward", treatment: "Includes the HDFC Ltd amalgamation", note: "Effective 1 Jul 2023, break in series" },
  { series: "Dividend per share", treatment: "Mixed basis in source data", note: "FY20–FY24 as declared, FY25E post-bonus (open item)" },
];

export const DataIntegrityBar: React.FC<DataIntegrityBarProps> = ({ benchmark }) => {
  const [open, setOpen] = useState(false);
  const checks = useMemo(() => runReconciliationChecks(), []);
  const passed = checks.filter((c) => c.pass).length;
  const allPass = passed === checks.length;
  const comparator = benchmark === "NIFTY_BANK" ? "Nifty Bank" : "Nifty 50";

  const chips: { label: string; value: string; tone: Tone }[] = [
    { label: "Price", value: `₹${MARKET_SNAPSHOT.price.toFixed(2)} · ${MARKET_SNAPSHOT.status === "LIVE" ? "LIVE" : "STATIC"}`, tone: MARKET_SNAPSHOT.status === "LIVE" ? "ok" : "warn" },
    { label: "Technical series", value: `Simulated · through ${dataThrough()}`, tone: "info" },
    { label: "Financials", value: "FY20–FY24 reported · FY25E estimate", tone: "warn" },
    { label: "Performance", value: "Illustrative model inputs", tone: "info" },
    { label: "Benchmark", value: `Mandate: Nifty Bank · chart comparator: ${comparator}`, tone: "ok" },
    { label: "Checks", value: `${passed}/${checks.length} reconciled`, tone: allPass ? "ok" : "warn" },
  ];

  return (
    <section
      aria-label="Data integrity"
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          {allPass ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <ShieldAlert className="h-4 w-4 text-amber-600" />}
          <span>Data integrity</span>
          <span className="text-xs font-normal text-slate-500">{MARKET_SNAPSHOT.statusLabel}</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
        >
          {open ? "Hide details" : "Lineage, checks & legend"}
          {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
        {chips.map((c) => (
          <span key={c.label} className={`rounded-lg border px-2.5 py-1 ${TONE[c.tone]}`}>
            <span className="font-semibold">{c.label}:</span> {c.value}
          </span>
        ))}
      </div>

      {open && (
        <div className="mt-4 space-y-5 border-t border-slate-200 pt-4 text-xs">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <h4 className="mb-2 font-bold text-slate-900">Reconciliation checks (computed on load)</h4>
              <ul className="space-y-1.5">
                {checks.map((c) => (
                  <li key={c.id} className="flex items-start gap-2">
                    <span className={`mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${c.pass ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                      {c.pass ? "PASS" : "FAIL"}
                    </span>
                    <span>
                      <span className="font-semibold text-slate-800">{c.label}.</span>{" "}
                      <span className="text-slate-500">{c.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-bold text-slate-900">Data lineage</h4>
              <ul className="space-y-1.5">
                {LINEAGE.map((l) => (
                  <li key={l.name}>
                    <span className="font-semibold text-slate-800">{l.name}:</span>{" "}
                    <span className="text-slate-500">{l.path}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-slate-900">Corporate action treatment</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-100 text-[11px] uppercase text-slate-700">
                    <th className="px-3 py-2">Series</th>
                    <th className="px-3 py-2">Treatment</th>
                    <th className="px-3 py-2">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {CORPORATE_ACTIONS.map((r) => (
                    <tr key={r.series}>
                      <td className="px-3 py-2 font-semibold text-slate-800">{r.series}</td>
                      <td className="px-3 py-2 text-slate-600">{r.treatment}</td>
                      <td className="px-3 py-2 text-slate-500">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-bold text-slate-900">Badge legend</h4>
            <BadgeLegend />
          </div>
        </div>
      )}
    </section>
  );
};