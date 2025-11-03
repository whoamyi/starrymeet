interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepsTimelineProps {
  steps: Step[];
  title?: string;
  subtitle?: string;
}

export const StepsTimeline = ({ steps, title, subtitle }: StepsTimelineProps) => {
  return (
    <section className="steps-section">
      {(title || subtitle) && (
        <div className="section-header">
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      <div className="steps-grid">
        {steps.map((step) => (
          <div key={step.number} className="step-card">
            <div className="step-number">{step.number}</div>
            <div className="step-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
