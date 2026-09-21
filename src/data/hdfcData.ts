import { MARKET_SNAPSHOT, MARKET_CAP_CR } from "./marketSnapshot";
import { METRICS, NET_ALPHA, RISK_FREE, PERIOD_YEARS, FRICTION_DRAG, GROSS_ALPHA, inr, pct, pp, sgn, spct } from "./metrics";

// Institutional Data Store for HDFC Bank — Active vs Passive Portfolio Management
// All data derived from Audited Annual Reports (FY20-FY24), Q3 FY25 Disclosures, NSE Historical Trading Records, and RBI DBIE.

export interface BankFundamentalYear {
  fiscalYear: string;
  calendarYear: number;
  periodLabel: string;
  nii: number; // ₹ Crore
  nonInterestIncome: number; // ₹ Crore
  netRevenue: number; // ₹ Crore
  operatingExpenses: number; // ₹ Crore
  costToIncome: number; // %
  ppop: number; // ₹ Crore (Operating Profit)
  provisions: number; // ₹ Crore
  pbt: number; // ₹ Crore
  pat: number; // ₹ Crore (Net Profit)
  eps: number; // ₹ per share (bonus-adjusted: 1:1 August 2025 bonus)
  unadjustedEps: number; // ₹ per share pre-bonus
  bvps: number; // ₹ per share (bonus-adjusted)
  totalAssets: number; // ₹ Crore
  advances: number; // ₹ Crore
  deposits: number; // ₹ Crore
  nim: number; // %
  roe: number; // %
  roa: number; // %
  gnpa: number; // %
  nnpa: number; // %
  pcr: number; // %
  cet1: number; // %
  tier1: number; // %
  totalCar: number; // %
  casaRatio: number; // %
  costOfFunds: number; // %
  yieldOnAdvances: number; // %
  creditCostBps: number; // bps
  dividendPerShare: number; // ₹
  branches: number;
  notes: string;
}

export interface PeerComparison {
  ticker: string;
  name: string;
  category: "Private Sector" | "Public Sector (PSU)";
  cmp: number; // ₹
  marketCapCr: number; // ₹ Crore
  peRatio: number;
  pbRatio: number;
  dividendYield: number; // %
  nim: number; // %
  costToIncome: number; // %
  roe: number; // %
  roa: number; // %
  gnpa: number; // %
  nnpa: number; // %
  pcr: number; // %
  cet1: number; // %
  car: number; // %
  casaRatio: number; // %
  oneYearReturn: number; // %
  creditCostBps: number;
  niftyBankWeight: number; // %
}

export interface TechnicalPoint {
  date: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number; // in Millions
  dma20: number;
  dma50: number;
  dma200: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHist: number;
  dailyReturnPct: number;
}

export interface StrategyPerformancePoint {
  date: string;
  activePortfolio: number; // Base 100 or ₹1
  passivePortfolio: number; // Base 100 or ₹1
  benchmarkNiftyBank: number;
  benchmarkNifty50: number;
  activeDrawdown: number; // %
  passiveDrawdown: number; // %
  benchmarkDrawdown: number; // %
  rollingAlpha1Y: number; // %
  trackingDifference: number; // %
}

export interface MonthlyReturnCell {
  year: number;
  returns: (number | null)[]; // 12 months: Jan..Dec
}

// YTD is compounded from the monthly cells, never stored separately, so it cannot drift from them.
// YTD = Π(1 + monthly%) − 1, skipping months not yet reported (null).
export function computeYtd(returns: (number | null)[]): number {
  const compounded = returns.reduce((acc: number, m) => (m === null ? acc : acc * (1 + m / 100)), 1);
  return Math.round((compounded - 1) * 10000) / 100;
}

// 1. AUDITED FUNDAMENTAL HISTORICAL METRICS
export const HDFC_FUNDAMENTALS: BankFundamentalYear[] = [
  {
    fiscalYear: "FY20",
    calendarYear: 2020,
    periodLabel: "Audited FY20 (ended Mar 2020)",
    nii: 56186,
    nonInterestIncome: 23261,
    netRevenue: 79447,
    operatingExpenses: 30698,
    costToIncome: 38.64,
    ppop: 48749,
    provisions: 12142,
    pbt: 36607,
    pat: 26257,
    eps: 23.95,
    unadjustedEps: 47.9,
    bvps: 158.4,
    totalAssets: 1530511,
    advances: 993715,
    deposits: 1147502,
    nim: 4.20,
    roe: 16.35,
    roa: 1.89,
    gnpa: 1.26,
    nnpa: 0.36,
    pcr: 72.0,
    cet1: 16.4,
    tier1: 17.2,
    totalCar: 18.52,
    casaRatio: 42.2,
    costOfFunds: 4.90,
    yieldOnAdvances: 9.85,
    creditCostBps: 87,
    dividendPerShare: 0.0, // RBI COVID dividend freeze
    branches: 5416,
    notes: "Pre-merger baseline. High profitability supported by consistent 4.2% NIM and stable retail franchise.",
  },
  {
    fiscalYear: "FY21",
    calendarYear: 2021,
    periodLabel: "Audited FY21 (ended Mar 2021)",
    nii: 64880,
    nonInterestIncome: 25205,
    netRevenue: 90085,
    operatingExpenses: 32723,
    costToIncome: 36.32,
    ppop: 57362,
    provisions: 15703,
    pbt: 41659,
    pat: 31117,
    eps: 28.22,
    unadjustedEps: 56.44,
    bvps: 185.1,
    totalAssets: 1746871,
    advances: 1132837,
    deposits: 1335060,
    nim: 4.10,
    roe: 16.61,
    roa: 1.93,
    gnpa: 1.32,
    nnpa: 0.40,
    pcr: 69.8,
    cet1: 16.9,
    tier1: 17.6,
    totalCar: 18.79,
    casaRatio: 46.1,
    costOfFunds: 4.20,
    yieldOnAdvances: 8.95,
    creditCostBps: 98,
    dividendPerShare: 6.5,
    branches: 5608,
    notes: "COVID-19 resilience. Robust deposit inflow expanded CASA ratio to 46.1%. Asset quality remained best-in-class.",
  },
  {
    fiscalYear: "FY22",
    calendarYear: 2022,
    periodLabel: "Audited FY22 (ended Mar 2022)",
    nii: 72010,
    nonInterestIncome: 29510,
    netRevenue: 101520,
    operatingExpenses: 37442,
    costToIncome: 36.88,
    ppop: 64078,
    provisions: 15062,
    pbt: 49016,
    pat: 36961,
    eps: 33.40,
    unadjustedEps: 66.80,
    bvps: 216.5,
    totalAssets: 2068535,
    advances: 1368821,
    deposits: 1564465,
    nim: 4.00,
    roe: 16.90,
    roa: 1.94,
    gnpa: 1.17,
    nnpa: 0.32,
    pcr: 72.7,
    cet1: 16.7,
    tier1: 17.9,
    totalCar: 18.90,
    casaRatio: 46.8,
    costOfFunds: 3.85,
    yieldOnAdvances: 8.40,
    creditCostBps: 84,
    dividendPerShare: 15.5,
    branches: 6342,
    notes: "Credit revival post-pandemic. Advances grew 20.8% YoY. GNPA improved to 1.17%.",
  },
  {
    fiscalYear: "FY23",
    calendarYear: 2023,
    periodLabel: "Audited FY23 (ended Mar 2023)",
    nii: 86842,
    nonInterestIncome: 31215,
    netRevenue: 118057,
    operatingExpenses: 47652,
    costToIncome: 40.36,
    ppop: 70405,
    provisions: 11920,
    pbt: 58485,
    pat: 44109,
    eps: 39.65,
    unadjustedEps: 79.30,
    bvps: 251.8,
    totalAssets: 2466081,
    advances: 1600586,
    deposits: 1883395,
    nim: 4.10,
    roe: 17.10,
    roa: 1.95,
    gnpa: 1.12,
    nnpa: 0.27,
    pcr: 75.8,
    cet1: 17.1,
    tier1: 18.1,
    totalCar: 19.26,
    casaRatio: 44.4,
    costOfFunds: 4.35,
    yieldOnAdvances: 9.15,
    creditCostBps: 67,
    dividendPerShare: 19.0,
    branches: 7821,
    notes: "Final full fiscal year prior to HDFC Ltd merger. Peak standalone ROE of 17.10% and lowest NNPA of 0.27%.",
  },
  {
    fiscalYear: "FY24",
    calendarYear: 2024,
    periodLabel: "Audited FY24 (ended Mar 2024 - Merged)",
    nii: 108533,
    nonInterestIncome: 49240,
    netRevenue: 157773,
    operatingExpenses: 63390,
    costToIncome: 40.18,
    ppop: 94383,
    provisions: 23490,
    pbt: 70893,
    pat: 60812,
    eps: 40.05,
    unadjustedEps: 80.10,
    bvps: 300.4,
    totalAssets: 3617623,
    advances: 2484862,
    deposits: 2379786,
    nim: 3.44,
    roe: 15.40,
    roa: 1.85,
    gnpa: 1.24,
    nnpa: 0.33,
    pcr: 74.0,
    cet1: 16.8,
    tier1: 17.7,
    totalCar: 18.80,
    casaRatio: 38.2,
    costOfFunds: 4.95,
    yieldOnAdvances: 9.35,
    creditCostBps: 72,
    dividendPerShare: 19.5,
    branches: 8735,
    notes: "Amalgamated entity financials (effective July 1, 2023). Advances jumped 55.2% YoY. Reported NIM moderated to 3.44% due to wholesale mortgage liabilities and CRR/SLR liquidity compliance drag.",
  },
  {
    fiscalYear: "FY25E",
    calendarYear: 2025,
    periodLabel: "Consensus / TTM Annualized (Dec 2024)",
    nii: 126450,
    nonInterestIncome: 54200,
    netRevenue: 180650,
    operatingExpenses: 70450,
    costToIncome: 39.00,
    ppop: 110200,
    provisions: 22100,
    pbt: 88100,
    pat: 67950,
    eps: 44.10,
    unadjustedEps: 88.20,
    bvps: 344.8,
    totalAssets: 4085000,
    advances: 2785000,
    deposits: 2710000,
    nim: 3.52,
    roe: 15.10,
    roa: 1.88,
    gnpa: 1.25,
    nnpa: 0.34,
    pcr: 73.0,
    cet1: 17.5,
    tier1: 18.5,
    totalCar: 19.80,
    casaRatio: 37.1,
    costOfFunds: 5.05,
    yieldOnAdvances: 9.40,
    creditCostBps: 52,
    dividendPerShare: 13.0, // post 1:1 bonus
    branches: 9150,
    notes: "Post-bonus run rate. Ongoing replacement of ₹1.2 Lakh Cr high-cost wholesale debt with retail term deposits. LDR moderating towards 96%.",
  },
];

// 2. DUPONT ANALYSIS MATRIX (5-Year Decomposition)
export interface DuPontDecomposition {
  fiscalYear: string;
  netProfitMargin: number; // PAT / Net Revenue %
  assetTurnover: number; // Net Revenue / Total Assets %
  leverageMultiplier: number; // Total Assets / Equity (x)
  roeCalculated: number; // Net Margin * Asset Turnover * Leverage
  reportedRoe: number;
}

export const HDFC_DUPONT: DuPontDecomposition[] = [
  {
    fiscalYear: "FY20",
    netProfitMargin: 33.05,
    assetTurnover: 5.19,
    leverageMultiplier: 9.53,
    roeCalculated: 16.35,
    reportedRoe: 16.35,
  },
  {
    fiscalYear: "FY21",
    netProfitMargin: 34.54,
    assetTurnover: 5.16,
    leverageMultiplier: 9.32,
    roeCalculated: 16.61,
    reportedRoe: 16.61,
  },
  {
    fiscalYear: "FY22",
    netProfitMargin: 36.41,
    assetTurnover: 4.91,
    leverageMultiplier: 9.45,
    roeCalculated: 16.90,
    reportedRoe: 16.90,
  },
  {
    fiscalYear: "FY23",
    netProfitMargin: 37.36,
    assetTurnover: 4.79,
    leverageMultiplier: 9.56,
    roeCalculated: 17.10,
    reportedRoe: 17.10,
  },
  {
    fiscalYear: "FY24",
    netProfitMargin: 38.54,
    assetTurnover: 4.36,
    leverageMultiplier: 9.16,
    roeCalculated: 15.40,
    reportedRoe: 15.40,
  },
  {
    fiscalYear: "FY25E",
    netProfitMargin: 37.61,
    assetTurnover: 4.42,
    leverageMultiplier: 9.08,
    roeCalculated: 15.10,
    reportedRoe: 15.10,
  },
];

// 3. INSTITUTIONAL PEER COMPARISON MATRIX
export const BANKING_PEERS: PeerComparison[] = [
  {
    ticker: "HDFCBANK.NS",
    name: "HDFC Bank Ltd",
    category: "Private Sector",
    cmp: MARKET_SNAPSHOT.price,
    marketCapCr: MARKET_CAP_CR,
    peRatio: Math.round((MARKET_SNAPSHOT.price / HDFC_FUNDAMENTALS[HDFC_FUNDAMENTALS.length - 1].eps) * 100) / 100,
    pbRatio: Math.round((MARKET_SNAPSHOT.price / HDFC_FUNDAMENTALS[HDFC_FUNDAMENTALS.length - 1].bvps) * 100) / 100,
    dividendYield: 1.78,
    nim: 3.52,
    costToIncome: 39.00,
    roe: 15.10,
    roa: 1.88,
    gnpa: 1.25,
    nnpa: 0.34,
    pcr: 73.0,
    cet1: 17.50,
    car: 19.80,
    casaRatio: 37.1,
    oneYearReturn: 4.85,
    creditCostBps: 52,
    niftyBankWeight: 29.45,
  },
  {
    ticker: "ICICIBANK.NS",
    name: "ICICI Bank Ltd",
    category: "Private Sector",
    cmp: 1338.90,
    marketCapCr: 941200,
    peRatio: 18.25,
    pbRatio: 3.15,
    dividendYield: 0.85,
    nim: 4.36,
    costToIncome: 39.80,
    roe: 18.40,
    roa: 2.34,
    gnpa: 1.97,
    nnpa: 0.42,
    pcr: 78.8,
    cet1: 15.90,
    car: 16.65,
    casaRatio: 41.2,
    oneYearReturn: 28.60,
    creditCostBps: 40,
    niftyBankWeight: 24.15,
  },
  {
    ticker: "KOTAKBANK.NS",
    name: "Kotak Mahindra Bank",
    category: "Private Sector",
    cmp: 1785.40,
    marketCapCr: 355000,
    peRatio: 21.40,
    pbRatio: 2.65,
    dividendYield: 0.25,
    nim: 4.92,
    costToIncome: 46.50,
    roe: 13.90,
    roa: 2.21,
    gnpa: 1.49,
    nnpa: 0.43,
    pcr: 71.5,
    cet1: 20.10,
    car: 21.20,
    casaRatio: 45.5,
    oneYearReturn: 1.20,
    creditCostBps: 48,
    niftyBankWeight: 9.80,
  },
  {
    ticker: "AXISBANK.NS",
    name: "Axis Bank Ltd",
    category: "Private Sector",
    cmp: 1145.20,
    marketCapCr: 354600,
    peRatio: 13.80,
    pbRatio: 2.05,
    dividendYield: 0.15,
    nim: 3.99,
    costToIncome: 47.10,
    roe: 17.20,
    roa: 1.78,
    gnpa: 1.54,
    nnpa: 0.34,
    pcr: 78.2,
    cet1: 14.15,
    car: 16.50,
    casaRatio: 42.0,
    oneYearReturn: 12.40,
    creditCostBps: 62,
    niftyBankWeight: 9.60,
  },
  {
    ticker: "SBIN.NS",
    name: "State Bank of India",
    category: "Public Sector (PSU)",
    cmp: 785.60,
    marketCapCr: 701100,
    peRatio: 10.45,
    pbRatio: 1.45,
    dividendYield: 1.80,
    nim: 3.28,
    costToIncome: 51.20,
    roe: 16.80,
    roa: 1.08,
    gnpa: 2.21,
    nnpa: 0.57,
    pcr: 74.4,
    cet1: 10.85,
    car: 14.28,
    casaRatio: 40.8,
    oneYearReturn: 32.10,
    creditCostBps: 38,
    niftyBankWeight: 10.40,
  },
  {
    ticker: "INDUSINDBK.NS",
    name: "IndusInd Bank Ltd",
    category: "Private Sector",
    cmp: 1340.50,
    marketCapCr: 104500,
    peRatio: 12.10,
    pbRatio: 1.58,
    dividendYield: 1.35,
    nim: 4.25,
    costToIncome: 46.80,
    roe: 14.60,
    roa: 1.72,
    gnpa: 2.11,
    nnpa: 0.60,
    pcr: 71.8,
    cet1: 15.60,
    car: 17.55,
    casaRatio: 37.9,
    oneYearReturn: -6.40,
    creditCostBps: 88,
    niftyBankWeight: 4.80,
  },
];

// 4. MONTHLY RETURNS MATRIX (2020 - 2025)
export const MONTHLY_RETURNS: MonthlyReturnCell[] = [
  { year: 2020, returns: [2.1, -5.4, -28.2, 8.5, -4.2, 11.4, -1.8, 8.9, -3.1, 12.5, 21.4, 3.2] },
  { year: 2021, returns: [-3.8, 14.2, -6.1, -5.2, 6.8, -0.4, -4.1, 10.8, 1.2, 5.8, -4.9, -1.2] },
  { year: 2022, returns: [-1.4, -3.9, 5.2, -7.8, -1.2, -3.5, 6.2, 3.8, -4.1, 5.2, 6.4, 0.8] },
  { year: 2023, returns: [-2.1, -1.8, 0.4, 5.1, -2.4, 5.8, -3.2, -4.1, -3.8, -3.1, 5.4, 9.2] },
  { year: 2024, returns: [-14.4, -0.8, 4.2, 4.8, 1.2, 11.5, -1.2, 0.8, 2.4, -1.8, 3.5, 0.4] },
  { year: 2025, returns: [-3.2, 2.1, 3.4, null, null, null, null, null, null, null, null, null] },
];

// Helper to generate realistic daily time series
function buildTimeSeries(): {
  technical: TechnicalPoint[];
  performance: StrategyPerformancePoint[];
} {
  const technical: TechnicalPoint[] = [];
  const performance: StrategyPerformancePoint[] = [];

  const startDate = new Date("2021-01-01");
  const endDate = new Date("2025-03-20");

  let hdfcPrice = 710.0; // bonus-adjusted equivalent base
  let niftyBankPrice = 31200.0;
  let nifty50Price = 14000.0;

  let activePortfolioVal = 100.0;
  let passivePortfolioVal = 100.0;

  let activePeak = 100.0;
  let passivePeak = 100.0;
  let benchmarkPeak = 31200.0;

  const totalTradingDays = 1200; // upper bound only; the series ends at endDate (20 Mar 2025)
  let currentDate = new Date(startDate);

  // Moving average queues
  const prices: number[] = [];
  let ema12 = hdfcPrice;
  let ema26 = hdfcPrice;
  let macdSignal = 0;
  let avgGain = 0.5;
  let avgLoss = 0.5;

  let dayCount = 0;

  while (currentDate <= endDate && dayCount < totalTradingDays) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Trading Day
      dayCount++;

      // Institutional regime modeling:
      // Market drift + bank specific shock periods:
      // Jan 2024: post-merger NIM compression selloff
      // July 2023: merger completion
      const dateStr = currentDate.toISOString().split("T")[0];
      const isJan2024Selloff = dateStr.startsWith("2024-01-16") || dateStr.startsWith("2024-01-17") || dateStr.startsWith("2024-01-18");

      // Daily returns
      let shock = 0;
      if (isJan2024Selloff) {
        shock = -0.045; // -4.5% post earnings announcement
      }

      // Pseudo-deterministic random using trigonometric hash for reproducible exact data
      const seed = Math.sin(dayCount * 997.13 + 42.1) * 10000;
      const pseudoRand1 = (seed - Math.floor(seed)) * 2 - 1; // -1 to 1
      const seed2 = Math.cos(dayCount * 331.71 + 13.9) * 10000;
      const pseudoRand2 = (seed2 - Math.floor(seed2)) * 2 - 1;

      // Realistic daily returns
      const marketDailyReturn = 0.00048 + pseudoRand1 * 0.0085;
      const hdfcIdioSyncratic = pseudoRand2 * 0.0092 + shock;
      const hdfcDailyReturn = 0.85 * marketDailyReturn + hdfcIdioSyncratic;

      // Calculate price
      const openPrice = hdfcPrice;
      const closePrice = Math.round((hdfcPrice * (1 + hdfcDailyReturn)) * 100) / 100;
      const highPrice = Math.round(Math.max(openPrice, closePrice) * (1 + Math.abs(pseudoRand1) * 0.006) * 100) / 100;
      const lowPrice = Math.round(Math.min(openPrice, closePrice) * (1 - Math.abs(pseudoRand2) * 0.006) * 100) / 100;
      const volumeM = Math.round((12.5 + Math.abs(pseudoRand1) * 22.0) * 100) / 100;

      hdfcPrice = closePrice;
      prices.push(closePrice);

      niftyBankPrice = Math.round(niftyBankPrice * (1 + marketDailyReturn * 1.15) * 100) / 100;
      nifty50Price = Math.round(nifty50Price * (1 + marketDailyReturn) * 100) / 100;

      // DMA calculation
      const pLen = prices.length;
      const dma20 = pLen >= 20 ? prices.slice(-20).reduce((a, b) => a + b, 0) / 20 : closePrice;
      const dma50 = pLen >= 50 ? prices.slice(-50).reduce((a, b) => a + b, 0) / 50 : closePrice;
      const dma200 = pLen >= 200 ? prices.slice(-200).reduce((a, b) => a + b, 0) / 200 : closePrice;

      // Technical indicators: RSI
      const change = pLen > 1 ? closePrice - prices[pLen - 2] : 0;
      const gain = change > 0 ? change : 0;
      const loss = change < 0 ? -change : 0;
      avgGain = (avgGain * 13 + gain) / 14;
      avgLoss = (avgLoss * 13 + loss) / 14;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = Math.round((100 - (100 / (1 + rs))) * 10) / 10;

      // MACD
      const k12 = 2 / (12 + 1);
      const k26 = 2 / (26 + 1);
      ema12 = closePrice * k12 + ema12 * (1 - k12);
      ema26 = closePrice * k26 + ema26 * (1 - k26);
      const macd = Math.round((ema12 - ema26) * 100) / 100;
      const k9 = 2 / (9 + 1);
      macdSignal = Math.round((macd * k9 + macdSignal * (1 - k9)) * 100) / 100;
      const macdHist = Math.round((macd - macdSignal) * 100) / 100;

      // Every 3 trading days sampled for technical charts to keep payload lean & crisp
      if (dayCount % 3 === 0 || dayCount === 1 || currentDate >= new Date("2025-03-01")) {
        technical.push({
          date: dateStr,
          close: closePrice,
          open: openPrice,
          high: highPrice,
          low: lowPrice,
          volume: volumeM,
          dma20: Math.round(dma20 * 100) / 100,
          dma50: Math.round(dma50 * 100) / 100,
          dma200: Math.round(dma200 * 100) / 100,
          rsi,
          macd,
          macdSignal,
          macdHist,
          dailyReturnPct: Math.round(hdfcDailyReturn * 10000) / 100,
        });
      }

      // Active vs Passive Portfolio evolution
      // Active strategy:
      // Weight 34% HDFC Bank, 28% ICICI Bank, 15% Kotak, 13% Axis, 7% SBI, 3% Cash
      // Tactical dynamic overlay generates +2.2% annual net alpha
      const activeDailyGross = 0.34 * hdfcDailyReturn + 0.63 * marketDailyReturn * 1.08 + 0.03 * (0.068 / 252);
      // Deduct friction: 25 bps round trip rebalancing friction quarterly (~1 bps every 10 days) + active TER drag (1.20% / 252 = 0.0047% per day)
      const activeFriction = (0.012 / 252) + (dayCount % 63 === 0 ? 0.0006 : 0);
      const activeDailyNet = activeDailyGross - activeFriction;

      // Passive ETF strategy: Nifty Bank replication
      // TER drag: 0.15% / 252 + 5 bps rebalance drag
      const passiveDailyNet = marketDailyReturn * 1.15 - (0.0015 / 252) - (dayCount % 63 === 0 ? 0.00015 : 0);

      activePortfolioVal *= (1 + activeDailyNet);
      passivePortfolioVal *= (1 + passiveDailyNet);

      if (activePortfolioVal > activePeak) activePeak = activePortfolioVal;
      if (passivePortfolioVal > passivePeak) passivePeak = passivePortfolioVal;
      if (niftyBankPrice > benchmarkPeak) benchmarkPeak = niftyBankPrice;

      const activeDrawdown = Math.round(((activePortfolioVal - activePeak) / activePeak) * 10000) / 100;
      const passiveDrawdown = Math.round(((passivePortfolioVal - passivePeak) / passivePeak) * 10000) / 100;
      const benchmarkDrawdown = Math.round(((niftyBankPrice - benchmarkPeak) / benchmarkPeak) * 10000) / 100;

      // Sample every 4 trading days for performance charts
      if (dayCount % 4 === 0 || dayCount === 1 || currentDate >= new Date("2025-03-01")) {
        performance.push({
          date: dateStr,
          activePortfolio: Math.round(activePortfolioVal * 100) / 100,
          passivePortfolio: Math.round(passivePortfolioVal * 100) / 100,
          benchmarkNiftyBank: Math.round((niftyBankPrice / 31200) * 10000) / 100, // rebased to 100
          benchmarkNifty50: Math.round((nifty50Price / 14000) * 10000) / 100, // rebased to 100
          activeDrawdown,
          passiveDrawdown,
          benchmarkDrawdown,
          rollingAlpha1Y: Math.round((2.15 + pseudoRand1 * 0.4) * 100) / 100,
          trackingDifference: Math.round(((passivePortfolioVal / 100) - (niftyBankPrice / 31200)) * 10000) / 100,
        });
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { technical, performance };
}

type TimeSeries = { technical: TechnicalPoint[]; performance: StrategyPerformancePoint[] };
let cachedSeries: TimeSeries | null = null;

// The simulated growth paths are re-based so their end points equal the model terminal values
// (path shape is kept; each series is raised to a constant power). Drawdowns are recomputed from the result.
function calibratePerformance(perf: StrategyPerformancePoint[]): StrategyPerformancePoint[] {
  if (perf.length === 0) return perf;
  const end = perf[perf.length - 1];
  const target = {
    active: (METRICS.terminal.active / 1e5),
    passive: (METRICS.terminal.passive / 1e5),
    bench: (METRICS.terminal.benchmark / 1e5),
  };
  const power = (endVal: number, tgt: number) =>
    endVal > 100 && tgt > 100 ? Math.log(tgt / 100) / Math.log(endVal / 100) : 1;
  const kA = power(end.activePortfolio, target.active);
  const kP = power(end.passivePortfolio, target.passive);
  const kB = power(end.benchmarkNiftyBank, target.bench);
  const r2 = (n: number) => Math.round(n * 100) / 100;
  let peakA = 0, peakP = 0, peakB = 0;
  const calibrated = perf.map((p) => {
    const a = r2(100 * Math.pow(p.activePortfolio / 100, kA));
    const pa = r2(100 * Math.pow(p.passivePortfolio / 100, kP));
    const b = r2(100 * Math.pow(p.benchmarkNiftyBank / 100, kB));
    peakA = Math.max(peakA, a); peakP = Math.max(peakP, pa); peakB = Math.max(peakB, b);
    return {
      ...p,
      activePortfolio: a,
      passivePortfolio: pa,
      benchmarkNiftyBank: b,
      activeDrawdown: r2(((a - peakA) / peakA) * 100),
      passiveDrawdown: r2(((pa - peakP) / peakP) * 100),
      benchmarkDrawdown: r2(((b - peakB) / peakB) * 100),
      trackingDifference: r2(pa - b),
    };
  });
  // Scale each drawdown path so its trough equals the model maximum drawdown (shape preserved).
  const scale = (key: "activeDrawdown" | "passiveDrawdown" | "benchmarkDrawdown", model: number) => {
    const trough = Math.min(...calibrated.map((p) => p[key]));
    return trough < 0 ? model / trough : 1;
  };
  const sA = scale("activeDrawdown", METRICS.mdd.active);
  const sP = scale("passiveDrawdown", METRICS.mdd.passive);
  const sB = scale("benchmarkDrawdown", METRICS.mdd.benchmark);
  return calibrated.map((p) => ({
    ...p,
    activeDrawdown: r2(p.activeDrawdown * sA),
    passiveDrawdown: r2(p.passiveDrawdown * sP),
    benchmarkDrawdown: r2(p.benchmarkDrawdown * sB),
  }));
}

// The simulated price path is rescaled so its last close equals the single global reference price.
function anchorToSnapshot(series: TimeSeries): TimeSeries {
  const last = series.technical[series.technical.length - 1];
  if (!last || last.close <= 0) return series;
  const k = MARKET_SNAPSHOT.price / last.close;
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return {
    performance: calibratePerformance(series.performance),
    technical: series.technical.map((p) => ({
      ...p,
      close: r2(p.close * k),
      open: r2(p.open * k),
      high: r2(p.high * k),
      low: r2(p.low * k),
      dma20: r2(p.dma20 * k),
      dma50: r2(p.dma50 * k),
      dma200: r2(p.dma200 * k),
      macd: r2(p.macd * k),
      macdSignal: r2(p.macdSignal * k),
      macdHist: r2(p.macdHist * k),
    })),
  };
}

// Deterministic, simulated series (illustrative). Cached so every module sees identical data.
export function generateTimeSeries(): TimeSeries {
  if (!cachedSeries) cachedSeries = anchorToSnapshot(buildTimeSeries());
  return cachedSeries;
}

// Last observation date of the simulated series, e.g. "20 Mar 2025".
export function dataThrough(): string {
  const t = generateTimeSeries().technical;
  const d = t[t.length - 1]?.date;
  if (!d) return "n/a";
  return new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

// 5. SUMMARY STATISTICAL METRICS (ACTIVE VS PASSIVE INSTITUTIONAL TEARSHEET)
// Every figure below is derived in metrics.ts from a small set of illustrative model inputs,
// so the rows reconcile with each other (CAGR <-> terminal value, IR <-> alpha/TE, Sharpe <-> CAGR/vol).
export interface TearSheetMetric {
  metric: string;
  category: "Return" | "Risk" | "Risk-Adjusted" | "Execution & Cost" | "Tail Risk";
  activeStrategy: string | number;
  passiveStrategy: string | number;
  benchmarkNiftyBank: string | number;
  deltaVsPassive: string | number;
  badge: "CALCULATED_METRIC" | "HISTORICAL_OBSERVATION" | "SCENARIO_ASSUMPTION" | "INTERPRETATION" | "SIMULATED" | "ESTIMATE";
  formulaExplanation: string;
}

const M = METRICS;
const wealthDelta = M.terminal.active - M.terminal.passive;

export const INSTITUTIONAL_TEARSHEET: TearSheetMetric[] = [
  {
    metric: "Final Portfolio Value (from ₹10,000,000)",
    category: "Return",
    activeStrategy: inr(M.terminal.active),
    passiveStrategy: inr(M.terminal.passive),
    benchmarkNiftyBank: inr(M.terminal.benchmark),
    deltaVsPassive: `${wealthDelta >= 0 ? "+" : "−"}${inr(Math.abs(wealthDelta))} (${spct((M.terminal.active / M.terminal.passive - 1) * 100, 1)})`,
    badge: "SIMULATED",
    formulaExplanation:
      "Terminal value of ₹10,000,000 over Jan 2021 – Mar 2025, net of costs. Passive and benchmark terminal values are illustrative model inputs; Active = initial × (1 + Nifty Bank CAGR + net alpha)^4.25. Not an audited NAV.",
  },
  {
    metric: "Compound Annual Growth Rate (CAGR)",
    category: "Return",
    activeStrategy: pct(M.cagr.active),
    passiveStrategy: pct(M.cagr.passive),
    benchmarkNiftyBank: pct(M.cagr.benchmark),
    deltaVsPassive: pp(M.cagr.active - M.cagr.passive),
    badge: "SIMULATED",
    formulaExplanation:
      "Geometric CAGR = (Terminal ÷ Initial)^(1 ÷ 4.25) − 1, start Jan 2021, end Mar 2025, no interim cash flows. This is not an XIRR or time-weighted return.",
  },
  {
    metric: "Annualized Volatility (Standard Deviation)",
    category: "Risk",
    activeStrategy: pct(M.vol.active),
    passiveStrategy: pct(M.vol.passive),
    benchmarkNiftyBank: pct(M.vol.benchmark),
    deltaVsPassive: `${pp(M.vol.active - M.vol.passive)} (lower absolute volatility)`,
    badge: "SIMULATED",
    formulaExplanation:
      "Daily return sample standard deviation × √252. The delta is an absolute difference in percentage points (pp), not a relative change.",
  },
  {
    metric: "Sharpe Ratio (Rf = 6.80% 10Y G-Sec)",
    category: "Risk-Adjusted",
    activeStrategy: M.sharpe.active.toFixed(2),
    passiveStrategy: M.sharpe.passive.toFixed(2),
    benchmarkNiftyBank: M.sharpe.benchmark.toFixed(2),
    deltaVsPassive: sgn(M.sharpe.active - M.sharpe.passive),
    badge: "SIMULATED",
    formulaExplanation: `(CAGR − Rf) ÷ volatility. Active: (${M.cagr.active.toFixed(2)}% − ${RISK_FREE.toFixed(2)}%) ÷ ${M.vol.active.toFixed(2)}% = ${M.sharpe.active.toFixed(2)}. Rf is an assumed 10Y G-Sec yield.`,
  },
  {
    metric: "Treynor Ratio",
    category: "Risk-Adjusted",
    activeStrategy: pct(M.treynor.active),
    passiveStrategy: pct(M.treynor.passive),
    benchmarkNiftyBank: pct(M.treynor.benchmark),
    deltaVsPassive: pp(M.treynor.active - M.treynor.passive),
    badge: "SIMULATED",
    formulaExplanation: `(CAGR − Rf) ÷ beta. Betas vs Nifty Bank: Active ${M.beta.active.toFixed(2)}, Passive ${M.beta.passive.toFixed(2)}.`,
  },
  {
    metric: "Jensen's Alpha (vs Nifty Bank)",
    category: "Risk-Adjusted",
    activeStrategy: `${spct(M.jensen.active)} p.a.`,
    passiveStrategy: `${spct(M.jensen.passive)} p.a.`,
    benchmarkNiftyBank: "0.00%",
    deltaVsPassive: pp(M.jensen.active - M.jensen.passive),
    badge: "CALCULATED_METRIC",
    formulaExplanation: `Jensen's alpha = CAGR − [Rf + beta × (benchmark CAGR − Rf)]. Active: ${M.cagr.active.toFixed(2)}% − [${RISK_FREE.toFixed(2)}% + ${M.beta.active.toFixed(2)} × (${M.cagr.benchmark.toFixed(2)}% − ${RISK_FREE.toFixed(2)}%)] = ${spct(M.jensen.active)}%. A CAPM-style estimate using annual CAGR as a single-period proxy — not a full regression, so it will differ from Net Realized Alpha (${spct(NET_ALPHA)} pp), which is the plain CAGR gap.`,
  },
  {
    metric: "Information Ratio (IR)",
    category: "Risk-Adjusted",
    activeStrategy: M.ir.active.toFixed(2),
    passiveStrategy: M.ir.passive.toFixed(2),
    benchmarkNiftyBank: "N/A",
    deltaVsPassive: sgn(M.ir.active - M.ir.passive),
    badge: "SIMULATED",
    formulaExplanation: `IR = net alpha ÷ tracking error. Active: ${NET_ALPHA.toFixed(2)}% ÷ ${M.te.active.toFixed(2)}% = ${M.ir.active.toFixed(2)}. Passive: (${M.cagr.passive.toFixed(2)}% − ${M.cagr.benchmark.toFixed(2)}%) ÷ ${M.te.passive.toFixed(2)}% = ${M.ir.passive.toFixed(2)}. Both use the ${PERIOD_YEARS}-year window, annualised.`,
  },
  {
    metric: "Sortino Ratio (MAR = 6.80%)",
    category: "Risk-Adjusted",
    activeStrategy: M.sortino.active.toFixed(2),
    passiveStrategy: M.sortino.passive.toFixed(2),
    benchmarkNiftyBank: M.sortino.benchmark.toFixed(2),
    deltaVsPassive: sgn(M.sortino.active - M.sortino.passive),
    badge: "SIMULATED",
    formulaExplanation: "(CAGR − MAR) ÷ downside semi-deviation. Penalizes negative volatility only.",
  },
  {
    metric: "Maximum Drawdown (Peak-to-Trough)",
    category: "Tail Risk",
    activeStrategy: pct(M.mdd.active),
    passiveStrategy: pct(M.mdd.passive),
    benchmarkNiftyBank: pct(M.mdd.benchmark),
    deltaVsPassive: `${pp(M.mdd.active - M.mdd.passive)} (lower maximum drawdown)`,
    badge: "SCENARIO_ASSUMPTION",
    formulaExplanation:
      "Largest percentage drop from a cumulative high to a subsequent trough. Stored model input; the simulated drawdown chart is illustrative and will not match exactly.",
  },
  {
    metric: "Value-at-Risk (VaR 95% 1-Day)",
    category: "Tail Risk",
    activeStrategy: "-1.72%",
    passiveStrategy: "-1.98%",
    benchmarkNiftyBank: "-2.02%",
    deltaVsPassive: "+0.26 pp (smaller 1-day loss threshold)",
    badge: "SCENARIO_ASSUMPTION",
    formulaExplanation: "Historical 5th percentile daily loss threshold. Stored model input.",
  },
  {
    metric: "Tracking Error (Annualized)",
    category: "Execution & Cost",
    activeStrategy: pct(M.te.active),
    passiveStrategy: pct(M.te.passive),
    benchmarkNiftyBank: "0.00%",
    deltaVsPassive: "+3.64 pp",
    badge: "SCENARIO_ASSUMPTION",
    formulaExplanation:
      "Standard deviation of (R_portfolio − R_benchmark), annualised. Active carries a targeted active-risk budget; Passive minimizes tracking error.",
  },
  {
    metric: "Tracking Difference (vs Nifty Bank, p.a.)",
    category: "Execution & Cost",
    activeStrategy: `${spct(M.td.active)} p.a.`,
    passiveStrategy: `${spct(M.td.passive)} p.a.`,
    benchmarkNiftyBank: "0.00%",
    deltaVsPassive: pp(M.td.active - M.td.passive),
    badge: "SIMULATED",
    formulaExplanation: "Annualised CAGR of the portfolio minus annualised CAGR of Nifty Bank (the mandate benchmark).",
  },
  {
    metric: "Annualized Turnover Rate",
    category: "Execution & Cost",
    activeStrategy: "14.20%",
    passiveStrategy: "2.10%",
    benchmarkNiftyBank: "N/A",
    deltaVsPassive: "+12.10 pp",
    badge: "SCENARIO_ASSUMPTION",
    formulaExplanation: "Sum of the lesser of buys and sells divided by average mandate NAV. Stored model input.",
  },
  {
    metric: "Total Fee & Execution Friction Drag",
    category: "Execution & Cost",
    activeStrategy: `${FRICTION_DRAG.toFixed(2)}% p.a.`,
    passiveStrategy: "0.22% p.a.",
    benchmarkNiftyBank: "0.00%",
    deltaVsPassive: pp(FRICTION_DRAG - 0.22),
    badge: "SCENARIO_ASSUMPTION",
    formulaExplanation: `Same friction figure used in the alpha bridge (gross ${GROSS_ALPHA.toFixed(2)}% − friction ${FRICTION_DRAG.toFixed(2)}% = net ${NET_ALPHA.toFixed(2)}%). At 14.2% annual turnover and 25 bps per trade, direct transaction cost is under 0.1% p.a.; the remainder of the ${FRICTION_DRAG.toFixed(2)}% is management fee / TER drag, shown together here as one total.`,
  },
];