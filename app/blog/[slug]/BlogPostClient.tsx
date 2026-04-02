"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

type Post = {
  title: string;
  date: string;
  readTime: string;
  tag: string;
  content: string;
};

/** Parses inline markdown: **bold** and *italic* within a text string */
function parseInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // Match **bold** or *italic*
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[0].startsWith("**")) {
      parts.push(<strong key={match.index} className="text-[#f8f8f8] font-semibold">{match[2]}</strong>);
    } else {
      parts.push(<em key={match.index} className="italic">{match[3]}</em>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function renderMarkdown(content: string): ReactNode[] {
  const lines = content.trim().split("\n");
  const elements: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="font-display font-black uppercase text-2xl sm:text-4xl text-[#f8f8f8] mb-8 mt-0" style={{ letterSpacing: "-0.02em" }}>
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl sm:text-2xl font-bold text-[#f8f8f8] mt-12 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-[#f8f8f8] mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "plaintext";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-[#0d0d0d] border border-[#222] rounded-xl p-5 overflow-x-auto my-6 max-w-full">
          <code className={`language-${lang} font-mono text-sm text-[#a1a1aa] leading-relaxed`}>
            {codeLines.join("\n")}
          </code>
        </pre>
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-[#FD7F2C] pl-5 my-6">
          <p className="text-[#a1a1aa] italic leading-relaxed text-[0.95rem]">
            {parseInline(line.slice(2))}
          </p>
        </blockquote>
      );
    } else if (line.startsWith("*- With Love") || line.startsWith("*- with love")) {
      elements.push(
        <p key={i} className="text-[#FD7F2C] font-mono text-sm mt-10 italic">
          {line.replace(/\*/g, "")}
        </p>
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [line.slice(2)];
      while (i + 1 < lines.length && lines[i + 1].startsWith("- ")) {
        i++;
        items.push(lines[i].slice(2));
      }
      elements.push(
        <ul key={i} className="space-y-2 my-4 pl-4">
          {items.map((item, j) => (
            <li key={`${item}-${j}`} className="text-[#a1a1aa] flex items-start gap-2">
              <span className="text-[#6366f1] mt-1 shrink-0">▸</span>
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
    } else if (line.trim() !== "") {
      elements.push(
        <p key={i} className="text-[#a1a1aa] leading-relaxed my-4">
          {parseInline(line)}
        </p>
      );
    }

    i++;
  }

  return elements;
}

export default function BlogPostClient({ post }: { post: Post }) {
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

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose-custom"
        >
          {renderMarkdown(post.content)}
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
