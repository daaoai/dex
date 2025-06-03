import PoolsTable from '@/components/PoolsTable';
import React from 'react';

const ExplorePage = () => {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">Explore Pools</h1>
        <p className="text-gray-400 mb-8 text-center">
          Discover and analyze all available liquidity pools. Click on a pool to view more details.
        </p>
        <div className="bg-gray-900 rounded-xl shadow-lg p-6">
          <PoolsTable />
        </div>
      </div>
    </main>
  );
};

export default ExplorePage;
