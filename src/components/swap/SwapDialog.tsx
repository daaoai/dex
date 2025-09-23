'use client';

import { Token } from '@/types/tokens';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcn/components/ui/dialog';
import SwapContent from './SwapContent';
import { ReactNode, useState } from 'react';

interface SwapDialogProps {
  children: ReactNode;
  initialSrcToken?: Token | null;
  initialDestToken?: Token | null;
  onSwapComplete?: () => void;
}

export default function SwapDialog({ children, initialSrcToken, initialDestToken, onSwapComplete }: SwapDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Custom Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9998,
          }}
          onClick={() => setOpen(false)}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="sm:max-w-md border-none bg-background-8 text-white z-[9999]"
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            maxWidth: '28rem',
            width: '90vw',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-center">Swap Tokens</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <SwapContent
              initialSrcToken={initialSrcToken}
              initialDestToken={initialDestToken}
              onSwapComplete={() => {
                onSwapComplete?.();
                setOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
