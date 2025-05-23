import { Button } from '@/shadcn/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <nav className="space-x-6 text-gray-400">
        {['Trade', 'Explore', 'Pool'].map((tab) => (
          <Button key={tab} className="hover:text-white">
            {tab}
          </Button>
        ))}
        <input
          type="text"
          placeholder="Search Token"
          className="px-3 py-1 rounded border-2 bg-dark-black-50 border-dark-black-100  placeholder-gray-500 focus:outline-none"
        />
      </nav>

      <ConnectButton />
    </header>
  );
}
