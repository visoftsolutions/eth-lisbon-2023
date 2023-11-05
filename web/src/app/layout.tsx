'use client';

import "./globals.css";

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';

import { polygonZkEvmTestnet } from 'wagmi/chains';
import { WagmiConfig } from "wagmi";

const projectId = 'a61fa6ebedad90290dcb5dab3b28afac';

const metadata = {
  name: 'DeepTouch',
  description: '',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [polygonZkEvmTestnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains, 
  connectorImages: {
    coinbaseWallet: 'https://images.mydapp.com/coinbase.png',
    metamask: 'https://images.mydapp.com/metamask.png'
  } 
});

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" title="Deep Touch">
      <body>
      <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
          {children}
        </WagmiConfig>
      </QueryClientProvider>
      </body>
    </html>
  );
}
