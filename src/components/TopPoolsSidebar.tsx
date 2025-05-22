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
            <p className="font-medium text-white">{p.pair}</p>
            <p className="text-sm text-gray-400">
              {p.version} • {p.fee}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white">{p.apr} APR</p>
            <p className="text-purple-400 text-sm">{p.rewards}</p>
          </div>
        </div>
      ))}
      <button className="text-white text-start hover:underline">Explore more pools &rarr;</button>
    </div>
  );
}
