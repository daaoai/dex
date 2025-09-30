'use client';

import { Token } from '@/types/tokens';
import SwapContent from './SwapContent';

interface SwapModalProps {
  initialSrcToken?: Token | null;
  initialDestToken?: Token | null;
}

export default function SwapModal({ initialSrcToken, initialDestToken }: SwapModalProps = {}) {
  return (
    <div className="w-full max-w-lg mx-auto shadow-2xl pt-12">
      <SwapContent initialSrcToken={initialSrcToken} initialDestToken={initialDestToken} />
    </div>
  );
}
