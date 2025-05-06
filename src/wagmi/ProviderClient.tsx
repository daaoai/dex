'use client';
import { supportedChainIds } from '@/constants/chains';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
// import 'react-toastify/dist/ReactToastify.css';
import { cookieToInitialState, WagmiProvider } from 'wagmi';
import { getWagmiConfig } from '.';
import { initializeStore } from '../../store';

interface ProviderClientProps {
  wagmiCookie: string | null;
  children: ReactNode;
}

const ProviderClient = ({ wagmiCookie, children }: ProviderClientProps) => {
  const wagmiConfig = useMemo(() => getWagmiConfig(), []);
  const initialWagmiState = useMemo(() => cookieToInitialState(wagmiConfig, wagmiCookie), [wagmiConfig, wagmiCookie]);
  const queryClient = useMemo(() => new QueryClient(), []); // Fix: Move to useMemo

  return (
    <ReduxProvider store={initializeStore()}>
      <WagmiProvider config={wagmiConfig} initialState={initialWagmiState}>
        {/* <SessionProvider session={pageProps.session}> */}
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider initialChain={Object.values(supportedChainIds)[0]} theme={darkTheme()}>
            {/* <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false} // Changed to false to prevent initial flicker
              forcedTheme="dark" // Force dark theme
              disableTransitionOnChange
            > */}
            {/* <Layout font={'fontChoice'}> */}
            {children}
            {/* <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" // or "light"
              /> */}
            {/* </Layout> */}
            {/* </ThemeProvider> */}
          </RainbowKitProvider>
        </QueryClientProvider>
        {/* </SessionProvider> */}
      </WagmiProvider>
    </ReduxProvider>
  );
};

export default ProviderClient;
