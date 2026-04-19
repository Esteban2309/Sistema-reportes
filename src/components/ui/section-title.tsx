
import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
  return (
    <div className="mb-2">
      <h2 className="text-2xl font-bold text-udc-navy tracking-tight">{title}</h2>
      {subtitle && <p className="text-udc-textMuted text-sm mt-1">{subtitle}</p>}
    </div>
  );
};
