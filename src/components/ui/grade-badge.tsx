
import React from 'react';
import { cn } from "@/lib/utils";

interface GradeBadgeProps {
  estado: "Aprobado" | "Reprobado" | "Aprobado mín.";
}

export const GradeBadge = ({ estado }: GradeBadgeProps) => {
  const styles = {
    "Aprobado": "bg-green-100 text-green-700",
    "Reprobado": "bg-red-100 text-red-700",
    "Aprobado mín.": "bg-amber-100 text-amber-700",
  };

  return (
    <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase", styles[estado])}>
      {estado}
    </span>
  );
};
