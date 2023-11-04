'use client';

import { useRouter } from 'next/navigation';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import Link from 'next/link';

export function SideNav() {
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  
  return (
    <div className="flex flex-col gap-8 w-[200px]">
      <h3 className='text-3xl font-bold'>DEEP TOUCH</h3>

      <div className="flex flex-col gap-4">
        <Link className='text-lg' href={'/chats'}>Chats</Link>
        <Link className='text-lg' href={'/keys'}>Keys</Link>
        <Link className='text-lg' href={'/explore'}>Explore</Link>
        <Link className='text-lg' href={'/airdrop'}>Airdrop</Link>
      </div>
      

      <button className='border-yellow-400 border text-yellow-200 font-medium py-2 px-4 rounded-md' onClick={() => open()}>Logout</button>
    </div>
  );
}
