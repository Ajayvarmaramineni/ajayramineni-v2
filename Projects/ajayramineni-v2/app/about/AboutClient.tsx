"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, MapPin, GraduationCap, Briefcase } from "lucide-react";

const timeline = [
  {
    period: "2024 — Present",
    role: "MS Business Analytics",
    org: "Worcester Polytechnic Institute",
    detail: "GPA 4.0 · Worcester, MA",
    type: "education",
  },
  {
    period: "2021 — 2023",
    role: "Business Development Manager",
    org: "Visatree Consultants",
    detail:
      "Led a team of 8 · 75% lead conversion on 200+ leads · 30+ institutional partnerships",
    type: "work",
  },
  {
    period: "2018 — 2021",
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

export default function AboutClient() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section-label mb-6"
          >
            About Me
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black uppercase text-[clamp(3rem,7vw,6rem)] leading-none"
            style={{ letterSpacing: "-0.03em" }}
          >
            DATA MEETS<br />
            <span className="gradient-text-indigo">STRATEGY</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#111] border border-[#222]">
              <Image
                src="/images/Aj.jpg"
                alt="Ajay Ramineni"
                fill
                className="object-cover img-noir"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-[#080808]/80 backdrop-blur rounded-xl p-3 border border-[#222]">
                  <p className="text-[#f8f8f8] font-semibold text-sm">
                    Ajay Ramineni
                  </p>
                  <p className="text-[#6366f1] text-xs font-mono flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> Worcester, MA
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <a
                href="/resume.pdf"
                download
                className="btn-primary w-full justify-center"
                onClick={() => {
                  if (typeof window !== "undefined" && (window as any).gtag) {
                    (window as any).gtag("event", "resume_download", {
                      event_category: "engagement",
                      event_label: "about_page",
                    });
                  }
                }}
              >
                <Download size={15} />
                Download Resume
              </a>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <p className="text-[#d4d4d8] text-lg leading-relaxed">
              I&apos;m an MS Business Analytics candidate at{" "}
              <span className="text-[#f8f8f8] font-semibold">
                Worcester Polytechnic Institute
              </span>{" "}
              (GPA 4.0), with 2+ years of professional experience bridging data,
              strategy, and storytelling.
            </p>
            <p className="text-[#a1a1aa] leading-relaxed">
              My background is unusual: I started in business development and
              sales strategy, leading a team of 8 at Visatree Consultants where I
              converted 75% of 200+ leads and secured 30+ institutional
              partnerships. That grounding in real-world business problems is what
              makes my data work sharper — I don&apos;t just build models, I build
              models that answer the right questions.
            </p>
            <p className="text-[#a1a1aa] leading-relaxed">
              Now I focus on ML pipelines, BI dashboards, and predictive modeling
              — with a particular love for Azure ML, Power BI, and Python. On the
              side, I&apos;m a photographer and cinematographer, which keeps my visual
              thinking sharp.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: "Current GPA", value: "4.0 / 4.0" },
                { label: "Program", value: "MS Business Analytics" },
                { label: "Experience", value: "2+ Years" },
                { label: "Based in", value: "Worcester, MA" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[#111] border border-[#222] rounded-xl p-4"
                >
                  <p className="font-mono text-xs text-[#52525b] mb-1">
                    {item.label}
                  </p>
                  <p className="text-[#f8f8f8] font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
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
                    <GraduationCap size={16} className="text-[#6366f1]" />
                  ) : (
                    <Briefcase size={16} className="text-[#6366f1]" />
                  )}
                  <span className="font-mono text-xs text-[#52525b] w-28">
                    {item.period}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[#f8f8f8] font-semibold">{item.role}</p>
                  <p className="text-[#6366f1] text-sm">{item.org}</p>
                </div>
                <p className="text-[#71717a] text-sm max-w-xs">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
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
                    className="inline-flex items-center gap-1 text-[#6366f1] text-xs hover:text-[#818cf8] transition-colors font-mono"
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
