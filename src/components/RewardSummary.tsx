import Text from './Text';

export default function RewardsSummary() {
  return (
    <div
      className="rounded-lg p-6 flex-1 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/rewardSummaryFrame.svg')", // make sure this is a .png, not .svh
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-4xl text-pink-500 font-bold">0 UNI</h2>
          <p className="text-gray-400">Rewards earned</p>
        </div>
        <button className="bg-black text-pink-500 px-4 py-2 rounded">Collect rewards</button>
      </div>

      <button className="text-white hover:underline mb-1">Find pools with UNI rewards &rarr;</button>
      <Text type="p" className="text-white">
        Eligible pools have token rewards so you can earn more.
      </Text>
    </div>
  );
}
