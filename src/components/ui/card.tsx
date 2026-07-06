import * as React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[34px] border border-slate-400/15 bg-slate-950/60 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl',
        className,
      )}
      {...props}
    />
  );
}
