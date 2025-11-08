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
      newErrors.yourStory = 'Please share at least 300 characters';
    }
    if (!formData.whatTheyMean || formData.whatTheyMean.length < 200) {
      newErrors.whatTheyMean = 'Please share at least 200 characters';
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
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <ProgressBar currentStep={2} totalSteps={3} />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-4xl">💫</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Personal Application
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Share your story from the heart. This is your chance to express why this meeting matters to you personally. Be authentic, genuine, and speak from your truth.
          </p>
        </div>

        {/* Form Container */}
        <div className="relative group mb-8">
          {/* Subtle glow effect */}
          <div className="absolute -inset-px bg-gradient-to-r from-[#C6A34F]/20 to-[#D4A574]/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition duration-500"></div>

          {/* Main Form Card */}
          <div className="relative bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6 md:p-10 shadow-2xl">
            {/* Inner glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C6A34F]/30 to-transparent"></div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* About You */}
              <FormSection
                title="About You"
                subtitle="Help us get to know you"
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
                  label="Your Story"
                  required
                  value={formData.yourStory}
                  onChange={(e) => setFormData({ ...formData, yourStory: e.target.value })}
                  maxLength={2500}
                  helpText="Tell us about yourself as a person. Who are you? Where are you from? What matters to you in life? Share what makes you, you. There's no need for impressive credentials here—just be authentic."
                  error={errors.yourStory}
                />
              </FormSection>

              {/* Why This Meeting Matters */}
              <FormSection
                title="Why This Meeting Matters"
                subtitle="Share what's in your heart"
              >
                <TextareaWithCounter
                  label="What This Person Means to You"
                  required
                  value={formData.whatTheyMean}
                  onChange={(e) => setFormData({ ...formData, whatTheyMean: e.target.value })}
                  maxLength={2000}
                  helpText="How has this person influenced your life? What impact have they had on you? This is your chance to share how they've inspired you, helped you through tough times, or shaped who you are today."
                  error={errors.whatTheyMean}
                />

                <TextareaWithCounter
                  label="Why This Meeting Matters Now"
                  required
                  value={formData.whyNow}
                  onChange={(e) => setFormData({ ...formData, whyNow: e.target.value })}
                  maxLength={1250}
                  helpText="Why is this moment important? Is there something specific happening in your life? A milestone, challenge, or dream that makes this meeting meaningful right now?"
                  error={errors.whyNow}
                />
              </FormSection>

              {/* Meeting Vision */}
              <FormSection
                title="Meeting Vision"
                subtitle="What would this mean to you"
              >
                <TextareaWithCounter
                  label="How You Imagine This Meeting"
                  required
                  value={formData.meetingVision}
                  onChange={(e) => setFormData({ ...formData, meetingVision: e.target.value })}
                  maxLength={1500}
                  helpText="Paint us a picture. What would you want to talk about? What questions would you ask? What would it mean to you to have this conversation? Be as specific or as dreamlike as you'd like."
                  error={errors.meetingVision}
                />
              </FormSection>

              {/* Why You Should Be Chosen */}
              <FormSection
                title="Why You Should Be Chosen"
                subtitle="Make your case"
              >
                <TextareaWithCounter
                  label="Why Your Story Stands Out"
                  required
                  value={formData.yourCase}
                  onChange={(e) => setFormData({ ...formData, yourCase: e.target.value })}
                  maxLength={1500}
                  helpText="Among many people who admire this person, why should you get this opportunity? What makes your connection unique? What would this meeting mean to your life? Be honest and compelling."
                  error={errors.yourCase}
                />

                <TextareaWithCounter
                  label="Anything Else We Should Know?"
                  value={formData.additionalContext}
                  onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                  maxLength={1000}
                  helpText="Is there anything else you'd like to share? Any context, background, or details that would help us understand your story better?"
                />
              </FormSection>

              {/* Personal Links (Optional) */}
              <FormSection
                title="Personal Links"
                subtitle="Optional - help us see your world"
              >
                <TextInput
                  label="Instagram Profile"
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/yourprofile"
                  helpText="Share a glimpse into your life (completely optional)"
                />

                <TextInput
                  label="Other Links"
                  value={formData.personalLinks}
                  onChange={(e) => setFormData({ ...formData, personalLinks: e.target.value })}
                  placeholder="Blog, YouTube, TikTok, or anything that shows who you are"
                  helpText="Any other links that would help tell your story (optional)"
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
                    label="I promise that everything I've shared is true and from the heart"
                    required
                    checked={formData.agreeToTruthfulness}
                    onChange={(e) => setFormData({ ...formData, agreeToTruthfulness: e.target.checked })}
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
                  className="px-8 py-4 bg-gradient-to-r from-[#C6A34F] to-[#D4A574] text-black font-semibold rounded-xl hover:from-[#D4A574] hover:to-[#C6A34F] transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-[#C6A34F]/25"
                >
                  Submit Personal Application →
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
