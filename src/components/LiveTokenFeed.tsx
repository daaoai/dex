'use client';

import { CoinGeckoService } from '@/services/coinGeckoService';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setAltTokensForChainId, setMemeTokensForChainId } from '../../store/reducers/common';
import { CoinMarketCapService } from '@/services/coinMarketCapService';
import { LiveFeedToken } from '@/types/coinGecko';

type LiveTokenFeedProps = {
  chainId: number;
};

// Base speed (px/sec)
const SPEED_PX_PER_SEC = 50;

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

  const [pxPerSec, setPxPerSec] = useState<number>(SPEED_PX_PER_SEC);

  useEffect(() => {
    const calcPxPerSec = () => {
      if (typeof window === 'undefined') return SPEED_PX_PER_SEC;
      const w = window.innerWidth;
      if (w < 400) return SPEED_PX_PER_SEC * 4;
      if (w < 640) return SPEED_PX_PER_SEC * 3;
      if (w < 768) return SPEED_PX_PER_SEC * 2.2;
      if (w < 1440) return SPEED_PX_PER_SEC * 1.8;
      return SPEED_PX_PER_SEC * 2.2;
    };
    const apply = () => setPxPerSec(calcPxPerSec());
    apply();
    const onResize = () => apply();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const fetchTokens = async () => {
      if (isLoadingRef.current) return;
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
        console.error('Failed to fetch tokens:', err);
      } finally {
        isLoadingRef.current = false;
      }
    };
    fetchTokens();
    const interval = setInterval(fetchTokens, 60000);
    return () => clearInterval(interval);
  }, [chainId, dispatch, memeTokens.length, altTokens.length]);

  if (!isLoadingRef.current && memeTokens.length === 0 && altTokens.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      <TokenRow
        label="MEMES"
        tokens={memeTokens}
        pxPerSec={pxPerSec}
        onTokenClick={(t) => router.push(`/token/${t.address}`)}
      />
      <TokenRow
        label="ALTS"
        tokens={altTokens}
        pxPerSec={pxPerSec}
        onTokenClick={(t) => router.push(`/token/${t.address}`)}
      />
    </div>
  );
}

/** ===== Row wrapper: fixed label left + scrolling track right ===== */
function TokenRow({
  label,
  tokens,
  pxPerSec,
  onTokenClick,
}: {
  label: string;
  tokens: LiveFeedToken[];
  pxPerSec: number;
  onTokenClick: (t: LiveFeedToken) => void;
}) {
  return (
    <div className="flex items-center w-full h-[56px] relative">
      <div className="relative flex-1 overflow-hidden h-full">
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10" />
        <TokenFeed tokens={tokens} pxPerSec={pxPerSec} onTokenClick={onTokenClick} />
      </div>
    </div>
  );
}

function TokenFeed({
  tokens,
  pxPerSec,
  onTokenClick,
}: {
  tokens: LiveFeedToken[];
  pxPerSec: number;
  onTokenClick: (t: LiveFeedToken) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [distancePx, setDistancePx] = useState(0);
  const [duration, setDuration] = useState(12);

  const loopTokens = useMemo(() => {
    if (!tokens?.length) return [];
    const a = tokens.map((t) => ({ ...t, _dup: 'a' as const }));
    const b = tokens.map((t) => ({ ...t, _dup: 'b' as const }));
    return [...a, ...b];
  }, [tokens]);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const half = trackRef.current.scrollWidth / 2;
      setDistancePx(half);
      setDuration(Math.max(2.0, half / pxPerSec));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [pxPerSec, tokens]);

  if (!loopTokens.length) return null;

  return (
    <motion.div
      key={distancePx}
      ref={trackRef}
      className="absolute inset-0 flex items-center whitespace-nowrap gap-5 px-6 will-change-transform"
      animate={{ x: [0, -distancePx] }}
      transition={{
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        duration,
      }}
    >
      {loopTokens.map((item, index) => (
        <FeedTokenItem
          key={`${item.address}-${item._dup}-${index}`}
          item={item as LiveFeedToken} // now no `any` needed
          onClick={() => onTokenClick(item as LiveFeedToken)}
        />
      ))}
    </motion.div>
  );
}

/** ===== Token chip ===== */
function FeedTokenItem({ item, onClick }: { item: LiveFeedToken; onClick: () => void }) {
  const isUp = !!item.percent && item.percent.trim().startsWith('+');
  const isDown = !!item.percent && item.percent.trim().startsWith('-');

  const badgeClasses = isUp
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-400/20'
    : isDown
      ? 'bg-rose-500/15 text-rose-400 border-rose-400/20'
      : 'bg-zinc-700/20 text-zinc-300 border-zinc-400/10';

  const caret = isUp ? '▲' : isDown ? '▼' : '';

  return (
    <button
      onClick={onClick}
      className="
        group inline-flex items-center gap-3
        min-w-fit
        rounded-xl
        px-4 py-1.5
        text-white text-sm
        transition-all
      "
    >
      <img
        src={item.image || '/liveTokenFeed/trump.svg'}
        alt={item.name}
        className="w-6 h-6 rounded-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/liveTokenFeed/trump.svg';
        }}
      />

      <span className="font-medium truncate max-w-[8rem] sm:max-w-[12rem]">{item.name}</span>
      <span className="text-zinc-400/90 text-xs whitespace-nowrap">({item.symbol})</span>

      {item.percent && (
        <span
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${badgeClasses}`}
        >
          {caret && <span className="leading-none">{caret}</span>}
          <span className="leading-none">{item.percent}</span>
        </span>
      )}
    </button>
  );
}
