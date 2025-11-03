import type { ReactNode } from 'react';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const Section = ({ title, subtitle, children, className = '' }: SectionProps) => {
  return (
    <div className={`container ${className}`}>
      {(title || subtitle) && (
        <div className="section-header">
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
