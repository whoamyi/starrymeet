import { Footer } from '@/components';

export const Terms = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using StarryMeet, you accept and agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
              <p>
                StarryMeet is a platform that facilitates connections between celebrities and fans through
                face-to-face meetings. We act as an intermediary and do not guarantee the availability or
                participation of any specific celebrity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 18 years old to use StarryMeet</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to provide accurate and complete information</li>
                <li>You will not use the platform for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Booking and Payments</h2>
              <p>
                All bookings are subject to celebrity approval. Payments are held in escrow until the meeting
                is confirmed. Refund policies apply as outlined in our Cancellation Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Cancellation Policy</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full refund for cancellations 7+ days before scheduled meeting</li>
                <li>50% refund for cancellations 3-6 days before meeting</li>
                <li>No refund for cancellations within 3 days of meeting</li>
                <li>Full refund if celebrity cancels for any reason</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
              <p>
                StarryMeet is not liable for any indirect, incidental, special, consequential, or punitive
                damages resulting from your use of the platform. Our total liability shall not exceed the
                amount you paid for the specific booking in question.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Contact</h2>
              <p>
                For questions about these Terms, please contact us at{' '}
                <a href="mailto:legal@starrymeet.com" className="text-[#D4A574] hover:text-[#C49563]">
                  legal@starrymeet.com
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
