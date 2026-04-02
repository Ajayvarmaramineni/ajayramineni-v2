"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function LineWidget({ config }: { config: Record<string, unknown> }) {
  const data  = (config.data   ?? []) as Record<string, unknown>[];
  const xKey  = (config.x_key ?? "bin")   as string;
  const yKey  = (config.y_key ?? "count") as string;
  const color = (config.color  ?? "#a78bfa") as string;

  if (!data.length) {
    return <p className="text-slate-500 text-sm text-center pt-8">No data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "#94a3b8", fontSize: 10 }}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
          labelStyle={{ color: "#e2e8f0" }}
          itemStyle={{ color }}
        />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
