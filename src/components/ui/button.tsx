import * as React from 'react';
import { cn } from '../../lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c7ff5b]/70 disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'border-[#dfff8a]/50 bg-[linear-gradient(180deg,#dfff8a,#9eea33)] text-[#11150b] shadow-[0_20px_55px_rgba(174,255,77,0.22)] hover:-translate-y-0.5 hover:brightness-105',
        variant === 'secondary' && 'border-white/12 bg-white/[0.055] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/[0.1]',
        variant === 'ghost' && 'border-transparent bg-transparent text-white/72 hover:bg-white/[0.07] hover:text-white',
        size === 'sm' && 'h-9 px-4 text-xs',
        size === 'md' && 'h-11 px-5 text-sm',
        size === 'lg' && 'h-13 min-h-[52px] px-6 text-base',
        className,
      )}
      {...props}
    />
  );
}
