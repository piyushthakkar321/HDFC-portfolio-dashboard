"use client";

import React, { useState } from "react";
import { Header, DashboardTab } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
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
import { DataIntegrityBar } from "@/components/DataIntegrityBar";
import { COMPLIANCE } from "@/data/compliance";
import { exportTearSheetCsv } from "@/utils/exportUtils";
import { ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("executive");
  const [benchmark, setBenchmark] = useState<"NIFTY_BANK" | "NIFTY_50">("NIFTY_BANK");
  const [capitalBase, setCapitalBase] = useState<number>(10000000); // ₹10M default institutional base
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 lg:flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          benchmark={benchmark}
          setBenchmark={setBenchmark}
          capitalBase={capitalBase}
          setCapitalBase={setCapitalBase}
          onExport={exportTearSheetCsv}
          onOpenAuditModal={() => setIsAuditModalOpen(true)}
        />

        <div className="mx-auto w-full max-w-[1400px] px-4 pt-4 md:px-6 lg:px-8 lg:pt-6">
          <DataIntegrityBar benchmark={benchmark} />
        </div>

        {/* key remounts the panel on tab change so the fade-in plays once per switch */}
        <main key={activeTab} className="animate-tab mx-auto w-full max-w-[1400px] flex-1 space-y-6 p-4 md:p-6 lg:p-8">
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

        <footer className="footer border-t border-slate-200 px-4 py-6 text-xs text-slate-500 md:px-8">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-semibold text-slate-800">Apex Asset Management Workstation</span>
              <span>HDFC Bank mandate analytics</span>
              <span className="font-semibold text-amber-700">{COMPLIANCE.gipsStatement}</span>
              <span>SEBI Reg: {COMPLIANCE.sebiRegistration}</span>
            </div>
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="flex items-center gap-1 font-semibold text-blue-700 hover:underline"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Data classification legend</span>
            </button>
          </div>

          <p className="mt-3 border-t border-slate-100 pt-3 text-[10px] leading-relaxed text-slate-400">
            CONFIDENTIAL & PROPRIETARY — FOR INSTITUTIONAL ASSET MANAGEMENT & INVESTMENT COMMITTEE USE ONLY. NOT FOR
            PUBLIC DISTRIBUTION. Historical calculations use audited financial statements and official NSE trade logs.
            Forward-looking scenario projections represent mathematical simulations under specified user assumptions and
            do not constitute statutory guarantees or solicitation.
          </p>
        </footer>
      </div>

      <AuditRulesModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />
    </div>
  );
}