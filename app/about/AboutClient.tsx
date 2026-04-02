"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Download, ExternalLink, GraduationCap, Briefcase } from "lucide-react";
import AboutOrbitBg from "@/components/ui/AboutOrbitBg";

const timeline = [
  {
    period: "2025 — 2027",
    role: "MS Business Analytics",
    org: "Worcester Polytechnic Institute",
    detail: "GPA 4.0 · Boston, MA",
    type: "education",
  },
  {
    period: "2021 — 2024",
    role: "Business Development Manager",
    org: "Visatree Consultants",
    detail:
      "Led a team of 8 · 75% lead conversion on 200+ leads · 30+ institutional partnerships",
    type: "work",
  },
  {
    period: "2019 — 2021",
    role: "Bachelor of Commerce",
    org: "Osmania University",
    detail: "Hyderabad, India",
    type: "education",
  },
];

const certifications = [
  {
    name: "Machine Learning Specialization",
    issuer: "DeepLearning.AI & Stanford University",
    verify: "https://coursera.org/verify/specialization/S3M4OTEO9OJL",
  },
  {
    name: "ML Pipelines with Azure ML Studio",
    issuer: "Coursera",
    verify: "https://coursera.org/verify/RVUUW3PJZD0M",
  },
  {
    name: "Google Analytics Certification",
    issuer: "Google Skillshop",
    verify: null,
  },
  {
    name: "Google Ads Search Certification",
    issuer: "Google Skillshop",
    verify: null,
  },
  {
    name: "Hootsuite Platform Certification",
    issuer: "Hootsuite",
    verify: null,
  },
];

const sidebarCards = [
  {
    label: "EDUCATION",
    title: "MS Business Analytics",
    sub: "Worcester Polytechnic Institute",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    label: "BASED IN",
    title: "Boston, MA",
    sub: "Originally from Hyderabad, India",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    label: "FOCUS",
    title: "Data & Business Analytics",
    sub: "Predictive modelling · Visualisation",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M17.5 14v3M17.5 21v-1M14 17.5h3M21 17.5h-1" />
      </svg>
    ),
  },
  {
    label: "CREATIVE SIDE",
    title: "Photography & Writing",
    sub: "Travel · Street · Portraits",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
];

export default function AboutClient() {
  return (
    <div className="relative pt-24 pb-20 overflow-hidden">
      <AboutOrbitBg opacity={0.42} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section-label mb-5"
          >
            About Me
          </motion.p>
          <h1
            className="font-display font-black leading-[0.92] text-[#f4f4f5]"
            style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "-0.03em" }}
          >
            The story<br />
            <span style={{ color: "#FD7F2C" }}>so far.</span>
          </h1>
        </motion.div>

        {/* ── Main layout: bio + sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 mb-12 lg:mb-20">

          {/* Bio — 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 space-y-5"
          >
            {[
              "My journey began as a passionate business enthusiast, especially in business strategies and analysis, inspired by the real world and by my mentors who taught me to embrace everything life has to offer and honor the stories of the people I meet.",
              "With 2+ years of experience in sales strategy and business development in consulting, and with roots in Hyderabad, India, along with a drive for exploration in the field of business analytics, I have learned to embrace every opportunity.",
              "As part of that process, I decided to pursue my Master's in Business Analytics, specializing in Advanced Business Analytics and Artificial Intelligence. My professional experience spans business development, sales strategy, marketing, and consulting, from managing client relationships to making data driven business decisions.",
              "I have also been interested in photography and cinematography from a very young age, and I still pursue this interest whenever I have spare time.",
              "Currently, I am also an active member of the Rotaract Club of Hyderabad, India, with the aim of serving the society I live in, acting as the Director of Design and Editing.",
              "In 2025, I moved to Massachusetts, US with the aim to learn and grow. My journey has been deeply shaped by my cultural heritage and by my experience navigating different cultural spaces as an Indian living in the US.",
              "This space is more than a portfolio. It is a living document of my journey. From personal stories and professional insights to adventures that fuel my creativity, I hope something here resonates with you.",
            ].map((para, i) => (
              <p key={i} className="text-[#71717a] text-[0.95rem] leading-relaxed">
                {para}
              </p>
            ))}
          </motion.div>

          {/* Sidebar — 1 col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-3"
          >
            {sidebarCards.map((card) => (
              <div
                key={card.label}
                className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4 flex gap-3 items-start"
              >
                <div className="shrink-0 mt-0.5 text-[#3f3f46]">
                  {card.icon}
                </div>
                <div>
                  <p className="font-mono text-[0.65rem] tracking-widest text-[#52525b] mb-1 uppercase">
                    {card.label}
                  </p>
                  <p className="text-[#f4f4f5] text-sm font-semibold leading-snug">
                    {card.title}
                  </p>
                  <p className="text-[#52525b] text-xs mt-0.5">{card.sub}</p>
                </div>
              </div>
            ))}

            {/* Download Résumé */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 w-full border border-[#2a2a2a] rounded-xl py-3 px-4 text-[#a1a1aa] text-sm font-mono tracking-wide hover:border-[#FD7F2C] hover:text-[#FD7F2C] transition-colors"
            >
              <Download size={14} />
              VIEW RÉSUMÉ
            </a>
          </motion.div>
        </div>

        {/* ── Timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="section-label mb-8">Experience & Education</p>
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-noir p-6 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="shrink-0 flex items-center gap-2">
                  {item.type === "education" ? (
                    <GraduationCap size={16} className="text-[#FD7F2C]" />
                  ) : (
                    <Briefcase size={16} className="text-[#FD7F2C]" />
                  )}
                  <span className="font-mono text-xs text-[#52525b] w-20 sm:w-28">
                    {item.period}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[#f8f8f8] font-semibold">{item.role}</p>
                  <p className="text-[#FD7F2C] text-sm">{item.org}</p>
                </div>
                <p className="text-[#71717a] text-sm max-w-xs">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Quote ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 flex justify-center"
        >
          <div
            className="relative rounded-2xl border border-[#222] px-10 py-8 text-center max-w-2xl w-full overflow-hidden"
            style={{ background: "linear-gradient(135deg, #111 0%, #0e0e0e 100%)" }}
          >
            {/* corner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(253,127,44,0.3), transparent)" }} />
            {/* quote mark */}
            <span
              className="absolute top-3 left-6 select-none leading-none"
              style={{ fontSize: "3rem", color: "#FD7F2C", opacity: 0.2, fontFamily: "Georgia, serif" }}
              aria-hidden="true"
            >"</span>

            <p
              className="relative z-10 text-[#e4e4e7] leading-snug"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: "italic", fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
            >
              Life is a chessboard, and every move counts.{" "}
              <span style={{ color: "#FD7F2C" }}>I play with strategy, creativity, and heart.</span>
            </p>
            <p className="mt-4 font-mono text-[0.65rem] text-[#52525b] tracking-widest uppercase">— Ajay Ramineni</p>
          </div>
        </motion.div>

        {/* ── Certifications ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="section-label mb-8">Certifications</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card-noir p-5"
              >
                <p className="text-[#f8f8f8] font-medium text-sm mb-1">
                  {cert.name}
                </p>
                <p className="text-[#71717a] text-xs mb-3">{cert.issuer}</p>
                {cert.verify && (
                  <a
                    href={cert.verify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#FD7F2C] text-xs hover:text-[#FD9346] transition-colors font-mono"
                  >
                    Verify <ExternalLink size={10} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
