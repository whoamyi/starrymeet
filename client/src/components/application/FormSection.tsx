import type { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const FormSection = ({ title, subtitle, children }: FormSectionProps) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-black mb-2">{title}</h2>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
    {children}
  </div>
);
