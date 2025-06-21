/**
 * Calculates APR (Annual Percentage Rate) for a liquidity pool
 * Formula: APR = (Daily Fee Revenue / TVL) * 365 * 100
 *
 * @param dailyVolumeUSD - 24h volume in USD
 * @param feeTier - Fee tier as decimal (e.g., 0.003 for 0.3%)
 * @param totalValueLockedUSD - Total Value Locked in USD
 * @returns APR as percentage
 */
export const calculatePoolAPR = (dailyVolumeUSD: number, feeTier: number, totalValueLockedUSD: number): number => {
  // Avoid division by zero
  if (totalValueLockedUSD === 0) {
    return 0;
  }

  // Calculate daily fee revenue
  const dailyFeeRevenue = dailyVolumeUSD * feeTier;

  // Calculate daily yield as percentage
  const dailyYield = dailyFeeRevenue / totalValueLockedUSD;

  // Annualize the yield and convert to percentage
  const apr = dailyYield * 365 * 100;

  return apr;
};

/**
 * Calculates 7-day average APR for more stable APR estimation
 * @param poolDayData - Array of daily pool data
 * @param feeTier - Fee tier as decimal
 * @param totalValueLockedUSD - Current TVL in USD
 * @returns 7-day average APR as percentage
 */
export const calculate7DayAverageAPR = (
  poolDayData: Array<{ volumeUSD: string; date: number }>,
  feeTier: number,
  totalValueLockedUSD: number,
): number => {
  if (totalValueLockedUSD === 0 || poolDayData.length === 0) {
    return 0;
  }

  // Sort by date and take last 7 days
  const sortedData = poolDayData.sort((a, b) => b.date - a.date).slice(0, 7);

  if (sortedData.length === 0) {
    return 0;
  }

  // Calculate average daily volume
  const totalVolume = sortedData.reduce((sum, day) => sum + parseFloat(day.volumeUSD || '0'), 0);
  const averageDailyVolume = totalVolume / sortedData.length;

  // Calculate APR based on average daily volume
  return calculatePoolAPR(averageDailyVolume, feeTier, totalValueLockedUSD);
};
