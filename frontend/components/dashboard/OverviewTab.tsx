"use client";

import { formatNumber, humanLabel, scoreColour } from "@/lib/helpers";
import { Database, Hash, AlertTriangle, Copy } from "lucide-react";

interface OverviewTabProps {
  data: Record<string, unknown>;
}

interface ColumnSummary {
  column:        string;
  dtype:         string;
  semantic_type: string;
  missing_count: number;
  missing_pct:   number;
  unique_count:  number;
  sample_values: unknown[];
}


function StatCard({
  label,
  value,
  icon: Icon,
  colour = "text-sky-400",
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  colour?: string;
}) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`mt-0.5 w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={colour} />
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="text-xl font-bold text-slate-100 mt-0.5">{value}</p>
      </div>
    </div>
  );
}


function MissingBar({ pct }: { pct: number }) {
  const colour =
    pct === 0 ? "bg-green-500" : pct < 10 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colour}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 w-10 text-right">
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}


const SEMANTIC_COLOURS: Record<string, string> = {
  numeric:            "badge-blue",
  categorical:        "badge-green",
  datetime:           "badge-yellow",
  text:               "badge-gray",
  identifier:         "badge-gray",
  categorical_numeric:"badge-blue",
};

function SemanticBadge({ type }: { type: string }) {
  const cls = SEMANTIC_COLOURS[type] ?? "badge-gray";
  return <span className={cls}>{humanLabel(type)}</span>;
}


export default function OverviewTab({ data }: OverviewTabProps) {
  const summary      = (data.dataset_summary  ?? {}) as Record<string, unknown>;
  const columns      = (data.column_summary   ?? []) as ColumnSummary[];
  const missing      = (data.missing_summary  ?? {}) as Record<string, unknown>;
  const duplicates   = (data.duplicate_summary ?? {}) as Record<string, unknown>;

  const rowCount    = summary.row_count    as number ?? 0;
  const colCount    = summary.column_count as number ?? 0;
  const missingPct  = (missing.missing_pct as number ?? 0);
  const dupCount    = duplicates.duplicate_count as number ?? 0;

  // Overall quality rough indicator
  const qualityScore = Math.max(
    0,
    100 - missingPct * 2 - (dupCount / Math.max(rowCount, 1)) * 100 * 0.5
  );

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Rows"        value={formatNumber(rowCount, 0)} icon={Hash}          colour="text-sky-400" />
        <StatCard label="Columns"     value={formatNumber(colCount, 0)} icon={Database}       colour="text-violet-400" />
        <StatCard label="Missing"     value={`${missingPct.toFixed(1)}%`}  icon={AlertTriangle} colour={missingPct > 10 ? "text-red-400" : "text-yellow-400"} />
        <StatCard label="Duplicates"  value={formatNumber(dupCount, 0)} icon={Copy}           colour={dupCount > 0 ? "text-orange-400" : "text-green-400"} />
      </div>

      {/* Quality score */}
      <div className="card">
        <p className="section-title">Data Quality Score</p>
        <div className="flex items-center gap-4">
          <p className={`text-4xl font-extrabold ${scoreColour(qualityScore / 100)}`}>
            {Math.round(qualityScore)}
            <span className="text-xl font-normal text-slate-400">/100</span>
          </p>
          <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                qualityScore >= 80
                  ? "bg-green-500"
                  : qualityScore >= 60
                  ? "bg-yellow-500"
                  : qualityScore >= 40
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${qualityScore}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Computed from missing-value rate and duplicate ratio.
        </p>
      </div>

      {/* Column table */}
      <div className="card overflow-hidden">
        <p className="section-title mb-4">Column Profile</p>
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Column</th>
                <th>Type</th>
                <th>Semantic</th>
                <th>Unique</th>
                <th className="min-w-[160px]">Missing</th>
                <th>Sample Values</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((col) => (
                <tr key={col.column}>
                  <td className="font-mono text-sky-300 text-xs">{col.column}</td>
                  <td>
                    <span className="badge badge-gray font-mono text-[10px]">{col.dtype}</span>
                  </td>
                  <td>
                    <SemanticBadge type={col.semantic_type} />
                  </td>
                  <td className="text-slate-300">{formatNumber(col.unique_count, 0)}</td>
                  <td>
                    <MissingBar pct={col.missing_pct ?? 0} />
                  </td>
                  <td className="text-xs text-slate-400 max-w-[200px] truncate">
                    {(col.sample_values ?? []).slice(0, 3).map(String).join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Missing detail */}
      {(missing.columns_with_missing as string[])?.length > 0 && (
        <div className="card">
          <p className="section-title">Missing Value Detail</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {Object.entries(
              (missing.missing_by_column as Record<string, number>) ?? {}
            ).map(([col, count]) => (
              <div
                key={col}
                className="flex items-center justify-between gap-3 bg-slate-800/60 rounded-lg px-3 py-2"
              >
                <span className="text-sm font-mono text-sky-300 truncate">{col}</span>
                <span className="text-sm text-slate-300 flex-shrink-0">
                  {formatNumber(count, 0)} rows
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
