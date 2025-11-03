import type { ReactNode } from 'react';

interface StatItemProps {
  number: string | number;
  label: string;
}

export const StatItem = ({ number, label }: StatItemProps) => {
  return (
    <div className="stat">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

interface StatsGridProps {
  stats: StatItemProps[];
  className?: string;
}

export const StatsGrid = ({ stats, className = '' }: StatsGridProps) => {
  return (
    <div className={`stats-grid ${className}`}>
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
};

interface StatsSectionProps {
  title?: string;
  subtitle?: string;
  stats: StatItemProps[];
  className?: string;
}

export const StatsSection = ({ title, subtitle, stats, className = '' }: StatsSectionProps) => {
  return (
    <div className={`stats-section ${className}`}>
      {title && <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>{title}</h2>}
      {subtitle && <p style={{ opacity: 0.7, marginBottom: 0 }}>{subtitle}</p>}
      <StatsGrid stats={stats} />
    </div>
  );
};
