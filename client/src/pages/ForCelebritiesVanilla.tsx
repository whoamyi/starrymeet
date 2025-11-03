import { useState } from 'react';
import { HeaderVanilla, FooterVanilla } from '@/components';

export const ForCelebritiesVanilla = () => {
  const [meetings, setMeetings] = useState(20);
  const [price, setPrice] = useState(2500);

  const monthlyEarnings = Math.round(meetings * price * 0.85);
  const annualEarnings = monthlyEarnings * 12;

  return (
    <>
      <HeaderVanilla />

      {/* Hero Section */}
      <section className="hero">
        <h1>Turn your time<br />into income</h1>
        <p>Meet your fans face-to-face. Set your schedule. Keep 85% of what you earn.</p>
        <a href="mailto:apply@starrymeet.com?subject=Celebrity%20Application" className="btn-large">Apply to join</a>
      </section>

      {/* Main Content */}
      <div className="container">
        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="section-header">
            <h2>Why top stars choose us</h2>
            <p>The easiest way to monetize your influence</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Earn more</h3>
              <p>Keep 85% of every meeting. Set your own prices. No hidden fees.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Full control</h3>
              <p>You approve every meeting. Set your schedule. Choose your locations.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h3>Safe & secure</h3>
              <p>Premium venues. Professional staff. Security handled for you.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Easy setup</h3>
              <p>Get verified in 48 hours. Start earning within a week.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📱</div>
              <h3>Simple tools</h3>
              <p>Manage everything from your phone. Real-time booking alerts.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌍</div>
              <h3>Global reach</h3>
              <p>Fans book you wherever you travel. No location limits.</p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="calculator-section">
          <h2>See your earning potential</h2>
          <p>Thousands of celebrities are earning life-changing income</p>
          <div className="calc-controls">
            <div className="calc-control">
              <label>Meetings per month</label>
              <input
                type="number"
                value={meetings}
                min="1"
                max="100"
                onChange={(e) => setMeetings(Number(e.target.value))}
              />
            </div>
            <div className="calc-control">
              <label>Price per meeting ($)</label>
              <input
                type="number"
                value={price}
                min="100"
                step="100"
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="calc-result">
            <div className="calc-result-label">You could earn</div>
            <div className="calc-result-amount">${monthlyEarnings.toLocaleString()}</div>
            <div className="calc-result-subtext">per month · ${annualEarnings.toLocaleString()} per year</div>
          </div>
        </section>

        {/* How It Works */}
        <section className="steps-section">
          <div className="section-header">
            <h2>How it works</h2>
            <p>Get started in five simple steps</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Apply & verify</h3>
                <p>Submit your application. We verify your identity and work with your management.</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Set availability</h3>
                <p>Add your schedule, set your rates, choose meeting types you're comfortable with.</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Review requests</h3>
                <p>Fans apply to meet you. Review their stories and approve the ones you like.</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Meet your fans</h3>
                <p>Show up at premium venues we arrange. Create genuine connections.</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Get paid fast</h3>
                <p>Earnings deposited within 7 days. Track everything in your dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2>Ready to start earning?</h2>
          <p>Join thousands of celebrities already on StarryMeet</p>
          <a href="mailto:apply@starrymeet.com?subject=Celebrity%20Application" className="btn-large">Apply now</a>
        </section>
      </div>

      <FooterVanilla />
    </>
  );
};
