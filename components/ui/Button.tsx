import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'browse-templates';
  size?: 'default' | 'large';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', className, children, ...props }, ref) => {
    const baseStyles = 'font-medium font-[var(--font-family-sans)] cursor-pointer transition-all duration-300 rounded-[50px] border-none';
    
    const variants = {
      primary: 'bg-[var(--color-accent-terracotta)] text-white shadow-[0_4px_20px_rgba(201,125,96,0.2)] hover:translate-y-[-2px] hover:shadow-[0_6px_30px_rgba(201,125,96,0.3)] hover:bg-[#b86f55]',
      secondary: 'bg-transparent text-[var(--color-warm-brown)] border-2 border-[var(--color-warm-brown)] hover:bg-[var(--color-warm-brown)] hover:text-white hover:translate-y-[-2px]',
      'browse-templates': 'bg-[var(--color-accent-terracotta)] text-white shadow-[0_4px_20px_rgba(201,125,96,0.2)] hover:translate-y-[-2px] hover:shadow-[0_6px_30px_rgba(201,125,96,0.3)] hover:bg-[#b86f55] sm:w-full sm:bg-transparent sm:text-[var(--color-warm-brown)] sm:border-2 sm:border-[var(--color-warm-brown)] sm:shadow-none sm:hover:bg-[var(--color-warm-brown)] sm:hover:text-white sm:hover:shadow-none',
    };
    
    const sizes = {
      default: 'px-6 py-2.5 text-base',
      large: 'px-12 py-5 text-lg',
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
