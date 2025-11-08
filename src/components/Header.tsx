'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { navLinks, launchDropdownItems } from '@/constants/navbar';
import HeaderSearch from './HeaderSearch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcn/components/ui/dialog';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [launchDropdownOpen, setLaunchDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLaunchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-black pt-4 pb-1 border-b border-stroke-4 z-50 relative px-6">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/synthari-logo.svg" alt="Logo" width={140} height={60} className="inline-block" />
          </Link>
          <nav className="hidden md:flex items-center gap-16">
            {navLinks.map(({ name, href, hasDropdown }) => {
              const isExternal = href.startsWith('http');

              if (hasDropdown && name === 'Launch') {
                return (
                  <div key={href} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setLaunchDropdownOpen(!launchDropdownOpen)}
                      className={`font-normal flex items-center gap-1 relative ${
                        pathname.startsWith('/launch') ? 'text-[#9F8CFF]' : 'text-[#8F97A6]'
                      } hover:text-white transition-colors cursor-pointer`}
                    >
                      {name}
                      <ChevronDown size={16} />
                      {pathname.startsWith('/launch') && (
                        <div
                          className="absolute -bottom-2 left-[-10px] right-[-10px] h-[4px] bg-primary-6 z-10"
                          style={{ bottom: '-24px' }}
                        ></div>
                      )}
                    </button>

                    {launchDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-[#0D1117] border border-stroke-3 rounded-lg shadow-lg z-50">
                        {launchDropdownItems.map((item, index) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-3 text-sm font-medium ${index !== 0 ? 'border-t border-stroke-3' : ''} ${
                              pathname === item.href
                                ? 'text-primary-6 bg-background-5'
                                : 'text-gray-400 hover:text-white hover:bg-background-5'
                            } transition-colors`}
                            onClick={() => setLaunchDropdownOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={`font-semibold relative ${
                    pathname === href ? 'text-primary-6' : 'text-gray-400'
                  } hover:text-white transition-colors cursor-pointer`}
                >
                  {name}
                  {pathname === href && (
                    <div
                      className="absolute -bottom-2 left-[-10px] right-[-10px] h-[4px] bg-primary-6 z-10"
                      style={{ bottom: '-24px' }}
                    ></div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex ml-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="flex w-52 items-center gap-3 px-3 py-2 rounded-full border border-[#1F2530] bg-black text-gray-400 hover:text-white hover:border-white transition-colors">
                  <span className="bg-[#1F2530] px-2.5 py-1 rounded-full text-sm font-mono text-gray-400">/</span>
                  <span className="text-base font-medium text-white">Search Token</span>
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
          <ConnectButton.Custom>
            {({ account, chain, openChainModal, openConnectModal, openAccountModal, mounted }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="bg-gradient-to-r from-[#4021FC] to-[#926EF5] text-white px-6 py-3 rounded-lg text-base hover:opacity-90 transition-opacity"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    const chainLabel =
                      chain && (chain.name || typeof chain.id === 'number' || typeof chain.id === 'string')
                        ? (chain.name ?? `Chain ${chain.id}`)
                        : 'Chain';

                    return (
                      <div className="flex items-center gap-2">
                        {/* Chain Info */}
                        <button
                          onClick={openChainModal}
                          className="flex items-center gap-2 bg-black border border-[#1F2530] text-white px-2 py-3 rounded-full text-sm hover:border-white transition min-w-[120px] justify-center"
                        >
                          <span
                            className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center"
                            style={{ backgroundColor: chain.iconBackground || '#1f2937' }}
                          >
                            {chain.hasIcon && chain.iconUrl ? (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] font-semibold uppercase text-white">
                                {(chainLabel || '').slice(0, 2)}
                              </span>
                            )}
                          </span>
                          <span className="truncate max-w-[80px]">{chainLabel}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        <button
                          onClick={openAccountModal}
                          className="flex items-center gap-2 bg-black border border-[#1F2530] text-white px-3 py-3 rounded-full text-sm hover:border-white transition"
                        >
                          {account.displayBalance && <span className="text-white">{account.displayBalance}</span>}
                          <span className="text-gray-400">{account.displayName}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
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
            {navLinks.map(({ name, href, hasDropdown }) => {
              const isExternal = href.startsWith('http');

              if (hasDropdown && name === 'Launch') {
                return (
                  <div key={href} className="space-y-2">
                    <button
                      onClick={() => setLaunchDropdownOpen(!launchDropdownOpen)}
                      className={`text-lg font-semibold flex items-center gap-1 ${
                        pathname.startsWith('/launch') ? 'text-primary-6' : 'text-gray-300'
                      } hover:text-white transition-colors`}
                    >
                      {name}
                      <ChevronDown size={16} />
                    </button>

                    {launchDropdownOpen && (
                      <div className="ml-4 space-y-2">
                        {launchDropdownItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block text-sm font-medium ${
                              pathname === item.href ? 'text-primary-6' : 'text-gray-400 hover:text-white'
                            } transition-colors`}
                            onClick={() => {
                              setMenuOpen(false);
                              setLaunchDropdownOpen(false);
                            }}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={`text-lg font-semibold ${
                    pathname === href ? 'text-primary-6' : 'text-gray-300'
                  } hover:text-white transition-colors`}
                  onClick={() => setMenuOpen(false)}
                >
                  {name}
                </Link>
              );
            })}
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
