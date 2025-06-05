export function truncateNumber(number: number | string | null, digits: number = 6) {
  if (number === null) return 'NA';
  let numStr = numberToString(number).replace(/^0+(?=\d)/, '');
  if (numStr.startsWith('.')) {
    numStr = '0' + numStr;
  }
  const [whole, decimal] = numStr.split('.');
  if (!decimal || +numStr <= 0) return whole;

  const firstNonZeroIndex = decimal.search(/[1-9]/);

  if (firstNonZeroIndex === -1 || (Number(whole) > 0 && firstNonZeroIndex > digits)) {
    return whole;
  }

  const sliceTo =
    firstNonZeroIndex < digits ? digits : firstNonZeroIndex <= digits ? firstNonZeroIndex + 1 : digits + 1;

  const truncatedNumber = `${whole}.${decimal.slice(0, sliceTo)}`;

  return Number(truncatedNumber) === 0 ? '0' : truncatedNumber;
}

export const numberToString = (x: number | string): string => {
  const number = x.toString();
  if (number.includes('e-')) {
    const mantissaExponentSplit = number.split('e-');
    const exponent = parseInt(mantissaExponentSplit[1], 10);
    const [beforeDecimal, afterDecimal] = mantissaExponentSplit[0].split('.');
    const beforeDecimalLength = beforeDecimal.length;
    const zeroes = '0'.repeat(exponent - beforeDecimalLength);
    return `${'0'}.${zeroes}${beforeDecimal}${afterDecimal && afterDecimal}`;
  }
  if (number.includes('e+')) {
    const valueExponentSplit = number.split('e+');
    const exponent = parseInt(valueExponentSplit[1], 10);
    const [beforeDecimal, afterDecimal] = valueExponentSplit[0].split('.');
    const afterDecimalLength = afterDecimal ? afterDecimal.length : 0;
    if (afterDecimalLength > exponent) {
      return `${beforeDecimal}${afterDecimal}`;
    }
    const zeroes = '0'.repeat(exponent - afterDecimalLength);
    return `${beforeDecimal}${afterDecimal ? afterDecimal : ''}${zeroes}`;
  }
  return number;
};

export const countLeadingZeros = (inputString: string) => {
  const firstNonZeroIndex = inputString.search(/[^0]/);
  return firstNonZeroIndex === -1 ? inputString.length : firstNonZeroIndex;
};

export const getSignedValue = (value: number): string => {
  if (value > 0) return `${'+'}${Math.abs(value)}`;
  if (value < 0) return `${'-'}${Math.abs(value)}`;
  return `${value}`;
};

export const formatNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '0';

  const absNum = Math.abs(num);

  if (absNum >= 1e9) {
    return `${(num / 1e9).toFixed(4)}B`;
  }
  if (absNum >= 1e6) {
    return `${(num / 1e6).toFixed(4)}M`;
  }
  if (absNum >= 1e4) {
    return `${(num / 1e3).toFixed(4)}K`;
  }

  return num.toString();
};

export const formatBalance = (value: bigint, decimals: number, precision = 4) => {
  return (Number(value) / 10 ** decimals).toFixed(precision);
};
