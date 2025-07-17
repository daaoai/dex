'use client';

import { motion } from 'framer-motion';

export const tickerData = [
  {
    rank: 1,
    name: 'TRUMP',
    image: '/liveTokenFeed/trump.svg',
    percent: '+4.08%',
  },
  {
    rank: 2,
    name: 'Fartcoin',
    image: '/liveTokenFeed/fartcoin.svg',
    percent: '+6.08%',
  },
  {
    rank: 3,
    name: 'Plesky',
    image: '/liveTokenFeed/plesky.svg',
    percent: '',
  },
  {
    rank: 4,
    name: 'Cooking',
    image: '/liveTokenFeed/cooking.svg',
    percent: '+2.33%',
  },
  {
    rank: 5,
    name: 'ElonX',
    image: '/liveTokenFeed/trump.svg',
    percent: '+7.12%',
  },
  {
    rank: 6,
    name: 'MoonShot',
    image: '/liveTokenFeed/fartcoin.svg',
    percent: '+1.88%',
  },
];

export default function LiveTokenFeed() {
  // 💡 Dynamic speed logic
  const baseSpeed = 20; // min duration
  const itemSpeed = 4; // add 4s per item
  const totalItems = tickerData.length;
  const scrollDuration = baseSpeed + totalItems * itemSpeed;

  return (
    <div className="relative w-full overflow-hidden bg-black py-3 ">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-100%'] }}
        transition={{
          repeat: Infinity,
          duration: scrollDuration,
          ease: 'linear',
        }}
      >
        {[...tickerData, ...tickerData].map((item, index) => (
          <div key={index} className="flex items-center gap-2 min-w-fit text-white text-sm">
            <span className="text-zinc-500">#{item.rank}</span>
            <img src={item.image} alt={item.name} className="w-6 h-6 rounded-full object-cover" />
            <span className="font-medium">{item.name}</span>
            {item.percent && <span className="text-green-400 font-semibold">{item.percent}</span>}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
