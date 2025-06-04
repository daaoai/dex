import { REWARD_CONTENT } from '@/content/reward';
import Text from './ui/Text';
import { Button } from '@/shadcn/components/ui/button';
import Link from 'next/link';

export default function RewardsSummary() {
  return (
    <section
      aria-label="Rewards Summary"
      className="relative flex-1 rounded-lg p-6 bg-cover bg-center"
      style={{ backgroundImage: `url('${REWARD_CONTENT.backgroundImage}')` }}
    >
      <header className="flex justify-between items-center mb-12">
        <div>
          <Text type="h2" className="bg-gradient-purple bg-clip-text text-gradient-purple font-semibold text-4xl">
            {REWARD_CONTENT.rewards.amount}
          </Text>
          <Text type="p" className="text-gray-400">
            {REWARD_CONTENT.rewards.label}
          </Text>
        </div>
        <Button
          type="button"
          className="px-4 py-2 rounded bg-black text-pink-500  focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          {REWARD_CONTENT.actions.collect}
        </Button>
      </header>

      <div>
        <Link href="#" className="inline-block mb-1 text-white  focus:outline-none focus:ring-2 focus:ring-white">
          {REWARD_CONTENT.actions.explore}
        </Link>
        <Text type="p" className="text-white">
          {REWARD_CONTENT.description}
        </Text>
      </div>
    </section>
  );
}
