"use client";

import {
  CheckCircle,
  XCircle,
  BarChart2,
  TrendingUp,
  Layers,
  Target,
  Clock,
  AlertTriangle,
  Lightbulb,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { GitBranch } from "lucide-react";

interface ScopeTabProps {
  data:   Record<string, unknown>;
  fileId: string;
}

interface ScopeCheck {
  possible:               boolean;
  confidence:             "high" | "medium" | "low" | "none";
  reasoning:              string;
  what_supports:          string;
  what_is_missing:        string;
  missing_requirements:   string[];
  warnings:               string[];
  actionable_suggestions: string[];
  candidate_targets:      string[];
  date_columns_found?:    string[];
}

const SCOPE_META: Record<string, { label: string; icon: React.ElementType; desc: string }> = {
  descriptive_analysis: {
    label: "Descriptive Analysis",
    icon:  BarChart2,
    desc:  "Summary statistics, distributions, and basic profiling.",
  },
  regression: {
    label: "Regression",
    icon:  TrendingUp,
    desc:  "Predict a continuous numeric target variable.",
  },
  classification: {
    label: "Classification",
    icon:  Target,
    desc:  "Predict a categorical or binary outcome.",
  },
  clustering: {
    label: "Clustering",
    icon:  Layers,
    desc:  "Discover hidden groupings without labels.",
  },
  time_series: {
    label: "Time Series",
    icon:  Clock,
    desc:  "Model trends and seasonality over time.",
  },
};

const CONFIDENCE_STYLES: Record<string, { label: string; cls: string }> = {
  high:   { label: "High confidence",   cls: "bg-green-900/50 text-green-300 border border-green-700" },
  medium: { label: "Medium confidence", cls: "bg-yellow-900/40 text-yellow-300 border border-yellow-700" },
  low:    { label: "Low confidence",    cls: "bg-orange-900/40 text-orange-300 border border-orange-700" },
  none:   { label: "Not feasible",      cls: "bg-slate-800 text-slate-400 border border-slate-700" },
};

function ConfidenceBadge({ level }: { level: string }) {
  const style = CONFIDENCE_STYLES[level] ?? CONFIDENCE_STYLES.none;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.cls}`}>
      {style.label}
    </span>
  );
}

function ScopeCard({ scopeKey, check }: { scopeKey: string; check: ScopeCheck }) {
  const meta    = SCOPE_META[scopeKey];
  const Icon    = meta?.icon ?? BarChart2;
  const feasible = check.possible;

  return (
    <div
      className={`card flex items-start gap-4 transition-opacity ${
        feasible
          ? "border-green-800 bg-green-900/10"
          : "opacity-75"
      }`}
    >
      {/* Icon */}
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
          feasible
            ? "bg-green-900/50 border border-green-700"
            : "bg-slate-800 border border-slate-700"
        }`}
      >
        <Icon size={20} className={feasible ? "text-green-400" : "text-slate-500"} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 space-y-3">

        {/* Header row */}
        <div className="flex flex-wrap items-center gap-2">
          <p className={`font-semibold ${feasible ? "text-slate-100" : "text-slate-300"}`}>
            {meta?.label ?? scopeKey}
          </p>
          {feasible
            ? <CheckCircle size={14} className="text-green-400" />
            : <XCircle    size={14} className="text-slate-500" />
          }
          <ConfidenceBadge level={check.confidence ?? "none"} />
        </div>

        {/* Type description */}
        <p className="text-xs text-slate-500">{meta?.desc}</p>

        {/* Reasoning */}
        <p className="text-sm text-slate-300">{check.reasoning}</p>

        {/* What supports / what is missing – structured breakdown */}
        {feasible && check.what_supports && (
          <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-2">
            <span className="font-medium text-slate-300">Supports this: </span>
            {check.what_supports}
          </div>
        )}
        {!feasible && check.what_is_missing && (
          <div className="text-xs text-amber-400/80 bg-amber-900/10 border border-amber-800/40 rounded-lg px-3 py-2">
            <span className="font-medium">Gap: </span>
            {check.what_is_missing}
          </div>
        )}

        {/* Candidate targets */}
        {check.candidate_targets && check.candidate_targets.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag size={12} className="text-slate-400" />
            <span className="text-xs text-slate-400">Target candidates:</span>
            {check.candidate_targets.map((t) => (
              <span key={t} className="badge badge-blue font-mono text-xs">{t}</span>
            ))}
          </div>
        )}

        {/* Warnings */}
        {check.warnings && check.warnings.length > 0 && (
          <div className="space-y-1">
            {check.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-yellow-400/90">
                <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        {/* Missing requirements */}
        {!feasible && check.missing_requirements && check.missing_requirements.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Missing requirements:</p>
            {check.missing_requirements.map((req, i) => (
              <p key={i} className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0" />
                {req}
              </p>
            ))}
          </div>
        )}

        {/* Actionable suggestions */}
        {check.actionable_suggestions && check.actionable_suggestions.length > 0 && (
          <div className="mt-1 space-y-1 border-t border-slate-700/50 pt-2">
            <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Lightbulb size={12} className="text-blue-400" />
              {feasible ? "Tips to improve results:" : "How to unlock this:"}
            </p>
            {check.actionable_suggestions.map((s, i) => (
              <p key={i} className="text-xs text-blue-300/80 flex items-start gap-1.5 pl-1">
                <span className="mt-1 w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                {s}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScopeTab({ data, fileId }: ScopeTabProps) {
  // Extract the five analysis checks - keys ending in "_possible"
  const entries = Object.entries(data).filter(([k]) => k.endsWith("_possible")) as [string, ScopeCheck][];
  const keyOf   = (k: string) => k.replace("_possible", "");

  const feasible = entries.filter(([, v]) => v?.possible);
  const blocked  = entries.filter(([, v]) => v && !v.possible);

  // Top-level candidate columns from the summary fields
  const numericCandidates  = (data.numeric_target_candidates  as string[] | undefined) ?? [];
  const categoryCandidates = (data.categorical_target_candidates as string[] | undefined) ?? [];
  const dateColumns        = (data.date_columns_found          as string[] | undefined) ?? [];
  const sizeLabel          = data.dataset_size_label as string | undefined;

  return (
    <div className="space-y-8 animate-slide-up">

      {/* Summary header */}
      <div className="card">
        <p className="section-title">Analysis Scope</p>
        <p className="text-sm text-slate-400 mt-1">
          Based on your dataset&apos;s shape, column types, and row count - here is what
          analysis approaches are feasible right now.
        </p>

        {/* Counters */}
        <div className="flex gap-8 mt-4">
          <div>
            <p className="text-3xl font-extrabold text-green-400">{feasible.length}</p>
            <p className="stat-label mt-0.5">Feasible</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-500">{blocked.length}</p>
            <p className="stat-label mt-0.5">Not Ready</p>
          </div>
          {sizeLabel && (
            <div>
              <p className="text-3xl font-extrabold text-blue-400">{sizeLabel}</p>
              <p className="stat-label mt-0.5">Dataset Size</p>
            </div>
          )}
        </div>

        {/* Detected candidates summary */}
        {(numericCandidates.length > 0 || categoryCandidates.length > 0 || dateColumns.length > 0) && (
          <div className="mt-5 pt-4 border-t border-slate-700/60 grid gap-3 sm:grid-cols-3">
            {numericCandidates.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1.5">Numeric target candidates</p>
                <div className="flex flex-wrap gap-1">
                  {numericCandidates.map((c) => (
                    <span key={c} className="badge badge-blue font-mono text-xs">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {categoryCandidates.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1.5">Categorical target candidates</p>
                <div className="flex flex-wrap gap-1">
                  {categoryCandidates.map((c) => (
                    <span key={c} className="badge badge-purple font-mono text-xs">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {dateColumns.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1.5">Date columns detected</p>
                <div className="flex flex-wrap gap-1">
                  {dateColumns.map((c) => (
                    <span key={c} className="badge badge-green font-mono text-xs">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feasible analyses */}
      {feasible.length > 0 && (
        <section>
          <p className="section-title text-green-400 mb-3">✓ Feasible ({feasible.length})</p>
          <div className="space-y-3">
            {feasible.map(([key, check]) => (
              <ScopeCard key={key} scopeKey={keyOf(key)} check={check} />
            ))}
          </div>
        </section>
      )}

      {/* Blocked analyses */}
      {blocked.length > 0 && (
        <section>
          <p className="section-title text-slate-400 mb-3">✗ Not Yet Feasible ({blocked.length})</p>
          <div className="space-y-3">
            {blocked.map(([key, check]) => (
              <ScopeCard key={key} scopeKey={keyOf(key)} check={check} />
            ))}
          </div>
        </section>
      )}

      {/* See the Pipeline CTA */}
      <div className="card border-sky-800 bg-sky-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-100">Suggested Workflow</p>
          <p className="text-sm text-slate-400 mt-0.5">
            See a step-by-step visual pipeline tailored to your dataset&apos;s capabilities.
          </p>
        </div>
        <Link
          href={`/pipeline/${fileId}`}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg
                     bg-sky-500 hover:bg-sky-400 active:bg-sky-600
                     text-white font-semibold text-sm transition-colors"
        >
          <GitBranch size={16} />
          See the Pipeline
        </Link>
      </div>
    </div>
  );
}
