import type { MDXComponents } from "mdx/types";
import Image from "next/image";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1
      className="font-display font-black uppercase text-2xl sm:text-4xl text-[#f8f8f8] mb-8 mt-0"
      style={{ letterSpacing: "-0.02em" }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-bold text-[#f8f8f8] mt-12 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-[#f8f8f8] mt-8 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[#a1a1aa] leading-relaxed my-4 text-justify">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="text-[#f8f8f8] font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#FD7F2C] pl-5 my-6">
      <div className="text-[#a1a1aa] italic leading-relaxed text-[0.95rem]">
        {children}
      </div>
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="space-y-2 my-4 pl-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-2 my-4 pl-4 list-decimal">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-[#a1a1aa] flex items-start gap-2">
      <span className="text-[#6366f1] mt-1 shrink-0">▸</span>
      <span>{children}</span>
    </li>
  ),
  pre: ({ children }) => (
    <pre className="bg-[#0d0d0d] border border-[#222] rounded-xl p-5 overflow-x-auto my-6 max-w-full">
      {children}
    </pre>
  ),
  code: ({ children, className }) => (
    <code className={`${className ?? ""} font-mono text-sm text-[#a1a1aa] leading-relaxed`}>
      {children}
    </code>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      loading="lazy"
      className="rounded-lg max-w-full h-auto my-6 border border-[#222]"
    />
  ),
  hr: () => <hr className="border-[#1a1a1a] my-10" />,
};
