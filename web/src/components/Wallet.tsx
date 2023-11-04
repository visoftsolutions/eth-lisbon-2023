'use client';

import { useRouter } from 'next/navigation';


export function WalletComponent() {
  const router = useRouter();
  
  return (
    <div className="flex gap-4 items-center">
      <button className='bg-yellow-400 text-black font-medium py-2 px-4 rounded-md' onClick={() => {}}>Create Wallet</button>

      <button className='border-yellow-400 border text-white font-medium py-2 px-4 rounded-md' onClick={() => {}}>Connect Wallet</button>
    </div>
  );
}
