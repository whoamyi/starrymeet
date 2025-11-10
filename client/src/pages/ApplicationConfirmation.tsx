import { useLocation, Link } from 'react-router-dom';
import { Header, BottomNav } from '@/components';
import { ProgressBar } from '@/components/application';

export const ApplicationConfirmation = () => {
  const location = useLocation();
  const state = location.state as { applicationType?: 'professional' | 'personal' };
  const applicationType = state?.applicationType || 'professional';
  const isProfessional = applicationType === 'professional';

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <ProgressBar currentStep={3} totalSteps={3} />

        {/* Success Card */}
        <div className="relative group mb-8">
          {/* Glow effect */}
          <div className="absolute -inset-px bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)]/30 to-[rgba(255, 255, 255, 0.8)]/30 rounded-3xl blur-xl"></div>

          {/* Main Card */}
          <div className="relative bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
            {/* Inner glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255, 255, 255, 0.8)]/50 to-transparent"></div>

            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.8)] rounded-full opacity-20 blur-2xl scale-150"></div>
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.8)] flex items-center justify-center shadow-lg shadow-[rgba(255, 255, 255, 0.8)]/50">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Application Submitted! {isProfessional ? '💼' : '💫'}
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Your {isProfessional ? 'professional' : 'personal'} meeting application has been successfully submitted. Thank you for sharing {isProfessional ? 'your proposal' : 'your story'}.
              </p>
            </div>

            {/* What Happens Next */}
            <div className="bg-black/30 border border-gray-700/30 rounded-2xl p-6 md:p-8 mb-8 text-left">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-[rgba(255, 255, 255, 0.8)]">✨</span>
                What Happens Next
              </h2>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.8)] flex items-center justify-center text-black font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Review Process</h3>
                    <p className="text-sm text-gray-400">
                      {isProfessional
                        ? 'Your application will be reviewed based on professional alignment, mutual value, and the strength of your proposal.'
                        : 'Your story will be read with care and consideration. We evaluate based on authenticity, emotional resonance, and genuine connection.'}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.8)] flex items-center justify-center text-black font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Response Timeline</h3>
                    <p className="text-sm text-gray-400">
                      You'll receive an update within <span className="text-white font-medium">7-14 business days</span>. Check your email and dashboard regularly.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.8)] flex items-center justify-center text-black font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">If Approved</h3>
                    <p className="text-sm text-gray-400">
                      We'll send you booking details, payment instructions, and next steps to schedule your meeting.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.8)] flex items-center justify-center text-black font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">If Not Selected</h3>
                    <p className="text-sm text-gray-400">
                      {isProfessional
                        ? "We'll provide feedback when possible. Don't be discouraged—timing and fit matter, and you're welcome to apply again in the future."
                        : "Remember that many factors go into these decisions. Your story matters, and we encourage you to keep pursuing meaningful connections."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.8)] text-black font-semibold rounded-xl hover:from-[rgba(255, 255, 255, 0.8)] hover:to-[rgba(255, 255, 255, 0.8)] transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-[rgba(255, 255, 255, 0.8)]/25"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/browse"
                className="px-6 py-3 bg-black/40 border border-gray-700/50 text-white font-semibold rounded-xl hover:bg-black/60 hover:border-[rgba(255, 255, 255, 0.8)]/50 transition-all duration-300"
              >
                Browse More Celebrities
              </Link>
            </div>

            {/* Bottom Note */}
            <div className="mt-8 pt-6 border-t border-gray-700/30">
              <p className="text-sm text-gray-400">
                Track your application status anytime from your{' '}
                <Link to="/dashboard" className="text-[rgba(255, 255, 255, 0.8)] hover:text-[rgba(255, 255, 255, 0.8)] font-medium transition-colors">
                  dashboard
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};
