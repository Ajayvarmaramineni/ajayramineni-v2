"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import WorkGridBg from "@/components/ui/WorkGridBg";
import { projects } from "@/lib/projects";

const categories = ["All", "Machine Learning", "Business Intelligence", "Web", "Strategy"];

export default function PortfolioClient() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <div className="relative pt-24 pb-16 overflow-hidden">
      <WorkGridBg opacity={0.34} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section-label mb-6"
          >
            Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black uppercase text-[clamp(2rem,6vw,4.5rem)] leading-none"
            style={{ letterSpacing: "-0.03em" }}
          >
            WORK &<br />
            <span className="gradient-text-indigo">CASE STUDIES</span>
          </motion.h1>
        </div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#111] border border-[#222] text-[#71717a] hover:text-[#f8f8f8] hover:border-[#333]"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects */}
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.07 }}
                className="card-noir p-6 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(99,102,241,0.02)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="font-mono text-xs text-[#52525b]">
                        {project.id}
                      </span>
                      <p className="font-mono text-xs text-[#6366f1] mt-0.5">
                        {project.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded text-[#52525b] hover:text-[#f8f8f8] hover:bg-[#222] transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={14} />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded text-[#52525b] hover:text-[#f8f8f8] hover:bg-[#222] transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-[#f8f8f8] mb-3 group-hover:text-[#818cf8] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-[#71717a] text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-[#111] border border-[#1e1e1e] rounded text-[#71717a] text-xs font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 3 && (
                        <span className="px-2 py-0.5 text-[#52525b] text-xs font-mono">
                          +{project.stack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                    <p className="text-xs font-mono text-[#52525b] flex items-center gap-1">
                      <span className="text-emerald-500">▸</span>{" "}
                      {project.outcome}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
