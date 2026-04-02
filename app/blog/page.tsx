import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on data analytics, machine learning, business intelligence, and strategy by Ajay Ramineni.",
  openGraph: {
    title: "Blog | Ajay Ramineni",
    description:
      "Articles on data analytics, machine learning, business intelligence, and strategy.",
    url: "https://ajayramineni.com/blog",
    images: [{ url: "/images/Aj.jpg", width: 1200, height: 630, alt: "Ajay Ramineni Blog" }],
  },
  twitter: {
    title: "Blog | Ajay Ramineni",
    description:
      "Articles on data analytics, ML, business intelligence, and strategy.",
    images: ["/images/Aj.jpg"],
  },
  alternates: { canonical: "https://ajayramineni.com/blog" },
};

export default function BlogPage() {
  return <BlogClient />;
}
