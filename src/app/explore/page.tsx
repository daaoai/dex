import PoolsTable from '@/components/pools/PoolsTable';
import Text from '@/components/ui/Text';
import React from 'react';

const exploreContent = {
  title: 'Explore Pools',
  description: 'Discover and analyze all available liquidity pools. Click on a pool to view more details.',
};

const ExplorePage = () => {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl">
        <Text type="h1" className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
          {exploreContent.title}
        </Text>
        <Text type="p" className="text-gray-400 mb-8 text-center">
          {exploreContent.description}
        </Text>
        <div className="bg-gray-900 rounded-xl shadow-lg p-6">
          <PoolsTable />
        </div>
      </div>
    </main>
  );
};

export default ExplorePage;
