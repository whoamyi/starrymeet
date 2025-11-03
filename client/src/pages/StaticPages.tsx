import { HeaderVanilla, FooterVanilla } from '@/components';

// FAQ Page
export const FAQVanilla = () => {
  const faqs = [
    { q: 'How does StarryMeet work?', a: 'Browse verified celebrities, book a meeting time, and meet them face-to-face at a premium venue.' },
    { q: 'Are the celebrities real?', a: 'Yes! Every celebrity on our platform is verified through our rigorous authentication process.' },
    { q: 'What if my meeting gets cancelled?', a: 'You receive a full refund if the celebrity cancels. We also help you reschedule or book with another star.' },
    { q: 'How much does it cost?', a: 'Prices vary by celebrity and meeting duration. Most meetings range from $500 to $50,000.' },
    { q: 'Can I get a refund?', a: 'Yes, we offer full refunds up to 48 hours before your scheduled meeting.' },
  ];

  return (
    <>
      <HeaderVanilla />
      <section className="hero">
        <h1>Frequently Asked Questions</h1>
        <p>Everything you need to know about StarryMeet</p>
      </section>
      <div className="container">
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <details key={i} className="faq-item">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
      <FooterVanilla />
    </>
  );
};

// Contact Page
export const ContactVanilla = () => {
  return (
    <>
      <HeaderVanilla />
      <section className="hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </section>
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in touch</h2>
            <p>Email: hello@starrymeet.com</p>
            <p>Press: press@starrymeet.com</p>
            <p>Celebrities: apply@starrymeet.com</p>
          </div>
          <div className="contact-form">
            <h2>Send us a message</h2>
            <form>
              <input type="text" placeholder="Your name" required />
              <input type="email" placeholder="Your email" required />
              <textarea placeholder="Your message" rows={5} required></textarea>
              <button type="submit" className="btn-large">Send message</button>
            </form>
          </div>
        </div>
      </div>
      <FooterVanilla />
    </>
  );
};

// Team Page
export const TeamVanilla = () => {
  return (
    <>
      <HeaderVanilla />
      <section className="hero">
        <h1>Our Team</h1>
        <p>Meet the people behind StarryMeet</p>
      </section>
      <div className="container">
        <p className="section">We're a small team of dreamers building something special. Coming soon.</p>
      </div>
      <FooterVanilla />
    </>
  );
};

// Jobs Page
export const JobsVanilla = () => {
  return (
    <>
      <HeaderVanilla />
      <section className="hero">
        <h1>Join Our Team</h1>
        <p>Help us connect fans with their icons</p>
      </section>
      <div className="container">
        <div className="section">
          <h2>Open positions</h2>
          <p>No open positions at the moment. Check back soon!</p>
          <p>Interested in working with us? Send your resume to jobs@starrymeet.com</p>
        </div>
      </div>
      <FooterVanilla />
    </>
  );
};

// Terms Page
export const TermsVanilla = () => {
  return (
    <>
      <HeaderVanilla />
      <section className="hero">
        <h1>Terms of Service</h1>
        <p>Last updated: January 2025</p>
      </section>
      <div className="container legal-content">
        <div className="section">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using StarryMeet, you accept and agree to be bound by these Terms of Service.</p>
        </div>
        <div className="section">
          <h2>2. User Responsibilities</h2>
          <p>Users must provide accurate information, behave respectfully, and comply with all applicable laws.</p>
        </div>
        <div className="section">
          <h2>3. Booking and Payments</h2>
          <p>All bookings are subject to celebrity approval. Payments are processed securely through our platform.</p>
        </div>
        <div className="section">
          <h2>4. Cancellation Policy</h2>
          <p>Full refunds available up to 48 hours before scheduled meetings. See our cancellation policy for details.</p>
        </div>
        <div className="section">
          <h2>5. Limitation of Liability</h2>
          <p>StarryMeet acts as a platform connecting fans and celebrities. We are not responsible for the conduct of users.</p>
        </div>
      </div>
      <FooterVanilla />
    </>
  );
};

// Privacy Page
export const PrivacyVanilla = () => {
  return (
    <>
      <HeaderVanilla />
      <section className="hero">
        <h1>Privacy Policy</h1>
        <p>Last updated: January 2025</p>
      </section>
      <div className="container legal-content">
        <div className="section">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly, such as name, email, payment information, and booking preferences.</p>
        </div>
        <div className="section">
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to process bookings, improve our service, and communicate with you about your meetings.</p>
        </div>
        <div className="section">
          <h2>3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information.</p>
        </div>
        <div className="section">
          <h2>4. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information at any time.</p>
        </div>
        <div className="section">
          <h2>5. Contact Us</h2>
          <p>For privacy-related questions, contact us at privacy@starrymeet.com</p>
        </div>
      </div>
      <FooterVanilla />
    </>
  );
};
