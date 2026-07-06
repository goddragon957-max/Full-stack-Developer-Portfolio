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
        'inline-flex items-center justify-center gap-2 rounded-full border font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40 disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'border-cyan-300/50 bg-cyan-300 text-slate-950 shadow-[0_18px_44px_rgba(34,211,238,0.25)] hover:-translate-y-0.5 hover:bg-cyan-200',
        variant === 'secondary' && 'border-slate-500/35 bg-slate-950/45 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-slate-900/80',
        variant === 'ghost' && 'border-transparent bg-transparent text-slate-300 hover:bg-white/8 hover:text-white',
        size === 'sm' && 'h-9 px-4 text-xs',
        size === 'md' && 'h-11 px-5 text-sm',
        size === 'lg' && 'h-13 min-h-[52px] px-6 text-base',
        className,
      )}
      {...props}
    />
  );
}
