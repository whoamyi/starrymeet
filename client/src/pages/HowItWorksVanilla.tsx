import { Link } from 'react-router-dom';
import { HeaderVanilla, FooterVanilla } from '@/components';

export const HowItWorksVanilla = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary, #0A0A0A)' }}>
      <HeaderVanilla />

      {/* Hero Section */}
      <section className="hero">
        <h1>Meet your icons.<br />Three simple steps.</h1>
        <p>From browsing to booking to meeting face-to-face—your dream experience is just moments away</p>
      </section>

      {/* Main Content */}
      <div className="container">
        <div className="steps-grid">
          {/* Step 1 */}
          <div className="step">
            <div className="step-visual">
              <div className="step-icon">🔍</div>
            </div>
            <div className="step-content">
              <h2>1. Find your star</h2>
              <p>Browse thousands of verified celebrities. Filter by category, price, or location. See their availability, read reviews, and pick your perfect match.</p>
              <div className="features">
                <span className="feature-tag">✓ Verified profiles</span>
                <span className="feature-tag">10,000+ celebrities</span>
                <span className="feature-tag">Real reviews</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="step">
            <div className="step-visual">
              <div className="step-icon">📅</div>
            </div>
            <div className="step-content">
              <h2>2. Book your moment</h2>
              <p>Choose your meeting type—15, 30, or 60 minutes. Pick a date and time. Share what you'd like to talk about. Get approved within 48 hours.</p>
              <div className="features">
                <span className="feature-tag">Flexible scheduling</span>
                <span className="feature-tag">Secure payment</span>
                <span className="feature-tag">Quick approval</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="step">
            <div className="step-visual">
              <div className="step-icon">⭐</div>
            </div>
            <div className="step-content">
              <h2>3. Create your memory</h2>
              <p>Meet face-to-face at a premium venue. Ask questions, get advice, take photos. Walk away with memories that last forever.</p>
              <div className="features">
                <span className="feature-tag">Premium venues</span>
                <span className="feature-tag">Photos included</span>
                <span className="feature-tag">Unforgettable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Trusted by fans worldwide</h2>
          <p style={{ opacity: 0.7, marginBottom: 0 }}>Join thousands who've already met their heroes</p>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Meetings completed</div>
            </div>
            <div className="stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Verified celebrities</div>
            </div>
            <div className="stat">
              <div className="stat-number">4.9★</div>
              <div className="stat-label">Average rating</div>
            </div>
            <div className="stat">
              <div className="stat-number">98%</div>
              <div className="stat-label">Would recommend</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container">
        <section className="cta-section">
          <h2>Ready to meet your icon?</h2>
          <p>Browse thousands of celebrities and book your moment today</p>
          <Link to="/browse" className="btn-large">Start browsing</Link>
        </section>
      </div>

      <FooterVanilla />
    </div>
  );
};
