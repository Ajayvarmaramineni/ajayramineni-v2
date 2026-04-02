"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getArticles, getNightsPosts, getDearStrangerPosts, type BlogPost } from "@/lib/blogPosts";
import BlogInkBg from "@/components/ui/BlogInkBg";

function SeriesCard({ post, i, accentColor }: { post: BlogPost; i: number; accentColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex items-start gap-5 py-5 border-b border-[#1a1a1a] last:border-0"
      >
        <span
          className="font-mono text-xs shrink-0 mt-1 w-16 sm:w-24"
          style={{ color: accentColor, opacity: 0.6 }}
        >
          {post.date}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#f4f4f5] font-medium text-sm mb-1 group-hover:text-white transition-colors">
            {post.title}
          </h3>
          <p className="text-[#52525b] text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
        </div>
        <ArrowUpRight
          size={13}
          className="shrink-0 mt-0.5 text-[#3f3f46] group-hover:text-[#FD7F2C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
        />
      </Link>
    </motion.div>
  );
}

// ── main component ─────────────────────────────────────────────────────────

export default function BlogClient() {
  const articles = getArticles();
  const nightsPosts = getNightsPosts();
  const dearStrangerPosts = getDearStrangerPosts();

  return (
    <div className="relative pt-24 pb-20 overflow-hidden">
      <BlogInkBg opacity={0.28} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-16">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-label mb-5">
            Writing
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black uppercase leading-none text-[#f4f4f5]"
            style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "-0.03em" }}
          >
            Thoughts &amp;<br />
            <span style={{ color: "#FD7F2C" }}>Stories</span>
          </motion.h1>
        </div>

        {/* ── Articles ── */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs text-[#FD7F2C] tracking-widest uppercase">Articles</span>
            <div className="flex-1 h-px bg-[#1e1e1e]" />
          </div>
          <p className="text-[#52525b] text-xs font-mono mb-6 leading-relaxed">
            Writeups on machine learning, data strategy, business intelligence, and analytics.
          </p>
          <div>
            {articles.map((post, i) => (
              <SeriesCard key={post.slug} post={post} i={i} accentColor="#FD7F2C" />
            ))}
          </div>
        </section>

        {/* ── Two series side by side ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">

          {/* Nights */}
          <section>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-[#6366f1] tracking-widest uppercase">Nights</span>
              <div className="flex-1 h-px bg-[#1e1e1e]" />
            </div>
            <p className="text-[#52525b] text-xs font-mono mb-6 leading-relaxed">
              Observations from late-night walks in a new city. On solitude, attention, and learning to see.
            </p>
            <div>
              {nightsPosts.map((post, i) => (
                <SeriesCard key={post.slug} post={post} i={i} accentColor="#6366f1" />
              ))}
            </div>
          </section>

          {/* Dear Stranger */}
          <section>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-[#FD7F2C] tracking-widest uppercase">Dear Stranger</span>
              <div className="flex-1 h-px bg-[#1e1e1e]" />
            </div>
            <p className="text-[#52525b] text-xs font-mono mb-6 leading-relaxed">
              Letters to people I noticed but never spoke to. On connection, public solitude, and small kindnesses.
            </p>
            <div>
              {dearStrangerPosts.map((post, i) => (
                <SeriesCard key={post.slug} post={post} i={i} accentColor="#FD7F2C" />
              ))}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
