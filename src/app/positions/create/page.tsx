'use client';

import ConnectWalletButton from '@/components/ConnectWalletButton';
import TokenSelectionModal from '@/components/TokenSelectorModal';
import { chainsData } from '@/constants/chains';
import { useAddLiquidity } from '@/hooks/useAddLiquidity';
import useEffectAfterMount from '@/hooks/useEffectAfterMount';
import { Token } from '@/types/tokens';
import { ChevronDown, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import { RootState } from '../../../../store';
import CryptoTradingInterface from '@/components/TradingInterface';

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

  // hooks
  const { address: account, chainId: accountChainId, isConnected } = useAccount();
  const { fetchInitialData, handleAddLiquidity, setSrcTokenFormattedAmount } = useAddLiquidity({ chainId: appChainId });

  // effects
  useEffectAfterMount(() => {
    if (token0 && token1) {
      fetchInitialData({ token0: token0.address, token1: token1.address, fee: 3000 }).then(() => {
        setSrcTokenFormattedAmount('0.0000001');
      });
    }
  }, [token0, token1]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link href="#" className="text-gray-400 hover:text-white">
            Your positions
          </Link>
          <span className="text-gray-600">
            <ChevronDown className="h-4 w-4 rotate-270" />
          </span>
          <p>New positions</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">New Positions</h1>
          <div className="flex gap-2">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <span className="text-gray-400"></span>
              Reset
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">v3 position</button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg">
              <Settings className="h-5 w-5" />
              {}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid md:grid-cols-[1fr,2fr] gap-6">
          {/* Steps */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setStep(1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 1 ? 'bg-white text-black' : 'bg-gray-800 text-gray-400'
              }`}
            >
              1
            </button>
            <div className="w-0.5 h-16 bg-gray-700 my-2" />
            <button
              onClick={() => setStep(2)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 2 ? 'bg-white text-black' : 'bg-gray-800 text-gray-400'
              }`}
            >
              2
            </button>
          </div>

          {step === 1 ? (
            <>
              <div className="bg-dark-black-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Select pair</h2>
                <p className="text-gray-400 mb-6">
                  Choose the tokens you want to provide liquidity for. You can select tokens on all supported networks.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    className="bg-dark-black-300 rounded-lg p-4 flex items-center justify-between"
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
                      <span>Choose token</span>
                    )}
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>

                  <button
                    className="bg-white text-black rounded-lg p-4 flex items-center justify-between"
                    onClick={() => setShowTokenModal({ show: true, tokenType: 'token1' })}
                  >
                    {token1 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <Image src={token1.logo || '/placeholder.svg'} alt={token1.symbol} width={16} height={16} />
                        </div>
                        <span>{token1.symbol}</span>
                      </div>
                    ) : (
                      <span>Choose token</span>
                    )}
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <div className="mb-6">
                  <button className="text-gray-400 hover:text-white flex items-center gap-2">
                    Add a Hook <span className="text-gray-600">(Advanced)</span>
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Fee tier</h3>
                  <p className="text-gray-400 mb-4">
                    The amount earned providing liquidity. Choose an amount that suits your risk tolerance and strategy.
                  </p>

                  <div className="bg-dark-black-300 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold mb-1">0.3% fee tier</h4>
                        <p className="text-gray-400">The % you will earn in fees</p>
                      </div>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        More
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {account && isConnected && appChainId === accountChainId ? (
                  <button
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
                    onClick={handleAddLiquidity}
                  >
                    Create position
                  </button>
                ) : (
                  <ConnectWalletButton
                    connectButtonTailwindClasses="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
                    wrongNetworkButtonTailwindClasses="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
                    wrongNetworkButtonText={`Switch to ${chainsData[appChainId]?.name}`}
                    switchToChainId={appChainId}
                  />
                )}
              </div>{' '}
            </>
          ) : (
            <CryptoTradingInterface />
          )}

          {/* Form */}
        </div>
      </div>

      {showTokenModal.show && (
        <TokenSelectionModal
          onClose={() => {
            setShowTokenModal((prev) => ({ ...prev, show: false }));
          }}
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
