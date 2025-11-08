import type { TextareaHTMLAttributes } from 'react';

interface TextareaWithCounterProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  value: string;
  maxLength: number;
}

export const TextareaWithCounter = ({
  label,
  required,
  error,
  helpText,
  value,
  maxLength,
  ...props
}: TextareaWithCounterProps) => (
  <div>
    <label className="block text-black font-semibold mb-2">
      {label} {required && <span className="text-[#D4A574]">*</span>}
    </label>
    <textarea
      value={value}
      maxLength={maxLength}
      rows={8}
      className={`w-full p-4 border-2 rounded-lg focus:outline-none transition-colors ${
        error ? 'border-red-500' : 'border-gray-200 focus:border-black'
      }`}
      {...props}
    />
    {helpText && (
      <div className="bg-gray-50 p-4 rounded-lg mt-2 border-l-4 border-black">
        <p className="text-sm text-gray-700 italic leading-relaxed">{helpText}</p>
      </div>
    )}
    <div className="flex justify-between items-center mt-2">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <p className={`text-sm ml-auto ${
        value.length > maxLength * 0.9 ? 'text-red-500 font-medium' : 'text-gray-500'
      }`}>
        {value.length} / {maxLength} characters
      </p>
    </div>
  </div>
);
