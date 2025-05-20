'use client';
import React from 'react';
import Header from '@/components/Header';
import RewardsSummary from '@/components/RewardSummary';
import PositionsSection from '@/components/PositionSection';
import TopPoolsSidebar from '@/components/TopPoolsSidebar';
import PoolsTable from '@/components/PoolsTable';

export default function Home() {
  return (
    <>
      <main className="flex-1 p-6 space-y-8 bg-dark-black-10 min-h-screen">
        <Header />
        <section className="flex flex-col gap-12">
          <div className="flex w-full gap-8">
            <div className="flex flex-col gap-8 flex-1">
              <RewardsSummary />
              <PositionsSection />
            </div>
            <div className="w-2/5">
              <TopPoolsSidebar />
            </div>
          </div>
          <div className="w-full">
            <PoolsTable />
          </div>
        </section>
      </main>
    </>
  );
}
