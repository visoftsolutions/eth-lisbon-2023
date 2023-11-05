"use client";

import { useEffect } from "react";
import Link from "next/link";
import truncateEthAddress from "truncate-eth-address";
import Image from "next/image";
import { Listbox } from "@headlessui/react";
import { AiOutlineArrowDown } from "react-icons/ai";
import { useWalletContext } from "@/context/wallet";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function SideNav() {
  const walletContextCheck = useWalletContext();
  if (walletContextCheck == undefined) {
    throw new Error("Context not in Provider");
  }
  const { walletContext, setWalletContext } = walletContextCheck;
  const [selectedWalletLS, setSelectedWalletLS] = useLocalStorage('wallets', {
    selectedWallet: {},
    wallets: []
  })

  console.log('selectedWalletLS', selectedWalletLS);

  useEffect(() => {
    if (walletContext.wallets && walletContext.wallets.length > 0 && selectedWalletLS.wallets && selectedWalletLS.wallets.length > 0) {
      setWalletContext({
        ...walletContext,
        selectedWallet: walletContext.wallets[0],
      });

      setSelectedWalletLS({
        selectedWallet: walletContext.wallets[0],
        wallets: walletContext.wallets
      } as any)
    }
  }, [walletContext.wallets, selectedWalletLS.wallets]);

  return (
    <div className="flex flex-col gap-8 min-w-[200px]">
      <Image
        src="/logo.jpg"
        alt="app logo"
        width={128}
        height={128}
        className="rounded-full mx-auto"
      />
      <h3 className="text-3xl font-bold">DEEP TOUCH</h3>

      <div className="">
        <span className="">Connected wallet</span>
        {selectedWalletLS.wallets.length > 0 && 
        <Listbox
          value={selectedWalletLS.selectedWallet}
          onChange={(value) => {
            setSelectedWalletLS({ selectedWallet: value, wallets: selectedWalletLS.wallets });
          }}
        >
          <Listbox.Button className="text-xs text-gray-400 p-2 border border-gray-800 rounded-md flex justify-between w-full">
            {truncateEthAddress((selectedWalletLS.selectedWallet as any).address ?? "")}
            <AiOutlineArrowDown size={16} />
          </Listbox.Button>

          <Listbox.Options>
            {selectedWalletLS.wallets?.map((wallet: any, index) => (
              <Listbox.Option
                key={`${wallet.address}-${index}`}
                value={wallet}
                className="text-xs text-gray-400 p-2 border border-gray-800 rounded-md hover:bg-gray-900 cursor-pointer"
              >
                {truncateEthAddress(wallet.address)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
        }
        
      </div>

      <div className="flex flex-col gap-4">
        <Link className="text-lg" href={"/chats"}>
          Chats
        </Link>
        <Link className="text-lg" href={"/chats/public"}>
          Public
        </Link>
        <Link className="text-lg" href={"/keys"}>
          Keys
        </Link>
        <Link className="text-lg" href={"/explore"}>
          Explore
        </Link>
        <Link className="text-lg" href={"/airdrop"}>
          Airdrop
        </Link>
      </div>

      {/* {isConnected && <button className='border-yellow-400 border text-yellow-400 font-medium py-2 px-4 rounded-md' onClick={() => open()}>Disconnect wallet</button>} */}
    </div>
  );
}
