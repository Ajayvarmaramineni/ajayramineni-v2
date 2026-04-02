"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import LensBokehBg from "@/components/ui/LensBokehBg";

const photos = [
  "/images/DSC02304.jpeg",
  "/images/DSC02311.jpeg",
  "/images/DSC02313.jpeg",
  "/images/DSC02317.jpeg",
  "/images/DSC02326.jpeg",
  "/images/DSC02373.jpeg",
  "/images/IMG_0409.jpg",
  "/images/IMG_0480.jpg",
  "/images/IMG_1151.jpg",
  "/images/IMG_2587.jpg",
  "/images/IMG_2759.jpg",
  "/images/IMG_3111.jpg",
  "/images/IMG_3226.jpg",
  "/images/IMG_3233.jpg",
  "/images/IMG_3267.jpg",
  "/images/IMG_4167.jpg",
  "/images/IMG_4388.jpg",
  "/images/IMG_4669.jpg",
  "/images/IMG_4705.jpg",
  "/images/IMG_5032.jpg",
  "/images/IMG_5035.jpg",
  "/images/IMG_5038.jpg",
  "/images/IMG_5144.jpg",
  "/images/IMG_6420.jpg",
  "/images/IMG_6427.jpg",
  "/images/IMG_6516-2.jpg",
  "/images/IMG_6580.jpg",
  "/images/IMG_7783.jpg",
  "/images/sunset.jpg",
  "/images/sil.jpg",
  "/images/shadows.jpg",
];

export default function PhotographyClient() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() =>
    setLightbox((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null)), []);
  const next = useCallback(() =>
    setLightbox((i) => (i !== null ? (i + 1) % photos.length : null)), []);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, prev, next]);

  return (
    <>
      {/* ── Bokeh bg — fixed so it spans hero + grid + instagram section ── */}
      <LensBokehBg opacity={0.34} />

      {/* ── Hero ── */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
        {/* breath: slow continuous scale in/out */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/hero.jpeg"
            alt="Photography hero"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

        {/* bottom-left text */}
        <div className="absolute bottom-10 left-8 lg:left-12">
          <h1
            className="font-display font-black uppercase text-[#f4f4f5] leading-none mb-3"
            style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "-0.03em" }}
          >
            Photography
          </h1>
          <p
            className="text-[#d4d4d8] font-mono tracking-[0.18em] uppercase"
            style={{ fontSize: "0.65rem" }}
          >
            A visual journey through landscapes, portraits &amp; everyday moments
          </p>
        </div>
      </section>

      {/* ── Tagline ── */}
      <section className="py-20 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-black uppercase text-[#f4f4f5] mb-5 leading-none"
          style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}
        >
          Moments frozen in{" "}
          <span style={{ color: "#FD7F2C" }}>light &amp; time</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-[#71717a] max-w-xl mx-auto text-[0.95rem] leading-relaxed"
        >
          Every frame is a feeling. From golden-hour silhouettes to quiet
          architectural details — these are the stories I couldn&apos;t let slip away.
        </motion.p>
      </section>

      {/* ── Masonry grid ── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-24">
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-2 space-y-2">
          {photos.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.04 }}
              className="break-inside-avoid overflow-hidden rounded-lg cursor-pointer group relative"
              onClick={() => setLightbox(i)}
            >
              <div className="relative w-full">
                <img
                  src={src}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.05]"
                  loading="lazy"
                />
                {/* hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 rounded-lg" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Instagram CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative py-24 px-6 text-center overflow-hidden"
      >
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(253,127,44,0.05) 0%, transparent 70%)" }} />

        {/* top rule */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent to-[#2a2a2a]" />

        <p className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-[#52525b] mb-6">
          Follow the journey
        </p>

        <h2
          className="font-display font-black uppercase text-[#f4f4f5] mb-10 leading-none"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
        >
          View more on Instagram
        </h2>

        <a
          href="https://www.instagram.com/ft.documentinglife?igsh=MXA1bTBucWNtaHdkbQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 border border-[#2a2a2a] rounded-full px-8 py-4 text-[#a1a1aa] hover:text-white hover:border-[#FD7F2C] transition-all duration-300 relative overflow-hidden"
        >
          {/* fill sweep on hover */}
          <span className="absolute inset-0 bg-[#FD7F2C]/0 group-hover:bg-[#FD7F2C]/8 transition-all duration-300 rounded-full" />

          {/* Instagram icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="relative z-10 text-[#FD7F2C]">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
          </svg>

          <span className="relative z-10 font-mono text-sm tracking-widest uppercase">
            @ft.documentinglife
          </span>

          {/* arrow */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>

        {/* bottom rule */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-t from-transparent to-[#2a2a2a]" />
      </motion.section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${lightbox + 1} of ${photos.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={close}
          >
            {/* Image container */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[90vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[lightbox]}
                alt={`Photo ${lightbox + 1}`}
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              />
              <p className="text-center text-[#52525b] text-xs font-mono mt-3 tracking-widest">
                {lightbox + 1} / {photos.length}
              </p>
            </motion.div>

            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 flex items-center justify-center w-11 h-11 text-[#71717a] hover:text-white transition-colors text-2xl leading-none font-light"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-11 sm:h-11 rounded-full border border-[#333] bg-black/70 flex items-center justify-center text-[#a1a1aa] hover:text-white hover:border-[#FD7F2C] transition-all"
              aria-label="Previous"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-11 sm:h-11 rounded-full border border-[#333] bg-black/70 flex items-center justify-center text-[#a1a1aa] hover:text-white hover:border-[#FD7F2C] transition-all"
              aria-label="Next"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
