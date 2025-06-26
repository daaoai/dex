'use client';
import React from 'react';
import SwapModal from '../../components/swap/SwapModal';
import { Token } from '@/types/tokens';

interface TradeClientProps {
  initialSrcToken?: Token | null;
  initialDestToken?: Token | null;
}

const TradeClient = ({ initialSrcToken, initialDestToken }: TradeClientProps) => {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-950 bg-[url('/trade-bg.svg')] bg-cover bg-center">
      <SwapModal initialSrcToken={initialSrcToken} initialDestToken={initialDestToken} />
    </main>
  );
};

export default TradeClient;
