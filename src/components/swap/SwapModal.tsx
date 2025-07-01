'use client';

import SelectTokenCard from '@/components/swap/SelectTokenCard';
import { SettingsModal } from '@/components/swap/SettingsModal';
import ToggleTokens from '@/components/swap/ToggleTokens';
import TokenSelectionModal from '@/components/TokenSelectorModal';
import { supportedChainIds } from '@/constants/chains';
import { fetchTokenBalance } from '@/helper/token';
import { useSwap } from '@/hooks/useSwap';
import { Button } from '@/shadcn/components/ui/button';
import { Token } from '@/types/tokens';
import { Bolt } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import Text from '../ui/Text';

interface SwapModalProps {
  initialSrcToken?: Token | null;
  initialDestToken?: Token | null;
}

export default function SwapModal({ initialSrcToken, initialDestToken }: SwapModalProps = {}) {
  const [srcToken, setSrcToken] = useState<Token>(
    initialSrcToken || {
      name: '',
      symbol: '',
      logo: undefined,
      address: '0x',
      decimals: 18,
    },
  );

  const [destToken, setDestToken] = useState<Token>(
    initialDestToken || {
      name: '',
      symbol: '',
      logo: undefined,
      address: '0x',
      decimals: 18,
    },
  );

  const [srcAmount, setSrcAmount] = useState('');
  const [destAmount, setDestAmount] = useState('');
  const [srcBalance, setSrcBalance] = useState<bigint>(0n);
  const [destBalance, setDestBalance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [selectType, setSelectType] = useState<'src' | 'dest' | null>(null);
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(5);

  const chainId = supportedChainIds.bsc;
  const { swap, getQuote } = useSwap({ chainId });
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
    setBalance(0n);

    if (account) {
      const balance = await fetchTokenBalance({ token: token.address, account, chainId });
      setBalance(balance);
    }

    setShowSelector(false);
    setSelectType(null);
  };

  const fetchQuote = async () => {
    if (!account) return;
    setQuoteLoading(true);
    if (srcToken.address !== '0x' && destToken.address !== '0x' && srcAmount && !isNaN(Number(srcAmount))) {
      try {
        const quoted = await getQuote({
          tokenIn: srcToken,
          tokenOut: destToken,
          amount: Number(srcAmount),
          deadline: deadline * 60,
          recipient: account,
          slippage,
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
  }, [srcAmount, srcToken, destToken]);

  const handleSwap = async () => {
    if (!account) return;
    try {
      setLoading(true);
      await swap({
        tokenIn: srcToken,
        tokenOut: destToken,
        amountIn: Number(srcAmount),
        recipient: account,
        slippage,
        deadline: deadline * 60,
      });
    } catch (e) {
      console.error('Swap error:', e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!account || (!initialSrcToken && !initialDestToken)) return;
    const fetchBalances = async () => {
      if (account) {
        const srcBalance = initialSrcToken
          ? await fetchTokenBalance({ token: initialSrcToken.address, account, chainId })
          : 0n;
        setSrcBalance(srcBalance);

        const destBalance = initialDestToken
          ? await fetchTokenBalance({ token: initialDestToken.address, account, chainId })
          : 0n;
        setDestBalance(destBalance);
      }
    };
    fetchBalances();
  }, []);

  return (
    <div className="w-full max-w-md mx-auto shadow-2xl">
      <div className=" text-white flex justify-between items-center mb-2 p-2">
        <Text type="h2" className="text-md bg-background-16 px-4 py-2 rounded-3xl">
          Swap
        </Text>
        <SettingsModal
          slippage={slippage}
          setSlippage={setSlippage}
          deadline={deadline}
          setDeadline={setDeadline}
          onSave={(value) => setSlippage(value)}
          trigger={
            <Button variant="ghost" size="icon">
              <Bolt width={20} height={20} className="transition-transform duration-500 group-hover:rotate-[360deg]" />
            </Button>
          }
        />
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
        title="Selling"
        token={srcToken}
        amount={typeof srcAmount === 'string' ? srcAmount : ''}
        setAmount={(val: string) => setSrcAmount(isNaN(Number(val)) ? '' : val)}
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
        title="Buying"
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
        className={`
    w-full 
    bg-background-21
    text-white 
    font-bold 
    text-base 
    leading-none
    px-6 py-6 
    rounded-xl 
    disabled:opacity-50 disabled:cursor-not-allowed 
    transition-all duration-300
    shadow-[0_2px_10px_rgba(98,58,255,0.35)] 
    hover:shadow-[0_4px_16px_rgba(98,58,255,0.45)] 
    active:scale-[0.97] 
    flex items-center justify-center
    border border-stroke-8 -mt-2
  `}
      >
        {loading ? 'Processing...' : 'Continue'}
      </Button>
    </div>
  );
}
