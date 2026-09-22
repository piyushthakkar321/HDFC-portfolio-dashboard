"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from "recharts";
import {
  FileText,
  TrendingDown,
  Building2,
  DollarSign,
  ShieldCheck,
  Scale,
  Percent,
  CheckCircle,
  HelpCircle,
  Info,
} from "lucide-react";
import { AuditBadge } from "./AuditBadge";
import { dupontProduct } from "@/data/reconciliation";
import { sgn } from "@/data/metrics";
import {
  HDFC_FUNDAMENTALS,
  HDFC_DUPONT,
  BANKING_PEERS,
  BankFundamentalYear,
} from "@/data/hdfcData";

const DUPONT_MAX_VAR = Math.max(...HDFC_DUPONT.map((d) => Math.abs(dupontProduct(d) - d.reportedRoe)));

export const FundamentalAnalysis: React.FC = () => {
  const [selectedPeerCategory, setSelectedPeerCategory] = useState<"ALL" | "Private Sector" | "Public Sector (PSU)">("ALL");
  const [activeTabSub, setActiveTabSub] = useState<"financials" | "dupont" | "peers">("financials");

  const filteredPeers = selectedPeerCategory === "ALL"
    ? BANKING_PEERS
    : BANKING_PEERS.filter((p) => p.category === selectedPeerCategory);

  const isEst = (fy: string) => fy.endsWith("E");

  const revenueData = HDFC_FUNDAMENTALS.map((f) => ({
    year: f.fiscalYear,
    nii: f.nii,
    otherIncome: f.nonInterestIncome,
    totalRevenue: f.netRevenue,
    pat: f.pat,
    ppop: f.ppop,
    ppopAct: isEst(f.fiscalYear) ? null : f.ppop,
    patAct: isEst(f.fiscalYear) ? null : f.pat,
    provisions: f.provisions,
    isEstimate: isEst(f.fiscalYear),
    // Estimate-only series: null for actual years so the dashed "estimate" line
    // only draws across the FY24 -> FY25E segment (FY24 repeated as the anchor point).
    ppopEst: isEst(f.fiscalYear) || f.fiscalYear === "FY24" ? f.ppop : null,
    patEst: isEst(f.fiscalYear) || f.fiscalYear === "FY24" ? f.pat : null,
    provisionsEst: isEst(f.fiscalYear) || f.fiscalYear === "FY24" ? f.provisions : null,
  }));

  const marginAndRatios = HDFC_FUNDAMENTALS.map((f) => ({
    year: f.fiscalYear,
    nim: f.nim,
    roe: f.roe,
    roa: f.roa,
    costToIncome: f.costToIncome,
    isEstimate: isEst(f.fiscalYear),
    nimEst: isEst(f.fiscalYear) || f.fiscalYear === "FY24" ? f.nim : null,
    roaEst: isEst(f.fiscalYear) || f.fiscalYear === "FY24" ? f.roa : null,
  }));

  const epsAndBvps = HDFC_FUNDAMENTALS.map((f) => ({
    year: f.fiscalYear,
    eps: f.eps,
    unadjustedEps: f.unadjustedEps,
    bvps: f.bvps,
    isEstimate: isEst(f.fiscalYear),
  }));

  return (
    <div className="space-y-6">
      {/* Module Title and Navigation Pill Strip */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
              HDFC Bank Fundamental Analysis & Sector Comps
            </h2>
            <AuditBadge type="HISTORICAL_OBSERVATION" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive financial review from FY20 to FY25E. Balance sheet amalgamation effective July 1, 2023. Per-share metrics adjusted for 1:1 August 2025 bonus issue. FY20–FY24 are reported figures; FY25E is a model estimate (not audited).
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-semibold">
          <button
            onClick={() => setActiveTabSub("financials")}
            className={`px-3 py-1.5 rounded transition ${
              activeTabSub === "financials"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            P&L, Margins & Quality
          </button>
          <button
            onClick={() => setActiveTabSub("dupont")}
            className={`px-3 py-1.5 rounded transition ${
              activeTabSub === "dupont"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            DuPont 3-Stage ROE
          </button>
          <button
            onClick={() => setActiveTabSub("peers")}
            className={`px-3 py-1.5 rounded transition ${
              activeTabSub === "peers"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Peer Banking Comps (6 Lenders)
          </button>
        </div>
      </div>

      {activeTabSub === "financials" && (
        <div className="space-y-6">
          {/* Revenue Breakdown & Net Profit Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Net Revenue Composition */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Revenue Composition (NII vs. Other Income)
                    </h3>
                    <AuditBadge type="HISTORICAL_OBSERVATION" />
                  </div>
                  <span className="text-xs text-slate-500">Values in ₹ Crore · FY25E = estimate (not audited)</span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  FY24 Total: ₹1,57,773 Cr (+33.6%)
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val) => `₹${val / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#f8fafc",
                      }}
                      formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")} Cr`]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="nii" name="Net Interest Income (NII)" stackId="a" fill="#1e3a8a">
                      {revenueData.map((d, i) => (
                        <Cell key={i} fillOpacity={d.isEstimate ? 0.45 : 1} stroke={d.isEstimate ? "#1e3a8a" : "none"} strokeDasharray={d.isEstimate ? "3 2" : undefined} />
                      ))}
                    </Bar>
                    <Bar dataKey="otherIncome" name="Non-Interest Income" stackId="a" fill="#38bdf8">
                      {revenueData.map((d, i) => (
                        <Cell key={i} fillOpacity={d.isEstimate ? 0.45 : 1} stroke={d.isEstimate ? "#38bdf8" : "none"} strokeDasharray={d.isEstimate ? "3 2" : undefined} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-3 h-2.5 bg-slate-700 inline-block rounded-xs"></span> Actual (FY20–FY24)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-2.5 bg-slate-700/45 border border-dashed border-slate-500 inline-block rounded-xs"></span> Estimate (FY25E)</span>
              </div>

              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                <strong className="text-slate-800">Analytical Audit:</strong> Non-interest income surged by 57.7% in FY24 due to fee income expansion across retail payments, third-party distribution, and consolidation of HDFC Life, AMC, and ERGO distribution synergies.
              </div>
            </div>

            {/* Profitability Trajectory: PPOP vs Provisions vs PAT */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Operating Profit (PPOP), Provisions & PAT
                    </h3>
                    <AuditBadge type="HISTORICAL_OBSERVATION" />
                  </div>
                  <span className="text-xs text-slate-500">Values in ₹ Crore · FY25E = estimate (not audited)</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  FY24 PAT: ₹60,812 Cr (+37.9%)
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val) => `₹${val / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#f8fafc",
                      }}
                      formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")} Cr`]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Line type="monotone" dataKey="ppopAct" name="PPOP (Operating Profit)" stroke="#1d4ed8" strokeWidth={2.5} connectNulls={false} />
                    <Line type="monotone" dataKey="ppopEst" name="PPOP (FY25E estimate)" stroke="#1d4ed8" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} legendType="none" />
                    <Line type="monotone" dataKey="patAct" name="Net Profit (PAT)" stroke="#059669" strokeWidth={2.5} connectNulls={false} />
                    <Line type="monotone" dataKey="patEst" name="PAT (FY25E estimate)" stroke="#059669" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} legendType="none" />
                    <Line type="monotone" dataKey="provisions" name="Provisions" stroke="#dc2626" strokeWidth={1.5} strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-[10px] text-slate-500">Dashed segment = FY25E estimate, not audited.</div>

              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                <strong className="text-slate-800">Analytical Audit:</strong> FY24 provisions included ₹10,900 Cr of floating / contingent provisions recorded at the merger. Provisions fell in FY25E (₹22,100 Cr).
              </div>
            </div>
          </div>

          {/* Margins & Return Ratios Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NIM & Return Ratios */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Net Interest Margin (NIM) & ROA Trajectory
                    </h3>
                    <AuditBadge type="CALCULATED_METRIC" />
                  </div>
                  <span className="text-xs text-slate-500">Margin transition post-merger integration · FY25E = estimate</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  NIM Reset: 4.10% → 3.52%
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marginAndRatios} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[1.0, 5.0]} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#f8fafc",
                      }}
                      formatter={(val: any) => [`${val}%`]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Line type="monotone" dataKey="nim" name="NIM (Total Assets %)" stroke="#d97706" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="roa" name="Return on Assets (ROA %)" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                <strong className="text-slate-800">Structural Transition:</strong> NIM contracted from ~4.10% pre-merger to 3.44% in FY24 due to the inclusion of lower-yielding mortgage loans and statutory cash reserve (CRR/SLR) requirements on merged HDFC Ltd liabilities. As wholesale debt matures and gets replaced with CASA, NIM is projected to gradually expand to 3.65%-3.75%.
              </div>
            </div>

            {/* Per-Share Compounding: EPS & Book Value Per Share */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      EPS & Book Value Per Share (Bonus Adjusted)
                    </h3>
                    <AuditBadge type="CALCULATED_METRIC" />
                  </div>
                  <span className="text-xs text-slate-500">
                    Adjusted for 1:1 Bonus Issue in August 2025 · FY25E = estimate
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  BVPS: ₹344.80 (FY25E)
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={epsAndBvps} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#f8fafc",
                      }}
                      formatter={(val: any, name: any) => [`₹${val}`, name]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="bvps" name="Book Value / Share (₹)" fill="#334155" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="eps" name="Diluted EPS (₹, Bonus-Adj)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                <strong className="text-slate-800">Corporate Action Audit:</strong> Pre-bonus FY24 EPS was ₹80.10; adjusted for the 1:1 bonus, it is ₹40.05. BVPS has compounded from ₹158.40 in FY20 to ₹344.80 in FY25E, representing a 16.8% CAGR in tangible net worth per share.
              </div>
            </div>
          </div>

          {/* Full Audited Financial Statement Ledger (FY20 - FY25E) */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Historical Financials (FY20–FY24) & FY25E Estimates
                </h3>
                <AuditBadge type="HISTORICAL_OBSERVATION" />
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Source: Annual Reports FY20-24 & Q3 FY25 disclosures · shaded FY25E column = model estimate, not audited
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="ledger-table w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono uppercase text-[11px]">
                    <th className="py-2 px-3">Metric (₹ Cr / %)</th>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <th key={f.fiscalYear} className="py-2 px-3 text-right">
                        {f.fiscalYear}
                      </th>
                    ))}
                    <th className="py-2 px-3 text-center">5Y CAGR / change (FY20→FY25E)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-slate-800">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold font-sans text-slate-900">
                      Net Interest Income (NII)
                    </td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right">
                        ₹{f.nii.toLocaleString("en-IN")}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">+17.6%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans text-slate-700">Other (Fee) Income</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right">
                        ₹{f.nonInterestIncome.toLocaleString("en-IN")}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">+18.4%</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-slate-50/50 font-semibold">
                    <td className="py-2 px-3 font-sans text-slate-900">Net Revenue</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right text-blue-900">
                        ₹{f.netRevenue.toLocaleString("en-IN")}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">+17.8%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans text-slate-700">Operating Expenses</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right text-slate-600">
                        ₹{f.operatingExpenses.toLocaleString("en-IN")}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-slate-600">+18.1%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans text-slate-700">Operating Profit (PPOP)</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right">
                        ₹{f.ppop.toLocaleString("en-IN")}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">+17.7%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans text-rose-700">Provisions & Contingencies</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right text-rose-700">
                        ₹{f.provisions.toLocaleString("en-IN")}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-slate-600">+12.7%</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-emerald-50/40 font-bold text-slate-900">
                    <td className="py-2 px-3 font-sans text-emerald-900">Net Profit After Tax (PAT)</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right text-emerald-800">
                        ₹{f.pat.toLocaleString("en-IN")}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-emerald-700">+20.9%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans text-slate-700">Diluted EPS (Bonus Adj)</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right">
                        ₹{f.eps.toFixed(2)}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">+13.0%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans text-slate-700">Book Value Per Share (BVPS)</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right">
                        ₹{f.bvps.toFixed(2)}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">+16.8%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans text-slate-700">Gross Advances</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right">
                        ₹{f.advances.toLocaleString("en-IN")}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">+22.9%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans text-slate-700">Total Deposits</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right">
                        ₹{f.deposits.toLocaleString("en-IN")}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">+18.7%</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans text-slate-700">Net Interest Margin (NIM %)</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right">
                        {f.nim.toFixed(2)}%
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-slate-500">-68 bps</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans text-slate-700">Gross NPA (%)</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right text-emerald-700 font-semibold">
                        {f.gnpa.toFixed(2)}%
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">-1 bp</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans text-slate-700">Net NPA (%)</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right text-emerald-700 font-semibold">
                        {f.nnpa.toFixed(2)}%
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-emerald-700 font-bold">-2 bps</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans text-slate-700">Capital Adequacy Ratio (CAR %)</td>
                    {HDFC_FUNDAMENTALS.map((f) => (
                      <td key={f.fiscalYear} className="py-2 px-3 text-right text-blue-900 font-semibold">
                        {f.totalCar.toFixed(2)}%
                      </td>
                    ))}
                    <td className="py-2 px-3 text-right text-blue-700">+128 bps</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTabSub === "dupont" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    DuPont 3-Stage Return on Equity (ROE) Decomposition
                  </h3>
                  <AuditBadge type="CALCULATED_METRIC" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Formula: ROE = Net Profit Margin (PAT / Net Revenue) × Asset Turnover (Net Revenue / Total Assets) × Financial Leverage (Total Assets / Equity)
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Reconciliation: max variance {DUPONT_MAX_VAR.toFixed(2)} pp vs reported ROE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono uppercase text-[11px]">
                    <th className="py-2.5 px-3">Fiscal Year</th>
                    <th className="py-2.5 px-3 text-right">Net Profit Margin (%)</th>
                    <th className="py-2.5 px-3 text-center">×</th>
                    <th className="py-2.5 px-3 text-right">Asset Turnover (%)</th>
                    <th className="py-2.5 px-3 text-center">×</th>
                    <th className="py-2.5 px-3 text-right">Financial Leverage (x)</th>
                    <th className="py-2.5 px-3 text-center">=</th>
                    <th className="py-2.5 px-3 text-right">Calculated ROE (%)</th>
                    <th className="py-2.5 px-3 text-right">Reported ROE (%)</th>
                    <th className="py-2.5 px-3 text-center">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {HDFC_DUPONT.map((d) => (
                    <tr key={d.fiscalYear} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                        {d.fiscalYear}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-emerald-800">
                        {d.netProfitMargin.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-400">×</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-blue-800">
                        {d.assetTurnover.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-400">×</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-amber-800">
                        {d.leverageMultiplier.toFixed(2)}x
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-400">=</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        {dupontProduct(d).toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">
                        {d.reportedRoe.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">{sgn(dupontProduct(d) - d.reportedRoe)} pp</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Institutional Interpretation of DuPont Trends:</strong>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>
                  <strong>Net Margin Expansion:</strong> Net Profit Margin has expanded from 33.05% in FY20 to 38.54% in FY24, reflecting digital operating efficiencies and non-interest fee cross-sell.
                </li>
                <li>
                  <strong>Asset Turnover Moderation:</strong> Asset turnover contracted from 5.19% to 4.36% post-merger as low-velocity wholesale mortgage assets were brought onto the balance sheet.
                </li>
                <li>
                  <strong>Prudential De-leveraging:</strong> Financial leverage multiplier decreased from 9.53x to 9.16x, indicating lower balance-sheet leverage than before COVID-19.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTabSub === "peers" && (
        <div className="space-y-6">
          {/* Peer Filter Strip & Scatter Plot */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Valuation vs. Quality Quadrant (P/B Multiple vs. ROE)
                  </h3>
                  <AuditBadge type="CALCULATED_METRIC" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cross-sectional peer analysis identifying relative mispricings in Indian Banking.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Filter Sector:</span>
                {(["ALL", "Private Sector", "Public Sector (PSU)"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedPeerCategory(cat)}
                    className={`px-2.5 py-1 rounded font-semibold transition ${
                      selectedPeerCategory === cat
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Peer Scatter Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="roe"
                    name="Return on Equity (ROE)"
                    unit="%"
                    domain={[10, 22]}
                    stroke="#64748b"
                    label={{ value: "Return on Equity (ROE %)", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="pbRatio"
                    name="Price-to-Book (P/B)"
                    unit="x"
                    domain={[1.0, 3.8]}
                    stroke="#64748b"
                    label={{ value: "P/B Multiple (x)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const data = payload[0].payload as (typeof BANKING_PEERS)[0];
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded text-xs shadow-lg border border-slate-700 font-mono">
                          <div className="font-bold text-blue-300 font-sans">{data.name}</div>
                          <div>P/B: {data.pbRatio}x</div>
                          <div>ROE: {data.roe}%</div>
                          <div>ROA: {data.roa}%</div>
                          <div>NIM: {data.nim}%</div>
                          <div>GNPA: {data.gnpa}%</div>
                          <div>1Y Return: {data.oneYearReturn}%</div>
                        </div>
                      );
                    }}
                  />
                  <Scatter name="Banks" data={filteredPeers}>
                    {filteredPeers.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.ticker === "HDFCBANK.NS"
                            ? "#1e3a8a"
                            : entry.category === "Public Sector (PSU)"
                            ? "#d97706"
                            : "#0284c7"
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <span className="w-2.5 h-2.5 bg-[#1e3a8a] rounded-full inline-block"></span>
                  HDFC Bank (P/B {BANKING_PEERS[0].pbRatio.toFixed(2)}x @ 15.1% ROE vs 5Y avg 3.1x)
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 bg-[#0284c7] rounded-full inline-block"></span>
                  Private Peers (ICICI, Kotak, Axis, IndusInd)
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 bg-[#d97706] rounded-full inline-block"></span>
                  PSU (SBI)
                </span>
              </div>
              <span className="font-mono text-slate-500">Quad: High Quality / Discount Valuation</span>
            </div>
          </div>

          {/* Peer Cross-Sectional Comparison Table */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Institutional Banking Sector Comp Sheet
                </h3>
                <AuditBadge type="HISTORICAL_OBSERVATION" />
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Peer set: HDFC, ICICI, Kotak, Axis, SBI, IndusInd · ratios as labelled in source data (FY25E / Q3 FY25) · standalone vs consolidated basis not specified
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono uppercase text-[11px]">
                    <th className="py-2.5 px-3">Bank Institution</th>
                    <th className="py-2.5 px-3">Ticker</th>
                    <th className="py-2.5 px-3 text-right">CMP (₹)</th>
                    <th className="py-2.5 px-3 text-right">MCap (₹ Cr)</th>
                    <th className="py-2.5 px-3 text-right">P/E</th>
                    <th className="py-2.5 px-3 text-right">P/B</th>
                    <th className="py-2.5 px-3 text-right">NIM %</th>
                    <th className="py-2.5 px-3 text-right">C/I %</th>
                    <th className="py-2.5 px-3 text-right">ROE %</th>
                    <th className="py-2.5 px-3 text-right">ROA %</th>
                    <th className="py-2.5 px-3 text-right">GNPA %</th>
                    <th className="py-2.5 px-3 text-right">NNPA %</th>
                    <th className="py-2.5 px-3 text-right">CET-1 %</th>
                    <th className="py-2.5 px-3 text-right">1Y Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {filteredPeers.map((peer) => {
                    const isHdfc = peer.ticker === "HDFCBANK.NS";
                    return (
                      <tr
                        key={peer.ticker}
                        className={`transition ${
                          isHdfc
                            ? "bg-blue-50/70 font-semibold text-blue-950"
                            : "hover:bg-slate-50 text-slate-800"
                        }`}
                      >
                        <td className="py-2.5 px-3 font-sans font-bold flex items-center gap-1.5">
                          {isHdfc && <span className="w-1.5 h-1.5 bg-blue-700 rounded-full"></span>}
                          {peer.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{peer.ticker}</td>
                        <td className="py-2.5 px-3 text-right">₹{peer.cmp.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right">
                          ₹{peer.marketCapCr.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 px-3 text-right">{peer.peRatio.toFixed(1)}x</td>
                        <td className="py-2.5 px-3 text-right font-bold">{peer.pbRatio.toFixed(2)}x</td>
                        <td className="py-2.5 px-3 text-right">{peer.nim.toFixed(2)}%</td>
                        <td className="py-2.5 px-3 text-right">{peer.costToIncome.toFixed(1)}%</td>
                        <td className="py-2.5 px-3 text-right font-bold">{peer.roe.toFixed(1)}%</td>
                        <td className="py-2.5 px-3 text-right">{peer.roa.toFixed(2)}%</td>
                        <td className="py-2.5 px-3 text-right text-slate-700">{peer.gnpa.toFixed(2)}%</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
                          {peer.nnpa.toFixed(2)}%
                        </td>
                        <td className="py-2.5 px-3 text-right">{peer.cet1.toFixed(2)}%</td>
                        <td
                          className={`py-2.5 px-3 text-right font-bold ${
                            peer.oneYearReturn >= 0 ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {peer.oneYearReturn > 0 ? `+${peer.oneYearReturn.toFixed(1)}%` : `${peer.oneYearReturn.toFixed(1)}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};