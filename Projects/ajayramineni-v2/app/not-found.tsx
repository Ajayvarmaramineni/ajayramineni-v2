import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-xs text-[#6366f1] mb-4 tracking-widest">
          404
        </p>
        <h1
          className="font-display font-black uppercase text-[clamp(3rem,7vw,6rem)] text-[#f8f8f8] leading-none mb-6"
          style={{ letterSpacing: "-0.03em" }}
        >
          PAGE NOT<br />
          <span className="gradient-text-indigo">FOUND</span>
        </h1>
        <p className="text-[#71717a] mb-10">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-primary group">
          <ArrowLeft
            size={15}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Go Home
        </Link>
      </div>
    </div>
  );
}
