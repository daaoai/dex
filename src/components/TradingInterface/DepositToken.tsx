'use client';

interface DepositTokensProps {
  ethAmount: string;
  usdtAmount: string;
  handleEthAmountChange: (value: string) => void;
  handleUsdtAmountChange: (value: string) => void;
  calculateEthUsdValue: () => string;
  calculateUsdtUsdValue: () => string;
  walletConnected: boolean;
  isLoading: boolean;
  connectWallet: () => void;
  handleDeposit: () => void;
}

export default function DepositTokens({
  ethAmount,
  usdtAmount,
  handleEthAmountChange,
  handleUsdtAmountChange,
  calculateEthUsdValue,
  calculateUsdtUsdValue,
  walletConnected,
  isLoading,
  connectWallet,
  handleDeposit,
}: DepositTokensProps) {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-medium">Deposit tokens</h3>
      <p className="text-sm text-gray-400">Specify the token amounts for your liquidity contribution.</p>

      <div className="bg-zinc-800 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={ethAmount}
            onChange={(e) => handleEthAmountChange(e.target.value)}
            aria-label="ETH Amount"
            className="text-3xl font-bold bg-transparent outline-none w-full"
          />

          <div className="flex items-center">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs">Ξ</span>
            </div>
            <span>ETH</span>
          </div>
        </div>
        <div className="text-sm text-gray-400 mt-2">${calculateEthUsdValue()}</div>
      </div>

      <div className="bg-zinc-800 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={usdtAmount}
            onChange={(e) => handleUsdtAmountChange(e.target.value)}
            aria-label="USDT Amount"
            className="text-3xl font-bold bg-transparent outline-none w-full"
          />

          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs">$</span>
            </div>
            <span>USDT</span>
          </div>
        </div>
        <div className="text-sm text-gray-400 mt-2">${calculateUsdtUsdValue()}</div>
      </div>

      {!walletConnected ? (
        <button
          className={`w-full py-4 rounded-md text-center transition-colors ${
            isLoading ? 'bg-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700'
          }`}
          onClick={connectWallet}
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <button
          className={`w-full py-4 rounded-md text-center transition-colors ${
            isLoading ? 'bg-zinc-700' : 'bg-green-600 hover:bg-green-700'
          }`}
          onClick={handleDeposit}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Deposit Liquidity'}
        </button>
      )}
    </div>
  );
}
