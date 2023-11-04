'use client';

import { SectionLayout } from "@/layout/SectionLayout";
import Image from "next/image";
import Link from "next/link";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Chats() {
  const [userInfoLocalStorageValue, setUserInfoLocalStorageValue] = useLocalStorage('userInfo', {});
  console.log(userInfoLocalStorageValue);

  const data = [
    {
      id: '1',
      logo: '/logo.jpg',
      name: 'Filip Binance',
      value: '$20.00'
    },
    {
      id: '2',
      logo: '/logo.jpg',
      name: 'Filip RedStone',
      value: '$20.00'
    },
    {
      id: '3',
      logo: '/logo.jpg',
      name: 'Filip Coinbase',
      value: '$20.00'
    }
  ];
  
  return (
    <SectionLayout>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 bg-yellow-400 text-black p-3 rounded-md flex-1">
          <span className="text-xs">PORTFOLIO</span>
          <div className="flex justify-between font-semibold">
            <p>$10.00</p>
            <p>1 ETH</p>
          </div>
          
        </div>

        <div className="flex flex-col gap-1 bg-yellow-400 text-black p-3 rounded-md flex-1">
          <span className="text-xs">YOUR KEY VALUE</span>
          <div className="flex justify-between font-semibold">
            <p>$10.00</p>
            <p>1 ETH</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 bg-yellow-400 text-black p-3 rounded-md flex-1">
          <span className="text-xs">YOUR RANK</span>
          <p className="flex gap-2 font-semibold">2137</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="text-lg font-bold">MY CHATS</h4>

        <div className="flex flex-col gap-2">
          {data.map(({id, logo, name, value}, index) => (
            <Link href={`chats/${id}`} key={index} className="flex justify-between py-2 px-2 bg-gray-900 rounded-md items-center">
              <div className="flex gap-2 items-center">
                <Image src={logo} alt="user img" width={64} height={64} className="rounded-full" />
                <p className="text-lg font-medium">{name}</p>
              </div>
          
              <p className="text-lg font-bold">{value}</p>
            </Link>
          ))}
        </div>
        
      </div>
      
      
    </SectionLayout>
  );
}
