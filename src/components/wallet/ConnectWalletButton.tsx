import { Button } from '@/shadcn/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { useSwitchChain } from 'wagmi';

type ConnectWalletButtonProps = {
  connectButtonTailwindClasses?: string;
  wrongNetworkButtonTailwindClasses?: string;
  wrongNetworkButtonText?: string;
  connectButtonText?: string;
  switchToChainId?: number;
};
const ConnectWalletButton = ({
  connectButtonTailwindClasses,
  wrongNetworkButtonTailwindClasses,
  wrongNetworkButtonText = 'Wrong Network',
  connectButtonText = 'Connect Wallet',
  switchToChainId,
}: ConnectWalletButtonProps) => {
  const { switchChainAsync } = useSwitchChain();
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');
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
                  <button onClick={openConnectModal} type="button" className={connectButtonTailwindClasses}>
                    {connectButtonText}
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={() => {
                      if (switchToChainId) {
                        switchChainAsync({ chainId: switchToChainId });
                      } else {
                        openChainModal();
                      }
                    }}
                    type="button"
                    className={wrongNetworkButtonTailwindClasses}
                  >
                    {wrongNetworkButtonText}
                  </button>
                );
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={openChainModal} style={{ display: 'flex', alignItems: 'center' }} type="button">
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                            width={20}
                            height={20}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  <Button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWalletButton;
