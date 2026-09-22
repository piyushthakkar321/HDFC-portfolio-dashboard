// Regulatory / attestation text used across the UI. Edit here, not in components.
// Do not claim GIPS compliance, verification or a SEBI registration unless they are real and documented.

export const COMPLIANCE = {
  // Replace with the registered entity's actual Research Analyst / Adviser registration number for production.
  sebiRegistration: "DEMO — NOT FOR LIVE USE",
  gipsStatement: "Performance figures are illustrative model output and are not GIPS-verified.",
  riskFreeSource: "Assumption: Rf = 6.80% p.a. (approximate 10Y G-Sec yield, not tied to a dated print)",
  modelVersion: "BFSI-Mandate-Rules v0.1 (illustrative thresholds)",
} as const;