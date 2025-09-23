'use client';
import React from 'react';
import SwapModal from '../components/swap/SwapModal';
import LiveTokenFeed from '@/components/LiveTokenFeed';
import { supportedChainIds } from '@/constants/chains';

const Home = () => {
  const chainId = supportedChainIds.bsc;

  return (
    <main
      className="flex flex-col items-center justify-start h-[200vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/homeBg.png)' }}
    >
      <LiveTokenFeed chainId={chainId} />
      <SwapModal />
    </main>
  );
};
export default Home;
