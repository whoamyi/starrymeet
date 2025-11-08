import type { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export const TextInput = ({ label, required, error, helpText, ...props }: TextInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label} {required && <span className="text-[#D4A574]">*</span>}
    </label>
    <input
      className={`w-full px-4 py-3 bg-black/40 border ${
        error ? 'border-red-500/50' : 'border-gray-700/50'
      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C6A34F] focus:bg-black/60 transition-all duration-300`}
      {...props}
    />
    {helpText && !error && (
      <p className="mt-2 text-xs text-gray-400 italic">{helpText}</p>
    )}
    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
  </div>
);
