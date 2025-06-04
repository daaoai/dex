import Image from 'next/image';
import Text from './ui/Text';

const topPools = Array(3).fill({
  pair: 'USDC/USDT0',
  version: 'V4',
  fee: '0.01%',
  apr: '0.69%',
  rewards: '+10.94',
  tokenIcon: '/usdt-icon.svg',
});

export default function TopPoolsSidebar() {
  return (
    <div className="w-full flex flex-col gap-4">
      <Text type="h3" className="text-lg font-semibold text-white">
        Top 3 Pools by TVL
      </Text>

      {topPools.map((p, i) => (
        <div key={i} className="bg-grey-3 rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              width={60}
              height={60}
              src={p.tokenIcon}
              alt="Token Icon"
              className="w-10 h-10 rounded-full bg-white p-1"
            />
            <div>
              <Text type="p" className="font-semibold text-white">
                {p.pair}
              </Text>
              <div className="flex items-center text-xs text-gray-300 gap-2">
                <Text type="p" className="bg-[#1f1f1f] px-2 py-0.5 rounded-md">
                  {p.version}
                </Text>
                <Text type="p" className="bg-[#1f1f1f] px-2 py-0.5 rounded-md">
                  {p.fee}
                </Text>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Text type="p" className="text-white">
              {p.apr} APR
            </Text>
            <div className="flex items-center justify-end gap-2">
              <div className="text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md px-2 py-1 flex items-center gap-1 font-semibold">
                {p.rewards}
                {/* <FaUniswap size={16} /> */}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* 
      <Button variant="link" className="text-white text-start px-0">
        Explore more pools →
      </Button> */}
    </div>
  );
}
