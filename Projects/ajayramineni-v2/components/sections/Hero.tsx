"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Download, MapPin } from "lucide-react";

const roles = ["Data Strategist", "ML Engineer", "BI Analyst", "Photographer"];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-[#71717a]">
                <MapPin size={10} className="inline mr-1" />
                Worcester, MA · Open to work
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-display font-black uppercase leading-none mb-2">
                <span
                  className="block text-[clamp(3.5rem,9vw,7rem)] text-[#f8f8f8]"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  AJAY
                </span>
                <span
                  className="block text-[clamp(3.5rem,9vw,7rem)] gradient-text-indigo"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  RAMINENI
                </span>
              </h1>
            </motion.div>

            {/* Roles ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 my-6"
            >
              {roles.map((role) => (
                <span key={role} className="tag">
                  {role}
                </span>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[#a1a1aa] text-lg leading-relaxed max-w-lg mb-10"
            >
              MS Business Analytics @ WPI (GPA 4.0). I bridge the gap between
              raw data and real decisions — building ML pipelines, BI dashboards,
              and strategies that move numbers.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/portfolio" className="btn-primary group">
                View My Work
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <a
                href="/resume.pdf"
                download
                className="btn-outline group"
                onClick={() => {
                  // GA4 resume download tracking
                  if (typeof window !== "undefined" && (window as any).gtag) {
                    (window as any).gtag("event", "resume_download", {
                      event_category: "engagement",
                      event_label: "hero_cta",
                    });
                  }
                }}
              >
                <Download size={15} />
                Resume
              </a>
            </motion.div>
          </div>

          {/* Right — visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="card-noir p-8 relative overflow-hidden">
                {/* Accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#6366f1] to-transparent" />

                <p className="font-mono text-xs text-[#52525b] mb-4">
                  // ajay_ramineni.profile
                </p>

                <div className="space-y-4">
                  <ProfileRow label="role" value="MS Business Analytics" />
                  <ProfileRow label="institution" value="WPI · GPA 4.0" />
                  <ProfileRow label="speciality" value="ML · BI · Strategy" />
                  <ProfileRow label="experience" value="2+ years" />
                  <ProfileRow label="location" value="Worcester, MA" />
                  <ProfileRow label="status" value="Open to work ✓" highlight />
                </div>

                <div className="mt-6 pt-6 border-t border-[#222]">
                  <p className="font-mono text-xs text-[#52525b] mb-3">
                    // tech_stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Python",
                      "SQL",
                      "Power BI",
                      "Azure ML",
                      "Tableau",
                      "Scikit-learn",
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-[#111] border border-[#222] rounded text-[#a1a1aa] text-xs font-mono hover:border-[#6366f1] hover:text-[#818cf8] transition-colors cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating stat cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-[#161616] border border-[#222] rounded-xl p-3 shadow-xl"
              >
                <p className="font-display text-2xl font-black text-[#6366f1]">
                  4.0
                </p>
                <p className="font-mono text-[10px] text-[#52525b]">GPA</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-4 -left-4 bg-[#161616] border border-[#222] rounded-xl p-3 shadow-xl"
              >
                <p className="font-display text-2xl font-black text-[#6366f1]">
                  75%
                </p>
                <p className="font-mono text-[10px] text-[#52525b]">
                  lead conversion
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] text-[#52525b] tracking-widest">
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-[#6366f1] to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

function ProfileRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-xs text-[#52525b] w-24 shrink-0">
        {label}:
      </span>
      <span
        className={`text-sm font-medium ${
          highlight ? "text-emerald-400" : "text-[#d4d4d8]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
