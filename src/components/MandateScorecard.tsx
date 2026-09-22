"use client";

import React from "react";
import { AuditBadge } from "./AuditBadge";
import { BANKING_PEERS, HDFC_FUNDAMENTALS, dataThrough, generateTimeSeries } from "@/data/hdfcData";
import { MARKET_SNAPSHOT } from "@/data/marketSnapshot";
import { COMPLIANCE } from "@/data/compliance";

type Signal = "PASS" | "NEUTRAL" | "FAIL";

interface Factor {
  factor: string;
  current: string;
  rule: string;
  signal: Signal;
  weight: number;
}

const CREDIT: Record<Signal, number> = { PASS: 1, NEUTRAL: 0.5, FAIL: 0 };
const CHIP: Record<Signal, string> = {
  PASS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  NEUTRAL: "bg-amber-50 text-amber-800 border-amber-200",
  FAIL: "bg-rose-50 text-rose-700 border-rose-200",
};

function buildFactors(): Factor[] {
  const fy = HDFC_FUNDAMENTALS[HDFC_FUNDAMENTALS.length - 1];
  const hdfc = BANKING_PEERS[0];
  const tech = generateTimeSeries().technical;
  const rsi = tech[tech.length - 1]?.rsi ?? 50;

  return [
    { factor: "P/B ratio", current: `${hdfc.pbRatio.toFixed(2)}x`, rule: `< 2.50x (margin ${(2.5 - hdfc.pbRatio).toFixed(2)}x)`, signal: hdfc.pbRatio < 2.5 ? "PASS" : "FAIL", weight: 25 },
    { factor: "ROE (FY25E)", current: `${fy.roe.toFixed(2)}%`, rule: `> 14.00% (margin ${(fy.roe - 14).toFixed(2)} pp)`, signal: fy.roe > 14 ? "PASS" : "FAIL", weight: 25 },
    { factor: "Gross NPA (FY25E)", current: `${fy.gnpa.toFixed(2)}%`, rule: `< 1.50% (margin ${(1.5 - fy.gnpa).toFixed(2)} pp)`, signal: fy.gnpa < 1.5 ? "PASS" : "FAIL", weight: 20 },
    { factor: "NIM (FY25E)", current: `${fy.nim.toFixed(2)}%`, rule: `> 3.50% (margin ${(fy.nim - 3.5).toFixed(2)} pp)`, signal: fy.nim > 3.5 ? "PASS" : "FAIL", weight: 15 },
    {
      factor: "RSI (14, simulated series)",
      current: rsi.toFixed(1),
      rule: "40–70 = neutral (half credit)",
      signal: rsi >= 40 && rsi <= 70 ? "NEUTRAL" : "FAIL",
      weight: 10,
    },
    {
      factor: "1-day price change (short-term overlay)",
      current: `${MARKET_SNAPSHOT.changePct >= 0 ? "+" : "−"}${Math.abs(MARKET_SNAPSHOT.changePct).toFixed(2)}%`,
      rule: "> 0%",
      signal: MARKET_SNAPSHOT.changePct > 0 ? "PASS" : "FAIL",
      weight: 5,
    },
  ];
}

export const MandateScorecard: React.FC = () => {
  const factors = buildFactors();
  const score = factors.reduce((sum, f) => sum + f.weight * CREDIT[f.signal], 0);
  const rating = score >= 70 ? "OVERWEIGHT" : score >= 40 ? "EQUAL WEIGHT" : "UNDERWEIGHT";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Illustrative rule score (not validated)
            </h3>
            <AuditBadge type="INTERPRETATION" />
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            The recommendation is produced by the rules below. Thresholds are analyst-set illustrations, not calibrated
            or back-tested.
          </p>
        </div>
        <div className="text-right">
          <span className="block text-[10px] uppercase tracking-wider text-slate-500">Illustrative rule score</span>
          <span className="font-mono text-lg font-bold text-slate-900">{score.toFixed(1)} / 100</span>
          <span className="ml-2 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-800">
            {rating}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-100 text-[11px] uppercase text-slate-700">
              <th className="px-3 py-2">Factor</th>
              <th className="px-3 py-2 text-right">Current</th>
              <th className="px-3 py-2">Rule</th>
              <th className="px-3 py-2 text-center">Signal</th>
              <th className="px-3 py-2 text-right">Weight</th>
              <th className="px-3 py-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono">
            {factors.map((f) => (
              <tr key={f.factor}>
                <td className="px-3 py-2 font-sans font-semibold text-slate-900">{f.factor}</td>
                <td className="px-3 py-2 text-right font-bold text-slate-900">{f.current}</td>
                <td className="px-3 py-2 font-sans text-slate-600">{f.rule}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${CHIP[f.signal]}`}>{f.signal}</span>
                </td>
                <td className="px-3 py-2 text-right text-slate-600">{f.weight}%</td>
                <td className="px-3 py-2 text-right font-semibold text-slate-800">{(f.weight * CREDIT[f.signal]).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 md:grid-cols-2">
        <div>
          <strong className="text-slate-800">Rule set:</strong> {COMPLIANCE.modelVersion}. PASS = full weight, NEUTRAL = half,
          FAIL = zero. ≥ 70 Overweight · 40–70 Equal weight · &lt; 40 Underweight.
        </div>
        <div>
          <strong className="text-slate-800">Scope:</strong> horizon 36 months · benchmark Nifty Bank · price inputs from the
          reference snapshot · technical inputs simulated through {dataThrough()}.
        </div>
        <div className="md:col-span-2">
          <strong className="text-slate-800">Invalidation:</strong> the OVERWEIGHT call lapses if the composite score falls
          below 70, gross NPA reaches 1.50% or above, or ROE falls to 14.00% or below.
        </div>
      </div>
    </div>
  );
};