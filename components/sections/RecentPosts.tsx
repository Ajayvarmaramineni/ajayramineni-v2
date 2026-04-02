"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { getTopPosts } from "@/lib/blogPosts";

export default function RecentPosts() {
  const posts = getTopPosts(4);

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
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
              className="font-display font-black uppercase text-[clamp(1.4rem,2.5vw,2rem)] text-[#f8f8f8] leading-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              LATEST<br />
              <span className="gradient-text-indigo">ARTICLES</span>
            </motion.h2>
          </div>
          <Link href="/blog" className="btn-outline group text-sm">
            All Articles
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="space-y-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="card-noir p-5 group flex flex-col md:flex-row md:items-center gap-3 md:gap-8"
              >
                <div className="shrink-0 w-24">
                  <span className="font-mono text-xs text-[#52525b]">{post.date}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[#f8f8f8] font-semibold text-sm mb-0.5 group-hover:text-[#FD9346] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[#52525b] text-xs truncate">{post.excerpt}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="tag hidden md:inline-flex">{post.tag}</span>
                  <span className="font-mono text-xs text-[#52525b] hidden md:flex items-center gap-1">
                    <Clock size={9} /> {post.readTime}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="text-[#52525b] group-hover:text-[#FD7F2C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
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
