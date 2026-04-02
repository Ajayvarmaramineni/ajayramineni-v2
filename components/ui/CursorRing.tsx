"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorRing() {
  const ringRef  = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLDivElement>(null);
  const pos      = useRef({ x: -100, y: -100 });   // start off-screen — no flicker at (0,0)
  const ringPos  = useRef({ x: -100, y: -100 });
  const raf      = useRef<number>(0);
  const [hovered, setHovered]   = useState(false);
  const [visible, setVisible]   = useState(false);  // hide until first mousemove

  useEffect(() => {
    // Don't run on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Move the dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      // Show custom cursor on first move
      if (!visible) setVisible(true);

      // Expand ring over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [role='button'], input, textarea, select, label");
      setHovered(!!isInteractive);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    // Smooth lag loop for the ring
    const loop = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    document.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    raf.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf.current);
    };
  }, [visible]);

  return (
    <>
      {/* Trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          width:           hovered ? 36 : 20,
          height:          hovered ? 36 : 20,
          marginLeft:      hovered ? -18 : -10,
          marginTop:       hovered ? -18 : -10,
          borderRadius:    "50%",
          border:          `1.5px solid ${hovered ? "#FD7F2C" : "rgba(253,127,44,0.5)"}`,
          backgroundColor: hovered ? "rgba(253,127,44,0.08)" : "transparent",
          pointerEvents:   "none",
          zIndex:          9999,
          opacity:         visible ? 1 : 0,
          transition:      "width 0.18s ease, height 0.18s ease, margin 0.18s ease, border-color 0.18s ease, background-color 0.18s ease, opacity 0.15s ease",
          willChange:      "transform",
        }}
      />

      {/* Instant dot — always follows cursor precisely */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          width:           5,
          height:          5,
          marginLeft:      -2.5,
          marginTop:       -2.5,
          borderRadius:    "50%",
          backgroundColor: "#FD7F2C",
          pointerEvents:   "none",
          zIndex:          10000,
          opacity:         visible ? 1 : 0,
          transition:      "opacity 0.15s ease",
          willChange:      "transform",
        }}
      />
    </>
  );
}
