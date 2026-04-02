"use client";

import { useEffect, useRef } from "react";

type Bar = {
  x: number;
  targetH: number;
  currentH: number;
  speed: number;
  color: string;
  alpha: number;
  phase: number;
};

type Particle = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vy: number;
  color: string;
};

export default function WorkGridBg({ opacity = 0.2 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Subtle dot grid
    const GRID_SIZE = 44;

    // Rising bar chart columns along bottom
    const barCount = 14;
    const bars: Bar[] = Array.from({ length: barCount }, (_, i) => ({
      x: (canvas.width / (barCount + 1)) * (i + 1),
      targetH: 30 + Math.random() * 120,
      currentH: 0,
      speed: 0.4 + Math.random() * 0.4,
      color: i % 3 === 0 ? `rgba(253,127,44,` : `rgba(99,102,241,`,
      alpha: opacity * (0.5 + Math.random() * 0.5),
      phase: Math.random() * Math.PI * 2,
    }));

    // Floating sparkle particles (data points)
    const particles: Particle[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 1 + Math.random() * 1.5,
      alpha: opacity * (0.4 + Math.random() * 0.6),
      vy: -(0.2 + Math.random() * 0.3),
      color: Math.random() > 0.5 ? `rgba(253,127,44,` : `rgba(99,102,241,`,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.012;

      // Dot grid
      const dotAlpha = opacity * 0.18;
      for (let gx = GRID_SIZE; gx < canvas.width; gx += GRID_SIZE) {
        for (let gy = GRID_SIZE; gy < canvas.height; gy += GRID_SIZE) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99,102,241,${dotAlpha})`;
          ctx.fill();
        }
      }

      // Subtle vertical grid lines (left and right edges)
      for (let gx = GRID_SIZE; gx < canvas.width; gx += GRID_SIZE * 3) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, canvas.height);
        ctx.strokeStyle = `rgba(99,102,241,${opacity * 0.06})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Rising bars (bottom area)
      for (const bar of bars) {
        bar.targetH = 30 + Math.abs(Math.sin(t * 0.7 + bar.phase)) * 130;
        bar.currentH += (bar.targetH - bar.currentH) * 0.04;

        const barW = 3;
        const y = canvas.height - bar.currentH;

        const grad = ctx.createLinearGradient(bar.x, canvas.height, bar.x, y);
        grad.addColorStop(0, `${bar.color}0)`);
        grad.addColorStop(0.3, `${bar.color}${bar.alpha})`);
        grad.addColorStop(1, `${bar.color}${bar.alpha * 1.4})`);

        ctx.fillStyle = grad;
        ctx.fillRect(bar.x - barW / 2, y, barW, bar.currentH);

        // Top cap dot
        ctx.beginPath();
        ctx.arc(bar.x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `${bar.color}${bar.alpha * 1.8})`;
        ctx.fill();
      }

      // Floating particles
      for (const p of particles) {
        p.y += p.vy;
        p.alpha = opacity * (0.3 + 0.4 * Math.abs(Math.sin(t + p.x)));
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
