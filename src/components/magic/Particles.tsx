import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
};

type Props = {
  className?: string;
  quantity?: number;
  color?: string;
};

const rgba = (hex: string, alpha: number) => {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((item) => item + item).join('') : value;
  const num = Number.parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function Particles({ className, quantity = 96, color = '#7dd3fc' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;
    const particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.length = 0;
      for (let i = 0; i < quantity; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          alpha: 0.18 + Math.random() * 0.62,
          size: 0.6 + Math.random() * 1.8,
        });
      }
    };

    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createRadialGradient(width * 0.62, height * 0.28, 0, width * 0.62, height * 0.28, width * 0.72);
      gradient.addColorStop(0, 'rgba(125, 211, 252, 0.13)');
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.06)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx + Math.sin((frame + p.y) * 0.004) * 0.06;
        p.y += p.vy + Math.cos((frame + p.x) * 0.004) * 0.06;
        if (p.x < -8) p.x = width + 8;
        if (p.x > width + 8) p.x = -8;
        if (p.y < -8) p.y = height + 8;
        if (p.y > height + 8) p.y = -8;

        ctx.beginPath();
        ctx.fillStyle = rgba(color, p.alpha);
        ctx.globalAlpha = p.alpha;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [color, quantity]);

  return <canvas ref={canvasRef} className={cn('particles-canvas', className)} aria-hidden="true" />;
}
