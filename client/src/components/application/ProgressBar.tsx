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
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex justify-between items-center relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Steps */}
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center bg-white px-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-3 transition-colors ${
                  step.number <= currentStep
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-400 border-gray-200'
                }`}
              >
                {step.number < currentStep ? '✓' : step.number}
              </div>
              <span className={`text-xs mt-2 font-medium ${
                step.number <= currentStep ? 'text-black' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
