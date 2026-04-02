"use client";

function heatColor(v: number): string {
  // Blue (negative) → white (zero) → red (positive)
  if (v >= 0) {
    const t = Math.min(v, 1);
    const r = Math.round(239 * t + 30 * (1 - t));
    const g = Math.round(68  * t + 41 * (1 - t));
    const b = Math.round(68  * t + 59 * (1 - t));
    return `rgb(${r},${g},${b})`;
  }
  const t = Math.min(-v, 1);
  const r = Math.round(56  * t + 30 * (1 - t));
  const g = Math.round(189 * t + 41 * (1 - t));
  const b = Math.round(248 * t + 59 * (1 - t));
  return `rgb(${r},${g},${b})`;
}

export default function HeatmapWidget({ config }: { config: Record<string, unknown> }) {
  const labels = (config.labels ?? []) as string[];
  const matrix = (config.matrix ?? []) as number[][];

  if (!labels.length) {
    return <p className="text-slate-500 text-sm text-center pt-8">Not enough numeric columns.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="text-xs border-collapse min-w-full">
        <thead>
          <tr>
            <th className="p-1 text-slate-500 text-right" />
            {labels.map((l) => (
              <th
                key={l}
                className="p-1 text-slate-400 font-semibold max-w-[60px] truncate"
                title={l}
              >
                {l.length > 8 ? `${l.slice(0, 7)}…` : l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, ri) => (
            <tr key={labels[ri]}>
              <td
                className="pr-2 text-slate-400 font-semibold whitespace-nowrap text-right"
                title={labels[ri]}
              >
                {labels[ri].length > 8 ? `${labels[ri].slice(0, 7)}…` : labels[ri]}
              </td>
              {row.map((val, ci) => (
                <td
                  key={ci}
                  className="p-1 text-center rounded font-mono"
                  style={{
                    background: heatColor(val ?? 0),
                    color: Math.abs(val ?? 0) > 0.5 ? "#fff" : "#1e293b",
                  }}
                >
                  {val != null ? val.toFixed(2) : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
