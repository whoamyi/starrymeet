import type { InputHTMLAttributes } from 'react';

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export const CheckboxField = ({ label, required, ...props }: CheckboxFieldProps) => (
  <label className="flex gap-3 items-start cursor-pointer group">
    <input
      type="checkbox"
      className="w-5 h-5 mt-1 cursor-pointer accent-black"
      {...props}
    />
    <span className="text-gray-700 group-hover:text-black transition-colors">
      {label} {required && <span className="text-[#D4A574]">*</span>}
    </span>
  </label>
);
