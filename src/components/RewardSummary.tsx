import { REWARD_CONTENT } from '@/content/reward';
import Text from './Text';

export default function RewardsSummary() {
  return (
    <section
      aria-label="Rewards Summary"
      className="relative flex-1 rounded-lg p-6 bg-cover bg-center"
      style={{ backgroundImage: `url('${REWARD_CONTENT.backgroundImage}')` }}
    >
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="bg-gradient-purple bg-clip-text text-gradient-purple font-semibold text-4xl">
            {REWARD_CONTENT.rewards.amount}
          </h2>
          <p className="text-gray-400">{REWARD_CONTENT.rewards.label}</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded bg-black text-pink-500 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          {REWARD_CONTENT.actions.collect}
        </button>
      </header>

      <div>
        <a
          href="#"
          className="inline-block mb-1 text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white"
        >
          {REWARD_CONTENT.actions.explore}
        </a>
        <Text type="p" className="text-white">
          {REWARD_CONTENT.description}
        </Text>
      </div>
    </section>
  );
}
