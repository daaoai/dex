'use client';

import { supportedChainIds } from '@/constants/chains';
import { tokensByChainId } from '@/constants/tokens';
import { tokenSelectorContent } from '@/content/tokenSelector';
import { Button } from '@/shadcn/components/ui/button';
import { Token } from '@/types/tokens';
import ClickToCopy from '@/utils/copyToClipboard';
import { getEllipsisTxt } from '@/utils/getEllipsisText';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import DynamicLogo from '../ui/logo/DynamicLogo';
import { ModalWrapper } from '../ui/ModalWrapper';
import Text from '../ui/Text';

interface TokenSelectionModalProps {
  onClose: () => void;
  onSelect: (token: Token) => void;
  isOpen: boolean;
  selectedTokens?: (Token | null)[];
}

export default function TokenSelectionModal({
  onClose,
  onSelect,
  isOpen,
  selectedTokens = [],
}: TokenSelectionModalProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      try {
        const fetchedTokens = Object.values(tokensByChainId[supportedChainIds.base]);
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
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      className="text-white w-full !max-w-md max-h-[75vh] md:max-h-[90vh] p-4"
    >
      <div className="w-full h-[90vh]">
        <div className="bg-background-10 h-[90%] border border-stroke-2 rounded-lg w-full max-w-md my-16">
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
              <input
                type="text"
                placeholder={tokenSelectorContent.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            {loading ? (
              <Text type="p" className="text-gray-400 text-sm">
                {tokenSelectorContent.loading}
              </Text>
            ) : (
              <div className="mt-3 overflow-y-auto overflow-x-hidden h-[380px] sm:h-[500px]">
                <List
                  height={500}
                  itemCount={filteredTokens.length}
                  itemSize={64}
                  width={'100%'}
                  itemData={{ tokens: filteredTokens, onSelect }}
                  className="w-full"
                >
                  {({ index, style, data }: ListChildComponentProps) => {
                    const token = data.tokens[index];
                    const isSelected = selectedTokens.some((selectedToken) => selectedToken?.address === token.address);
                    return (
                      <div style={style} key={token.address}>
                        <Button
                          className={`w-full group rounded-lg p-2 flex justify-start items-center gap-3 h-15 ${
                            isSelected
                              ? 'bg-background-13 opacity-50 cursor-not-allowed'
                              : 'bg-transparent hover:bg-background-13'
                          }`}
                          onClick={() => !isSelected && data.onSelect(token)}
                          disabled={isSelected}
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <DynamicLogo
                              logoUrl={token.logo}
                              alt={token.symbol}
                              width={36}
                              height={36}
                              fallbackText={token.symbol}
                            />
                          </div>
                          <div className="text-left">
                            <Text type="p" className={`font-medium ${isSelected ? 'text-gray-500' : ''}`}>
                              {token.name}
                            </Text>
                            <div className="flex items-center gap-2">
                              <Text type="p" className={`text-sm ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                                {token.symbol}
                              </Text>
                              <div className="flex items-center gap-1">
                                <Text
                                  type="p"
                                  className={clsx('text-xs', isSelected ? 'text-gray-600' : 'text-gray-20')}
                                >
                                  {' '}
                                  {getEllipsisTxt(token.address)}
                                </Text>
                                <ClickToCopy copyText={token.address} className="cursor-pointer" />
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="ml-auto">
                              <Text type="p" className="text-xs text-gray-500">
                                Selected
                              </Text>
                            </div>
                          )}
                        </Button>
                      </div>
                    );
                  }}
                </List>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
