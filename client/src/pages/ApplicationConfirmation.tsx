import { useLocation, useNavigate, Link } from 'react-router-dom';
import { HeaderVanilla, FooterVanilla } from '@/components';
import { ProgressBar } from '@/components/application';

export const ApplicationConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { applicationType?: 'professional' | 'personal' };

  const applicationType = state?.applicationType || 'professional';
  const isProfessional = applicationType === 'professional';

  return (
    <div className="min-h-screen bg-white">
      <HeaderVanilla />
      <ProgressBar currentStep={3} totalSteps={3} />

      <div className="max-w-3xl mx-auto py-16 px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-black mb-4">
            Application Submitted!
          </h1>

          <p className="text-xl text-gray-600">
            Your {isProfessional ? 'professional' : 'personal'} meeting request has been received.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="bg-gray-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">What Happens Next?</h2>

          <div className="space-y-6">
            <Step
              number={1}
              title="Review Process"
              description={
                isProfessional
                  ? "Your application will be reviewed based on professional alignment, mutual value, and the clarity of your goals. The celebrity's team will carefully evaluate how your background and objectives align with their expertise and interests."
                  : "Your story will be read with care and consideration. The celebrity's team will evaluate the authenticity of your connection, the uniqueness of your story, and the meaningfulness of this moment in your life."
              }
            />

            <Step
              number={2}
              title="Response Timeline"
              description="You'll receive a response within 5-7 business days. Due to the selective nature of this process, we review each application thoroughly."
            />

            <Step
              number={3}
              title="If Approved"
              description="If your application is approved, you'll receive an email with payment instructions and meeting coordination details. Payment is only required after approval."
            />

            <Step
              number={4}
              title="If Not Selected"
              description="Not every application can be approved, but that doesn't diminish the value of your request. You'll receive a thoughtful response explaining the decision."
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#D4A574]/10 border-2 border-[#D4A574]/30 rounded-xl p-6 mb-8">
          <div className="flex gap-3">
            <span className="text-2xl">💌</span>
            <div>
              <p className="font-semibold text-black mb-2">
                Check Your Email
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                We've sent a confirmation email with your application reference number.
                Please check your spam folder if you don't see it in your inbox.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="block w-full bg-[#D4A574] text-black text-center px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            View My Applications
          </Link>

          <Link
            to="/browse"
            className="block w-full text-center px-8 py-4 rounded-lg font-semibold border-2 border-gray-300 text-black hover:border-black transition-colors"
          >
            Browse Other Celebrities
          </Link>
        </div>

        {/* Additional Note */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200 text-center">
          <p className="text-gray-600">
            <strong className="text-black">Remember:</strong> Approval is selective and based on alignment, not just payment ability.
            We appreciate the time you took to share your {isProfessional ? 'professional background' : 'personal story'}.
          </p>
        </div>
      </div>

      <FooterVanilla />
    </div>
  );
};

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
    </div>
    <div>
      <h3 className="font-bold text-black mb-2">{title}</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);
