"use client";
import Image from "next/image";

interface Props {
  children: any;
}

export function PageLayout({ children }: Props) {
  return (
    <main className="flex flex-col min-h-screen h-[100vh] items-center justify-center p-24">
      <div className="absolute w-full h-full flex items-center justify-center">
        <div className="absolute bg-black opacity-60 z-[2] w-full h-full" />
        <Image
          src="/logo.jpg"
          alt="bg image"
          width={1024}
          height={1024}
          className="absolute m-auto"
        />
      </div>

      <div className="z-[10]">{children}</div>
    </main>
  );
}
