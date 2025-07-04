'use client';
import TokenSelectionModal from '@/components/TokenSelectorModal';
import CreatePositionInterface from '@/components/CreatePosition';
import { Token } from '@/types/tokens';
import { ChevronDown } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import ConnectOrActionButton from '@/components/position/LiquidityActionButton';
import Text from '@/components/ui/Text';
import { Button } from '@/shadcn/components/ui/button';
import { newPositionsContent } from '@/content/positionContent';
import { supportedFeeAndTickSpacing } from '@/constants/fee';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';

interface NewPositionsClientProps {
  initialToken0?: Token | null;
  initialToken1?: Token | null;
  initialFee?: number;
}

export default function NewPositionsClient({
  initialToken0 = null,
  initialToken1 = null,
  initialFee = 3000,
}: NewPositionsClientProps) {
  // states
  const [showTokenModal, setShowTokenModal] = useState<{ show: boolean; tokenType: 'token0' | 'token1' }>({
    show: false,
    tokenType: 'token0',
  });
  const [token0, setToken0] = useState<Token | null>(initialToken0);
  const [token1, setToken1] = useState<Token | null>(initialToken1);
  const [fee, setFee] = useState<number>(initialFee);
  const [step, setStep] = useState<1 | 2>(1);

  // redux
  const { appChainId } = useSelector((state: RootState) => state.common, shallowEqual);

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-[1200px] mx-auto md:px-4 py-6">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link href="/positions" className="text-gray-400 hover:text-white cursor-pointer">
            {newPositionsContent.breadcrumbs.yourPositions}
          </Link>
          <span className="text-gray-600">
            <ChevronDown className="h-4 w-4 rotate-270" />
          </span>
          <Text type="p">{newPositionsContent.breadcrumbs.newPositions}</Text>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <Text type="h1" className="text-3xl font-bold">
            {newPositionsContent.header.title}
          </Text>
          {step === 1 && (
            <div className="flex gap-2">
              <Button
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={() => {
                  setToken0(null);
                  setToken1(null);
                  setFee(3000);
                }}
              >
                {newPositionsContent.header.reset}
              </Button>
              <Button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                {newPositionsContent.header.v3}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.4fr,1.5fr] gap-6 md:gap-8">
          <div className="bg-background-6 rounded-xl p-6 w-full md:max-w-md self-start border-2 border-stroke-2">
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
                  {newPositionsContent.steps[0].label}
                </Text>
                <Text type="p" className="text-base font-medium text-white">
                  {newPositionsContent.steps[0].title}
                </Text>
              </div>
            </div>
            <div className="h-8 border-l border-gray-700 ml-5" />
            <div className="flex items-start gap-4 cursor-pointer" onClick={() => {}}>
              <div
                className={`w-10 h-10 min-w-[40px] rounded-md flex items-center justify-center font-semibold text-sm ${
                  step === 2 ? 'bg-white text-black' : 'bg-[#2A2A2A] text-gray-400'
                }`}
              >
                2
              </div>
              <div>
                <Text type="p" className="text-sm text-gray-400">
                  {newPositionsContent.steps[1].label}
                </Text>
                <Text type="p" className="text-base font-medium text-gray-500">
                  {newPositionsContent.steps[1].title}
                </Text>
              </div>
            </div>
          </div>
          {step === 1 ? (
            <>
              <div className="bg-background-8 border border-stroke-2 rounded-lg p-6">
                <Text type="h2" className="text-xl font-semibold mb-4">
                  {newPositionsContent.selectPair.title}
                </Text>
                <Text type="p" className="text-gray-400 mb-6">
                  {newPositionsContent.selectPair.description}
                </Text>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    className="bg-background-23 rounded-lg p-4 flex items-center justify-between h-full"
                    onClick={() => setShowTokenModal({ show: true, tokenType: 'token0' })}
                  >
                    {token0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full  flex items-center justify-center">
                          <Image src={token0.logo || '/placeholder.svg'} alt={token0.symbol} width={16} height={16} />
                        </div>
                        <span>{token0.symbol}</span>
                      </div>
                    ) : (
                      <Text type="p">{newPositionsContent.selectPair.chooseToken}</Text>
                    )}
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>

                  <button
                    className="bg-background-23 h-full rounded-lg p-4 flex items-center justify-between"
                    onClick={() => setShowTokenModal({ show: true, tokenType: 'token1' })}
                  >
                    {token1 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full  flex items-center justify-center">
                          <Image src={token1.logo || '/placeholder.svg'} alt={token1.symbol} width={16} height={16} />
                        </div>
                        <Text type="p">{token1.symbol}</Text>
                      </div>
                    ) : (
                      <Text type="p">{newPositionsContent.selectPair.chooseToken}</Text>
                    )}
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <div className="mb-6 flex flex-col md:flex-row justify-between items-start">
                  <div className="w-full md:w-[40%]">
                    <Text type="h3" className="text-xl font-semibold mb-2">
                      {newPositionsContent.feeTier.title}
                    </Text>
                    <Text type="p" className="text-gray-400 mb-4 text-xs">
                      {newPositionsContent.feeTier.description}
                    </Text>
                  </div>
                  <div className="w-full md:w-[50%]">
                    <Select value={fee.toString()} onValueChange={(val) => setFee(Number(val))}>
                      <SelectTrigger className="w-full bg-black text-white border border-gray-700 rounded-md">
                        <SelectValue placeholder="Select fee tier" />
                      </SelectTrigger>

                      <SelectContent className="w-full min-w-[230px] md:min-w-[250px] bg-black text-white border border-gray-700 rounded-md">
                        {supportedFeeAndTickSpacing.map((feeOption) => (
                          <SelectItem
                            key={feeOption.fee}
                            value={feeOption.fee.toString()}
                            className="py-3 px-4 w-full cursor-pointer hover:bg-gray-700 rounded-md transition-colors"
                          >
                            <div className="w-full flex flex-row justify-between gap-4 items-center">
                              <Text type="h4" className="font-semibold">
                                {(feeOption.fee / 10000).toFixed(2)}% fee
                              </Text>
                              <Text type="p" className="text-gray-400 text-sm whitespace-nowrap">
                                {feeOption.fee === 500 && 'Best for stable pairs'}
                                {feeOption.fee === 3000 && 'Best for most pairs'}
                                {feeOption.fee === 10000 && 'Best for exotic pairs'}
                              </Text>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            token1 && <CreatePositionInterface token0={token0} token1={token1} fee={fee} chainId={appChainId} />
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
