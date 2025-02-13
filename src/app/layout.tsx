'use client';

import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import { Inter } from 'next/font/google';
import './styles/globals.css';

// Create a QueryClient instance outside the component
const queryClient = new QueryClient();

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ThirdwebProvider activeChain={ChainId.AvalancheFujiTestnet}>
            <Navbar />
            <main>{children}</main>
          </ThirdwebProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
