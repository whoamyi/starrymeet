import type { ReactNode } from 'react';

interface HeroProps {
  title: ReactNode;
  subtitle?: string;
  className?: string;
}

export const Hero = ({ title, subtitle, className = '' }: HeroProps) => {
  return (
    <section className={`hero ${className}`}>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </section>
  );
};
