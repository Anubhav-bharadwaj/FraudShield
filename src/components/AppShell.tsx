'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return (
      <main className="min-h-screen w-full bg-[#080D18] text-[#F8FAFC] selection:bg-[#3B82F6]/30 selection:text-white">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#171715]">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen flex flex-col bg-[#171715] text-[#F1EBDD]">
        {children}
      </main>
    </div>
  );
};

