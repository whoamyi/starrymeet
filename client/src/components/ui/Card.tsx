import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

interface StepCardProps {
  number: number;
  icon: string;
  title: string;
  description: string;
  features?: string[];
}

export const StepCard = ({ number, icon, title, description, features }: StepCardProps) => {
  return (
    <div className="step">
      <div className="step-visual">
        <div className="step-icon">{icon}</div>
      </div>
      <div className="step-content">
        <h2>{number}. {title}</h2>
        <p>{description}</p>
        {features && features.length > 0 && (
          <div className="features">
            {features.map((feature, index) => (
              <span key={index} className="feature-tag">{feature}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
}

export const ValueCard = ({ icon, title, description }: ValueCardProps) => {
  return (
    <div className="value-card">
      <div className="value-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
}

export const BenefitCard = ({ icon, title, description }: BenefitCardProps) => {
  return (
    <div className="benefit-card">
      <div className="benefit-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
