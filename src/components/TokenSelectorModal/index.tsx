'use client';

import { supportedChainIds } from '@/constants/chains';
import { tokensByChainId } from '@/constants/tokens';
import { Token } from '@/types/tokens';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ModalWrapper } from '../ModalWrapper';

interface TokenSelectionModalProps {
  onClose: () => void;
  onSelect: (token: Token) => void;
  isOpen: boolean;
}

export default function TokenSelectionModal({ onClose, onSelect, isOpen }: TokenSelectionModalProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      try {
        const fetchedTokens = Object.values(tokensByChainId[supportedChainIds.monadTestnet]);
        setTokens(fetchedTokens);
        setFilteredTokens(fetchedTokens);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchQuery) {
        setFilteredTokens(tokens);
        return;
      }

      const lowerQuery = searchQuery.toLowerCase();
      setFilteredTokens(
        tokens.filter(
          (token) => token.name.toLowerCase().includes(lowerQuery) || token.symbol.toLowerCase().includes(lowerQuery),
        ),
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, tokens]);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} className="w-full max-w-md max-h-[90vh]  p-4 overflow-auto">
      <div className="w-full">
        <div className="bg-background rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
          <div className="p-4 flex justify-between items-center border-b border-gray-800">
            <h2 className="text-xl font-semibold">Select Token</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
              {}
            </button>
          </div>

          <div className="p-4">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                /
              </div>
              <input
                type="text"
                placeholder="Search Token"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : (
              <div className="space-y-2">
                {filteredTokens.map((token) => (
                  <button
                    key={token.address}
                    className="w-full bg-transparent hover:bg-gray-800 rounded-lg p-2 flex items-center gap-3"
                    onClick={() => onSelect(token)}
                  >
                    <div className="w-8 h-8 rounded-full  flex items-center justify-center">
                      <Image src={token.logo || '/placeholder.svg'} alt={token.symbol} width={20} height={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{token.name}</div>
                      <div className="text-sm text-gray-400">{token.symbol}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
