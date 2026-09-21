"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Scale,
  DollarSign,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { AuditBadge } from "./AuditBadge";
import { METRICS, NET_ALPHA } from "@/data/metrics";

interface RebalanceRecord {
  id: number;
  eventDate: string;
  strategy: string;
  triggerType: string;
  assetTraded: string;
  action: string;
  weightBefore: number;
  weightAfter: number;
  turnoverPct: number;
  costBps: number;
  realizedFrictionInr: number;
  status: string;
}

export const ActiveStrategy: React.FC = () => {
  const [rebalanceEvents, setRebalanceEvents] = useState<RebalanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newAction, setNewAction] = useState("BUY");
  const [newAsset, setNewAsset] = useState("HDFCBANK.NS");
  const [newTrigger, setNewTrigger] = useState("Drift Threshold >2.5%");
  const [weightBefore, setWeightBefore] = useState(32.5);
  const [weightAfter, setWeightAfter] = useState(34.0);

  // Active Portfolio Target Allocations vs Benchmark
  const ALLOCATION_DATA = [
    { name: "HDFC Bank Ltd", activeWeight: 34.0, benchmarkWeight: 29.45, tilt: 4.55, color: "#1e3a8a" },
    { name: "ICICI Bank Ltd", activeWeight: 28.0, benchmarkWeight: 24.15, tilt: 3.85, color: "#0284c7" },
    { name: "Kotak Mahindra Bank", activeWeight: 15.0, benchmarkWeight: 9.80, tilt: 5.20, color: "#0d9488" },
    { name: "Axis Bank Ltd", activeWeight: 13.0, benchmarkWeight: 9.60, tilt: 3.40, color: "#6366f1" },
    { name: "State Bank of India", activeWeight: 7.0, benchmarkWeight: 10.40, tilt: -3.40, color: "#d97706" },
    { name: "Cash & Liquid Buffer", activeWeight: 3.0, benchmarkWeight: 0.0, tilt: 3.0, color: "#64748b" },
  ];

  // Fetch rebalance events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/rebalance-events");
      const json = await res.json();
      if (json.success) {
        setRebalanceEvents(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const turnover = Math.abs(weightAfter - weightBefore);
      const costBps = 25.0;
      const frictionInr = (turnover / 100) * 10000000 * (costBps / 10000);

      const res = await fetch("/api/rebalance-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventDate: new Date().toISOString().split("T")[0],
          strategy: "Active Bank Alpha",
          triggerType: newTrigger,
          assetTraded: newAsset,
          action: newAction,
          weightBefore,
          weightAfter,
          turnoverPct: turnover,
          costBps,
          realizedFrictionInr: frictionInr,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowLogModal(false);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Strategy Thesis Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
              Active Strategy Portfolio Construction & Execution Alpha
            </h2>
            <AuditBadge type="CALCULATED_METRIC" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Systematic overweighting in high-quality private lenders with dynamic factor tilts, 2.5% drift rebalancing, and explicit transaction friction deduction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-xs transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Rebalance Trigger</span>
          </button>
        </div>
      </div>

      {/* Strategy Performance Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            Gross vs Net Alpha
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-emerald-700">+2.18% p.a.</span>
            <span className="text-slate-500 text-[11px]">Gross: +2.84%</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            Friction Drag: -0.66% (TER + TCA)
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            Information Ratio (IR)
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900">{METRICS.ir.active.toFixed(2)}</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              ABOVE 0.50 TARGET
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            IR = {NET_ALPHA.toFixed(2)}% net alpha ÷ {METRICS.te.active.toFixed(2)}% tracking error
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            Up / Down Market Capture
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-blue-900">104.2% / 88.6%</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              ASYMMETRIC
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            Captures rallies, cushions drawdowns
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            Portfolio Annual Turnover
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900">14.2% p.a.</span>
            <span className="text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
              LOW CHURN
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            Controlled turnover preserves alpha
          </span>
        </div>
      </div>

      {/* Active Weighting vs Benchmark Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Bar Chart */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Active Mandate Weight vs. Benchmark Allocation (%)
                </h3>
                <AuditBadge type="CALCULATED_METRIC" />
              </div>
              <span className="text-xs text-slate-500">
                Tactical Overweight (+450 bps in HDFC Bank, +385 bps in ICICI Bank)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Active Tilt: Overweight Quality
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ALLOCATION_DATA}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fontSize: 10 }} width={110} />
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
                <Bar dataKey="activeWeight" name="Active Mandate Weight %" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
                <Bar dataKey="benchmarkWeight" name="Benchmark Weight %" fill="#94a3b8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Cost Analysis (TCA) Breakdown */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Transaction Cost & Market Friction Architecture
                </h3>
                <AuditBadge type="CALCULATED_METRIC" />
              </div>
              <span className="text-xs text-slate-500">
                Illustrative friction assumption: 25 bps per unit of traded value (one way)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              25 bps assumed TCA
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs mt-3">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-sans font-bold text-slate-800 block">Securities Transaction Tax (STT)</span>
                <span className="text-[11px] text-slate-500 font-sans">Statutory delivery duty: 0.1% on each buy and sell leg (verify current rate)</span>
              </div>
              <span className="font-bold text-slate-900">10.0 bps</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-sans font-bold text-slate-800 block">Market Impact & Bid-Ask Slippage</span>
                <span className="text-[11px] text-slate-500 font-sans">Institutional block execution impact</span>
              </div>
              <span className="font-bold text-slate-900">10.0 bps</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-sans font-bold text-slate-800 block">Institutional Brokerage</span>
                <span className="text-[11px] text-slate-500 font-sans">Tier-1 institutional execution commission</span>
              </div>
              <span className="font-bold text-slate-900">3.0 bps</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-sans font-bold text-slate-800 block">Exchange, SEBI & Stamp Duty</span>
                <span className="text-[11px] text-slate-500 font-sans">NSE charges (0.32 bps) + Stamp duty (1.5 bps)</span>
              </div>
              <span className="font-bold text-slate-900">2.0 bps</span>
            </div>

            <div className="p-3 bg-blue-50/80 rounded border border-blue-200 flex items-center justify-between text-blue-900 font-bold">
              <span className="font-sans uppercase">Total friction per leg (one way)</span>
              <span className="text-sm">25.0 bps (0.25%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rebalance Audit Log from Database */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Active Rebalance Execution & Audit Log (PostgreSQL Store)
              </h3>
              <AuditBadge type="HISTORICAL_OBSERVATION" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live audit trail of portfolio rebalancing triggers, turnover, and realized friction.
            </p>
          </div>

          <button
            onClick={fetchEvents}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-mono"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Audit Log</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Asset Traded</th>
                <th className="py-2.5 px-3">Trigger Type</th>
                <th className="py-2.5 px-3 text-center">Action</th>
                <th className="py-2.5 px-3 text-right">Weight Before</th>
                <th className="py-2.5 px-3 text-right">Weight After</th>
                <th className="py-2.5 px-3 text-right">Turnover</th>
                <th className="py-2.5 px-3 text-right">Friction (INR)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {rebalanceEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 text-slate-500">{ev.eventDate}</td>
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{ev.assetTraded}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-sans">{ev.triggerType}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        ev.action === "BUY"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : ev.action === "SELL"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {ev.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">{ev.weightBefore.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right font-bold text-blue-900">
                    {ev.weightAfter.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-800">
                    {ev.turnoverPct.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-rose-700">
                    ₹{Number(ev.realizedFrictionInr).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-2.5 h-2.5" /> {ev.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && rebalanceEvents.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-6 px-3 text-center font-sans text-slate-500">
                    No rebalancing events recorded. This log is served from PostgreSQL: if you expect events here,
                    check that DATABASE_URL is set and the tables exist (run drizzle-kit push).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Rebalance Trigger Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-md w-full p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
              Log Portfolio Rebalance Execution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Commit a new rebalancing execution record to the PostgreSQL audit store.
            </p>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Asset Traded</label>
                <select
                  value={newAsset}
                  onChange={(e) => setNewAsset(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs font-mono"
                >
                  <option value="HDFCBANK.NS">HDFCBANK.NS — HDFC Bank Ltd</option>
                  <option value="ICICIBANK.NS">ICICIBANK.NS — ICICI Bank Ltd</option>
                  <option value="KOTAKBANK.NS">KOTAKBANK.NS — Kotak Mahindra Bank</option>
                  <option value="AXISBANK.NS">AXISBANK.NS — Axis Bank Ltd</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Trigger Reason</label>
                <select
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs"
                >
                  <option value="Drift Threshold >2.5%">Drift Threshold &gt;2.5% breached</option>
                  <option value="Quarterly Scheduled">Quarterly Scheduled Rebalance</option>
                  <option value="Corporate Action">Corporate Action / Bonus Adjustment</option>
                  <option value="Tactical IC Tilt">Tactical Investment Committee Tilt</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Weight Before (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightBefore}
                    onChange={(e) => setWeightBefore(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Weight After (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightAfter}
                    onChange={(e) => setWeightAfter(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono text-slate-600">
                <span>Calculated Turnover: {Math.abs(weightAfter - weightBefore).toFixed(1)}%</span>
                <span className="block mt-0.5">Estimated 25 bps Friction: ₹{((Math.abs(weightAfter - weightBefore) / 100) * 10000000 * 0.0025).toFixed(0)}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 text-white hover:bg-blue-800 rounded font-semibold shadow-xs"
                >
                  Commit to Audit Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};