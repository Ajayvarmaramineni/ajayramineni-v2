"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Loader2, AlertCircle, RefreshCw, Pencil, Check, Download,
  Undo2, RotateCcw, Plus,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import type { DashboardLayout, DashboardWidget } from "@/lib/api";
import { loadDashboardLayout, removeWidget, persistLayout, clearLayoutCache } from "@/lib/dashboard-store";
import WidgetWrapper from "@/components/dashboard/WidgetWrapper";
import ExportModal   from "@/components/dashboard/ExportModal";

interface DashboardTabProps {
  fileId: string;
}

export default function DashboardTab({ fileId }: DashboardTabProps) {
  const [layout,        setLayout]        = useState<DashboardLayout | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [editMode,      setEditMode]      = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [saveSuccess,   setSaveSuccess]   = useState(false);
  const [exportOpen,    setExportOpen]    = useState(false);
  const [loadingTime,   setLoadingTime]   = useState(0);
  const [hiddenWidgets, setHiddenWidgets] = useState<DashboardWidget[]>([]);
  const [undoWidget,    setUndoWidget]    = useState<DashboardWidget | null>(null);
  const [notification,  setNotification]  = useState<string | null>(null);

  const undoTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notifTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const originalLayoutRef = useRef<DashboardLayout | null>(null);

  const load = useCallback(
    (bust = false) => {
      if (bust) clearLayoutCache(fileId);
      setLoading(true);
      setError(null);
      setLoadingTime(0);
      const startTime = performance.now();
      loadDashboardLayout(fileId, (l) => {
        setLoadingTime(performance.now() - startTime);
        setLayout(l);
        if (!originalLayoutRef.current || bust) {
          originalLayoutRef.current = l;
        }
        setLoading(false);
      }).catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load dashboard.");
        setLoading(false);
      });
    },
    [fileId],
  );

  useEffect(() => { load(); }, [load]);

  function showNotification(msg: string) {
    setNotification(msg);
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    notifTimerRef.current = setTimeout(() => setNotification(null), 3500);
  }

  function handleDelete(widgetId: string) {
    if (!layout) return;
    const widget = layout.widgets.find((w) => w.id === widgetId);
    if (!widget) return;

    // Soft delete — move to hiddenWidgets, keep undo available for 5 s
    setLayout(removeWidget(layout, widgetId));
    setHiddenWidgets((prev) => [...prev, widget]);
    setUndoWidget(widget);

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setUndoWidget(null), 5000);

    showNotification(`"${widget.title}" removed`);
  }

  function handleUndo() {
    if (!undoWidget || !layout) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    const restored: DashboardLayout = {
      ...layout,
      widgets: [...layout.widgets, undoWidget],
      layout:  { ...layout.layout, [undoWidget.id]: undoWidget.position },
    };
    setLayout(restored);
    setHiddenWidgets((prev) => prev.filter((w) => w.id !== undoWidget.id));
    showNotification(`"${undoWidget.title}" restored`);
    setUndoWidget(null);
  }

  function handleRestoreWidget(widget: DashboardWidget) {
    if (!layout) return;
    setLayout({
      ...layout,
      widgets: [...layout.widgets, widget],
      layout:  { ...layout.layout, [widget.id]: widget.position },
    });
    setHiddenWidgets((prev) => prev.filter((w) => w.id !== widget.id));
    if (undoWidget?.id === widget.id) setUndoWidget(null);
  }

  function handleReset() {
    if (!originalLayoutRef.current) return;
    setLayout(originalLayoutRef.current);
    setHiddenWidgets([]);
    setUndoWidget(null);
    showNotification("Dashboard reset to defaults");
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination || !layout) return;
    const items = Array.from(layout.widgets);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setLayout({ ...layout, widgets: items });
  }

  async function handleSave() {
    if (!layout) return;
    setSaving(true);
    try {
      await persistLayout(fileId, layout);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch { /* ignore */ }
    finally {
      setSaving(false);
      setEditMode(false);
    }
  }

  // ── render states ────────────────────────────────────────────────────────

  if (loading && !layout) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 size={36} className="text-sky-400 animate-spin" />
        <p className="text-slate-400 text-sm">Generating your dashboard…</p>
        {loadingTime > 0 && (
          <p className="text-xs text-slate-500">{loadingTime.toFixed(0)}ms</p>
        )}
      </div>
    );
  }

  if (error && !layout) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <AlertCircle size={32} className="text-red-400" />
        <div>
          <p className="text-slate-200 font-semibold">Could not load dashboard</p>
          <p className="text-slate-500 text-sm mt-1">{error}</p>
        </div>
        <button
          onClick={() => load(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600
                     text-xs text-slate-300 hover:border-slate-500 hover:text-slate-200 transition-all"
        >
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  if (!layout || (!layout.widgets?.length && !hiddenWidgets.length)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="text-slate-400 text-sm">No widgets to display.</p>
        <button
          onClick={() => load(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600
                     text-xs text-slate-300 hover:border-slate-500 transition-all"
        >
          <RefreshCw size={12} /> Regenerate
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Notification banner */}
      {notification && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg
                        bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs">
          <span>⚠️ {notification}</span>
          {undoWidget && (
            <button
              onClick={handleUndo}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium shrink-0"
            >
              <Undo2 size={11} /> Undo
            </button>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-100">Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-generated visualizations. Customize to your needs.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {saveSuccess && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <Check size={12} /> Saved
            </span>
          )}

          {undoWidget && (
            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-600/50
                         bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all"
            >
              <Undo2 size={12} /> Undo
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-600
                       text-slate-400 text-xs font-medium hover:border-slate-500 hover:text-slate-200 transition-all"
            title="Reset to default layout"
          >
            <RotateCcw size={12} /> Reset
          </button>

          {editMode && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-600/50
                         bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              Save Layout
            </button>
          )}

          <button
            onClick={() => setEditMode((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
              ${editMode
                ? "border-sky-600/50 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                : "border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
          >
            <Pencil size={12} />
            {editMode ? "Done" : "Customize"}
          </button>

          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-600
                       text-slate-400 text-xs font-medium hover:border-slate-500 hover:text-slate-200 transition-all"
          >
            <Download size={12} /> Export
          </button>

          <button
            onClick={() => load(true)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700
                       text-slate-500 text-xs hover:text-slate-300 hover:border-slate-600 transition-all disabled:opacity-40"
            title="Regenerate dashboard"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Edit mode hint */}
      {editMode && (
        <p className="text-xs text-slate-500 text-center py-1">
          📍 Drag widgets to reorder • Click ✕ to remove • Click Save to persist
        </p>
      )}

      {/* Hidden widgets panel */}
      {hiddenWidgets.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 rounded-lg
                        bg-slate-800/40 border border-slate-700/50 text-xs">
          <span className="text-slate-400">
            📌 {hiddenWidgets.length} widget{hiddenWidgets.length > 1 ? "s" : ""} hidden:
          </span>
          {hiddenWidgets.map((w) => (
            <button
              key={w.id}
              onClick={() => handleRestoreWidget(w)}
              className="flex items-center gap-1 px-2 py-1 rounded border border-slate-600
                         text-slate-300 hover:border-sky-500/50 hover:text-sky-300 transition-all"
            >
              <Plus size={10} /> {w.title}
            </button>
          ))}
        </div>
      )}

      {/* Widget grid */}
      {layout && layout.widgets.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="dashboard-grid">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {layout.widgets.map((widget, index) => (
                  <Draggable
                    key={widget.id}
                    draggableId={widget.id}
                    index={index}
                    isDragDisabled={!editMode}
                  >
                    {(dragProvided, dragSnapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        className={widget.type === "kpi" || widget.type === "gauge" ? "md:col-span-2" : ""}
                        style={{
                          ...dragProvided.draggableProps.style,
                          opacity: dragSnapshot.isDragging ? 0.85 : 1,
                        }}
                      >
                        <WidgetWrapper
                          widget={widget}
                          editMode={editMode}
                          onDelete={handleDelete}
                          dragHandleProps={dragProvided.dragHandleProps}
                          isDragging={dragSnapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}
