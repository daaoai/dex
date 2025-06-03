'use client';

import { useState } from 'react';
import SwapModal from './SwapModal';
import { Token } from '@/types/tokens';
import { useSwap } from '@/hooks/useSwap';

export default function Swap() {
  const [srcToken, setSrcToken] = useState<Token>({
    name: '',
    symbol: '',
    logo: undefined,
    address: '0x',
    decimals: 18,
  });

  const [destToken, setDestToken] = useState<Token>({
    name: '',
    symbol: '',
    logo: undefined,
    address: '0x',
    decimals: 18,
  });

  const [srcAmount, setSrcAmount] = useState('');
  const [destAmount, setDestAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [slippage] = useState(1); // 1% slippage by default

  const { swapExactIn } = useSwap({ chainId: 10143 });

  const handleTokenSelect = (token: Token, type: 'src' | 'dest') => {
    if (type === 'src') {
      setSrcToken(token);
    } else {
      setDestToken(token);
    }
  };

  const handleSwap = async () => {
    console.log('swap started');
    try {
      setLoading(true);
      await swapExactIn({
        tokenIn: srcToken,
        tokenOut: destToken,
        amountIn: srcAmount,
        amountOut: destAmount,
        slippage,
      });
    } catch (e) {
      console.log(e);
      console.error('Swap error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-dark-black-10 text-white p-6">
      <SwapModal
        srcTokenDetails={srcToken}
        destTokenDetails={destToken}
        srcTokenAmount={srcAmount}
        destTokenAmount={destAmount}
        handleSrcTokenAmountChange={setSrcAmount}
        isLoading={loading}
        handleSwap={handleSwap}
        onTokenSelect={handleTokenSelect}
      />
    </main>
  );
}
