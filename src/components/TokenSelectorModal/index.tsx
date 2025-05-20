'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

interface Token {
  symbol: string;
  name: string;
  icon: string;
}

interface TokenSelectionModalProps {
  onClose: () => void;
  onSelect: (token: Token) => void;
}

export default function TokenSelectionModal({ onClose, onSelect }: TokenSelectionModalProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const response = await axios.get('https://monad-api.blockvision.org/testnet/api/tokens', {
          headers: {
            accept: 'application/json',
            'x-api-signature': '193b690fa0de580183b0f0b8102da9ca',
            'x-api-timestamp': timestamp.toString(),
            'x-app-id': 'cc96c21ec5b8946b750063e2906d731a',
            'x-visitor-id': 'cb0322c6-969e-44dc-9fab-f8db16c9c925',
          },
        });

        const fetchedTokens =
          response.data?.data?.map((token: { symbol: string; name: string; icon_url: string }) => ({
            symbol: token.symbol,
            name: token.name,
            icon: token.icon_url || '/placeholder.svg',
          })) || [];

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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-4 flex justify-between items-center border-b border-gray-800">
          <h2 className="text-xl font-semibold">Select Token</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
            {}
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">/</div>
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
                  key={token.symbol}
                  className="w-full bg-transparent hover:bg-gray-800 rounded-lg p-2 flex items-center gap-3"
                  onClick={() => onSelect(token)}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Image src={token.icon} alt={token.symbol} width={20} height={20} />
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
  );
}
