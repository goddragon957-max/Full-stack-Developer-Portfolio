import { cn } from '../../lib/utils';

type BorderBeamProps = {
  className?: string;
  delay?: number;
  reverse?: boolean;
};

export function BorderBeam({ className, delay = 0, reverse = false }: BorderBeamProps) {
  return (
    <span
      className={cn('border-beam', reverse && 'reverse', className)}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    />
  );
}

type ShineProps = {
  children: string;
  className?: string;
};

export function ShimmerText({ children, className }: ShineProps) {
  return <span className={cn('shimmer-text', className)}>{children}</span>;
}

export function AnimatedGrid() {
  return <div className="animated-grid" aria-hidden="true" />;
}
