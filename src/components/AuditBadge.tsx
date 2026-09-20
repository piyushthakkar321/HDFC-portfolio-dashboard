"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";

export type ClassificationType =
  | "HISTORICAL_OBSERVATION"
  | "CALCULATED_METRIC"
  | "SCENARIO_ASSUMPTION"
  | "INTERPRETATION";

interface AuditBadgeProps {
  type: ClassificationType;
  showTooltip?: boolean;
  size?: "sm" | "xs";
  customText?: string;
}

const BADGE_CONFIG: Record<
  ClassificationType,
  { label: string; code: string; bg: string; text: string; border: string; desc: string }
> = {
  HISTORICAL_OBSERVATION: {
    label: "Historical Observation",
    code: "HIST",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
    desc: "Unmodified factual data derived directly from Audited Financial Statements, RBI DBIE statistical returns, or NSE/BSE official exchange trade archives.",
  },
  CALCULATED_METRIC: {
    label: "Calculated Metric",
    code: "CALC",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    desc: "Deterministically computed metric using verified formulas (e.g., Sharpe, Beta, Jensen's Alpha, Tracking Error, DuPont ROE, 200 DMA) from underlying factual series.",
  },
  SCENARIO_ASSUMPTION: {
    label: "Scenario Assumption",
    code: "SCEN",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    desc: "Forward-looking simulation parameter (e.g., credit growth rate, NIM trajectory, credit cost bps, exit multiple) configured for stress testing and sensitivity modeling.",
  },
  INTERPRETATION: {
    label: "Institutional Interpretation",
    code: "INTP",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    desc: "Qualitative expert analysis and opinion from the Investment Committee or Equity Research Analyst. Fiduciary disclaimer applies.",
  },
};

export const AuditBadge: React.FC<AuditBadgeProps> = ({
  type,
  showTooltip = true,
  size = "xs",
  customText,
}) => {
  const [open, setOpen] = useState(false);
  const cfg = BADGE_CONFIG[type] || BADGE_CONFIG.CALCULATED_METRIC;

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider font-semibold border rounded ${
          cfg.bg
        } ${cfg.text} ${cfg.border} ${
          size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"
        } transition-colors hover:brightness-95 cursor-help`}
        title={cfg.desc}
      >
        <span>{customText || cfg.code}</span>
        {showTooltip && <Info className="w-2.5 h-2.5 opacity-60" />}
      </button>

      {open && (
        <div className="absolute z-50 bottom-full left-0 mb-1.5 w-64 p-2.5 bg-slate-900 text-slate-100 text-xs rounded shadow-xl border border-slate-700 pointer-events-none">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-700 text-[11px] font-bold text-slate-300">
            <span>{cfg.label}</span>
            <span className="font-mono text-[9px] px-1 bg-slate-800 rounded">
              [{cfg.code}]
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">{cfg.desc}</p>
        </div>
      )}
    </div>
  );
};
