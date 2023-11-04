"use client";

import { useRouter } from "next/navigation";
import { useWeb3Modal, useWeb3ModalEvents } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import axios from "axios";

export function WalletComponent() {
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { data } = useWeb3ModalEvents();
  const [userInfoLocalStorageValue, setUserInfoLocalStorageValue] =
    useLocalStorage("userInfo", {});

  useEffect(() => {
    if (
      (address && data.event === "SELECT_WALLET") ||
      (address && isConnected)
    ) {
      (async () => {
        if ((userInfoLocalStorageValue as any).userId) {
          await axios
            .get(
              `http://localhost:3001/user/${
                (userInfoLocalStorageValue as any).userId
              }`
            )
            .then(async (response) => {
              console.log("get user res", response.data);
              let currentUserSettings = userInfoLocalStorageValue;

              const isAlreadyInList = response.data.wallets.filter(
                (wallet: any) => wallet.address === address
              );

              if (isAlreadyInList.length === 0) {
                await axios
                  .post(
                    `http://localhost:3001/user/${
                      (userInfoLocalStorageValue as any).userId
                    }/wallet`,
                    {
                      address,
                      kind: "external",
                    }
                  )
                  .then((response) => {
                    console.log("res wallets", response.data);

                    currentUserSettings = {
                      ...userInfoLocalStorageValue,
                      wallets: response.data,
                    };
                  });
              }

              setUserInfoLocalStorageValue(currentUserSettings);

              router.push("/chats");
            });
        }
      })();
    }
  }, [address, data.event, router]);

  const onUseInAppWalletClick = () => {
    router.push("/chats");
  };

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
            onClick={() => onUseInAppWalletClick()}
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
