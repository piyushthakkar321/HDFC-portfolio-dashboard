import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { MARKET_SNAPSHOT, MARKET_CAP_CR } from "../data/marketSnapshot";
import { BANKING_PEERS, HDFC_FUNDAMENTALS, generateTimeSeries } from "../data/hdfcData";
import { runReconciliationChecks } from "../data/reconciliation";
import { METRICS, FRICTION_DRAG, TXN_DRAG_PCT, FEE_AND_OTHER_DRAG_PCT, PASSIVE_TER_PCT, PASSIVE_OTHER_DRAG_PCT } from "../data/metrics";

const SRC = path.resolve(__dirname, "..");
const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? (e.name === "__tests__" ? [] : walk(path.join(dir, e.name))) : /\.(ts|tsx)$/.test(e.name) ? [path.join(dir, e.name)] : [],
  );
const FILES = walk(SRC).map((f) => ({ f, lines: fs.readFileSync(f, "utf8").split(/\r?\n/) }));
const asOf = new Date(MARKET_SNAPSHOT.asOfDate + " UTC");

describe("1. date guard (FROZEN mode)", () => {
  it("series ends on or before the as-of date", () => {
    const t = generateTimeSeries().technical;
    expect(new Date(t[t.length - 1].date).getTime()).toBeLessThanOrEqual(asOf.getTime());
  });
  it("post-cutoff dates appear only in lines that label them as a bonus restatement or subsequent event", () => {
    const post = /(Aug(ust)?\s+2025|26\s+Aug|2025-08|Sep(tember)?\s+2025)/i;
    const bad: string[] = [];
    for (const { f, lines } of FILES)
      lines.forEach((l, i) => {
        if (post.test(l) && !/bonus|restat|subsequent/i.test(l)) bad.push(`${path.relative(SRC, f)}:${i + 1}`);
      });
    expect(bad).toEqual([]);
  });
});

describe("2. price chain", () => {
  it("market cap = price x shares", () => expect(MARKET_CAP_CR).toBe(Math.round(MARKET_SNAPSHOT.price * MARKET_SNAPSHOT.sharesOutstandingCr)));
  it("P/E and P/B recompute from price", () => {
    const fy = HDFC_FUNDAMENTALS[HDFC_FUNDAMENTALS.length - 1];
    expect(BANKING_PEERS[0].peRatio).toBeCloseTo(MARKET_SNAPSHOT.price / fy.eps, 1);
    expect(BANKING_PEERS[0].pbRatio).toBeCloseTo(MARKET_SNAPSHOT.price / fy.bvps, 1);
  });
  it("all internal reconciliation checks pass", () => {
    expect(runReconciliationChecks().filter((c) => !c.pass).map((c) => c.id)).toEqual([]);
  });
});

describe("3. cost bridge", () => {
  it("active friction components sum to the modelled total", () => expect(TXN_DRAG_PCT + FEE_AND_OTHER_DRAG_PCT).toBeCloseTo(FRICTION_DRAG, 6));
  it("passive TER + residual = tracking difference", () => expect(PASSIVE_TER_PCT + PASSIVE_OTHER_DRAG_PCT).toBeCloseTo(Math.abs(METRICS.td.passive), 6));
});

describe("5. fundamentals", () => {
  it("NII + other income = net revenue; PPOP - provisions = PBT", () => {
    for (const f of HDFC_FUNDAMENTALS) {
      expect(f.nii + f.nonInterestIncome).toBe(f.netRevenue);
      expect(f.ppop - f.provisions).toBe(f.pbt);
    }
  });
  it("implied tax rate stays in 22-29% (FY24 is a known open exception, FU-03)", () => {
    const KNOWN = new Set(["FY24"]);
    const out = HDFC_FUNDAMENTALS.filter((f) => !KNOWN.has(f.fiscalYear)).filter((f) => {
      const t = 1 - f.pat / f.pbt;
      return t < 0.22 || t > 0.29;
    });
    expect(out.map((f) => f.fiscalYear)).toEqual([]);
  });
});

describe("8. text lint", () => {
  const banned = [/TODO/, /to be attached/i, /drizzle-kit/, /fabricated/i, /official NSE trade logs/i, /consistently exceeds/i];
  it("no banned strings in UI code", () => {
    const bad: string[] = [];
    for (const { f, lines } of FILES) {
      if (/[\\/]db[\\/]|[\\/]api[\\/]/.test(f)) continue;
      lines.forEach((l, i) => banned.forEach((b) => b.test(l) && bad.push(`${path.relative(SRC, f)}:${i + 1} ${b}`)));
    }
    expect(bad).toEqual([]);
  });
  it("DATABASE_URL is not shown in components", () => {
    const bad = FILES.filter(({ f }) => f.includes("components")).filter(({ lines }) => lines.some((l) => l.includes("DATABASE_URL")));
    expect(bad.map((b) => b.f)).toEqual([]);
  });
});

describe("9. number format", () => {
  it("no en-US grouping", () => {
    const bad: string[] = [];
    for (const { f, lines } of FILES) lines.forEach((l, i) => l.includes('toLocaleString("en-US"') && bad.push(`${path.relative(SRC, f)}:${i + 1}`));
    expect(bad).toEqual([]);
  });
});

describe("10. chart tests", () => {
  it("fundamentals chart uses one dataset (no repeated FY axis)", () => {
    const src = fs.readFileSync(path.join(SRC, "components/FundamentalAnalysis.tsx"), "utf8");
    expect(src).not.toMatch(/data=\{revenueData\.filter/);
  });
  it("rolling alpha is null for the first year, then moves smoothly", () => {
    const p = generateTimeSeries().performance;
    const vals = p.map((d) => d.rollingAlpha1Y);
    const firstVal = vals.findIndex((v) => v !== null);
    expect(firstVal).toBeGreaterThan(0);
    const nums = vals.slice(firstVal) as number[];
    const maxStep = Math.max(...nums.slice(1).map((v, i) => Math.abs(v - nums[i])));
    expect(maxStep).toBeLessThan(3); // tune after first run
  });
});