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
                <li>Application data (essays, motivations, background information, professional details)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Usage data (pages visited, time spent, clicks)</li>
                <li>Device information (IP address, browser type, operating system)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Application Data</h2>
              <p className="mb-4">
                As a merit-based selection platform, we collect and process detailed application information.
                Here's how we handle your application data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>What We Collect:</strong> When you apply for a meeting, we collect your written
                  application including your background, motivations, professional or personal context, and
                  any other information you choose to share in your application.
                </li>
                <li>
                  <strong>Who Sees Your Application:</strong> Your application data is shared only with the
                  specific celebrity and their authorized team members for evaluation purposes. We do not share
                  application data with other users, third-party marketers, or unrelated parties.
                </li>
                <li>
                  <strong>Retention Period:</strong> Approved applications are retained for the duration of your
                  booking and for 90 days afterward for record-keeping purposes. Declined applications are
                  retained for 30 days to allow for potential reapplication context, then permanently deleted
                  unless you request earlier deletion.
                </li>
                <li>
                  <strong>Your Rights:</strong> You may request deletion of your application data at any time by
                  contacting privacy@starrymeet.com. Note that deletion will withdraw any pending applications
                  and may limit our ability to provide context for future applications.
                </li>
                <li>
                  <strong>Confidentiality:</strong> We treat all application data as confidential and implement
                  strict access controls to ensure only authorized personnel and relevant celebrity teams can
                  access your information.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To process and review applications for celebrity meetings</li>
                <li>To facilitate communication between applicants and celebrity teams</li>
                <li>To process bookings and facilitate confirmed meetings</li>
                <li>To communicate with you about your applications, approvals, and bookings</li>
                <li>To improve our platform, application process, and user experience</li>
                <li>To send promotional emails (with your consent)</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing</h2>
              <p className="mb-4">We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Celebrities and Their Teams:</strong> When you submit an application, we share your
                  application data (including personal story, motivations, and background) with the specific
                  celebrity and their authorized team members for evaluation. If approved, we share your name
                  and booking details for meeting coordination.
                </li>
                <li>
                  <strong>Payment Processors:</strong> To complete transactions securely (only after application
                  approval).
                </li>
                <li>
                  <strong>Service Providers:</strong> Trusted third-party providers who assist in operating our
                  platform, processing applications, and facilitating meetings.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> Law enforcement or regulatory authorities when required
                  by law.
                </li>
              </ul>
              <p className="mt-4">
                We never share application data with other applicants, competitors, or for marketing purposes
                outside of StarryMeet's services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information and
                application data. All payment data is encrypted and processed through PCI-compliant payment
                processors. Application data is stored securely with strict access controls. However,
                no method of transmission over the internet is 100% secure, and we cannot guarantee absolute
                security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data and application history</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data (including application data)</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
                <li>Withdraw pending applications</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at privacy@starrymeet.com. Note that deleting application
                data will withdraw any pending applications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Cookies</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage, and
                deliver personalized content. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
              <p>
                StarryMeet is not intended for users under 18. We do not knowingly collect information
                from children under 18. Our application process requires users to be at least 18 years old.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
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
