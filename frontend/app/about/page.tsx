"use client";

import Link from "next/link";
import { BarChart2, Target, Users, Zap, BookOpen, ArrowRight, Mail } from "lucide-react";

function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconSize  = size === "lg" ? 28 : size === "md" ? 22 : 16;
  const textClass = size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm";

  return (
    <div className="flex items-center gap-2.5">
      <div className={`rounded-xl bg-gradient-to-br from-sky-400 to-violet-500
                       flex items-center justify-center shadow-lg shadow-sky-500/20
                       ${size === "lg" ? "w-12 h-12" : size === "md" ? "w-9 h-9" : "w-7 h-7"}`}>
        <BarChart2 size={iconSize} className="text-white" />
      </div>
      <span className={`font-extrabold tracking-tight ${textClass}`}>
        <span className="text-sky-400">Data</span>
        <span className="text-slate-100">Statz</span>
      </span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(56,189,248,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-slate-800/60 h-16 flex items-center px-6 justify-between">
        <Link href="/"><Logo size="md" /></Link>
        <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to home
        </Link>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            Our story
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              DataStatz
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            We built the tool we wished existed when we were students - one that actually explains your data without making you write a single line of code.
          </p>
        </div>

        {/* Mission card */}
        <div className="bg-gradient-to-br from-sky-950/50 to-violet-950/40 border border-sky-700/30 rounded-3xl p-10 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-sky-500/3 pointer-events-none rounded-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center">
                <Target size={20} className="text-sky-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">Our mission</h2>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed">
              Data analysis shouldn&apos;t require a statistics degree or a paid Coursera subscription.
              DataStatz exists to give every student, researcher, and curious person instant access
              to the kind of analysis that used to take hours in Python or SPSS.
            </p>
          </div>
        </div>

        {/* Why we built it */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Why we built it</h2>
          <div className="space-y-5 text-slate-400 text-base leading-relaxed">
            <p>
              Most data tools are either too expensive, too complex, or built for data scientists  - 
              not for the undergraduate writing a dissertation at midnight or the research assistant
              who just got handed a 2,000-row spreadsheet and no instructions.
            </p>
            <p>
              We watched students spend hours Googling how to run a t-test, copy-pasting code
              they didn&apos;t understand, and second-guessing whether their data was even clean enough
              to analyse. DataStatz was built to remove every single one of those friction points.
            </p>
            <p>
              Upload a file. Get answers. That&apos;s it.
            </p>
          </div>
        </section>

        {/* What makes it different */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-100 mb-8">What makes DataStatz different</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: Zap,
                color: "sky",
                title: "Built for speed",
                desc: "The full pipeline - EDA, cleaning, hypothesis tests, scope, insights - runs in parallel and finishes in under 10 seconds.",
              },
              {
                icon: BookOpen,
                color: "violet",
                title: "Plain English, always",
                desc: "No cryptic p-values left unexplained. Every result is paired with a plain-English interpretation anyone can understand.",
              },
              {
                icon: Users,
                color: "green",
                title: "Student-first pricing",
                desc: "We keep costs low intentionally. Students shouldn't have to pay enterprise prices just to analyse a dataset for class.",
              },
              {
                icon: BarChart2,
                color: "amber",
                title: "No install, no code",
                desc: "Nothing to set up. Works entirely in the browser. If you can open a spreadsheet, you can use DataStatz.",
              },
            ].map((item) => {
              const colorMap: Record<string, string> = {
                sky:    "bg-sky-500/10 border-sky-700/40 text-sky-400",
                violet: "bg-violet-500/10 border-violet-700/40 text-violet-400",
                green:  "bg-green-500/10 border-green-700/40 text-green-400",
                amber:  "bg-amber-500/10 border-amber-700/40 text-amber-400",
              };
              return (
                <div key={item.title} className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 flex gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[item.color]}`}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100 mb-2">{item.title}</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Affordable section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-green-950/40 to-slate-900/60 border border-green-700/25 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Affordable by design</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Academic licenses for tools like SPSS or Stata run into hundreds of dollars per year.
              Python is free but comes with a steep learning curve. We think there&apos;s a better way.
            </p>
            <p className="text-slate-400 leading-relaxed">
              DataStatz starts free with no credit card required. Paid plans are priced with students
              in mind - not enterprise teams. We genuinely believe affordable access to data tools
              makes for better science, better research, and better decisions.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Get in touch</h2>
          <p className="text-slate-400 leading-relaxed mb-6">
            Got feedback, a feature request, or just want to say hi? We read every message.
          </p>
          <a href="mailto:analytics@datastatz.com"
            className="inline-flex items-center gap-3 bg-sky-500/10 border border-sky-500/25 hover:border-sky-500/50
                       text-sky-400 font-semibold px-6 py-3 rounded-xl transition-all">
            <Mail size={18} />
            analytics@datastatz.com
          </a>
        </section>

        {/* CTA */}
        <div className="text-center bg-slate-900/50 border border-slate-700/50 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Ready to try it?</h2>
          <p className="text-slate-400 mb-8">Upload a file and get your first analysis in seconds. No signup required.</p>
          <Link href="/login"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 transition-all
                       text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-xl shadow-sky-500/20 hover:-translate-y-0.5">
            Get Started Free
            <ArrowRight size={16} />
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 py-10 px-6 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
            <a href="/#features" className="hover:text-slate-300 transition-colors">Features</a>
            <Link href="/about" className="text-sky-400">About</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Sign In</Link>
          </div>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} DataStatz · datastatz.com</p>
        </div>
      </footer>
    </div>
  );
}
