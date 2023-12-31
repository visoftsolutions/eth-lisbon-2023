"use client";

import { SideNav } from "@/components/SideNav";

interface Props {
  children: any;
}

export function SectionLayout({ children }: Props) {
  return (
    <main className=" bg-black flex min-h-screen items-center mx-32 gap-64">
      <SideNav />

      <div className="w-[600px] min-h-[80vh] flex flex-col gap-8">{children}</div>
    </main>
  );
}
