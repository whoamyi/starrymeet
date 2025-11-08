import type { InputHTMLAttributes } from 'react';

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export const CheckboxField = ({ label, required, ...props }: CheckboxFieldProps) => (
  <label className="flex gap-3 items-start cursor-pointer group">
    <input
      type="checkbox"
      className="w-5 h-5 mt-0.5 cursor-pointer bg-gray-900 border-gray-700/50 rounded focus:ring-[#D4A574] focus:ring-2 text-[#D4A574] transition-all duration-300"
      {...props}
    />
    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
      {label} {required && <span className="text-[#D4A574]">*</span>}
    </span>
  </label>
);
