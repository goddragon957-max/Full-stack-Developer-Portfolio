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
        'inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'border-cyan-200/50 bg-[linear-gradient(135deg,#e0f2fe,#7dd3fc_44%,#a78bfa)] text-slate-950 shadow-[0_22px_70px_rgba(125,211,252,0.24)] hover:-translate-y-0.5 hover:brightness-110',
        variant === 'secondary' && 'border-white/12 bg-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-white/[0.11]',
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
