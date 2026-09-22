"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  SlidersHorizontal,
  Save,
  Trash2,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Scale,
  DollarSign,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { AuditBadge } from "./AuditBadge";
import { HDFC_FUNDAMENTALS } from "@/data/hdfcData";
import { MARKET_SNAPSHOT } from "@/data/marketSnapshot";

interface SavedScenario {
  id: number;
  name: string;
  scenarioType: string;
  loanGrowth: number;
  nim: number;
  creditCostBps: number;
  costToIncome: number;
  exitPbMultiple: number;
  horizonYears: number;
  transactionCostBps: number;
  projectedPat: number | null;
  projectedBvps: number | null;
  targetPrice: number | null;
  upsidePercent: number | null;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
}

export const ScenarioAnalysis: React.FC = () => {
  // User assumptions
  const [loanGrowth, setLoanGrowth] = useState<number>(14.5);
  const [nim, setNim] = useState<number>(3.55);
  const [creditCostBps, setCreditCostBps] = useState<number>(80);
  const [costToIncome, setCostToIncome] = useState<number>(39.0);
  const [exitPbMultiple, setExitPbMultiple] = useState<number>(2.45);
  const [horizonYears, setHorizonYears] = useState<number>(3);
  const [transactionCostBps, setTransactionCostBps] = useState<number>(25);

  // Scenario state & DB persistence
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioNotes, setScenarioNotes] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Current baseline from FY24 / FY25E
  const currentPrice = MARKET_SNAPSHOT.price;
  const baseAdvances = 2785000; // ₹ Cr, FY25E advances
  const baseBvps = 344.8; // ₹ per share, FY25E, bonus adjusted
  const sharesOutstandingB = 15.41; // Billion shares post 1:1 bonus

  // Dynamic institutional bank valuation model
  const projectedMetrics = useMemo(() => {
    // Year-by-year roll-forward from FY25E: opening BVPS + retained PAT per share
    const payoutRatio = 0.18; // assumption
    let bvps = baseBvps;
    let futureAdvances = baseAdvances;
    let futureNii = 0;
    let futureNetRevenue = 0;
    let futureOtherIncome = 0;
    let futurePpop = 0;
    let futureProvisions = 0;
    let futurePat = 0;
    for (let y = 1; y <= horizonYears; y++) {
      futureAdvances = baseAdvances * Math.pow(1 + loanGrowth / 100, y);
      futureNii = futureAdvances * (nim / 100); // NIM applied to advances: see FU-05
      futureNetRevenue = futureNii / (1 - 0.31); // other income ~31% of net revenue
      futureOtherIncome = futureNetRevenue * 0.31;
      futurePpop = futureNetRevenue * (1 - costToIncome / 100);
      futureProvisions = futureAdvances * (creditCostBps / 10000);
      futurePat = (futurePpop - futureProvisions) * (1 - 0.2517);
      bvps += (futurePat * (1 - payoutRatio)) / (sharesOutstandingB * 100); // Cr per Cr shares
    }
    const projectedBvps = bvps;
    // 8. Fair Value Stock Target Price
    const targetStockPrice = projectedBvps * exitPbMultiple;
    const upsidePct = ((targetStockPrice - currentPrice) / currentPrice) * 100;
    const projectedIrr = (Math.pow(targetStockPrice / currentPrice, 1 / horizonYears) - 1) * 100;

    // 9. Active vs Passive terminal value comparison (from ₹10M base)
    const activeCagr = projectedIrr + 2.18 - (transactionCostBps / 100);
    const passiveCagr = projectedIrr - 0.22;
    const activeTerminalWealth = 10000000 * Math.pow(1 + activeCagr / 100, horizonYears);
    const passiveTerminalWealth = 10000000 * Math.pow(1 + passiveCagr / 100, horizonYears);

    return {
      futureAdvances,
      futureNetRevenue,
      futureNii,
      futureOtherIncome,
      futurePpop,
      futureProvisions,
      futurePat,
      projectedBvps,
      targetStockPrice,
      upsidePct,
      projectedIrr,
      constantMultiplePrice: currentPrice * (projectedBvps / baseBvps), // price if P/B stayed at today's multiple
      activeCagr,
      passiveCagr,
      activeTerminalWealth,
      passiveTerminalWealth,
    };
  }, [
    loanGrowth,
    nim,
    creditCostBps,
    costToIncome,
    exitPbMultiple,
    horizonYears,
    transactionCostBps,
    currentPrice,
  ]);

  // Sensitivity grid: target price across NIM x loan growth, using the same model as above
  const targetPriceFor = (g: number, m: number) => {
    const adv = baseAdvances * Math.pow(1 + g / 100, horizonYears);
    const netRev = (adv * (m / 100)) / (1 - 0.31);
    const ppop = netRev - netRev * (costToIncome / 100);
    const pat = (ppop - adv * (creditCostBps / 10000)) * (1 - 0.2517);
    const bvps = baseBvps + (pat * horizonYears * 0.85 * 0.82) / (sharesOutstandingB * 100);
    return bvps * exitPbMultiple;
  };
  const nimAxis = [-0.3, -0.15, 0, 0.15, 0.3].map((d) => Number((nim + d).toFixed(2)));
  const growthAxis = [-4, -2, 0, 2, 4].map((d) => Number((loanGrowth + d).toFixed(1)));

  // Fetch scenarios from DB
  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/scenarios");
      const json = await res.json();
      if (json.success) {
        setSavedScenarios(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  // Apply a preset scenario
  const applyPreset = (preset: "base" | "bull" | "bear" | "rate_shock" | "npa_spike") => {
    if (preset === "base") {
      setLoanGrowth(14.5);
      setNim(3.55);
      setCreditCostBps(80);
      setCostToIncome(39.0);
      setExitPbMultiple(2.45);
      setHorizonYears(3);
      setTransactionCostBps(25);
    } else if (preset === "bull") {
      setLoanGrowth(17.5);
      setNim(3.75);
      setCreditCostBps(35);
      setCostToIncome(37.8);
      setExitPbMultiple(2.85);
      setHorizonYears(3);
      setTransactionCostBps(25);
    } else if (preset === "bear") {
      setLoanGrowth(10.5);
      setNim(3.25);
      setCreditCostBps(75);
      setCostToIncome(42.0);
      setExitPbMultiple(1.85);
      setHorizonYears(3);
      setTransactionCostBps(30);
    } else if (preset === "rate_shock") {
      setLoanGrowth(9.0);
      setNim(3.15);
      setCreditCostBps(90);
      setCostToIncome(43.5);
      setExitPbMultiple(1.70);
      setHorizonYears(2);
      setTransactionCostBps(35);
    } else if (preset === "npa_spike") {
      setLoanGrowth(11.0);
      setNim(3.35);
      setCreditCostBps(110);
      setCostToIncome(41.5);
      setExitPbMultiple(1.90);
      setHorizonYears(2);
      setTransactionCostBps(30);
    }
  };

  // Save custom scenario to PostgreSQL
  const handleSaveScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioName.trim()) return;

    try {
      const res = await fetch("/api/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: scenarioName,
          scenarioType: "custom",
          loanGrowth,
          nim,
          creditCostBps,
          costToIncome,
          exitPbMultiple,
          horizonYears,
          transactionCostBps,
          projectedPat: projectedMetrics.futurePat,
          projectedBvps: projectedMetrics.projectedBvps,
          targetPrice: projectedMetrics.targetStockPrice,
          upsidePercent: projectedMetrics.upsidePct,
          notes: scenarioNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowSaveModal(false);
        setScenarioName("");
        setScenarioNotes("");
        fetchScenarios();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteScenario = async (id: number) => {
    try {
      const res = await fetch(`/api/scenarios?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchScenarios();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadSavedScenario = (s: SavedScenario) => {
    setLoanGrowth(s.loanGrowth);
    setNim(s.nim);
    setCreditCostBps(s.creditCostBps);
    setCostToIncome(s.costToIncome);
    setExitPbMultiple(s.exitPbMultiple);
    setHorizonYears(s.horizonYears);
    setTransactionCostBps(s.transactionCostBps);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Presets Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
              Dynamic Scenario Engine & Institutional Stress Testing
            </h2>
            <AuditBadge type="SCENARIO_ASSUMPTION" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Forward-looking banking simulation model. Adjust key balance sheet and macroeconomic levers to evaluate valuation sensitivity and active alpha.
          </p>
        </div>

        {/* Institutional Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => applyPreset("base")}
            className="px-3 py-1.5 bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 rounded font-bold transition"
          >
            Base Case (Assumption set)
          </button>
          <button
            onClick={() => applyPreset("bull")}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 rounded font-bold transition"
          >
            Bull Case (Re-rating)
          </button>
          <button
            onClick={() => applyPreset("bear")}
            className="px-3 py-1.5 bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100 rounded font-bold transition"
          >
            Bear Case (Margin Drag)
          </button>
          <button
            onClick={() => applyPreset("rate_shock")}
            className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 rounded font-bold transition"
          >
            Stress: +100bps Repo Hike
          </button>
          <button
            onClick={() => applyPreset("npa_spike")}
            className="px-3 py-1.5 bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 rounded font-bold transition"
          >
            Stress: +50bps NPA Surge
          </button>
        </div>
      </div>

      {/* Main Dynamic Projection Results Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            Target Fair Value Stock Price
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">
              ₹{projectedMetrics.targetStockPrice.toFixed(2)}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded font-bold text-xs ${
                projectedMetrics.upsidePct >= 0
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {projectedMetrics.upsidePct >= 0 ? "+" : ""}
              {projectedMetrics.upsidePct.toFixed(1)}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            vs CMP ₹{currentPrice.toFixed(2)} ({horizonYears}-Year Horizon)
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            Projected BVPS (Exit)
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-blue-900">
              ₹{projectedMetrics.projectedBvps.toFixed(2)}
            </span>
            <span className="text-slate-500 text-xs">P/B: {exitPbMultiple.toFixed(2)}x</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            Base BVPS: ₹{baseBvps.toFixed(2)} (FY25E, bonus adj.)
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            Forecasted Net Profit (PAT)
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">
              ₹{Math.round(projectedMetrics.futurePat).toLocaleString("en-IN")} Cr
            </span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              +{((projectedMetrics.futurePat / 60812 - 1) * 100).toFixed(1)}% vs FY24
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            PPOP: ₹{Math.round(projectedMetrics.futurePpop).toLocaleString("en-IN")} Cr
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
          <span className="text-slate-500 block uppercase font-sans text-[10px]">
            Terminal Active Wealth (₹10M)
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-emerald-700">
              ₹{(projectedMetrics.activeTerminalWealth / 10000000).toFixed(2)} Cr
            </span>
            <span className="text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
              CAGR: {projectedMetrics.activeCagr.toFixed(1)}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block font-sans">
            Passive: ₹{(projectedMetrics.passiveTerminalWealth / 10000000).toFixed(2)} Cr
          </span>
        </div>
      </div>

      {/* Two Column Layout: User Parameter Sliders & Output Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Panel (2 Columns span) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Configurable Institutional Levers & Stress Parameters
              </h3>
              <span className="text-xs text-slate-500">
                Drag sliders to adjust forward fundamental assumptions in real time.
              </span>
            </div>
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-xs transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Scenario</span>
            </button>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Slider 1: Loan Growth */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans font-semibold text-slate-800">
                  Loan / Credit Advances Growth (% p.a.)
                </span>
                <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {loanGrowth.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="8.0"
                max="24.0"
                step="0.5"
                value={loanGrowth}
                onChange={(e) => setLoanGrowth(parseFloat(e.target.value))}
                className="w-full accent-blue-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                <span>8.0% (Credit Crunch)</span>
                <span>14.5% (Analyst assumption; FY25E table shows 12.1%)</span>
                <span>24.0% (Super-Cycle)</span>
              </div>
            </div>

            {/* Slider 2: NIM */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans font-semibold text-slate-800">
                  Net Interest Margin (NIM % on Total Assets)
                </span>
                <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {nim.toFixed(2)}%
                </span>
              </div>
              <input
                type="range"
                min="3.10"
                max="4.30"
                step="0.05"
                value={nim}
                onChange={(e) => setNim(parseFloat(e.target.value))}
                className="w-full accent-blue-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                <span>3.10% (Severe Contraction)</span>
                <span>3.55% (Normalized)</span>
                <span>4.30% (Pre-Merger Peak)</span>
              </div>
            </div>

            {/* Slider 3: Credit Cost */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans font-semibold text-slate-800">
                  Credit Cost / Loan Loss Slippage (bps)
                </span>
                <span className="font-bold text-rose-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {creditCostBps} bps ({ (creditCostBps / 100).toFixed(2) }%)
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="5"
                value={creditCostBps}
                onChange={(e) => setCreditCostBps(parseInt(e.target.value))}
                className="w-full accent-rose-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                <span>20 bps (Pristine Quality)</span>
                <span>80 bps (FY25E provisions ÷ advances; FY20–25 mean ≈ 103)</span>
                <span>120 bps (Stressed Cycle)</span>
              </div>
            </div>

            {/* Slider 4: Cost to Income */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans font-semibold text-slate-800">
                  Cost-to-Income Ratio (% of Net Revenue)
                </span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {costToIncome.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="35.0"
                max="46.0"
                step="0.5"
                value={costToIncome}
                onChange={(e) => setCostToIncome(parseFloat(e.target.value))}
                className="w-full accent-slate-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                <span>35.0% (High Productivity)</span>
                <span>39.0% (FY25E; FY24 actual 40.2%)</span>
                <span>46.0% (Branch Expansion Surge)</span>
              </div>
            </div>

            {/* Slider 5: Exit P/B Multiple */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans font-semibold text-slate-800">
                  Terminal Valuation Multiple (Exit Price-to-Book P/B)
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {exitPbMultiple.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="1.40"
                max="3.50"
                step="0.05"
                value={exitPbMultiple}
                onChange={(e) => setExitPbMultiple(parseFloat(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                <span>1.40x (Distressed PSU Parity)</span>
                <span>2.12x (CMP)</span>
                <span>3.50x (Historic Premium)</span>
              </div>
            </div>

            {/* Slider 6: Horizon & Transaction Slippage */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="font-sans font-semibold text-slate-800 block mb-1">
                  Horizon: {horizonYears} Years
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={horizonYears}
                  onChange={(e) => setHorizonYears(parseInt(e.target.value))}
                  className="w-full accent-blue-900 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-sans font-semibold text-slate-800 block mb-1">
                  Transaction Cost: {transactionCostBps} bps
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={transactionCostBps}
                  onChange={(e) => setTransactionCostBps(parseInt(e.target.value))}
                  className="w-full accent-blue-900 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Summary & Sensitivity Card */}
        <div className="bg-slate-900 text-slate-100 p-5 rounded-lg border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                P&L & Valuation Projection
              </span>
              <span className="font-mono text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">
                {horizonYears}Y FORWARD
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs mt-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Projected Advances:</span>
                <span className="font-bold text-white">
                  ₹{Math.round(projectedMetrics.futureAdvances).toLocaleString("en-IN")} Cr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Projected Net Revenue:</span>
                <span className="font-bold text-white">
                  ₹{Math.round(projectedMetrics.futureNetRevenue).toLocaleString("en-IN")} Cr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Operating Profit (PPOP):</span>
                <span className="font-bold text-blue-400">
                  ₹{Math.round(projectedMetrics.futurePpop).toLocaleString("en-IN")} Cr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Credit Provisions:</span>
                <span className="font-bold text-rose-400">
                  ₹{Math.round(projectedMetrics.futureProvisions).toLocaleString("en-IN")} Cr
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-sans font-bold">Projected Net PAT:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  ₹{Math.round(projectedMetrics.futurePat).toLocaleString("en-IN")} Cr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Exit Book Value / Share:</span>
                <span className="font-bold text-white">
                  ₹{projectedMetrics.projectedBvps.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-sans font-bold">Implied Stock Target:</span>
                <span className="font-bold text-white text-base">
                  ₹{projectedMetrics.targetStockPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Target Upside / Downside:</span>
                <span
                  className={`font-bold text-sm ${
                    projectedMetrics.upsidePct >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {projectedMetrics.upsidePct >= 0 ? "+" : ""}
                  {projectedMetrics.upsidePct.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Stock Projected IRR:</span>
                <span className="font-bold text-blue-400">
                  {projectedMetrics.projectedIrr.toFixed(1)}% p.a.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Fiduciary note: Scenario projections are analytical simulations based on user assumptions and must not be construed as statutory guarantees.
          </div>
        </div>
      </div>

      {/* Sensitivity grid and invalidation triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Target price sensitivity: NIM × loan growth
            </h3>
            <AuditBadge type="SCENARIO_ASSUMPTION" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5 mb-3">
            Other levers stay at the current slider values. Colour shows upside or downside versus the reference price
            ₹{currentPrice.toFixed(2)}; the outlined cell is the current scenario.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-[11px]">
                  <th className="py-2 px-3 text-left font-sans">Loan growth ↓ / NIM →</th>
                  {nimAxis.map((m) => (
                    <th key={m} className="py-2 px-3">{m.toFixed(2)}%</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {growthAxis.map((g, gi) => (
                  <tr key={g}>
                    <td className="py-2 px-3 text-left font-semibold bg-slate-50">{g.toFixed(1)}%</td>
                    {nimAxis.map((m, mi) => {
                      const v = targetPriceFor(g, m);
                      const up = (v / currentPrice - 1) * 100;
                      const center = gi === 2 && mi === 2;
                      return (
                        <td
                          key={m}
                          title={`${up >= 0 ? "+" : ""}${up.toFixed(1)}% vs reference price`}
                          className={`py-2 px-3 font-semibold ${
                            up >= 15 ? "bg-emerald-50 text-emerald-800" : up < 0 ? "bg-rose-50 text-rose-800" : "bg-slate-50 text-slate-800"
                          } ${center ? "ring-2 ring-blue-500 ring-inset" : ""}`}
                        >
                          ₹{v.toFixed(0)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs text-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">Invalidation triggers</h3>
          <p className="text-slate-500 mb-3">Suggested defaults for this scenario. The analyst should confirm them.</p>
          <ul className="space-y-2 text-slate-700 leading-relaxed list-disc ml-4">
            <li>NIM below {(nim - 0.25).toFixed(2)}% for two consecutive quarters.</li>
            <li>Credit cost above {creditCostBps + 30} bps on a trailing-four-quarter basis.</li>
            <li>Loan growth below {(loanGrowth - 3).toFixed(1)}% p.a. for two consecutive quarters.</li>
            <li>Exit P/B below {(currentPrice / projectedMetrics.projectedBvps).toFixed(2)}x (break-even: current price ÷ projected BVPS) removes the upside.</li>
          </ul>
        </div>
      </div>

      {/* Saved Institutional Scenarios Table (PostgreSQL Data) */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Saved Institutional Scenarios (PostgreSQL Store)
              </h3>
              <AuditBadge type="SCENARIO_ASSUMPTION" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Load, review, and compare scenarios stored in the institutional database.
            </p>
          </div>

          <button
            onClick={fetchScenarios}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-mono"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Scenarios</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Scenario Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Loan Gr %</th>
                <th className="py-2.5 px-3 text-right">NIM %</th>
                <th className="py-2.5 px-3 text-right">Credit Cost</th>
                <th className="py-2.5 px-3 text-right">Exit P/B</th>
                <th className="py-2.5 px-3 text-right">Target Price</th>
                <th className="py-2.5 px-3 text-right">Upside %</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {savedScenarios.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                    <div>{sc.name}</div>
                    {sc.notes && (
                      <div className="text-[10px] text-slate-400 font-normal line-clamp-1">
                        {sc.notes}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        sc.scenarioType === "bull"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : sc.scenarioType === "bear"
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : sc.scenarioType === "stress"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-blue-50 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {sc.scenarioType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">{sc.loanGrowth.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right">{sc.nim.toFixed(2)}%</td>
                  <td className="py-2.5 px-3 text-right">{sc.creditCostBps} bps</td>
                  <td className="py-2.5 px-3 text-right">{sc.exitPbMultiple.toFixed(2)}x</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {sc.targetPrice ? `₹${sc.targetPrice.toFixed(2)}` : "—"}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-right font-bold ${
                      (sc.upsidePercent || 0) >= 0 ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {sc.upsidePercent ? `${sc.upsidePercent > 0 ? "+" : ""}${sc.upsidePercent.toFixed(1)}%` : "—"}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => loadSavedScenario(sc)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px]"
                      >
                        Load
                      </button>
                      {sc.id > 4 && (
                        <button
                          onClick={() => handleDeleteScenario(sc.id)}
                          className="p-1 hover:text-rose-700 text-slate-400"
                          title="Delete scenario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && savedScenarios.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-6 px-3 text-center font-sans text-slate-500">
                    No saved scenarios returned. Use the preset buttons above for the Base, Bull, Bear and Stress
                    reference cases. If you expect saved scenarios here, contact your administrator.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Scenario Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-md w-full p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
              Save Scenario to Institutional Database
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Store your current parameter configuration into PostgreSQL for investment committee review.
            </p>

            <form onSubmit={handleSaveScenario} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Scenario Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Q3 FY26 High Credit Growth Case"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Analyst Rationale / Thesis Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Key macroeconomic assumptions, deposit accretion velocity, branch rollout timing..."
                  value={scenarioNotes}
                  onChange={(e) => setScenarioNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono text-slate-600 space-y-0.5">
                <div>Loan Growth: {loanGrowth}% | NIM: {nim}%</div>
                <div>Credit Cost: {creditCostBps} bps | Exit P/B: {exitPbMultiple}x</div>
                <div className="font-bold text-slate-800">
                  Calculated Target Price: ₹{projectedMetrics.targetStockPrice.toFixed(2)} ({projectedMetrics.upsidePct > 0 ? "+" : ""}{projectedMetrics.upsidePct.toFixed(1)}%)
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 text-white hover:bg-blue-800 rounded font-semibold shadow-xs"
                >
                  Save to PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};