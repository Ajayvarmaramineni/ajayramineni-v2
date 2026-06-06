import type { Metadata } from "next";
import BlogClient from "./BlogClient";
import { getArticles, getNightsPosts, getDearStrangerPosts } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on data analytics, machine learning, business intelligence, and strategy by Ajay Ramineni.",
  openGraph: {
    title: "Blog | Ajay Ramineni",
    description:
      "Articles on data analytics, machine learning, business intelligence, and strategy.",
    url: "https://ajayramineni.com/blog",
  },
  twitter: {
    title: "Blog | Ajay Ramineni",
    description:
      "Articles on data analytics, ML, business intelligence, and strategy.",
  },
  alternates: { canonical: "https://ajayramineni.com/blog" },
};

export default function BlogPage() {
  const articles = getArticles();
  const nightsPosts = getNightsPosts();
  const dearStrangerPosts = getDearStrangerPosts();

  return (
    <BlogClient
      articles={articles}
      nightsPosts={nightsPosts}
      dearStrangerPosts={dearStrangerPosts}
    />
  );
}
