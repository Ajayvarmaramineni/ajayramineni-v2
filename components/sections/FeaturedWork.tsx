"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { featuredProjects, type Project } from "@/lib/projects";

export default function FeaturedWork() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid opacity-[0.07] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="section-label mb-4"
            >
              Selected Work
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-black uppercase text-[clamp(1.4rem,2.5vw,2rem)] text-[#f8f8f8] leading-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              PROJECTS &<br />
              <span className="gradient-text-indigo">CASE STUDIES</span>
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link href="/portfolio" className="btn-outline group text-sm">
              All Projects
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group rounded-2xl overflow-hidden border border-[#1e1e1e] hover:border-[#333] transition-all duration-300 bg-[#0e0e0e] flex flex-col"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      {/* ── Image / Banner ── */}
      <div className={`relative h-48 bg-gradient-to-br ${project.gradient} overflow-hidden flex-shrink-0`}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />

        {/* Glow blob */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: project.accentColor }}
          />
        </div>

        {/* Category + ID badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border text-white/70"
            style={{ borderColor: `${project.accentColor}40`, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
          >
            {project.category}
          </span>
        </div>

        <span className="absolute top-4 right-4 font-display font-black text-4xl opacity-10 text-white select-none">
          {project.id}
        </span>

        {/* Bottom fade into card */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0e0e0e] to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="p-6 flex flex-col flex-1">
        <h3
          className="text-lg font-bold mb-2 transition-colors duration-200"
          style={{ color: project.accentColor }}
        >
          {project.title}
        </h3>

        <p className="text-[#71717a] text-sm leading-relaxed mb-5">
          {project.description}
        </p>

        {/* Key highlights */}
        <div className="mb-5">
          <p className="font-mono text-xs mb-3" style={{ color: project.accentColor }}>
            // Key Highlights
          </p>
          <ul className="space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-xs text-[#71717a] leading-relaxed">
                <span className="mt-0.5 shrink-0" style={{ color: project.accentColor }}>▸</span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.stack.map((tech) => (
            <span key={tech} className="px-2 py-0.5 bg-[#141414] border border-[#222] rounded text-[#71717a] text-xs font-mono">
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[#1a1a1a]">
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: project.accentColor }}
            >
              <ExternalLink size={12} /> Live Demo
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-[#71717a] hover:text-[#f8f8f8] transition-colors"
            >
              <Github size={12} /> View Code
            </a>
          )}
          {!project.live && !project.github && (
            <Link href="/portfolio"
              className="flex items-center gap-1.5 text-xs font-medium text-[#52525b] hover:text-[#a1a1aa] transition-colors"
            >
              <ArrowUpRight size={12} /> View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
