'use client';
import PoolsTable from '@/components/pools/PoolsTable';
import Text from '@/components/ui/Text';
import { exploreContent } from '@/content/explore';
import React from 'react';
import { fetchTopPoolsFromGraph } from '../../services/subgraph/fetchPools';

const ExplorePage = async () => {
  const pools = await fetchTopPoolsFromGraph();
  return (
    <main className="min-h-screen bg-black flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-7xl">
        <Text type="h1" className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
          {exploreContent.title}
        </Text>
        <Text type="p" className="text-gray-400 mb-8 text-center">
          {exploreContent.description}
        </Text>
        <div className="rounded-xl shadow-lg p-6">
          <PoolsTable pools={pools} />
        </div>
      </div>
    </main>
  );
};

export default ExplorePage;
