import type { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const TextInput = ({ label, required, error, helpText, ...props }: TextInputProps) => (
  <div>
    <label className="block text-black font-semibold mb-2">
      {label} {required && <span className="text-[#D4A574]">*</span>}
    </label>
    <input
      type="text"
      className={`w-full p-4 border-2 rounded-lg focus:outline-none transition-colors ${
        error ? 'border-red-500' : 'border-gray-200 focus:border-black'
      }`}
      {...props}
    />
    {helpText && (
      <p className="text-sm text-gray-500 mt-1">{helpText}</p>
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
