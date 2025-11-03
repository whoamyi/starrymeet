import { HeaderVanilla, FooterVanilla, Hero } from '@/components';
import { StatsGrid, ValueCard } from '@/components/ui';

const statsData = [
  { number: '50K+', label: 'Meetings created' },
  { number: '10K+', label: 'Verified celebrities' },
  { number: '98%', label: 'Satisfaction rate' },
  { number: '2020', label: 'Founded' },
];

const valuesData = [
  {
    icon: '🤝',
    title: 'Authenticity',
    description: 'Every celebrity is verified. Every meeting is real. No fakes, no scams.',
  },
  {
    icon: '⭐',
    title: 'Quality',
    description: "Premium venues. Professional staff. Experiences you'll treasure forever.",
  },
  {
    icon: '🛡️',
    title: 'Trust',
    description: 'Secure payments. Clear policies. Your satisfaction guaranteed.',
  },
];

export const AboutVanilla = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary, #0A0A0A)' }}>
      <HeaderVanilla />

      <Hero title="About StarryMeet" subtitle="Connecting fans with their icons since 2020" />

      <div className="container">
        <div className="section">
          <h2>Our mission</h2>
          <p>
            To create authentic, meaningful connections between celebrities and their fans through
            face-to-face meetings. We're building a platform where inspiration meets reality, and
            dreams become memories.
          </p>
        </div>

        <StatsGrid stats={statsData} className="stats" />

        <div className="section">
          <h2>What we value</h2>
          <div className="values">
            {valuesData.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>
      </div>

      <FooterVanilla />
    </div>
  );
};
