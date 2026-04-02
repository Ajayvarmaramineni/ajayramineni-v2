"use client";

import { motion } from "framer-motion";
import DataNetworkBg from "@/components/ui/DataNetworkBg";

/* ─── Clean b&w SVG icons — inline ──────────────────────────────────────── */
const icons = {
  frontend: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  backend: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  data: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  bi: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  tools: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  ),
  ml: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a8 8 0 1 0 0 16A8 8 0 0 0 12 2z" /><path d="M12 6v6l4 2" />
    </svg>
  ),
};

const skillGroups = [
  {
    key: "frontend",
    category: "Frontend",
    icon: icons.frontend,
    color: "#FD9346",
    skills: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Responsive Design", "UI/UX Design"],
  },
  {
    key: "backend",
    category: "Backend & APIs",
    icon: icons.backend,
    color: "#34d399",
    skills: ["Python", "Node.js", "Express", "RESTful APIs", "Microservices", "API Integration"],
  },
  {
    key: "ml",
    category: "Machine Learning",
    icon: icons.ml,
    color: "#f472b6",
    skills: ["Scikit-Learn", "Azure ML Studio", "AutoML", "TF-IDF", "Decision Trees", "XGBoost", "Pandas", "NumPy"],
  },
  {
    key: "data",
    category: "Data & Databases",
    icon: icons.data,
    color: "#fb923c",
    skills: ["SQL", "MySQL", "PostgreSQL", "MongoDB", "Data Cleaning", "Data Pipeline", "Excel"],
  },
  {
    key: "bi",
    category: "Business Intelligence",
    icon: icons.bi,
    color: "#facc15",
    skills: ["Power BI", "Tableau", "DAX", "KPI Design", "Data Storytelling", "Dashboard Design"],
  },
  {
    key: "tools",
    category: "Tools & Platforms",
    icon: icons.tools,
    color: "#67e8f9",
    skills: ["Git", "GitHub", "VS Code", "Jupyter", "Azure", "Google Analytics", "Vercel"],
  },
];

export default function Skills() {
  return (
    <section className="relative py-24 bg-[#0a0a0a] border-y border-[#1a1a1a] overflow-hidden">
      <DataNetworkBg opacity={0.25} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-4"
          >
            Tech Stack
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black uppercase text-[clamp(1.4rem,2.5vw,2rem)] text-[#f8f8f8] leading-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            SKILLS &{" "}
            <span className="gradient-text-indigo">TOOLS</span>
          </motion.h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.08 }}
              className="group rounded-2xl border border-[#1e1e1e] bg-[#0e0e0e] p-6 hover:border-[#2a2a2a] transition-all duration-300"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}
            >
              {/* Icon + category header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="p-2 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${group.color}12`,
                    border: `1px solid ${group.color}25`,
                    color: group.color,
                  }}
                >
                  {group.icon}
                </div>
                <div>
                  <p className="text-[#f4f4f5] font-semibold text-sm">{group.category}</p>
                </div>
              </div>

              {/* Thin accent line */}
              <div className="h-px mb-5" style={{ background: `linear-gradient(90deg, ${group.color}40, transparent)` }} />

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs text-[#a1a1aa] border border-[#222] bg-[#111] hover:border-[#333] hover:text-[#f4f4f5] transition-all duration-150 cursor-default font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
