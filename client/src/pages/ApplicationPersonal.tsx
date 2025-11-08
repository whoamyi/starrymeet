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

interface PersonalFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  yourStory: string;
  whatTheyMean: string;
  whyNow: string;
  meetingVision: string;
  yourCase: string;
  additionalContext: string;
  instagramUrl: string;
  personalLinks: string;
  agreeToReview: boolean;
  agreeToPayment: boolean;
  agreeToTruthfulness: boolean;
  agreeToTerms: boolean;
}

export const ApplicationPersonal = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const [formData, setFormData] = useState<PersonalFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    yourStory: '',
    whatTheyMean: '',
    whyNow: '',
    meetingVision: '',
    yourCase: '',
    additionalContext: '',
    instagramUrl: '',
    personalLinks: '',
    agreeToReview: false,
    agreeToPayment: false,
    agreeToTruthfulness: false,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PersonalFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Partial<Record<keyof PersonalFormData, string>> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.yourStory || formData.yourStory.length < 300) {
      newErrors.yourStory = 'Please share at least 300 characters about yourself';
    }
    if (!formData.whatTheyMean || formData.whatTheyMean.length < 250) {
      newErrors.whatTheyMean = 'Please share at least 250 characters';
    }
    if (!formData.whyNow || formData.whyNow.length < 150) {
      newErrors.whyNow = 'Please share at least 150 characters';
    }
    if (!formData.meetingVision || formData.meetingVision.length < 200) {
      newErrors.meetingVision = 'Please share at least 200 characters';
    }
    if (!formData.yourCase || formData.yourCase.length < 200) {
      newErrors.yourCase = 'Please share at least 200 characters';
    }
    if (!formData.agreeToReview) newErrors.agreeToReview = 'Required';
    if (!formData.agreeToPayment) newErrors.agreeToPayment = 'Required';
    if (!formData.agreeToTruthfulness) newErrors.agreeToTruthfulness = 'Required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Submit to API
    try {
      await applicationApi.submitPersonal({
        celebritySlug: slug!,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        yourStory: formData.yourStory,
        whatTheyMean: formData.whatTheyMean,
        whyNow: formData.whyNow,
        meetingVision: formData.meetingVision,
        yourCase: formData.yourCase,
        additionalContext: formData.additionalContext,
        instagramUrl: formData.instagramUrl,
        personalLinks: formData.personalLinks,
      });

      navigate(`/apply/${slug}/confirmation`, {
        state: { applicationType: 'personal' }
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
            💫 Personal Meeting
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">
            Share Your Story
          </h1>
          <p className="text-lg text-gray-600">
            Tell us about yourself, what this celebrity means to you, and why this meeting would be meaningful.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section A: About You */}
          <FormSection
            title="About You"
            subtitle="Tell us who you are as a person"
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
                label="Phone (Optional)"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <TextareaWithCounter
              label="Your Story"
              required
              value={formData.yourStory}
              onChange={(e) => setFormData({ ...formData, yourStory: e.target.value })}
              maxLength={2500}
              helpText="Tell us about yourself as a person. Who are you? Where are you from? What matters to you in life? Share what makes you, you. There's no need for impressive credentials here—just be authentic."
              error={errors.yourStory}
            />
          </FormSection>

          {/* Section B: Why This Meeting Matters */}
          <FormSection
            title="Why This Meeting Matters"
            subtitle="Share from your heart"
          >
            <TextareaWithCounter
              label="What This Celebrity Means to You"
              required
              value={formData.whatTheyMean}
              onChange={(e) => setFormData({ ...formData, whatTheyMean: e.target.value })}
              maxLength={2000}
              helpText="Why does this celebrity matter to you personally? How have they impacted your life? This is your chance to be honest about what they mean to you."
              error={errors.whatTheyMean}
            />

            <TextareaWithCounter
              label="Why Now?"
              required
              value={formData.whyNow}
              onChange={(e) => setFormData({ ...formData, whyNow: e.target.value })}
              maxLength={1250}
              helpText="Why is this meeting important to you at this moment in your life? Is there a personal milestone, challenge, or dream that makes this timing meaningful?"
              error={errors.whyNow}
            />
          </FormSection>

          {/* Section C: What You'd Hope to Talk About */}
          <FormSection
            title="What You'd Hope to Talk About"
            subtitle="Imagine the conversation"
          >
            <TextareaWithCounter
              label="Your Meeting Vision"
              required
              value={formData.meetingVision}
              onChange={(e) => setFormData({ ...formData, meetingVision: e.target.value })}
              maxLength={1500}
              helpText="If this celebrity chose to meet you, what would you hope to talk about? What would make this meeting meaningful for you? There's no wrong answer—just be genuine."
              error={errors.meetingVision}
            />
          </FormSection>

          {/* Section D: Why You Should Be Chosen */}
          <FormSection
            title="Why You Should Be Chosen"
            subtitle="What makes your story unique"
          >
            <TextareaWithCounter
              label="Your Case"
              required
              value={formData.yourCase}
              onChange={(e) => setFormData({ ...formData, yourCase: e.target.value })}
              maxLength={1500}
              helpText="This celebrity receives many meeting requests from wonderful people. Tell us what makes your story or situation unique. Why should you be selected? Don't worry about sounding 'impressive'—sincerity and authenticity matter most."
              error={errors.yourCase}
            />

            <TextareaWithCounter
              label="Additional Context (Optional)"
              value={formData.additionalContext}
              onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
              maxLength={1000}
              helpText="Is there anything else about your situation, story, or motivation that would help understand why this meeting matters?"
            />
          </FormSection>

          {/* Section E: Social Proof */}
          <FormSection title="Personal Links (Optional, But Helpful)">
            <p className="text-gray-600 mb-4 italic">
              These are optional, but sharing a bit about your online presence helps see you as a real person with a genuine story.
            </p>

            <TextInput
              label="Instagram or Social Media Profile"
              type="url"
              value={formData.instagramUrl}
              onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              placeholder="https://instagram.com/yourprofile"
            />

            <TextInput
              label="Blog, YouTube, or Personal Website"
              type="url"
              value={formData.personalLinks}
              onChange={(e) => setFormData({ ...formData, personalLinks: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </FormSection>

          {/* Section F: Declaration */}
          <FormSection title="Declaration">
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <CheckboxField
                checked={formData.agreeToReview}
                onChange={(e) => setFormData({ ...formData, agreeToReview: e.target.checked })}
                label="I understand my application will be reviewed based on personal story and genuine connection, and approval is not guaranteed."
                required
              />
              <CheckboxField
                checked={formData.agreeToPayment}
                onChange={(e) => setFormData({ ...formData, agreeToPayment: e.target.checked })}
                label="I understand payment is only required if my application is approved."
                required
              />
              <CheckboxField
                checked={formData.agreeToTruthfulness}
                onChange={(e) => setFormData({ ...formData, agreeToTruthfulness: e.target.checked })}
                label="I promise that everything I've shared is true and from the heart."
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
              Submit Application
            </button>
          </div>
        </form>
      </div>

      <FooterVanilla />
    </div>
  );
};
