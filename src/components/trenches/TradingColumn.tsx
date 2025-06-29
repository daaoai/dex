import { TradingItem } from '@/types/trenches';
import TradingCard from './TradingCard';
import { SlidersHorizontal } from 'lucide-react';
import Text from '../ui/Text';

interface TradingColumnProps {
  title: string;
  items: TradingItem[];
}

export default function TradingColumn({ title, items }: TradingColumnProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex items-center bg-background-8 justify-between border border-gray-700 p-4 flex-shrink-0 sm:p-3">
        <Text type="h2" className="text-white font-medium text-lg sm:text-base">
          {title}
        </Text>
        <SlidersHorizontal size={24} color="white" />
      </div>
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {items.map((item, index) => (
          <TradingCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
