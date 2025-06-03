import { useState } from 'react';
import { ArrowDown, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Token } from '@/types/tokens';
import TokenSelectionModal from '@/components/TokenSelectorModal';

interface SwapModalProps {
  srcTokenDetails: Token;
  destTokenDetails: Token;
  srcTokenAmount: string;
  destTokenAmount: string;
  handleSrcTokenAmountChange: (value: string) => void;
  isLoading: boolean;
  handleSwap: () => void;
  onTokenSelect: (token: Token, type: 'src' | 'dest') => void;
}

export default function SwapModal({
  srcTokenDetails,
  destTokenDetails,
  srcTokenAmount,
  destTokenAmount,
  handleSrcTokenAmountChange,
  isLoading,
  handleSwap,
  onTokenSelect,
}: SwapModalProps) {
  const [sellPercentage, setSellPercentage] = useState<number | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const [selectType, setSelectType] = useState<'src' | 'dest' | null>(null);

  const openSelector = (type: 'src' | 'dest') => {
    setSelectType(type);
    setShowSelector(true);
  };

  const handleSelect = (token: Token) => {
    if (selectType) {
      onTokenSelect(token, selectType);
    }
    setShowSelector(false);
  };

  const percentageButtons = [25, 50, 75, 'Max'];

  return (
    <div className="bg-transparent border border-zinc-700 rounded-2xl p-2 w-full max-w-md mx-auto shadow-2xl">
      {showSelector && <TokenSelectionModal onClose={() => setShowSelector(false)} onSelect={handleSelect} />}

      {/* Sell Section */}
      <div className="bg-black border border-zinc-700 rounded-xl p-4 hover:border-zinc-600 transition-colors">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-400 text-sm font-medium">Sell</span>
            <div className="flex gap-2">
              {percentageButtons.map((percentage) => (
                <button
                  key={percentage}
                  onClick={() => setSellPercentage(percentage === 'Max' ? 100 : Number(percentage))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    sellPercentage === percentage || (percentage === 'Max' && sellPercentage === 100)
                      ? 'bg-zinc-700 text-white border border-zinc-600'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300 rounded-[30px]'
                  }`}
                >
                  {percentage}%
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-start mb-3 ">
            <input
              type="text"
              value={srcTokenAmount || '0'}
              onChange={(e) => handleSrcTokenAmountChange(e.target.value)}
              placeholder="0"
              className="text-3xl font-light bg-transparent text-white outline-none placeholder-zinc-500 w-[150px]"
            />
            <button
              onClick={() => openSelector('src')}
              className="flex items-center gap-2 bg-none hover:bg-zinc-600 text-white px-3 py-2 bg-transparent border border-white/30 rounded-[25px] w-fit"
            >
              {srcTokenDetails.logo && (
                <Image
                  src={srcTokenDetails.logo}
                  alt={srcTokenDetails.symbol ? `${srcTokenDetails.symbol} logo` : ''}
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-full"
                />
              )}
              {srcTokenDetails.symbol || 'Select Token'}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 text-sm">$0.00</span>
            <span className="text-zinc-500 text-sm">Balance: 0 {srcTokenDetails.symbol || ''}</span>
          </div>
        </div>
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center -mt-[14px] -mb-[23px]">
        <button className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl border-black border-[4px] transition-all duration-200 hover:border-zinc-600">
          <ArrowDown className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      {/* Buy Section */}

      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 hover:border-zinc-600 transition-colors mb-4">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-400 text-sm font-medium">Buy</span>
          </div>
          <div className="flex justify-between items-start mb-3">
            <input
              type="text"
              value={destTokenAmount || '0'}
              readOnly
              placeholder="0"
              className="text-3xl font-light bg-transparent text-white outline-none  placeholder-zinc-500 w-[150px]"
            />
            <button
              onClick={() => openSelector('dest')}
              className="bg-[#4425FB] hover:bg-blue-700 px-4 py-2.5 text-white font-medium transition-all duration-200 flex items-center gap-2 border border-blue-500 hover:border-blue-400 w-fit rounded-[30px] "
            >
              {destTokenDetails.logo && (
                <Image
                  src={destTokenDetails.logo}
                  alt={destTokenDetails.symbol ? `${destTokenDetails.symbol} logo` : ''}
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-full "
                />
              )}
              {destTokenDetails.symbol || 'Select Token'}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 text-sm">$0.00</span>
            <span className="text-zinc-500 text-sm">Balance: 0</span>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleSwap}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isLoading ? 'Processing...' : 'Continue'}
      </button>
    </div>
  );
}
