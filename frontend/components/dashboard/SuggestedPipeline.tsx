"use client";

import {
  Upload,
  Sparkles,
  BarChart2,
  Clock,
  Wrench,
  TrendingUp,
  Target,
  Layers,
  CheckSquare,
  FileText,
  BrainCircuit,
  ChevronRight,
} from "lucide-react";

export interface PipelineStep {
  id:          string;
  label:       string;
  description: string;
  icon:        string;
  status:      "ready" | "recommended" | "optional" | "blocked";
  category:    "source" | "processing" | "analysis" | "intelligence" | "output";
  tools:       string[];
}

interface SuggestedPipelineProps {
  steps: PipelineStep[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  Upload, Sparkles, BarChart2, Clock, Wrench,
  TrendingUp, Target, Layers, CheckSquare, FileText, BrainCircuit,
};

const STATUS_STYLES: Record<
  string,
  { ring: string; bg: string; iconColor: string; label: string; labelCls: string }
> = {
  ready: {
    ring:      "border-green-700",
    bg:        "bg-green-900/20",
    iconColor: "text-green-400",
    label:     "Ready",
    labelCls:  "bg-green-900/50 text-green-300 border-green-700",
  },
  recommended: {
    ring:      "border-blue-700",
    bg:        "bg-blue-900/20",
    iconColor: "text-blue-400",
    label:     "Recommended",
    labelCls:  "bg-blue-900/50 text-blue-300 border-blue-700",
  },
  optional: {
    ring:      "border-slate-600",
    bg:        "bg-slate-800/40",
    iconColor: "text-slate-400",
    label:     "Optional",
    labelCls:  "bg-slate-800 text-slate-400 border-slate-600",
  },
  blocked: {
    ring:      "border-slate-700",
    bg:        "bg-slate-800/20",
    iconColor: "text-slate-600",
    label:     "Blocked",
    labelCls:  "bg-slate-800/60 text-slate-500 border-slate-700",
  },
};

const CATEGORY_COLOR: Record<string, string> = {
  source:       "text-sky-400",
  processing:   "text-violet-400",
  analysis:     "text-amber-400",
  intelligence: "text-pink-400",
  output:       "text-teal-400",
};

function StepNode({ step, index }: { step: PipelineStep; index: number }) {
  const Icon   = ICON_MAP[step.icon] ?? FileText;
  const style  = STATUS_STYLES[step.status] ?? STATUS_STYLES.optional;
  const catCls = CATEGORY_COLOR[step.category] ?? "text-slate-400";
  const muted  = step.status === "blocked";

  return (
    <div className={`flex flex-col items-center ${muted ? "opacity-40" : ""}`}>
      {/* Step number pill */}
      <span className="text-xs font-mono text-slate-500 mb-2">{String(index + 1).padStart(2, "0")}</span>

      {/* Card */}
      <div
        className={`
          relative w-44 rounded-xl border p-4 flex flex-col gap-2
          transition-all hover:scale-[1.02] hover:shadow-lg
          ${style.ring} ${style.bg}
        `}
      >
        {/* Icon circle */}
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${style.ring} bg-slate-900/60`}>
          <Icon size={17} className={style.iconColor} />
        </div>

        {/* Label + category */}
        <div>
          <p className="text-sm font-semibold text-slate-100 leading-tight">{step.label}</p>
          <p className={`text-xs font-medium capitalize mt-0.5 ${catCls}`}>{step.category}</p>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-snug">{step.description}</p>

        {/* Tools */}
        <div className="flex flex-wrap gap-1 mt-1">
          {step.tools.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700"
            >
              {t}
            </span>
          ))}
          {step.tools.length > 2 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
              +{step.tools.length - 2}
            </span>
          )}
        </div>

        {/* Status badge */}
        <span
          className={`
            absolute -top-2.5 right-3 text-[10px] font-semibold px-2 py-0.5
            rounded-full border ${style.labelCls}
          `}
        >
          {style.label}
        </span>
      </div>
    </div>
  );
}

export default function SuggestedPipeline({ steps }: SuggestedPipelineProps) {
  if (!steps || steps.length === 0) return null;

  const readyCount       = steps.filter((s) => s.status === "ready").length;
  const recommendedCount = steps.filter((s) => s.status === "recommended").length;
  const blockedCount     = steps.filter((s) => s.status === "blocked").length;

  return (
    <div className="card space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-title">Suggested Workflow</p>
          <p className="text-sm text-slate-400 mt-1">
            A step-by-step pipeline tailored to your dataset&apos;s capabilities.
          </p>
        </div>
        {/* Summary chips */}
        <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
          <span className="text-xs px-2 py-1 rounded-full bg-green-900/40 text-green-300 border border-green-700">
            {readyCount} ready
          </span>
          {recommendedCount > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700">
              {recommendedCount} recommended
            </span>
          )}
          {blockedCount > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {blockedCount} blocked
            </span>
          )}
        </div>
      </div>

      {/* Pipeline flow - horizontal scroll on small screens */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-start gap-0 min-w-max">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <StepNode step={step} index={i} />
              {i < steps.length - 1 && (
                <div className="flex items-center mx-1 mt-6">
                  <ChevronRight
                    size={20}
                    className={
                      step.status === "blocked" || steps[i + 1].status === "blocked"
                        ? "text-slate-700"
                        : "text-slate-500"
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-700/50">
        {Object.entries(STATUS_STYLES).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full border ${val.ring}`} style={{ background: "transparent" }} />
            <span className="text-xs text-slate-400">{val.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
