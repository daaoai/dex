/**
 * Format date based on duration for chart display
 * @param timestamp - Unix timestamp in milliseconds
 * @param days - Number of days or 'max' string
 * @returns Formatted date string
 */
export const formatChartDate = (timestamp: number, days: number | string): string => {
  const date = new Date(timestamp);
  const daysValue = typeof days === 'number' ? days : 365; // Default to 365 for "max"

  if (daysValue === 1) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (daysValue <= 7) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } else if (daysValue <= 30) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } else if (daysValue <= 90) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } else {
    return date.toLocaleDateString([], { year: '2-digit', month: 'short' });
  }
};

/**
 * Calculate step size for x-axis labels to avoid clutter
 * @param dataLength - Number of data points
 * @param days - Number of days or 'max' string
 * @returns Step size for label spacing
 */
export const calculateStepSize = (dataLength: number, days: number | string): number => {
  const daysValue = typeof days === 'number' ? days : 365;

  if (daysValue === 1) return Math.max(1, Math.floor(dataLength / 8));
  if (daysValue <= 7) return Math.max(1, Math.floor(dataLength / 6));
  if (daysValue <= 30) return Math.max(1, Math.floor(dataLength / 8));
  if (daysValue <= 90) return Math.max(1, Math.floor(dataLength / 10));
  return Math.max(1, Math.floor(dataLength / 12));
};
