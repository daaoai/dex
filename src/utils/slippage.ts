import Decimal from 'decimal.js';
const SLIPPAGE_MULTIPLIER = 100;

export const getMinAmount = (amount: bigint, slippage: number) => {
  const destAmount = new Decimal(amount.toString());
  const slippageTolerance = slippage * SLIPPAGE_MULTIPLIER;
  const minAmount = destAmount
    .minus(destAmount.mul(slippageTolerance).dividedBy(100).dividedBy(SLIPPAGE_MULTIPLIER))
    .toFixed(0);

  return BigInt(minAmount);
};
