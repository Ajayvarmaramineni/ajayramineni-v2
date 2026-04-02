"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type SortDir = "asc" | "desc";

interface StatRow {
  column: string;
  mean:   number;
  median: number;
  std:    number;
  min:    number;
  max:    number;
}

const COLS: { key: keyof StatRow; label: string }[] = [
  { key: "column", label: "Column" },
  { key: "mean",   label: "Mean"   },
  { key: "median", label: "Median" },
  { key: "std",    label: "Std"    },
  { key: "min",    label: "Min"    },
  { key: "max",    label: "Max"    },
];

export default function StatsTable({ config }: { config: Record<string, unknown> }) {
  const rows = (config.rows ?? []) as StatRow[];
  const [sortKey, setSortKey] = useState<keyof StatRow>("column");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: keyof StatRow) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  if (!rows.length) {
    return <p className="text-slate-500 text-sm text-center pt-8">No numeric columns found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-700/50">
            {COLS.map(({ key, label }) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="px-3 py-2 text-left text-slate-400 font-semibold uppercase tracking-wider
                           cursor-pointer hover:text-slate-200 transition-colors select-none whitespace-nowrap"
              >
                <span className="flex items-center gap-1">
                  {label}
                  {sortKey === key ? (
                    sortDir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />
                  ) : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.column} className="border-b border-slate-800/60 hover:bg-slate-700/20 transition-colors">
              <td className="px-3 py-2 font-medium text-slate-200 whitespace-nowrap">{row.column}</td>
              <td className="px-3 py-2 text-right font-mono text-sky-300">{row.mean?.toFixed(3)}</td>
              <td className="px-3 py-2 text-right font-mono text-sky-300">{row.median?.toFixed(3)}</td>
              <td className="px-3 py-2 text-right font-mono text-slate-400">{row.std?.toFixed(3)}</td>
              <td className="px-3 py-2 text-right font-mono text-slate-400">{row.min?.toFixed(3)}</td>
              <td className="px-3 py-2 text-right font-mono text-slate-400">{row.max?.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
