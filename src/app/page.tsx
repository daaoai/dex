'use client';
import React from 'react';
import SwapModal from '../components/swap/SwapModal';

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] bg-black bg-cover bg-center pt-8">
      <SwapModal />
    </main>
  );
};
export default Home;
