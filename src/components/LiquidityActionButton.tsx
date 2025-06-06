import { chainsData } from '@/constants/chains';
import { useSelector, shallowEqual } from 'react-redux';
import { useAccount } from 'wagmi';
import { RootState } from '../../store';
import ConnectWalletButton from './ConnectWalletButton';

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
      className="bg-btn-gradient text-white px-4 py-2 rounded-lg w-full disabled:opacity-50"
      disabled={isDisabled}
      onClick={authenticatedOnClick}
    >
      {authenticatedText}
    </button>
  ) : (
    <ConnectWalletButton
      connectButtonTailwindClasses="bg-btn-gradient text-white px-4 py-2 rounded-lg w-full"
      wrongNetworkButtonTailwindClasses="bg-btn-gradient text-white px-4 py-2 rounded-lg w-full"
      wrongNetworkButtonText={`Switch to ${chainsData[appChainId]?.name}`}
      switchToChainId={appChainId}
    />
  );
};

export default ConnectOrActionButton;
