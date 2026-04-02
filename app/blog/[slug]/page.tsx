import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";
import { blogPosts } from "@/lib/blogPosts";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post Not Found" };
  const url = `https://ajayramineni.com/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: `${post.title} | Ajay Ramineni`,
      description: post.excerpt,
      url,
      images: [{ url: "/images/Aj.jpg", width: 1200, height: 630, alt: "Ajay Ramineni" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Ajay Ramineni`,
      description: post.excerpt,
      images: ["/images/Aj.jpg"],
    },
  };
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();
  return <BlogPostClient post={post} />;
}
