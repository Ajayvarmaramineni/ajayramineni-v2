"use client";

import { correlationColour, formatNumber } from "@/lib/helpers";

interface StrongPair {
  col_a: string;
  col_b: string;
  r:     number;
}

interface CorrelationHeatmapProps {
  strongPairs: StrongPair[];
}

function CorrelationBar({ r }: { r: number }) {
  const pct    = Math.abs(r) * 100;
  const colour = r > 0 ? "bg-sky-500" : "bg-rose-500";
  return (
    <div className="flex items-center gap-2 w-full">
      {/* Negative side */}
      <div className="flex-1 flex justify-end">
        <div
          className="h-2 rounded-l bg-rose-500 opacity-70"
          style={{ width: r < 0 ? `${pct}%` : "0%", transition: "width 0.6s" }}
        />
      </div>
      {/* Centre tick */}
      <div className="w-px h-3 bg-slate-600 flex-shrink-0" />
      {/* Positive side */}
      <div className="flex-1">
        <div
          className={`h-2 rounded-r ${colour} opacity-70`}
          style={{ width: r > 0 ? `${pct}%` : "0%", transition: "width 0.6s" }}
        />
      </div>
    </div>
  );
}

export default function CorrelationHeatmap({ strongPairs }: CorrelationHeatmapProps) {
  if (!strongPairs || strongPairs.length === 0) return null;

  return (
    <div className="card overflow-hidden">
      <p className="section-title mb-4">Strong Correlations</p>
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Column A</th>
              <th>Column B</th>
              <th>Pearson r</th>
              <th className="min-w-[200px]">Strength</th>
              <th>Interpretation</th>
            </tr>
          </thead>
          <tbody>
            {strongPairs.map((pair, i) => {
              const abs  = Math.abs(pair.r);
              const dir  = pair.r > 0 ? "Positive" : "Negative";
              const str  = abs >= 0.9 ? "Very strong" : abs >= 0.7 ? "Strong" : "Moderate";
              const colour = correlationColour(pair.r);
              return (
                <tr key={i}>
                  <td className="font-mono text-sky-300 text-xs">{pair.col_a}</td>
                  <td className="font-mono text-sky-300 text-xs">{pair.col_b}</td>
                  <td>
                    <span
                      className="font-bold text-sm"
                      style={{ color: colour }}
                    >
                      {formatNumber(pair.r, 3)}
                    </span>
                  </td>
                  <td>
                    <CorrelationBar r={pair.r} />
                  </td>
                  <td className="text-xs text-slate-400">
                    {str} {dir}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 mt-3">
        Only pairs with |r| ≥ 0.7 are shown. Computed via Pearson correlation.
      </p>
    </div>
  );
}
