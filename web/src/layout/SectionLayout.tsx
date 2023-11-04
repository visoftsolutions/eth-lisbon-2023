'use client';

import { SideNav } from "@/components/SideNav";

interface Props {
  children: any
}

export function SectionLayout({children}: Props) {
  return (
    <main className="flex flex-col min-h-screen h-[100vh] m-32">
      <SideNav />

      <div className="">
        {children}
      </div>
    </main>
  );
}
