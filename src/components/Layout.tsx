import { ReactNode } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <main className="flex-1 overflow-y-auto pb-20 max-w-lg mx-auto w-full">
        {children}
      </main>
      <Navigation />
    </div>
  );
}
