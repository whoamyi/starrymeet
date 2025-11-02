import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { celebrityApi } from '@/services/api';
import { Header, Footer } from '@/components';

export const LandingPremium = () => {
  const [totalCount] = useState(147);

  // Fetch featured celebrities
  const { data: celebrities = [] } = useQuery({
    queryKey: ['featured-celebrities', 8],
    queryFn: () => celebrityApi.getFeatured(8),
  });

  return (
    <>
      <Header />

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
              <span className="badge-float badge-1">✓</span>
              <span className="badge-float badge-2">✓</span>
              <span className="badge-float badge-3">✓</span>
            </div>
          </div>

          <div className="hero-text">
            <h1 className="hero-headline">
              Private Access to
              <span className="gradient-text">The World's Icons</span>
            </h1>

            <p className="hero-subhead">
              Verified celebrities. Real meetings. Guaranteed experiences.
            </p>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{totalCount}</span>
                <span className="stat-label">Icons Available</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">1,247</span>
                <span className="stat-label">Experiences Delivered</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>

            <div className="hero-cta">
              <Link to="/browse" className="btn-primary-large">
                <span>Browse Icons</span>
                <span className="arrow-icon">→</span>
              </Link>
              <Link to="/how-it-works" className="btn-secondary-large">
                <span>How It Works</span>
              </Link>
            </div>

            <div className="hero-trust">
              <span className="trust-text">Trusted by members in 67 countries</span>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span className="scroll-text">Explore</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Legitimacy Section */}
      <section className="legitimacy-section">
        <div className="legitimacy-container">
          <div className="legitimacy-label">
            As featured in
          </div>

          <div className="logo-grid">
            <div className="logo-item">
              <span className="press-logo" style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>Forbes</span>
            </div>
            <div className="logo-item">
              <span className="press-logo" style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>WSJ</span>
            </div>
            <div className="logo-item">
              <span className="press-logo" style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>TechCrunch</span>
            </div>
            <div className="logo-item">
              <span className="press-logo" style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>Bloomberg</span>
            </div>
            <div className="logo-item">
              <span className="press-logo" style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>FT</span>
            </div>
            <div className="logo-item">
              <span className="press-logo" style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>Fortune</span>
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
              <span>{totalCount}</span> verified celebrities available for private meetings
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
                      <span className="card-tier">Tier A</span>
                      <span className="card-price">From ${Math.round(celeb.price_per_hour).toLocaleString()}</span>
                    </div>
                    <div className="card-stats">
                      <span className="stat-item">⭐ {celeb.rating || '4.8'}</span>
                      <span>•</span>
                      <span className="stat-item">2 slots left</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.6)' }}>
                <p>Loading exclusive celebrity experiences...</p>
                <Link to="/browse" className="btn-primary-large" style={{ marginTop: '20px' }}>Browse All Icons</Link>
              </div>
            )}
          </div>

          <div className="section-cta">
            <Link to="/browse" className="btn-view-all">
              <span>View All Icons</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-container">
          <div className="section-header">
            <h2 className="section-title">Simple. Secure. Guaranteed.</h2>
            <p className="section-subtitle">
              From discovery to meeting in three effortless steps
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">
                <span style={{ fontSize: '28px' }}>🔍</span>
              </div>
              <h3 className="step-title">Browse & Choose</h3>
              <p className="step-description">
                Explore {totalCount} verified celebrities. See real availability,
                pricing, and reviews from actual bookings.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">
                <span style={{ fontSize: '28px' }}>💬</span>
              </div>
              <h3 className="step-title">Request & Confirm</h3>
              <p className="step-description">
                Submit your request with a personal message. Most celebrities
                respond within 6 hours. Payment secured in escrow.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">
                <span style={{ fontSize: '28px' }}>⭐</span>
              </div>
              <h3 className="step-title">Meet & Experience</h3>
              <p className="step-description">
                Attend your confirmed meeting. 24/7 concierge support.
                100% guarantee or full refund.
              </p>
            </div>
          </div>

          <div className="trust-features">
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <span className="trust-text">Payment in Escrow</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✓</span>
              <span className="trust-text">Identity Verified</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span className="trust-text">Bank-Grade Security</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🕐</span>
              <span className="trust-text">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <h2 className="section-title">Experiences That Matter</h2>
            <p className="section-subtitle">
              Real stories from real members
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote className="testimonial-quote">
                Meeting Elon at Tesla HQ was surreal. He spent an extra 20 minutes
                discussing AI ethics. Worth every penny for the insights I gained.
              </blockquote>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <div className="author-name">Michael C.</div>
                  <div className="author-title">Tech Founder</div>
                </div>
              </div>
              <div className="testimonial-meeting">
                <span className="meeting-icon">✓</span>
                <span className="meeting-text">Verified meeting with Elon Musk</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote className="testimonial-quote">
                Virtual meeting with Taylor Swift was incredible. She was warm,
                authentic, and genuinely interested in my non-profit work.
              </blockquote>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <div className="author-name">Sarah L.</div>
                  <div className="author-title">Entrepreneur</div>
                </div>
              </div>
              <div className="testimonial-meeting">
                <span className="meeting-icon">✓</span>
                <span className="meeting-text">Verified meeting with Taylor Swift</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote className="testimonial-quote">
                Spending time with Serena Williams discussing resilience and
                leadership changed my perspective on business challenges.
              </blockquote>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <div className="author-name">David P.</div>
                  <div className="author-title">CEO</div>
                </div>
              </div>
              <div className="testimonial-meeting">
                <span className="meeting-icon">✓</span>
                <span className="meeting-text">Verified meeting with Serena Williams</span>
              </div>
            </div>
          </div>

          <div className="section-cta">
            <p className="cta-text">Join 1,247 members who've had transformative experiences</p>
            <Link to="/browse" className="btn-primary-large">Start Your Journey</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stats-container">
          <div className="stat-item-large">
            <div className="stat-number-large">{totalCount}</div>
            <div className="stat-label-large">Verified Icons</div>
          </div>
          <div className="stat-divider-vertical"></div>
          <div className="stat-item-large">
            <div className="stat-number-large">1,247</div>
            <div className="stat-label-large">Meetings Delivered</div>
          </div>
          <div className="stat-divider-vertical"></div>
          <div className="stat-item-large">
            <div className="stat-number-large">100%</div>
            <div className="stat-label-large">Money-Back Guarantee</div>
          </div>
          <div className="stat-divider-vertical"></div>
          <div className="stat-item-large">
            <div className="stat-number-large">4.9★</div>
            <div className="stat-label-large">Average Rating</div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="final-cta-container">
          <div className="cta-content">
            <h2 className="cta-headline">
              Your Icon Is Waiting
            </h2>
            <p className="cta-subhead">
              {totalCount} verified celebrities ready to meet. Every meeting guaranteed
              or your money back. Start your journey today.
            </p>
            <div className="cta-buttons">
              <Link to="/browse" className="btn-primary-large">
                Browse Icons
              </Link>
              <Link to="/how-it-works" className="btn-secondary-large">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};
