'use client';

import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import Link from 'next/link';
import truncateEthAddress from 'truncate-eth-address';
import Image from 'next/image';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Listbox } from '@headlessui/react';
import {AiOutlineArrowDown} from 'react-icons/ai';


export function SideNav() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const [userInfoLocalStorageValue] = useLocalStorage('userInfo', {});
  // const [selectedWallet, setSelectedWallet] = useState((userInfoLocalStorageValue as any).wallets[0]);
  const [selectedWalletStorage, setSelectedWalletStorage] = useLocalStorage('selectedWalletStorage', (userInfoLocalStorageValue as any).wallets[0]);
  
  return (
    <div className="flex flex-col gap-8 min-w-[200px]">
      <Image src="/logo.jpg" alt="app logo" width={128} height={128} className='rounded-full mx-auto' />
      <h3 className='text-3xl font-bold'>DEEP TOUCH</h3>

      <div className="">
        <span className=''>Connected wallet</span>
        <Listbox value={selectedWalletStorage} onChange={setSelectedWalletStorage}>
          <Listbox.Button className='text-xs text-gray-400 p-2 border border-gray-800 rounded-md flex justify-between w-full'>
            {truncateEthAddress(selectedWalletStorage.address)}
            <AiOutlineArrowDown size={16} />
          </Listbox.Button>

          <Listbox.Options>
            {(userInfoLocalStorageValue as any)?.wallets?.map((wallet: any, index: any) => (
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
