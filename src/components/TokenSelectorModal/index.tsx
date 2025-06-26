'use client';

import { supportedChainIds } from '@/constants/chains';
import { tokensByChainId } from '@/constants/tokens';
import { Token } from '@/types/tokens';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ModalWrapper } from '../ui/ModalWrapper';
import Text from '../ui/Text';
import { Button } from '@/shadcn/components/ui/button';
import DynamicLogo from '../ui/logo/DynamicLogo';
import { tokenSelectorContent } from '@/content/tokenSelector';

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
        const fetchedTokens = Object.values(tokensByChainId[supportedChainIds.bsc]);
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
    <ModalWrapper isOpen={isOpen} onClose={onClose} className="text-white w-full !max-w-md max-h-[90vh]  p-4">
      <div className="w-full">
        <div className="bg-background-14 rounded-lg w-full max-w-md max-h-[90vh]">
          <div className="p-4 flex justify-between items-center">
            <Text type="h2" className="text-xl font-semibold">
              {tokenSelectorContent.selectToken}
            </Text>
            <Button onClick={onClose} className="text-white bg-transparent">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-4">
            <div className="relative mb-4">
              <Text
                type="span"
                className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white"
              >
                /
              </Text>
              <input
                type="text"
                placeholder={tokenSelectorContent.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            {loading ? (
              <Text type="p" className="text-gray-400 text-sm">
                {tokenSelectorContent.loading}
              </Text>
            ) : (
              <div className="space-y-2 mt-3 overflow-y-auto max-h-[65vh]">
                {filteredTokens.map((token) => (
                  <Button
                    key={token.address}
                    className="w-full group bg-transparent rounded-lg p-2 flex  hover:bg-background-13 justify-start items-center gap-3 h-15"
                    onClick={() => onSelect(token)}
                  >
                    <div className="w-8 h-8 rounded-full  flex items-center justify-center">
                      <DynamicLogo
                        logoUrl={token.logo}
                        alt={token.symbol}
                        width={36}
                        height={36}
                        fallbackText={token.symbol}
                      />
                    </div>
                    <div className="text-left">
                      <Text type="p" className="font-medium">
                        {token.name}
                      </Text>
                      <div className="flex items-center gap-2">
                        <Text type="p" className="text-sm text-gray-400">
                          {token.symbol}
                        </Text>
                        <span
                          className="hidden group-hover:inline-block text-xs text-gray-500 break-all ml-2
                                     translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          {token.address}
                        </span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
