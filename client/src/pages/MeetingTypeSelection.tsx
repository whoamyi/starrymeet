import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, BottomNav } from '@/components';
import { ProgressBar } from '@/components/application';

export const MeetingTypeSelection = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<'professional' | 'personal' | null>(null);

  const handleContinue = () => {
    if (!selectedPath) {
      alert('Please select a meeting type to continue.');
      return;
    }
    navigate(`/apply/${slug}/${selectedPath}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 pb-24">
        <ProgressBar currentStep={1} totalSteps={3} />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Choose Your Meeting Path
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the type of meeting that best describes your purpose. Each path has tailored questions to help you make the strongest case.
          </p>
        </div>

        {/* Path Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Professional Path */}
          <button
            onClick={() => setSelectedPath('professional')}
            className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedPath === 'professional'
                ? 'border-[rgba(255, 255, 255, 0.8)] bg-gradient-to-br from-[rgba(255, 255, 255, 0.8)]/10 to-transparent'
                : 'border-gray-800 hover:border-gray-700 bg-gray-900/30'
            }`}
          >
            {/* Glow effect when selected */}
            {selectedPath === 'professional' && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.8)] rounded-2xl opacity-20 blur-xl"></div>
            )}

            <div className="relative">
              {/* Icon and Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`text-5xl transition-transform duration-300 ${
                  selectedPath === 'professional' ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  💼
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    Professional Meeting
                    {selectedPath === 'professional' && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(255, 255, 255, 0.8)] text-black">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Business, collaboration, or career opportunities
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-300">
                  Perfect if you're looking to discuss:
                </p>
                <ul className="space-y-2">
                  {[
                    'Business partnerships or collaborations',
                    'Industry insights and expertise',
                    'Career mentorship or guidance',
                    'Professional project opportunities'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-[rgba(255, 255, 255, 0.8)] mt-0.5">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emphasis */}
              <div className="bg-black/40 border border-gray-700/30 rounded-lg p-3">
                <p className="text-xs text-gray-400 italic">
                  <span className="text-[rgba(255, 255, 255, 0.8)] font-semibold">Evaluated on:</span> Professional alignment, mutual value, and clear objectives
                </p>
              </div>
            </div>
          </button>

          {/* Personal Path */}
          <button
            onClick={() => setSelectedPath('personal')}
            className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedPath === 'personal'
                ? 'border-[rgba(255, 255, 255, 0.8)] bg-gradient-to-br from-[rgba(255, 255, 255, 0.8)]/10 to-transparent'
                : 'border-gray-800 hover:border-gray-700 bg-gray-900/30'
            }`}
          >
            {/* Glow effect when selected */}
            {selectedPath === 'personal' && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.8)] rounded-2xl opacity-20 blur-xl"></div>
            )}

            <div className="relative">
              {/* Icon and Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`text-5xl transition-transform duration-300 ${
                  selectedPath === 'personal' ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  💫
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    Personal Meeting
                    {selectedPath === 'personal' && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(255, 255, 255, 0.8)] text-black">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Personal inspiration, gratitude, or life moments
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-300">
                  Perfect if you want to share:
                </p>
                <ul className="space-y-2">
                  {[
                    'How they have inspired your life journey',
                    'A meaningful personal story or connection',
                    'Gratitude for their impact on you',
                    'A dream meeting for personal reasons'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-[rgba(255, 255, 255, 0.8)] mt-0.5">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emphasis */}
              <div className="bg-black/40 border border-gray-700/30 rounded-lg p-3">
                <p className="text-xs text-gray-400 italic">
                  <span className="text-[rgba(255, 255, 255, 0.8)] font-semibold">Evaluated on:</span> Authenticity, emotional resonance, and genuine connection
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedPath}
            className="px-8 py-3 bg-gradient-to-r from-[rgba(255, 255, 255, 0.8)] to-[rgba(255, 255, 255, 0.8)] text-black font-semibold rounded-xl hover:from-[rgba(255, 255, 255, 0.8)] hover:to-[rgba(255, 255, 255, 0.8)] transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-[rgba(255, 255, 255, 0.8)]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Continue to Application →
          </button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};
