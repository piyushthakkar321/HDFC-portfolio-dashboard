"use client";

import React, { useState } from "react";
import {
  Scale,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  CheckCircle2,
  Info,
  DollarSign,
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
  ReferenceLine,
} from "recharts";
import { AuditBadge } from "./AuditBadge";
import {
  generateTimeSeries,
  INSTITUTIONAL_TEARSHEET,
  TearSheetMetric,
} from "@/data/hdfcData";

interface ActiveVsPassiveProps {
  benchmark: "NIFTY_BANK" | "NIFTY_50";
  capitalBase: number;
}

export const ActiveVsPassive: React.FC<ActiveVsPassiveProps> = ({
  benchmark,
  capitalBase,
}) => {
  const [data] = useState(() => generateTimeSeries().performance);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedMetric, setSelectedMetric] = useState<TearSheetMetric | null>(null);

  const categories = ["ALL", "Return", "Risk", "Risk-Adjusted", "Execution & Cost", "Tail Risk"];

  const filteredMetrics = selectedCategory === "ALL"
    ? INSTITUTIONAL_TEARSHEET
    : INSTITUTIONAL_TEARSHEET.filter((m) => m.category === selectedCategory);

  const benchmarkName = benchmark === "NIFTY_BANK" ? "Nifty Bank Index" : "Nifty 50 Index";

  return (
    <div className="space-y-6">
      {/* Top Strategy Comparative Header */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
              Head-to-Head Attribution: Active Mandate versus Passive ETF
            </h2>
            <AuditBadge type="CALCULATED_METRIC" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional performance audit across 4.25-year investment horizon. All metrics net of 25 bps transaction costs, STT, and management expenses.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-900 rounded font-semibold border border-blue-200">
            NET ACTIVE ALPHA: +2.18% p.a.
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 rounded font-semibold border border-emerald-200">
            INFORMATION RATIO: 0.74
          </span>
        </div>
      </div>

      {/* Main Comparative Chart: Growth of Capital */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Cumulative Wealth Accumulation (₹10,000,000 Base)
              </h3>
              <AuditBadge type="CALCULATED_METRIC" />
            </div>
            <span className="text-xs text-slate-500">
              Active Strategy terminal value ₹20,534,800 vs. Passive ETF ₹18,124,300 (+13.3% Wealth Delta).
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
              <span className="w-3 h-0.5 bg-blue-700 inline-block"></span> Active Mandate
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <span className="w-3 h-0.5 bg-slate-500 inline-block"></span> Passive ETF
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="w-3 h-0.5 bg-amber-600 inline-block border-dashed"></span> {benchmarkName}
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} minTickGap={60} />
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
                    ? "Passive ETF"
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
      </div>

      {/* Dual Risk Analysis: Underwater Drawdowns & Rolling Alpha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Underwater Drawdown Chart */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Underwater Drawdown Profile (Peak-to-Trough %)
                </h4>
                <AuditBadge type="CALCULATED_METRIC" />
              </div>
              <span className="text-[11px] text-slate-500">
                Active max drawdown -23.40% vs. Passive -28.90%
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              550 bps Capital Preservation
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} minTickGap={60} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[-35, 0]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#f8fafc",
                  }}
                  formatter={(val: any, name: any) => [
                    `${val}%`,
                    name === "activeDrawdown" ? "Active Drawdown" : "Passive Drawdown",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="activeDrawdown"
                  stroke="#2563eb"
                  fill="#93c5fd"
                  fillOpacity={0.4}
                  name="activeDrawdown"
                />
                <Area
                  type="monotone"
                  dataKey="passiveDrawdown"
                  stroke="#ef4444"
                  fill="#fca5a5"
                  fillOpacity={0.2}
                  name="passiveDrawdown"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rolling 1-Year Active Excess Alpha */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Rolling 1-Year Active Alpha (% p.a.)
                </h4>
                <AuditBadge type="CALCULATED_METRIC" />
              </div>
              <span className="text-[11px] text-slate-500">
                Persistence of manager alpha over rolling 252-day windows
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Avg Alpha: +2.18% p.a.
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} minTickGap={60} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 4]} unit="%" />
                <ReferenceLine y={2.18} stroke="#10b981" strokeDasharray="3 3" label={{ value: "Mean Alpha (+2.18%)", fill: "#10b981", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#f8fafc",
                  }}
                  formatter={(val: any) => [`+${val}% p.a.`, "Rolling 1Y Alpha"]}
                />
                <Line
                  type="monotone"
                  dataKey="rollingAlpha1Y"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comprehensive 14-Metric Institutional Scorecard Table */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Institutional Tear Sheet & Mathematical Attribution Ledger
              </h3>
              <AuditBadge type="CALCULATED_METRIC" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click on any metric row to inspect exact formula definition, statutory inputs, and audit notes.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-semibold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded transition ${
                  selectedCategory === cat
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Performance Dimension</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Active Strategy</th>
                <th className="py-2.5 px-3 text-right">Passive Strategy</th>
                <th className="py-2.5 px-3 text-right">{benchmarkName}</th>
                <th className="py-2.5 px-3 text-right">Active Delta</th>
                <th className="py-2.5 px-3 text-center">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {filteredMetrics.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedMetric(row)}
                  className="hover:bg-blue-50/50 cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900 flex items-center justify-between">
                    <span>{row.metric}</span>
                    <Info className="w-3 h-3 text-slate-400 opacity-60 ml-1 inline" />
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

      {/* Selected Metric Inspector Drawer / Modal */}
      {selectedMetric && (
        <div className="p-4 bg-slate-900 text-slate-100 rounded-lg border border-slate-800 shadow-lg text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{selectedMetric.metric}</span>
              <AuditBadge type={selectedMetric.badge} />
            </div>
            <button
              onClick={() => setSelectedMetric(null)}
              className="text-slate-400 hover:text-white font-mono px-2 py-0.5 rounded bg-slate-800"
            >
              Close Inspector ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 font-mono">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Active Strategy</span>
              <span className="text-base font-bold text-blue-400">{selectedMetric.activeStrategy}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Passive Strategy</span>
              <span className="text-base font-bold text-slate-300">{selectedMetric.passiveStrategy}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Active Delta</span>
              <span className="text-base font-bold text-emerald-400">{selectedMetric.deltaVsPassive}</span>
            </div>
          </div>
          <div className="pt-2 text-slate-300 leading-relaxed font-sans border-t border-slate-800">
            <strong className="text-white font-mono block mb-0.5 text-xs">Mathematical Definition & Methodology:</strong>
            {selectedMetric.formulaExplanation}
          </div>
        </div>
      )}

      {/* Institutional Allocation Decision Tree */}
      <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
          Investment Committee Decision Framework: Active vs. Passive Allocation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-blue-50/70 rounded border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-700" />
              <span>When to Allocate to Active BFSI Strategy</span>
            </div>
            <ul className="list-disc ml-5 space-y-1 text-slate-700 leading-relaxed">
              <li>
                <strong>Valuation Divergence:</strong> When top-tier franchise banks (like HDFC Bank at 2.12x P/B) trade at a discount to historical multiples (3.10x 5Y average).
              </li>
              <li>
                <strong>Credit Cycle Inflection:</strong> When asset quality divergence between private and PSU lenders creates alpha opportunities.
              </li>
              <li>
                <strong>Tail Risk Management:</strong> When downside semi-deviation controls (Sortino 0.98 vs 0.62) protect capital during macro drawdowns.
              </li>
            </ul>
          </div>

          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-slate-600" />
              <span>When to Allocate to Passive Nifty Bank ETF</span>
            </div>
            <ul className="list-disc ml-5 space-y-1 text-slate-700 leading-relaxed">
              <li>
                <strong>Broad Beta Surges:</strong> During liquidity-driven macro rallies where all 12 banking constituents rally synchronously.
              </li>
              <li>
                <strong>Fee Sensitivity & Mandate Constraints:</strong> When strict institutional fee caps (TER ≤ 0.20%) preclude active management expenses.
              </li>
              <li>
                <strong>Liquidity & High Turnover:</strong> For short-term tactical asset allocation where bid-ask spread and tracking fidelity take priority over alpha.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
