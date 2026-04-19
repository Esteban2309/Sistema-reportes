
"use client"

import React from 'react';
import { LogOut, Bell, User } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  return (
    <nav className="bg-udc-navy text-white h-16 flex items-center justify-between px-6 udc-shadow sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight">
          Sistema de Notas <span className="text-udc-yellow">· UdC</span>
        </h1>
        <div className="hidden md:flex items-center gap-6 ml-10">
          <div className="text-sm font-bold text-udc-yellow border-b-2 border-udc-yellow pb-1 uppercase tracking-wider">
            Módulo de Reportes Académicos
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-udc-yellow rounded-full"></span>
        </button>
        <div className="h-8 w-px bg-white/20 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-full">
            <User size={18} className="text-udc-yellow" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-none">{user?.email?.split('@')[0] || 'Usuario'}</p>
            <p className="text-[10px] text-white/70 uppercase tracking-tighter">Administrador de Reportes</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-sm text-white/80 hover:text-udc-yellow transition-colors ml-4 bg-white/5 px-3 py-1.5 rounded-md border border-white/10" 
            title="Cerrar Sesión"
          >
            <LogOut size={16} />
            <span className="hidden lg:inline">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
