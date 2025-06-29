'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { navLinks } from '@/constants/navbar';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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

          <div className="mt-8">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
