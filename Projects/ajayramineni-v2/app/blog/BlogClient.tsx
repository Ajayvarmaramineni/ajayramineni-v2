"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

const posts = [
  {
    slug: "whats-the-purpose",
    title: "What's the Purpose?",
    excerpt:
      "I am free to choose my own thoughts, free to work, free to go on a trek. But that's the free part. The man part's a little different.",
    date: "April 2025",
    readTime: "4 min",
    tag: "Nights",
    featured: true,
  },
  {
    slug: "ml-pipeline-best-practices",
    title: "Building Production-Ready ML Pipelines on Azure",
    excerpt:
      "From raw data to deployed model — a hands-on guide to Azure ML Studio pipelines with boosted decision trees, feature stores, and monitoring.",
    date: "March 2025",
    readTime: "6 min",
    tag: "Machine Learning",
    featured: true,
  },
  {
    slug: "power-bi-kpi-dashboard",
    title: "Designing KPI Dashboards That Actually Get Used",
    excerpt:
      "The gap between a technically correct dashboard and one that drives decisions. Lessons from the Nike BI project — layout, storytelling, and stakeholder buy-in.",
    date: "February 2025",
    readTime: "5 min",
    tag: "Business Intelligence",
    featured: true,
  },
  {
    slug: "data-strategy-for-startups",
    title: "Why Most Startups Get Their Data Strategy Wrong",
    excerpt:
      "Common mistakes I see in early-stage companies and how to build a scalable data foundation — from day one to Series A.",
    date: "January 2025",
    readTime: "7 min",
    tag: "Strategy",
    featured: false,
  },
  {
    slug: "tfidf-recommendation-systems",
    title: "TF-IDF for Recommendation Systems: A Practical Guide",
    excerpt:
      "How I used TF-IDF and cosine similarity to build a content-based anime recommendation engine on 12k+ titles. Code included.",
    date: "December 2024",
    readTime: "8 min",
    tag: "Machine Learning",
    featured: false,
  },
];

export default function BlogClient() {
  const featured = posts.filter((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

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
            Writing
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black uppercase text-[clamp(3rem,7vw,6rem)] leading-none"
            style={{ letterSpacing: "-0.03em" }}
          >
            THOUGHTS ON<br />
            <span className="gradient-text-indigo">DATA & STRATEGY</span>
          </motion.h1>
        </div>

        {/* Featured */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {featured.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="card-noir p-8 group block h-full relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#6366f1] to-transparent" />
                <div className="flex items-center gap-2 mb-4">
                  <span className="tag">{post.tag}</span>
                  <span className="font-mono text-xs text-[#52525b] flex items-center gap-1">
                    <Clock size={10} /> {post.readTime} read
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-[#f8f8f8] mb-3 group-hover:text-[#818cf8] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-[#71717a] text-sm leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#52525b]">
                    {post.date}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="text-[#52525b] group-hover:text-[#6366f1] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Remaining */}
        <div className="space-y-3">
          {rest.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="card-noir p-5 group flex items-center gap-6"
              >
                <div className="shrink-0 w-28">
                  <span className="font-mono text-xs text-[#52525b]">
                    {post.date}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#f8f8f8] font-medium text-sm group-hover:text-[#818cf8] transition-colors truncate">
                    {post.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="tag hidden md:block">{post.tag}</span>
                  <ArrowUpRight
                    size={14}
                    className="text-[#52525b] group-hover:text-[#6366f1] transition-colors"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
