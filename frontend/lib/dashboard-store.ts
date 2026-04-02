/**
 * lib/dashboard-store.ts
 * Client-side utilities for loading, caching, and mutating dashboard layouts.
 */

import {
  generateDashboard,
  getDashboardLayout,
  saveDashboardLayout,
  deleteDashboardWidget,
  type DashboardLayout,
  type DashboardWidget,
} from "@/lib/api";

const CACHE_PREFIX = "dashboard_layout_";

function cacheKey(fileId: string): string {
  return `${CACHE_PREFIX}${fileId}`;
}

/** Read a layout from localStorage (returns null if not found). */
export function readCachedLayout(fileId: string): DashboardLayout | null {
  try {
    const raw = localStorage.getItem(cacheKey(fileId));
    return raw ? (JSON.parse(raw) as DashboardLayout) : null;
  } catch {
    return null;
  }
}

/** Write a layout to localStorage. */
function writeCachedLayout(fileId: string, layout: DashboardLayout): void {
  try {
    localStorage.setItem(cacheKey(fileId), JSON.stringify(layout));
  } catch { /* storage full — ignore */ }
}

/**
 * Load the dashboard layout for a file.
 * Returns the cached version immediately (if available) while fetching from backend.
 * Calls `onUpdate` when the backend response arrives.
 */
export async function loadDashboardLayout(
  fileId:   string,
  onUpdate: (layout: DashboardLayout) => void,
): Promise<void> {
  // Serve from cache while network loads
  const cached = readCachedLayout(fileId);
  if (cached) onUpdate(cached);

  try {
    const layout = await generateDashboard(fileId);
    writeCachedLayout(fileId, layout);
    onUpdate(layout);
  } catch {
    // If generate fails, fall back to get-layout
    try {
      const layout = await getDashboardLayout(fileId);
      writeCachedLayout(fileId, layout);
      onUpdate(layout);
    } catch { /* silently ignore — cached data already shown */ }
  }
}

/** Persist updated layout to backend and update cache. */
export async function persistLayout(
  fileId:  string,
  layout:  DashboardLayout,
): Promise<void> {
  writeCachedLayout(fileId, layout);
  await saveDashboardLayout(fileId, layout.widgets, layout.layout);
}

/** Remove a widget from the layout (local mutation + backend sync). */
export function removeWidget(
  layout:   DashboardLayout,
  widgetId: string,
): DashboardLayout {
  return {
    ...layout,
    widgets: layout.widgets.filter((w) => w.id !== widgetId),
    layout:  Object.fromEntries(
      Object.entries(layout.layout).filter(([k]) => k !== widgetId),
    ),
  };
}

/** Delete a widget on the backend and return updated local layout. */
export async function deleteWidget(
  fileId:   string,
  layout:   DashboardLayout,
  widgetId: string,
): Promise<DashboardLayout> {
  const updated = removeWidget(layout, widgetId);
  writeCachedLayout(fileId, updated);
  try {
    await deleteDashboardWidget(fileId, widgetId);
  } catch { /* non-critical — local state already updated */ }
  return updated;
}

/** Clear the local cache for a file (forces re-generation next load). */
export function clearLayoutCache(fileId: string): void {
  try {
    localStorage.removeItem(cacheKey(fileId));
  } catch { /* ignore */ }
}
