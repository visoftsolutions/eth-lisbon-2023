'use client';

interface Props {
  children: any
}

export function PageLayout({children}: Props) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {children}
    </main>
  );
}
