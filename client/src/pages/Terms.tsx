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
                StarryMeet is a selective platform that facilitates meaningful connections between exclusive
                celebrities and carefully selected applicants through merit-based evaluation. We facilitate a
                curated application and review process where celebrities and their teams evaluate applicants
                based on alignment, purpose, and mutual value—not solely on financial capability.
              </p>
              <p className="mt-4">
                We act as an intermediary platform and do not guarantee approval of any application or
                availability of any specific celebrity. Selection is at the sole discretion of each celebrity
                and their authorized representatives.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 18 years old to use StarryMeet</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to provide accurate and complete information</li>
                <li>You will not use the platform for any illegal or unauthorized purpose</li>
                <li>You agree to submit truthful, authentic applications that reflect your genuine motivations</li>
                <li>You understand that submitting an application does not guarantee approval or booking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Application-Based Selection Model</h2>
              <p className="mb-4">
                StarryMeet operates on a merit-based application system. Understanding this process is essential:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Application Required:</strong> All meeting requests require submission of a detailed
                  application explaining your background, motivation, and what you bring to the conversation.
                  Submitting an application does not guarantee approval.
                </li>
                <li>
                  <strong>No Payment Until Approved:</strong> You will not be charged any fees unless and until
                  your application is approved by the celebrity or their authorized team. Payment confirms a slot
                  you have already earned through merit.
                </li>
                <li>
                  <strong>Review Timeline:</strong> Applications are typically reviewed within 48-72 hours. Some
                  celebrities may have longer review periods depending on volume and availability.
                </li>
                <li>
                  <strong>Selection Criteria:</strong> Celebrities evaluate applications based on factors including
                  but not limited to: alignment with their values, purpose of the meeting, authenticity of motivation,
                  professional or personal relevance, and scheduling compatibility. Financial capability is necessary
                  but not sufficient for selection.
                </li>
                <li>
                  <strong>Reapplication Policy:</strong> If your application is not selected, you are welcome to
                  apply again for future availability slots. We encourage applicants to refine their applications
                  based on any feedback provided.
                </li>
                <li>
                  <strong>Approval Window:</strong> If approved, you will have 48 hours to complete payment and
                  confirm your booking. Failure to confirm within this window may result in the slot being offered
                  to other applicants.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Payment Terms</h2>
              <p className="mb-4">
                Payment is only required after application approval. Once approved:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You have 48 hours to complete payment to secure your confirmed slot</li>
                <li>Payments are processed securely through our third-party payment providers</li>
                <li>Payment confirms a meeting slot you have earned through the application process</li>
                <li>All fees are clearly disclosed before you submit payment</li>
                <li>Refund policies apply as outlined in Section 6</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Cancellation & Refund Policy</h2>
              <p className="mb-4">
                Our cancellation policy applies only to confirmed, paid bookings (after application approval):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Application Stage:</strong> If your application is denied, no payment is collected and
                  no refund is necessary. You may reapply for future slots at no cost.
                </li>
                <li>
                  <strong>User Cancellations:</strong>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Full refund for cancellations 7+ days before scheduled meeting</li>
                    <li>50% refund for cancellations 3-6 days before meeting</li>
                    <li>No refund for cancellations within 3 days of meeting</li>
                  </ul>
                </li>
                <li>
                  <strong>Celebrity Cancellations:</strong> Full refund if the celebrity or their team cancels
                  for any reason, regardless of timing.
                </li>
                <li>
                  <strong>No-Show Policy:</strong> If you fail to attend a confirmed meeting without prior
                  cancellation, no refund will be issued.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
              <p>
                StarryMeet is not liable for any indirect, incidental, special, consequential, or punitive
                damages resulting from your use of the platform. Our total liability shall not exceed the
                amount you paid for the specific booking in question. We are not responsible for application
                denials or the subjective evaluation criteria used by celebrities and their teams.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact</h2>
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
