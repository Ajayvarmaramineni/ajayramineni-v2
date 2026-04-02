"use client";

import { useEffect, useState } from "react";
import { Table2, AlertCircle } from "lucide-react";

interface PreviewData {
  columns: string[];
  rows:    Record<string, unknown>[];
}

function formatCell(val: unknown): string {
  if (val === null || val === undefined || val === "") return "—";
  if (typeof val === "number") {
    return Number.isInteger(val) ? String(val) : val.toFixed(4).replace(/\.?0+$/, "");
  }
  return String(val);
}

function isNumericCol(rows: Record<string, unknown>[], col: string): boolean {
  return rows.slice(0, 10).every((r) => {
    const v = r[col];
    return v === null || v === undefined || v === "" || typeof v === "number";
  });
}

export default function DataPreviewTab({ fileId }: { fileId: string }) {
  const [preview, setPreview] = useState<PreviewData | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`datastatz_preview_${fileId}`);
      if (raw) setPreview(JSON.parse(raw) as PreviewData);
    } catch { /* ignore */ }
  }, [fileId]);

  if (!preview || preview.rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
          <AlertCircle size={24} className="text-slate-500" />
        </div>
        <div>
          <p className="text-slate-300 font-semibold">No data preview available</p>
          <p className="text-slate-500 text-sm mt-1 max-w-xs">
            Preview is captured at upload time. Re-upload the file to see a data preview.
          </p>
        </div>
      </div>
    );
  }

  const { columns, rows } = preview;
  const numericCols = new Set(columns.filter((c) => isNumericCol(rows, c)));

  return (
    <div className="space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <Table2 size={15} className="text-sky-400" />
          </div>
          <div>
            <p className="text-slate-200 font-bold text-sm">Data Preview</p>
            <p className="text-slate-500 text-xs">
              {rows.length} row{rows.length !== 1 ? "s" : ""} · {columns.length} column{columns.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 italic">scroll ↕ rows · scroll ↔ columns</p>
      </div>

      {/* Scrollable table — vertical for rows, horizontal for columns */}
      <div className="rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table className="min-w-full text-xs border-collapse">

            {/* Sticky header row */}
            <thead className="sticky top-0 z-20">
              <tr className="bg-[#1a2640] border-b border-slate-700">
                <th className="sticky left-0 z-30 bg-[#1a2640] px-3 py-2.5 text-center
                               font-semibold text-slate-500 border-r border-slate-700 select-none w-10">
                  #
                </th>
                {columns.map((col) => (
                  <th key={col}
                    className={`px-4 py-2.5 font-semibold text-slate-300 whitespace-nowrap
                                border-r border-slate-700/60 last:border-r-0
                                ${numericCols.has(col) ? "text-right" : "text-left"}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, ri) => {
                const isEven = ri % 2 === 0;
                return (
                  <tr key={ri}
                    className={`border-b border-slate-700/40 last:border-b-0 transition-colors
                                hover:bg-sky-500/5 ${isEven ? "bg-slate-900/20" : "bg-slate-900/40"}`}>
                    <td className="sticky left-0 z-10 bg-[#0f172a] px-3 py-2 text-center
                                   text-slate-600 border-r border-slate-700/40 font-mono select-none">
                      {ri + 1}
                    </td>
                    {columns.map((col) => {
                      const val       = row[col];
                      const formatted = formatCell(val);
                      const isEmpty   = val === null || val === undefined || val === "";
                      return (
                        <td key={col}
                          className={`px-4 py-2 border-r border-slate-700/30 last:border-r-0
                                      max-w-[200px] truncate
                                      ${numericCols.has(col) ? "text-right font-mono text-sky-300/90" : "text-left text-slate-300"}
                                      ${isEmpty ? "text-slate-600 italic" : ""}`}
                          title={formatted}>
                          {formatted}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {rows.length >= 100 && (
        <p className="text-center text-xs text-slate-600">
          Showing first {rows.length} rows — full dataset processed in the analysis tabs above
        </p>
      )}
    </div>
  );
}
