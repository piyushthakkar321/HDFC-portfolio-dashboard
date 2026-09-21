"use client";

import React, { useState } from "react";
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
  ReferenceLine,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Sliders,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart2,
  Info,
} from "lucide-react";
import { AuditBadge } from "./AuditBadge";
import { generateTimeSeries, MONTHLY_RETURNS, dataThrough, computeYtd } from "@/data/hdfcData";
import { MARKET_SNAPSHOT } from "@/data/marketSnapshot";
import { sgn } from "@/data/metrics";

export const TechnicalAnalysis: React.FC = () => {
  const [data] = useState(() => generateTimeSeries().technical);
  const [show20DMA, setShow20DMA] = useState(true);
  const [show50DMA, setShow50DMA] = useState(true);
  const [show200DMA, setShow200DMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [timeRange, setTimeRange] = useState<"1Y" | "3Y" | "ALL">("3Y");

  // Filter based on time range
  const filteredData = React.useMemo(() => {
    if (timeRange === "1Y") {
      return data.slice(-85); // roughly ~250 trading days sampled
    }
    if (timeRange === "3Y") {
      return data.slice(-260);
    }
    return data;
  }, [data, timeRange]);

  const latestPoint = data[data.length - 1] || {
    close: 731.0,
    dma20: 724.5,
    dma50: 718.2,
    dma200: 708.2,
    rsi: 54.2,
    macd: 3.4,
    macdSignal: 2.1,
    macdHist: 1.3,
  };

  const throughDate = dataThrough();
  const dmaGapPct = ((latestPoint.close - latestPoint.dma200) / latestPoint.dma200) * 100;
  const aboveDma = dmaGapPct >= 0;
  const rsiZone =
    latestPoint.rsi > 70 ? "OVERBOUGHT" : latestPoint.rsi < 30 ? "OVERSOLD" : latestPoint.rsi >= 50 ? "NEUTRAL · BULLISH BIAS" : "NEUTRAL · BEARISH BIAS";
  const macdAbove = latestPoint.macd >= latestPoint.macdSignal;

  // Technical Pivots (Standard Floor Pivot Equations)
  // Pivot = (H + L + C) / 3
  const lastPoint = data[data.length - 1];
  const lastHigh = lastPoint?.high ?? MARKET_SNAPSHOT.price;
  const lastLow = lastPoint?.low ?? MARKET_SNAPSHOT.price;
  const lastClose = lastPoint?.close ?? MARKET_SNAPSHOT.price;
  const pivot = (lastHigh + lastLow + lastClose) / 3;
  const r1 = 2 * pivot - lastLow;
  const s1 = 2 * pivot - lastHigh;
  const r2 = pivot + (lastHigh - lastLow);
  const s2 = pivot - (lastHigh - lastLow);

  return (
    <div className="space-y-6">
      {/* Header & Controls Strip */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
              HDFC Bank Technical Workstation & Quantitative Momentum
            </h2>
            <AuditBadge type="SIMULATED" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulated daily price series (illustrative), data through {throughDate}, anchored to the reference price ₹{MARKET_SNAPSHOT.price.toFixed(2)}. 20/50/200 DMA, 14-period RSI and MACD (12, 26, 9) are computed from it; the monthly return matrix is a separate stored dataset.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Moving Average Toggles */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-md font-mono text-[11px]">
            <button
              onClick={() => setShow20DMA(!show20DMA)}
              className={`px-2 py-0.5 rounded transition ${
                show20DMA ? "bg-amber-100 text-amber-900 font-bold" : "text-slate-400"
              }`}
            >
              20 DMA
            </button>
            <button
              onClick={() => setShow50DMA(!show50DMA)}
              className={`px-2 py-0.5 rounded transition ${
                show50DMA ? "bg-blue-100 text-blue-900 font-bold" : "text-slate-400"
              }`}
            >
              50 DMA
            </button>
            <button
              onClick={() => setShow200DMA(!show200DMA)}
              className={`px-2 py-0.5 rounded transition ${
                show200DMA ? "bg-purple-100 text-purple-900 font-bold" : "text-slate-400"
              }`}
            >
              200 DMA
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-0.5 rounded transition ${
                showVolume ? "bg-slate-300 text-slate-900 font-bold" : "text-slate-400"
              }`}
            >
              VOL
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md font-mono text-xs">
            {(["1Y", "3Y", "ALL"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-0.5 rounded font-semibold transition ${
                  timeRange === r
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Diagnostic Strip: 4 Key Indicator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            200 DMA Long-Term Trend
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900">₹{latestPoint.dma200.toFixed(2)}</span>
            <span className={`font-bold px-1.5 py-0.5 rounded border ${aboveDma ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-rose-700 bg-rose-50 border-rose-200"}`}>
              {Math.abs(dmaGapPct).toFixed(1)}% {aboveDma ? "above" : "below"}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            {aboveDma ? "Price is above the 200 DMA" : "Price is below the 200 DMA: long-term support tested"}
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            RSI (14-Period Wilder)
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900">{latestPoint.rsi.toFixed(1)}</span>
            <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              {rsiZone}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            Zone: 30-70 Normalized Channel
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            MACD (12, 26, 9)
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900">{sgn(latestPoint.macd)}</span>
            <span className={`font-bold px-1.5 py-0.5 rounded border ${macdAbove ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-rose-700 bg-rose-50 border-rose-200"}`}>
              {macdAbove ? "ABOVE SIGNAL" : "BELOW SIGNAL"}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            Signal: {latestPoint.macdSignal.toFixed(2)} | Hist: {sgn(latestPoint.macdHist)}
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            Daily Pivot Center
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900">₹{pivot.toFixed(2)}</span>
            <span className="text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
              PIVOT LEVEL
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            R1: ₹{r1.toFixed(2)} | S1: ₹{s1.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Chart: Price & Moving Averages */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Price Series & Moving Average Envelopes (Bonus Adjusted)
              </h3>
              <AuditBadge type="SIMULATED" />
            </div>
            <span className="text-xs text-slate-500">
              Latest close ({throughDate}): ₹{latestPoint.close.toFixed(2)} | 200 DMA: ₹{latestPoint.dma200.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-900 font-semibold">
              <span className="w-3 h-0.5 bg-slate-900 inline-block"></span> Price
            </span>
            {show20DMA && (
              <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                <span className="w-3 h-0.5 bg-amber-500 inline-block"></span> 20 DMA
              </span>
            )}
            {show50DMA && (
              <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
                <span className="w-3 h-0.5 bg-blue-600 inline-block"></span> 50 DMA
              </span>
            )}
            {show200DMA && (
              <span className="flex items-center gap-1.5 text-purple-700 font-semibold">
                <span className="w-3 h-0.5 bg-purple-600 inline-block"></span> 200 DMA
              </span>
            )}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} minTickGap={50} />
              <YAxis
                domain={["dataMin - 20", "dataMax + 20"]}
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
                formatter={(val: any, name: any) => [`₹${Number(val).toFixed(2)}`, name]}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#0f172a"
                strokeWidth={2}
                dot={false}
                name="Close Price"
              />
              {show20DMA && (
                <Line
                  type="monotone"
                  dataKey="dma20"
                  stroke="#d97706"
                  strokeWidth={1.5}
                  dot={false}
                  name="20 DMA"
                />
              )}
              {show50DMA && (
                <Line
                  type="monotone"
                  dataKey="dma50"
                  stroke="#2563eb"
                  strokeWidth={1.5}
                  dot={false}
                  name="50 DMA"
                />
              )}
              {show200DMA && (
                <Line
                  type="monotone"
                  dataKey="dma200"
                  stroke="#9333ea"
                  strokeWidth={2}
                  dot={false}
                  name="200 DMA"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Sub-Chart */}
        {showVolume && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1">
              Trading volume (simulated, millions of shares)
            </span>
            <div className="h-20 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" hide />
                  <YAxis stroke="#64748b" tick={{ fontSize: 9 }} unit="M" />
                  <Bar dataKey="volume" fill="#94a3b8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Dual Indicators: RSI & MACD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSI (14) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  RSI 14-Period Oscillator
                </h4>
                <AuditBadge type="SIMULATED" />
              </div>
              <span className="text-[11px] text-slate-500">Overbought: 70 | Oversold: 30</span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Latest ({throughDate}): {latestPoint.rsi.toFixed(1)}
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} minTickGap={50} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "70 Overbought", fill: "#ef4444", fontSize: 10 }} />
                <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" label={{ value: "30 Oversold", fill: "#10b981", fontSize: 10 }} />
                <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="2 2" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#f8fafc",
                  }}
                  formatter={(val: any) => [`${val}`, "RSI (14)"]}
                />
                <Line type="monotone" dataKey="rsi" stroke="#0284c7" strokeWidth={1.8} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MACD (12, 26, 9) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  MACD (12, 26, 9) Momentum & Histogram
                </h4>
                <AuditBadge type="SIMULATED" />
              </div>
              <span className="text-[11px] text-slate-500">Fast EMA (12) - Slow EMA (26) vs Signal Line (9)</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              MACD: {sgn(latestPoint.macd)}
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} minTickGap={50} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <ReferenceLine y={0} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#f8fafc",
                  }}
                  formatter={(val: any) => [`${val}`, "MACD Histogram"]}
                />
                <Bar dataKey="macdHist" name="Histogram" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Returns Calendar Heatmap (2020 - 2025) */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                HDFC Bank Historical Monthly Returns Matrix (% Seasonality)
              </h3>
              <AuditBadge type="SIMULATED" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Monthly percentage returns, January 2020 – March 2025. Return type: price return (assumed) · dividend-adjusted: no · bonus-adjusted: 1:1 Aug 2025 · source: stored dataset, not yet tied to an NSE extract (verify before external use).
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Green: Positive | Red: Negative
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono uppercase text-[11px]">
                <th className="py-2 px-2 text-left">Year</th>
                <th className="py-2 px-1">Jan</th>
                <th className="py-2 px-1">Feb</th>
                <th className="py-2 px-1">Mar</th>
                <th className="py-2 px-1">Apr</th>
                <th className="py-2 px-1">May</th>
                <th className="py-2 px-1">Jun</th>
                <th className="py-2 px-1">Jul</th>
                <th className="py-2 px-1">Aug</th>
                <th className="py-2 px-1">Sep</th>
                <th className="py-2 px-1">Oct</th>
                <th className="py-2 px-1">Nov</th>
                <th className="py-2 px-1">Dec</th>
                <th className="py-2 px-2 font-bold text-slate-900">YTD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {MONTHLY_RETURNS.map((m) => {
                const ytd = computeYtd(m.returns);
                return (
                <tr key={m.year} className="hover:bg-slate-50/70 transition">
                  <td className="py-2 px-2 font-sans font-bold text-slate-900 text-left">
                    {m.year}
                  </td>
                  {m.returns.map((val, idx) => {
                    if (val === null) {
                      return (
                        <td key={idx} className="py-2 px-1 text-slate-300">
                          —
                        </td>
                      );
                    }
                    const isPositive = val >= 0;
                    const isStrong = Math.abs(val) > 8;
                    return (
                      <td
                        key={idx}
                        className={`py-2 px-1 font-semibold ${
                          isPositive
                            ? isStrong
                              ? "bg-emerald-100 text-emerald-900 font-bold"
                              : "bg-emerald-50 text-emerald-800"
                            : isStrong
                            ? "bg-rose-100 text-rose-900 font-bold"
                            : "bg-rose-50 text-rose-800"
                        }`}
                      >
                        {isPositive ? `+${val.toFixed(1)}%` : `${val.toFixed(1)}%`}
                      </td>
                    );
                  })}
                  <td
                    className={`py-2 px-2 font-bold ${
                      ytd >= 0 ? "text-emerald-800 bg-emerald-100/60" : "text-rose-800 bg-rose-100/60"
                    }`}
                  >
                    {ytd >= 0 ? `+${ytd.toFixed(1)}%` : `${ytd.toFixed(1)}%`}
                  </td>
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