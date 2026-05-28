export const calcPricing = (costPrice: number, salePrice: number) => {
  const markupRub = salePrice - costPrice;
  const foodCostPercent = salePrice === 0 ? 0 : (costPrice / salePrice) * 100;
  const markupPercent = salePrice === 0 ? 0 : (markupRub / salePrice) * 100;
  const markupMultiplier = costPrice === 0 ? 0 : salePrice / costPrice;
  return { markupRub, foodCostPercent, markupPercent, markupMultiplier };
};

export const calcGrossProfit = (revenue: number, costPrice: number, quantity: number) => {
  return revenue - costPrice * quantity;
};
