'use client';
import React from 'react';
import SwapModal from '../components/swap/SwapModal';
import LiveTokenFeed from '@/components/LiveTokenFeed';
import { supportedChainIds } from '@/constants/chains';

const Home = () => {
  const chainId = supportedChainIds.bsc;

  return (
    <main className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] bg-black bg-cover bg-center">
      <LiveTokenFeed chainId={chainId} />
      <SwapModal />
    </main>
  );
};
export default Home;
