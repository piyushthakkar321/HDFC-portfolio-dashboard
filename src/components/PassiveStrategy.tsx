"use client";

import React from "react";
import {
  Layers,
  ShieldCheck,
  Percent,
  CheckCircle,
  HelpCircle,
  TrendingDown,
  Info,
  Scale,
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
  BarChart,
  Bar,
} from "recharts";
import { AuditBadge } from "./AuditBadge";
import { generateTimeSeries } from "@/data/hdfcData";
import { METRICS, PASSIVE_TER_PCT, PASSIVE_OTHER_DRAG_PCT, spct } from "@/data/metrics";

export const PassiveStrategy: React.FC = () => {
  const [data] = React.useState(() => generateTimeSeries().performance);

  // Nifty Bank Benchmark Constituents
  const NIFTY_BANK_WEIGHTS = [
    { name: "HDFC Bank Ltd", ticker: "HDFCBANK.NS", weight: 29.45, floatCapCr: 712000, category: "Private" },
    { name: "ICICI Bank Ltd", ticker: "ICICIBANK.NS", weight: 24.15, floatCapCr: 585000, category: "Private" },
    { name: "State Bank of India", ticker: "SBIN.NS", weight: 10.40, floatCapCr: 252000, category: "PSU" },
    { name: "Kotak Mahindra Bank", ticker: "KOTAKBANK.NS", weight: 9.80, floatCapCr: 237000, category: "Private" },
    { name: "Axis Bank Ltd", ticker: "AXISBANK.NS", weight: 9.60, floatCapCr: 232000, category: "Private" },
    { name: "IndusInd Bank Ltd", ticker: "INDUSINDBK.NS", weight: 4.80, floatCapCr: 116000, category: "Private" },
    { name: "Bank of Baroda", ticker: "BANKBARODA.NS", weight: 3.10, floatCapCr: 75000, category: "PSU" },
    { name: "Federal Bank Ltd", ticker: "FEDERALBNK.NS", weight: 2.80, floatCapCr: 68000, category: "Private" },
    { name: "Punjab National Bank", ticker: "PNB.NS", weight: 2.10, floatCapCr: 51000, category: "PSU" },
    { name: "IDFC First Bank", ticker: "IDFCFIRSTB.NS", weight: 1.80, floatCapCr: 44000, category: "Private" },
    { name: "AU Small Finance Bank", ticker: "AUBANK.NS", weight: 1.20, floatCapCr: 29000, category: "Small Fin" },
    { name: "Bandhan Bank Ltd", ticker: "BANDHANBNK.NS", weight: 0.80, floatCapCr: 19000, category: "Private" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Strategy Thesis Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
              Passive Strategy — Nifty Bank Index Full Physical Replication
            </h2>
            <AuditBadge type="CALCULATED_METRIC" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ultra-low-cost institutional index fund / ETF structure tracking the 12-constituent Nifty Bank Index with strict tracking error minimization.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-semibold border border-slate-200">
            TOTAL EXPENSE RATIO (TER): 0.15% p.a.
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded font-semibold border border-emerald-200">
            REPLICATION: FULL PHYSICAL
          </span>
        </div>
      </div>

      {/* Passive Diagnostic Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            Annualized Tracking Error (TE)
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900">0.28% p.a.</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              HIGH FIDELITY
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            Tolerance Budget: &lt; 0.50% p.a.
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            Cumulative Tracking Difference
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900">{spct(METRICS.td.passive)} p.a.</span>
            <span className="text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
              VS NIFTY BANK
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            {`Assumed TER ${PASSIVE_TER_PCT.toFixed(2)}% + transaction, cash & dividend lag ${PASSIVE_OTHER_DRAG_PCT.toFixed(2)}% (residual)`}
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            HDFC Bank Index Weight
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-blue-900">29.45%</span>
            <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
              ANCHOR STOCK
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            Free-Float MCap Weighted (#1 Heavyweight)
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            Cash Drag / Buffer
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900">0.25%</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              OPTIMAL
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            Overnight TREPS liquidity buffer
          </span>
        </div>
      </div>

      {/* Tracking Difference & Index Replication Chart */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Passive ETF Tracking Fidelity vs Nifty Bank Benchmark
              </h3>
              <AuditBadge type="CALCULATED_METRIC" />
            </div>
            <span className="text-xs text-slate-500">
              Daily cumulative spread (Tracking Difference) over 4.25-year mandate cycle.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <span className="w-3 h-0.5 bg-slate-500 inline-block"></span> Passive ETF NAV
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="w-3 h-0.5 bg-amber-600 inline-block border-dashed"></span> Nifty Bank Index
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
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
                  name === "passivePortfolio" ? "Passive Mandate" : "Nifty Bank",
                ]}
              />
              <Line
                type="monotone"
                dataKey="passivePortfolio"
                stroke="#475569"
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

        <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
          <strong className="text-slate-800">Tracking Error Assessment:</strong> The passive strategy delivers precise index replication with annualized tracking error of 0.28%, well within the institutional mandate ceiling of 0.50%. The tracking difference of {Math.abs(METRICS.td.passive).toFixed(2)}% p.a. is modelled as an assumed 15 bps ETF TER plus a residual for transaction costs, cash drag and dividend lag. The residual is not separately evidenced.
        </div>
      </div>

      {/* Benchmark Constituent Breakdown Table */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Nifty Bank Index Full Reconstitution Table (12 Constituents)
            </h3>
            <AuditBadge type="HISTORICAL_OBSERVATION" />
          </div>
          <span className="text-xs text-slate-500 font-mono">
            NSE Free-Float Market Capitalization Methodology
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Bank Constituent</th>
                <th className="py-2.5 px-3">Ticker</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Index Weight (%)</th>
                <th className="py-2.5 px-3 text-right">Free-Float MCap (₹ Cr)</th>
                <th className="py-2.5 px-3 text-center">Replication Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {NIFTY_BANK_WEIGHTS.map((c) => {
                const isHdfc = c.ticker === "HDFCBANK.NS";
                return (
                  <tr
                    key={c.ticker}
                    className={`transition ${
                      isHdfc ? "bg-blue-50/70 font-semibold text-blue-950" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="py-2 px-3 font-sans font-bold flex items-center gap-1.5">
                      {isHdfc && <span className="w-1.5 h-1.5 bg-blue-700 rounded-full"></span>}
                      {c.name}
                    </td>
                    <td className="py-2 px-3 text-slate-500">{c.ticker}</td>
                    <td className="py-2 px-3 text-slate-600 font-sans">{c.category}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {c.weight.toFixed(2)}%
                    </td>
                    <td className="py-2 px-3 text-right">₹{c.floatCapCr.toLocaleString("en-IN")}</td>
                    <td className="py-2 px-3 text-center text-slate-500">Full Physical</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
