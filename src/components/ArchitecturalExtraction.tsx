"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  Calculator,
  Sliders,
  Layout,
  ExternalLink,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { ARCHITECTURAL_AUDIT_DATA } from "@/data/architecturalAudit";
import { AuditBadge } from "./AuditBadge";

export const ArchitecturalExtraction: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (code: string) => {
    setExpandedItems((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const currentSection = ARCHITECTURAL_AUDIT_DATA.find((s) => s.stepNumber === activeStep) || ARCHITECTURAL_AUDIT_DATA[0];

  return (
    <div className="space-y-6">
      {/* Top Advisory Banner */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
              Senior Institutional Architect Specification & Requirements Extraction
            </h2>
            <AuditBadge type="HISTORICAL_OBSERVATION" customText="SELF-ASSESSED" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal institutional deliverable executing Steps 1 through 6: Extract requirements, identify missing data, define calculations, specify interactive controls, and prescribe final presentation modules.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded font-bold border border-amber-200">
            STATUS: SELF-ASSESSED · SEE AUDIT FLAGS
          </span>
        </div>
      </div>

      {/* 6 Steps Navigation Pills */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {ARCHITECTURAL_AUDIT_DATA.map((sec) => {
          const isActive = sec.stepNumber === activeStep;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveStep(sec.stepNumber)}
              className={`p-3 rounded-lg border text-left transition ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold opacity-75">
                  Step 0{sec.stepNumber}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? "bg-emerald-400" : "bg-emerald-600"
                  }`}
                ></span>
              </div>
              <div className="mt-1 font-bold text-xs line-clamp-1">
                {sec.sectionTitle.split(". ")[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Step Detail Container */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-blue-700 block">
              Architectural Section 0{currentSection.stepNumber} of 06
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {currentSection.sectionTitle}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {currentSection.items.length} Specifications Documented
          </span>
        </div>

        {/* Executive Summary of the Step */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
          <strong className="text-slate-900 font-semibold block mb-0.5">
            Architectural Summary:
          </strong>
          {currentSection.executiveSummary}
        </div>

        {/* List of Requirements / Items */}
        <div className="divide-y divide-slate-100">
          {currentSection.items.map((item) => {
            const isExpanded = expandedItems[item.code] ?? true;
            return (
              <div key={item.code} className="py-3">
                <div
                  onClick={() => toggleItem(item.code)}
                  className="flex flex-wrap items-center justify-between gap-2 cursor-pointer hover:text-blue-900 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                      {item.code}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-slate-500 hidden md:inline">
                      {item.institutionalStandard}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        item.status === "Implemented"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.status === "Verified"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {item.status}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2.5 pl-2 text-xs text-slate-600 leading-relaxed border-l-2 border-slate-200 font-sans">
                    <p>{item.details}</p>
                    <div className="mt-1 text-[11px] font-mono text-slate-400">
                      Benchmark Reference: <span className="text-slate-600">{item.institutionalStandard}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};