import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, BottomNav } from '@/components';
import {
  ProgressBar,
  FormSection,
  TextInput,
  TextareaWithCounter,
  CheckboxField,
} from '@/components/application';
import { applicationApi } from '@/services/api';

interface ProfessionalFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  professionalSummary: string;
  whyCelebrity: string;
  meetingGoals: string;
  whatYouBring: string;
  nextSteps: string;
  linkedinUrl: string;
  companyWebsite: string;
  portfolioUrl: string;
  socialMedia: string;
  agreeToReview: boolean;
  agreeToPayment: boolean;
  agreeToAccuracy: boolean;
  agreeToTerms: boolean;
}

export const ApplicationProfessional = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const [formData, setFormData] = useState<ProfessionalFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    professionalSummary: '',
    whyCelebrity: '',
    meetingGoals: '',
    whatYouBring: '',
    nextSteps: '',
    linkedinUrl: '',
    companyWebsite: '',
    portfolioUrl: '',
    socialMedia: '',
    agreeToReview: false,
    agreeToPayment: false,
    agreeToAccuracy: false,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProfessionalFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Partial<Record<keyof ProfessionalFormData, string>> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.professionalSummary || formData.professionalSummary.length < 300) {
      newErrors.professionalSummary = 'Please provide at least 300 characters';
    }
    if (!formData.whyCelebrity || formData.whyCelebrity.length < 200) {
      newErrors.whyCelebrity = 'Please provide at least 200 characters';
    }
    if (!formData.meetingGoals || formData.meetingGoals.length < 200) {
      newErrors.meetingGoals = 'Please provide at least 200 characters';
    }
    if (!formData.whatYouBring || formData.whatYouBring.length < 150) {
      newErrors.whatYouBring = 'Please provide at least 150 characters';
    }
    if (!formData.nextSteps || formData.nextSteps.length < 100) {
      newErrors.nextSteps = 'Please provide at least 100 characters';
    }
    if (!formData.linkedinUrl) newErrors.linkedinUrl = 'LinkedIn profile is required';
    if (!formData.agreeToReview) newErrors.agreeToReview = 'Required';
    if (!formData.agreeToPayment) newErrors.agreeToPayment = 'Required';
    if (!formData.agreeToAccuracy) newErrors.agreeToAccuracy = 'Required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Submit to API
    try {
      await applicationApi.submitProfessional({
        celebritySlug: slug!,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        professionalSummary: formData.professionalSummary,
        whyCelebrity: formData.whyCelebrity,
        meetingGoals: formData.meetingGoals,
        whatYouBring: formData.whatYouBring,
        nextSteps: formData.nextSteps,
        linkedinUrl: formData.linkedinUrl,
        companyWebsite: formData.companyWebsite,
        portfolioUrl: formData.portfolioUrl,
        socialMedia: formData.socialMedia,
      });

      navigate(`/apply/${slug}/confirmation`, {
        state: { applicationType: 'professional' }
      });
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <ProgressBar currentStep={2} totalSteps={3} />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-4xl">💼</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Professional Application
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Share your professional background and explain how this meeting aligns with your goals. Be specific, clear, and focused on mutual value.
          </p>
        </div>

        {/* Form Container */}
        <div className="relative group mb-8">
          {/* Subtle glow effect */}
          <div className="absolute -inset-px bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)]/20 to-[rgba(255, 255, 255, 0.8)]/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition duration-500"></div>

          {/* Main Form Card */}
          <div className="relative bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 md:p-10 shadow-2xl">
            {/* Inner glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255, 255, 255, 0.8)]/30 to-transparent"></div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Basic Information */}
              <FormSection
                title="Basic Information"
                subtitle="Your contact details"
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <TextInput
                    label="First Name"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    error={errors.firstName}
                  />
                  <TextInput
                    label="Last Name"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    error={errors.lastName}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <TextInput
                    label="Email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                  />
                  <TextInput
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <TextareaWithCounter
                  label="Professional Summary"
                  required
                  value={formData.professionalSummary}
                  onChange={(e) => setFormData({ ...formData, professionalSummary: e.target.value })}
                  maxLength={2500}
                  helpText="Tell us about your professional journey. What do you do? What have you accomplished? Include relevant credentials, roles, and experiences."
                  error={errors.professionalSummary}
                />
              </FormSection>

              {/* Purpose & Alignment */}
              <FormSection
                title="Purpose & Alignment"
                subtitle="Why this meeting matters professionally"
              >
                <TextareaWithCounter
                  label="Why This Specific Celebrity?"
                  required
                  value={formData.whyCelebrity}
                  onChange={(e) => setFormData({ ...formData, whyCelebrity: e.target.value })}
                  maxLength={2000}
                  helpText="Why are you specifically interested in meeting this person? What about their work, expertise, or values aligns with your professional goals?"
                  error={errors.whyCelebrity}
                />

                <TextareaWithCounter
                  label="Meeting Goals & Desired Outcomes"
                  required
                  value={formData.meetingGoals}
                  onChange={(e) => setFormData({ ...formData, meetingGoals: e.target.value })}
                  maxLength={1500}
                  helpText="What do you hope to accomplish in this meeting? Be specific about topics you'd like to discuss and outcomes you envision."
                  error={errors.meetingGoals}
                />
              </FormSection>

              {/* Value Exchange */}
              <FormSection
                title="Value Exchange"
                subtitle="What makes this a mutual opportunity"
              >
                <TextareaWithCounter
                  label="What You Bring to the Table"
                  required
                  value={formData.whatYouBring}
                  onChange={(e) => setFormData({ ...formData, whatYouBring: e.target.value })}
                  maxLength={1500}
                  helpText="Why should they meet with you? Explain your unique perspective, resources, network, or insights that could benefit them."
                  error={errors.whatYouBring}
                />

                <TextareaWithCounter
                  label="Proposed Next Steps"
                  required
                  value={formData.nextSteps}
                  onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                  maxLength={1000}
                  helpText="If approved, what would you propose as next steps? How would you prepare? What format would work best?"
                  error={errors.nextSteps}
                />
              </FormSection>

              {/* Supporting Evidence */}
              <FormSection
                title="Supporting Evidence"
                subtitle="Your professional presence"
              >
                <TextInput
                  label="LinkedIn Profile URL"
                  type="url"
                  required
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                  error={errors.linkedinUrl}
                />

                <TextInput
                  label="Company Website"
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                  placeholder="https://yourcompany.com"
                />

                <TextInput
                  label="Portfolio URL"
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />

                <TextInput
                  label="Other Social Media"
                  value={formData.socialMedia}
                  onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                  placeholder="Twitter, Instagram, or other relevant profiles"
                />
              </FormSection>

              {/* Declaration */}
              <FormSection
                title="Declaration"
                subtitle="Please confirm the following"
              >
                <div className="space-y-4 bg-black/30 border border-gray-700/30 rounded-xl p-5">
                  <CheckboxField
                    label="I understand this application will be reviewed and is not a guaranteed booking"
                    required
                    checked={formData.agreeToReview}
                    onChange={(e) => setFormData({ ...formData, agreeToReview: e.target.checked })}
                  />
                  <CheckboxField
                    label="If approved, I understand payment will be required to confirm the meeting"
                    required
                    checked={formData.agreeToPayment}
                    onChange={(e) => setFormData({ ...formData, agreeToPayment: e.target.checked })}
                  />
                  <CheckboxField
                    label="I confirm all information provided is accurate and professional"
                    required
                    checked={formData.agreeToAccuracy}
                    onChange={(e) => setFormData({ ...formData, agreeToAccuracy: e.target.checked })}
                  />
                  <CheckboxField
                    label="I agree to StarryMeet's Terms of Service and Privacy Policy"
                    required
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  />
                </div>
              </FormSection>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.8)] text-black font-semibold rounded-xl hover:from-[rgba(255, 255, 255, 0.8)] hover:to-[rgba(255, 255, 255, 0.8)] transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-[rgba(255, 255, 255, 0.8)]/25"
                >
                  Submit Professional Application →
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};
