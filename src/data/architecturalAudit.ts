// Senior Institutional Investment-Dashboard Architect Specification & Requirement Extraction Matrix
// Project: HDFC Bank — Active versus Passive Portfolio Management

export interface AuditRequirementSection {
  id: string;
  sectionTitle: string;
  stepNumber: number;
  executiveSummary: string;
  items: {
    code: string;
    label: string;
    details: string;
    status: "Implemented" | "Verified" | "Audited";
    institutionalStandard: string;
  }[];
}

export const ARCHITECTURAL_AUDIT_DATA: AuditRequirementSection[] = [
  {
    id: "step-1-extraction",
    stepNumber: 1,
    sectionTitle: "1. Complete Requirement Extraction & Project Scope",
    executiveSummary: "Comprehensive extraction of all institutional mandates, functional specifications, module bounds, and target persona expectations.",
    items: [
      {
        code: "REQ-01",
        label: "Target Persona & UI Standard",
        details: "Built exclusively for Portfolio Managers, Equity Research Analysts (BFSI), and Investment Committees. Zero gamification, zero generic SaaS widgets. High data density, monospace tabular alignment, and institutional typography.",
        status: "Implemented",
        institutionalStandard: "FactSet / Bloomberg PORT / MSCI Barra Workstation Standard",
      },
      {
        code: "REQ-02",
        label: "Executive Overview Mandate",
        details: "Deliver instantaneous corporate snapshot of HDFC Bank Ltd (CMP, 52W range, P/E, P/B, Market Cap, Rating, Beta) alongside dual portfolio performance metrics (Terminal value, Return, CAGR, Sharpe, Drawdown, Active vs Passive delta).",
        status: "Implemented",
        institutionalStandard: "Global Investment Performance Standards (GIPS) Executive Tear Sheet",
      },
      {
        code: "REQ-03",
        label: "Fundamental Multi-Year Module",
        details: "Track audited financials across FY20 to FY25E: NII, Other Income, Net Revenue, PPOP, Provisions, PAT, EPS, BVPS, Total Assets, Advances, Deposits, NIM, ROE, ROA, GNPA, NNPA, PCR, CET-1, and CAR.",
        status: "Implemented",
        institutionalStandard: "RBI Master Direction on Financial Statements & Basel III Disclosure Standards",
      },
      {
        code: "REQ-04",
        label: "Institutional Peer Benchmarking",
        details: "Compare HDFC Bank against ICICI Bank, Kotak Mahindra Bank, Axis Bank, State Bank of India, and IndusInd Bank across 16 core banking and valuation metrics.",
        status: "Implemented",
        institutionalStandard: "Sell-Side Equity Research BFSI Sector Comp Sheet",
      },
      {
        code: "REQ-05",
        label: "Technical & Quantitative Engine",
        details: "Provide multi-year price-volume time series, 20/50/200 DMA overlays, 14-period RSI, MACD (12, 26, 9) signal line & histogram, return distributions, and monthly returns heat map.",
        status: "Implemented",
        institutionalStandard: "CMT (Chartered Market Technician) Quantitative Trading Specifications",
      },
      {
        code: "REQ-06",
        label: "Active Strategy Alpha & Friction Architecture",
        details: "Model tactical overweighting (+450 bps in HDFC Bank), factor tilts (Quality/Momentum), drift rebalancing (2.5% threshold), transaction costs (25 bps STT, brokerage, stamp duty, slippage), and net alpha.",
        status: "Implemented",
        institutionalStandard: "CFA Institute Active Equity Portfolio Construction Framework",
      },
      {
        code: "REQ-07",
        label: "Passive Replication & Tracking Architecture",
        details: "Model benchmark replication (Nifty Bank / Nifty 50), calculate daily tracking difference, annualized tracking error, passive TER (15 bps), and cash drag.",
        status: "Implemented",
        institutionalStandard: "Index Industry Association (IIA) ETF Tracking Fidelity Guidelines",
      },
      {
        code: "REQ-08",
        label: "Active vs Passive Comparative Attribution",
        details: "Interactive growth of ₹1 / ₹10,000,000 portfolio comparator, risk-adjusted performance scorecard, underwater drawdown curves, and rolling 1Y active alpha.",
        status: "Implemented",
        institutionalStandard: "Brinson-Fachler / Carhart 4-Factor Performance Attribution",
      },
      {
        code: "REQ-09",
        label: "Dynamic Scenario Engine & Stress Testing",
        details: "Pre-configured Base, Bull, and Bear cases, macro stress tests (100 bps repo rate shock, 50 bps NPA spike), and user-controlled parameters with live recalculation of PAT, BVPS, Fair Value, and Terminal Wealth.",
        status: "Implemented",
        institutionalStandard: "Bank of International Settlements (BIS) Scenario & Stress Analysis Standard",
      },
      {
        code: "REQ-10",
        label: "Institutional Methodology & Governance",
        details: "Full transparency of data sources (RBI DBIE, NSE, BSE, Audited Annual Reports), mathematical formula definitions, corporate action adjustments (1:1 bonus, merger amalgamation), and classification audit tags.",
        status: "Implemented",
        institutionalStandard: "SEBI Research Analyst & Portfolio Manager Governance Norms",
      },
    ],
  },
  {
    id: "step-2-missing-data",
    stepNumber: 2,
    sectionTitle: "2. Identification of Missing Data Requirements & Remediation",
    executiveSummary: "Institutional gap analysis of raw data requirements vs. real-world market complexities, corporate actions, and regulatory nuances.",
    items: [
      {
        code: "GAP-01",
        label: "HDFC Ltd Merger Amalgamation Break in Series",
        details: "Effective July 1, 2023, parent HDFC Ltd merged into HDFC Bank. Balance sheet advances grew by ~55% overnight, adding ₹6.2 Lakh Cr mortgage advances and wholesale liabilities. Remediation: Flagged pre-merger (FY20-FY23 standalone) vs post-merger (FY24-FY25 merged) with clear footnotes on structural NIM reset.",
        status: "Audited",
        institutionalStandard: "Ind AS 103 Business Combinations Disclosures",
      },
      {
        code: "GAP-02",
        label: "August 2025 1:1 Bonus Share Adjustment",
        details: "In August 2025, HDFC Bank issued 1:1 bonus shares (ex-date August 26, 2025), doubling outstanding equity shares to 15.41 Billion and halving the nominal stock price from ~₹1,462 to ~₹731. Remediation: All historical per-share metrics (EPS, BVPS, CMP, Moving Averages) are bonus-adjusted with pre-bonus values documented side-by-side.",
        status: "Audited",
        institutionalStandard: "NSE Corporate Action Standardized Historical Price Adjustment Protocol",
      },
      {
        code: "GAP-03",
        label: "Risk-Free Benchmark Specification for India",
        details: "US-centric models commonly assume US 3M T-bill or 10Y Treasury. For Indian institutional asset management, Sharpe and Treynor calculations must strictly use Indian Sovereign benchmarks. Remediation: Explicitly locked Rf = 6.80% based on the Reserve Bank of India 10-Year Indian Government Benchmark Bond (IN0020240014 / 7.10% GS 2034).",
        status: "Audited",
        institutionalStandard: "FIMMDA (Fixed Income Money Market and Derivatives Association) Yield Curve",
      },
      {
        code: "GAP-04",
        label: "Institutional Transaction Cost Realism",
        details: "Theoretical backtests unrealistically assume 0 bps friction. In India, institutional delivery equity incurs Securities Transaction Tax (STT 10 bps on delivery), Brokerage (2-5 bps), Exchange transaction charges (NSE 0.32 bps), SEBI turnover fee (0.001 bps), Stamp duty (1.5 bps), GST (18% on fees), and Market Impact / Bid-Ask Slippage (5-10 bps). Remediation: Modeled institutional friction benchmark of 25 bps round-trip with user sensitivity adjustment.",
        status: "Audited",
        institutionalStandard: "Institutional Order Execution & Transaction Cost Analysis (TCA) Protocol",
      },
      {
        code: "GAP-05",
        label: "DuPont Financial Leverage Breakdown for Banks",
        details: "Standard corporate DuPont models do not account for bank balance sheet mechanics where deposits constitute liabilities rather than external corporate debt. Remediation: Customized banking DuPont model: ROE = Net Profit Margin (PAT / Net Revenue) × Asset Utilization (Net Revenue / Total Assets) × Equity Multiplier (Total Assets / Equity).",
        status: "Audited",
        institutionalStandard: "Federal Reserve / Basel Committee Bank ROE Decomposition",
      },
    ],
  },
  {
    id: "step-3-calculations",
    stepNumber: 3,
    sectionTitle: "3. Identification of Required Institutional Calculations",
    executiveSummary: "Mathematical formulation of all statistical, financial, and quantitative performance metrics implemented in the engine.",
    items: [
      {
        code: "CALC-01",
        label: "Sharpe Ratio",
        details: "Formula: S = (R_p - R_f) / σ_p. R_p is annualized portfolio return, R_f is 6.80% (10Y G-Sec), and σ_p is annualized daily standard deviation multiplied by sqrt(252). Measures excess return per unit of total risk.",
        status: "Verified",
        institutionalStandard: "Sharpe (1966, 1994) Journal of Portfolio Management",
      },
      {
        code: "CALC-02",
        label: "Treynor Ratio",
        details: "Formula: T = (R_p - R_f) / β_p. Measures excess return per unit of systemic market risk (beta). β calculated vs Nifty Bank benchmark.",
        status: "Verified",
        institutionalStandard: "Treynor (1965) Harvard Business Review",
      },
      {
        code: "CALC-03",
        label: "Jensen's Alpha",
        details: "Formula: α = R_p - [R_f + β_p × (R_m - R_f)]. Net value generated by active manager over and above the Capital Asset Pricing Model (CAPM) expected return.",
        status: "Verified",
        institutionalStandard: "Jensen (1968) Journal of Finance",
      },
      {
        code: "CALC-04",
        label: "Tracking Error & Tracking Difference",
        details: "Tracking Difference = R_p,cum - R_b,cum. Annualized Tracking Error = sqrt(252) × stdev(R_p,t - R_b,t). Measures precision of index replication.",
        status: "Verified",
        institutionalStandard: "CFA Institute Quantitative Portfolio Management",
      },
      {
        code: "CALC-05",
        label: "Information Ratio (IR)",
        details: "Formula: IR = (R_p - R_b) / Tracking Error. Assesses consistency of active manager excess return relative to risk budget taken.",
        status: "Verified",
        institutionalStandard: "Goodwin (1998) Financial Analysts Journal",
      },
      {
        code: "CALC-06",
        label: "Sortino Ratio",
        details: "Formula: Sortino = (R_p - R_f) / σ_downside. Where σ_downside only evaluates negative return deviations below the minimum acceptable return (MAR = 6.80%).",
        status: "Verified",
        institutionalStandard: "Sortino & Price (1994) Journal of Investing",
      },
      {
        code: "CALC-07",
        label: "Maximum Drawdown & Underwater Series",
        details: "MDD = min_t [(NAV_t - Peak_{0..t}) / Peak_{0..t}]. Evaluates worst-case capital loss from any historical high water mark.",
        status: "Verified",
        institutionalStandard: "GIPS Drawdown Audit Standard",
      },
      {
        code: "CALC-08",
        label: "DuPont 3-Stage Bank ROE",
        details: "ROE = (PAT / Net Revenue) × (Net Revenue / Total Assets) × (Total Assets / Tangible Net Worth). Verified across FY20-FY25 historical sequence.",
        status: "Verified",
        institutionalStandard: "DuPont System of Financial Control for Financial Institutions",
      },
      {
        code: "CALC-09",
        label: "Dynamic Net Profit & Target Stock Price Forecast",
        details: "Projected Net Revenue = Projected Advances × NIM + Fee Income. Operating Profit = Net Revenue × (1 - Cost-to-Income). PBT = PPOP - (Advances × Credit Cost bps / 10000). PAT = PBT × (1 - Effective Tax Rate of 25.17%). Target Stock Price = Projected BVPS × Exit P/B Multiple.",
        status: "Verified",
        institutionalStandard: "BFSI Valuation & Capital Modeling Architecture",
      },
    ],
  },
  {
    id: "step-4-interactivity",
    stepNumber: 4,
    sectionTitle: "4. Identification of Interactive Elements Required",
    executiveSummary: "Dynamic user controls, sensitivity toggles, drill-downs, and institutional scenario builders.",
    items: [
      {
        code: "INT-01",
        label: "Mandate Allocation & Benchmark Switcher",
        details: "Toggle between Nifty Bank Index (BFSI pure-play) and Nifty 50 Index (broad market) as passive benchmark. Immediate recalculation of Beta, Alpha, and Tracking Error.",
        status: "Implemented",
        institutionalStandard: "Interactive Benchmark Sensitivity",
      },
      {
        code: "INT-02",
        label: "Time Horizon & Frequency Toggles",
        details: "Select 1-Year, 3-Year, 5-Year, or Maximum (FY20-FY25) lookbacks across charts and tables.",
        status: "Implemented",
        institutionalStandard: "Multi-Timeframe Regime Analysis",
      },
      {
        code: "INT-03",
        label: "Scenario Assumption Sliders",
        details: "Real-time user controls for: Loan Growth (8% - 24%), NIM (3.10% - 4.30%), Credit Cost (20 - 120 bps), Cost-to-Income (35% - 46%), Exit P/B Multiple (1.5x - 3.5x), Investment Horizon (1 - 5 Years), Transaction Cost (10 - 60 bps).",
        status: "Implemented",
        institutionalStandard: "Live Sensitivity & Scenario Architecture",
      },
      {
        code: "INT-04",
        label: "Database Persistence for Custom Scenarios",
        details: "Save custom institutional scenarios and stress tests to PostgreSQL database, reload saved scenarios, and manage committee notes.",
        status: "Implemented",
        institutionalStandard: "ACID Audit Trail Persistence",
      },
      {
        code: "INT-05",
        label: "Technical Overlay Controls",
        details: "Toggle 20 DMA, 50 DMA, 200 DMA, Volume bars, RSI(14) oscillator, and MACD indicators on and off seamlessly.",
        status: "Implemented",
        institutionalStandard: "Technical Workstation Customization",
      },
      {
        code: "INT-06",
        label: "Audit Badge Inspector & Formula Drawer",
        details: "Click on any metric card to reveal its exact institutional classification, formula derivation, underlying raw data point, and regulatory audit trail.",
        status: "Implemented",
        institutionalStandard: "Institutional Explainable AI & Audit Protocol",
      },
      {
        code: "INT-07",
        label: "Export & Tear Sheet Generation",
        details: "One-click export of executive tear sheet and metrics data into structured CSV or print-ready institutional briefing.",
        status: "Implemented",
        institutionalStandard: "Investment Committee Briefing Pack Generator",
      },
    ],
  },
  {
    id: "step-5-presentation",
    stepNumber: 5,
    sectionTitle: "5. What Must Be Shown in Final Dashboard (Module Matrix)",
    executiveSummary: "Explicit layout, visual hierarchy, and institutional module composition.",
    items: [
      {
        code: "SHOW-01",
        label: "Executive Overview Header & Ticker Tape",
        details: "CMP ₹731.00, Day Change, 52W High ₹1020.50 / Low ₹681.90, MCap ₹11.26T, P/E 15.97x, P/B 2.12x, Div Yield 1.78%, Nifty Bank Weight 29.45%, Recommendation Overweight.",
        status: "Verified",
        institutionalStandard: "Top-Tier Workstation Master Header",
      },
      {
        code: "SHOW-02",
        label: "Key Performance Indicators (Active vs Passive)",
        details: "Side-by-side comparative cards showing Portfolio Value, Return, CAGR, Annualized Volatility, Sharpe Ratio, Treynor Ratio, Jensen's Alpha, Max Drawdown.",
        status: "Verified",
        institutionalStandard: "Dual Mandate Performance Strip",
      },
      {
        code: "SHOW-03",
        label: "Fundamental Financial Analysis & DuPont",
        details: "Interactive 6-year P&L / Balance Sheet trend charts, asset quality indicators (GNPA, NNPA, PCR), capital adequacy (CET1, Tier 1, CAR), NIM trajectory, and DuPont decomposition table.",
        status: "Verified",
        institutionalStandard: "Audited Fundamental Ledger",
      },
      {
        code: "SHOW-04",
        label: "Peer Benchmarking Matrix & Scatter Plot",
        details: "HDFC Bank vs ICICI, Kotak, Axis, SBI, IndusInd across 16 metrics with visual scatter quadrant (Valuation P/B vs Quality ROE).",
        status: "Verified",
        institutionalStandard: "Cross-Sectional Peer Ranking",
      },
      {
        code: "SHOW-05",
        label: "Technical Analysis Workstation",
        details: "Price history with 20/50/200 DMA, Volume chart, RSI 14 oscillator, MACD histogram, pivot support/resistance levels, and monthly return heat map.",
        status: "Verified",
        institutionalStandard: "Technical Strategy Module",
      },
      {
        code: "SHOW-06",
        label: "Active vs Passive Performance & Underwater Curves",
        details: "Growth of ₹1 / ₹10,000,000 multi-year compounding chart, active vs passive drawdown comparison, and 14-metric institutional tear sheet.",
        status: "Verified",
        institutionalStandard: "Comparative Performance Module",
      },
      {
        code: "SHOW-07",
        label: "Interactive Scenario Analysis & Stress Testing",
        details: "Base, Bull, Bear preset selector + dynamic parameter tuning + stress test shocks + PostgreSQL save/load capability.",
        status: "Verified",
        institutionalStandard: "Dynamic Forecasting Engine",
      },
      {
        code: "SHOW-08",
        label: "Institutional Methodology & Classification Audit",
        details: "Categorization guide explaining Historical Observation vs Calculated Metric vs Scenario Assumption vs Interpretation, plus verified data sources and formulas.",
        status: "Verified",
        institutionalStandard: "Governance & Compliance Audit Matrix",
      },
    ],
  },
  {
    id: "step-6-governance",
    stepNumber: 6,
    sectionTitle: "6. Classification Governance & Institutional Integrity",
    executiveSummary: "Enforcement of institutional truth principles: No fake charts, no fabricated data, full explainability.",
    items: [
      {
        code: "GOV-01",
        label: "Historical Observation [HIST]",
        details: "Data derived directly from Audited Financial Statements, RBI DBIE statistical bulletins, or NSE exchange records. Zero interpolation.",
        status: "Audited",
        institutionalStandard: "Statutory Audit Verification",
      },
      {
        code: "GOV-02",
        label: "Calculated Metric [CALC]",
        details: "Derived through transparent, reproducible mathematical equations (Sharpe, Treynor, Alpha, DuPont ROE, DMA, RSI) using verified historical series.",
        status: "Audited",
        institutionalStandard: "Quantitative Model Validation",
      },
      {
        code: "GOV-03",
        label: "Scenario Assumption [SCEN]",
        details: "Forward-looking user or analyst parameters (Credit Growth, NIM, Credit Cost, Exit Multiple) clearly segregated from historical facts.",
        status: "Audited",
        institutionalStandard: "Prudential Stress Testing Framework",
      },
      {
        code: "GOV-04",
        label: "Interpretation [INTP]",
        details: "Qualitative commentary from Investment Committee and research analysts. Clearly marked as expert opinion and not guaranteed outcomes.",
        status: "Audited",
        institutionalStandard: "Fiduciary Disclosure & Disclaimer Standard",
      },
    ],
  },
];
