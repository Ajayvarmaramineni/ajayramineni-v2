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
import { formatNumber } from "@/lib/helpers";

interface DistributionChartProps {
  column:   string;
  binEdges: number[];
  counts:   number[];
}

export default function DistributionChart({
  column,
  binEdges,
  counts,
}: DistributionChartProps) {
  if (!binEdges || !counts || counts.length === 0) return null;

  // Build chart data - label each bar with the bin midpoint
  const chartData = counts.map((count, i) => ({
    bin:   `${formatNumber(binEdges[i], 1)}`,
    count,
  }));

  return (
    <div>
      <p className="text-xs text-slate-500 mb-2">Distribution - {column}</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="bin"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background:   "#1e293b",
              border:       "1px solid #334155",
              borderRadius: "8px",
              fontSize:     "12px",
              color:        "#f1f5f9",
            }}
            formatter={(v: number) => [formatNumber(v, 0), "Count"]}
            labelFormatter={(label) => `Bin: ${label}`}
            cursor={{ fill: "#ffffff08" }}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell
                key={i}
                fill={i % 2 === 0 ? "#0ea5e9" : "#38bdf8"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
