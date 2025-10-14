'use client';

import React, { useState } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import ImageUpload from '@/components/launch/ImageUpload';

interface TokenFormData {
  tokenName: string;
  tickerSymbol: string;
  description: string;
  raisedToken: string;
  raisedAmount: string;
  website: string;
  twitter: string;
  telegram: string;
  tag: string;
  image: File | null;
}

export default function LaunchTokenPage() {
  const [formData, setFormData] = useState<TokenFormData>({
    tokenName: '',
    tickerSymbol: '',
    description: '',
    raisedToken: 'BNB',
    raisedAmount: '18',
    website: '',
    twitter: '',
    telegram: '',
    tag: 'Meme',
    image: null,
  });

  const [isLaunching, setIsLaunching] = useState(false);

  const handleInputChange = (field: keyof TokenFormData, value: string | File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      // TODO: Implement token launch logic
      console.log('Launching token with data:', formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error launching token:', error);
    } finally {
      setIsLaunching(false);
    }
  };

  const raisedAmounts = ['5', '10', '15', '18', '20', '25', '30', '50'];
  const tags = ['Meme', 'DeFi', 'Gaming', 'NFT', 'Utility', 'Community'];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">LAUNCH YOUR TOKEN</h1>
        </div>

        {/* Form */}
        <div className="rounded-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image Upload */}
            <div className="space-y-6">
              <ImageUpload onImageSelect={(file) => handleInputChange('image', file)} selectedImage={formData.image} />
            </div>

            {/* Right Column - Token Details */}
            <div className="space-y-6">
              {/* Token Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Token Name</label>
                <input
                  type="text"
                  value={formData.tokenName}
                  onChange={(e) => handleInputChange('tokenName', e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
                  placeholder="Enter token name"
                />
              </div>

              {/* Ticker Symbol */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Ticker Symbol</label>
                <input
                  type="text"
                  value={formData.tickerSymbol}
                  onChange={(e) => handleInputChange('tickerSymbol', e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
                  placeholder="Enter ticker symbol"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={1}
              className="w-full px-3 py-2 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11 resize-none"
              placeholder="Describe your token..."
            />
          </div>

          {/* Raised Token Section */}
          <div className="mt-6 w-full">
            <label className="block text-sm font-medium text-white mb-2">Raised Token</label>
            <div className="w-full bg-[#0D1117] border border-stroke-3 rounded-md px-3 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">B</span>
                </div>
                <span className="text-white font-medium">BNB</span>
              </div>

              <Select value={formData.raisedAmount} onValueChange={(value) => handleInputChange('raisedAmount', value)}>
                <SelectTrigger className="bg-transparent border-none text-white p-0 h-auto focus:ring-0 flex items-center">
                  <SelectValue placeholder="Raised Amount">Raised Amount: {formData.raisedAmount} BNB</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#0D1117] border border-stroke-3">
                  {raisedAmounts.map((amount) => (
                    <SelectItem key={amount} value={amount} className="text-white hover:bg-background-5">
                      Raised Amount: {amount} BNB
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optional Information */}
          <div className="flex flex-col gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Twitter</label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                className="w-full px-3 py-2 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Telegram</label>
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => handleInputChange('telegram', e.target.value)}
                className="w-full px-3 py-2 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Tag */}
          <div className="mt-6 w-full">
            <label className="block text-sm font-medium text-white mb-2">Tag</label>
            <Select value={formData.tag} onValueChange={(value) => handleInputChange('tag', value)}>
              <SelectTrigger className="w-full bg-[#0D1117] border border-stroke-3 text-white">
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent className="bg-[#0D1117] border border-stroke-3">
                {tags.map((tag) => (
                  <SelectItem key={tag} value={tag} className="text-white hover:bg-background-5">
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Launch Button */}
          <div className="mt-8 text-center w-full">
            <Button
              onClick={handleLaunch}
              disabled={isLaunching || !formData.tokenName || !formData.tickerSymbol}
              className="w-full max-w-full bg-gradient-to-r from-[#7036FF] to-[#AE8DFF] border border-[#7F5FFA] hover:from-[#AE8DFF] hover:to-[#7036FF] text-white font-bold py-6 px-8 rounded-md text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLaunching ? 'LAUNCHING...' : 'LAUNCH'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
