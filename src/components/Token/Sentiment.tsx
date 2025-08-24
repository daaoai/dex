'use client';

import { CoingeckoTokenDetailedInfo } from '@/types/coinGecko';

type SentimentProps = {
  coingeckoTokenDetails: CoingeckoTokenDetailedInfo | null;
};

export const Sentiment = ({ coingeckoTokenDetails }: SentimentProps) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Sentiment</h3>
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10B981"
              strokeWidth="8"
              strokeDasharray={`${(coingeckoTokenDetails?.sentiment || 0) * 2.51} 251.2`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#EF4444"
              strokeWidth="8"
              strokeDasharray={`${100 - (coingeckoTokenDetails?.sentiment || 0)} 251.2`}
              strokeDashoffset={`${(coingeckoTokenDetails?.sentiment || 0) * 2.51}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{coingeckoTokenDetails?.sentiment || 0}</span>
          </div>
        </div>
        <p className="text-gray-400">{coingeckoTokenDetails?.sentimentLabel || 'Neutral'}</p>
      </div>
    </div>
  );
};
