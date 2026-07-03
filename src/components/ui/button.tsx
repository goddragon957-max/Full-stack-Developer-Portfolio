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
        'inline-flex items-center justify-center gap-2 rounded-full border font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b4642]/40 disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'border-[#5f3f3b] bg-[#5f3f3b] text-[#fffaf3] shadow-[0_16px_34px_rgba(95,63,59,0.18)] hover:-translate-y-0.5 hover:bg-[#4d3431]',
        variant === 'secondary' && 'border-[#5f3f3b]/25 bg-[#fffaf3] text-[#5f3f3b] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] hover:-translate-y-0.5 hover:bg-[#f2eadf]',
        variant === 'ghost' && 'border-transparent bg-transparent text-[#5f3f3b]/75 hover:bg-[#5f3f3b]/8 hover:text-[#5f3f3b]',
        size === 'sm' && 'h-9 px-4 text-xs',
        size === 'md' && 'h-11 px-5 text-sm',
        size === 'lg' && 'h-13 min-h-[52px] px-6 text-base',
        className,
      )}
      {...props}
    />
  );
}
