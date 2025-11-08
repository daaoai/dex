'use client';

import React from 'react';
import { Share2, Twitter, Linkedin, MessageCircle } from 'lucide-react';

export default function LaunchDisclaimer() {
  return (
    <div className="mt-12 py-6 text-[#C2C2C2]">
      <div className="max-w-full mx-auto px-16">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img src="/synthari-logo.svg" alt="Synthari" className="h-12 w-40" />
          </div>
          <div className="flex items-center gap-3">
            {[
              { Icon: Share2, href: '#', label: 'Share project' },
              { Icon: Twitter, href: '#', label: 'Visit Twitter' },
              { Icon: Linkedin, href: '#', label: 'Visit LinkedIn' },
              { Icon: MessageCircle, href: '#', label: 'Join community' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#373A3E] flex items-center justify-center text-[#C2C2C2] hover:text-white hover:bg-[#2A2F3A] transition-colors"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <p className="text-base text-[#858991] leading-relaxed">
          Disclaimer: Digital assets are highly speculative and involve significant risk of loss. The value of meme
          coins is extremely volatile, and any one who wishes to trade in any meme coin should be prepared for the
          possibility of losing their entire investment. Synthari makes no representations or warranties regarding the
          success or profitability of any meme coin developed on the platform. Synthari is a public, decentralized, and
          permissionless platform. Participation by any project should not be seen as an endorsement or recommendation
          by Synthari. Users should assess their financial situation, risk tolerance, and do their own research before
          trading in any meme coins on the platform. Synthari will not be held liable for any losses, damages, or issues
          that may arise from trading in any meme coins developed on the platform. More information about (DYOR) can be
          found via Binance Academy and Terms of Use.
        </p>
      </div>
    </div>
  );
}
