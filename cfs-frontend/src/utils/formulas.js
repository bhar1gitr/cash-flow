// Formulas derived from PDF Page 9 and 19
export const calculateRatios = (data) => {
  const { revenue, cogs, accountsReceivable, inventory, accountsPayable } = data;

  const arDays = (accountsReceivable / revenue) * 365; //
  const inventoryDays = (inventory / cogs) * 365;     //
  const apDays = (accountsPayable / cogs) * 365;      //
  
  return {
    arDays: arDays.toFixed(2),
    inventoryDays: inventoryDays.toFixed(2),
    apDays: apDays.toFixed(2),
    workingCapitalDays: (arDays + inventoryDays - apDays).toFixed(2), //
    grossMarginPct: ((revenue - cogs) / revenue * 100).toFixed(2)      //
  };
};