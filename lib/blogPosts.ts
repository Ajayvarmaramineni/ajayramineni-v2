import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  category: "article" | "nights" | "dear-stranger";
  featured: boolean;
};

function getAllSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function readPost(slug: string): BlogPost {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    date: data.date,
    readTime: data.readTime,
    tag: data.tag,
    category: data.category,
    featured: data.featured ?? false,
  };
}

export function blogPosts(): BlogPost[] {
  return getAllSlugs().map(readPost);
}

export function getPostSource(slug: string): string {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);
  return content;
}

export function getTopPosts(n = 4): BlogPost[] {
  return blogPosts().slice(0, n);
}

export function getArticles(): BlogPost[] {
  return blogPosts().filter((p) => p.category === "article");
}

export function getNightsPosts(): BlogPost[] {
  return blogPosts().filter((p) => p.category === "nights");
}

export function getDearStrangerPosts(): BlogPost[] {
  return blogPosts().filter((p) => p.category === "dear-stranger");
}
