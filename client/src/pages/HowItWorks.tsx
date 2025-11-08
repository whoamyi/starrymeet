import { HeaderVanilla, FooterVanilla, Hero, Section, StatsSection } from '@/components';
import { StepsGrid, CTASection } from '@/components/how-it-works';

const stepsData = [
  {
    number: 1,
    icon: '🔍',
    title: 'Discover',
    description: 'Browse celebrity profiles and available time slots. See their values, interests, and what they look for in applicants. Understand their selection criteria.',
    features: ['✓ 147 exclusive celebrities', 'Selection criteria visible', 'Real availability'],
  },
  {
    number: 2,
    icon: '📝',
    title: 'Apply',
    description: 'Submit your detailed application explaining your background, motivation, and what you bring to the conversation. Be authentic, specific, and thoughtful.',
    features: ['Detailed application form', 'Share your story', 'Demonstrate alignment'],
  },
  {
    number: 3,
    icon: '⭐',
    title: 'Selection',
    description: 'Celebrity teams review applications within 48-72 hours based on merit, alignment, and scheduling fit. Selection is based on purpose, not payment.',
    features: ['48-72hr review', 'Merit-based evaluation', 'Respectful feedback'],
  },
  {
    number: 4,
    icon: '✓',
    title: 'Secure',
    description: 'If approved, complete payment to confirm your earned slot. Receive meeting details, preparation materials, and connect with the celebrity team.',
    features: ['Approved applicants only', 'Secure payment', 'Pre-meeting prep'],
  },
];

const statsData = [
  { number: '2,500+', label: 'Applications reviewed' },
  { number: '147', label: 'Exclusive celebrities' },
  { number: '78%', label: 'Lead to collaboration' },
  { number: '48-72hr', label: 'Response time' },
];

export const HowItWorks = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary, #0A0A0A)' }}>
      <HeaderVanilla />

      <Hero
        title={
          <>
            Earn your access.
            <br />
            Four selective steps.
          </>
        }
        subtitle="From application to confirmed meeting—your opportunity to connect with exclusive celebrities through merit-based selection"
      />

      <Section>
        <StepsGrid steps={stepsData} />

        <div style={{
          maxWidth: '900px',
          margin: '60px auto',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '32px'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Payment Only After Approval
          </h3>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            You won't be charged unless your application is approved. If not selected, you can reapply
            for future dates. When approved, payment confirms your earned opportunity—you're not buying
            access, you're securing a slot you've already earned through merit.
          </p>
        </div>

        <StatsSection
          title="Selective by design"
          subtitle="Join those who've earned meaningful connections"
          stats={statsData}
        />
      </Section>

      <Section>
        <CTASection
          title="Ready to make your case?"
          description="Explore exclusive celebrities and begin your application today"
          buttonText="Begin your application"
          buttonLink="/browse"
        />
      </Section>

      <FooterVanilla />
    </div>
  );
};
