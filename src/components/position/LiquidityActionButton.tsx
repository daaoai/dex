import { chainsData } from '@/constants/chains';
import { useSelector, shallowEqual } from 'react-redux';
import { useAccount } from 'wagmi';
import { RootState } from '../../../store';
import ConnectWalletButton from '../wallet/ConnectWalletButton';

interface ConnectOrActionButton {
  isDisabled: boolean;
  authenticatedOnClick: () => void;
  authenticatedText: string;
}

const ConnectOrActionButton = ({ isDisabled, authenticatedOnClick, authenticatedText }: ConnectOrActionButton) => {
  const { address: account, isConnected, chainId: accountChainId } = useAccount();
  const { appChainId } = useSelector((state: RootState) => state.common, shallowEqual);
  return account && isConnected && appChainId === accountChainId ? (
    <button
      className="bg-background-21 text-white px-4 py-2 rounded-lg w-full disabled:opacity-50 border border-stroke-8"
      disabled={isDisabled}
      onClick={authenticatedOnClick}
    >
      {authenticatedText}
    </button>
  ) : (
    <ConnectWalletButton
      connectButtonTailwindClasses="bg-background-21 text-white px-4 py-2 rounded-lg w-full border border-stroke-8"
      wrongNetworkButtonTailwindClasses="bg-background-21 text-white px-4 py-2 rounded-lg w-full border border-stroke-8"
      wrongNetworkButtonText={`Switch to ${chainsData[appChainId]?.name}`}
      switchToChainId={appChainId}
    />
  );
};

export default ConnectOrActionButton;
