import type { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const FormSection = ({ title, subtitle, children }: FormSectionProps) => (
  <div className="space-y-6">
    <div className="border-l-2 border-[rgba(255, 255, 255, 0.8)] pl-4">
      <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
    <div className="space-y-5">
      {children}
    </div>
  </div>
);
