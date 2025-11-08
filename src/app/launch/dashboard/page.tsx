'use client';

import React from 'react';
import LaunchDisclaimer from '@/components/launch/LaunchDisclaimer';

export default function LaunchDashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Launch Dashboard</h1>
          <p className="text-gray-400">Manage your token launches and track their performance</p>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Launches */}
          <div className="bg-[#0D1117] border border-[#20242C] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Launches</h2>
            <div className="space-y-4">
              <div className="text-gray-400 text-center py-8">
                No launches yet.{' '}
                <a href="/launch" className="text-[#7036FF] hover:underline">
                  Create your first token
                </a>
              </div>
            </div>
          </div>

          {/* Launch Statistics */}
          <div className="bg-[#0D1117] border border-[#20242C] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Launch Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Launches</span>
                <span className="text-white font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Tokens</span>
                <span className="text-white font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Volume</span>
                <span className="text-white font-semibold">$0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <a
            href="/launch"
            className="inline-block bg-gradient-to-r from-[#7036FF] to-[#AE8DFF] border border-[#7F5FFA] hover:from-[#AE8DFF] hover:to-[#7036FF] text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300"
          >
            Launch New Token
          </a>
        </div>
        <LaunchDisclaimer />
      </div>
    </div>
  );
}
