'use client';

import { HomeComponent } from "@/components/Home";
import { WalletContextProvider } from "@/context/wallet";
import { Web3AuthProvider } from "@/context/web3auth";
import Image from "next/image";

export default function Home() {
  return (
    <Web3AuthProvider>
      <WalletContextProvider>
        <main className="flex flex-col min-h-screen items-center justify-center">
          <div className="absolute w-full h-full flex items-center justify-center">
            <div className="absolute bg-black opacity-60 z-[2] w-full h-full" />
            <Image src="/logo.jpg" alt="bg image" width={1024} height={1024} className="absolute m-auto" />
          </div>

          <HomeComponent />
        </main>
      </WalletContextProvider>
    </Web3AuthProvider>
  );
}
