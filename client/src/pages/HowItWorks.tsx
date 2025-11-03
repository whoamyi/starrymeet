import { HeaderVanilla, FooterVanilla, Hero, Section, StatsSection } from '@/components';
import { StepsGrid, CTASection } from '@/components/how-it-works';

const stepsData = [
  {
    number: 1,
    icon: '🔍',
    title: 'Find your star',
    description: 'Browse thousands of verified celebrities. Filter by category, price, or location. See their availability, read reviews, and pick your perfect match.',
    features: ['✓ Verified profiles', '10,000+ celebrities', 'Real reviews'],
  },
  {
    number: 2,
    icon: '📅',
    title: 'Book your moment',
    description: "Choose your meeting type—15, 30, or 60 minutes. Pick a date and time. Share what you'd like to talk about. Get approved within 48 hours.",
    features: ['Flexible scheduling', 'Secure payment', 'Quick approval'],
  },
  {
    number: 3,
    icon: '⭐',
    title: 'Create your memory',
    description: 'Meet face-to-face at a premium venue. Ask questions, get advice, take photos. Walk away with memories that last forever.',
    features: ['Premium venues', 'Photos included', 'Unforgettable'],
  },
];

const statsData = [
  { number: '50K+', label: 'Meetings completed' },
  { number: '10K+', label: 'Verified celebrities' },
  { number: '4.9★', label: 'Average rating' },
  { number: '98%', label: 'Would recommend' },
];

export const HowItWorks = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary, #0A0A0A)' }}>
      <HeaderVanilla />

      <Hero
        title={
          <>
            Meet your icons.
            <br />
            Three simple steps.
          </>
        }
        subtitle="From browsing to booking to meeting face-to-face—your dream experience is just moments away"
      />

      <Section>
        <StepsGrid steps={stepsData} />

        <StatsSection
          title="Trusted by fans worldwide"
          subtitle="Join thousands who've already met their heroes"
          stats={statsData}
        />
      </Section>

      <Section>
        <CTASection
          title="Ready to meet your icon?"
          description="Browse thousands of celebrities and book your moment today"
          buttonText="Start browsing"
          buttonLink="/browse"
        />
      </Section>

      <FooterVanilla />
    </div>
  );
};
