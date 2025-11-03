import { HeaderVanilla, FooterVanilla } from '@/components';

export const AboutVanilla = () => {
  return (
    <>
      <HeaderVanilla />

      <section className="hero">
        <h1>About StarryMeet</h1>
        <p>Connecting fans with their icons since 2020</p>
      </section>

      <div className="container">
        <div className="section">
          <h2>Our mission</h2>
          <p>To create authentic, meaningful connections between celebrities and their fans through face-to-face meetings. We're building a platform where inspiration meets reality, and dreams become memories.</p>
        </div>

        <div className="stats">
          <div className="stat"><div className="stat-number">50K+</div><div className="stat-label">Meetings created</div></div>
          <div className="stat"><div className="stat-number">10K+</div><div className="stat-label">Verified celebrities</div></div>
          <div className="stat"><div className="stat-number">98%</div><div className="stat-label">Satisfaction rate</div></div>
          <div className="stat"><div className="stat-number">2020</div><div className="stat-label">Founded</div></div>
        </div>

        <div className="section">
          <h2>What we value</h2>
          <div className="values">
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Authenticity</h3>
              <p>Every celebrity is verified. Every meeting is real. No fakes, no scams.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⭐</div>
              <h3>Quality</h3>
              <p>Premium venues. Professional staff. Experiences you'll treasure forever.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h3>Trust</h3>
              <p>Secure payments. Clear policies. Your satisfaction guaranteed.</p>
            </div>
          </div>
        </div>
      </div>

      <FooterVanilla />
    </>
  );
};
