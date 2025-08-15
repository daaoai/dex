'use client';

import { CoinGeckoService } from '@/services/coinGeckoService';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setAltTokensForChainId, setMemeTokensForChainId } from '../../store/reducers/common';
import { CoinMarketCapService } from '@/services/coinMarketCapService';
import { LiveFeedToken } from '@/types/coinGecko';

type LiveTokenFeedProps = {
  chainId: number;
};

export default function LiveTokenFeed({ chainId }: LiveTokenFeedProps) {
  const dispatch = useDispatch();
  const { memeTokens: reducerMemeTokens, altTokens: reducerAltTokens } = useSelector(
    (state: RootState) => state.common,
    shallowEqual,
  );
  const isLoadingRef = useRef<boolean>(false);
  const router = useRouter();

  const memeTokens = reducerMemeTokens[chainId] || [];
  const altTokens = reducerAltTokens[chainId] || [];

  useEffect(() => {
    const fetchTokens = async () => {
      if (isLoadingRef.current) return; // Prevent multiple fetches
      // if (reducerMemeTokens && reducerMemeTokens.length > 0) return; // Already loaded
      const isMemeLoaded = memeTokens.length > 0;
      const isAltLoaded = altTokens.length > 0;
      try {
        isLoadingRef.current = true;
        const [memeTokensPromise, altTokensPromise] = await Promise.allSettled([
          isMemeLoaded ? Promise.resolve(memeTokens) : CoinGeckoService.getMemeTokens(chainId),
          isAltLoaded ? Promise.resolve(altTokens) : CoinMarketCapService.getTrendingTokens(chainId),
        ]);
        if (memeTokensPromise.status === 'fulfilled') {
          dispatch(setMemeTokensForChainId({ chainId, tokens: memeTokensPromise.value }));
        }
        if (altTokensPromise.status === 'fulfilled') {
          dispatch(setAltTokensForChainId({ chainId, tokens: altTokensPromise.value }));
        }
      } catch (err) {
        console.error('Failed to fetch meme tokens:', err);
      } finally {
        isLoadingRef.current = false;
      }
    };

    fetchTokens();

    // Refresh data every 60 seconds to avoid rate limits
    const interval = setInterval(fetchTokens, 60000);

    return () => clearInterval(interval);
  }, [chainId]);

  // Don't render anything if no tokens and not loading
  if (!isLoadingRef.current && memeTokens.length === 0 && altTokens.length === 0) {
    return null;
  }

  // 💡 Dynamic speed logic
  const baseSpeed = 4; // min duration
  const itemSpeed = 1; // add 4s per item
  const totalItems = memeTokens.length;
  const scrollDuration = baseSpeed + totalItems * itemSpeed;

  return (
    <>
      <TokenFeed
        tokens={memeTokens}
        onTokenClick={(token) => {
          router.push(`/token/${token.address}`);
        }}
        scrollDuration={scrollDuration}
      />
      <TokenFeed
        tokens={altTokens}
        onTokenClick={(token) => {
          router.push(`/token/${token.address}`);
        }}
        scrollDuration={scrollDuration}
      />
    </>
  );
}

function TokenFeed({
  tokens,
  onTokenClick,
  scrollDuration,
}: {
  tokens: LiveFeedToken[];
  onTokenClick: (token: LiveFeedToken) => void;
  scrollDuration: number;
}) {
  return (
    <div className="relative w-full overflow-hidden bg-black py-3">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-100%'] }}
        transition={{
          repeat: Infinity,
          duration: scrollDuration,
          ease: 'linear',
        }}
      >
        {tokens.map((item, index) => (
          <FeedTokenItem
            key={`${item.address}-${index}`}
            item={item}
            onClick={() => {
              onTokenClick(item);
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
function FeedTokenItem({ item, onClick }: { item: LiveFeedToken; onClick: () => void }) {
  return (
    <div
      key={item.address}
      className="flex items-center gap-2 min-w-fit text-white text-sm cursor-pointer"
      onClick={onClick}
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
  );
}
