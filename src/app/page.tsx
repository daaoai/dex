'use client';
import React from 'react';
import SwapModal from '../components/swap/SwapModal';

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 bg-[url('/your-image.jpg')] bg-cover bg-center">
      <SwapModal />
    </main>
  );
};
export default Home;
