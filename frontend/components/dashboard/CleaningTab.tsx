"use client";

import { CheckCircle, AlertTriangle, Info, Wrench } from "lucide-react";

interface CleaningTabProps {
  data: Record<string, unknown>;
}

interface CleaningIssue {
  type:        string;
  severity:    "high" | "medium" | "low" | "info";
  column?:     string;
  description: string;
  count?:      number;
}

interface RecommendedAction {
  action:      string;
  reason:      string;
  column?:     string;
  priority:    "high" | "medium" | "low";
}

const SEVERITY_STYLES = {
  high:   { cls: "border-red-700 bg-red-900/20",    icon: AlertTriangle, iconCls: "text-red-400"    },
  medium: { cls: "border-yellow-700 bg-yellow-900/20", icon: AlertTriangle, iconCls: "text-yellow-400" },
  low:    { cls: "border-blue-700 bg-blue-900/20",  icon: Info,          iconCls: "text-blue-400"   },
  info:   { cls: "border-slate-700 bg-slate-800/40", icon: Info,         iconCls: "text-slate-400"  },
};

const PRIORITY_BADGE: Record<string, string> = {
  high:   "badge-red",
  medium: "badge-yellow",
  low:    "badge-blue",
};

export default function CleaningTab({ data }: CleaningTabProps) {
  const issues    = (data.issues             ?? []) as CleaningIssue[];
  const actions   = (data.recommended_actions ?? []) as RecommendedAction[];
  const score     = data.quality_score as number ?? 0;

  const highCount   = issues.filter((i) => i.severity === "high").length;
  const mediumCount = issues.filter((i) => i.severity === "medium").length;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Score + summary */}
      <div className="card">
        <p className="section-title">Cleaning Diagnostics</p>
        <div className="flex flex-wrap gap-6 items-center mt-2">
          <div>
            <p className="stat-label">Quality Score</p>
            <p
              className={`text-4xl font-extrabold mt-1 ${
                score >= 80
                  ? "text-green-400"
                  : score >= 60
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {score}
              <span className="text-xl font-normal text-slate-400">/100</span>
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{highCount}</p>
              <p className="stat-label">High</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{mediumCount}</p>
              <p className="stat-label">Medium</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                {issues.length - highCount - mediumCount}
              </p>
              <p className="stat-label">Low / Info</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 rounded-lg px-4 py-2.5 border border-slate-700">
          <Info size={14} className="flex-shrink-0 text-sky-400" />
          DataStatz provides diagnostics only - fixes are suggested but not auto-applied.
        </div>
      </div>

      {/* Issues list */}
      {issues.length === 0 ? (
        <div className="card flex items-center gap-3 text-green-400">
          <CheckCircle size={20} />
          <p className="font-medium">No issues detected. Your data looks clean!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="section-title">Detected Issues ({issues.length})</p>
          {issues.map((issue, i) => {
            const style = SEVERITY_STYLES[issue.severity] ?? SEVERITY_STYLES.info;
            const Icon  = style.icon;
            return (
              <div
                key={i}
                className={`flex items-start gap-3 border rounded-xl px-4 py-3 ${style.cls}`}
              >
                <Icon size={16} className={`${style.iconCls} flex-shrink-0 mt-0.5`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-slate-200">
                      {issue.type.replace(/_/g, " ")}
                    </span>
                    {issue.column && (
                      <span className="font-mono text-xs text-sky-300 bg-sky-900/30 px-1.5 py-0.5 rounded">
                        {issue.column}
                      </span>
                    )}
                    {issue.count !== undefined && (
                      <span className="text-xs text-slate-400">{issue.count} occurrences</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">
                    {(issue as unknown as Record<string,unknown>).detail as string ?? issue.description}
                  </p>
                </div>
                <span className={`badge ${PRIORITY_BADGE[issue.severity] ?? "badge-gray"} flex-shrink-0`}>
                  {issue.severity}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Recommended actions */}
      {actions.length > 0 && (
        <div className="space-y-3">
          <p className="section-title">
            <span className="inline-flex items-center gap-2">
              <Wrench size={15} className="text-sky-400" />
              Recommended Actions ({actions.length})
            </span>
          </p>
          {actions.map((action, i) => (
            <div
              key={i}
              className="card flex items-start gap-4"
            >
              <div className="w-6 h-6 rounded-full bg-sky-900/50 border border-sky-700 flex items-center justify-center text-xs font-bold text-sky-400 flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-100 text-sm">{action.action}</span>
                  {action.column && (
                    <span className="font-mono text-xs text-sky-300 bg-sky-900/30 px-1.5 py-0.5 rounded">
                      {action.column}
                    </span>
                  )}
                  <span className={`badge ${PRIORITY_BADGE[action.priority] ?? "badge-gray"}`}>
                    {action.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{action.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
