"use client";

import { useEffect, useRef } from "react";

type Bokeh = {
  x: number;
  y: number;
  r: number;
  alpha: number;
  alphaSpeed: number;
  vx: number;
  vy: number;
  hue: number; // slight warmth variation
};

export default function LensBokehBg({ opacity = 0.18 }: { opacity?: number }) {
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

    const COUNT = 22;
    const bokeh: Bokeh[] = [];

    // Spread across the full height of page — concentrate near edges
    for (let i = 0; i < COUNT; i++) {
      // Bias bokeh toward left/right edges
      const side = Math.random();
      let x: number;
      if (side < 0.35) {
        x = Math.random() * canvas.width * 0.18;
      } else if (side > 0.65) {
        x = canvas.width * 0.82 + Math.random() * canvas.width * 0.18;
      } else {
        x = Math.random() * canvas.width;
      }

      bokeh.push({
        x,
        y: Math.random() * canvas.height,
        r: 18 + Math.random() * 52,
        alpha: Math.random() * opacity * 0.7,
        alphaSpeed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.12,
        hue: Math.random(), // 0 = cool white, 1 = warm orange tint
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const b of bokeh) {
        // Drift
        b.x += b.vx;
        b.y += b.vy;

        // Bounce at edges
        if (b.x < -b.r) b.x = canvas.width + b.r;
        if (b.x > canvas.width + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = canvas.height + b.r;
        if (b.y > canvas.height + b.r) b.y = -b.r;

        // Pulse alpha
        b.alpha += b.alphaSpeed;
        if (b.alpha > opacity * 0.85) b.alphaSpeed *= -1;
        if (b.alpha < 0.002) b.alphaSpeed *= -1;

        // Bokeh: radial gradient circle with ring edge
        const r = Math.abs(b.r);

        // Outer glow
        const grd = ctx.createRadialGradient(b.x, b.y, r * 0.3, b.x, b.y, r);
        if (b.hue > 0.6) {
          // warm orange-ish bokeh
          grd.addColorStop(0, `rgba(253,147,70,${b.alpha * 0.4})`);
          grd.addColorStop(0.7, `rgba(253,127,44,${b.alpha * 0.15})`);
          grd.addColorStop(1, `rgba(253,127,44,0)`);
        } else {
          // cool white/blue bokeh
          grd.addColorStop(0, `rgba(200,210,255,${b.alpha * 0.35})`);
          grd.addColorStop(0.7, `rgba(129,140,248,${b.alpha * 0.12})`);
          grd.addColorStop(1, `rgba(99,102,241,0)`);
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Crisp ring edge (like real bokeh)
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = b.hue > 0.6
          ? `rgba(253,127,44,${b.alpha * 0.5})`
          : `rgba(129,140,248,${b.alpha * 0.4})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
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
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
