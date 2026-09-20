import { pgTable, serial, text, doublePrecision, integer, timestamp } from "drizzle-orm/pg-core";

export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  scenarioType: text("scenario_type").notNull().default("custom"), // 'base' | 'bull' | 'bear' | 'custom' | 'stress'
  loanGrowth: doublePrecision("loan_growth").notNull().default(14.0),
  nim: doublePrecision("nim").notNull().default(3.50),
  creditCostBps: integer("credit_cost_bps").notNull().default(45),
  costToIncome: doublePrecision("cost_to_income").notNull().default(39.5),
  exitPbMultiple: doublePrecision("exit_pb_multiple").notNull().default(2.40),
  horizonYears: integer("horizon_years").notNull().default(3),
  transactionCostBps: integer("transaction_cost_bps").notNull().default(25),
  projectedPat: doublePrecision("projected_pat"),
  projectedBvps: doublePrecision("projected_bvps"),
  targetPrice: doublePrecision("target_price"),
  upsidePercent: doublePrecision("upside_percent"),
  notes: text("notes"),
  createdBy: text("created_by").default("Portfolio Manager"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const committeeNotes = pgTable("committee_notes", {
  id: serial("id").primaryKey(),
  author: text("author").notNull(),
  role: text("role").notNull(),
  category: text("category").notNull(), // 'fundamental' | 'technical' | 'active_allocation' | 'passive_mandate' | 'macro_risk'
  title: text("title").notNull(),
  content: text("content").notNull(),
  recommendation: text("recommendation").notNull().default("OVERWEIGHT"), // 'OVERWEIGHT' | 'EQUAL_WEIGHT' | 'UNDERWEIGHT' | 'MONITOR'
  targetAllocationPct: doublePrecision("target_allocation_pct").default(32.5),
  status: text("status").notNull().default("approved"), // 'approved' | 'under_review' | 'archived'
  classification: text("classification").notNull().default("INTERPRETATION"), // 'HISTORICAL_OBSERVATION' | 'CALCULATED_METRIC' | 'SCENARIO_ASSUMPTION' | 'INTERPRETATION'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rebalanceEvents = pgTable("rebalance_events", {
  id: serial("id").primaryKey(),
  eventDate: text("event_date").notNull(),
  strategy: text("strategy").notNull(),
  triggerType: text("trigger_type").notNull(), // 'Quarterly Scheduled' | 'Drift Threshold >2.5%' | 'Corporate Action'
  assetTraded: text("asset_traded").notNull(),
  action: text("action").notNull(), // 'BUY' | 'SELL' | 'REBALANCE'
  weightBefore: doublePrecision("weight_before").notNull(),
  weightAfter: doublePrecision("weight_after").notNull(),
  turnoverPct: doublePrecision("turnover_pct").notNull(),
  costBps: doublePrecision("cost_bps").notNull(),
  realizedFrictionInr: doublePrecision("realized_friction_inr").notNull(),
  status: text("status").notNull().default("Executed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Scenario = typeof scenarios.$inferSelect;
export type NewScenario = typeof scenarios.$inferInsert;
export type CommitteeNote = typeof committeeNotes.$inferSelect;
export type NewCommitteeNote = typeof committeeNotes.$inferInsert;
export type RebalanceEvent = typeof rebalanceEvents.$inferSelect;
export type NewRebalanceEvent = typeof rebalanceEvents.$inferInsert;
