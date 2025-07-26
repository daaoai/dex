'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { navLinks } from '@/constants/navbar';
import HeaderSearch from './HeaderSearch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcn/components/ui/dialog';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-black p-4 border-b border-stroke-4 z-50 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image src="/synthari-logo.svg" alt="Logo" width={120} height={120} className="inline-block" />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ name, href }) => (
              <Link
                key={href}
                href={href}
                className={`font-semibold ${
                  pathname === href ? 'text-primary-6' : 'text-gray-400'
                } hover:text-white transition-colors`}
              >
                {name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex ml-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="flex w-48 items-left gap-3 px-2 py-2 rounded-md border border-stroke-2 text-gray-400 hover:text-white hover:border-white transition-colors">
                  <span className="bg-stroke-2 px-2.5 py-1 rounded-md text-sm font-mono text-gray-400">/</span>
                  <span className="text-base font-medium">Search Token</span>
                </button>
              </DialogTrigger>

              <DialogContent
                className="!fixed !z-[9999] !left-1/2 !top-1/2 !translate-x-[-50%] !translate-y-[-50%] !opacity-100 !visible p-0 border-none bg-transparent
             before:content-[''] before:fixed before:inset-0 before:bg-black before:bg-opacity-60 before:z-[-1]"
              >
                <DialogHeader className="sr-only">
                  <DialogTitle>Search</DialogTitle>
                </DialogHeader>
                <HeaderSearch onClose={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <button onClick={() => setMenuOpen(true)} className="md:hidden text-white" aria-label="Open menu">
          <Menu size={24} />
        </button>

        <div className="hidden md:block">
          <ConnectButton />
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm transition-transform duration-300 md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="relative h-full flex flex-col items-start px-6 pt-6">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white absolute top-4 right-4"
            aria-label="Close menu"
          >
            <X size={28} />
          </button>

          <Link href="/" onClick={() => setMenuOpen(false)} className="mb-8">
            <Image src="/synthari-logo.svg" alt="Logo" width={120} height={120} className="inline-block" />
          </Link>

          <nav className="flex flex-col space-y-4">
            {navLinks.map(({ name, href }) => (
              <Link
                key={href}
                href={href}
                className={`text-lg font-semibold ${
                  pathname === href ? 'text-primary-6' : 'text-gray-300'
                } hover:text-white transition-colors`}
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </Link>
            ))}
          </nav>

          {/* Add search modal trigger in mobile */}

          <div className="mt-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
