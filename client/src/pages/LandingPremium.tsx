import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { celebrityApi } from '@/services/api';
import { HeaderVanilla, FooterVanilla } from '@/components';

export const LandingPremium = () => {
  const [totalCount] = useState(147);

  // Fetch featured celebrities
  const { data: celebrities = [] } = useQuery({
    queryKey: ['featured-celebrities', 8],
    queryFn: () => celebrityApi.getFeatured(8),
  });

  return (
    <>
      <HeaderVanilla />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-particles"></div>

        <div className="hero-content">
          <div className="hero-media">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=1000&fit=crop&q=80"
              alt="Verified Celebrities"
              className="hero-image"
            />
            <div className="verification-badges">
              <span className="badge-float badge-1">⭐</span>
              <span className="badge-float badge-2">✓</span>
              <span className="badge-float badge-3">🎯</span>
            </div>
          </div>

          <div className="hero-text">
            <h1 className="hero-headline">
              Where Access Is
              <span className="gradient-text">Earned, Not Bought</span>
            </h1>

            <p className="hero-subhead">
              Connect with the world's most exclusive celebrities through merit-based selection. Your story matters more than your wallet.
            </p>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{totalCount}</span>
                <span className="stat-label">Selective Icons</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">2,500+</span>
                <span className="stat-label">Applications Reviewed</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">78%</span>
                <span className="stat-label">Lead to Collaboration</span>
              </div>
            </div>

            <div className="hero-cta">
              <Link to="/browse" className="btn-primary-large">
                <span>Begin Your Application</span>
                <span className="arrow-icon">→</span>
              </Link>
              <Link to="/how-it-works" className="btn-secondary-large">
                <span>How Selection Works</span>
              </Link>
            </div>

            <div className="hero-trust">
              <span className="trust-text">Merit-based access in 67 countries</span>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span className="scroll-text">Explore</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="legitimacy-section">
        <div className="legitimacy-container">
          <div className="legitimacy-label">
            Core Principles
          </div>

          <div className="logo-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div className="value-prop-card">
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⭐</div>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Curated by Merit</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6' }}>
                Celebrity teams personally review every application. Your reasons, goals, and background determine selection—not who pays most.
              </p>
            </div>
            <div className="value-prop-card">
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤝</div>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Authentic Connections</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6' }}>
                When selected, you've earned it. Every meeting is intentional, meaningful, and aligned with the celebrity's values.
              </p>
            </div>
            <div className="value-prop-card">
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Selective by Design</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6' }}>
                Limited slots protected for those who demonstrate genuine purpose. Quality over quantity, always.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Icons Section */}
      <section className="featured-section">
        <div className="featured-container">
          <div className="section-header">
            <h2 className="section-title">Meet The Icons</h2>
            <p className="section-subtitle">
              <span>{totalCount}</span> exclusive celebrities accepting thoughtful applications
            </p>
          </div>

          <div className="featured-grid">
            {celebrities.length > 0 ? (
              celebrities.map((celeb) => (
                <Link
                  key={celeb.id}
                  to={`/celebrity/${celeb.slug}`}
                  className="celebrity-card"
                >
                  <div className="card-image-wrapper">
                    <img
                      src={celeb.profile_image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=600&fit=crop&q=80'}
                      alt={celeb.name}
                      className="card-image"
                    />
                    <div className="card-overlay">
                      <span className="card-cta">View Profile →</span>
                    </div>
                    {celeb.status === 'active' && <div className="verified-badge">✓</div>}
                  </div>
                  <div className="card-content">
                    <h3 className="card-name">{celeb.name}</h3>
                    <p className="card-category">{celeb.category || 'Celebrity'}</p>
                    <div className="card-meta">
                      <span className="card-tier">Selective Access</span>
                    </div>
                    <div className="card-stats">
                      <span className="stat-item">⭐ {celeb.rating || '4.8'}</span>
                      <span>•</span>
                      <span className="stat-item">Applications Open</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.6)' }}>
                <p>Loading exclusive celebrity experiences...</p>
                <Link to="/browse" className="btn-primary-large" style={{ marginTop: '20px' }}>Explore All Celebrities</Link>
              </div>
            )}
          </div>

          <div className="section-cta">
            <Link to="/browse" className="btn-view-all">
              <span>View All Celebrities</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-container">
          <div className="section-header">
            <h2 className="section-title">Earn Your Access</h2>
            <p className="section-subtitle">
              From application to confirmed meeting in four selective steps
            </p>
          </div>

          <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">
                <span style={{ fontSize: '28px' }}>🔍</span>
              </div>
              <h3 className="step-title">Discover</h3>
              <p className="step-description">
                Browse celebrity profiles and available time slots. Understand their values and what they look for in applicants.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">
                <span style={{ fontSize: '28px' }}>📝</span>
              </div>
              <h3 className="step-title">Apply</h3>
              <p className="step-description">
                Submit your detailed application explaining your background, motivation, and what you bring to the conversation.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">
                <span style={{ fontSize: '28px' }}>⭐</span>
              </div>
              <h3 className="step-title">Selection</h3>
              <p className="step-description">
                Celebrity teams review applications within 48-72 hours based on merit, alignment, and scheduling fit.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <div className="step-icon">
                <span style={{ fontSize: '28px' }}>✓</span>
              </div>
              <h3 className="step-title">Secure</h3>
              <p className="step-description">
                If approved, complete payment to confirm your earned slot. Meeting details and prep materials provided.
              </p>
            </div>
          </div>

          <div className="trust-features">
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <span className="trust-text">Merit-Based Selection</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✓</span>
              <span className="trust-text">Celebrity Reviewed</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span className="trust-text">Secure Platform</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🕐</span>
              <span className="trust-text">48-72hr Response</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <h2 className="section-title">Stories from Selected Members</h2>
            <p className="section-subtitle">
              Voices of those who earned their access
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote className="testimonial-quote">
                I wasn't the highest bidder, but my nonprofit's mission aligned with her advocacy work. She personally chose to meet me, and it changed everything.
              </blockquote>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <div className="author-name">Sarah K.</div>
                  <div className="author-title">Nonprofit Founder</div>
                </div>
              </div>
              <div className="testimonial-meeting">
                <span className="meeting-icon">✓</span>
                <span className="meeting-text">Selected for Emma Watson Meeting</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote className="testimonial-quote">
                The application process made me articulate WHY this mattered. When I was chosen, I knew it wasn't just a transaction—it was meaningful.
              </blockquote>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <div className="author-name">Marcus T.</div>
                  <div className="author-title">Tech Entrepreneur</div>
                </div>
              </div>
              <div className="testimonial-meeting">
                <span className="meeting-icon">✓</span>
                <span className="meeting-text">Selected for Dwayne Johnson Meeting</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote className="testimonial-quote">
                My documentary project aligned with her environmental work. Being selected validated my mission and opened doors to collaboration.
              </blockquote>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <div className="author-name">Dr. Lisa M.</div>
                  <div className="author-title">Filmmaker</div>
                </div>
              </div>
              <div className="testimonial-meeting">
                <span className="meeting-icon">✓</span>
                <span className="meeting-text">Selected for Jane Goodall Meeting</span>
              </div>
            </div>
          </div>

          <div className="section-cta">
            <p className="cta-text">Join members who've earned transformative connections</p>
            <Link to="/browse" className="btn-primary-large">Begin Your Application</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stats-container">
          <div className="stat-item-large">
            <div className="stat-number-large">{totalCount}</div>
            <div className="stat-label-large">Exclusive Icons</div>
          </div>
          <div className="stat-divider-vertical"></div>
          <div className="stat-item-large">
            <div className="stat-number-large">2,500+</div>
            <div className="stat-label-large">Applications Reviewed</div>
          </div>
          <div className="stat-divider-vertical"></div>
          <div className="stat-item-large">
            <div className="stat-number-large">48-72hr</div>
            <div className="stat-label-large">Response Time</div>
          </div>
          <div className="stat-divider-vertical"></div>
          <div className="stat-item-large">
            <div className="stat-number-large">78%</div>
            <div className="stat-label-large">Lead to Collaboration</div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="final-cta-container">
          <div className="cta-content">
            <h2 className="cta-headline">
              Your Opportunity Awaits
            </h2>
            <p className="cta-subhead">
              {totalCount} exclusive celebrities accepting applications. Build your case, demonstrate your purpose, and earn your access today.
            </p>
            <div className="cta-buttons">
              <Link to="/browse" className="btn-primary-large">
                Explore Celebrities
              </Link>
              <Link to="/how-it-works" className="btn-secondary-large">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FooterVanilla />
    </>
  );
};
