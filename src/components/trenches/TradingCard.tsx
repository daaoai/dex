import { TradingItem } from '@/types/trenches';
import { ArrowUp, Users } from 'lucide-react';
import { Skull } from 'lucide-react';
import Text from '../ui/Text';

interface TradingCardProps {
  item: TradingItem;
}

export default function TradingCard({ item }: TradingCardProps) {
  return (
    <div className="bg-background-8 border border-gray-700 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 w-full">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-700">
            {/* <img src={item.image || <Skull />} alt={item.name} className="w-full h-full object-cover" /> */}
            <Skull className="w-full h-full text-gray-400" />
          </div>

          <div className="w-full">
            <div className="flex items-center space-x-2">
              <Text type="span" className="text-white font-medium">
                {item.token}
              </Text>
              <Text type="span" className="text-gray-400 text-sm">
                {item.name}
              </Text>
            </div>
            <div className="text-xs text-gray-500 mt-1">{item.filename}</div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <ArrowUp className="w-3 h-3 text-green-400" />
                  <Text type="span" className="text-green-400">
                    +{item.percentage}%
                  </Text>
                </div>

                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-gray-400" />
                  <Text type="span" className="text-white">
                    {item.holders}
                  </Text>
                </div>

                <div className="flex items-center space-x-1">
                  <Text type="span" className="text-blue-400">
                    {item.rating}
                  </Text>
                </div>

                <div className="flex items-center space-x-1">
                  <ArrowUp className="w-3 h-3 text-red-400" />
                  <Text type="span" className="text-red-400">
                    {item.change}%
                  </Text>
                </div>
              </div>

              <button className="bg-background-5 py-1 rounded-sm text-white text-xs px-3">Buy</button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Text type="span" className="text-gray-400">
                  Success Rate
                </Text>
                <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <Text type="span" className="text-white text-xs">
                    ?
                  </Text>
                </div>
                <Text type="span" className="text-white">
                  {item.successRate}%
                </Text>
              </div>

              <div className="text-gray-400">
                V ${item.volume} MC ${item.marketCap} TX {item.transactions}
              </div>
            </div>
          </div>
        </div>

        {item.timeLeft && <div className="text-xs text-gray-400">Ends in {item.timeLeft}</div>}
      </div>

      <div className="flex items-center justify-start gap-8 mt-2 text-xs">
        <div className="text-xs text-orange-400 mt-1">{item.filename}</div>

        {/* <div className="flex items-center space-x-2">
          <Text type "span" className="text-orange-400">By {item.creator}</span>
          <div className="flex items-center space-x-1">
            <X className="w-3 h-3 text-gray-400" />
            <MessageCircle className="w-3 h-3 text-gray-400" />
            <Link className="w-3 h-3 text-gray-400" />
            {item.hasRun && <Play className="w-3 h-3 text-gray-400" />}
          </div>
        </div> */}

        <div className="text-gray-400">
          Earn ~{item.earnings} SYNTH if held {item.holdTime}
        </div>
      </div>
    </div>
  );
}
