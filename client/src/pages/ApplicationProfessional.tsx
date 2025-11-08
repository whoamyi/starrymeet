import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HeaderVanilla, FooterVanilla } from '@/components';
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
    <div className="min-h-screen bg-white">
      <HeaderVanilla />
      <ProgressBar currentStep={2} totalSteps={3} />

      <div className="max-w-4xl mx-auto py-16 px-8">
        {/* Header */}
        <div className="mb-12 pb-8 border-b-2 border-gray-200">
          <div className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            💼 Professional Meeting
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">
            Tell Us Why You Should Be Selected
          </h1>
          <p className="text-lg text-gray-600">
            Share your professional background, what you're working on, and why this meeting
            would be valuable for both of you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section A: Professional Background */}
          <FormSection
            title="Professional Background"
            subtitle="Help us understand your work and credentials"
          >
            <div className="grid md:grid-cols-2 gap-6">
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

            <div className="grid md:grid-cols-2 gap-6">
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

          {/* Section B: Purpose & Alignment */}
          <FormSection
            title="Purpose & Alignment"
            subtitle="Why this celebrity and why now"
          >
            <TextareaWithCounter
              label="Why This Celebrity?"
              required
              value={formData.whyCelebrity}
              onChange={(e) => setFormData({ ...formData, whyCelebrity: e.target.value })}
              maxLength={2000}
              helpText="Why specifically do you want to meet this celebrity from a professional perspective? What about their work, expertise, advocacy, or career resonates with your goals?"
              error={errors.whyCelebrity}
            />

            <TextareaWithCounter
              label="Meeting Goals"
              required
              value={formData.meetingGoals}
              onChange={(e) => setFormData({ ...formData, meetingGoals: e.target.value })}
              maxLength={1500}
              helpText="What do you hope to accomplish in this meeting? What specific topics, questions, or areas do you want to explore?"
              error={errors.meetingGoals}
            />
          </FormSection>

          {/* Section C: Value Exchange */}
          <FormSection
            title="Value Exchange"
            subtitle="What makes this a meaningful connection for both parties"
          >
            <TextareaWithCounter
              label="What You Bring"
              required
              value={formData.whatYouBring}
              onChange={(e) => setFormData({ ...formData, whatYouBring: e.target.value })}
              maxLength={1500}
              helpText="This meeting should benefit both parties. What unique perspective, expertise, project, or opportunity do you bring? How might this meeting be valuable for the celebrity?"
              error={errors.whatYouBring}
            />

            <TextareaWithCounter
              label="Next Steps & Impact"
              required
              value={formData.nextSteps}
              onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
              maxLength={1000}
              helpText="What will you do after this meeting? How does it fit into your broader professional goals or projects?"
              error={errors.nextSteps}
            />
          </FormSection>

          {/* Section D: Supporting Evidence */}
          <FormSection title="Supporting Evidence">
            <TextInput
              label="LinkedIn Profile"
              required
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              error={errors.linkedinUrl}
              placeholder="https://linkedin.com/in/yourprofile"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <TextInput
                label="Company/Organization Website"
                type="url"
                value={formData.companyWebsite}
                onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                placeholder="https://yourcompany.com"
              />
              <TextInput
                label="Portfolio or Project URL"
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <TextInput
              label="Social Media (Relevant Professional Accounts)"
              value={formData.socialMedia}
              onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
              placeholder="Twitter, Instagram, etc."
            />
          </FormSection>

          {/* Section E: Declaration */}
          <FormSection title="Declaration">
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <CheckboxField
                checked={formData.agreeToReview}
                onChange={(e) => setFormData({ ...formData, agreeToReview: e.target.checked })}
                label="I understand my application will be reviewed based on professional alignment and merit, and approval is not guaranteed."
                required
              />
              <CheckboxField
                checked={formData.agreeToPayment}
                onChange={(e) => setFormData({ ...formData, agreeToPayment: e.target.checked })}
                label="I understand payment is only required if my application is approved."
                required
              />
              <CheckboxField
                checked={formData.agreeToAccuracy}
                onChange={(e) => setFormData({ ...formData, agreeToAccuracy: e.target.checked })}
                label="I certify that all information provided is accurate and truthful."
                required
              />
              <CheckboxField
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                label="I agree to StarryMeet's Terms of Service and Privacy Policy."
                required
              />
            </div>
          </FormSection>

          {/* Buttons */}
          <div className="flex justify-between pt-8 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-lg border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-all"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="bg-[#D4A574] text-black px-12 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Submit Application for Review
            </button>
          </div>
        </form>
      </div>

      <FooterVanilla />
    </div>
  );
};
