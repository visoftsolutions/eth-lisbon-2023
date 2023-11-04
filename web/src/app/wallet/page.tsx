'use client';

import { WalletComponent } from "@/components/Wallet";

export default function Home() {
  // TODO: Add check when the user have wallet, push him to main view
  // If user have wallet connected, push him to main view
  // If user do not have wallet, he has to either create, either connect one

  return (
    <main className="flex flex-col min-h-screen items-center justify-center">
      <WalletComponent />
    </main>
  );
}
