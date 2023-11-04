'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const inter = Inter({ subsets: ["latin"] });

// const { chains, publicClient } = configureChains([polygon], [publicProvider()]);

// const wagmiConfig = createConfig({
//   autoConnect: true,
//   publicClient,
// });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <WagmiConfig config={wagmiConfig}> */}
        {children}
        {/* </WagmiConfig> */}
      </body>
    </html>
  );
}
