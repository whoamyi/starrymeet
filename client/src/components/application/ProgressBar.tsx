interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const steps = [
    { number: 1, label: 'Meeting Type' },
    { number: 2, label: 'Application' },
    { number: 3, label: 'Confirmation' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  step.number <= currentStep
                    ? 'bg-gradient-to-r from-[#C6A34F] to-[#D4A574] text-black shadow-lg shadow-[#C6A34F]/25'
                    : 'bg-gray-900 border border-gray-700/50 text-gray-500'
                }`}
              >
                {step.number < currentStep ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={`text-xs mt-2 transition-colors ${
                step.number <= currentStep ? 'text-white font-medium' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 mb-6 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    step.number < currentStep
                      ? 'bg-gradient-to-r from-[#C6A34F] to-[#D4A574] w-full'
                      : 'w-0'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
