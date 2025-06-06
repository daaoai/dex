'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { Token } from '@/types/tokens';
import TokenSelectionModal from '@/components/TokenSelectorModal';
import { Button } from '@/shadcn/components/ui/button';
import { useSwap } from '@/hooks/useSwap';
import { useQuoter } from '@/hooks/useQuoter';
import { fetchTokenBalance } from '@/helper/erc20';
import { formatUnits } from 'viem';
import { SettingsModal } from '@/components/swap/SettingsModal';
import ToggleTokens from '@/components/swap/ToggleTokens';
import SelectTokenCard from '@/components/swap/SelectTokenCard';

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
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [selectType, setSelectType] = useState<'src' | 'dest' | null>(null);
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(5);
  const [slippageModalOpen, setSlippageModalOpen] = useState(false);

  const chainId = useChainId();
  const { swapExactIn } = useSwap({ chainId });
  const { quoteExactInputSingle } = useQuoter({ chainId });
  const { address: account } = useAccount();

  const openSelector = (type: 'src' | 'dest') => {
    setSelectType(type);
    setShowSelector(true);
  };

  const handleTokenSelect = async (token: Token) => {
    const isSource = selectType === 'src';
    const isDest = selectType === 'dest';

    if (!isSource && !isDest) return;

    const setToken = isSource ? setSrcToken : setDestToken;
    const setBalance = isSource ? setSrcBalance : setDestBalance;

    setToken(token);
    setBalance(null);

    if (account) {
      const balance = await fetchTokenBalance({ token: token.address, account, chainId });
      setBalance(balance);
    }

    setShowSelector(false);
    setSelectType(null);
  };

  const fetchQuote = async () => {
    setQuoteLoading(true);
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
        setQuoteLoading(false);
      } catch (e) {
        console.error('Quote fetch error:', e);
        setDestAmount('');
        setQuoteLoading(false);
      }
    } else {
      setDestAmount('');
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        deadline,
      });
    } catch (e) {
      console.error('Swap error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent border border-zinc-700 rounded-3xl p-2 w-full max-w-md mx-auto shadow-2xl">
      <div className=" text-white flex justify-between items-center mb-2 p-2">
        <h2 className="text-xl ">Swap</h2>
        <div className="relative inline-block">
          <Button onClick={() => setSlippageModalOpen(true)} variant="ghost" size="icon">
            <Settings width={20} height={20} />
          </Button>
          <SettingsModal
            className="mt-[100px] ml-[800px]"
            isOpen={slippageModalOpen}
            onClose={() => setSlippageModalOpen(false)}
            onSave={(value) => setSlippage(value)}
            setSlippage={setSlippage}
            slippage={slippage}
            setDeadline={setDeadline}
            deadline={deadline}
          />
        </div>
      </div>

      <TokenSelectionModal
        onClose={() => {
          setShowSelector(false);
          setSelectType(null);
        }}
        onSelect={handleTokenSelect}
        isOpen={showSelector}
      />

      <SelectTokenCard
        title="Sell"
        token={srcToken}
        amount={srcAmount}
        setAmount={setSrcAmount}
        onTokenClick={() => openSelector('src')}
        balance={srcBalance}
        decimals={srcToken.decimals}
      />

      <ToggleTokens
        tokens={{
          src: srcToken,
          dest: destToken,
          setSrc: setSrcToken,
          setDest: setDestToken,
        }}
        amounts={{
          src: srcAmount,
          dest: destAmount,
          setSrc: setSrcAmount,
          setDest: setDestAmount,
        }}
        balances={{
          setSrc: setSrcBalance,
          setDest: setDestBalance,
        }}
      />

      <SelectTokenCard
        title="Buy"
        token={destToken}
        amount={destAmount}
        isDisabled
        onTokenClick={() => openSelector('dest')}
        balance={destBalance}
        decimals={destToken.decimals}
        isLoading={quoteLoading}
      />

      <Button
        onClick={handleSwap}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl  active:scale-[0.98]"
      >
        {loading ? 'Processing...' : 'Continue'}
      </Button>
    </div>
  );
}
