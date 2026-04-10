"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Linkedin } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 lg:py-32 border-t border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#0f0f0f] border border-[#222] p-12 lg:p-16 text-center">
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, transparent 70%)",
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label justify-center mb-6"
          >
            Let&apos;s Connect
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black uppercase text-[clamp(2.5rem,6vw,5rem)] leading-none mb-6"
            style={{ letterSpacing: "-0.03em" }}
          >
            OPEN TO DATA,<br />
            <span className="gradient-text-indigo">ML & BI ROLES</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#71717a] text-lg max-w-xl mx-auto mb-10"
          >
            I&apos;m actively looking for opportunities in data analytics, business
            intelligence, and machine learning. Let&apos;s build something great.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/contact" className="btn-primary group">
              Get in Touch
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <a
              href="https://linkedin.com/in/ajayramineni2808"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline group"
            >
              <Linkedin size={15} />
              LinkedIn
            </a>
            <a
              href="https://github.com/Ajayvarmaramineni"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline group"
            >
              <Github size={15} />
              GitHub
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
