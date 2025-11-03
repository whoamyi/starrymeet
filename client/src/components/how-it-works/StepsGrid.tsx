import { StepCard } from '../ui';

interface Step {
  number: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

interface StepsGridProps {
  steps: Step[];
}

export const StepsGrid = ({ steps }: StepsGridProps) => {
  return (
    <div className="steps-grid">
      {steps.map((step) => (
        <StepCard key={step.number} {...step} />
      ))}
    </div>
  );
};
