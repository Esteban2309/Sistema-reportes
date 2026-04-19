
import React from 'react';
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  variant?: 'default' | 'blue' | 'red' | 'green' | 'amber';
}

export const StatCard = ({ label, value, subValue, variant = 'default' }: StatCardProps) => {
  const variantStyles = {
    default: "text-udc-textPrimary",
    blue: "text-blue-600",
    red: "text-red-600",
    green: "text-green-600",
    amber: "text-amber-600",
  };

  return (
    <div className="bg-white border border-udc-border rounded-lg p-4 udc-shadow flex flex-col justify-between min-h-[100px]">
      <span className="text-udc-textMuted text-xs font-semibold uppercase tracking-wider">{label}</span>
      <div className="mt-2">
        <span className={cn("text-2xl font-bold font-headline", variantStyles[variant])}>
          {value}
        </span>
        {subValue && (
          <p className="text-[10px] text-udc-textMuted mt-1">{subValue}</p>
        )}
      </div>
    </div>
  );
};
