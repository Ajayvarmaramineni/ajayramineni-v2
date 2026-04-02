"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, RefreshCw, Download, MessageSquare, Send, CheckCircle2, X, ChevronDown, Check, Lock, Share2, Sparkles } from "lucide-react";
import UpgradeModal from "@/components/ui/UpgradeModal";
import { runFullPipeline, createShare, trackAnalysis } from "@/lib/api";
import { TABS, type DashTab } from "@/lib/helpers";
import OverviewTab     from "@/components/dashboard/OverviewTab";
import CleaningTab     from "@/components/dashboard/CleaningTab";
import EdaTab          from "@/components/dashboard/EdaTab";
import ScopeTab        from "@/components/dashboard/ScopeTab";
import InsightsTab     from "@/components/dashboard/InsightsTab";
import DataPreviewTab  from "@/components/dashboard/DataPreviewTab";
import PredictionsTab           from "@/components/dashboard/PredictionsTab";
import InteractiveCleaningPanel from "@/components/dashboard/InteractiveCleaningPanel";
import DashboardTab             from "@/components/dashboard/DashboardTab";


export interface PipelineResult {
  analyze:  Record<string, unknown>;
  cleaning: Record<string, unknown>;
  eda:      Record<string, unknown>;
  scope:    Record<string, unknown>;
  insights: Record<string, unknown>;
}


function TabBar({
  active,
  isPro,
  onChange,
  onProClick,
}: {
  active:      DashTab;
  isPro:       boolean;
  onChange:    (t: DashTab) => void;
  onProClick:  (label: string) => void;
}) {
  return (
    <div className="tab-bar overflow-x-auto flex-shrink-0">
      {TABS.map((t) => {
        const locked = t.pro && !isPro;
        return (
          <button
            key={t.id}
            onClick={() => locked ? onProClick(t.label) : onChange(t.id)}
            className={
              locked
                ? "tab-item opacity-50 flex items-center gap-1"
                : active === t.id
                  ? "tab-item-active flex items-center gap-1"
                  : "tab-item flex items-center gap-1"
            }
            title={locked ? `${t.label} · Pro feature` : t.label}
          >
            {t.label}
            {locked && <Lock size={10} className="flex-shrink-0" />}
            {t.pro && isPro && <Sparkles size={10} className="text-sky-400 flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}


function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <Loader2 size={40} className="text-sky-400 animate-spin" />
      <div className="text-center">
        <p className="text-slate-200 font-semibold">Running analysis pipeline…</p>
        <p className="text-slate-400 text-sm mt-1">
          EDA · Cleaning · Scope · Insights - this takes about 5–10 seconds
        </p>
      </div>
      {/* Animated step list */}
      <div className="space-y-2 mt-2">
        {["Parsing dataset", "Running EDA", "Checking data quality", "Assessing scope", "Generating insights"].map(
          (step, i) => (
            <div
              key={step}
              className="flex items-center gap-3 text-sm text-slate-400"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse-dot" />
              {step}
            </div>
          )
        )}
      </div>
    </div>
  );
}


function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-14 h-14 rounded-full bg-red-900/40 border border-red-700 flex items-center justify-center">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <div className="text-center">
        <p className="text-slate-100 font-semibold">Analysis failed</p>
        <p className="text-slate-400 text-sm mt-1 max-w-xs">{message}</p>
      </div>
      <button onClick={onRetry} className="btn-secondary gap-2">
        <RefreshCw size={16} /> Try again
      </button>
    </div>
  );
}


function FeedbackBanner() {
  const [open,       setOpen]       = useState(false);
  const [dismissed,  setDismissed]  = useState(false);
  const [email,      setEmail]      = useState("");
  const [feedback,   setFeedback]   = useState("");
  const [sending,    setSending]    = useState(false);
  const [sent,       setSent]       = useState(false);
  const [err,        setErr]        = useState<string | null>(null);
  const textareaRef  = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea when panel opens
  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  // Pre-fill email from localStorage session if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem("datastatz_user");
      if (raw) {
        const u = JSON.parse(raw) as { email?: string };
        if (u.email) setEmail(u.email);
      }
    } catch { /* ignore */ }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) { setErr("Please enter some feedback."); return; }
    setSending(true);
    setErr(null);
    try {
      const res = await fetch("/api/mailer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "feedback", email: email.trim() || undefined, feedback: feedback.trim() }),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (!data.success) throw new Error(data.error ?? "Something went wrong");
      setSent(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Could not send feedback");
    } finally {
      setSending(false);
    }
  }

  if (dismissed) return null;

  return (
    <div className="mt-10 mb-4">
      {!open && !sent && (
        <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl
                        bg-slate-800/60 border border-slate-700">
          <div className="flex items-center gap-3">
            <MessageSquare size={18} className="text-sky-400 flex-shrink-0" />
            <p className="text-sm text-slate-300">
              Found this useful? We would love to hear your feedback.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setOpen(true)}
              className="btn-primary text-xs px-3 py-1.5"
            >
              Give feedback
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {open && !sent && (
        <div className="rounded-xl bg-slate-800/60 border border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-sky-400" />
              <span className="text-sm font-semibold text-slate-200">Share your feedback</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <form onSubmit={submit} className="px-5 py-4 space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Email <span className="text-slate-500">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2
                           text-sm text-slate-200 placeholder-slate-500
                           focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Feedback <span className="text-red-400">*</span>
              </label>
              <textarea
                ref={textareaRef}
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="What did you think? What could be better?"
                rows={4}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2
                           text-sm text-slate-200 placeholder-slate-500 resize-none
                           focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            {err && <p className="text-red-400 text-xs">{err}</p>}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
              >
                {sending ? (
                  <><Loader2 size={14} className="animate-spin" /> Sending…</>
                ) : (
                  <><Send size={14} /> Send feedback</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {sent && (
        <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl
                        bg-green-900/20 border border-green-800">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-300">
              Thanks for your feedback - we really appreciate it!
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-green-600 hover:text-green-400 transition-colors flex-shrink-0"
            title="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}


// ── Print styles (inline, no Tailwind, no recharts — always renders correctly) ─

const PS = {
  page:    { fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#1e293b", background: "white", padding: "0 48px" } as React.CSSProperties,
  cover:   { borderBottom: "2px solid #0ea5e9", paddingBottom: 24, marginBottom: 32 } as React.CSSProperties,
  logo:    { fontSize: 20, fontWeight: 900, color: "#0ea5e9" } as React.CSSProperties,
  sub:     { fontSize: 10, color: "#64748b" } as React.CSSProperties,
  h1:      { fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "20px 0 4px" } as React.CSSProperties,
  section: { marginBottom: 36, pageBreakBefore: "always" as const },
  sHdr:    { display: "flex", alignItems: "center", gap: 8, borderBottom: "1.5px solid #e2e8f0", paddingBottom: 8, marginBottom: 16 } as React.CSSProperties,
  badge:   (bg: string) => ({ width: 22, height: 22, borderRadius: 4, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 700, flexShrink: 0 } as React.CSSProperties),
  h2:      { fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 } as React.CSSProperties,
  table:   { width: "100%", borderCollapse: "collapse" as const, fontSize: 11, marginBottom: 16 } as React.CSSProperties,
  th:      { background: "#f8fafc", padding: "5px 10px", textAlign: "left" as const, fontWeight: 600, borderBottom: "1px solid #e2e8f0", color: "#475569", fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.04em" } as React.CSSProperties,
  td:      { padding: "5px 10px", borderBottom: "1px solid #f1f5f9", color: "#334155", verticalAlign: "top" as const } as React.CSSProperties,
  statRow: { display: "flex", gap: 12, flexWrap: "wrap" as const, marginBottom: 16 } as React.CSSProperties,
  stat:    { flex: "1 1 120px", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px" } as React.CSSProperties,
  statLbl: { fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "#94a3b8", marginBottom: 4 } as React.CSSProperties,
  statVal: { fontSize: 18, fontWeight: 800, color: "#0f172a" } as React.CSSProperties,
  pill:    (ok: boolean) => ({ display: "inline-block", padding: "1px 8px", borderRadius: 99, fontSize: 10, fontWeight: 600, background: ok ? "#dcfce7" : "#fee2e2", color: ok ? "#166534" : "#991b1b" } as React.CSSProperties),
  text:    { fontSize: 12, color: "#475569", lineHeight: 1.7, margin: "0 0 6px" } as React.CSSProperties,
  footer:  { marginTop: 40, paddingTop: 12, borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "#94a3b8" } as React.CSSProperties,
};

function fmt(v: unknown, dp = 2): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "number") return isFinite(v) ? (Number.isInteger(v) ? String(v) : v.toFixed(dp)) : "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}


// ── Section renderers ──────────────────────────────────────────────────────────

function PrintOverview({ data }: { data: Record<string, unknown> }) {
  // dataset_summary holds row_count, column_count, total_missing, missing_pct, duplicate_rows
  const summary    = (data.dataset_summary   ?? {}) as Record<string, unknown>;
  const dupSummary = (data.duplicate_summary ?? {}) as Record<string, unknown>;
  const cols = (data.column_summary ?? []) as { column: string; dtype: string; semantic_type?: string; missing_count?: number; missing_pct?: number; unique_count?: number }[];
  const rowCount    = (summary.row_count    as number) ?? 1;
  // duplicate_rows is present in dataset_summary; duplicate_summary also carries it as backup
  const dupRows     = (summary.duplicate_rows as number) ?? (dupSummary.duplicate_rows as number) ?? 0;
  const missingPct  = (summary.missing_pct  as number) ?? 0;
  // Simple quality score: penalise 2pt per 1% missing data and 0.5pt per 1% duplicates
  const qualityScore = Math.max(0, Math.round(100 - missingPct * 2 - (dupRows / Math.max(rowCount, 1)) * 100 * 0.5));
  return (
    <>
      <div style={PS.statRow}>
        {[
          { label: "Rows",          val: fmt(summary.row_count,    0) },
          { label: "Columns",       val: fmt(summary.column_count, 0) },
          { label: "Missing Cells", val: fmt(summary.total_missing, 0) },
          { label: "Duplicates",    val: fmt(dupRows, 0) },
          { label: "Quality Score", val: `${qualityScore}%` },
        ].map(({ label, val }) => (
          <div key={label} style={PS.stat}>
            <div style={PS.statLbl}>{label}</div>
            <div style={PS.statVal}>{val}</div>
          </div>
        ))}
      </div>
      {cols.length > 0 && (
        <table style={PS.table}>
          <thead>
            <tr>
              {["#","Column","Type","Semantic","Missing %","Unique"].map(h => <th key={h} style={PS.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {cols.map((c, i) => (
              <tr key={c.column}>
                <td style={PS.td}>{i + 1}</td>
                <td style={{ ...PS.td, fontWeight: 600 }}>{c.column}</td>
                <td style={PS.td}>{c.dtype ?? "—"}</td>
                <td style={PS.td}>{c.semantic_type ?? "—"}</td>
                <td style={PS.td}>{fmt(c.missing_pct)}%</td>
                <td style={PS.td}>{fmt(c.unique_count, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function PrintCleaning({ data }: { data: Record<string, unknown> }) {
  // Backend returns `detail` on each issue; keep `description` as a fallback for forward compatibility
  const issues  = (data.issues             ?? []) as { type?: string; severity?: string; column?: string; detail?: string; description?: string; count?: number }[];
  const actions = (data.recommended_actions ?? []) as { action?: string; reason?: string; column?: string; priority?: string }[];
  const score   = data.quality_score as number;
  return (
    <>
      {score !== undefined && (
        <div style={PS.statRow}>
          <div style={PS.stat}>
            <div style={PS.statLbl}>Quality Score</div>
            <div style={PS.statVal}>{Math.round(score)}%</div>
          </div>
          <div style={PS.stat}>
            <div style={PS.statLbl}>Issues Found</div>
            <div style={PS.statVal}>{issues.length}</div>
          </div>
        </div>
      )}
      {issues.length > 0 && (
        <>
          <p style={{ ...PS.text, fontWeight: 600 }}>Issues</p>
          <table style={PS.table}>
            <thead><tr>{["Severity","Column","Description","Count"].map(h=><th key={h} style={PS.th}>{h}</th>)}</tr></thead>
            <tbody>
              {issues.map((iss, i) => (
                <tr key={i}>
                  <td style={PS.td}><span style={PS.pill(iss.severity === "low" || iss.severity === "info")}>{iss.severity ?? "—"}</span></td>
                  <td style={PS.td}>{iss.column ?? "—"}</td>
                  <td style={PS.td}>{iss.detail ?? iss.description ?? "—"}</td>
                  <td style={PS.td}>{fmt(iss.count, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {actions.length > 0 && (
        <>
          <p style={{ ...PS.text, fontWeight: 600 }}>Recommended Actions</p>
          <table style={PS.table}>
            <thead><tr>{["Priority","Column","Action","Reason"].map(h=><th key={h} style={PS.th}>{h}</th>)}</tr></thead>
            <tbody>
              {actions.map((a, i) => (
                <tr key={i}>
                  <td style={PS.td}>{a.priority ?? "—"}</td>
                  <td style={PS.td}>{a.column ?? "—"}</td>
                  <td style={PS.td}>{a.action ?? "—"}</td>
                  <td style={PS.td}>{a.reason ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

function PrintEda({ data }: { data: Record<string, unknown> }) {
  const numeric = (data.numeric_summaries ?? data.numeric_columns ?? []) as { column: string; mean?: number; median?: number; std?: number; min?: number; max?: number; skewness?: number }[];
  const categorical = (data.categorical_summaries ?? data.categorical_columns ?? []) as { column: string; unique_count?: number; top_categories?: { value: string; count: number }[]; top_values?: { value: string; count: number }[] }[];
  const corrObj = (data.correlations ?? {}) as Record<string, unknown>;
  const strong = ((corrObj.strong_pairs ?? data.strong_correlations ?? []) as { col_a: string; col_b: string; r: number }[]);
  const outliers = (data.outlier_analysis ?? []) as { column: string; outlier_count: number; outlier_pct: number; lower_bound: number; upper_bound: number }[];
  const groupComps = (data.group_comparisons ?? []) as { grouping_col: string; group_a: string; group_b: string; numeric_col: string; mean_a: number; mean_b: number; count_a: number; count_b: number }[];
  return (
    <>
      {numeric.length > 0 && (
        <>
          <p style={{ ...PS.text, fontWeight: 600 }}>Numeric Columns</p>
          <table style={PS.table}>
            <thead><tr>{["Column","Mean","Median","Std Dev","Min","Max","Skewness"].map(h=><th key={h} style={PS.th}>{h}</th>)}</tr></thead>
            <tbody>
              {numeric.map((n) => (
                <tr key={n.column}>
                  <td style={{ ...PS.td, fontWeight: 600 }}>{n.column}</td>
                  <td style={PS.td}>{fmt(n.mean)}</td>
                  <td style={PS.td}>{fmt(n.median)}</td>
                  <td style={PS.td}>{fmt(n.std)}</td>
                  <td style={PS.td}>{fmt(n.min)}</td>
                  <td style={PS.td}>{fmt(n.max)}</td>
                  <td style={PS.td}>{fmt(n.skewness)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {categorical.length > 0 && (
        <>
          <p style={{ ...PS.text, fontWeight: 600 }}>Categorical Columns</p>
          <table style={PS.table}>
            <thead><tr>{["Column","Unique Values","Top Categories"].map(h=><th key={h} style={PS.th}>{h}</th>)}</tr></thead>
            <tbody>
              {categorical.map((c) => {
                const tops = (c.top_categories ?? c.top_values ?? []).slice(0, 5).map(t => `${t.value} (${t.count})`).join(", ");
                return (
                  <tr key={c.column}>
                    <td style={{ ...PS.td, fontWeight: 600 }}>{c.column}</td>
                    <td style={PS.td}>{fmt(c.unique_count, 0)}</td>
                    <td style={PS.td}>{tops || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
      {strong.length > 0 && (
        <>
          <p style={{ ...PS.text, fontWeight: 600 }}>Strong Correlations</p>
          <table style={PS.table}>
            <thead><tr>{["Column A","Column B","Correlation (r)"].map(h=><th key={h} style={PS.th}>{h}</th>)}</tr></thead>
            <tbody>
              {strong.map((s, i) => (
                <tr key={i}>
                  <td style={PS.td}>{s.col_a}</td>
                  <td style={PS.td}>{s.col_b}</td>
                  <td style={{ ...PS.td, fontWeight: 700, color: Math.abs(s.r) >= 0.8 ? "#0ea5e9" : "#334155" }}>{fmt(s.r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {outliers.length > 0 && (
        <>
          <p style={{ ...PS.text, fontWeight: 600 }}>Outlier Analysis</p>
          <table style={PS.table}>
            <thead><tr>{["Column","Outlier %","Count","Lower Bound","Upper Bound"].map(h=><th key={h} style={PS.th}>{h}</th>)}</tr></thead>
            <tbody>
              {outliers.map((o) => (
                <tr key={o.column}>
                  <td style={{ ...PS.td, fontWeight: 600 }}>{o.column}</td>
                  <td style={{ ...PS.td, color: o.outlier_pct > 5 ? "#b45309" : "#334155" }}>{fmt(o.outlier_pct)}%</td>
                  <td style={PS.td}>{fmt(o.outlier_count, 0)}</td>
                  <td style={PS.td}>{fmt(o.lower_bound)}</td>
                  <td style={PS.td}>{fmt(o.upper_bound)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {groupComps.length > 0 && (
        <>
          <p style={{ ...PS.text, fontWeight: 600 }}>Group Comparisons</p>
          <table style={PS.table}>
            <thead><tr>{["Group By","Numeric","Group A","Group B","Mean Diff %"].map(h=><th key={h} style={PS.th}>{h}</th>)}</tr></thead>
            <tbody>
              {groupComps.slice(0, 10).map((g, i) => {
                const diffPct = g.mean_a !== 0
                  ? Math.abs((g.mean_b - g.mean_a) / Math.abs(g.mean_a)) * 100
                  : 0;
                return (
                  <tr key={i}>
                    <td style={{ ...PS.td, fontWeight: 600 }}>{g.grouping_col}</td>
                    <td style={PS.td}>{g.numeric_col}</td>
                    <td style={PS.td}>{g.group_a} ({fmt(g.mean_a)})</td>
                    <td style={PS.td}>{g.group_b} ({fmt(g.mean_b)})</td>
                    <td style={{ ...PS.td, color: diffPct > 10 ? "#b45309" : "#334155", fontWeight: diffPct > 10 ? 700 : 400 }}>{fmt(diffPct)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

function PrintScope({ data }: { data: Record<string, unknown> }) {
  const SCOPE_LABELS: Record<string, string> = {
    descriptive_analysis_possible: "Descriptive Analysis",
    regression_possible:           "Regression",
    classification_possible:       "Classification",
    clustering_possible:           "Clustering",
    time_series_possible:          "Time Series",
  };
  const keys = Object.keys(SCOPE_LABELS);
  const rows = keys.map(k => {
    const check = data[k] as { possible?: boolean; confidence?: string; reasoning?: string } | undefined;
    return { label: SCOPE_LABELS[k], possible: check?.possible ?? false, confidence: check?.confidence ?? "—", reasoning: check?.reasoning ?? "—" };
  }).filter(r => r.reasoning !== "—");
  return (
    <table style={PS.table}>
      <thead><tr>{["Analysis","Feasible","Confidence","Notes"].map(h=><th key={h} style={PS.th}>{h}</th>)}</tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <td style={{ ...PS.td, fontWeight: 600 }}>{r.label}</td>
            <td style={PS.td}><span style={PS.pill(r.possible)}>{r.possible ? "Yes" : "No"}</span></td>
            <td style={PS.td}>{r.confidence}</td>
            <td style={PS.td}>{r.reasoning}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PrintInsights({ data }: { data: Record<string, unknown> }) {
  const findings  = (data.top_findings          ?? []) as unknown[];
  const warnings  = (data.warnings               ?? []) as unknown[];
  const nextSteps = (data.suggested_next_steps   ?? []) as unknown[];

  function toText(item: unknown): { title: string; detail?: string } {
    if (typeof item === "string") return { title: item };
    const o = item as Record<string, unknown>;
    return { title: (o.title ?? o.finding ?? "") as string, detail: (o.detail ?? o.description ?? "") as string | undefined };
  }

  return (
    <>
      {findings.length > 0 && (
        <>
          <p style={{ ...PS.text, fontWeight: 600 }}>Key Findings</p>
          {findings.map((f, i) => {
            const { title, detail } = toText(f);
            return <p key={i} style={PS.text}>• <strong>{title}</strong>{detail ? ` — ${detail}` : ""}</p>;
          })}
        </>
      )}
      {warnings.length > 0 && (
        <>
          <p style={{ ...PS.text, fontWeight: 600, marginTop: 12 }}>Warnings</p>
          {warnings.map((w, i) => {
            const { title, detail } = toText(w);
            return <p key={i} style={PS.text}>⚠ <strong>{title}</strong>{detail ? ` — ${detail}` : ""}</p>;
          })}
        </>
      )}
      {nextSteps.length > 0 && (
        <>
          <p style={{ ...PS.text, fontWeight: 600, marginTop: 12 }}>Suggested Next Steps</p>
          {nextSteps.map((s, i) => {
            const o = typeof s === "string" ? s : ((s as Record<string, unknown>).action ?? String(s)) as string;
            return <p key={i} style={PS.text}>→ {o}</p>;
          })}
        </>
      )}
    </>
  );
}


// ── PrintReport (clean inline styles, no recharts) ────────────────────────────

const EXPORT_SECTIONS = [
  { id: "overview",  label: "Overview",  color: "#0ea5e9", num: 1 },
  { id: "cleaning",  label: "Cleaning",  color: "#8b5cf6", num: 2 },
  { id: "eda",       label: "EDA",       color: "#10b981", num: 3 },
  { id: "scope",     label: "Scope",     color: "#f59e0b", num: 4 },
  { id: "insights",  label: "Insights",  color: "#ef4444", num: 5 },
] as const;

type ExportSectionId = typeof EXPORT_SECTIONS[number]["id"];

function PrintReport({
  data, datasetName, id, sections,
}: {
  data: PipelineResult; datasetName?: string; id: string; sections: ExportSectionId[];
}) {
  const generatedAt = new Date().toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const includedSections = EXPORT_SECTIONS.filter((s) => sections.includes(s.id));

  return (
    <div id="print-report" className="hidden print:block" style={PS.page}>

      {/* Cover */}
      <div style={PS.cover}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#38bdf8,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="12" width="4" height="9" rx="1" fill="white"/>
                <rect x="10" y="7" width="4" height="14" rx="1" fill="white"/>
                <rect x="17" y="3" width="4" height="18" rx="1" fill="white"/>
              </svg>
            </div>
            <div>
              <div style={PS.logo}>Data<span style={{ color: "#1e293b" }}>Statz</span></div>
              <div style={PS.sub}>datastatz.com · Instant Data Analysis</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...PS.sub, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Analysis Report</div>
            <div style={PS.sub}>{generatedAt}</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 20, paddingTop: 20 }}>
          <div style={PS.h1}>{datasetName ?? id}</div>
          <div style={PS.sub}>
            Sections: {includedSections.map(s => s.label).join(" · ")}
          </div>
        </div>
      </div>

      {/* Sections */}
      {includedSections.map((s, idx) => (
        <div key={s.id} style={{ ...PS.section, pageBreakBefore: idx === 0 ? "auto" : "always" }}>
          <div style={PS.sHdr}>
            <div style={PS.badge(s.color)}>{s.num}</div>
            <h2 style={PS.h2}>{s.label === "EDA" ? "Exploratory Data Analysis" : s.label === "Overview" ? "Dataset Overview" : s.label === "Cleaning" ? "Data Cleaning" : s.label === "Scope" ? "Scope Assessment" : "Insights & Recommendations"}</h2>
          </div>
          {s.id === "overview"  && <PrintOverview  data={data.analyze}  />}
          {s.id === "cleaning"  && <PrintCleaning  data={data.cleaning} />}
          {s.id === "eda"       && <PrintEda       data={data.eda}      />}
          {s.id === "scope"     && <PrintScope     data={data.scope}    />}
          {s.id === "insights"  && <PrintInsights  data={data.insights} />}
        </div>
      ))}

      {/* Footer */}
      <div style={PS.footer}>
        <span style={{ color: "#0ea5e9", fontWeight: 700 }}>DataStatz</span>
        <span>Generated {generatedAt} · datastatz.com</span>
      </div>
    </div>
  );
}


// ── Export Panel (section picker) ─────────────────────────────────────────────

function ExportPanel({
  open, onClose, sections, onToggle, onPrint,
}: {
  open:     boolean;
  onClose:  () => void;
  sections: ExportSectionId[];
  onToggle: (id: ExportSectionId) => void;
  onPrint:  () => void;
}) {
  if (!open) return null;
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      {/* Panel */}
      <div className="absolute right-0 top-full mt-2 z-50 w-56 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <p className="text-xs font-semibold text-slate-200">Choose sections</p>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="p-2 space-y-0.5">
          {EXPORT_SECTIONS.map((s) => {
            const selected = sections.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => onToggle(s.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-left"
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                  selected ? "border-sky-500 bg-sky-500" : "border-slate-600"
                }`}>
                  {selected && <Check size={10} className="text-white" />}
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-sm text-slate-300">{s.label}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="px-3 pb-3">
          <button
            onClick={onPrint}
            disabled={sections.length === 0}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-sky-500 hover:bg-sky-400
                       disabled:opacity-50 text-white text-xs font-semibold transition-colors"
          >
            <Download size={13} /> Export PDF
          </button>
        </div>
      </div>
    </>
  );
}


export default function ResultsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [data,    setData]    = useState<PipelineResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [tab,     setTab]     = useState<DashTab>("preview");

  // Pro tier
  const [isPro,          setIsPro]          = useState(false);
  const [upgradeOpen,    setUpgradeOpen]    = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<string | undefined>();
  const [shareOpen,      setShareOpen]      = useState(false);
  const [shareLoading,   setShareLoading]   = useState(false);
  const [shareUrl,       setShareUrl]       = useState<string | null>(null);
  const [shareCopied,    setShareCopied]    = useState(false);
  const [cleaningMode,   setCleaningMode]   = useState<"view" | "interactive">("view");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("datastatz_user");
      if (raw) {
        const u = JSON.parse(raw) as { isPro?: boolean };
        setIsPro(u.isPro === true);
      }
    } catch { /* ignore */ }
  }, []);

  function openUpgrade(feature?: string) {
    setUpgradeFeature(feature);
    setUpgradeOpen(true);
  }

  // Export panel
  const [exportOpen,     setExportOpen]     = useState(false);
  const [exportSections, setExportSections] = useState<ExportSectionId[]>(
    EXPORT_SECTIONS.map((s) => s.id),
  );
  function toggleSection(id: ExportSectionId) {
    setExportSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }
  function handlePrint() {
    setExportOpen(false);
    setTimeout(() => window.print(), 50);
  }

  const CACHE_KEY = `datastatz_results_${id}`;

  const fetchData = async (forceRefresh = false) => {
    // Return cached result if available and not forcing refresh
    if (!forceRefresh) {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          setData(JSON.parse(cached) as PipelineResult);
          setLoading(false);
          return;
        }
      } catch { /* ignore */ }
    }

    setLoading(true);
    setError(null);
    try {
      const result = await runFullPipeline(id);
      setData(result as PipelineResult);
      // Cache result for this session
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(result)); } catch { /* ignore */ }
      // Save to dashboard history + track in Supabase
      try {
        const analyze  = (result as Record<string, Record<string, unknown>>)?.analyze;
        const fileName = analyze?.file_name as string || id;
        const prev: { id: string; fileName: string; analyzedAt: string }[] =
          JSON.parse(localStorage.getItem("datastatz_history") || "[]");
        const deduped = prev.filter((h) => h.id !== id);
        deduped.unshift({ id, fileName, analyzedAt: new Date().toISOString() });
        localStorage.setItem("datastatz_history", JSON.stringify(deduped.slice(0, 20)));

        // Track analysis in Supabase (non-blocking)
        try {
          const userRaw = localStorage.getItem("datastatz_user");
          if (userRaw) {
            const u = JSON.parse(userRaw) as { email?: string };
            if (u.email) {
              trackAnalysis(
                u.email,
                fileName,
                analyze?.row_count as number ?? 0,
                analyze?.column_count as number ?? 0,
              ).catch(() => {});
            }
          }
        } catch { /* ignore */ }
      } catch { /* ignore */ }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Dataset name from analyze result
  const datasetName =
    (data?.analyze as Record<string, unknown>)?.file_name as string | undefined;

  return (
    <main className="min-h-screen flex flex-col">

      {/* Upgrade modal */}
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        feature={upgradeFeature}
      />

      {/* Print-only report — hidden on screen, shown on print */}
      {data && (
        <PrintReport data={data} datasetName={datasetName} id={id} sections={exportSections} />
      )}

      {/* Screen UI — hidden on print */}
      {/* Top bar */}
      <header className="no-print sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur border-b border-slate-800 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-slate-200 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Results</p>
            <p className="text-sm font-semibold text-slate-200 truncate">
              {datasetName ?? id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!loading && !error && (
            <TabBar active={tab} isPro={isPro} onChange={setTab} onProClick={openUpgrade} />
          )}

          {/* Share button — Pro */}
          {!loading && !error && (
            <div className="relative flex-shrink-0">
              <button
                onClick={() => isPro ? setShareOpen(v => !v) : openUpgrade("Share Report")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
                  ${isPro
                    ? "border-sky-600 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                    : "border-slate-700 bg-slate-800/60 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                  }`}
                title={isPro ? "Share this report" : "Pro feature: Share Report"}
              >
                {isPro ? <Share2 size={14} /> : <Lock size={12} />}
                <span className="hidden sm:inline">Share</span>
              </button>
              {shareOpen && isPro && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShareOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                      <div className="flex items-center gap-2">
                        <Share2 size={14} className="text-sky-400" />
                        <span className="text-xs font-semibold text-slate-200">Share Report</span>
                      </div>
                      <button onClick={() => setShareOpen(false)} className="text-slate-500 hover:text-slate-300">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="px-4 py-4 space-y-3">
                      {!shareUrl ? (
                        <>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Generate a public link anyone can view — no login required.
                          </p>
                          <button
                            disabled={shareLoading || !data}
                            onClick={async () => {
                              if (!data) return;
                              setShareLoading(true);
                              try {
                                const fileName = (data.analyze as Record<string, unknown>)?.file_name as string ?? "report";
                                const res = await createShare(fileName, data as unknown as Record<string, unknown>);
                                const url = `${window.location.origin}/report/${res.share_id}`;
                                setShareUrl(url);
                              } catch {
                                /* silently fail — user can retry */
                              } finally {
                                setShareLoading(false);
                              }
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                                       bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed
                                       text-white text-xs font-bold transition-all"
                          >
                            {shareLoading
                              ? <><Loader2 size={13} className="animate-spin" /> Generating…</>
                              : <><Share2 size={13} /> Generate Link</>}
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-emerald-400 font-semibold">✓ Link ready — anyone with this URL can view</p>
                          <div className="flex items-center gap-2">
                            <input
                              readOnly
                              value={shareUrl}
                              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5
                                         text-xs text-slate-300 font-mono truncate focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                                setShareCopied(true);
                                setTimeout(() => setShareCopied(false), 2000);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700
                                         hover:bg-slate-600 text-xs text-slate-200 font-medium transition-all shrink-0"
                            >
                              {shareCopied ? <><Check size={12} className="text-emerald-400" /> Copied</> : <><Check size={12} /> Copy</>}
                            </button>
                          </div>
                          <button
                            onClick={() => { setShareUrl(null); setShareCopied(false); }}
                            className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                          >
                            Generate new link
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {!loading && !error && (
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setExportOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700
                           bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-500
                           text-xs font-medium transition-all"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export PDF</span>
                <ChevronDown size={12} className={`transition-transform ${exportOpen ? "rotate-180" : ""}`} />
              </button>
              <ExportPanel
                open={exportOpen}
                onClose={() => setExportOpen(false)}
                sections={exportSections}
                onToggle={toggleSection}
                onPrint={handlePrint}
              />
            </div>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="no-print flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        {loading && <LoadingState />}

        {!loading && error && (
          <ErrorState message={error} onRetry={() => fetchData(true)} />
        )}

        {!loading && !error && data && (
          <div className="animate-fade-in">
            {tab === "preview"     && <DataPreviewTab  fileId={id}          />}
            {tab === "overview"    && <OverviewTab     data={data.analyze}  />}
            {tab === "cleaning" && (
              <div className="space-y-4">
                {isPro && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCleaningMode("view")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all
                        ${cleaningMode === "view"
                          ? "bg-slate-700 border-slate-600 text-slate-200"
                          : "border-slate-700 text-slate-500 hover:text-slate-300"}`}
                    >
                      View Analysis
                    </button>
                    <button
                      onClick={() => setCleaningMode("interactive")}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all
                        ${cleaningMode === "interactive"
                          ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                          : "border-slate-700 text-slate-500 hover:text-violet-400 hover:border-violet-500/30"}`}
                    >
                      <Download size={11} /> Fix Data
                    </button>
                  </div>
                )}
                {cleaningMode === "view" && <CleaningTab data={data.cleaning} />}
                {cleaningMode === "interactive" && isPro && (
                  <InteractiveCleaningPanel
                    fileId={id}
                    columns={
                      ((data.analyze as Record<string, unknown>)?.column_summary as {column:string}[] ?? [])
                        .map((c) => c.column)
                    }
                    issues={(data.cleaning as Record<string, unknown>)?.issues as {type:string;severity:string;column?:string;description:string;count?:number}[] ?? []}
                  />
                )}
              </div>
            )}
            {tab === "eda"         && <EdaTab          data={data.eda}      />}
            {tab === "scope"       && <ScopeTab        data={data.scope}    fileId={id} />}
            {tab === "insights"    && <InsightsTab     data={data.insights} />}
            {tab === "predictions" && !isPro && (
              <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-violet-500/20 border border-rose-500/30 flex items-center justify-center">
                  <Sparkles size={28} className="text-rose-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100 mb-2">AutoML Predictions</h2>
                  <p className="text-slate-400 text-sm max-w-sm">
                    Pick a target column and get instant ML predictions — feature importance, accuracy score, and model diagnostics.
                  </p>
                </div>
                <button
                  onClick={() => openUpgrade("Predictions (AutoML)")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-400 hover:to-violet-400 text-white font-bold text-sm transition-all shadow-lg shadow-rose-500/20"
                >
                  <Sparkles size={15} /> Unlock with Pro
                </button>
              </div>
            )}
            {tab === "predictions" && isPro && (
              <PredictionsTab
                fileId={id}
                columns={
                  ((data.analyze as Record<string, unknown>)?.column_summary as {column:string}[] ?? [])
                    .map((c) => c.column)
                }
              />
            )}
            {tab === "dashboard" && isPro && (
              <DashboardTab fileId={id} />
            )}
            {tab === "dashboard" && !isPro && (
              <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 border border-sky-500/30 flex items-center justify-center">
                  <Sparkles size={28} className="text-sky-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100 mb-2">Dashboard</h2>
                  <p className="text-slate-400 text-sm max-w-sm">
                    Auto-generated visualizations with KPIs, charts, heatmaps, and data quality scores.
                  </p>
                </div>
                <button
                  onClick={() => openUpgrade("Dashboard")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-400 hover:to-violet-400 text-white font-bold text-sm transition-all shadow-lg shadow-sky-500/20"
                >
                  <Sparkles size={15} /> Unlock with Pro
                </button>
              </div>
            )}
            <FeedbackBanner />
          </div>
        )}
      </div>
    </main>
  );
}
