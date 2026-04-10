"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Send, CheckCircle, AlertCircle } from "lucide-react";

type FormState = "idle" | "sending" | "success" | "error";

export default function ContactClient() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");

    // GA4 contact form event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "contact_form_submit", {
        event_category: "engagement",
        event_label: form.subject,
      });
    }

    try {
      // Using EmailJS — configure with your IDs
      const emailjs = await import("emailjs-com");
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID",
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY"
      );
      setState("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setState("error");
    }
  };

  const socials = [
    {
      label: "LinkedIn",
      value: "linkedin.com/in/ajayramineni2808",
      href: "https://linkedin.com/in/ajayramineni2808",
      icon: Linkedin,
    },
    {
      label: "GitHub",
      value: "github.com/Ajayvarmaramineni",
      href: "https://github.com/Ajayvarmaramineni",
      icon: Github,
    },
    {
      label: "Email",
      value: "ajayvarmaramineni1128@gmail.com",
      href: "mailto:ajayvarmaramineni1128@gmail.com",
      icon: Mail,
    },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section-label mb-6"
          >
            Get in Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black uppercase text-[clamp(3rem,7vw,6rem)] leading-none"
            style={{ letterSpacing: "-0.03em" }}
          >
            LET&apos;S BUILD<br />
            <span className="gradient-text-indigo">SOMETHING</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <p className="text-[#a1a1aa] text-lg leading-relaxed">
              I&apos;m actively looking for full-time opportunities in data analytics,
              business intelligence, and ML. I&apos;m also open to freelance projects,
              consulting, and interesting collaborations.
            </p>

            <div className="space-y-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-noir p-4 flex items-center gap-4 group"
                >
                  <div className="p-2 bg-[rgba(99,102,241,0.1)] rounded-lg">
                    <s.icon size={16} className="text-[#6366f1]" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-[#52525b]">{s.label}</p>
                    <p className="text-[#d4d4d8] text-sm group-hover:text-[#818cf8] transition-colors">
                      {s.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="p-5 border border-[#222] rounded-xl bg-[#0d0d0d]">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs text-[#71717a]">
                  Available for work
                </span>
              </div>
              <p className="text-[#52525b] text-xs font-mono">
                Graduating May 2025 · Open to full-time roles
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            {state === "success" ? (
              <div className="card-noir p-10 text-center">
                <CheckCircle size={40} className="text-emerald-400 mx-auto mb-4" />
                <h3 className="text-[#f8f8f8] text-xl font-semibold mb-2">
                  Message sent!
                </h3>
                <p className="text-[#71717a]">
                  Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setState("idle")}
                  className="btn-outline mt-6 text-sm"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-[#52525b] mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-[#f8f8f8] text-sm placeholder:text-[#52525b] focus:border-[#6366f1] focus:outline-none transition-colors"
                      placeholder="Ajay Ramineni"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[#52525b] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-[#f8f8f8] text-sm placeholder:text-[#52525b] focus:border-[#6366f1] focus:outline-none transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-xs text-[#52525b] mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-[#f8f8f8] text-sm placeholder:text-[#52525b] focus:border-[#6366f1] focus:outline-none transition-colors"
                    placeholder="Job opportunity / Collaboration / Hello"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-[#52525b] mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-[#f8f8f8] text-sm placeholder:text-[#52525b] focus:border-[#6366f1] focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about the opportunity, project, or just say hi..."
                  />
                </div>

                {state === "error" && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={14} />
                    Something went wrong. Try emailing directly at ajayvarmaramineni1128@gmail.com
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {state === "sending" ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
                <p className="text-[#52525b] text-xs font-mono text-center">
                  * To activate the form, add EmailJS keys to .env.local
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
