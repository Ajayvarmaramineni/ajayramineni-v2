import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import BlogPostClient from "./BlogPostClient";
import { blogPosts, getPostSource } from "@/lib/blogPosts";
import { mdxComponents } from "@/lib/mdxComponents";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts().find((p) => p.slug === params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Ajay Ramineni`,
      description: post.excerpt,
    },
  };
}

export function generateStaticParams() {
  return blogPosts().map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts().find((p) => p.slug === params.slug);
  if (!post) notFound();

  const source = getPostSource(params.slug);

  return (
    <BlogPostClient post={post}>
      <MDXRemote source={source} components={mdxComponents} />
    </BlogPostClient>
  );
}
