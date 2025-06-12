'use client';
import TokenSelectionModal from '@/components/TokenSelectorModal';
import CryptoTradingInterface from '@/components/TradingInterface';
import { Token } from '@/types/tokens';
import { ChevronDown, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import ConnectOrActionButton from '@/components/position/LiquidityActionButton';
import Text from '@/components/ui/Text';
import { Button } from '@/shadcn/components/ui/button';

export default function NewPositions() {
  // states
  const [showTokenModal, setShowTokenModal] = useState<{ show: boolean; tokenType: 'token0' | 'token1' }>({
    show: false,
    tokenType: 'token0',
  });
  const [token0, setToken0] = useState<Token | null>(null);
  const [token1, setToken1] = useState<Token | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  // redux
  const { appChainId } = useSelector((state: RootState) => state.common, shallowEqual);

  return (
    <div className="min-h-screen bg-black text-white px-20">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link href="/positions" className="text-gray-400 hover:text-white cursor-pointer">
            Your positions
          </Link>
          <span className="text-gray-600">
            <ChevronDown className="h-4 w-4 rotate-270" />
          </span>
          <Text type="p">New positions</Text>
        </div>

        <div className="flex justify-between items-center mb-8">
          <Text type="h1" className="text-3xl font-bold">
            New Positions
          </Text>
          <div className="flex gap-2">
            <Button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              Reset
            </Button>
            <Button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">v3 position</Button>
            <Button className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr,2fr] gap-8">
          <div className="bg-background-6 rounded-xl p-6 w-full max-w-xs self-start border-2 border-stroke-2">
            <div className="flex items-start gap-4 cursor-pointer" onClick={() => setStep(1)}>
              <div
                className={`w-10 h-10 min-w-[40px] rounded-md flex items-center justify-center font-semibold text-sm ${
                  step === 1 ? 'bg-white text-black' : 'bg-[#2A2A2A] text-gray-400'
                }`}
              >
                1
              </div>
              <div>
                <Text type="p" className="text-sm text-gray-400">
                  Step 1
                </Text>
                <Text type="p" className="text-base font-medium text-white">
                  Select token pair and fees
                </Text>
              </div>
            </div>

            <div className="h-8 border-l border-gray-700 ml-5" />

            <div className="flex items-start gap-4 cursor-pointer" onClick={() => setStep(2)}>
              <div
                className={`w-10 h-10 min-w-[40px] rounded-md flex items-center justify-center font-semibold text-sm ${
                  step === 2 ? 'bg-white text-black' : 'bg-[#2A2A2A] text-gray-400'
                }`}
              >
                2
              </div>
              <div>
                <Text type="p" className="text-sm text-gray-400">
                  Step 2
                </Text>
                <Text type="p" className="text-base font-medium text-gray-500">
                  Select price range and deposit amounts
                </Text>
              </div>
            </div>
          </div>

          {step === 1 ? (
            <>
              <div className="bg-background border-2 border-stroke-2 rounded-lg p-6">
                <Text type="h2" className="text-xl font-semibold mb-4">
                  Select pair
                </Text>
                <Text type="p" className="text-gray-400 mb-6">
                  Choose the tokens you want to provide liquidity for. You can select tokens on all supported networks.
                </Text>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Button
                    className="bg-grey-3 rounded-lg p-4 flex items-center justify-between"
                    onClick={() => setShowTokenModal({ show: true, tokenType: 'token0' })}
                  >
                    {token0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <Image src={token0.logo || '/placeholder.svg'} alt={token0.symbol} width={16} height={16} />
                        </div>
                        <span>{token0.symbol}</span>
                      </div>
                    ) : (
                      <Text type="p">Choose token</Text>
                    )}
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </Button>

                  <button
                    className="bg-white text-black rounded-lg p-4 flex items-center justify-between"
                    onClick={() => setShowTokenModal({ show: true, tokenType: 'token1' })}
                  >
                    {token1 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <Image src={token1.logo || '/placeholder.svg'} alt={token1.symbol} width={16} height={16} />
                        </div>
                        <Text type="p">{token1.symbol}</Text>
                      </div>
                    ) : (
                      <Text type="p">Choose token</Text>
                    )}
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <div className="mb-6">
                  <Button className="text-gray-400 bg-background hover:text-white flex items-center gap-2">
                    Add a Hook{' '}
                    <Text type="p" className="text-gray-600">
                      (Advanced)
                    </Text>
                  </Button>
                </div>

                <div className="mb-6">
                  <Text type="h3" className="text-xl font-semibold mb-2">
                    Fee tier
                  </Text>
                  <Text type="p" className="text-gray-400 mb-4">
                    The amount earned providing liquidity. Choose an amount that suits your risk tolerance and strategy.
                  </Text>

                  <div className="bg-dark-black-300 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <Text type="h4" className="font-semibold mb-1">
                          0.3% fee tier
                        </Text>
                        <Text type="p" className="text-gray-400">
                          The % you will earn in fees
                        </Text>
                      </div>
                      <Button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        More
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <ConnectOrActionButton
                  authenticatedOnClick={() => {
                    setStep(2);
                  }}
                  isDisabled={!token0 || !token1}
                  authenticatedText="Continue"
                />
              </div>{' '}
            </>
          ) : (
            token0 &&
            token1 && <CryptoTradingInterface token0={token0} token1={token1} fee={3000} chainId={appChainId} />
          )}
        </div>
      </div>

      {showTokenModal.show && (
        <TokenSelectionModal
          isOpen={showTokenModal.show}
          onClose={() => setShowTokenModal((prev) => ({ ...prev, show: false }))}
          onSelect={(token) => {
            if (showTokenModal.tokenType === 'token0') {
              setToken0(token);
            } else {
              setToken1(token);
            }
            setShowTokenModal((prev) => ({ ...prev, show: false }));
          }}
        />
      )}
    </div>
  );
}
