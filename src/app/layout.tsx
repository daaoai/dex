// RootLayout.tsx
import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import ProviderWrapper from '@/wagmi/ProviderWrapper';
import Header from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Syntahri.io',
  description: 'syntahri.io',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ToastContainer />
        <ProviderWrapper>
          <Header />
          {children}
        </ProviderWrapper>
      </body>
    </html>
  );
}
