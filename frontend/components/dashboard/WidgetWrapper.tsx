"use client";

import { Component, type ReactNode } from "react";
import { X, GripVertical, AlertCircle } from "lucide-react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import type { DashboardWidget } from "@/lib/api";

import KPICard       from "@/components/dashboard/widgets/KPICard";
import BarWidget     from "@/components/dashboard/widgets/BarChart";
import LineWidget    from "@/components/dashboard/widgets/LineChart";
import HeatmapWidget from "@/components/dashboard/widgets/Heatmap";
import StatsTable    from "@/components/dashboard/widgets/StatsTable";
import DataQuality   from "@/components/dashboard/widgets/DataQuality";

interface WidgetWrapperProps {
  widget:          DashboardWidget;
  editMode:        boolean;
  onDelete:        (id: string) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?:     boolean;
}

// ── Error boundary ────────────────────────────────────────────────────────

interface ErrorBoundaryState { hasError: boolean; message: string }

class WidgetErrorBoundary extends Component<{ children: ReactNode; title: string }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error("[WidgetErrorBoundary]", error);
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
          <AlertCircle size={20} className="text-red-400/70" />
          <p className="text-xs text-slate-500">
            &ldquo;{this.props.title}&rdquo; failed to render
          </p>
          <p className="text-xs text-slate-600 truncate max-w-[200px]">{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Widget body ───────────────────────────────────────────────────────────

function WidgetBody({ widget }: { widget: DashboardWidget }) {
  switch (widget.type) {
    case "kpi":     return <KPICard       config={widget.config} />;
    case "bar":     return <BarWidget     config={widget.config} />;
    case "line":    return <LineWidget    config={widget.config} />;
    case "heatmap": return <HeatmapWidget config={widget.config} />;
    case "table":   return <StatsTable    config={widget.config} />;
    case "gauge":   return <DataQuality   config={widget.config} />;
    default:        return <p className="text-slate-500 text-sm">Unknown widget type.</p>;
  }
}

// ── Wrapper ───────────────────────────────────────────────────────────────

export default function WidgetWrapper({
  widget,
  editMode,
  onDelete,
  dragHandleProps,
  isDragging,
}: WidgetWrapperProps) {
  return (
    <div
      className={`bg-slate-800/50 border rounded-xl flex flex-col overflow-hidden transition-all
        ${editMode
          ? "border-sky-500/40 ring-1 ring-sky-500/20"
          : "border-slate-700/60 hover:border-slate-600"
        }
        ${isDragging ? "shadow-2xl shadow-sky-900/30 ring-2 ring-sky-500/30" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2 gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-200 truncate">{widget.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{widget.description}</p>
        </div>

        {editMode && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              {...(dragHandleProps ?? {})}
              className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors"
              title="Drag to reorder"
            >
              <GripVertical size={15} />
            </span>
            <button
              onClick={() => onDelete(widget.id)}
              className="text-slate-600 hover:text-red-400 transition-colors"
              title="Remove widget"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 px-4 pb-4 min-h-0">
        <WidgetErrorBoundary title={widget.title}>
          <WidgetBody widget={widget} />
        </WidgetErrorBoundary>
      </div>
    </div>
  );
}
