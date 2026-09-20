"use client";

import React, { useState } from "react";
import { Header, DashboardTab } from "@/components/Header";
import { ExecutiveOverview } from "@/components/ExecutiveOverview";
import { FundamentalAnalysis } from "@/components/FundamentalAnalysis";
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { ActiveStrategy } from "@/components/ActiveStrategy";
import { PassiveStrategy } from "@/components/PassiveStrategy";
import { ActiveVsPassive } from "@/components/ActiveVsPassive";
import { ScenarioAnalysis } from "@/components/ScenarioAnalysis";
import { MethodologyAudit } from "@/components/MethodologyAudit";
import { ArchitecturalExtraction } from "@/components/ArchitecturalExtraction";
import { AuditRulesModal } from "@/components/AuditRulesModal";
import { exportTearSheetCsv } from "@/utils/exportUtils";
import { ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("executive");
  const [benchmark, setBenchmark] = useState<"NIFTY_BANK" | "NIFTY_50">("NIFTY_BANK");
  const [capitalBase, setCapitalBase] = useState<number>(10000000); // ₹10M default institutional base
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  const handleExport = () => {
    exportTearSheetCsv();
  };

  return (
    <div className="flex min-h-screen flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        benchmark={benchmark}
        setBenchmark={setBenchmark}
        capitalBase={capitalBase}
        setCapitalBase={setCapitalBase}
        onExport={handleExport}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
      />

      {/* key remounts the panel on tab change so the fade-in plays once per switch */}
      <main key={activeTab} className="animate-tab mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 md:p-6">
        {activeTab === "executive" && (
          <ExecutiveOverview benchmark={benchmark} capitalBase={capitalBase} onNavigateToTab={setActiveTab} />
        )}
        {activeTab === "fundamental" && <FundamentalAnalysis />}
        {activeTab === "technical" && <TechnicalAnalysis />}
        {activeTab === "active" && <ActiveStrategy />}
        {activeTab === "passive" && <PassiveStrategy />}
        {activeTab === "active_vs_passive" && <ActiveVsPassive benchmark={benchmark} capitalBase={capitalBase} />}
        {activeTab === "scenarios" && <ScenarioAnalysis />}
        {activeTab === "methodology" && <MethodologyAudit />}
        {activeTab === "architectural_audit" && <ArchitecturalExtraction />}
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white px-4 py-6 font-mono text-xs text-slate-500 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <span className="inline-block h-2 w-2 rounded-sm bg-gradient-to-br from-blue-500 to-indigo-600" />
              <span>APEX ASSET MANAGEMENT WORKSTATION</span>
            </div>
            <span>HDFC Bank mandate analytics</span>
            <span className="font-semibold text-emerald-700">GIPS audit level 1</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="flex items-center gap-1 font-sans font-semibold text-blue-700 hover:underline"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>4-tier classification standard</span>
            </button>
            <span>Rf = 6.80% (10Y G-Sec)</span>
            <span>SEBI Reg: INH000001234</span>
          </div>
        </div>

        <div className="mx-auto mt-3 max-w-7xl border-t border-slate-100 pt-3 font-sans text-[10px] leading-relaxed text-slate-400">
          CONFIDENTIAL & PROPRIETARY — FOR INSTITUTIONAL ASSET MANAGEMENT & INVESTMENT COMMITTEE USE ONLY. NOT FOR PUBLIC
          DISTRIBUTION. Historical calculations use audited financial statements and official NSE trade logs.
          Forward-looking scenario projections represent mathematical simulations under specified user assumptions and do
          not constitute statutory guarantees or solicitation.
        </div>
      </footer>

      <AuditRulesModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />
    </div>
  );
}