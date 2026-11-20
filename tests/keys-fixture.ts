/** Feldpfade der Wissensbasis vor den Rechtswerten (Stand 116432c). */
export const BASE_KEYS = [
  'financing.bankPrepayFee',
  'financing.bankPrepayFeeShort',
  'financing.kfwMinPrepay',
  'financing.kfwRate358',
  'financing.kfwRate359',
  'funding.cap1',
  'funding.cap2to6',
  'funding.cap7plus',
  'funding.capDegressionStart',
  'funding.capFloor',
  'funding.capStep',
  'funding.grundRate',
  'funding.grundRateNew',
  'funding.grundRateNewFrom',
  'funding.incomeChildShift',
  'funding.incomeLimit1',
  'funding.incomeLimit2',
  'funding.incomeLimit3',
  'funding.incomeRate1',
  'funding.incomeRate2',
  'funding.incomeRate3',
  'funding.kgbDegressionStart',
  'funding.kgbEnd',
  'funding.kgbMinGasAge',
  'funding.kgbRate',
  'funding.kgbStep',
  'funding.loan358IncomeLimit',
  'funding.loanMaxPerUnit',
  'funding.maxRate',
  'funding.maxRateLowIncome',
  'funding.wsbRate',
  'tax.deadline',
  'tax.maxBonus',
  'tax.maxCost',
  'tax.minBuildingAge',
  'tax.rateYear1',
  'tax.rateYear2',
  'tax.rateYear3',
];

/** Die fünf Rechtswerte aus F2.6. */
export const NEW_KEYS = ['general.vat', 'heatPump.feedInCt', 'heatPump.smartMeterFee', 'prices.bioEnabled', 'prices.bioSteps'];

/** Erwartete Menge aller Feldpfade, sortiert. */
export const EXPECTED_KEYS = [...BASE_KEYS, ...NEW_KEYS].sort();
