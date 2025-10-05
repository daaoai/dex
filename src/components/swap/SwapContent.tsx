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
import { ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import BalancePercentageButtons from '../ui/BalancePercentageButtons';

interface SwapContentProps {
  initialSrcToken?: Token | null;
  initialDestToken?: Token | null;
  onSwapComplete?: () => void;
}

export default function SwapContent({ initialSrcToken, initialDestToken, onSwapComplete }: SwapContentProps) {
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

  const chainId = supportedChainIds.base;
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
          amount: srcAmount,
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
        amountIn: srcAmount,
        recipient: account,
        slippage,
        deadline: deadline * 60,
      });
      onSwapComplete?.();
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

  // Update tokens when initial props change
  useEffect(() => {
    if (initialSrcToken && initialSrcToken.address !== srcToken?.address) {
      setSrcToken(initialSrcToken);
      setSrcAmount('');
      setSrcBalance(0n);
    }
  }, [initialSrcToken]);

  useEffect(() => {
    if (initialDestToken && initialDestToken.address !== destToken?.address) {
      setDestToken(initialDestToken);
      setDestAmount('');
      setDestBalance(0n);
    }
  }, [initialDestToken]);

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
    <>
      <div className="text-white flex justify-between items-center mb-2">
        {/* <div className="relative flex justify-start w-full max-w-sm py-4"> */}
        <p className="text-2xl font-extrabold py-2 text-[#DAE4E3]">Swap</p>
        {/* </div> */}
        <SettingsModal
          slippage={slippage}
          setSlippage={setSlippage}
          deadline={deadline}
          setDeadline={setDeadline}
          onSave={(value) => setSlippage(value)}
          trigger={
            <Button variant="ghost" size="icon">
              <Image
                src="/settings.svg"
                width={20}
                height={20}
                alt="settings image"
                className="transition-transform duration-500 group-hover:rotate-[360deg]"
              />
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
      <div className="bg-[#07090C] p-6 rounded-2xl border-[#1F2530] border-2">
        <SelectTokenCard
          title="Selling"
          token={srcToken}
          amount={srcAmount}
          setAmount={(val: string) => setSrcAmount(isNaN(Number(val)) ? '' : val)}
          onTokenClick={() => openSelector('src')}
          balance={srcBalance}
        />
        <div className="flex justify-center -mt-7 -mb-5">
          <button
            onClick={handleToggle}
            className={`bg-background hover:bg-background-2 p-3 rounded-full border-4 transition-all duration-300 hover:border-stroke-6 group ${
              srcToken || destToken ? 'border-stroke-6' : 'border-black'
            }`}
            aria-label="Switch tokens"
          >
            <ArrowDown
              className={`w-4 h-4 transition-all duration-300 group-hover:text-stroke-6 font-extrabold ${
                srcToken && !destToken
                  ? 'text-stroke-6 rotate-0 group-hover:rotate-180'
                  : !srcToken && destToken
                    ? 'text-stroke-6 rotate-180 group-hover:rotate-0'
                    : srcToken && destToken
                      ? 'text-grey rotate-0 group-hover:rotate-180'
                      : 'text-grey rotate-0'
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
        <BalancePercentageButtons
          balance={srcBalance || 0n}
          decimals={srcToken?.decimals || 18}
          setAmount={(val: string) => setSrcAmount(isNaN(Number(val)) ? '' : val)}
          disabled={!srcToken || !srcBalance || srcBalance === 0n}
        />
        <div className="flex items-center justify-between py-6 border-b border-[#3F3F47]">
          <p className="text-[#FFF7DF] font-normal text-base">Protocol</p>
          <p className="text-[#8F97A6] font-normal text-base">Synthari Protocol</p>
        </div>
        <div className="flex items-center justify-between py-6 border-b border-[#3F3F47]">
          <p className="text-[#FFF7DF] font-normal text-base">App</p>
          <p className="text-[#8F97A6] font-normal text-base">Synthari</p>
        </div>
        <div className="flex items-center justify-between py-6">
          <p className="text-[#FFF7DF] font-normal text-base">Transaction Fee</p>
          <p className="text-[#8F97A6] font-normal text-base">NA</p>
        </div>
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
          rounded-md
          disabled:opacity-50 disabled:cursor-not-allowed 
          duration-300
          shadow-[0_2px_10px_rgba(98,58,255,0.35)] 
          hover:shadow-[0_4px_16px_rgba(98,58,255,0.45)] 
          active:scale-[0.97] 
          flex items-center justify-center
          border border-stroke-8 -mt-2
          bg-gradient-to-r from-[#4021FC] to-[#926EF5] hover:opacity-90 transition-opacity
        `}
        >
          {loading ? 'Processing...' : 'Swap'}
        </Button>
      </div>
    </>
  );
}
