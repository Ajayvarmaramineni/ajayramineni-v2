"use client";

interface GaugeConfig {
  score:  number;
  rating: string;
  color:  string;
}

export default function DataQuality({ config }: { config: Record<string, unknown> }) {
  const { score = 0, rating = "—", color = "#94a3b8" } = config as unknown as GaugeConfig;

  const radius      = 56;
  const circumference = 2 * Math.PI * radius;
  const dash        = (score / 100) * circumference;
  const gap         = circumference - dash;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4">
      <svg width="148" height="148" viewBox="0 0 148 148">
        {/* Track */}
        <circle
          cx="74" cy="74" r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="14"
        />
        {/* Progress */}
        <circle
          cx="74" cy="74" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
          transform="rotate(-90 74 74)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        {/* Score text */}
        <text
          x="74" y="70"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#f1f5f9"
          fontSize="22"
          fontWeight="bold"
        >
          {score}%
        </text>
        <text
          x="74" y="92"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#94a3b8"
          fontSize="11"
        >
          quality
        </text>
      </svg>
      <p className="text-sm font-semibold" style={{ color }}>{rating}</p>
      <p className="text-xs text-slate-500 text-center max-w-[200px]">
        Based on completeness and uniqueness of the dataset.
      </p>
    </div>
  );
}
