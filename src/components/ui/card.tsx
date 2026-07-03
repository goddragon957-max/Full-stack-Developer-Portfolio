import * as React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[34px] border border-[#6a4540]/15 bg-[#fffaf3] shadow-[0_20px_60px_rgba(87,62,54,0.08)]',
        className,
      )}
      {...props}
    />
  );
}
