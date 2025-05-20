import Text from './Text';

export default function RewardsSummary() {
  return (
    <div className="bg-gray-800 rounded-lg p-6 flex-1">
      <div className="flex justify-between ">
        <div>
          <h2 className="text-4xl text-dark-purple-10 font-bold">0 UNI</h2>
          <p className="text-gray-400">Rewards earned</p>
        </div>
        <div>
          <button className="bg-black dark:text-dark-purple-10 px-4 py-2 rounded">Collect rewards</button>
        </div>
      </div>
      <button className="text-white purple-400 hover:underline">Find pools with UNI rewards &rarr;</button>
      <Text type="p" className="text-white">
        Eligible pools have token rewards so you can earn more.
      </Text>
    </div>
  );
}
