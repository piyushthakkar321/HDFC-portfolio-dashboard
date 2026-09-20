"use client";

import React from "react";
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
} from "lucide-react";
import type { DashboardTab } from "./Header";

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
  return (
    <aside className="side z-40 flex shrink-0 flex-col sticky top-0 h-screen">
      <div className="flex items-center justify-center px-2 py-4">
        <div className="brand-mark">A</div>
      </div>

      <nav
        aria-label="Dashboard modules"
        className="no-scrollbar flex flex-1 flex-col items-center gap-0 overflow-y-auto px-2 pb-3"
      >
        {GROUPS.map((group) => (
          <div key={group.label} className="mb-2 flex w-full flex-col items-center gap-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={active ? "page" : undefined}
                  className="nav-item w-full whitespace-nowrap"
                >
                  <span className="nav-icon">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex justify-center p-3">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
      </div>
    </aside>
  );
};