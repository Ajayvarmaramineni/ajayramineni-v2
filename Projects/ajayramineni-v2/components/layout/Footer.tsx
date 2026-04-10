import Link from "next/link";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/Ajayvarmaramineni",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/ajayramineni2808",
    icon: Linkedin,
  },
  {
    label: "Email",
    href: "mailto:ajayvarmaramineni1128@gmail.com",
    icon: Mail,
  },
];

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Work" },
  { href: "/photography", label: "Lens" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1a1a1a] bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-black text-[#f8f8f8]">
                AJAY RAMINENI
              </span>
            </Link>
            <p className="text-[#71717a] text-sm leading-relaxed max-w-xs">
              MS Business Analytics @ WPI · Turning raw data into decisions that matter.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="section-label mb-4 text-xs">Navigate</p>
            <ul className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#71717a] hover:text-[#f8f8f8] text-sm transition-colors duration-200 link-hover"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="section-label mb-4 text-xs">Connect</p>
            <div className="flex flex-col gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#71717a] hover:text-[#6366f1] text-sm transition-colors duration-200 group"
                >
                  <s.icon size={14} className="group-hover:scale-110 transition-transform" />
                  {s.label}
                  <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="divider mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#52525b] text-xs font-mono">
            © {year} Ajay Ramineni. Built with Next.js & Vercel.
          </p>
          <p className="text-[#52525b] text-xs font-mono">
            Worcester, MA · Open to opportunities
          </p>
        </div>
      </div>
    </footer>
  );
}
