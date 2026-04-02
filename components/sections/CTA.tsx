"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

const socials = [
  { label: "GitHub",   href: "https://github.com/ajayvarmaramineni",            icon: Github   },
  { label: "LinkedIn", href: "https://linkedin.com/in/ajayramineni2808",         icon: Linkedin },
  { label: "Email",    href: "mailto:ajayvarmaramineni1128@gmail.com",            icon: Mail     },
];

export default function CTA() {
  return (
    <section className="py-20 border-t border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#0e0e0e] border border-[#1e1e1e] p-10 lg:p-14 text-center">
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top, rgba(253,127,44,0.1) 0%, transparent 70%)" }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label justify-center mb-5"
          >
            Get in Touch
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black uppercase text-[clamp(1.4rem,2.5vw,2rem)] leading-none mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            OPEN TO DATA,{" "}
            <span className="gradient-text-indigo">ML & BI ROLES</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#71717a] text-sm max-w-md mx-auto mb-8"
          >
            Actively looking for opportunities in data analytics, business intelligence, and machine learning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <Link href="/contact" className="btn-primary group text-sm py-2.5 px-5">
              Get in Touch
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Circle icon buttons */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-[#FD9346] transition-all duration-200 hover:scale-110"
                  style={{
                    background: "rgba(8,8,24,0.9)",
                    border: "1px solid rgba(253,127,44,0.28)",
                    boxShadow: "0 0 12px rgba(253,127,44,0.08)",
                  }}
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
