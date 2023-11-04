'use client';

import { useRouter } from 'next/navigation';
import { useWeb3Modal, useWeb3ModalEvents } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import axios from 'axios';

export function WalletComponent() {
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const {data} = useWeb3ModalEvents();
  const [userInfoLocalStorageValue, setUserInfoLocalStorageValue] = useLocalStorage('userInfo', {});

  useEffect(() => {
    if((address && data.event === 'SELECT_WALLET') || (address && isConnected)) {
      ; (async () => {
        if((userInfoLocalStorageValue as any).userId) {
          await axios.get(`http://localhost:3001/user/${(userInfoLocalStorageValue as any).userId}`).then(async response => {
            console.log('get user res', response.data);
            let currentUserSettings = userInfoLocalStorageValue;
  
            const isAlreadyInList = response.data.wallets.filter((wallet: any) => wallet.address === address);
  
            if(isAlreadyInList.length === 0) {
              await axios.post(`http://localhost:3001/user/${(userInfoLocalStorageValue as any).userId}/wallet`, {
                address,
                kind: 'external'
              }).then(response => {
                console.log('res wallets', response.data);
  
                currentUserSettings = {
                  ...userInfoLocalStorageValue,
                  wallets: response.data
                };
              });
            }
            
            setUserInfoLocalStorageValue(currentUserSettings);
            
            router.push('/chats');
          });
        }
      })();
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
