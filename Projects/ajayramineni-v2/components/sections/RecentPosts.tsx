"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const posts = [
  {
    slug: "ml-pipeline-best-practices",
    title: "Building Production-Ready ML Pipelines on Azure",
    excerpt:
      "From raw data to deployed model — a hands-on guide to Azure ML Studio pipelines with boosted decision trees.",
    date: "Mar 2025",
    readTime: "6 min read",
    tag: "Machine Learning",
  },
  {
    slug: "power-bi-kpi-dashboard",
    title: "Designing KPI Dashboards in Power BI That Actually Get Used",
    excerpt:
      "The gap between a technically correct dashboard and one that drives decisions. Lessons from the Nike BI project.",
    date: "Feb 2025",
    readTime: "5 min read",
    tag: "Business Intelligence",
  },
  {
    slug: "data-strategy-for-startups",
    title: "Why Most Startups Get Their Data Strategy Wrong",
    excerpt:
      "Common mistakes I see in early-stage companies and how to build a scalable data foundation from day one.",
    date: "Jan 2025",
    readTime: "7 min read",
    tag: "Strategy",
  },
];

export default function RecentPosts() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="section-label mb-4"
            >
              Writing
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-black uppercase text-[clamp(2rem,4vw,3.5rem)] text-[#f8f8f8] leading-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              LATEST<br />
              <span className="gradient-text-indigo">ARTICLES</span>
            </motion.h2>
          </div>
          <Link href="/blog" className="btn-outline group text-sm">
            All Articles
            <ArrowUpRight
              size={14}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>
        </div>

        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="card-noir p-6 group flex flex-col md:flex-row md:items-center gap-4 md:gap-8"
              >
                <div className="shrink-0">
                  <span className="font-mono text-xs text-[#52525b]">
                    {post.date}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-[#f8f8f8] font-semibold mb-1 group-hover:text-[#818cf8] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[#71717a] text-sm">{post.excerpt}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="tag">{post.tag}</span>
                  <span className="font-mono text-xs text-[#52525b]">
                    {post.readTime}
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
      </div>
    </section>
  );
}
