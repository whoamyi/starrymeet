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
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label} {required && <span className="text-[#D4A574]">*</span>}
    </label>
    <textarea
      value={value}
      maxLength={maxLength}
      rows={8}
      className={`w-full px-4 py-3 bg-black/40 border ${
        error ? 'border-red-500/50' : 'border-gray-700/50'
      } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C6A34F] focus:bg-black/60 transition-all duration-300 resize-none`}
      {...props}
    />
    {helpText && (
      <div className="bg-gray-900/30 border-l-2 border-[#D4A574] p-3 rounded-r-lg mt-2">
        <p className="text-xs text-gray-400 italic leading-relaxed">{helpText}</p>
      </div>
    )}
    <div className="flex justify-between items-center mt-2">
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <p className={`text-sm ml-auto ${
        value.length > maxLength * 0.9 ? 'text-[#D4A574] font-medium' : 'text-gray-500'
      }`}>
        {value.length} / {maxLength}
      </p>
    </div>
  </div>
);
