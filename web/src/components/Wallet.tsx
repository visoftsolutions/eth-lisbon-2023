"use client";

import { useRouter } from "next/navigation";
import { useWeb3Modal, useWeb3ModalEvents } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import axios from "axios";
import { Wallet, useWalletContext } from "@/context/wallet";

export function WalletComponent() {
  const router = useRouter();
  // const {web3Auth, setWeb3Auth} = useWeb3AuthContext()
  const walletContextCheck = useWalletContext();
  if (walletContextCheck == undefined) {
    throw new Error("Context not in Provider")
  }
  const { walletContext, setWalletContext } = walletContextCheck;
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { data } = useWeb3ModalEvents();

  useEffect(() => {
    if (
      (walletContext.userId && address && data.event === "SELECT_WALLET") ||
      (walletContext.userId && address && isConnected)
    ) {
      (async () => {
        await axios
          .post(
            `http://localhost:3001/user/${walletContext.userId}/wallet`,
            {
              address,
              kind: "external",
            }
          )
          .then((response) => {
            let wallets: Wallet[] = response.data.map((wallet: any) => {
              return {
                id: wallet.id,
                userId: wallet.userId,
                kind: wallet.kind,
                address: wallet.address,
              }
            });
            let selectedWallet = wallets.find((wallet) => wallet.address == address)
            setWalletContext({ selectedWallet, wallets })
          });
          router.push("/chats");
      })();
    }
  }, [address, data.event, router, walletContext.userId]);

  return (
    <div className="flex gap-4 items-center">
      <div className="bg-gray-900 p-8 rounded-md flex flex-col gap-4 w-[600px]">
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-semibold">Use in-app wallet</h4>
          <p>If you don’t have a wallet, let us create one for you. </p>
        </div>

        <div className="">
          <button
            className="border-yellow-400 border text-yellow-400 font-medium py-2 px-4 rounded-md"
            onClick={() => {router.push("/chats");}}
          >
            Use in-app wallet
          </button>
        </div>
      </div>

      <div className="bg-gray-900 p-8 rounded-md flex flex-col gap-4 w-[600px]">
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-semibold">Connect Wallet</h4>
          <p>If you have a web3 wallet, connect here.</p>
        </div>

        <div className="">
          <button
            className="bg-yellow-400 text-black font-medium py-2 px-4 rounded-md"
            onClick={() => open()}
          >
            Connect external wallet
          </button>
        </div>
      </div>
    </div>
  );
}
