"use client";

import { SideNav } from "@/components/SideNav";

interface Props {
  children: any;
}

export function SectionLayout({ children }: Props) {
  return (
    <main className="flex min-h-screen items-center mx-32 gap-64">
      <SideNav />

      <div className="w-[600px] flex flex-col gap-8">{children}</div>
    </main>
  );
}
