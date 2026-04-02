"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatNumber, truncate } from "@/lib/helpers";

interface CategoryChartProps {
  column:    string;
  topValues: { value: string; count: number }[];
}

const BAR_COLOURS = [
  "#0ea5e9", "#38bdf8", "#7dd3fc",
  "#a5f3fc", "#06b6d4", "#22d3ee",
  "#67e8f9", "#cffafe",
];

export default function CategoryChart({ column, topValues }: CategoryChartProps) {
  if (!topValues || topValues.length === 0) return null;

  const chartData = topValues.slice(0, 8).map((v) => ({
    label: truncate(String(v.value), 18),
    count: v.count,
  }));

  const total = topValues.reduce((s, v) => s + v.count, 0);

  return (
    <div>
      <p className="text-xs text-slate-500 mb-2">Top values - {column}</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 0, right: 30, bottom: 0, left: 0 }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={{
              background:   "#1e293b",
              border:       "1px solid #334155",
              borderRadius: "8px",
              fontSize:     "12px",
              color:        "#f1f5f9",
            }}
            formatter={(v: number) => [
              `${formatNumber(v, 0)} (${((v / total) * 100).toFixed(1)}%)`,
              "Count",
            ]}
            cursor={{ fill: "#ffffff08" }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={BAR_COLOURS[i % BAR_COLOURS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
