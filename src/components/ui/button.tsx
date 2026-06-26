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
        'inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe6a7]/70 disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'border-[#fff2be]/40 bg-[linear-gradient(180deg,#fff3c7,#e7be66)] text-[#1b1307] shadow-[0_20px_55px_rgba(247,216,137,0.28)] hover:-translate-y-0.5 hover:brightness-105',
        variant === 'secondary' && 'border-white/15 bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/[0.12]',
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
