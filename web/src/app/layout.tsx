'use client';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';

import { arbitrum, mainnet } from 'wagmi/chains';
import { WagmiConfig } from "wagmi";

const projectId = 'a61fa6ebedad90290dcb5dab3b28afac';

const metadata = {
  name: 'DeepTouch',
  description: '',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, arbitrum];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={wagmiConfig}>
          {children}
        </WagmiConfig>
      </body>
    </html>
  );
}
