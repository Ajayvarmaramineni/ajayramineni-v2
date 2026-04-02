"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Upload, Sparkles, BarChart2, Clock, Wrench,
  TrendingUp, Target, Layers, CheckSquare, FileText, BrainCircuit,
  Loader2, AlertCircle,
} from "lucide-react";
import { getScope } from "@/lib/api";


interface PipelineStep {
  id:          string;
  label:       string;
  description: string;
  icon:        string;
  status:      "ready" | "recommended" | "optional" | "blocked";
  category:    string;
  tools:       string[];
}


const ICON_MAP: Record<string, React.ElementType> = {
  Upload, Sparkles, BarChart2, Clock, Wrench,
  TrendingUp, Target, Layers, CheckSquare, FileText, BrainCircuit,
};


const STATUS: Record<string, {
  borderCls: string; bgCls: string; iconRingCls: string;
  iconColor: string; badge: string; badgeCls: string;
  flowColor: string; glowCls: string;
}> = {
  ready: {
    borderCls:   "border-green-600",
    bgCls:       "bg-green-950/40",
    iconRingCls: "border-green-600 bg-green-900/50",
    iconColor:   "text-green-400",
    badge:       "Ready",
    badgeCls:    "bg-green-900/70 text-green-300 border border-green-600",
    flowColor:   "#4ade80",
    glowCls:     "shadow-[0_0_20px_rgba(74,222,128,0.15)]",
  },
  recommended: {
    borderCls:   "border-sky-600",
    bgCls:       "bg-sky-950/40",
    iconRingCls: "border-sky-600 bg-sky-900/50",
    iconColor:   "text-sky-400",
    badge:       "Recommended",
    badgeCls:    "bg-sky-900/70 text-sky-300 border border-sky-600",
    flowColor:   "#38bdf8",
    glowCls:     "shadow-[0_0_20px_rgba(56,189,248,0.15)]",
  },
  optional: {
    borderCls:   "border-slate-600",
    bgCls:       "bg-slate-800/30",
    iconRingCls: "border-slate-600 bg-slate-800",
    iconColor:   "text-slate-400",
    badge:       "Optional",
    badgeCls:    "bg-slate-800 text-slate-400 border border-slate-600",
    flowColor:   "#64748b",
    glowCls:     "",
  },
  blocked: {
    borderCls:   "border-slate-700",
    bgCls:       "bg-slate-900/20",
    iconRingCls: "border-slate-700 bg-slate-900",
    iconColor:   "text-slate-600",
    badge:       "Blocked",
    badgeCls:    "bg-slate-900 text-slate-500 border border-slate-700",
    flowColor:   "#334155",
    glowCls:     "",
  },
};

const CATEGORY_COLOR: Record<string, string> = {
  source:       "text-sky-400",
  processing:   "text-violet-400",
  analysis:     "text-amber-400",
  intelligence: "text-pink-400",
  output:       "text-teal-400",
};


function FlowConnector({ color, blocked }: { color: string; blocked: boolean }) {
  const lineColor = blocked ? "#1e293b" : color;
  return (
    <div
      className="flex-shrink-0 flex items-center"
      style={{ width: 64, marginTop: "3.5rem" }}
    >
      {/* Line track */}
      <div
        className="relative overflow-hidden"
        style={{
          flex: 1,
          height: 3,
          background: blocked ? "#1e293b" : `${color}30`,
          borderRadius: 2,
        }}
      >
        {/* Solid tinted fill */}
        <div
          className="absolute inset-0"
          style={{ background: blocked ? "#1e293b" : `${color}60` }}
        />
        {/* Animated flowing dot */}
        {!blocked && (
          <div
            style={{
              position:  "absolute",
              top:       "50%",
              transform: "translateY(-50%)",
              width:     10,
              height:    10,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 8px 2px ${color}`,
              animation: "flowDot 1.6s linear infinite",
            }}
          />
        )}
      </div>

      {/* Arrow head */}
      <div
        style={{
          width:        0,
          height:       0,
          borderTop:    "6px solid transparent",
          borderBottom: "6px solid transparent",
          borderLeft:   `9px solid ${lineColor}`,
          flexShrink:   0,
        }}
      />
    </div>
  );
}


function StepCard({ step, index }: { step: PipelineStep; index: number }) {
  const Icon    = ICON_MAP[step.icon] ?? FileText;
  const style   = STATUS[step.status] ?? STATUS.optional;
  const catCls  = CATEGORY_COLOR[step.category] ?? "text-slate-400";
  const muted   = step.status === "blocked";

  return (
    <div className={`flex flex-col items-center gap-2 ${muted ? "opacity-40" : ""}`}>
      {/* Step index */}
      <span className="text-xs font-mono text-slate-500 tracking-wider">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Card */}
      <div
        className={`
          relative w-44 rounded-2xl border p-5 flex flex-col gap-3
          transition-all duration-300 hover:scale-105 cursor-default
          ${style.borderCls} ${style.bgCls} ${style.glowCls}
        `}
      >
        {/* Status badge */}
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold
                      px-2.5 py-0.5 rounded-full whitespace-nowrap ${style.badgeCls}`}
        >
          {style.badge}
        </span>

        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${style.iconRingCls}`}>
          <Icon size={20} className={style.iconColor} />
        </div>

        {/* Text */}
        <div>
          <p className="font-semibold text-sm text-slate-100 leading-tight">{step.label}</p>
          <p className={`text-xs font-medium capitalize mt-0.5 ${catCls}`}>{step.category}</p>
        </div>

        <p className="text-xs text-slate-400 leading-snug">{step.description}</p>

        {/* Tool chips */}
        <div className="flex flex-wrap gap-1">
          {step.tools.slice(0, 2).map((t) => (
            <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded
                                     bg-slate-800 text-slate-400 border border-slate-700">
              {t}
            </span>
          ))}
          {step.tools.length > 2 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded
                             bg-slate-800 text-slate-500">
              +{step.tools.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


export default function PipelinePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [steps,   setSteps]   = useState<PipelineStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    getScope(id)
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const pipeline = d.suggested_pipeline as PipelineStep[] | undefined;
        setSteps(pipeline ?? []);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const readyCount = steps.filter((s) => s.status === "ready").length;
  const blockedCount = steps.filter((s) => s.status === "blocked").length;

  return (
    <>
      {/* Inject flowDot keyframe */}
      <style>{`
        @keyframes flowDot {
          0%   { left: -8px; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
      `}</style>

      <main className="min-h-screen bg-[#0a0f1e] flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#0a0f1e]/95 backdrop-blur
                           border-b border-slate-800 px-6 py-4
                           flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/results/${id}`}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Back to Results
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm font-bold text-slate-100 tracking-wide">Suggested Workflow</p>
            <p className="text-xs text-slate-500">Tailored to your dataset</p>
          </div>

          {/* Summary badges */}
          <div className="flex gap-2">
            {readyCount > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full
                               bg-green-900/50 text-green-300 border border-green-700">
                {readyCount} ready
              </span>
            )}
            {blockedCount > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full
                               bg-slate-800 text-slate-400 border border-slate-700">
                {blockedCount} blocked
              </span>
            )}
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 gap-12">

          {loading && (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin" />
              <p className="text-sm">Building your pipeline…</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-3 text-red-400">
              <AlertCircle size={32} />
              <p className="text-sm">{error}</p>
              <Link href={`/results/${id}`} className="text-xs text-slate-400 underline">
                Go back to results
              </Link>
            </div>
          )}

          {!loading && !error && steps.length > 0 && (
            <>
              {/* Title */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-extrabold text-slate-100">
                  Your Data Pipeline
                </h1>
                <p className="text-slate-400 text-sm max-w-lg">
                  Each step is evaluated against your dataset. Green steps are ready to run today.
                  Blue steps are recommended. Blocked steps show what you&apos;re missing.
                </p>
              </div>

              {/* Pipeline row - horizontally scrollable */}
              <div className="w-full overflow-x-auto pb-4">
                <div className="flex items-start min-w-max mx-auto px-4"
                     style={{ width: "fit-content" }}>
                  {steps.map((step, i) => {
                    const nextStep   = steps[i + 1];
                    const connBlocked = step.status === "blocked" || nextStep?.status === "blocked";
                    const connColor   = connBlocked
                      ? "#1e293b"
                      : (STATUS[step.status]?.flowColor ?? "#64748b");

                    return (
                      <div key={step.id} className="flex items-center">
                        <StepCard step={step} index={i} />
                        {i < steps.length - 1 && (
                          <FlowConnector color={connColor} blocked={connBlocked} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-6 justify-center">
                {Object.entries(STATUS).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border-2"
                      style={{ borderColor: val.flowColor, background: "transparent" }}
                    />
                    <span className="text-xs text-slate-400">{val.badge}</span>
                  </div>
                ))}
              </div>

              {/* Footer CTA */}
              <Link
                href={`/results/${id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-xl
                           border border-slate-700 text-slate-300 text-sm
                           hover:border-slate-500 hover:text-slate-100 transition-colors"
              >
                <ArrowLeft size={15} />
                Back to full analysis
              </Link>
            </>
          )}
        </div>
      </main>
    </>
  );
}
