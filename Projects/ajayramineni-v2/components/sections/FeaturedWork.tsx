"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: "01",
    title: "Azure ML Income Prediction",
    category: "Machine Learning",
    stack: ["Python", "Azure ML", "Decision Trees"],
    description:
      "End-to-end ML pipeline for income prediction using boosted decision trees on cloud infrastructure. Includes feature engineering, hyperparameter tuning, and model deployment.",
    href: "https://github.com/Ajayvarmaramineni/azure-ml-income-prediction",
    external: true,
    featured: true,
  },
  {
    id: "02",
    title: "Nike Business Intelligence",
    category: "Data Analytics",
    stack: ["Power BI", "SQL", "DAX"],
    description:
      "Analyzed 3 datasets (99k+ records), built dashboards surfacing regional KPIs. Proposed unified data warehouse strategy for cross-team decision-making.",
    href: "/portfolio",
    external: false,
    featured: true,
  },
  {
    id: "03",
    title: "Anime Recommendation System",
    category: "ML · NLP",
    stack: ["Python", "TF-IDF", "Cosine Similarity"],
    description:
      "Content-based recommender using TF-IDF & cosine similarity on 12k+ anime dataset. Personalizes suggestions based on genre, type, and rating patterns.",
    href: "/portfolio",
    external: false,
    featured: true,
  },
  {
    id: "04",
    title: "Titanic Kaggle Competition",
    category: "Machine Learning",
    stack: ["Python", "Pandas", "Scikit-learn"],
    description:
      "ML competition submission achieving 0.78708 score (Top 35%). Feature engineering, ensemble methods, and cross-validation for survival prediction.",
    href: "https://github.com/Ajayvarmaramineni/titanic-kaggle",
    external: true,
    featured: false,
  },
];

export default function FeaturedWork() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
              className="font-display font-black uppercase text-[clamp(2.5rem,5vw,4rem)] text-[#f8f8f8] leading-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              PROJECTS &<br />
              <span className="gradient-text-indigo">CASE STUDIES</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/portfolio"
              className="btn-outline group text-sm"
            >
              All Projects
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
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

function ProjectCard({
  project,
}: {
  project: (typeof projects)[0];
}) {
  const Wrapper = project.external ? "a" : Link;
  const wrapperProps = project.external
    ? { href: project.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: project.href };

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className="card-noir p-6 group block relative overflow-hidden h-full"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(99,102,241,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

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
          <ArrowUpRight
            size={16}
            className="text-[#52525b] group-hover:text-[#6366f1] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
          />
        </div>

        <h3 className="text-lg font-semibold text-[#f8f8f8] mb-3 group-hover:text-[#818cf8] transition-colors">
          {project.title}
        </h3>

        <p className="text-[#71717a] text-sm leading-relaxed mb-5">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 bg-[#111] border border-[#222] rounded text-[#71717a] text-xs font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
