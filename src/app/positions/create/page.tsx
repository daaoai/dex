'use client';

import { useState } from 'react';
import { ChevronDown, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import TokenSelectionModal from '@/components/TokenSelectorModal';

export default function NewPositions() {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedToken1, setSelectedToken1] = useState({ symbol: 'ETH', name: 'Ethereum', icon: '/ethereum.svg' });
  // const [selectedToken2, setSelectedToken2] = useState(null);

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
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-start gap-4 mb-8">
              <div className="flex flex-col items-center">
                <div className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="w-0.5 h-16 bg-gray-700 my-2"></div>
              </div>
              <div>
                <h3 className="text-gray-400 mb-1">Step 1</h3>
                <p className="font-medium">Select token pair and fees</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="bg-gray-800 text-gray-400 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-gray-400 mb-1">Step 2</h3>
                <p className="font-medium text-gray-400">Select price range and deposit amounts</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Select pair</h2>
            <p className="text-gray-400 mb-6">
              Choose the tokens you want to provide liquidity for. You can select tokens on all supported networks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                onClick={() => setShowTokenModal(true)}
              >
                {selectedToken1 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Image src="/ethereum.svg" alt="ETH" width={16} height={16} />
                    </div>
                    <span>{selectedToken1.symbol}</span>
                  </div>
                ) : (
                  <span>Select token</span>
                )}
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>

              <button
                className="bg-white text-black rounded-lg p-4 flex items-center justify-between"
                onClick={() => setShowTokenModal(true)}
              >
                <span>Choose token</span>
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

              <div className="bg-gray-800 rounded-lg p-4">
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

            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-lg font-medium">
              Connect
            </button>
          </div>
        </div>
      </div>

      {showTokenModal && (
        <TokenSelectionModal
          onClose={() => setShowTokenModal(false)}
          onSelect={(token) => {
            setSelectedToken1(token);
            setShowTokenModal(false);
          }}
        />
      )}
    </div>
  );
}
