'use client';

import { SectionLayout } from "@/layout/SectionLayout";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";


export default function Profile({ params }: { params: { id: string } }) {
  const [chat, setChat] = useState<'public' | 'private'>('public');

  const content = {
    id: params.id,
    logo: '/sbf.jpg',
    name: 'Sam Bankman-Fried',
    price: {
      usd: '$29.00',
      eth: '1.00 ETH'
    }
  };

  
  return (
    <SectionLayout>
      <div className="flex flex-col gap-2">
        <Image src={content.logo} alt="user image" width={64} height={64} className="rounded-full aspect-square" />
        <h2 className="text-2xl font-semibold">{content.name}</h2>
      </div>

      <div className="flex w-full text-sm">
        <button onClick={() => setChat('public')} className={`${chat === 'public' ? 'bg-yellow-400 text-black' : 'bg-gray-900 text-white'} flex-1 py-1 font-medium`}>PUBLIC CHAT</button>
        <button onClick={() => setChat('private')} className={`${chat === 'private' ? 'bg-yellow-400 text-black' : 'bg-gray-900 text-white'} flex-1 py-1 font-medium`}>PRIVATE CHAT</button>
      </div>
      
      {chat === 'public' && 
      <div className="grid grid-cols-1 gap-4">
        {/* Owner notification */}
        <p className="flex gap-2 items-center bg-gray-900 p-2 px-4 rounded-full mr-auto">True. RedStone will be next unicorn!</p>
        <p className="flex gap-2 items-center bg-gray-900 p-2 px-4 rounded-full mr-auto">True. RedStone will be next unicorn!</p>

        {/* Question from the authorized user */}
        <p className="flex flex-row-reverse gap-2 items-center bg-yellow-400 text-black p-2 px-4 rounded-full ml-auto">True. RedStone will be next unicorn!</p>
      </div>
      }
    </SectionLayout>
  );
}
