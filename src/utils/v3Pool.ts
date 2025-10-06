import Decimal from 'decimal.js';
import { formatUnits, parseUnits } from 'viem';

export class V3PoolUtils {
  private static Q96 = 1n << 96n;
  private static tickMultiplier = 1.0001;

  public static nearestUsableTick = ({ tick, tickSpacing }: { tick: number; tickSpacing: number }) => {
    return Math.round(tick / tickSpacing) * tickSpacing;
  };

  public static getTickFromPrice = ({
    price,
    decimal0,
    tickSpacing,
    decimal1,
  }: {
    price: number;
    tickSpacing: number;
    decimal0: number;
    decimal1: number;
  }) => {
    const calculatedTick = Math.floor(
      Math.log(price / (Math.pow(10, decimal0) / Math.pow(10, decimal1))) / Math.log(V3PoolUtils.tickMultiplier),
    );
    return V3PoolUtils.nearestUsableTick({ tick: calculatedTick, tickSpacing });
  };

  public static getPriceFromTick = ({
    tick,
    decimal0,
    decimal1,
  }: {
    tick: number;
    decimal0: number;
    decimal1: number;
  }) => {
    return new Decimal(V3PoolUtils.tickMultiplier)
      .pow(tick)
      .mul(new Decimal(10).pow(decimal0))
      .div(new Decimal(10).pow(decimal1))
      .toNumber();
  };

  public static getPriceFromSqrtRatio = ({
    sqrtPriceX96,
    decimal0,
    decimal1,
  }: {
    sqrtPriceX96: bigint;
    decimal0: number;
    decimal1: number;
  }) => {
    return new Decimal(sqrtPriceX96.toString())
      .div(new Decimal(V3PoolUtils.Q96.toString()))
      .pow(2)
      .mul(new Decimal(10).pow(decimal0))
      .div(new Decimal(10).pow(decimal1))
      .toNumber();
  };

  public static getSqrtPriceX96FromTick = ({ tick }: { tick: number }) => {
    return BigInt(
      new Decimal(V3PoolUtils.tickMultiplier)
        .pow(tick / 2)
        .mul(V3PoolUtils.Q96.toString())
        .toFixed(0, Decimal.ROUND_DOWN),
    );
  };

  public static getLiquidityOfToken0 = ({
    formattedToken0Amount,
    currentPrice,
    upperTick,
    decimal0,
    decimal1,
  }: {
    formattedToken0Amount: number;
    currentPrice: number;
    upperTick: number;
    decimal0: number;
    decimal1: number;
  }) => {
    const maxPrice = V3PoolUtils.getPriceFromTick({ tick: upperTick, decimal0, decimal1 });
    const sqrtCurrentPrice = Math.sqrt(currentPrice);
    const sqrtMaxPrice = Math.sqrt(maxPrice);
    return (formattedToken0Amount * sqrtCurrentPrice * sqrtMaxPrice) / (sqrtMaxPrice - sqrtCurrentPrice);
  };

  public static getLiquidityOfToken1 = ({
    formattedToken1Amount,
    currentPrice,
    lowerTick,
    decimal0,
    decimal1,
  }: {
    formattedToken1Amount: number;
    currentPrice: number;
    lowerTick: number;
    decimal0: number;
    decimal1: number;
  }) => {
    const minPrice = V3PoolUtils.getPriceFromTick({ tick: lowerTick, decimal0, decimal1 });
    const sqrtCurrentPrice = Math.sqrt(currentPrice);
    const sqrtMinPrice = Math.sqrt(minPrice);
    return formattedToken1Amount / (sqrtCurrentPrice - sqrtMinPrice);
  };

  public static getToken1Amount = ({
    formattedToken0Amount,
    sqrtPriceX96,
    lowerTick,
    upperTick,
    decimal0,
    decimal1,
  }: {
    formattedToken0Amount: number;
    sqrtPriceX96: bigint;
    lowerTick: number;
    upperTick: number;
    decimal0: number;
    decimal1: number;
  }) => {
    const currentPrice = V3PoolUtils.getPriceFromSqrtRatio({
      sqrtPriceX96,
      decimal0,
      decimal1,
    });
    const liquidityOfToken0 = V3PoolUtils.getLiquidityOfToken0({
      formattedToken0Amount,
      currentPrice,
      upperTick,
      decimal0,
      decimal1,
    });
    const minPrice = V3PoolUtils.getPriceFromTick({ tick: lowerTick, decimal0, decimal1 });
    const sqrtCurrentPrice = Math.sqrt(currentPrice);
    const sqrtMinPrice = Math.sqrt(minPrice);
    return new Decimal(liquidityOfToken0 * (sqrtCurrentPrice - sqrtMinPrice)).toFixed(decimal1, Decimal.ROUND_DOWN);
  };

  public static getToken0Amount = ({
    formattedToken1Amount,
    sqrtPriceX96,
    lowerTick,
    upperTick,
    decimal0,
    decimal1,
  }: {
    formattedToken1Amount: number;
    sqrtPriceX96: bigint;
    lowerTick: number;
    upperTick: number;
    decimal0: number;
    decimal1: number;
  }) => {
    const currentPrice = V3PoolUtils.getPriceFromSqrtRatio({
      sqrtPriceX96,
      decimal0,
      decimal1,
    });
    const liquidityOfToken1 = V3PoolUtils.getLiquidityOfToken1({
      formattedToken1Amount,
      currentPrice,
      lowerTick,
      decimal0,
      decimal1,
    });
    const maxPrice = V3PoolUtils.getPriceFromTick({ tick: upperTick, decimal0, decimal1 });
    const sqrtCurrentPrice = Math.sqrt(currentPrice);
    const sqrtMaxPrice = Math.sqrt(maxPrice);
    return new Decimal(liquidityOfToken1 * (1 / sqrtCurrentPrice - 1 / sqrtMaxPrice)).toFixed(
      decimal0,
      Decimal.ROUND_DOWN,
    );
  };

  public static getTickAtSqrtPrice = ({ sqrtPriceX96 }: { sqrtPriceX96: bigint }) => {
    const sqrtPrice = new Decimal(sqrtPriceX96.toString()).div(V3PoolUtils.Q96.toString());
    const price = sqrtPrice.pow(2);
    const tick = new Decimal(Math.log(price.toNumber())).div(Math.log(V3PoolUtils.tickMultiplier));
    return Math.floor(tick.toNumber());
  };

  public static getTokenAmountsForLiquidity = ({
    liquidity,
    sqrtPriceX96,
    lowerTick,
    upperTick,
  }: {
    liquidity: bigint;
    sqrtPriceX96: bigint;
    lowerTick: number;
    upperTick: number;
  }) => {
    const sqrtRatioA = new Decimal(Math.sqrt(Math.pow(V3PoolUtils.tickMultiplier, lowerTick)));
    const sqrtRatioB = new Decimal(Math.sqrt(Math.pow(V3PoolUtils.tickMultiplier, upperTick)));

    const sqrtPrice = new Decimal(sqrtPriceX96.toString()).div(V3PoolUtils.Q96.toString());
    const currentTick = V3PoolUtils.getTickAtSqrtPrice({ sqrtPriceX96 });
    let amount0InWei = new Decimal(0);
    let amount1InWei = new Decimal(0);
    if (currentTick < lowerTick) {
      amount0InWei = new Decimal(liquidity.toString()).mul(
        sqrtRatioB.minus(sqrtRatioA).div(sqrtRatioA.mul(sqrtRatioB)),
      );
    } else if (currentTick >= upperTick) {
      amount1InWei = new Decimal(liquidity.toString()).mul(sqrtRatioB.minus(sqrtRatioA));
    } else if (currentTick >= lowerTick && currentTick < upperTick) {
      amount0InWei = new Decimal(liquidity.toString()).mul(
        sqrtRatioB.minus(sqrtPrice).div(new Decimal(sqrtPrice).mul(sqrtRatioB)),
      );
      amount1InWei = new Decimal(liquidity.toString()).mul(new Decimal(sqrtPrice).minus(sqrtRatioA));
    }

    return {
      amount0: BigInt(amount0InWei.toFixed(0, Decimal.ROUND_DOWN)),
      amount1: BigInt(amount1InWei.toFixed(0, Decimal.ROUND_DOWN)),
    };
  };

  public static maxLiquidityForAmount0 = ({
    sqrtRatioAX96,
    sqrtRatioBX96,
    amount0,
  }: {
    sqrtRatioAX96: bigint;
    sqrtRatioBX96: bigint;
    amount0: bigint;
  }): bigint => {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }
    const intermediate = (sqrtRatioAX96 * sqrtRatioBX96) / V3PoolUtils.Q96;
    return (amount0 * intermediate) / (sqrtRatioBX96 - sqrtRatioAX96);
  };

  public static maxLiquidityForAmount1 = ({
    sqrtRatioAX96,
    sqrtRatioBX96,
    amount1,
  }: {
    sqrtRatioAX96: bigint;
    sqrtRatioBX96: bigint;
    amount1: bigint;
  }): bigint => {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }
    return (amount1 * V3PoolUtils.Q96) / (sqrtRatioBX96 - sqrtRatioAX96);
  };

  public static getLiquidityForAmounts = ({
    sqrtPriceX96,
    lowerTick,
    upperTick,
    amount0,
    amount1,
  }: {
    sqrtPriceX96: bigint;
    lowerTick: number;
    upperTick: number;
    amount0: bigint;
    amount1: bigint;
  }) => {
    const sqrtRatioA = V3PoolUtils.getSqrtPriceX96FromTick({ tick: lowerTick });
    const sqrtRatioB = V3PoolUtils.getSqrtPriceX96FromTick({ tick: upperTick });

    if (sqrtPriceX96 <= BigInt(sqrtRatioA)) {
      return V3PoolUtils.maxLiquidityForAmount0({
        amount0,
        sqrtRatioAX96: BigInt(sqrtRatioA),
        sqrtRatioBX96: BigInt(sqrtRatioB),
      });
    } else if (sqrtPriceX96 < BigInt(sqrtRatioB)) {
      const liquidity0 = V3PoolUtils.maxLiquidityForAmount0({
        amount0,
        sqrtRatioAX96: BigInt(sqrtPriceX96),
        sqrtRatioBX96: BigInt(sqrtRatioB),
      });
      const liquidity1 = V3PoolUtils.maxLiquidityForAmount1({
        amount1,
        sqrtRatioAX96: BigInt(sqrtRatioA),
        sqrtRatioBX96: BigInt(sqrtPriceX96),
      });
      return liquidity0 < liquidity1 ? liquidity0 : liquidity1;
    } else {
      return V3PoolUtils.maxLiquidityForAmount1({
        amount1,
        sqrtRatioAX96: BigInt(sqrtRatioA),
        sqrtRatioBX96: BigInt(sqrtRatioB),
      });
    }
  };

  public static calculateAprByRange = ({
    poolApr,
    lowerTick,
    upperTick,
    tickSpacing,
  }: {
    poolApr: number;
    lowerTick: number;
    upperTick: number;
    tickSpacing: number;
  }) => {
    const bin = Math.abs((upperTick - lowerTick) / tickSpacing);
    return Number((poolApr / bin).toFixed(2));
  };

  public static calculateOptimalAmount = ({
    token0,
    token1,
    sqrtPriceX96,
    lowerTick,
    upperTick,
  }: {
    token0: {
      decimals: number;
      amount: bigint;
    };
    token1: {
      decimals: number;
      amount: bigint;
    };
    sqrtPriceX96: bigint;
    lowerTick: number;
    upperTick: number;
  }) => {
    const token1AmountForFullToken0 = V3PoolUtils.getToken1Amount({
      formattedToken0Amount: Number(formatUnits(token0.amount, token0.decimals)),
      sqrtPriceX96,
      decimal0: token0.decimals,
      decimal1: token1.decimals,
      lowerTick,
      upperTick,
    });
    const parsedToken1ForFullToken0 = parseUnits(token1AmountForFullToken0.toString(), token1.decimals);
    if (token1.amount >= parsedToken1ForFullToken0) {
      return {
        amount0: token0.amount <= BigInt(0) ? BigInt(0) : token0.amount,
        amount1: parsedToken1ForFullToken0 <= BigInt(0) ? BigInt(0) : parsedToken1ForFullToken0,
      };
    } else {
      const token0AmountForFullToken1 = V3PoolUtils.getToken0Amount({
        formattedToken1Amount: Number(formatUnits(token1.amount, token1.decimals)),
        sqrtPriceX96,
        lowerTick,
        upperTick,
        decimal0: token0.decimals,
        decimal1: token1.decimals,
      });

      const parsedToken0ForFullToken1 = parseUnits(token0AmountForFullToken1.toString(), token0.decimals);

      return {
        amount0: parsedToken0ForFullToken1 <= BigInt(0) ? BigInt(0) : parsedToken0ForFullToken1,
        amount1: token1.amount <= BigInt(0) ? BigInt(0) : token1.amount,
      };
    }
  };

  public static calculateFeesInTokens = ({
    lowerTick,
    upperTick,
    currentTick,
    liquidity,
    feeGrowthGlobal0X128,
    feeGrowthGlobal1X128,
    feeGrowthOutsideLower0,
    feeGrowthOutsideLower1,
    feeGrowthOutsideUpper0,
    feeGrowthOutsideUpper1,
    feeGrowthInside0LastX128,
    feeGrowthInside1LastX128,
  }: {
    lowerTick: number;
    upperTick: number;
    currentTick: number;
    liquidity: bigint;
    feeGrowthGlobal0X128: bigint;
    feeGrowthGlobal1X128: bigint;
    feeGrowthOutsideLower0: bigint;
    feeGrowthOutsideLower1: bigint;
    feeGrowthOutsideUpper0: bigint;
    feeGrowthOutsideUpper1: bigint;
    feeGrowthInside0LastX128: bigint;
    feeGrowthInside1LastX128: bigint;
  }) => {
    const calculateFees = (liq: Decimal, feeGrowthInsideLast: Decimal, feeGrowthInsideCurrent: Decimal) => {
      const feeGrowthDelta = feeGrowthInsideCurrent.minus(feeGrowthInsideLast);
      const feesEarned = liq.mul(feeGrowthDelta).div(new Decimal(2).pow(128));
      return feesEarned;
    };

    const liquidityDecimal = new Decimal(liquidity.toString());
    let feeGrowthInside0X128 = new Decimal(feeGrowthInside0LastX128.toString());
    let feeGrowthInside1X128 = new Decimal(feeGrowthInside1LastX128.toString());

    if (currentTick < lowerTick) {
      feeGrowthInside0X128 = new Decimal(feeGrowthOutsideLower0.toString());
      feeGrowthInside1X128 = new Decimal(feeGrowthOutsideLower1.toString());
    } else if (currentTick > upperTick) {
      feeGrowthInside0X128 = new Decimal(feeGrowthOutsideUpper0.toString());
      feeGrowthInside1X128 = new Decimal(feeGrowthOutsideUpper1.toString());
    } else {
      feeGrowthInside0X128 = new Decimal(
        (feeGrowthGlobal0X128 - feeGrowthOutsideLower0 - feeGrowthOutsideUpper0).toString(),
      );
      feeGrowthInside1X128 = new Decimal(
        (feeGrowthGlobal1X128 - feeGrowthOutsideLower1 - feeGrowthOutsideUpper1).toString(),
      );
    }

    const feesEarnedToken0 = calculateFees(
      liquidityDecimal,
      new Decimal(feeGrowthInside0LastX128.toString()),
      feeGrowthInside0X128,
    );
    const feesEarnedToken1 = calculateFees(
      liquidityDecimal,
      new Decimal(feeGrowthInside1LastX128.toString()),
      feeGrowthInside1X128,
    );

    return {
      feesEarnedToken0: BigInt(feesEarnedToken0.toFixed(0, Decimal.ROUND_DOWN)),
      feesEarnedToken1: BigInt(feesEarnedToken1.toFixed(0, Decimal.ROUND_DOWN)),
    };
  };

  public static getLowestUsableTick = ({ tickSpacing }: { tickSpacing: number }) => {
    const minTick = -887272;
    return Math.ceil(minTick / tickSpacing) * tickSpacing;
  };

  public static getHighestUsableTick = ({ tickSpacing }: { tickSpacing: number }) => {
    const maxTick = 887272;
    return Math.floor(maxTick / tickSpacing) * tickSpacing;
  };

  public static getDefaultTicks = ({ currentTick, tickSpacing }: { currentTick: number; tickSpacing: number }) => {
    return {
      lowerTick: V3PoolUtils.nearestUsableTick({
        tick: currentTick - 2 * tickSpacing,
        tickSpacing: tickSpacing,
      }),
      upperTick: V3PoolUtils.nearestUsableTick({
        tick: currentTick + 2 * tickSpacing,
        tickSpacing: tickSpacing,
      }),
    };
  };
}
