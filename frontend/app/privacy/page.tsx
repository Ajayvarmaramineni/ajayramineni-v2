"use client";

import Link from "next/link";
import { BarChart2, Shield, Lock, Info } from "lucide-react";

function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const iconSize  = size === "md" ? 22 : 16;
  const textClass = size === "md" ? "text-lg" : "text-sm";

  return (
    <div className="flex items-center gap-2.5">
      <div className={`rounded-xl bg-gradient-to-br from-sky-400 to-violet-500
                       flex items-center justify-center shadow-lg shadow-sky-500/20
                       ${size === "md" ? "w-9 h-9" : "w-7 h-7"}`}>
        <BarChart2 size={iconSize} className="text-white" />
      </div>
      <span className={`font-extrabold tracking-tight ${textClass}`}>
        <span className="text-sky-400">Data</span>
        <span className="text-slate-100">Statz</span>
      </span>
    </div>
  );
}

const sections = [
  { id: "s1", num: "01", title: "Information We Collect" },
  { id: "s2", num: "02", title: "How We Use Your Information" },
  { id: "s3", num: "03", title: "Your Uploaded Data" },
  { id: "s4", num: "04", title: "Data Retention" },
  { id: "s5", num: "05", title: "Cookies & Analytics" },
  { id: "s6", num: "06", title: "Changes to This Policy" },
  { id: "s7", num: "07", title: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(56,189,248,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <nav className="sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-slate-800/60 h-16 flex items-center px-6 justify-between">
        <Link href="/"><Logo size="md" /></Link>
        <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to home
        </Link>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 pb-24">

        {/* Header */}
        <div className="mb-12 pb-10 border-b border-slate-800/60">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20
                          text-sky-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wider">
            <Shield size={10} /> Legal
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-5">
            Privacy <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">Policy</span>
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
            <span>Last updated: March 24, 2026</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>Effective immediately</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>DataStatz · datastatz.com</span>
          </div>
        </div>

        {/* TOC */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 mb-12">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Table of Contents</p>
          <ul className="space-y-2.5">
            {sections.map((s) => (
              <li key={s.id} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20
                                 px-2 py-0.5 rounded min-w-[28px] text-center">{s.num}</span>
                <a href={`#${s.id}`} className="text-slate-300 hover:text-sky-400 text-sm transition-colors">{s.title}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Intro callout */}
        <div className="bg-green-500/5 border border-green-500/15 border-l-4 border-l-green-400
                        rounded-r-xl px-5 py-4 mb-12 flex gap-3 text-sm text-slate-300 leading-relaxed">
          <Info size={15} className="text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-100">Short version:</strong> We don&apos;t sell your data.
            Your uploaded files are processed in-memory and never stored on our servers.
            We only collect what&apos;s needed to run the service.
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-12">
          DataStatz (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This policy explains
          what information we collect, how we use it, and the choices you have. By using DataStatz,
          you agree to this policy.
        </p>

        {/* Sections */}
        <div className="space-y-12">

          <hr className="border-slate-800/60" />

          <section id="s1" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2.5 py-1 rounded-md">01</span>
              <h2 className="text-xl font-bold text-slate-100">Information We Collect</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              We collect information you provide directly and some information automatically when you use our service.
            </p>
            <ul className="space-y-3 mb-5">
              {[
                ["Account info", "your name, email address, and institution when you register."],
                ["Usage data", "pages visited, features used, and general interaction patterns (no granular tracking)."],
                ["Device info", "browser type, OS, and screen resolution for UI compatibility."],
                ["Uploaded files", "CSV or Excel files you upload for analysis (see Section 3 for details)."],
              ].map(([label, desc]) => (
                <li key={label} className="flex items-start gap-3 text-sm text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-2" />
                  <span><strong className="text-slate-200">{label}</strong> - {desc}</span>
                </li>
              ))}
            </ul>
            <div className="bg-sky-500/5 border border-sky-500/15 border-l-4 border-l-sky-400 rounded-r-xl px-5 py-3.5 text-sm text-slate-300">
              We do <strong>not</strong> collect payment information directly. Billing is handled by our payment processor (Stripe) under their own privacy policy.
            </div>
          </section>

          <hr className="border-slate-800/60" />

          <section id="s2" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2.5 py-1 rounded-md">02</span>
              <h2 className="text-xl font-bold text-slate-100">How We Use Your Information</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              We use the information we collect only to operate and improve DataStatz:
            </p>
            <ul className="space-y-2.5 mb-5">
              {[
                "To authenticate your account and maintain your session",
                "To run the analysis pipeline on files you upload",
                "To send transactional emails (account confirmations, support responses)",
                "To detect and fix bugs, improve performance, and build new features",
                "To enforce our Terms of Service and prevent abuse",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-slate-400 text-sm leading-relaxed">
              We will never use your data for advertising, sell it to data brokers, or share it with third parties for their marketing purposes.
            </p>
          </section>

          <hr className="border-slate-800/60" />

          <section id="s3" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2.5 py-1 rounded-md">03</span>
              <h2 className="text-xl font-bold text-slate-100">Your Uploaded Data</h2>
            </div>
            <div className="bg-green-500/5 border border-green-500/15 border-l-4 border-l-green-400 rounded-r-xl px-5 py-4 mb-5 flex gap-3 text-sm text-slate-300">
              <Lock size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-slate-100">Files are never permanently stored.</strong> Your CSV and Excel files are processed entirely in-memory and deleted immediately after your analysis session ends - or within 24 hours at the latest.</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              We do not read, analyze, or retain the contents of your uploaded files beyond what is necessary to generate your analysis report.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              We strongly advise you not to upload files containing sensitive personal information (PII), health records, financial account numbers, or government IDs. DataStatz is a tool for academic and research datasets.
            </p>
          </section>

          <hr className="border-slate-800/60" />

          <section id="s4" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2.5 py-1 rounded-md">04</span>
              <h2 className="text-xl font-bold text-slate-100">Data Retention</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              We keep different categories of data for different periods:
            </p>
            <ul className="space-y-3">
              {[
                ["Account data", "kept while your account is active and deleted within 30 days of account deletion."],
                ["Uploaded files", "deleted immediately after your session or within 24 hours. Never persisted to disk."],
                ["Analysis results", "stored in your browser's localStorage only. We do not store them server-side."],
                ["Server logs", "retained for up to 30 days for security and debugging, then purged."],
              ].map(([label, desc]) => (
                <li key={label} className="flex items-start gap-3 text-sm text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-2" />
                  <span><strong className="text-slate-200">{label}</strong> - {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-slate-800/60" />

          <section id="s5" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2.5 py-1 rounded-md">05</span>
              <h2 className="text-xl font-bold text-slate-100">Cookies &amp; Analytics</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              DataStatz uses minimal cookies - only those strictly necessary for authentication and session management. We do not use advertising cookies or third-party tracking pixels.
            </p>
            <div className="bg-sky-500/5 border border-sky-500/15 border-l-4 border-l-sky-400 rounded-r-xl px-5 py-3.5 text-sm text-slate-300 mb-4">
              We do not currently use Google Analytics, Mixpanel, or any behavioral analytics platform. If this changes, we will update this policy and notify users by email.
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              You can clear cookies at any time through your browser settings. Note that clearing cookies will sign you out of your account.
            </p>
          </section>

          <hr className="border-slate-800/60" />

          <section id="s6" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2.5 py-1 rounded-md">06</span>
              <h2 className="text-xl font-bold text-slate-100">Changes to This Policy</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              We may update this privacy policy from time to time. When we do, we will revise the &quot;Last updated&quot; date at the top of this page. For material changes, we will notify registered users via email at least 7 days before the change takes effect.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your continued use of DataStatz after changes become effective constitutes acceptance of the revised policy.
            </p>
          </section>

          <hr className="border-slate-800/60" />

          <section id="s7" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/25 px-2.5 py-1 rounded-md">07</span>
              <h2 className="text-xl font-bold text-slate-100">Contact Us</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Questions, concerns, or requests regarding this privacy policy? We&apos;re here to help.
            </p>
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-7">
              <h3 className="text-base font-bold text-slate-100 mb-2">DataStatz Analytics Team</h3>
              <p className="text-slate-400 text-sm mb-5">We aim to respond to all privacy inquiries within 14 business days.</p>
              <a href="mailto:analytics@datastatz.com"
                className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/25 hover:border-sky-500/50
                           text-sky-400 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                analytics@datastatz.com
              </a>
            </div>
          </section>

        </div>
      </div>

      <footer className="relative z-10 border-t border-slate-800/60 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="/"        className="hover:text-slate-300 transition-colors">Home</Link>
            <Link href="/about"   className="hover:text-slate-300 transition-colors">About</Link>
            <Link href="/login"   className="hover:text-slate-300 transition-colors">Sign In</Link>
            <Link href="/privacy" className="text-sky-400 border-b border-sky-400/30 pb-px">Privacy Policy</Link>
          </div>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} DataStatz · datastatz.com</p>
        </div>
      </footer>
    </div>
  );
}
