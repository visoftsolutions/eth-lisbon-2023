'use client';

import { PageLayout } from "@/layout/PageLayout";

export function HomeComponent() {
  const onSubmit = () => {
    console.log('123');
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className='text-4xl font-bold text-white'>HELLO FREN</h1>
      <h2 className='text-3xl font-bold text-white'>WELCOME TO THE MADNESS.</h2>

      <button className='bg-yellow-400 text-black font-medium py-2 px-4 rounded-md' onClick={() => onSubmit()}>Join the game</button>
    </div>
  );
}
