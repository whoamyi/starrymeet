import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HeaderVanilla, FooterVanilla } from '@/components';
import { ProgressBar } from '@/components/application';

interface PathCardProps {
  icon: string;
  label: string;
  title: string;
  description: string;
  examples: string[];
  emphasis: string;
  isSelected: boolean;
  onSelect: () => void;
}

const PathCard = ({
  icon,
  label,
  title,
  description,
  examples,
  emphasis,
  isSelected,
  onSelect,
}: PathCardProps) => (
  <div
    onClick={onSelect}
    className={`p-8 rounded-xl cursor-pointer transition-all border-3 ${
      isSelected
        ? 'border-black bg-gray-50 shadow-lg scale-[1.02]'
        : 'border-gray-200 hover:border-gray-400'
    }`}
  >
    <div className="text-5xl mb-4">{icon}</div>
    <div className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
      {label}
    </div>
    <h2 className="text-2xl font-bold text-black mb-4">{title}</h2>
    <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>

    <div className="bg-white p-4 rounded-lg mb-4">
      <p className="text-sm font-semibold text-black mb-3">Perfect for requests like:</p>
      <ul className="space-y-2">
        {examples.map((example, idx) => (
          <li key={idx} className="flex gap-2 text-sm text-gray-700">
            <span className="text-black">•</span>
            <span>{example}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-black">
      <p className="text-sm text-gray-700">
        <strong className="text-black">This path emphasizes:</strong> {emphasis}
      </p>
    </div>
  </div>
);

export const MeetingTypeSelection = () => {
  const [selectedPath, setSelectedPath] = useState<'professional' | 'personal' | null>(null);
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const handleContinue = () => {
    if (!selectedPath) {
      alert('Please select a meeting type to continue.');
      return;
    }

    navigate(`/apply/${slug}/${selectedPath}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderVanilla />
      <ProgressBar currentStep={1} totalSteps={3} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-16 px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            What brings you to meet this celebrity?
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Help us understand the nature of your request so we can guide you through
            the right application process.
          </p>
        </div>

        {/* Path Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PathCard
            icon="💼"
            label="FOR WORK & CAREER"
            title="Professional Connection"
            description="You're seeking to meet for professional reasons that advance your work, career, or shared causes."
            examples={[
              'Career mentorship or professional advice',
              'Business collaboration or partnership',
              'Advocacy or cause-related work',
              'Creative or industry guidance',
            ]}
            emphasis="Your professional background, credentials, current projects, and what you're working toward."
            isSelected={selectedPath === 'professional'}
            onSelect={() => setSelectedPath('professional')}
          />

          <PathCard
            icon="💫"
            label="FOR PERSONAL REASONS"
            title="Personal Connection"
            description="You're seeking to meet for personal reasons that reflect their impact on your life and journey."
            examples={[
              'Lifelong admiration and fan connection',
              'Personal inspiration or life impact',
              'Celebrating a milestone',
              'Sharing how they have influenced your journey',
            ]}
            emphasis="Your personal story, what they mean to you, and why this moment in your life is meaningful."
            isSelected={selectedPath === 'personal'}
            onSelect={() => setSelectedPath('personal')}
          />
        </div>

        {/* Equal Respect Note */}
        <div className="text-center mt-12 p-6 bg-gray-50 rounded-lg max-w-3xl mx-auto">
          <p className="text-gray-700">
            <strong className="text-black">Both paths are treated with equal respect and consideration.</strong>
            <br />
            Choose the one that best reflects your true motivation for this meeting.
          </p>
        </div>

        {/* Continue Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleContinue}
            disabled={!selectedPath}
            className="bg-[#D4A574] text-black px-12 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Application →
          </button>
        </div>
      </div>

      <FooterVanilla />
    </div>
  );
};
