export const calculateFullStory = (data) => {
  // --- CHAPTER 1: PROFITABILITY ---
  const grossMargin = data.revenue - data.cogs;
  const grossMarginPct = (grossMargin / data.revenue) * 100;
  const operatingProfit = grossMargin - data.overheads;
  const operatingProfitPct = (operatingProfit / data.revenue) * 100;
  const ebitda = operatingProfit + data.depreciation;
  const netProfitBeforeTax = operatingProfit - data.interestPaid;
  const netProfit = netProfitBeforeTax - data.taxation;
  const netProfitPct = (netProfit / data.revenue) * 100;
  const interestCover = operatingProfit / data.interestPaid;

  // --- CHAPTER 2: WORKING CAPITAL ---
  const arDays = (data.accountsReceivable / data.revenue) * 365;
  const inventoryDays = (data.inventory / data.cogs) * 365;
  const apDays = (data.accountsPayable / data.cogs) * 365;
  const workingCapital = data.accountsReceivable + data.inventory - data.accountsPayable;
  const workingCapitalDays = arDays + inventoryDays - apDays;
  const wcPer100 = (workingCapital / data.revenue) * 100;
  const wcTurnover = data.revenue / workingCapital;

  // --- CHAPTER 3: OTHER CAPITAL ---
  const otherAssets = data.otherCurrentAssets + data.otherNonCurrentAssets;
  const otherCapital = data.fixedAssets + otherAssets - data.otherCurrentLiabilities;
  const netOperatingAssets = workingCapital + otherCapital;
  const assetTurnover = data.revenue / netOperatingAssets;
  const returnOnCapital = (operatingProfit / netOperatingAssets) * 100;
  const returnOnEquity = (netProfit / data.equity) * 100;

  // --- CHAPTER 4: FUNDING ---
  const totalDebt = data.bankLoansCurrent + data.bankLoansNonCurrent;
  const netDebt = totalDebt - data.cash;
  const debtToEquity = totalDebt / data.equity;
  const debtPayback = totalDebt / ebitda;

  // --- POWER OF ONE (1% / 1 Day Impact) ---
  const powerOfOne = {
    price: data.revenue * 0.01,
    volume: grossMargin * 0.01,
    cogs: data.cogs * 0.01,
    overheads: data.overheads * 0.01,
    arDays: data.revenue / 365,
    invDays: data.cogs / 365,
    apDays: data.cogs / 365
  };

  // --- VALUATION ---
  const profitMultiple = 4; // Default from PDF
  const grossBusinessValue = ebitda * profitMultiple;
  const currentBusinessValue = grossBusinessValue - netDebt;

  return {
    ch1: { grossMargin, grossMarginPct, operatingProfit, operatingProfitPct, ebitda, netProfit, netProfitPct, interestCover },
    ch2: { arDays, inventoryDays, apDays, workingCapital, workingCapitalDays, wcPer100, wcTurnover },
    ch3: { otherCapital, netOperatingAssets, assetTurnover, returnOnCapital, returnOnEquity },
    ch4: { netDebt, debtToEquity, debtPayback },
    powerOfOne,
    valuation: { currentBusinessValue }
  };
};