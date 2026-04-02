/**
 * lib/helpers.ts
 * Shared utility helpers for the Statlab frontend.
 */


export function formatNumber(n: number, decimals = 2): string {
  if (!isFinite(n)) return "-";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(n: number, decimals = 1): string {
  if (!isFinite(n)) return "-";
  return `${(n * 100).toFixed(decimals)}%`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}


export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function toTitleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function truncate(s: string, maxLen = 40): string {
  return s.length > maxLen ? `${s.slice(0, maxLen)}…` : s;
}

/** Convert a snake_case or kebab-case key to a human-readable label. */
export function humanLabel(key: string): string {
  return toTitleCase(key.replace(/[_-]/g, " "));
}


/**
 * Map a normalised value [0, 1] to a Tailwind colour token string.
 * Used for quality scores and correlation magnitudes.
 */
export function scoreColour(value: number): string {
  if (value >= 0.8) return "text-green-400";
  if (value >= 0.6) return "text-yellow-400";
  if (value >= 0.4) return "text-orange-400";
  return "text-red-400";
}

export function scoreBg(value: number): string {
  if (value >= 0.8) return "bg-green-900/30 border-green-700";
  if (value >= 0.6) return "bg-yellow-900/30 border-yellow-700";
  if (value >= 0.4) return "bg-orange-900/30 border-orange-700";
  return "bg-red-900/30 border-red-700";
}

/** Return a hex colour for a correlation value in [-1, 1]. */
export function correlationColour(r: number): string {
  const abs = Math.abs(r);
  if (abs >= 0.8) return r > 0 ? "#22c55e" : "#ef4444"; // strong
  if (abs >= 0.5) return r > 0 ? "#86efac" : "#fca5a5"; // moderate
  return "#6b7280"; // weak / near-zero
}


export function safeGet<T>(obj: Record<string, unknown>, key: string, fallback: T): T {
  const v = obj[key];
  return v !== undefined && v !== null ? (v as T) : fallback;
}

/** Remove duplicates from an array. */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/** Sort an array of objects by a numeric key descending. */
export function sortByDesc<T extends Record<string, unknown>>(
  arr: T[],
  key: string
): T[] {
  return [...arr].sort((a, b) => (b[key] as number) - (a[key] as number));
}


export const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls", ".json"];
export const MAX_FILE_SIZE_MB = 50;

export function isAcceptedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export function isFileTooLarge(file: File): boolean {
  return file.size > MAX_FILE_SIZE_MB * 1024 * 1024;
}


export type DashTab = "preview" | "overview" | "cleaning" | "eda" | "scope" | "insights" | "predictions" | "dashboard";

export const TABS: { id: DashTab; label: string; pro?: boolean }[] = [
  { id: "preview",     label: "Preview"     },
  { id: "overview",    label: "Overview"    },
  { id: "cleaning",    label: "Cleaning"    },
  { id: "eda",         label: "EDA"         },
  { id: "scope",       label: "Scope"       },
  { id: "insights",    label: "Insights"    },
  { id: "predictions", label: "Predictions", pro: true },
  { id: "dashboard",   label: "Dashboard",   pro: true },
];
