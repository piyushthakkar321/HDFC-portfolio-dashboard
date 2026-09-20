"use client";

import React from "react";
import {
  TrendingUp,
  ShieldCheck,
  Building2,
  SlidersHorizontal,
  FileSpreadsheet,
  Layers,
  BarChart3,
  Scale,
  Compass,
  FileText,
  Download,
} from "lucide-react";
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
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  benchmark: "NIFTY_BANK" | "NIFTY_50";
  setBenchmark: (bm: "NIFTY_BANK" | "NIFTY_50") => void;
  capitalBase: number;
  setCapitalBase: (cap: number) => void;
  onExport: () => void;
  onOpenAuditModal: () => void;
}

const TABS = [
  { id: "executive", label: "Executive Overview", icon: Building2 },
  { id: "fundamental", label: "Fundamental Analysis", icon: BarChart3 },
  { id: "technical", label: "Technical Analysis", icon: TrendingUp },
  { id: "active", label: "Active Strategy", icon: Compass },
  { id: "passive", label: "Passive Strategy", icon: Layers },
  { id: "active_vs_passive", label: "Active vs Passive", icon: Scale },
  { id: "scenarios", label: "Scenario Analysis", icon: SlidersHorizontal },
  { id: "methodology", label: "Methodology & Audit", icon: FileText },
  { id: "architectural_audit", label: "Architectural Extraction", icon: FileSpreadsheet },
] as const;

const STATS: { label: string; value: React.ReactNode; sub: string; subClass?: string }[] = [
  { label: "52-Week Range", value: "₹681.90 — ₹1,020.50", sub: "Bonus adjusted" },
  { label: "Market Cap", value: "₹11,26,450 Cr", sub: "~$135.2 Bn USD" },
  { label: "Valuation", value: "P/E 15.97x · P/B 2.12x", sub: "5Y avg P/B 3.10x" },
  { label: "Key Ratios", value: "NIM 3.52% · ROE 15.10%", sub: "GNPA 1.25%", subClass: "text-emerald-600" },
  {
    label: "Mandate Weights",
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
  "flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2 py-1 text-[11px]";

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  benchmark,
  setBenchmark,
  capitalBase,
  setCapitalBase,
  onExport,
  onOpenAuditModal,
}) => {
  return (
    <header className="app-header sticky top-0 z-40">
      {/* Control bar */}
      <div className="topbar flex flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-white">
            <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-blue-400 to-indigo-500" />
            <span className="text-sm font-semibold tracking-wide">Apex Institutional Asset Management</span>
          </div>
          <span className="hidden text-slate-500 md:inline">|</span>
          <span className="hidden font-medium text-slate-300 md:inline">BFSI Alpha & Mandate Analytics</span>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span>Audited data feeds active</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
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
            <Download className="h-3 w-3" />
            <span>Export tear sheet</span>
          </button>

          <button
            onClick={onOpenAuditModal}
            title="View the 4-tier audit classification rules"
            className={`${pill} border-blue-400/40 bg-blue-500/20 font-semibold text-blue-100 transition hover:bg-blue-500/30`}
          >
            <ShieldCheck className="h-3 w-3" />
            <span>Audit rules</span>
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* Instrument snapshot */}
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-3.5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-900">HDFC Bank Limited</h1>
            <span className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-800">
              NSE: HDFCBANK
            </span>
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[11px] font-semibold text-blue-800">
              Large-cap BFSI
            </span>
            <AuditBadge type="HISTORICAL_OBSERVATION" customText="HIST" />
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 font-mono text-xs text-slate-500">
            <span>ISIN INE040A01034</span>
            <span>Bloomberg HDFCB:IN</span>
            <span className="font-sans text-slate-600">Post-merger amalgamation · 1:1 bonus adjusted (Aug 2025)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs">
          <div className="pr-2">
            <span className="block font-sans text-[10px] uppercase tracking-wider text-slate-500">
              Last traded price
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900">₹731.00</span>
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                +18.00 (+2.52%)
              </span>
            </div>
          </div>

          {STATS.map((s) => (
            <div key={s.label} className="border-l border-slate-200 pl-5">
              <span className="block font-sans text-[10px] uppercase tracking-wider text-slate-500">{s.label}</span>
              <span className="font-semibold text-slate-800">{s.value}</span>
              <span className={`block font-sans text-[10px] ${s.subClass ?? "text-slate-400"}`}>{s.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Module navigation */}
      <nav
        role="tablist"
        aria-label="Dashboard modules"
        className="no-scrollbar flex items-center gap-1 overflow-x-auto border-t border-slate-200 px-4 py-2"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              className="tab"
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {tab.id === "architectural_audit" && (
                <span className="rounded bg-amber-100 px-1.5 font-mono text-[10px] font-bold text-amber-900">
                  6-step spec
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};