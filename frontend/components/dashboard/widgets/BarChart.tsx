"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function BarWidget({ config }: { config: Record<string, unknown> }) {
  const data   = (config.data   ?? []) as Record<string, unknown>[];
  const xKey   = (config.x_key ?? "name")  as string;
  const yKey   = (config.y_key ?? "count") as string;
  const color  = (config.color  ?? "#38bdf8") as string;

  if (!data.length) {
    return <p className="text-slate-500 text-sm text-center pt-8">No data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
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
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
