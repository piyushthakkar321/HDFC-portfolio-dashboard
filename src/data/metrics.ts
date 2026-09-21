// Performance inputs and every metric derived from them.
// Inputs below are illustrative model assumptions (NOT audited NAVs). Everything else is computed,
// so CAGR, Sharpe, Treynor, Sortino, IR and the alpha bridge always reconcile with each other.

export const INITIAL_CAPITAL = 10_000_000;
export const PERIOD_YEARS = 4.25;
export const PERIOD_LABEL = "Jan 2021 – Mar 2025 (4.25 years, no interim cash flows)";
export const RISK_FREE = 6.8; // % p.a.

// --- Inputs -----------------------------------------------------------------
const INPUT = {
  terminalPassive: 18_124_300,
  terminalBenchmark: 18_340_000, // Nifty Bank
  netAlpha: 2.18, // % p.a., active CAGR minus Nifty Bank CAGR, net of all costs
  frictionDrag: 0.66, // % p.a.
  sectorEffect: 1.42,
  factorEffect: 0.94,
  vol: { active: 17.2, passive: 19.1, benchmark: 19.35 },
  beta: { active: 0.94, passive: 1.0, benchmark: 1.0 },
  downsideDev: { active: 11.58, passive: 13.19, benchmark: 13.31 },
  trackingError: { active: 3.92, passive: 0.28 },
  maxDrawdown: { active: -23.4, passive: -28.9, benchmark: -29.4 },
};

// --- Derived ------------------------------------------------------------------
const cagrFrom = (terminal: number) => (Math.pow(terminal / INITIAL_CAPITAL, 1 / PERIOD_YEARS) - 1) * 100;

const cagrBenchmark = cagrFrom(INPUT.terminalBenchmark);
const cagrPassive = cagrFrom(INPUT.terminalPassive);
const cagrActive = cagrBenchmark + INPUT.netAlpha;
const terminalActive =
  Math.round((INITIAL_CAPITAL * Math.pow(1 + cagrActive / 100, PERIOD_YEARS)) / 100) * 100;

type Trio = { active: number; passive: number; benchmark: number };
const cagr: Trio = { active: cagrActive, passive: cagrPassive, benchmark: cagrBenchmark };
const terminal: Trio = {
  active: terminalActive,
  passive: INPUT.terminalPassive,
  benchmark: INPUT.terminalBenchmark,
};

const sharpe = (k: keyof Trio) => (cagr[k] - RISK_FREE) / INPUT.vol[k];
const treynor = (k: keyof Trio) => (cagr[k] - RISK_FREE) / INPUT.beta[k];
const sortino = (k: keyof Trio) => (cagr[k] - RISK_FREE) / INPUT.downsideDev[k];
const calmar = (k: keyof Trio) => cagr[k] / Math.abs(INPUT.maxDrawdown[k]);

export const METRICS = {
  terminal,
  cagr,
  vol: INPUT.vol,
  beta: INPUT.beta,
  te: INPUT.trackingError,
  mdd: INPUT.maxDrawdown,
  sharpe: { active: sharpe("active"), passive: sharpe("passive"), benchmark: sharpe("benchmark") },
  treynor: { active: treynor("active"), passive: treynor("passive"), benchmark: treynor("benchmark") },
  sortino: { active: sortino("active"), passive: sortino("passive"), benchmark: sortino("benchmark") },
  calmar: { active: calmar("active"), passive: calmar("passive"), benchmark: calmar("benchmark") },
  // Information ratio = active return over benchmark / tracking error
  ir: {
    active: INPUT.netAlpha / INPUT.trackingError.active,
    passive: (cagrPassive - cagrBenchmark) / INPUT.trackingError.passive,
  },
  // Tracking difference vs Nifty Bank, % p.a.
  td: { active: cagrActive - cagrBenchmark, passive: cagrPassive - cagrBenchmark },
  totalReturnPct: (k: keyof Trio) => (terminal[k] / INITIAL_CAPITAL - 1) * 100,
};

export const NET_ALPHA = INPUT.netAlpha;
export const FRICTION_DRAG = INPUT.frictionDrag;
export const GROSS_ALPHA = INPUT.netAlpha + INPUT.frictionDrag;

// Alpha bridge: the balancing item is explicit, never hidden.
export const ALPHA_BRIDGE = {
  sector: INPUT.sectorEffect,
  factor: INPUT.factorEffect,
  selection: GROSS_ALPHA - INPUT.sectorEffect - INPUT.factorEffect,
  gross: GROSS_ALPHA,
  friction: -INPUT.frictionDrag,
  net: INPUT.netAlpha,
};

// Formatting helpers (fixed locale so server and client render identically)
export const sgn = (n: number, d = 2) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(d)}`;
export const pct = (n: number, d = 2) => `${n.toFixed(d)}%`;
export const spct = (n: number, d = 2) => `${sgn(n, d)}%`;
export const pp = (n: number, d = 2) => `${sgn(n, d)} pp`;
export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-US")}`;