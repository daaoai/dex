'use client';

import { CoingeckoTokenDetailedInfo } from '@/types/coinGecko';
import { Token } from '@/types/tokens';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { getEllipsisTxt } from '@/utils/getEllipsisText';
import { Copy, Globe, MessageSquare, Send, X } from 'lucide-react';
import Link from 'next/link';

type TokenOverviewProps = {
  token: Token;
  coingeckoTokenDetails: CoingeckoTokenDetailedInfo | null;
};

export const TokenOverview = ({ token, coingeckoTokenDetails }: TokenOverviewProps) => {
  return (
    <div className="rounded-xl">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center">
          {token.logo || coingeckoTokenDetails?.image ? (
            <img
              src={token.logo || coingeckoTokenDetails?.image || ''}
              alt={token.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold">$</span>
          )}
        </div>
        <div>
          <div className="flex flex-col items-start gap-4 mb-2">
            <h1 className="text-2xl font-bold">{token.name}</h1>
            <div className="flex items-center gap-4">
              <span className="bg-[#9066FB] text-white px-2 py-1 rounded text-xs">Official</span>
              <span className="bg-[#9066FB] text-white px-2 py-1 rounded text-xs">Trending</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <span className="text-sm text-[#FAE170]">{getEllipsisTxt(token.address)}</span>
            <button onClick={() => copyToClipboard(token.address)} className="hover:text-white transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        {coingeckoTokenDetails?.description ||
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
      </p>

      <div className="flex items-center space-x-4">
        {coingeckoTokenDetails?.website && (
          <Link
            href={coingeckoTokenDetails.website}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe className="w-5 h-5" />
          </Link>
        )}
        {coingeckoTokenDetails?.twitter && (
          <Link
            href={coingeckoTokenDetails.twitter}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <X className="w-5 h-5" />
          </Link>
        )}
        {coingeckoTokenDetails?.telegram && (
          <Link
            href={coingeckoTokenDetails.telegram}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Send className="w-5 h-5" />
          </Link>
        )}
        {coingeckoTokenDetails?.reddit && (
          <Link
            href={coingeckoTokenDetails.reddit}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
};
