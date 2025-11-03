import { BenefitCard } from '../ui';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface BenefitsGridProps {
  benefits: Benefit[];
  title?: string;
  subtitle?: string;
}

export const BenefitsGrid = ({ benefits, title, subtitle }: BenefitsGridProps) => {
  return (
    <section className="benefits-section">
      {(title || subtitle) && (
        <div className="section-header">
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <BenefitCard key={index} {...benefit} />
        ))}
      </div>
    </section>
  );
};
