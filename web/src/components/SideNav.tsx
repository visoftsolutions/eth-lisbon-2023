'use client';

import { useRouter } from 'next/navigation';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import Link from 'next/link';
import truncateEthAddress from 'truncate-eth-address';
import Image from 'next/image';


export function SideNav() {
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  
  return (
    <div className="flex flex-col gap-8 min-w-[200px]">
      <Image src="/logo.jpg" alt="app logo" width={128} height={128} className='rounded-full mx-auto' />
      <h3 className='text-3xl font-bold'>DEEP TOUCH</h3>

      <div className="flex flex-col gap-4">
        <Link className='text-lg' href={'/chats'}>Chats</Link>
        <Link className='text-lg' href={'/keys'}>Keys</Link>
        <Link className='text-lg' href={'/explore'}>Explore</Link>
        <Link className='text-lg' href={'/airdrop'}>Airdrop</Link>
      </div>
      

      {address && <div className="text-xs text-gray-300 flex flex-col gap-1">
        <span className=''>Connected wallet</span>
        <p>{truncateEthAddress(address)}</p>
      </div> }
      {isConnected && <button className='border-yellow-400 border text-yellow-400 font-medium py-2 px-4 rounded-md' onClick={() => open()}>Disconnect wallet</button>}
    </div>
  );
}
