"use client";

import { useState } from "react";
import {
  Wand2, Loader2, X, CheckCircle2, AlertCircle,
  ChevronDown, Plus, Download, History, Eye, RotateCcw,
} from "lucide-react";
import { applyClean, previewClean, undoClean, getCleanHistory, type CleanOp, type UndoResult } from "@/lib/api";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Issue {
  type:        string;
  severity:    string;
  column?:     string;
  description: string;
  count?:      number;
}

interface InteractiveCleaningPanelProps {
  fileId:  string;
  columns: string[];
  issues:  Issue[];
}

const OP_LABELS: Record<string, string> = {
  fill_nulls:      "Fill missing values",
  drop_null_rows:  "Drop rows with nulls",
  drop_column:     "Drop column",
  drop_duplicates: "Drop duplicate rows",
  remove_outliers: "Remove outliers",
  clean_text:      "Clean text",
  convert_type:    "Convert column type",
};

const STRATEGY_LABELS: Record<string, string> = {
  // imputation
  mean:          "Mean",
  median:        "Median",
  mode:          "Most common value",
  constant:      "Custom value",
  forward_fill:  "Forward fill",
  backward_fill: "Backward fill",
  interpolate:   "Linear interpolation",
  knn:           "KNN imputation",
};

const OUTLIER_METHOD_LABELS: Record<string, string> = {
  iqr:       "IQR method",
  zscore:    "Z-score method",
  winsorize: "Winsorize (cap at percentiles)",
};

const TEXT_CLEAN_LABELS: Record<string, string> = {
  trim:                    "Trim whitespace",
  lower:                   "Lowercase",
  upper:                   "Uppercase",
  title:                   "Title case",
  remove_special:          "Remove special characters",
  "trim,lower":            "Trim + Lowercase",
  "trim,upper":            "Trim + Uppercase",
  "trim,remove_special":   "Trim + Remove special chars",
  "trim,lower,remove_special": "Trim + Lowercase + Remove special chars",
};

const TYPE_CONVERT_LABELS: Record<string, string> = {
  numeric:  "String → Numeric",
  datetime: "String → Datetime",
  string:   "Any → String",
};

export default function InteractiveCleaningPanel({
  fileId, columns, issues,
}: InteractiveCleaningPanelProps) {
  const [ops,         setOps]         = useState<CleanOp[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [previewing,  setPreviewing]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [result,      setResult]      = useState<{ applied: string[]; newFileId: string; fileName: string; rowCount: number; colCount: number } | null>(null);
  const [currentFileId, setCurrentFileId] = useState(fileId);
  const [history,     setHistory]     = useState<string[]>([]);
  const [canUndo,     setCanUndo]     = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [previewData, setPreviewData] = useState<{
    before: { row_count: number; column_count: number; null_count: number; preview_rows: Record<string, unknown>[] };
    after:  { row_count: number; column_count: number; null_count: number; preview_rows: Record<string, unknown>[] };
    applied: string[];
    rows_removed: number;
    cols_removed: number;
    nulls_removed: number;
  } | null>(null);

  function suggestFix(issue: Issue) {
    if (!issue.column) {
      if (issue.type?.toLowerCase().includes("duplic") || issue.description?.toLowerCase().includes("duplic")) {
        addOp({ op: "drop_duplicates" });
      }
      return;
    }
    const isNull = issue.type?.toLowerCase().includes("missing") || issue.description?.toLowerCase().includes("null") || issue.description?.toLowerCase().includes("missing");
    const isDup  = issue.type?.toLowerCase().includes("duplic")  || issue.description?.toLowerCase().includes("duplic");
    if (isDup)       addOp({ op: "drop_duplicates" });
    else if (isNull) addOp({ op: "fill_nulls", column: issue.column, strategy: "median" });
    else             addOp({ op: "fill_nulls", column: issue.column, strategy: "median" });
  }

  function addOp(op: CleanOp) {
    setOps((prev) => [...prev, op]);
    setError(null);
    setPreviewData(null);
  }

  function removeOp(i: number) {
    setOps((prev) => prev.filter((_, idx) => idx !== i));
    setPreviewData(null);
  }

  function updateOp(i: number, patch: Partial<CleanOp>) {
    setOps((prev) => prev.map((op, idx) => idx === i ? { ...op, ...patch } : op));
    setPreviewData(null);
  }

  async function handlePreview() {
    if (ops.length === 0) { setError("Add at least one operation."); return; }
    setPreviewing(true);
    setError(null);
    try {
      const res = await previewClean(currentFileId, ops);
      setPreviewData(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Preview failed");
    } finally {
      setPreviewing(false);
    }
  }

  async function handleApply() {
    if (ops.length === 0) { setError("Add at least one operation."); return; }
    setLoading(true);
    setError(null);
    setPreviewData(null);
    try {
      const res = await applyClean(currentFileId, ops);
      setResult({
        applied:    res.applied,
        newFileId:  res.new_file_id,
        fileName:   res.file_name,
        rowCount:   res.row_count,
        colCount:   res.column_count,
      });
      setCurrentFileId(res.new_file_id);
      // Refresh history
      try {
        const hist = await getCleanHistory(res.new_file_id);
        setHistory(hist.operations);
        setCanUndo(hist.can_undo);
      } catch { /* non-critical */ }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Cleaning failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleUndo() {
    setLoading(true);
    setError(null);
    try {
      const res = await undoClean(currentFileId);
      setCurrentFileId(res.file_id);
      setHistory(res.operations ?? []);
      setCanUndo(false);
      setResult(null);
      setOps([]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Undo failed");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    window.open(`${BASE}/interactive-clean/download/${result.newFileId}`, "_blank");
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-5 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-green-400" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">Data cleaned successfully</h3>
          <p className="text-slate-400 text-sm">
            {result.rowCount.toLocaleString()} rows × {result.colCount} columns
          </p>
        </div>

        {/* What was applied */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-4 text-left w-full max-w-sm space-y-1.5">
          {result.applied.map((a, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 size={12} className="text-green-400 flex-shrink-0 mt-0.5" />
              {a}
            </div>
          ))}
        </div>

        {/* Full history */}
        {history.length > 0 && (
          <div className="w-full max-w-sm">
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2"
            >
              <History size={12} />
              {showHistory ? "Hide" : "Show"} full history ({history.length} operations)
            </button>
            {showHistory && (
              <div className="bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3 text-left space-y-1">
                {history.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-slate-600 font-mono shrink-0">{i + 1}.</span>
                    {h}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 flex-wrap justify-center">
          {/* Download button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400
                       text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <Download size={16} />
            Download {result.fileName}
          </button>

          {/* Undo button */}
          {canUndo && (
            <button
              onClick={handleUndo}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-3 rounded-xl
                         bg-slate-700 hover:bg-slate-600 border border-slate-600
                         text-slate-200 font-semibold text-sm transition-all"
            >
              <RotateCcw size={14} />
              Undo
            </button>
          )}
        </div>

        {/* Apply more fixes */}
        <button
          onClick={() => { setResult(null); setOps([]); setPreviewData(null); }}
          className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
        >
          Apply different fixes
        </button>
      </div>
    );
  }

  // ── Builder ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Wand2 size={18} className="text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">Fix Data</h2>
          <p className="text-xs text-slate-400">
            Apply fixes to your data and download the cleaned dataset as a CSV.
          </p>
        </div>
      </div>

      {/* Suggested fixes */}
      {issues.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Suggested fixes from your analysis
          </p>
          <div className="space-y-2">
            {issues.slice(0, 6).map((issue, i) => (
              <div
                key={i}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border
                  ${issue.severity === "high"   ? "border-red-700/50 bg-red-900/10" :
                    issue.severity === "medium" ? "border-yellow-700/50 bg-yellow-900/10" :
                                                  "border-slate-700 bg-slate-800/40"}`}
              >
                <div className="min-w-0">
                  <p className="text-sm text-slate-200 truncate">{issue.description}</p>
                  {issue.column && (
                    <p className="text-xs text-slate-500 mt-0.5">Column: <span className="text-sky-400 font-mono">{issue.column}</span></p>
                  )}
                </div>
                <button
                  onClick={() => suggestFix(issue)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-violet-400
                             border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20
                             rounded-lg px-3 py-1.5 transition-all flex-shrink-0"
                >
                  <Plus size={11} /> Add fix
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Operations queue */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Operations queue {ops.length > 0 && <span className="text-violet-400">({ops.length})</span>}
          </p>
          <button
            onClick={() => addOp({ op: "fill_nulls", column: columns[0] ?? "", strategy: "median" })}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-400 transition-colors"
          >
            <Plus size={12} /> Add operation
          </button>
        </div>

        {ops.length === 0 ? (
          <div className="border border-dashed border-slate-700 rounded-xl px-5 py-8 text-center">
            <Wand2 size={22} className="text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No operations yet.</p>
            <p className="text-slate-600 text-xs mt-1">Use suggested fixes above or add one manually.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ops.map((op, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">

                    {/* Operation type selector */}
                    <div className="relative">
                      <select
                        value={op.op}
                        onChange={(e) => updateOp(i, { op: e.target.value as CleanOp["op"], strategy: undefined, value: undefined, threshold: undefined })}
                        className="w-full appearance-none bg-slate-900/60 border border-slate-600 rounded-lg
                                   px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 pr-7"
                      >
                        {Object.entries(OP_LABELS).map(([val, lbl]) => (
                          <option key={val} value={val}>{lbl}</option>
                        ))}
                      </select>
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Column selector (most ops) */}
                    {op.op !== "drop_duplicates" && (
                      <div className="relative">
                        <select
                          value={op.column ?? ""}
                          onChange={(e) => updateOp(i, { column: e.target.value })}
                          className="w-full appearance-none bg-slate-900/60 border border-slate-600 rounded-lg
                                     px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 pr-7"
                        >
                          <option value="" disabled>Select column…</option>
                          {columns.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeOp(i)}
                    className="text-slate-500 hover:text-red-400 transition-colors mt-1 flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* fill_nulls strategy */}
                {op.op === "fill_nulls" && (
                  <div className="flex gap-2 mt-2">
                    <div className="relative flex-1">
                      <select
                        value={op.strategy ?? "median"}
                        onChange={(e) => updateOp(i, { strategy: e.target.value as CleanOp["strategy"] })}
                        className="w-full appearance-none bg-slate-900/60 border border-slate-600 rounded-lg
                                   px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 pr-7"
                      >
                        {Object.entries(STRATEGY_LABELS).map(([val, lbl]) => (
                          <option key={val} value={val}>{lbl}</option>
                        ))}
                      </select>
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    {op.strategy === "constant" && (
                      <input
                        type="text"
                        placeholder="Value"
                        value={op.value ?? ""}
                        onChange={(e) => updateOp(i, { value: e.target.value })}
                        className="w-24 bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2
                                   text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                      />
                    )}
                  </div>
                )}

                {/* remove_outliers options */}
                {op.op === "remove_outliers" && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <div className="relative">
                      <select
                        value={op.strategy ?? "iqr"}
                        onChange={(e) => updateOp(i, { strategy: e.target.value as CleanOp["strategy"] })}
                        className="appearance-none bg-slate-900/60 border border-slate-600 rounded-lg
                                   px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 pr-7"
                      >
                        {Object.entries(OUTLIER_METHOD_LABELS).map(([val, lbl]) => (
                          <option key={val} value={val}>{lbl}</option>
                        ))}
                      </select>
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    {op.strategy === "zscore" && (
                      <input
                        type="number"
                        placeholder="Threshold (3.0)"
                        step="0.1"
                        value={op.threshold ?? ""}
                        onChange={(e) => updateOp(i, { threshold: parseFloat(e.target.value) || undefined })}
                        className="w-36 bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2
                                   text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                      />
                    )}
                    {op.strategy === "iqr" && (
                      <input
                        type="number"
                        placeholder="IQR multiplier (1.5)"
                        step="0.1"
                        value={op.threshold ?? ""}
                        onChange={(e) => updateOp(i, { threshold: parseFloat(e.target.value) || undefined })}
                        className="w-40 bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2
                                   text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                      />
                    )}
                    {op.strategy === "winsorize" && (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Lower % (0.05)"
                          step="0.01" min="0" max="0.5"
                          value={op.lower_pct ?? ""}
                          onChange={(e) => updateOp(i, { lower_pct: parseFloat(e.target.value) || undefined })}
                          className="w-32 bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2
                                     text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                        />
                        <input
                          type="number"
                          placeholder="Upper % (0.95)"
                          step="0.01" min="0.5" max="1"
                          value={op.upper_pct ?? ""}
                          onChange={(e) => updateOp(i, { upper_pct: parseFloat(e.target.value) || undefined })}
                          className="w-32 bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2
                                     text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* clean_text options */}
                {op.op === "clean_text" && (
                  <div className="relative mt-2">
                    <select
                      value={op.strategy ?? "trim"}
                      onChange={(e) => updateOp(i, { strategy: e.target.value as CleanOp["strategy"] })}
                      className="w-full appearance-none bg-slate-900/60 border border-slate-600 rounded-lg
                                 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 pr-7"
                    >
                      {Object.entries(TEXT_CLEAN_LABELS).map(([val, lbl]) => (
                        <option key={val} value={val}>{lbl}</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                )}

                {/* convert_type options */}
                {op.op === "convert_type" && (
                  <div className="relative mt-2">
                    <select
                      value={op.strategy ?? "numeric"}
                      onChange={(e) => updateOp(i, { strategy: e.target.value as CleanOp["strategy"] })}
                      className="w-full appearance-none bg-slate-900/60 border border-slate-600 rounded-lg
                                 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 pr-7"
                    >
                      {Object.entries(TYPE_CONVERT_LABELS).map(([val, lbl]) => (
                        <option key={val} value={val}>{lbl}</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Before/After Preview */}
      {previewData && (
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={14} className="text-sky-400" />
            <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">Before / After Preview</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(["before", "after"] as const).map((phase) => (
              <div key={phase} className={`rounded-lg p-3 border text-xs
                ${phase === "before" ? "border-slate-700 bg-slate-900/40" : "border-emerald-700/50 bg-emerald-900/10"}`}>
                <p className={`font-bold mb-2 uppercase tracking-wider ${phase === "before" ? "text-slate-400" : "text-emerald-400"}`}>
                  {phase === "before" ? "Before" : "After"}
                </p>
                <p className="text-slate-300">{previewData[phase].row_count.toLocaleString()} rows</p>
                <p className="text-slate-300">{previewData[phase].column_count} columns</p>
                <p className="text-slate-400">{previewData[phase].null_count} nulls</p>
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-400 space-y-0.5">
            {previewData.rows_removed !== 0 && (
              <p><span className={previewData.rows_removed > 0 ? "text-red-400" : "text-emerald-400"}>
                {previewData.rows_removed > 0 ? `−${previewData.rows_removed}` : `+${Math.abs(previewData.rows_removed)}`}
              </span> rows</p>
            )}
            {previewData.cols_removed !== 0 && (
              <p><span className="text-red-400">−{previewData.cols_removed}</span> columns</p>
            )}
            {previewData.nulls_removed !== 0 && (
              <p><span className={previewData.nulls_removed > 0 ? "text-emerald-400" : "text-slate-400"}>
                −{previewData.nulls_removed} nulls
              </span></p>
            )}
          </div>
          {previewData.applied.map((a, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <CheckCircle2 size={11} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              {a}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-red-900/20 border border-red-800 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        {/* Preview button */}
        <button
          onClick={handlePreview}
          disabled={ops.length === 0 || previewing || loading}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                     bg-slate-700 hover:bg-slate-600 border border-slate-600
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-slate-200 font-semibold text-sm transition-all"
        >
          {previewing
            ? <><Loader2 size={14} className="animate-spin" /> Previewing…</>
            : <><Eye size={14} /> Preview</>}
        </button>

        {/* Apply button */}
        <button
          onClick={handleApply}
          disabled={ops.length === 0 || loading}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                     bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-400 hover:to-emerald-400
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-bold text-sm transition-all shadow-lg shadow-violet-500/20"
        >
          {loading
            ? <><Loader2 size={15} className="animate-spin" /> Applying fixes…</>
            : <><Download size={15} /> Apply {ops.length} fix{ops.length !== 1 ? "es" : ""} & Download CSV</>}
        </button>
      </div>

    </div>
  );
}
