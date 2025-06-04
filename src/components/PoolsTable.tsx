const rows = [
  { symbol: 'BTC', tier: '0.02%', tvl: '$200.5M', apr: '0.85%', rewards: '+12.34%', vol1d: '$40.0M', vol30d: '$1.6B' },
  { symbol: 'ETH', tier: '0.03%', tvl: '$215.2M', apr: '0.90%', rewards: '+13.21%', vol1d: '$42.7M', vol30d: '$1.7B' },
  { symbol: 'ETH', tier: '0.03%', tvl: '$215.2M', apr: '0.90%', rewards: '+13.21%', vol1d: '$42.7M', vol30d: '$1.7B' },
  { symbol: 'ETH', tier: '0.03%', tvl: '$215.2M', apr: '0.90%', rewards: '+13.21%', vol1d: '$42.7M', vol30d: '$1.7B' },
  { symbol: 'ETH', tier: '0.03%', tvl: '$215.2M', apr: '0.90%', rewards: '+13.21%', vol1d: '$42.7M', vol30d: '$1.7B' },
  { symbol: 'ETH', tier: '0.03%', tvl: '$215.2M', apr: '0.90%', rewards: '+13.21%', vol1d: '$42.7M', vol30d: '$1.7B' },
];

export default function PoolsTable() {
  return (
    <div className="overflow-auto rounded-lg bg-gray-800">
      <table className="min-w-full text-left">
        <thead className="border-b border-gray-700">
          <tr>
            {['#', 'Pool', 'Protocol', 'Fee tier', 'TVL', 'Pool APR', 'Rewards APR', '1D vol', '30D vol'].map((h) => (
              <th key={h} className="px-4 py-2 text-gray-400 bg-dark-black-300">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx} className="border-b border-gray-700  bg-dark-black-10">
              <td className="px-4 py-2 bg-dark-black-300 text-white">{idx + 1}</td>
              <td className="px-4 py-2 flex items-center text-white space-x-2 bg-dark-black-300">
                <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                  {r.symbol}
                </span>
                <span>{r.symbol}</span>
              </td>
              <td className="px-4 py-2 text-white">v3</td>
              <td className="px-4 py-2 text-white">{r.tier}</td>
              <td className="px-4 py-2 text-white">{r.tvl}</td>
              <td className="px-4 py-2 text-white">{r.apr}</td>
              <td className="px-4 py-2  text-dark-purple-10">{r.rewards}</td>
              <td className="px-4 py-2 text-white">{r.vol1d}</td>
              <td className="px-4 py-2 text-white">{r.vol30d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
