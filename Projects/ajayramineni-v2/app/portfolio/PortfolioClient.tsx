"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";

const categories = ["All", "Machine Learning", "Business Intelligence", "Web", "Strategy"];

const projects = [
  {
    id: "01",
    title: "Azure ML Income Prediction",
    category: "Machine Learning",
    stack: ["Python", "Azure ML Studio", "Boosted Decision Trees", "Feature Engineering"],
    description:
      "End-to-end ML pipeline for income prediction using boosted decision trees on Azure ML Studio. Includes data preprocessing, feature engineering, hyperparameter tuning, and model deployment. Achieved strong AUC-ROC on the Adult UCI dataset.",
    outcome: "Deployed model on Azure · AUC-ROC optimized",
    github: "https://github.com/Ajayvarmaramineni/azure-ml-income-prediction",
    live: null,
  },
  {
    id: "02",
    title: "Nike Business Intelligence Dashboard",
    category: "Business Intelligence",
    stack: ["Power BI", "SQL", "DAX", "Excel"],
    description:
      "Analyzed 3 interconnected datasets (99k+ records total) to surface regional sales KPIs, retailer performance, and product trends. Built interactive Power BI dashboards with drill-down capabilities. Proposed a unified data warehouse strategy for cross-team alignment.",
    outcome: "99k+ records analyzed · Regional KPIs surfaced",
    github: null,
    live: null,
  },
  {
    id: "03",
    title: "Anime Recommendation System",
    category: "Machine Learning",
    stack: ["Python", "Pandas", "TF-IDF", "Cosine Similarity", "Scikit-Learn"],
    description:
      "Content-based recommendation engine built on 12,000+ anime titles. Uses TF-IDF vectorization on genre, type, and studio metadata, with cosine similarity for personalized recommendations. Includes popularity weighting and cold-start handling.",
    outcome: "12k+ titles · Real-time recommendations",
    github: null,
    live: null,
  },
  {
    id: "04",
    title: "Titanic Kaggle Competition",
    category: "Machine Learning",
    stack: ["Python", "Pandas", "Scikit-Learn", "Random Forest", "XGBoost"],
    description:
      "Kaggle survival prediction competition. Applied feature engineering (title extraction, family size, cabin deck), ensemble methods combining Random Forest and XGBoost, and k-fold cross-validation. Final submission achieved 0.78708 accuracy (Top 35%).",
    outcome: "0.78708 score · Top 35% globally",
    github: "https://github.com/Ajayvarmaramineni/titanic-kaggle",
    live: null,
  },
  {
    id: "05",
    title: "CollegeROI Digital Strategy",
    category: "Web",
    stack: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    description:
      "Full-funnel digital marketing strategy and responsive website for a US EdTech startup. Designed user journeys, conversion funnels, and SEO strategy. Built mobile-first, accessible website with performance-optimized assets.",
    outcome: "Full funnel strategy · Mobile-first delivery",
    github: null,
    live: null,
  },
  {
    id: "06",
    title: "Business Dev at Visatree",
    category: "Strategy",
    stack: ["CRM", "Sales Strategy", "Team Leadership", "Analytics"],
    description:
      "Led a team of 8 business development executives. Built and managed a 200+ lead pipeline, achieving 75% conversion rate through data-driven prioritization and personalized outreach strategies. Secured 30+ institutional partnerships across India.",
    outcome: "75% conversion · 30+ partnerships",
    github: null,
    live: null,
  },
];

export default function PortfolioClient() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
            className="font-display font-black uppercase text-[clamp(3rem,7vw,6rem)] leading-none"
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
