"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Shield,
  Layers,
  Compass,
  Scale,
  Building,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { AuditBadge } from "./AuditBadge";
import {
  HDFC_FUNDAMENTALS,
  generateTimeSeries,
  INSTITUTIONAL_TEARSHEET,
} from "@/data/hdfcData";

interface ExecutiveOverviewProps {
  benchmark: "NIFTY_BANK" | "NIFTY_50";
  capitalBase: number;
  onNavigateToTab: (tab: any) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  benchmark,
  capitalBase,
  onNavigateToTab,
}) => {
  const [timeSeries] = useState(() => generateTimeSeries());
  const benchmarkName = benchmark === "NIFTY_BANK" ? "Nifty Bank Index" : "Nifty 50 Index";

  // Format currency
  const formatCur = (val: number) => {
    if (capitalBase === 1) {
      return `₹${val.toFixed(2)}`;
    }
    const scaled = (val / 100) * capitalBase;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(scaled);
  };

  const latestAssetQuality = HDFC_FUNDAMENTALS.map((f) => ({
    year: f.fiscalYear,
    gnpa: f.gnpa,
    nnpa: f.nnpa,
    pcr: f.pcr,
  }));

  const capitalAdequacyData = HDFC_FUNDAMENTALS.map((f) => ({
    year: f.fiscalYear,
    car: f.totalCar,
    cet1: f.cet1,
    tier1: f.tier1,
    regulatoryMin: 11.5,
  }));

  return (
    <div className="space-y-6">
      {/* Top Advisory Banner */}
      <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-900/60 rounded text-blue-300">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">
                INVESTMENT COMMITTEE EXECUTIVE MANDATE — BFSI ALLOCATION
              </span>
              <AuditBadge type="INTERPRETATION" customText="INTP" />
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Current Mandate Recommendation: <strong className="text-emerald-400">OVERWEIGHT</strong> (+450 bps vs Nifty Bank benchmark weight). Favorable risk-reward post-merger valuation compression.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Target Horizon</span>
            <span className="font-bold text-slate-200">36 Months (FY28E)</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Risk Budget (TE)</span>
            <span className="font-bold text-slate-200">≤ 4.50% p.a.</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Comparative Grid: Active vs Passive vs Benchmark */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Terminal Portfolio Value Card */}
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Terminal Portfolio Value
            </span>
            <AuditBadge type="CALCULATED_METRIC" />
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono text-slate-900">
              {formatCur(205.35)}
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Active Strategy (Net of 25bps friction)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">PASSIVE VALUE</span>
              <span className="font-semibold text-slate-700">{formatCur(181.24)}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">ALPHA WEALTH</span>
              <span className="font-bold text-emerald-700">+{capitalBase === 1 ? "₹24.11" : "₹24.1 Lakhs"}</span>
            </div>
          </div>
        </div>

        {/* Compound Annual Growth Rate (CAGR) */}
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              CAGR (4.25-Year Net)
            </span>
            <AuditBadge type="CALCULATED_METRIC" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-slate-900">18.15%</div>
            <span className="inline-flex items-center text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +3.17% Alpha
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono block mt-0.5">
            Active Strategy vs 14.98% Passive
          </span>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">BENCHMARK CAGR</span>
              <span className="font-semibold text-slate-700">15.32%</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">TOTAL RETURN</span>
              <span className="font-bold text-slate-800">+105.35%</span>
            </div>
          </div>
        </div>

        {/* Risk-Adjusted Sharpe Ratio */}
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sharpe Ratio (Rf = 6.80%)
            </span>
            <AuditBadge type="CALCULATED_METRIC" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-slate-900">0.66</div>
            <span className="inline-flex items-center text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              +0.23 Superior
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono block mt-0.5">
            Excess return per unit of total risk
          </span>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">PASSIVE SHARPE</span>
              <span className="font-semibold text-slate-700">0.43</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">ANNUAL VOLATILITY</span>
              <span className="font-bold text-slate-800">17.20%</span>
            </div>
          </div>
        </div>

        {/* Tail Risk & Maximum Drawdown */}
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Maximum Drawdown
            </span>
            <AuditBadge type="CALCULATED_METRIC" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold font-mono text-slate-900">-23.40%</div>
            <span className="inline-flex items-center text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              550 bps Milder
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono block mt-0.5">
            Active Peak-to-Trough vs -28.90% Passive
          </span>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">BENCHMARK MDD</span>
              <span className="font-semibold text-slate-700">-29.40%</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">CALMAR RATIO</span>
              <span className="font-bold text-slate-800">0.78</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Performance Comparison Chart: Growth of Capital */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Cumulative Growth of Capital — Active vs. Passive vs. Benchmark
              </h2>
              <AuditBadge type="CALCULATED_METRIC" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Base 100 normalized performance starting Jan 2021 through March 2025 (4.25-Year Track Record). Active incorporates 25 bps transaction costs & quarterly rebalancing.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-blue-700 rounded-xs"></span>
              <span className="text-slate-700 font-semibold">Active Strategy (+105.3%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-500 rounded-xs"></span>
              <span className="text-slate-700 font-semibold">Passive Mandate (+81.2%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-600 rounded-xs"></span>
              <span className="text-slate-700 font-semibold">{benchmarkName} (+83.4%)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeSeries.performance}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                minTickGap={60}
              />
              <YAxis
                domain={["dataMin - 10", "dataMax + 10"]}
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#f8fafc",
                }}
                formatter={(val: any, name: any) => [
                  `₹${Number(val).toFixed(2)}`,
                  name === "activePortfolio"
                    ? "Active Strategy (Net)"
                    : name === "passivePortfolio"
                    ? "Passive ETF Mandate"
                    : "Benchmark",
                ]}
              />
              <Line
                type="monotone"
                dataKey="activePortfolio"
                stroke="#1d4ed8"
                strokeWidth={2.5}
                dot={false}
                name="activePortfolio"
              />
              <Line
                type="monotone"
                dataKey="passivePortfolio"
                stroke="#64748b"
                strokeWidth={2}
                dot={false}
                name="passivePortfolio"
              />
              <Line
                type="monotone"
                dataKey="benchmarkNiftyBank"
                stroke="#d97706"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                name="benchmarkNiftyBank"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Alpha Attribution:</span>
            <span>Sector Overweight: +1.42%</span>
            <span>•</span>
            <span>Factor Tilts: +0.94%</span>
            <span>•</span>
            <span>Transaction Friction Drag: -0.21%</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Net Realized Alpha: +2.18% p.a.</span>
          </div>
          <button
            onClick={() => onNavigateToTab("active_vs_passive")}
            className="text-blue-700 hover:underline font-semibold flex items-center gap-1 font-sans"
          >
            Detailed Tear Sheet & Analytics &rarr;
          </button>
        </div>
      </div>

      {/* Dual Column: Fundamental Health & Capital Adequacy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Quality Trajectory */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Asset Quality & Provisioning Trajectory (FY20 - FY25E)
                </h3>
                <AuditBadge type="HISTORICAL_OBSERVATION" />
              </div>
              <p className="text-xs text-slate-500">
                Audited Gross NPA vs Net NPA percentages across pre- and post-merger cycles.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              NNPA: 0.34% (Stable)
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={latestAssetQuality}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
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
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  iconSize={10}
                />
                <Bar dataKey="gnpa" name="Gross NPA %" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nnpa" name="Net NPA %" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
            <strong className="text-slate-800">Analytical Audit:</strong> Provision Coverage Ratio (PCR) consistently exceeds 73.0%. Post-merger addition of wholesale real estate and corporate loans from HDFC Ltd resulted in negligible delinquency spillover, affirming underwriting robustness.
          </div>
        </div>

        {/* Capital Adequacy & Regulatory Solvency */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Capital Adequacy vs. Basel III Regulatory Minimums
                </h3>
                <AuditBadge type="CALCULATED_METRIC" />
              </div>
              <p className="text-xs text-slate-500">
                Total CAR & Common Equity Tier-1 (CET-1) solvency cushion.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              CAR: 19.80% vs 11.5% Min
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={capitalAdequacyData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[8, 22]} stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
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
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  iconSize={10}
                />
                <Line
                  type="monotone"
                  dataKey="car"
                  name="Total CAR %"
                  stroke="#1e3a8a"
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="cet1"
                  name="CET-1 %"
                  stroke="#0284c7"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="regulatoryMin"
                  name="RBI Basel III Min (11.5%)"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
            <strong className="text-slate-800">Prudential Buffer:</strong> HDFC Bank holds an 830 bps solvency buffer over the RBI mandatory 11.50% total capital requirement, insulating the institution against adverse macro credit cycles without requiring equity dilution.
          </div>
        </div>
      </div>

      {/* Institutional Scorecard Summary Table */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Executive Institutional Metrics Tear Sheet
            </h3>
            <AuditBadge type="CALCULATED_METRIC" />
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Indian Sovereign Benchmark Rf = 6.80% | FIMMDA Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Performance Dimension</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Active Strategy</th>
                <th className="py-2.5 px-3 text-right">Passive Replication</th>
                <th className="py-2.5 px-3 text-right">{benchmarkName}</th>
                <th className="py-2.5 px-3 text-right">Active Delta</th>
                <th className="py-2.5 px-3 text-center">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {INSTITUTIONAL_TEARSHEET.slice(0, 8).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">
                    {row.metric}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-sans">{row.category}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-blue-900">
                    {row.activeStrategy}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700">
                    {row.passiveStrategy}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500">
                    {row.benchmarkNiftyBank}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                    {row.deltaVsPassive}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <AuditBadge type={row.badge} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
