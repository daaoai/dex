'use client';

import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Text from '../ui/Text';

const tickerData = [
  { name: 'TRUMP', change: '-4.08%', isNegative: true, rank: '#1' },
  { name: 'Fartcoin', change: '-15.34%', isNegative: true, rank: '#2' },
  { name: 'Verse', change: '-18.74%', isNegative: true, rank: '#3' },
  { name: 'SWIF', change: '-10.28%', isNegative: true, rank: '#4' },
  { name: 'PENG', change: '-23.66%', isNegative: true, rank: '#5' },
  { name: 'Cats', change: '-23.66%', isNegative: true, rank: '#6' },
  { name: 'DOGE', change: '+12.34%', isNegative: false, rank: '#7' },
  { name: 'SHIB', change: '-8.92%', isNegative: true, rank: '#8' },
  { name: 'PEPE', change: '+5.67%', isNegative: false, rank: '#9' },
  { name: 'FLOKI', change: '-3.21%', isNegative: true, rank: '#10' },
];

// Duplicate the data for seamless looping
const duplicatedTickerData = [...tickerData, ...tickerData];

export default function TickerBar() {
  return (
    <div className="bg-background-9 border-b border-gray-700 px-4 py-2 overflow-hidden">
      <div className="flex items-center space-x-6 text-sm">
        {/* Fixed HOT PAIRS section */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <Text type="span" className="text-white font-medium">
            HOT PAIRS
          </Text>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        <Text type="span" className="text-green-400 font-medium flex-shrink-0">
          +96.87%
        </Text>

        {/* Auto-scrolling ticker */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex items-center space-x-8 whitespace-nowrap"
            animate={{
              x: [0, -50 * tickerData.length + '%'],
            }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'loop',
                duration: 30,
                ease: 'linear',
              },
            }}
          >
            {duplicatedTickerData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                <span className="text-gray-400">{item.rank}</span>
                <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                <span className="text-white">{item.name}</span>
                <span className={item.isNegative ? 'text-red-400' : 'text-green-400'}>{item.change}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
