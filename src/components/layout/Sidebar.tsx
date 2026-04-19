
"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UserCircle, 
  BookOpen, 
  Users, 
  PieChart, 
  TrendingUp, 
  History, 
  FileDown,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
  { label: 'REPORTES', items: [
    { name: 'Por Alumno', href: '/dashboard/reportes/alumno', icon: UserCircle },
    { name: 'Por Materia', href: '/dashboard/reportes/materia', icon: BookOpen },
    { name: 'Por Docente', href: '/dashboard/reportes/docente', icon: Users },
    { name: 'Promedio Grupal', href: '/dashboard/reportes/grupal', icon: PieChart },
    { name: 'Seguimiento', href: '/dashboard/reportes/seguimiento', icon: TrendingUp },
  ]},
  { label: 'HISTORIAL', items: [
    { name: 'Reportes Guardados', href: '/dashboard/historial', icon: History },
    { name: 'Exportaciones', href: '/dashboard/historial/exportaciones', icon: FileDown },
  ]},
  { label: 'SISTEMA', items: [
    { name: 'Administración', href: '/dashboard/admin', icon: Settings },
  ]}
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] bg-white border-r border-udc-border h-[calc(100vh-6rem)] sticky top-24 overflow-y-auto">
      <div className="py-6 flex flex-col gap-8">
        {MENU_ITEMS.map((section) => (
          <div key={section.label} className="flex flex-col gap-1">
            <span className="px-6 text-[10px] font-bold text-udc-textMuted tracking-[0.2em] mb-2">{section.label}</span>
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all group",
                    isActive 
                      ? "bg-[#eef0fb] text-udc-navy border-l-4 border-udc-navy" 
                      : "text-udc-textMuted hover:bg-gray-50 hover:text-udc-navy border-l-4 border-transparent"
                  )}
                >
                  <Icon size={18} className={cn(isActive ? "text-udc-navy" : "text-udc-textMuted group-hover:text-udc-navy")} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};
