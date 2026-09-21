"use client";

import React from "react";
import { AuditBadge, BADGE_CONFIG, ClassificationType } from "./AuditBadge";

const ORDER: ClassificationType[] = [
  "HISTORICAL_OBSERVATION",
  "CALCULATED_METRIC",
  "ESTIMATE",
  "SIMULATED",
  "SCENARIO_ASSUMPTION",
  "INTERPRETATION",
];

export const BadgeLegend: React.FC = () => (
  <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2 lg:grid-cols-3">
    {ORDER.map((t) => (
      <div key={t} className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <AuditBadge type={t} showTooltip={false} />
        <div>
          <div className="font-semibold text-slate-800">{BADGE_CONFIG[t].label}</div>
          <p className="mt-0.5 leading-relaxed text-slate-500">{BADGE_CONFIG[t].desc}</p>
        </div>
      </div>
    ))}
  </div>
);