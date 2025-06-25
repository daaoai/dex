import { ChevronDown, Settings, Filter, Edit3 } from 'lucide-react';
import TradingColumn from './TradingColumn';
import { tradingData } from '@/junk/trenchedData';
import Text from '../ui/Text';

export default function TradingDashboard() {
  return (
    <div className="p-4 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Text type="span" className="text-white font-medium">
              Trenches
            </Text>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Settings className="w-4 h-4" />
            <Text type="span">Devs</Text>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Filter className="w-4 h-4" />
            <Text type="span">Filters</Text>
          </div>

          <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded">
            <Text type="span" className="text-blue-400">
              1
            </Text>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          <div className="text-gray-400 text-sm">TP/SL</div>
          <Edit3 className="w-4 h-4 text-gray-400" />
          {/* 
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy
          </Button> */}

          <div className="text-gray-400 text-sm">0</div>

          <div className="flex space-x-2 text-sm">
            <Text type="span" className="text-gray-400">
              P1
            </Text>
            <Text type="span" className="text-gray-400">
              P2
            </Text>
            <Text type="span" className="text-gray-400">
              P3
            </Text>
            <Text type="span" className="text-gray-400">
              ○
            </Text>
          </div>
        </div>
      </div>

      {/* Trading Columns - Updated for proper scrolling */}
      <div className="grid grid-cols-3 flex-1 min-h-0">
        <TradingColumn title="Just Launched" items={tradingData.justLaunched} />
        <TradingColumn title="Active" items={tradingData.active} />
        <TradingColumn title="Completed" items={tradingData.completed} />
      </div>

      {/* Footer */}
      <Text type="p" className="text-center text-gray-500 text-xs mt-4 flex-shrink-0">
        All rights reserved. Synthari 2025
      </Text>
    </div>
  );
}
