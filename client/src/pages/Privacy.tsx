import { Footer } from '@/components';

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p className="mb-4">We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal information (name, email, phone number)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Usage data (pages visited, time spent, clicks)</li>
                <li>Device information (IP address, browser type, operating system)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To process bookings and facilitate meetings</li>
                <li>To communicate with you about your bookings</li>
                <li>To improve our platform and user experience</li>
                <li>To send promotional emails (with your consent)</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Celebrities you book meetings with (name and booking details only)</li>
                <li>Payment processors to complete transactions</li>
                <li>Service providers who assist in operating our platform</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information. All
                payment data is encrypted and processed through PCI-compliant payment processors. However,
                no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage, and
                deliver personalized content. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Children's Privacy</h2>
              <p>
                StarryMeet is not intended for users under 18. We do not knowingly collect information
                from children under 18.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
              <p>
                For privacy-related questions, contact us at{' '}
                <a href="mailto:privacy@starrymeet.com" className="text-[#D4A574] hover:text-[#C49563]">
                  privacy@starrymeet.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
