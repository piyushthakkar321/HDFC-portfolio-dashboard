"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Info,
  Building,
  PlusCircle,
  RefreshCw,
  BookOpen,
  Scale,
  Award,
} from "lucide-react";
import { AuditBadge, ClassificationType } from "./AuditBadge";

interface CommitteeNoteItem {
  id: number;
  author: string;
  role: string;
  category: string;
  title: string;
  content: string;
  recommendation: string;
  targetAllocationPct: number | null;
  status: string;
  classification: string;
  createdAt: string;
}

export const MethodologyAudit: React.FC = () => {
  const [notes, setNotes] = useState<CommitteeNoteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);

  // Form states
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("Equity Research Analyst");
  const [category, setCategory] = useState("fundamental");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recommendation, setRecommendation] = useState("OVERWEIGHT");
  const [targetAllocationPct, setTargetAllocationPct] = useState(34.0);
  const [classification, setClassification] = useState<ClassificationType>("INTERPRETATION");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/committee-notes");
      const json = await res.json();
      if (json.success) {
        setNotes(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !title || !content) return;

    try {
      const res = await fetch("/api/committee-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author,
          role,
          category,
          title,
          content,
          recommendation,
          targetAllocationPct,
          classification,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddNote(false);
        setAuthor("");
        setTitle("");
        setContent("");
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Advisory Banner */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
              Methodology, Regulatory Data Sources & Committee Governance
            </h2>
            <AuditBadge type="HISTORICAL_OBSERVATION" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Statutory sources, mathematical formula definitions, 4-tier classification audit tags, and Investment Committee sign-offs.
          </p>
        </div>

        <button
          onClick={() => setShowAddNote(true)}
          className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-xs transition"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Committee Audit Note</span>
        </button>
      </div>

      {/* 4-Tier Classification Architecture Guide */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>Institutional 4-Tier Classification Governance Standard</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          To comply with institutional fiduciary governance, every data point, chart, and metric across this workstation is rigorously tagged into one of four distinct categories:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Historical Observation</span>
              <AuditBadge type="HISTORICAL_OBSERVATION" />
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Factual, unmodified historical data verified from statutory filings (HDFC Bank Audited Annual Reports FY20-24, Q3 FY25 disclosures, RBI DBIE, NSE official ticks). No synthetic data.
            </p>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-lg border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950">Calculated Metric</span>
              <AuditBadge type="CALCULATED_METRIC" />
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Mathematical outputs deterministically calculated from underlying historical facts using standard quantitative formulas (Sharpe, Beta, Jensen&apos;s Alpha, Tracking Error, DuPont ROE, 200 DMA).
            </p>
          </div>

          <div className="p-3.5 bg-amber-50/60 rounded-lg border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950">Scenario Assumption</span>
              <AuditBadge type="SCENARIO_ASSUMPTION" />
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Forward-looking simulation inputs configured by the user or analyst (Credit Growth %, NIM %, Credit Cost bps, Exit Multiple). Clearly partitioned from historical truth.
            </p>
          </div>

          <div className="p-3.5 bg-purple-50/60 rounded-lg border border-purple-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-950">Interpretation</span>
              <AuditBadge type="INTERPRETATION" />
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Qualitative equity research commentary and portfolio manager opinions. Marked as professional interpretation under fiduciary standards.
            </p>
          </div>
        </div>
      </div>

      {/* Statutory Data Sources & Corporate Action Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span>Statutory Data Sources & Benchmark Verification</span>
          </h3>
          <ul className="divide-y divide-slate-100 text-xs font-mono">
            <li className="py-2 flex justify-between">
              <span className="font-sans font-semibold text-slate-800">Financial Statements:</span>
              <span className="text-slate-600">HDFC Bank Ltd Audited Reports (FY20 - FY24)</span>
            </li>
            <li className="py-2 flex justify-between">
              <span className="font-sans font-semibold text-slate-800">Quarterly Run-Rate:</span>
              <span className="text-slate-600">Q3 FY25 Statutory Disclosures (Jan 2025)</span>
            </li>
            <li className="py-2 flex justify-between">
              <span className="font-sans font-semibold text-slate-800">Market Price Data:</span>
              <span className="text-slate-600">National Stock Exchange of India (NSE: HDFCBANK)</span>
            </li>
            <li className="py-2 flex justify-between">
              <span className="font-sans font-semibold text-slate-800">Benchmark Index:</span>
              <span className="text-slate-600">NSE Indices Ltd (Nifty Bank Index / Nifty 50)</span>
            </li>
            <li className="py-2 flex justify-between">
              <span className="font-sans font-semibold text-slate-800">Risk-Free Rate (Rf):</span>
              <span className="text-slate-600 font-bold text-blue-900">6.80% (10Y Indian Sovereign G-Sec)</span>
            </li>
            <li className="py-2 flex justify-between">
              <span className="font-sans font-semibold text-slate-800">Banking Macro Statistics:</span>
              <span className="text-slate-600">Reserve Bank of India (RBI DBIE)</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-700" />
            <span>Corporate Action & Amalgamation Audit Notes</span>
          </h3>
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <strong className="text-slate-900 block font-mono text-[11px] mb-0.5">
                1. July 1, 2023 — HDFC Ltd Reverse Merger Amalgamation
              </strong>
              Housing Development Finance Corporation (parent HDFC Ltd) merged into HDFC Bank. Balance sheet advances expanded ~55% overnight with ₹6.2 Lakh Cr mortgage assets. Reported NIM contracted by ~68 bps due to SLR/CRR regulatory requirements on merged wholesale borrowings.
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <strong className="text-slate-900 block font-mono text-[11px] mb-0.5">
                2. August 26, 2025 — 1:1 Bonus Issue Restatement
              </strong>
              HDFC Bank issued 1:1 bonus shares (ex-date August 26, 2025), doubling equity shares to 15.41 Billion. All per-share time series (EPS, BVPS, Market Price, DMA) are strictly adjusted for uniform institutional comparability.
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Formulas Table */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-700" />
          <span>Core Quantitative Formula Specifications</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Metric</th>
                <th className="py-2.5 px-3">Mathematical Equation</th>
                <th className="py-2.5 px-3">Institutional Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-sans font-bold text-slate-900">Sharpe Ratio</td>
                <td className="py-2.5 px-3 text-blue-900 font-bold">(R_p - R_f) / σ_p</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">
                  Excess return over 6.80% 10Y G-Sec per unit of total annualized volatility.
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-sans font-bold text-slate-900">Treynor Ratio</td>
                <td className="py-2.5 px-3 text-blue-900 font-bold">(R_p - R_f) / β_p</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">
                  Excess return generated per unit of systematic market covariance (beta).
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-sans font-bold text-slate-900">Jensen&apos;s Alpha</td>
                <td className="py-2.5 px-3 text-blue-900 font-bold">R_p - [R_f + β_p × (R_m - R_f)]</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">
                  Idiosyncratic active value-add over the Capital Asset Pricing Model (CAPM) required rate of return.
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-sans font-bold text-slate-900">Tracking Error</td>
                <td className="py-2.5 px-3 text-blue-900 font-bold">sqrt(252) × stdev(R_p,t - R_b,t)</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">
                  Annualized standard deviation of daily return differences between portfolio and benchmark.
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-sans font-bold text-slate-900">Information Ratio</td>
                <td className="py-2.5 px-3 text-blue-900 font-bold">(R_p - R_b) / Tracking Error</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">
                  Active excess return generated per unit of active risk taken.
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-sans font-bold text-slate-900">Sortino Ratio</td>
                <td className="py-2.5 px-3 text-blue-900 font-bold">(R_p - R_f) / σ_downside</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">
                  Evaluates downside risk exclusively below MAR (Minimum Acceptable Return = 6.80%).
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-sans font-bold text-slate-900">DuPont 3-Stage ROE</td>
                <td className="py-2.5 px-3 text-blue-900 font-bold">(PAT / Rev) × (Rev / Assets) × (Assets / Equity)</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">
                  Decomposes bank ROE into Net Margin × Asset Utilization × Leverage Multiplier.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Investment Committee Notes & Analyst Sign-Offs (PostgreSQL Data) */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-700" />
              <span>Investment Committee Audit Log & Sign-Offs</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Committee notes and analyst reviews stored in PostgreSQL audit repository.
            </p>
          </div>

          <button
            onClick={fetchNotes}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-mono"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Notes</span>
          </button>
        </div>

        <div className="space-y-4">
          {notes.map((n) => (
            <div
              key={n.id}
              className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                  <AuditBadge type={n.classification as ClassificationType} />
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="font-bold text-blue-900">
                    Mandate Rec: {n.recommendation}
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600">
                    Target Alloc: {n.targetAllocationPct}%
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {n.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed font-sans">{n.content}</p>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-mono">
                <span>
                  Author: <strong className="text-slate-800">{n.author}</strong> ({n.role})
                </span>
                <span>Category: {n.category.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Committee Audit Note Modal */}
      {showAddNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-lg w-full p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
              Add Investment Committee Audit Note
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Commit a formal analyst research note or committee sign-off to PostgreSQL.
            </p>

            <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Mehta, CFA"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Author Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead BFSI Analyst"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Review of Wholesale Debt Re-pricing & Margins"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-xs"
                  >
                    <option value="fundamental">Fundamental</option>
                    <option value="active_allocation">Active Allocation</option>
                    <option value="technical">Technical</option>
                    <option value="macro_risk">Macro Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Recommendation</label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-xs font-mono font-bold"
                  >
                    <option value="OVERWEIGHT">OVERWEIGHT</option>
                    <option value="EQUAL_WEIGHT">EQUAL_WEIGHT</option>
                    <option value="UNDERWEIGHT">UNDERWEIGHT</option>
                    <option value="MONITOR">MONITOR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Classification</label>
                  <select
                    value={classification}
                    onChange={(e) => setClassification(e.target.value as ClassificationType)}
                    className="w-full border border-slate-300 rounded p-2 text-xs font-mono"
                  >
                    <option value="INTERPRETATION">INTERPRETATION</option>
                    <option value="HISTORICAL_OBSERVATION">HISTORICAL_OBSERVATION</option>
                    <option value="CALCULATED_METRIC">CALCULATED_METRIC</option>
                    <option value="SCENARIO_ASSUMPTION">SCENARIO_ASSUMPTION</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Analysis Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail quantitative observations, risk factors, NIM dynamics, or rebalancing rationale..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddNote(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 text-white hover:bg-blue-800 rounded font-semibold shadow-xs"
                >
                  Save Note to Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
