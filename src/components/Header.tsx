'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const navLinks = [
  { name: 'Trade', href: '/trade' },
  { name: 'Explore', href: '/explore' },
  { name: 'Pool', href: '/positions' },
  { name: 'Trenches', href: '/trenches' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between bg-black p-4 border-b border-stroke-4">
      <nav className="flex items-center space-x-6">
        <Link href="/">
          <Image src="/synthari-logo.svg" alt="Logo" width={120} height={120} className="inline-block" />
        </Link>

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

        {/* <input
          type="text"
          placeholder="Search Token"
          className="ml-4 px-3 py-1 rounded border-2 border-stroke-5 bg-black text-white  placeholder-gray-500 focus:outline-none"
        /> */}
      </nav>

      <ConnectButton />
    </header>
  );
}
