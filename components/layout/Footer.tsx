import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const socials = [
  { label: "GitHub",   href: "https://github.com/ajayvarmaramineni",       icon: Github   },
  { label: "LinkedIn", href: "https://linkedin.com/in/ajayramineni2808",    icon: Linkedin },
  { label: "Email",    href: "mailto:ajayvarmaramineni1128@gmail.com",       icon: Mail     },
];

const footerLinks = [
  { href: "/about",       label: "About"   },
  { href: "/portfolio",   label: "Work"    },
  { href: "/photography", label: "Lens"    },
  { href: "/blog",        label: "Blog"    },
  { href: "/contact",     label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative z-50 bg-[#080808] border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Single row on desktop, stacked on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">

          {/* Brand */}
          <Link href="/" className="shrink-0">
            <span className="font-display text-lg font-black text-[#f8f8f8]">AJAY RAMINENI</span>
            <span style={{ color: "#FD7F2C" }} className="font-display text-lg font-black">.</span>
          </Link>

          {/* Nav links — wrap on mobile */}
          <nav className="flex items-center flex-wrap gap-x-5 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#71717a] hover:text-[#f8f8f8] text-sm transition-colors duration-200 py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Socials — each with 44px touch target */}
          <div className="flex items-center gap-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex items-center justify-center w-11 h-11 text-[#71717a] hover:text-[#FD7F2C] transition-colors duration-200"
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p className="text-[#3f3f46] text-xs font-mono text-center pb-6 pt-1">
          &copy; {new Date().getFullYear()} Ajay Ramineni. ajayramineni.com
        </p>

      </div>
    </footer>
  );
}
