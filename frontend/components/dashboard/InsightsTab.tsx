"use client";

import {
  Lightbulb, AlertTriangle, ArrowRight, Sparkles,
  Link2, BarChart2, Tag, TrendingUp, RefreshCw,
  AlertCircle, CheckCircle2, Clipboard, Target,
  Users, Clock, Wand2,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  "link":           Link2,
  "bar-chart":      BarChart2,
  "tag":            Tag,
  "trending-up":    TrendingUp,
  "alert-triangle": AlertTriangle,
  "refresh":        RefreshCw,
  "alert-circle":   AlertCircle,
  "check-circle":   CheckCircle2,
  "clipboard":      Clipboard,
  "target":         Target,
  "users":          Users,
  "clock":          Clock,
  "wand":           Wand2,
};

// Map insight type → { icon component, color classes }
const INSIGHT_ICONS: Record<string, { icon: React.ElementType; bg: string; border: string; color: string; cardBg: string; cardBorder: string }> = {
  "correlation":      { icon: Link2,          bg: "bg-sky-900/50",     border: "border-sky-800",    color: "text-sky-400",     cardBg: "bg-slate-800/60",    cardBorder: "border-slate-700" },
  "outliers":         { icon: AlertTriangle,   bg: "bg-amber-900/40",   border: "border-amber-800",  color: "text-amber-400",   cardBg: "bg-amber-900/10",    cardBorder: "border-amber-800" },
  "group_difference": { icon: TrendingUp,      bg: "bg-emerald-900/40", border: "border-emerald-800",color: "text-emerald-400", cardBg: "bg-emerald-900/10",  cardBorder: "border-emerald-800" },
  "quality":          { icon: CheckCircle2,    bg: "bg-green-900/40",   border: "border-green-800",  color: "text-green-400",   cardBg: "bg-green-900/10",    cardBorder: "border-green-800" },
  "skewed_distribution": { icon: BarChart2,    bg: "bg-sky-900/50",     border: "border-sky-800",    color: "text-sky-400",     cardBg: "bg-slate-800/60",    cardBorder: "border-slate-700" },
  "class_dominance":  { icon: Tag,             bg: "bg-sky-900/50",     border: "border-sky-800",    color: "text-sky-400",     cardBg: "bg-slate-800/60",    cardBorder: "border-slate-700" },
  "time_series":      { icon: TrendingUp,      bg: "bg-sky-900/50",     border: "border-sky-800",    color: "text-sky-400",     cardBg: "bg-slate-800/60",    cardBorder: "border-slate-700" },
  "default":          { icon: Lightbulb,       bg: "bg-sky-900/50",     border: "border-sky-800",    color: "text-sky-400",     cardBg: "bg-slate-800/60",    cardBorder: "border-slate-700" },
};

function InsightIcon({ name, size = 14, className }: { name?: string; size?: number; className?: string }) {
  if (!name) return null;
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}

interface InsightsTabProps {
  data: Record<string, unknown>;
}

// Backend returns rich objects OR plain strings - handle both
interface FindingObj  { type?: string; icon?: string; title?: string; detail?: string; }
interface WarningObj  { type?: string; icon?: string; title?: string; detail?: string; }
interface NextStepObj { icon?: string; action?: string; }

function toFindingObj(item: unknown): FindingObj {
  if (typeof item === "string") return { title: item };
  if (item && typeof item === "object") return item as FindingObj;
  return {};
}

function toNextStep(item: unknown): NextStepObj {
  if (typeof item === "string") return { action: item };
  if (item && typeof item === "object") return item as NextStepObj;
  return {};
}

export default function InsightsTab({ data }: InsightsTabProps) {
  const rawFindings  = (data.top_findings          ?? []) as unknown[];
  const rawWarnings  = (data.warnings               ?? []) as unknown[];
  const rawNextSteps = (data.suggested_next_steps   ?? []) as unknown[];
  const insightCount = data.insight_count as number ?? 0;

  const topFindings = rawFindings.map(toFindingObj);
  const warnings    = rawWarnings.map(toFindingObj);
  const nextSteps   = rawNextSteps.map(toNextStep);

  const hasAny = topFindings.length + warnings.length + nextSteps.length > 0;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="card flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-sky-900/50 border border-sky-700 flex items-center justify-center flex-shrink-0">
          <Sparkles size={18} className="text-sky-400" />
        </div>
        <div>
          <p className="font-semibold text-slate-100">Plain-English Insights</p>
          <p className="text-sm text-slate-400 mt-0.5">
            {insightCount > 0
              ? `${insightCount} insights generated from your dataset.`
              : "Rule-based findings from your dataset."}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Generated automatically - no LLM required. More advanced AI insights coming soon.
          </p>
        </div>
      </div>

      {!hasAny && (
        <div className="card text-slate-400 text-sm">
          No insights could be generated. Try a larger or more varied dataset.
        </div>
      )}

      {/* Key Findings */}
      {topFindings.length > 0 && (
        <section>
          <p className="section-title flex items-center gap-2 mb-4">
            <Lightbulb size={15} className="text-sky-400" />
            Key Findings ({topFindings.length})
          </p>
          <div className="space-y-2.5">
            {topFindings.map((finding, i) => {
              const typeStyle = INSIGHT_ICONS[finding.type ?? ""] ?? INSIGHT_ICONS["default"];
              const IconComp  = (finding.icon && ICON_MAP[finding.icon]) ? ICON_MAP[finding.icon] : typeStyle.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${typeStyle.cardBg} border ${typeStyle.cardBorder} rounded-xl px-4 py-3`}
                >
                  <div className={`w-6 h-6 rounded-md ${typeStyle.bg} border ${typeStyle.border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <IconComp size={13} className={typeStyle.color} />
                  </div>
                  <div>
                    {finding.title && (
                      <p className="text-sm font-semibold text-slate-200 mb-0.5">{finding.title}</p>
                    )}
                    {finding.detail && (
                      <p className="text-sm text-slate-400 leading-relaxed">{finding.detail}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <section>
          <p className="section-title flex items-center gap-2 mb-4">
            <AlertTriangle size={15} className="text-yellow-400" />
            Warnings ({warnings.length})
          </p>
          <div className="space-y-2.5">
            {warnings.map((warning, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-yellow-900/15 border border-yellow-800 rounded-xl px-4 py-3"
              >
                {warning.icon && ICON_MAP[warning.icon] ? (
                  <div className="w-6 h-6 rounded-md bg-yellow-900/40 border border-yellow-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <InsightIcon name={warning.icon} size={13} className="text-yellow-400" />
                  </div>
                ) : (
                  <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  {warning.title && (
                    <p className="text-sm font-semibold text-slate-200 mb-0.5">{warning.title}</p>
                  )}
                  {warning.detail && (
                    <p className="text-sm text-slate-400 leading-relaxed">{warning.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <section>
          <p className="section-title flex items-center gap-2 mb-4">
            <ArrowRight size={15} className="text-green-400" />
            Suggested Next Steps ({nextSteps.length})
          </p>
          <div className="space-y-2.5">
            {nextSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-green-900/10 border border-green-800 rounded-xl px-4 py-3"
              >
                {step.icon && ICON_MAP[step.icon] ? (
                  <div className="w-6 h-6 rounded-md bg-green-900/40 border border-green-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <InsightIcon name={step.icon} size={13} className="text-green-400" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-green-900/60 border border-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowRight size={10} className="text-green-400" />
                  </div>
                )}
                <p className="text-sm text-slate-300 leading-relaxed">
                  {step.action ?? ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasAny && (
        <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
          These insights are generated by rule-based analysis of your data&apos;s statistics.
          They are meant to guide exploration, not replace domain expertise.
        </div>
      )}
    </div>
  );
}
