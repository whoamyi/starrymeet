import { Button } from '../ui';

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export const CTASection = ({ title, description, buttonText, buttonLink }: CTASectionProps) => {
  return (
    <section className="cta-section">
      <h2>{title}</h2>
      <p>{description}</p>
      <Button to={buttonLink} variant="primary" size="large" className="btn-large">
        {buttonText}
      </Button>
    </section>
  );
};
