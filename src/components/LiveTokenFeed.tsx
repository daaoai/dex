'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CoinGeckoService } from '@/services/coinGeckoService';
import type { LiveFeedToken } from '@/types/coinGecko';
import { useRouter } from 'next/navigation';

type LiveTokenFeedProps = {
  chainId: number;
};

export default function LiveTokenFeed({ chainId }: LiveTokenFeedProps) {
  const [memeTokens, setMemeTokens] = useState<LiveFeedToken[]>([]);
  const isLoadingRef = useRef<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMemeTokens = async () => {
      if (isLoadingRef.current) return; // Prevent multiple fetches
      try {
        isLoadingRef.current = true;
        const tokens = await CoinGeckoService.getMemeTokens(chainId);
        setMemeTokens(tokens);
      } catch (err) {
        console.error('Failed to fetch meme tokens:', err);
        setMemeTokens([]);
      } finally {
        isLoadingRef.current = false;
      }
    };

    fetchMemeTokens();

    // Refresh data every 60 seconds to avoid rate limits
    const interval = setInterval(fetchMemeTokens, 60000);

    return () => clearInterval(interval);
  }, [chainId]);

  // Don't render anything if no tokens and not loading
  if (!isLoadingRef.current && memeTokens.length === 0) {
    return null;
  }

  // 💡 Dynamic speed logic
  const baseSpeed = 20; // min duration
  const itemSpeed = 4; // add 4s per item
  const totalItems = memeTokens.length;
  const scrollDuration = baseSpeed + totalItems * itemSpeed;

  return (
    <div className="relative w-full overflow-hidden bg-black py-3">
      {!isLoadingRef.current && memeTokens.length > 0 && (
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: ['0%', '-100%'] }}
          transition={{
            repeat: Infinity,
            duration: scrollDuration,
            ease: 'linear',
          }}
        >
          {[...memeTokens, ...memeTokens].map((item, index) => (
            <div
              key={`${item.address}-${index}`}
              className="flex items-center gap-2 min-w-fit text-white text-sm cursor-pointer"
              onClick={() => {
                router.push(`/token/${item.address}`);
              }}
            >
              <span className="text-zinc-500">#{item.rank}</span>
              <img
                src={item.image || '/liveTokenFeed/trump.svg'}
                alt={item.name}
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => {
                  // Fallback to default image if token image fails to load
                  (e.target as HTMLImageElement).src = '/liveTokenFeed/trump.svg';
                }}
              />
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-400 text-xs">({item.symbol})</span>
              {item.percent && (
                <span
                  className={`font-semibold ${
                    item.percent.startsWith('+')
                      ? 'text-green-400'
                      : item.percent.startsWith('-')
                        ? 'text-red-400'
                        : 'text-gray-400'
                  }`}
                >
                  {item.percent}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
