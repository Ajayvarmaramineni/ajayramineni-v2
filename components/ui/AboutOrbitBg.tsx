"use client";

import { useEffect, useRef } from "react";

type Ring = {
  cx: number;
  cy: number;
  radius: number;
  angle: number;
  speed: number;
  dotCount: number;
  color: string;
  alpha: number;
};

export default function AboutOrbitBg({ opacity = 0.22 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Orbital ring clusters — two anchor points
    const rings: Ring[] = [];
    const anchors = [
      { x: canvas.width * 0.12, y: canvas.height * 0.25 },
      { x: canvas.width * 0.88, y: canvas.height * 0.65 },
    ];

    const colors = [
      `rgba(253,127,44,`,   // orange
      `rgba(99,102,241,`,   // indigo
      `rgba(253,147,70,`,   // light orange
    ];

    anchors.forEach((anchor, ai) => {
      for (let i = 0; i < 4; i++) {
        rings.push({
          cx: anchor.x,
          cy: anchor.y,
          radius: 55 + i * 38 + ai * 20,
          angle: Math.random() * Math.PI * 2,
          speed: (0.0018 + Math.random() * 0.0012) * (i % 2 === 0 ? 1 : -1),
          dotCount: 1 + Math.floor(i / 2),
          color: colors[(ai + i) % colors.length],
          alpha: opacity * (0.8 - i * 0.12),
        });
      }
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const ring of rings) {
        // Update anchor positions relative to canvas size (responsive)
        ring.angle += ring.speed;

        // Draw faint ring circle
        ctx.beginPath();
        ctx.arc(ring.cx, ring.cy, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${ring.color}${ring.alpha * 0.25})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Draw orbiting dots
        for (let d = 0; d < ring.dotCount; d++) {
          const a = ring.angle + (d * Math.PI * 2) / ring.dotCount;
          const dx = ring.cx + Math.cos(a) * ring.radius;
          const dy = ring.cy + Math.sin(a) * ring.radius;

          // Glow
          const grd = ctx.createRadialGradient(dx, dy, 0, dx, dy, 5);
          grd.addColorStop(0, `${ring.color}${ring.alpha})`);
          grd.addColorStop(1, `${ring.color}0)`);
          ctx.beginPath();
          ctx.arc(dx, dy, 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `${ring.color}${ring.alpha * 1.4})`;
          ctx.fill();
        }
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
