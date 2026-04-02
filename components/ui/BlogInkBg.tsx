"use client";

import { useEffect, useRef } from "react";

type Glyph = {
  x: number;
  y: number;
  char: string;
  alpha: number;
  alphaTarget: number;
  alphaSpeed: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
};

const CHARS = [
  '"', '"', "'", "—", ".", ",", ";", ":", "…",
  "¶", "§", "*", "~", "/", "\\", "|",
  "a", "e", "i", "t", "s", "n", "o",
];

export default function BlogInkBg({ opacity = 0.2 }: { opacity?: number }) {
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

    const COUNT = 32;
    const glyphs: Glyph[] = [];

    for (let i = 0; i < COUNT; i++) {
      const alpha = opacity * (0.15 + Math.random() * 0.5);
      glyphs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        alpha,
        alphaTarget: opacity * (0.1 + Math.random() * 0.6),
        alphaSpeed: 0.0008 + Math.random() * 0.001,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.14,
        size: 10 + Math.random() * 18,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.003,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const g of glyphs) {
        // Drift
        g.x += g.vx;
        g.y += g.vy;
        g.rotation += g.rotSpeed;

        // Wrap edges
        if (g.x < -30) g.x = canvas.width + 30;
        if (g.x > canvas.width + 30) g.x = -30;
        if (g.y < -30) g.y = canvas.height + 30;
        if (g.y > canvas.height + 30) g.y = -30;

        // Fade pulse
        if (Math.abs(g.alpha - g.alphaTarget) < 0.002) {
          g.alphaTarget = opacity * (0.08 + Math.random() * 0.55);
        }
        g.alpha += (g.alphaTarget - g.alpha) * g.alphaSpeed * 60;

        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.rotation);
        ctx.globalAlpha = Math.max(0, g.alpha);
        ctx.fillStyle = Math.random() > 0.992
          ? `rgba(253,127,44,1)`  // occasional orange flash
          : `rgba(161,161,170,1)`;
        ctx.font = `${g.size}px "Georgia", serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(g.char, 0, 0);
        ctx.restore();
      }

      ctx.globalAlpha = 1;
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
