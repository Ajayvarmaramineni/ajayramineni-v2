"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import DataNetworkBg from "@/components/ui/DataNetworkBg";
import { trackEvent } from "@/lib/gtag";

const roles = ["Data & Business Analyst", "Business Intelligence", "Product Analyst", "Photographer"];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Animated network background */}
      <DataNetworkBg opacity={0.35} />

      {/* Soft radial glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(253,127,44,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT ── */}
          <div>
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border border-[#222] bg-[#111]"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-[#71717a]">Boston, MA · Open to work</span>
            </motion.div>

            {/* NAME */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              {/* AJAY — large, white */}
              <h1
                className="font-display font-black uppercase leading-[0.9] text-[#f4f4f5]"
                style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "-0.04em" }}
              >
                AJAY
              </h1>

              {/* Divider with RAMINENI label */}
              <div className="flex items-center gap-3 mt-1 mb-1">
                <div className="h-px w-10 bg-[#FD7F2C]" />
                <span
                  className="font-display font-black uppercase text-[#FD7F2C] tracking-[0.12em]"
                  style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.05rem)" }}
                >
                  RAMINENI
                </span>
                <div className="h-px flex-1 bg-[#1e1e1e]" />
              </div>
            </motion.div>

            {/* Roles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-2 mb-7"
            >
              {roles.map((role) => (
                <span key={role} className="tag">{role}</span>
              ))}
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-3 max-w-lg mb-10"
            >
              <p className="text-[#71717a] text-sm font-mono">
                Currently pursuing{" "}
                <span className="text-[#FD9346]">MS Business Analytics @ WPI</span>
              </p>
              <p className="text-[#71717a] text-[0.9rem] leading-relaxed">
                I work at the intersection of business and data, building solutions that turn raw information into clear decisions. With a background in business development and hands-on experience in analytics, I bring both context and execution to the table.
              </p>
              <p className="text-[#71717a] text-[0.9rem] leading-relaxed">
                My work spans machine learning pipelines, recommendation systems, and marketing analytics using Python, SQL, and BI tools. I focus on making data not just accurate, but actionable for real-world decisions.
              </p>
              <p className="text-[#71717a] text-[0.9rem] leading-relaxed">
                I am also the founder of{" "}
                <span className="text-[#f4f4f5] font-medium">DataStatz</span>
                , a platform that simplifies analysis through automated insights, AutoML, and shareable dashboards.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link href="/portfolio" className="btn-primary group">
                View My Work
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline group"
                onClick={() => trackEvent("resume_view", { event_category: "engagement", event_label: "hero_cta" })}
              >
                <Download size={14} />
                Resume
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: Photo ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Outer glow */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(253,127,44,0.15) 0%, transparent 70%)",
                  transform: "scale(1.2)",
                  filter: "blur(28px)",
                }}
              />

              {/* Dot grid decorations */}
              <div
                className="absolute -top-5 -right-5 w-20 h-20 pointer-events-none opacity-25"
                style={{ backgroundImage: "radial-gradient(circle, #FD7F2C 1px, transparent 1px)", backgroundSize: "8px 8px" }}
              />
              <div
                className="absolute -bottom-5 -left-5 w-20 h-20 pointer-events-none opacity-15"
                style={{ backgroundImage: "radial-gradient(circle, #FD9346 1px, transparent 1px)", backgroundSize: "8px 8px" }}
              />

              {/* Photo frame */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  width: 370,
                  height: 450,
                  border: "1px solid rgba(253,127,44,0.22)",
                  boxShadow: "0 0 0 1px rgba(253,127,44,0.06), 0 30px 70px rgba(0,0,0,0.55)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FD7F2C] to-transparent z-10" />

                <Image
                  src="/images/headshot.jpg"
                  alt="Ajay Ramineni"
                  fill
                  className="object-cover object-top"
                  priority
                />

                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-transparent z-10" />

                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <p className="font-display font-black uppercase text-base text-[#f4f4f5]" style={{ letterSpacing: "-0.01em" }}>
                    Ajay Ramineni
                  </p>
                  <p className="font-mono text-xs text-[#FD7F2C]">Data & Business Analyst</p>
                </div>

                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#FD7F2C]/40 rounded-tl pointer-events-none z-20" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#FD7F2C]/40 rounded-br pointer-events-none z-20" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] text-[#3f3f46] tracking-widest">SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-[#FD7F2C] to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
