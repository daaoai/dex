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
import clsx from 'clsx';
import { getEllipsisTxt } from '@/utils/getEllipsisText';
import ClickToCopy from '@/utils/copyToClipboard';

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
      <div className="w-full my-12">
        <div className="bg-background-14 rounded-lg w-full max-w-md max-h-[90vh] my-12">
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

                        <div className="flex items-center gap-1">
                          <Text type="p" className={clsx('text-xs text-gray-20')}>
                            {' '}
                            {getEllipsisTxt(token.address)}
                          </Text>

                          <ClickToCopy copyText={token.address} className="cursor-pointer" />
                        </div>
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
