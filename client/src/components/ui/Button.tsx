import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
  href?: string;
  to?: string;
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  children,
  href,
  to,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClass = 'inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-full';

  const variantClasses = {
    primary: 'bg-[rgba(255, 255, 255, 0.8)] text-black hover:bg-[#8B6F2C]',
    secondary: 'border-2 border-[rgba(255, 255, 255, 0.8)] text-[rgba(255, 255, 255, 0.8)] hover:bg-[rgba(255, 255, 255, 0.8)] hover:text-black',
    ghost: 'text-white hover:bg-white/10',
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const combinedClassName = `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClassName}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
