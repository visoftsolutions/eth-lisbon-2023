'use client';

import { useRouter } from 'next/navigation';
import { useWeb3Modal, useWeb3ModalEvents } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

export function WalletComponent() {
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { address, isConnecting, isDisconnected } = useAccount();
  const {data} = useWeb3ModalEvents();

  useEffect(() => {
    if(address && data.event === 'SELECT_WALLET') {
      router.push('/chats');
    }
  }, [address, data.event, router]);

  const onUseInAppWalletClick = () => {
    router.push('/chats');
  };
  
  return (
    <div className="flex gap-4 items-center">
      <button className='bg-yellow-400 text-black font-medium py-2 px-4 rounded-md' onClick={() => onUseInAppWalletClick()}>Use in-app wallet</button>

      <button className='border-yellow-400 border text-white font-medium py-2 px-4 rounded-md' onClick={() => open()}>Connect external wallet</button>
    </div>
  );
}
