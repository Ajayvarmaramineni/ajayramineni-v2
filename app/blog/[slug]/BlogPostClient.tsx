"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import type { BlogPost } from "@/lib/blogPosts";

export default function BlogPostClient({
  post,
  children,
}: {
  post: BlogPost;
  children: ReactNode;
}) {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#71717a] hover:text-[#f8f8f8] transition-colors text-sm font-medium group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            All Articles
          </Link>
        </motion.div>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="tag">{post.tag}</span>
            <span className="font-mono text-xs text-[#52525b] flex items-center gap-1">
              <Calendar size={10} /> {post.date}
            </span>
            <span className="font-mono text-xs text-[#52525b] flex items-center gap-1">
              <Clock size={10} /> {post.readTime} read
            </span>
          </div>
        </motion.div>

        {/* Content — rendered server-side via MDX */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose-custom"
        >
          {children}
        </motion.article>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[#1a1a1a]">
          <p className="text-[#52525b] text-sm font-mono mb-4">end of article</p>
          <Link href="/blog" className="btn-outline text-sm group">
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            More Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
