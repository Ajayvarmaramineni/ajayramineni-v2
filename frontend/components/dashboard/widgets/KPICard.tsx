"use client";

interface Metric {
  label: string;
  value: string | number;
  icon:  string;
}

const ICONS: Record<string, string> = {
  rows:    "📊",
  columns: "🗂️",
  missing: "⚠️",
};

const COLORS = ["text-sky-400", "text-emerald-400", "text-amber-400", "text-violet-400"];

export default function KPICard({ config }: { config: Record<string, unknown> }) {
  const metrics = (config.metrics ?? []) as Metric[];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className="bg-slate-900/60 border border-slate-700/60 rounded-xl px-5 py-4 flex flex-col gap-1"
        >
          <span className="text-2xl">{ICONS[m.icon] ?? "📌"}</span>
          <p className={`text-2xl font-extrabold ${COLORS[i % COLORS.length]}`}>
            {typeof m.value === "number" ? m.value.toLocaleString() : m.value}
          </p>
          <p className="text-xs text-slate-400 font-medium">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
