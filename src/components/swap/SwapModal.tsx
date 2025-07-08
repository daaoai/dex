'use client';

import SelectTokenCard from '@/components/swap/SelectTokenCard';
import { SettingsModal } from '@/components/swap/SettingsModal';
import TokenSelectionModal from '@/components/TokenSelectorModal';
import { supportedChainIds } from '@/constants/chains';
import { fetchTokenBalance } from '@/helper/token';
import { useDebouncedCallback } from '@/hooks/useDebounce';
import { useSwap } from '@/hooks/useSwap';
import { Button } from '@/shadcn/components/ui/button';
import { Token } from '@/types/tokens';
import { ArrowDown, Bolt } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import Text from '../ui/Text';

interface SwapModalProps {
  initialSrcToken?: Token | null;
  initialDestToken?: Token | null;
}

export default function SwapModal({ initialSrcToken, initialDestToken }: SwapModalProps = {}) {
  const [srcToken, setSrcToken] = useState<Token | null>(initialSrcToken || null);
  const [destToken, setDestToken] = useState<Token | null>(initialDestToken || null);
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

    if (isSource) {
      if (token.address === destToken?.address) {
        setDestToken(null);
        setDestAmount('');
        setDestBalance(0n);
      }
      setSrcBalance(0n);
      setSrcToken(token);
      setSrcAmount('');
    } else {
      if (token.address === srcToken?.address) {
        setSrcToken(null);
        setSrcAmount('');
        setSrcBalance(0n);
      }
      setDestToken(token);
      setDestBalance(0n);
      setDestAmount('');
    }

    setShowSelector(false);
    setSelectType(null);
  };

  const fetchQuote = async () => {
    if (!account || !srcToken || !destToken) return;
    setQuoteLoading(true);
    if (!isNaN(Number(srcAmount)) && Number(srcAmount)) {
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

  const handleSwap = async () => {
    if (!account || !srcToken || !destToken) return;
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

  const handleToggle = () => {
    if (!srcToken && !destToken) return;
    const temp = srcToken;
    setSrcToken(destToken);
    setDestToken(temp);
    setSrcBalance(0n);
    setDestBalance(0n);
    setSrcAmount('0');
    setDestAmount('0');
  };

  // useEffects

  const debouncedFetchQuote = useDebouncedCallback(fetchQuote, 400);
  useEffect(() => {
    debouncedFetchQuote();
  }, [srcAmount, srcToken?.address, destToken?.address]);

  useEffect(() => {
    if (!account || (!srcToken?.address && !destToken?.address)) return;
    const fetchBalances = async () => {
      if (account) {
        const srcBalance = srcToken ? await fetchTokenBalance({ token: srcToken.address, account, chainId }) : 0n;
        setSrcBalance(srcBalance);

        const destBalance = destToken ? await fetchTokenBalance({ token: destToken.address, account, chainId }) : 0n;
        setDestBalance(destBalance);
      }
    };
    fetchBalances();
  }, [srcToken?.address, destToken?.address]);

  const isButtonDisabled =
    loading ||
    !srcToken ||
    !destToken ||
    BigInt(parseUnits(srcAmount || '0', srcToken.decimals)) > BigInt(srcBalance) ||
    BigInt(parseUnits(srcAmount || '0', srcToken.decimals)) <= 0n ||
    BigInt(parseUnits(destAmount || '0', destToken.decimals)) <= 0n;

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
        selectedTokens={[srcToken, destToken]}
      />

      <SelectTokenCard
        title="Selling"
        token={srcToken}
        amount={srcAmount}
        setAmount={(val: string) => setSrcAmount(isNaN(Number(val)) ? '' : val)}
        onTokenClick={() => openSelector('src')}
        balance={srcBalance}
      />

      <div className="flex justify-center -mt-8 -mb-6">
        <button
          onClick={handleToggle}
          className={`bg-background hover:bg-background-2 p-3 rounded-full border-4 transition-all duration-300 hover:border-stroke-6 group ${
            srcToken && !destToken
              ? 'border-stroke-6' // Highlight border when only src is selected
              : !srcToken && destToken
                ? 'border-stroke-6' // Highlight border when only dest is selected
                : 'border-black' // Default border when both or neither are selected
          }`}
          aria-label="Switch tokens"
        >
          <ArrowDown
            className={`w-4 h-4 transition-all duration-300 group-hover:text-stroke-6 font-extrabold ${
              srcToken && !destToken
                ? 'text-stroke-6 rotate-0 group-hover:rotate-180' // Highlight down when only src is selected, rotate on hover
                : !srcToken && destToken
                  ? 'text-stroke-6 rotate-180 group-hover:rotate-0' // Highlight up when only dest is selected, rotate on hover
                  : srcToken && destToken
                    ? 'text-grey rotate-0 group-hover:rotate-180' // Gray down when both are selected, rotate on hover
                    : 'text-grey rotate-0' // Gray down when neither are selected, no rotation on hover
            }`}
          />
        </button>
      </div>

      <SelectTokenCard
        title="Buying"
        token={destToken}
        amount={destAmount}
        setAmount={() => {}}
        isDisabled
        onTokenClick={() => openSelector('dest')}
        balance={destBalance}
        isLoading={quoteLoading}
      />

      <Button
        onClick={handleSwap}
        disabled={isButtonDisabled}
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
        {loading ? 'Processing...' : 'Swap'}
      </Button>
    </div>
  );
}
