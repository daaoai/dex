import { Button } from '@/shadcn/components/ui/button';
import Text from './Text';

const topPools = Array(2).fill({ pair: 'USDC/USDT', version: 'V4', fee: '0.01%', apr: '0.69%', rewards: '+10.94%' });

export default function TopPoolsSidebar() {
  return (
    <div className="w-full flex flex-col gap-4">
      <Text type="h3" className="text-lg font-semibold text-white">
        Top 3 Pools by TVL
      </Text>
      {topPools.map((p, i) => (
        <div key={i} className="bg-dark-black-50 rounded-lg p-4 flex justify-between items-center">
          <div>
            <Text type="p" className="font-medium text-white">
              {p.pair}
            </Text>
            <Text type="p" className="text-sm text-gray-400">
              {p.version} • {p.fee}
            </Text>
          </div>
          <div className="text-right">
            <Text type="p" className="text-white">
              {p.apr} APR
            </Text>
            <Text type="p" className="text-purple-400 text-sm">
              {p.rewards}
            </Text>
          </div>
        </div>
      ))}
      <Button className="text-white text-start hover:underline">Explore more pools &rarr;</Button>
    </div>
  );
}
