import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <nav className="space-x-6 text-gray-400">
        {['Trade', 'Explore', 'Pool'].map((tab) => (
          <button key={tab} className="hover:text-white">
            {tab}
          </button>
        ))}
      </nav>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search Token"
          className="px-3 py-1 rounded bg-gray-800 placeholder-gray-500 focus:outline-none"
        />
        <ConnectButton />
      </div>
    </header>
  );
}
