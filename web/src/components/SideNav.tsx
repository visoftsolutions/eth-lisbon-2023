'use client';

import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import truncateEthAddress from 'truncate-eth-address';
import Image from 'next/image';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Listbox } from '@headlessui/react';
import {AiOutlineArrowDown} from 'react-icons/ai';
import { useWalletContext } from '@/context/wallet';


export function SideNav() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const walletContextCheck = useWalletContext();
  if (walletContextCheck == undefined) {
    throw new Error("Context not in Provider")
  }
  const { walletContext, setWalletContext } = walletContextCheck;
  
  useEffect(() => {
    if (walletContext.wallets && walletContext.wallets.length > 0) {
      setWalletContext({ ...walletContext, selectedWallet: walletContext.wallets[0] });
    }
  }, [walletContext.wallets]);

  return (
    <div className="flex flex-col gap-8 min-w-[200px]">
      <Image src="/logo.jpg" alt="app logo" width={128} height={128} className='rounded-full mx-auto' />
      <h3 className='text-3xl font-bold'>DEEP TOUCH</h3>

      <div className="">
        <span className=''>Connected wallet</span>
        <Listbox value={walletContext.selectedWallet} onChange={(value) => {setWalletContext({selectedWallet: value})}}>
          <Listbox.Button className='text-xs text-gray-400 p-2 border border-gray-800 rounded-md flex justify-between w-full'>
            {truncateEthAddress(walletContext.selectedWallet?.address ?? "")}
            <AiOutlineArrowDown size={16} />
          </Listbox.Button>

          <Listbox.Options>
            {walletContext.wallets?.map((wallet, index) => (
              <Listbox.Option
                key={`${wallet.address}-${index}`}
                value={wallet}
                className='text-xs text-gray-400 p-2 border border-gray-800 rounded-md hover:bg-gray-900 cursor-pointer'
              >
                {truncateEthAddress(wallet.address)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>

      <div className="flex flex-col gap-4">
        <Link className='text-lg' href={'/chats'}>Chats</Link>
        <Link className='text-lg' href={'/keys'}>Keys</Link>
        <Link className='text-lg' href={'/explore'}>Explore</Link>
        <Link className='text-lg' href={'/airdrop'}>Airdrop</Link>
      </div>

    
      {/* {isConnected && <button className='border-yellow-400 border text-yellow-400 font-medium py-2 px-4 rounded-md' onClick={() => open()}>Disconnect wallet</button>} */}
    </div>
  );
}
