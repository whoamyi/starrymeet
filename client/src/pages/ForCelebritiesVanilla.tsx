import { useState } from 'react';
import { HeaderVanilla, FooterVanilla, Section } from '@/components';
import { EarningsCalculator, BenefitsGrid, StepsTimeline } from '@/components/for-celebrities';
import { CTASection } from '@/components/how-it-works';

const benefitsData = [
  {
    icon: '💰',
    title: 'Earn more',
    description: 'Keep 85% of every meeting. Set your own prices. No hidden fees.',
  },
  {
    icon: '🎯',
    title: 'Full control',
    description: 'You approve every meeting. Set your schedule. Choose your locations.',
  },
  {
    icon: '🛡️',
    title: 'Safe & secure',
    description: 'Premium venues. Professional staff. Security handled for you.',
  },
  {
    icon: '⚡',
    title: 'Easy setup',
    description: 'Get verified in 48 hours. Start earning within a week.',
  },
  {
    icon: '📱',
    title: 'Simple tools',
    description: 'Manage everything from your phone. Real-time booking alerts.',
  },
  {
    icon: '🌍',
    title: 'Global reach',
    description: 'Fans book you wherever you travel. No location limits.',
  },
];

const stepsData = [
  {
    number: 1,
    title: 'Apply & verify',
    description: 'Submit your application. We verify your identity and work with your management.',
  },
  {
    number: 2,
    title: 'Set availability',
    description: "Add your schedule, set your rates, choose meeting types you're comfortable with.",
  },
  {
    number: 3,
    title: 'Review requests',
    description: 'Fans apply to meet you. Review their stories and approve the ones you like.',
  },
  {
    number: 4,
    title: 'Meet your fans',
    description: 'Show up at premium venues we arrange. Create genuine connections.',
  },
  {
    number: 5,
    title: 'Get paid fast',
    description: 'Earnings deposited within 7 days. Track everything in your dashboard.',
  },
];

export const ForCelebritiesVanilla = () => {
  const [meetings, setMeetings] = useState(20);
  const [price, setPrice] = useState(2500);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary, #0A0A0A)' }}>
      <HeaderVanilla />

      <section className="hero">
        <h1>
          Turn your time
          <br />
          into income
        </h1>
        <p>Meet your fans face-to-face. Set your schedule. Keep 85% of what you earn.</p>
        <a
          href="mailto:apply@starrymeet.com?subject=Celebrity%20Application"
          className="btn-large"
        >
          Apply to join
        </a>
      </section>

      <div className="container">
        <BenefitsGrid
          benefits={benefitsData}
          title="Why top stars choose us"
          subtitle="The easiest way to monetize your influence"
        />

        <EarningsCalculator
          meetings={meetings}
          setMeetings={setMeetings}
          price={price}
          setPrice={setPrice}
        />

        <StepsTimeline
          steps={stepsData}
          title="How it works"
          subtitle="Get started in five simple steps"
        />

        <Section>
          <CTASection
            title="Ready to start earning?"
            description="Join thousands of celebrities already on StarryMeet"
            buttonText="Apply now"
            buttonLink="mailto:apply@starrymeet.com?subject=Celebrity%20Application"
          />
        </Section>
      </div>

      <FooterVanilla />
    </div>
  );
};
