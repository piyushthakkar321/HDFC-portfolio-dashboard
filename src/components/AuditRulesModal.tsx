"use client";

import React, { useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";
import { AuditBadge, ClassificationType } from "./AuditBadge";

interface AuditRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIERS: {
  title: string;
  type: ClassificationType;
  code: string;
  definition: string;
  examples: string;
  box: string;
  titleClass: string;
}[] = [
  {
    title: "1. Historical Observation",
    type: "HISTORICAL_OBSERVATION",
    code: "HIST",
    definition:
      "Objective factual data derived without transformation from statutory filings, company annual reports (FY20-FY24), quarterly earnings releases, Reserve Bank of India DBIE publications, or official NSE trade archives.",
    examples: "Examples: FY24 NII (₹1,08,533 Cr), FY24 PAT (₹60,812 Cr), Actual GNPA (1.24%), Closing Price (see header; static input in FROZEN mode).",
    box: "bg-slate-50 border-slate-200",
    titleClass: "text-slate-900",
  },
  {
    title: "2. Calculated Metric",
    type: "CALCULATED_METRIC",
    code: "CALC",
    definition:
      "Quantitative metrics derived deterministically from historical facts using published mathematical and econometric equations. All calculations use actual underlying series.",
    examples: "Examples: Sharpe Ratio (0.66 using Rf = 6.80%), Jensen's Alpha (+2.18% p.a.), 200 DMA (₹708.20), DuPont ROE decomposition.",
    box: "bg-blue-50 border-blue-200",
    titleClass: "text-blue-950",
  },
  {
    title: "3. Scenario Assumption",
    type: "SCENARIO_ASSUMPTION",
    code: "SCEN",
    definition:
      "User-controlled or analyst-defined input parameters configured for forward-looking sensitivity, stress testing, and capital modeling. These do not represent audited facts.",
    examples: "Examples: Forward Loan Growth (14.5%), NIM assumption (3.55%), Credit Cost slippage (45 bps), Exit P/B Multiple (2.45x).",
    box: "bg-amber-50 border-amber-200",
    titleClass: "text-amber-950",
  },
  {
    title: "4. Institutional Interpretation",
    type: "INTERPRETATION",
    code: "INTP",
    definition:
      "Professional subjective assessments, research notes, and mandate recommendations formulated by equity research analysts and investment committee members.",
    examples: "Examples: OVERWEIGHT recommendation, qualitative commentary on mortgage cross-sell accretion, liquidity re-pricing lags.",
    box: "bg-purple-50 border-purple-200",
    titleClass: "text-purple-950",
  },
  {
    title: "5. Estimate",
    type: "ESTIMATE",
    code: "EST",
    definition:
      "Forward-looking or consensus figures such as FY25E. They are model estimates and have not been audited or reported by the company.",
    examples: "Examples: FY25E NII, PAT, EPS, BVPS and the ratios built on them.",
    box: "bg-orange-50 border-orange-200",
    titleClass: "text-orange-900",
  },
  {
    title: "6. Simulated / Illustrative",
    type: "SIMULATED",
    code: "SIM",
    definition:
      "Deterministic simulation output and illustrative model inputs: the daily price path, RSI, MACD, moving averages, portfolio paths and the ratios derived from the illustrative return inputs. Not an audited NAV or exchange record.",
    examples: "Examples: Technical Analysis charts, growth-of-capital chart, CAGR, Sharpe, IR in the tear sheet.",
    box: "bg-cyan-50 border-cyan-200",
    titleClass: "text-cyan-900",
  },
];

export const AuditRulesModal: React.FC<AuditRulesModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Data classification taxonomy"
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-300 bg-white p-6 text-xs shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-700" />
            <h3 className="text-sm font-bold tracking-wide text-slate-900">
              Data Classification Standard
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-4 font-sans leading-relaxed text-slate-600">
          To eliminate ambiguity and prevent unsupported claims, every analytical component across this software is
          classified according to the following mandatory taxonomy:
        </p>

        <div className="space-y-4">
          {TIERS.map((t) => (
            <div key={t.code} className={`space-y-1.5 rounded-lg border p-3.5 ${t.box}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${t.titleClass}`}>{t.title}</span>
                <AuditBadge type={t.type} customText={t.code} />
              </div>
              <p className="font-sans leading-relaxed text-slate-600">
                <strong>Definition:</strong> {t.definition}
              </p>
              <div className="font-mono text-[11px] text-slate-500">{t.examples}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end border-t border-slate-200 pt-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gradient-to-br from-blue-700 to-indigo-700 px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            Acknowledge governance standard
          </button>
        </div>
      </div>
    </div>
  );
};