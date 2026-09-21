"use client";

import React, { useState } from "react";
import {
  Building2,
  BarChart3,
  TrendingUp,
  Compass,
  Layers,
  Scale,
  SlidersHorizontal,
  FileText,
  FileSpreadsheet,
  ShieldCheck,
  Pin,
  PinOff,
} from "lucide-react";
import type { DashboardTab } from "./Header";
import { COMPLIANCE } from "@/data/compliance";

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ id: "executive", label: "Executive Overview", icon: Building2 }],
  },
  {
    label: "Research",
    items: [
      { id: "fundamental", label: "Fundamental Analysis", icon: BarChart3 },
      { id: "technical", label: "Technical Analysis", icon: TrendingUp },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { id: "active", label: "Active Strategy", icon: Compass },
      { id: "passive", label: "Passive Strategy", icon: Layers },
      { id: "active_vs_passive", label: "Active vs Passive", icon: Scale },
    ],
  },
  {
    label: "Modelling",
    items: [{ id: "scenarios", label: "Scenario Analysis", icon: SlidersHorizontal }],
  },
  {
    label: "Governance",
    items: [
      { id: "methodology", label: "Methodology & Audit", icon: FileText },
      { id: "architectural_audit", label: "Architectural Extraction", icon: FileSpreadsheet, badge: "Spec" },
    ],
  },
];

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const expanded = pinned || hovered;

  return (
    <div
      className={`shrink-0 transition-[width] duration-200 lg:sticky lg:top-0 lg:z-50 lg:h-screen ${
        pinned ? "lg:w-64" : "lg:w-[72px]"
      }`}
    >
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`side z-40 flex shrink-0 flex-col overflow-hidden transition-[width] duration-200 lg:absolute lg:inset-y-0 lg:left-0 lg:h-full ${
        expanded ? "lg:!w-64 lg:!min-w-0" : "lg:!w-[72px] lg:!min-w-0"
      } ${expanded && !pinned ? "lg:shadow-xl" : ""}`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-4 lg:py-5 ${
          expanded ? "lg:px-5" : "lg:justify-center lg:px-0"
        }`}
      >
        <div className="brand-mark shrink-0">A</div>
        <div className={`min-w-0 flex-1 leading-tight ${expanded ? "" : "lg:hidden"}`}>
          <div className="whitespace-nowrap text-sm font-semibold tracking-tight text-slate-900">
            Apex Asset Management
          </div>
          <div className="whitespace-nowrap text-[11px] text-slate-500">HDFC Bank mandate workstation</div>
        </div>
        <button
          type="button"
          onClick={() => setPinned((p) => !p)}
          aria-label={pinned ? "Unpin sidebar" : "Pin sidebar open"}
          aria-pressed={pinned}
          title={pinned ? "Unpin sidebar" : "Pin sidebar open"}
          className={`hidden rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 ${
            expanded ? "lg:block" : ""
          }`}
        >
          {pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
        </button>
      </div>

      <nav
        aria-label="Dashboard modules"
        className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:gap-0 lg:overflow-y-auto"
      >
        {GROUPS.map((group) => (
          <div key={group.label} className="flex gap-1 lg:mb-4 lg:flex-col">
            <div
              className={`hidden px-3 pb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.13em] text-slate-400 ${
                expanded ? "lg:block" : ""
              }`}
            >
              {group.label}
            </div>
            {/* thin divider replaces the group title when collapsed */}
            <div className={`mx-3 mb-1 hidden h-px bg-slate-200 ${expanded ? "" : "lg:block"}`} />
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={active ? "page" : undefined}
                  title={item.label}
                  className={`nav-item shrink-0 whitespace-nowrap lg:w-full ${
                    expanded ? "" : "lg:justify-center"
                  }`}
                >
                  <span className="nav-icon">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className={expanded ? "" : "lg:hidden"}>{item.label}</span>
                  {item.badge && (
                    <span className={`nav-badge ${expanded ? "" : "lg:hidden"}`}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="hidden p-3 lg:block">
        {expanded ? (
          <div className="rounded-[11px] border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed">
            <div className="flex items-center gap-1.5 whitespace-nowrap font-semibold text-amber-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Demo build · not GIPS-verified</span>
            </div>
            <div className="mt-1 text-slate-500">
              Rf 6.80% (assumed)
              <br />
              SEBI Reg: {COMPLIANCE.sebiRegistration}
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center text-amber-600"
            title="Demo build · not GIPS-verified"
          >
            <ShieldCheck className="h-4 w-4" />
          </div>
        )}
      </div>
    </aside>
    </div>
  );
};