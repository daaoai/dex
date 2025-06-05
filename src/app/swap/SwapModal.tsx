'use client';

import { useState, useEffect } from 'react';
import { ArrowDown, ChevronDown, Settings } from 'lucide-react';
import Image from 'next/image';
import { useAccount, useChainId } from 'wagmi';
import { Token } from '@/types/tokens';
import TokenSelectionModal from '@/components/TokenSelectorModal';
import { Button } from '@/shadcn/components/ui/button';
import { useSwap } from '@/hooks/useSwap';
import { useQuoter } from '@/hooks/useQuoter';
import { fetchTokenBalance } from '@/helper/erc20';
import { formatUnits } from 'viem';
import { SlippageModal } from '@/components/SlippageModal';

const formatBalance = (value: bigint, decimals: number, precision = 4) => {
  return (Number(value) / 10 ** decimals).toFixed(precision);
};

export default function SwapModal() {
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
  const [srcBalance, setSrcBalance] = useState<bigint | null>(null);
  const [destBalance, setDestBalance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [selectType, setSelectType] = useState<'src' | 'dest' | null>(null);
  const [slippage, setSlippage] = useState(5.5);
  const [slippageModalOpen, setSlippageModalOpen] = useState(false);
  const { address: account } = useAccount();
  const chainId = useChainId();
  const { swapExactIn } = useSwap({ chainId });
  const { quoteExactInputSingle } = useQuoter({ chainId });

  const openSelector = (type: 'src' | 'dest') => {
    setSelectType(type);
    setShowSelector(true);
  };

  const handleTokenSelect = async (token: Token) => {
    if (selectType === 'src') {
      setSrcToken(token);
      setSrcBalance(null);
      if (account) {
        const balance = await fetchTokenBalance({ token: token.address, account, chainId });
        setSrcBalance(balance);
      }
    }

    if (selectType === 'dest') {
      setDestToken(token);
      setDestBalance(null);
      if (account) {
        const balance = await fetchTokenBalance({ token: token.address, account, chainId });
        setDestBalance(balance);
      }
    }

    setShowSelector(false);
    setSelectType(null);
  };

  useEffect(() => {
    const fetchQuote = async () => {
      if (srcToken.address !== '0x' && destToken.address !== '0x' && srcAmount && !isNaN(Number(srcAmount))) {
        try {
          const quoted = await quoteExactInputSingle({
            tokenIn: srcToken,
            tokenOut: destToken,
            amount: srcAmount,
            fee: 3000,
          });

          const formatted = formatUnits(quoted, destToken.decimals);
          setDestAmount(formatted);
        } catch (e) {
          console.error('Quote fetch error:', e);
          setDestAmount('');
        }
      } else {
        setDestAmount('');
      }
    };

    fetchQuote();
  }, [srcAmount, srcToken, destToken, quoteExactInputSingle]);

  const handleSwap = async () => {
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
      console.error('Swap error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent border border-zinc-700 rounded-2xl p-2 w-full max-w-md mx-auto shadow-2xl">
      <div className="flex justify-between items-center mb-2 p-2">
        <h2 className="text-xl">Swap</h2>
        <div className="relative inline-block">
          <Button onClick={() => setSlippageModalOpen(true)} variant="ghost" size="icon">
            <Settings width={20} height={20} />
          </Button>

          {slippageModalOpen && (
            <SlippageModal
              className="mt-[100px] ml-[800px]"
              isOpen={slippageModalOpen}
              onClose={() => setSlippageModalOpen(false)}
              onSave={(value) => setSlippage(value)}
              setSlippage={setSlippage}
              slippage={slippage}
            />
          )}
        </div>
      </div>

      {showSelector && (
        <TokenSelectionModal
          onClose={() => {
            setShowSelector(false);
            setSelectType(null);
          }}
          onSelect={handleTokenSelect}
        />
      )}

      {/* SELL Section */}
      <div className="bg-black border border-zinc-700 rounded-xl p-4 hover:border-zinc-600 transition-colors">
        <div className="flex justify-between items-center mb-3">
          <span className="text-zinc-400 text-sm font-medium">Sell</span>
        </div>

        <div className="flex justify-between items-start mb-3">
          <input
            type="text"
            value={srcAmount}
            onChange={(e) => setSrcAmount(e.target.value)}
            placeholder="0"
            className="text-3xl font-light bg-transparent text-white outline-none placeholder-zinc-500 w-36"
          />
          <button
            onClick={() => openSelector('src')}
            className="flex items-center gap-2 hover:bg-zinc-600 text-white px-3 py-2 bg-transparent border border-white/30 rounded-3xl w-fit"
          >
            {srcToken.logo && (
              <Image
                src={srcToken.logo}
                alt={`${srcToken.symbol} logo`}
                width={20}
                height={20}
                className="w-5 h-5 rounded-full"
              />
            )}
            {srcToken.symbol || 'Select Token'}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-zinc-500 text-sm">$0.00</span>
          <span className="text-zinc-500 text-sm">
            {srcBalance !== null ? `Balance: ${formatBalance(srcBalance, srcToken.decimals)} ${srcToken.symbol}` : ''}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center -mt-3.5 -mb-6">
        <button className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl border-black border-4 transition-all duration-200 hover:border-zinc-600">
          <ArrowDown className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      {/* BUY Section */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 hover:border-zinc-600 transition-colors mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-zinc-400 text-sm font-medium">Buy</span>
        </div>

        <div className="flex justify-between items-start mb-3">
          <input
            type="text"
            value={destAmount}
            disabled
            placeholder="0"
            className="text-3xl font-light bg-transparent text-white outline-none placeholder-zinc-500 w-36"
          />
          <button
            onClick={() => openSelector('dest')}
            className="bg-indigo-600 hover:bg-blue-600 px-4 py-2.5 text-white font-medium transition-all duration-200 flex items-center gap-2 w-fit rounded-3xl"
          >
            {destToken.logo && (
              <Image
                src={destToken.logo}
                alt={`${destToken.symbol} logo`}
                width={20}
                height={20}
                className="w-5 h-5 rounded-full"
              />
            )}
            {destToken.symbol || 'Select Token'}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-zinc-500 text-sm">$0.00</span>
          <span className="text-zinc-500 text-sm">
            {destBalance !== null
              ? `Balance: ${formatBalance(destBalance, destToken.decimals)} ${destToken.symbol}`
              : ''}
          </span>
        </div>
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? 'Processing...' : 'Continue'}
      </button>
    </div>
  );
}
