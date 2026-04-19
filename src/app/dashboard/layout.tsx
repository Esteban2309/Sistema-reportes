
"use client"

import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-udc-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-udc-navy border-t-udc-yellow rounded-full animate-spin"></div>
          <p className="text-udc-navy font-bold animate-pulse">Cargando Sistema...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <TopBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-udc-bg overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
