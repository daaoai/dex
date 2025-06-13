import { priceRangeContent } from '@/content/positionContent';
import Text from '../ui/Text';

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
      <Text type="h2" className="text-xl font-semibold text-white mb-6">
        {priceRangeContent.title}
      </Text>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Text type="p" className="text-gray-400 mb-2">
            {priceRangeContent.min}
          </Text>
          <Text type="p" className="text-2xl font-medium text-white mb-1">
            {minPrice}
          </Text>
          <div className="text-sm text-gray-400">
            {token0Symbol} = 1 {token1Symbol}
          </div>
        </div>

        <div>
          <Text type="p" className="text-gray-400 mb-2">
            {priceRangeContent.max}
          </Text>
          <Text type="p" className="text-2xl font-medium text-white mb-1">
            {maxPrice}
          </Text>
          <div className="text-sm text-gray-400">
            {token0Symbol} = 1 {token1Symbol}
          </div>
        </div>

        <div>
          <Text type="p" className="text-gray-400 mb-2">
            {priceRangeContent.market}
          </Text>
          <Text type="p" className="text-2xl font-medium text-white mb-1">
            {marketPrice}
          </Text>
          <div className="text-sm text-gray-400">
            {token0Symbol} = 1 {token1Symbol}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
