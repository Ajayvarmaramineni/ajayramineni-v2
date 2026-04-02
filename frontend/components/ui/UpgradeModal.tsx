"use client";

import { X, Sparkles, Share2, Wand2, FlaskConical, Table } from "lucide-react";

interface UpgradeModalProps {
  open:     boolean;
  onClose:  () => void;
  feature?: string; // which feature triggered the modal
}

const PRO_FEATURES = [
  {
    icon:  Share2,
    color: "text-sky-400",
    bg:    "bg-sky-500/10 border-sky-500/20",
    title: "Shareable Reports",
    desc:  "Generate a public link to share your full analysis with teammates, professors, or clients.",
  },
  {
    icon:  Wand2,
    color: "text-violet-400",
    bg:    "bg-violet-500/10 border-violet-500/20",
    title: "Interactive Cleaning",
    desc:  "Apply fixes directly — drop columns, fill nulls, remove duplicates — then re-run analysis on the cleaned data.",
  },
  {
    icon:  FlaskConical,
    color: "text-rose-400",
    bg:    "bg-rose-500/10 border-rose-500/20",
    title: "Predictions (AutoML)",
    desc:  "Pick a target column and get instant ML results — feature importance, accuracy score, and model diagnostics.",
  },
  {
    icon:  Table,
    color: "text-green-400",
    bg:    "bg-green-500/10 border-green-500/20",
    title: "Google Sheets Import",
    desc:  "Paste a Google Sheets URL to analyze live data without downloading anything.",
  },
];

export default function UpgradeModal({ open, onClose, feature }: UpgradeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">

        {/* Header gradient */}
        <div className="relative overflow-hidden px-6 pt-6 pb-5 bg-gradient-to-br from-sky-500/20 via-violet-500/10 to-transparent border-b border-slate-700/80">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.10),transparent_60%)]" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="relative flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">DataStatz Pro</p>
              <h2 className="text-lg font-extrabold text-slate-100 leading-tight">Unlock Pro Features</h2>
            </div>
          </div>

          {feature ? (
            <p className="relative text-sm text-slate-300 mt-1">
              <span className="text-sky-400 font-semibold">{feature}</span> is a Pro feature.
              Upgrade to unlock it and everything below.
            </p>
          ) : (
            <p className="relative text-sm text-slate-400">
              Unlock powerful features for deeper analysis, collaboration, and predictions.
            </p>
          )}
        </div>

        {/* Feature list */}
        <div className="px-5 py-4 space-y-2.5">
          {PRO_FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
            <div
              key={title}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border ${bg}`}
            >
              <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={13} className={color} />
              </div>
              <div>
                <p className={`text-sm font-semibold leading-snug ${color}`}>{title}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-5 pb-5">
          <a
            href="mailto:analytics@datastatz.com?subject=DataStatz Pro Access Request"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                       bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-400 hover:to-violet-400
                       text-white font-bold text-sm transition-all shadow-lg shadow-sky-500/20"
          >
            <Sparkles size={15} /> Get Pro Access
          </a>
          <p className="text-center text-xs text-slate-500 mt-2">
            Early access · We&apos;ll get back to you within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}
