"use client";

import { motion } from "framer-motion";

const skillGroups = [
  {
    category: "Languages",
    skills: ["Python", "SQL", "JavaScript", "TypeScript", "HTML/CSS", "Java"],
  },
  {
    category: "Data & ML",
    skills: [
      "Pandas",
      "NumPy",
      "Scikit-Learn",
      "Azure ML Studio",
      "TF-IDF",
      "Decision Trees",
      "Ensemble Methods",
    ],
  },
  {
    category: "BI & Visualization",
    skills: [
      "Power BI",
      "Tableau",
      "DAX",
      "SQL Dashboards",
      "KPI Design",
      "Data Storytelling",
    ],
  },
  {
    category: "Tools",
    skills: [
      "Git",
      "GitHub",
      "VS Code",
      "MongoDB",
      "Excel / Sheets",
      "Canva",
      "EmailJS",
    ],
  },
  {
    category: "Certifications",
    skills: [
      "ML Specialization — Stanford",
      "Azure ML Studio",
      "Google Analytics 4",
      "Google Ads Search",
      "Hootsuite Platform",
    ],
  },
];

export default function Skills() {
  return (
    <section className="py-24 bg-[#0a0a0a] border-y border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Label column */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
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
              className="font-display font-black uppercase text-4xl text-[#f8f8f8] leading-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              SKILLS &<br />
              <span className="gradient-text-indigo">TOOLS</span>
            </motion.h2>
          </div>

          {/* Skills grid */}
          <div className="lg:col-span-4 space-y-8">
            {skillGroups.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.08 }}
              >
                <p className="font-mono text-xs text-[#52525b] uppercase tracking-wider mb-3">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-[#111] border border-[#222] rounded-lg text-[#a1a1aa] text-sm hover:border-[#6366f1] hover:text-[#818cf8] hover:bg-[rgba(99,102,241,0.05)] transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
