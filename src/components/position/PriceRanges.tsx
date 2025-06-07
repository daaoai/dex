interface PriceRangeProps {
  minPrice: string;
  maxPrice: string;
  marketPrice: string;
  token0Symbol: string;
  token1Symbol: string;
}

const PriceRange = ({ minPrice, maxPrice, marketPrice, token0Symbol, token1Symbol }: PriceRangeProps) => {
  return (
    <div className="mt-6 p-4 bg-background rounded-lg">
      <h2 className="text-xl font-semibold text-white mb-6">Price Range</h2>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-gray-400 mb-2">Min price</div>
          <div className="text-2xl font-medium text-white mb-1">{minPrice}</div>
          <div className="text-sm text-gray-400">
            {token0Symbol} = 1 {token1Symbol}
          </div>
        </div>

        <div>
          <div className="text-gray-400 mb-2">Max price</div>
          <div className="text-2xl font-medium text-white mb-1">{maxPrice}</div>
          <div className="text-sm text-gray-400">
            {token0Symbol} = 1 {token1Symbol}
          </div>
        </div>

        <div>
          <div className="text-gray-400 mb-2">Market price</div>
          <div className="text-2xl font-medium text-white mb-1">{marketPrice}</div>
          <div className="text-sm text-gray-400">
            {token0Symbol} = 1 {token1Symbol}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
