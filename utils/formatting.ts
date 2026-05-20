//
//
export const CurrencyToText = (amount: number): String => {
  const formatDecimal = Intl.NumberFormat("en-US");
  return formatDecimal.format(amount);
};
