import { HeaderVanilla, FooterVanilla, Hero } from '@/components';
import { StatsGrid, ValueCard } from '@/components/ui';

const statsData = [
  { number: '2,500+', label: 'Applications reviewed monthly' },
  { number: '147', label: 'Exclusive celebrities' },
  { number: '78%', label: 'Lead to collaboration' },
  { number: '48-72hr', label: 'Review response time' },
];

const valuesData = [
  {
    icon: '⭐',
    title: 'Merit Over Money',
    description: 'Financial capability opens the door, but your story determines selection.',
  },
  {
    icon: '🤝',
    title: 'Celebrity Autonomy',
    description: 'Every celebrity personally reviews or delegates trusted teams to evaluate applications. No automatic bookings.',
  },
  {
    icon: '🎯',
    title: 'Purposeful Connections',
    description: 'We facilitate meetings that create value for both parties—professional opportunities, advocacy alignment, mentorship, or authentic fandom.',
  },
  {
    icon: '🛡️',
    title: 'Transparent Selectivity',
    description: "We're upfront about our process. Not everyone will be selected, and that exclusivity protects the integrity of every meeting.",
  },
];

export const AboutVanilla = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary, #0A0A0A)' }}>
      <HeaderVanilla />

      <Hero
        title="Redefining Celebrity Access Through Selectivity"
        subtitle="Where meaningful connections are earned, not bought"
      />

      <div className="container">
        <div className="section">
          <h2>Our Mission</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)' }}>
            At StarryMeet, we believe meaningful connections can't be bought—they must be earned.
            We represent the world's most exclusive celebrities who demand more than payment; they
            seek alignment, purpose, and genuine connection.
          </p>
          <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', marginTop: '20px' }}>
            Our platform exists to facilitate intentional meetings where both parties benefit.
            We're not a booking marketplace—we're a selective gateway that honors the celebrity's
            time and the applicant's purpose.
          </p>
        </div>

        <StatsGrid stats={statsData} className="stats" />

        <div className="section">
          <h2>Our Principles</h2>
          <div className="values">
            {valuesData.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>

        <div className="section" style={{ marginTop: '60px' }}>
          <h2>Why Selectivity Matters</h2>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '32px',
            marginTop: '24px'
          }}>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)' }}>
              Our celebrities receive hundreds of meeting requests weekly. Without careful curation,
              their time would be consumed by transactional encounters that lack depth or purpose.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', marginTop: '20px' }}>
              By requiring thoughtful applications, we ensure every meeting has potential for:
            </p>
            <ul style={{
              fontSize: '16px',
              lineHeight: '2',
              color: 'rgba(255,255,255,0.8)',
              marginTop: '16px',
              paddingLeft: '24px'
            }}>
              <li>• Professional collaboration</li>
              <li>• Advocacy amplification</li>
              <li>• Mentorship impact</li>
              <li>• Authentic connection</li>
              <li>• Mutual benefit</li>
            </ul>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: 'rgba(255, 255, 255, 0.9)',
              marginTop: '24px',
              fontWeight: 600
            }}>
              When you're selected, you've proven you belong in that room.
            </p>
          </div>
        </div>
      </div>

      <FooterVanilla />
    </div>
  );
};
