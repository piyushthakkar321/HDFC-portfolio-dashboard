"use client";

import React from "react";
import { ShieldCheck, Download } from "lucide-react";
import { AuditBadge } from "./AuditBadge";
import { ThemeToggle } from "./ThemeToggle";

export type DashboardTab =
  | "executive"
  | "fundamental"
  | "technical"
  | "active"
  | "passive"
  | "active_vs_passive"
  | "scenarios"
  | "methodology"
  | "architectural_audit";

interface HeaderProps {
  benchmark: "NIFTY_BANK" | "NIFTY_50";
  setBenchmark: (bm: "NIFTY_BANK" | "NIFTY_50") => void;
  capitalBase: number;
  setCapitalBase: (cap: number) => void;
  onExport: () => void;
  onOpenAuditModal: () => void;
}

const STATS: { label: string; value: React.ReactNode; sub: string; subClass?: string }[] = [
  { label: "52-week range", value: "₹681.90 — ₹1,020.50", sub: "Bonus adjusted" },
  { label: "Market cap", value: "₹11,26,450 Cr", sub: "~$135.2 Bn USD" },
  { label: "Valuation", value: "P/E 15.97x · P/B 2.12x", sub: "5Y avg P/B 3.10x" },
  { label: "Key ratios", value: "NIM 3.52% · ROE 15.10%", sub: "GNPA 1.25%", subClass: "text-emerald-600" },
  {
    label: "Mandate weights",
    value: (
      <>
        <span className="text-blue-700">Active 34.0%</span> · <span>Passive 29.5%</span>
      </>
    ),
    sub: "Tactical tilt +450 bps",
    subClass: "text-emerald-600",
  },
];

const pill =
  "flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-[11px]";

export const Header: React.FC<HeaderProps> = ({
  benchmark,
  setBenchmark,
  capitalBase,
  setCapitalBase,
  onExport,
  onOpenAuditModal,
}) => {
  return (
    <>
      {/* Control bar (stays visible while scrolling) */}
      <div className="topbar sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-xs lg:px-6">
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-200">BFSI Alpha & Mandate Analytics</span>
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Audited data feeds active
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <label className={pill}>
            <span className="text-slate-400">Benchmark</span>
            <select
              value={benchmark}
              onChange={(e) => setBenchmark(e.target.value as "NIFTY_BANK" | "NIFTY_50")}
              className="cursor-pointer bg-transparent font-semibold text-white outline-none"
            >
              <option value="NIFTY_BANK" className="bg-slate-800 text-white">Nifty Bank (29.45%)</option>
              <option value="NIFTY_50" className="bg-slate-800 text-white">Nifty 50 (11.20%)</option>
            </select>
          </label>

          <label className={pill}>
            <span className="text-slate-400">Capital</span>
            <select
              value={capitalBase}
              onChange={(e) => setCapitalBase(Number(e.target.value))}
              className="cursor-pointer bg-transparent font-semibold text-white outline-none"
            >
              <option value={10000000} className="bg-slate-800 text-white">₹10,000,000 (Mandate)</option>
              <option value={1} className="bg-slate-800 text-white">₹1.00 (Normalized)</option>
              <option value={100000000} className="bg-slate-800 text-white">₹100,000,000 (Book)</option>
            </select>
          </label>

          <button
            onClick={onExport}
            title="Export institutional tear sheet"
            className={`${pill} font-semibold text-slate-100 transition hover:bg-white/20`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export tear sheet</span>
          </button>

          <button
            onClick={onOpenAuditModal}
            title="View the 4-tier audit classification rules"
            className={`${pill} border-blue-400/40 bg-blue-500/20 font-semibold text-blue-100 transition hover:bg-blue-500/30`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Audit rules</span>
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* Instrument snapshot */}
      <section className="snapshot flex flex-wrap items-center justify-between gap-x-10 gap-y-4 px-4 py-5 lg:px-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[1.4rem] font-bold tracking-tight text-slate-900">HDFC Bank Limited</h1>
            <span className="rounded-md bg-slate-200 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-800">
              NSE: HDFCBANK
            </span>
            <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[11px] font-semibold text-blue-800">
              Large-cap BFSI
            </span>
            <AuditBadge type="HISTORICAL_OBSERVATION" customText="HIST" />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
            <span className="font-mono">ISIN INE040A01034</span>
            <span className="font-mono">Bloomberg HDFCB:IN</span>
            <span className="text-slate-600">Post-merger amalgamation · 1:1 bonus adjusted (Aug 2025)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-xs">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500">Last traded price</span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[1.65rem] font-bold leading-tight tracking-tight text-slate-900">
                ₹731.00
              </span>
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-emerald-700">
                +18.00 (+2.52%)
              </span>
            </div>
          </div>

          {STATS.map((s) => (
            <div key={s.label} className="border-l border-slate-200 pl-6">
              <span className="block text-[10px] uppercase tracking-wider text-slate-500">{s.label}</span>
              <span className="font-mono font-semibold text-slate-800">{s.value}</span>
              <span className={`block text-[10px] ${s.subClass ?? "text-slate-400"}`}>{s.sub}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};