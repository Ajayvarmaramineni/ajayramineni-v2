/**
 * lib/api.ts
 * All API calls to the DataStatz FastAPI backend.
 * Base URL is pulled from NEXT_PUBLIC_API_URL env variable.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Network errors have different messages across browsers:
// Chrome: "Failed to fetch" | Safari: "Load failed" | Firefox: "NetworkError when attempting to fetch resource"
function isNetworkError(err: unknown): boolean {
  if (!(err instanceof TypeError)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("failed to fetch") ||
    msg.includes("load failed") ||
    msg.includes("networkerror") ||
    msg.includes("network request failed")
  );
}

async function request<T>(path: string, options?: RequestInit, retries = 2): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE}${path}`, options);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        if (res.status === 404) {
          throw new Error("Session expired - please re-upload your file.");
        }
        throw new Error(err.detail ?? "Request failed");
      }
      return res.json() as Promise<T>;
    } catch (err) {
      if (isNetworkError(err) && attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      if (isNetworkError(err)) {
        throw new Error("Cannot reach the server - the backend may be waking up. Please try again in a moment.");
      }
      throw err;
    }
  }
  throw new Error("Request failed after retries");
}


export interface UploadResponse {
  file_id:            string;
  file_name:          string;
  row_count:          number;
  column_count:       number;
  detected_file_type: string;
  columns:            string[];
  preview_rows:       Record<string, unknown>[];
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);
  return request<UploadResponse>("/upload", { method: "POST", body: form });
}


export async function analyzeDataset(fileId: string) {
  return request(`/analyze/${fileId}`, { method: "POST" });
}


export async function getCleaning(fileId: string) {
  return request(`/cleaning/${fileId}`);
}


export async function getEDA(fileId: string) {
  return request(`/eda/${fileId}`);
}


export async function getScope(fileId: string) {
  return request(`/scope/${fileId}`);
}


export async function getInsights(fileId: string) {
  return request(`/insights/${fileId}`);
}


export interface ModelComparisonRow {
  model:    string;
  cv_score: number;
  cv_std:   number;
  winner:   boolean;
}

export interface RocCurveData {
  fpr: number[];
  tpr: number[];
}

export interface CalibrationData {
  mean_predicted:        number[];
  fraction_of_positives: number[];
}

export interface LearningCurveData {
  train_sizes:  number[];
  train_scores: number[];
  val_scores:   number[];
}

export interface MLResult {
  task_type:           "classification" | "regression";
  target_column:       string;
  metric_label:        string;
  score:               number;
  best_model:          string;
  train_rows:          number;
  test_rows:           number;
  n_features:          number;
  feature_importances: { feature: string; importance: number }[];
  confusion_matrix:    number[][];
  target_labels:       string[];
  model_comparison:    ModelComparisonRow[];
  // Classification extras
  f1?:        number;
  precision?: number;
  recall?:    number;
  auc?:       number | null;
  // Regression extras
  mae?:  number;
  rmse?: number;
  // Advanced diagnostics (may be null if not available)
  roc_curve?:        RocCurveData | null;
  calibration_curve?: CalibrationData | null;
  learning_curve?:   LearningCurveData | null;
  shap_values?:      { feature: string; shap_value: number }[];
}

export async function runML(fileId: string, targetColumn: string): Promise<MLResult> {
  return request<MLResult>(`/ml/${fileId}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ target_column: targetColumn }),
  });
}


export interface CleanOp {
  op:        "drop_column" | "fill_nulls" | "drop_null_rows" | "drop_duplicates"
           | "remove_outliers" | "clean_text" | "convert_type";
  column?:   string;
  strategy?: "mean" | "median" | "mode" | "constant"
           | "forward_fill" | "backward_fill" | "interpolate" | "knn"
           | "iqr" | "zscore" | "winsorize"
           | "trim" | "lower" | "upper" | "title" | "remove_special"
           | "trim,lower" | "trim,upper" | "trim,remove_special" | "trim,lower,remove_special"
           | "numeric" | "datetime" | "string";
  value?:     string;
  threshold?: number;
  lower_pct?: number;
  upper_pct?: number;
}

export interface CleanResult {
  new_file_id:   string;
  file_name:     string;
  row_count:     number;
  column_count:  number;
  columns:       string[];
  preview_rows:  Record<string, unknown>[];
  applied:       string[];
  original_rows: number;
  original_cols: number;
}

export interface PreviewResult {
  before: {
    row_count:    number;
    column_count: number;
    null_count:   number;
    preview_rows: Record<string, unknown>[];
  };
  after: {
    row_count:    number;
    column_count: number;
    null_count:   number;
    preview_rows: Record<string, unknown>[];
  };
  applied:      string[];
  rows_removed: number;
  cols_removed: number;
  nulls_removed: number;
}

export interface HistoryResult {
  file_id:    string;
  parent_id:  string | null;
  operations: string[];
  can_undo:   boolean;
}

export async function applyClean(fileId: string, operations: CleanOp[]): Promise<CleanResult> {
  return request<CleanResult>(`/interactive-clean/${fileId}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ operations }),
  });
}

export async function previewClean(fileId: string, operations: CleanOp[]): Promise<PreviewResult> {
  return request<PreviewResult>(`/interactive-clean/preview/${fileId}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ operations }),
  });
}

export async function getCleanHistory(fileId: string): Promise<HistoryResult> {
  return request<HistoryResult>(`/interactive-clean/history/${fileId}`);
}

export interface UndoResult {
  file_id:      string;
  file_name:    string;
  row_count:    number;
  column_count: number;
  columns:      string[];
  preview_rows: Record<string, unknown>[];
  operations:   string[];
}

export async function undoClean(fileId: string): Promise<UndoResult> {
  return request<UndoResult>(`/interactive-clean/undo/${fileId}`, {
    method: "POST",
  });
}


export interface ShareResult {
  share_id: string;
}

export async function createShare(fileName: string, data: Record<string, unknown>): Promise<ShareResult> {
  return request<ShareResult>("/share", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ file_name: fileName, data }),
  });
}

export async function getShare(shareId: string): Promise<{ file_name: string; data: Record<string, unknown>; created_at: string }> {
  return request(`/share/${shareId}`);
}


export async function registerUser(name: string, email: string, institution: string): Promise<void> {
  try {
    await request("/users/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, institution }),
    });
  } catch { /* non-critical — don't block signup */ }
}

export async function trackAnalysis(userEmail: string, fileName: string, rowCount: number, colCount: number): Promise<void> {
  try {
    await request("/users/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ user_email: userEmail, file_name: fileName, row_count: rowCount, col_count: colCount }),
    });
  } catch { /* non-critical */ }
}

export async function getAdminStats(secret: string) {
  return request("/admin/stats", { headers: { "x-admin-secret": secret } });
}

export async function getAdminUsers(secret: string) {
  return request("/admin/users", { headers: { "x-admin-secret": secret } });
}

export async function setUserPro(secret: string, email: string, isPro: boolean) {
  return request(`/admin/users/${encodeURIComponent(email)}`, {
    method:  "PATCH",
    headers: { "Content-Type": "application/json", "x-admin-secret": secret },
    body:    JSON.stringify({ is_pro: isPro }),
  });
}


export async function runFullPipeline(fileId: string) {
  const [analyze, cleaning, eda, scope, insights] = await Promise.all([
    analyzeDataset(fileId),
    getCleaning(fileId),
    getEDA(fileId),
    getScope(fileId),
    getInsights(fileId),
  ]);
  return { analyze, cleaning, eda, scope, insights };
}


// ── Dashboard ──────────────────────────────────────────────────────────────

export interface DashboardMetric {
  label: string;
  value: string | number;
  icon:  string;
}

export interface DashboardWidget {
  id:          string;
  type:        "kpi" | "bar" | "line" | "heatmap" | "table" | "gauge";
  title:       string;
  description: string;
  columns:     string[];
  config:      Record<string, unknown>;
  position:    { x: number; y: number; w: number; h: number };
}

export interface DashboardLayout {
  widgets:    DashboardWidget[];
  layout:     Record<string, { x: number; y: number; w: number; h: number }>;
  created_at: string;
  updated_at: string;
}

export async function generateDashboard(fileId: string): Promise<DashboardLayout> {
  return request<DashboardLayout>(`/dashboard/${fileId}/generate`);
}

export async function getDashboardLayout(fileId: string): Promise<DashboardLayout> {
  return request<DashboardLayout>(`/dashboard/${fileId}/layout`);
}

export async function saveDashboardLayout(
  fileId:  string,
  widgets: DashboardWidget[],
  layout:  Record<string, { x: number; y: number; w: number; h: number }>,
): Promise<{ ok: boolean; updated_at: string }> {
  return request(`/dashboard/${fileId}/save-layout`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ widgets, layout }),
  });
}

export async function deleteDashboardWidget(
  fileId:   string,
  widgetId: string,
): Promise<{ ok: boolean }> {
  return request(`/dashboard/${fileId}/widget/${widgetId}/delete`, {
    method: "POST",
  });
}
