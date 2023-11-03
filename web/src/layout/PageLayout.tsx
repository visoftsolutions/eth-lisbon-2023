'use client';

interface Props {
  children: any
}

export function PageLayout({children}: Props) {
  return (
    <main className="flex flex-col min-h-screen h-[100vh] items-center justify-center p-24">
      {children}
    </main>
  );
}
