import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on data analytics, machine learning, business intelligence, and strategy by Ajay Ramineni.",
};

export default function BlogPage() {
  return <BlogClient />;
}
