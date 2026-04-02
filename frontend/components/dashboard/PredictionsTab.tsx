"use client";

import { useState } from "react";
import { Loader2, FlaskConical, ChevronDown, AlertCircle, CheckCircle2, Trophy, TrendingUp, Target, BarChart2, Zap } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend, ReferenceLine,
} from "recharts";
import { runML, type MLResult } from "@/lib/api";

interface PredictionsTabProps {
  fileId:  string;
  columns: string[];
}

type VizTab = "overview" | "roc" | "calibration" | "learning" | "shap";

const VIZ_TABS: { id: VizTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview",    label: "Overview",     icon: <BarChart2 size={13} /> },
  { id: "roc",         label: "ROC Curve",    icon: <TrendingUp size={13} /> },
  { id: "calibration", label: "Calibration",  icon: <Target size={13} /> },
  { id: "learning",    label: "Learning Curves", icon: <TrendingUp size={13} /> },
  { id: "shap",        label: "SHAP Values",  icon: <Zap size={13} /> },
];

export default function PredictionsTab({ fileId, columns }: PredictionsTabProps) {
  const [target,  setTarget]  = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<MLResult | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [vizTab,  setVizTab]  = useState<VizTab>("overview");

  async function handleRun() {
    if (!target) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setVizTab("overview");
    try {
      const res = await runML(fileId, target);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  const isClassification = result?.task_type === "classification";
  const scoreColor = result
    ? result.score >= 80 ? "#22c55e" : result.score >= 60 ? "#eab308" : "#ef4444"
    : "#38bdf8";

  // Tabs visible after getting a result
  const visibleTabs = VIZ_TABS.filter((t) => {
    if (!result) return false;
    if (t.id === "overview") return true;
    if (t.id === "roc")         return isClassification && result.roc_curve != null;
    if (t.id === "calibration") return isClassification && result.calibration_curve != null;
    if (t.id === "learning")    return result.learning_curve != null;
    if (t.id === "shap")        return (result.shap_values?.length ?? 0) > 0;
    return false;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <FlaskConical size={18} className="text-rose-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">AutoML Predictions</h2>
          <p className="text-xs text-slate-400">
            Pick a target column — we test multiple algorithms and automatically select the best one.
          </p>
        </div>
      </div>

      {/* Column picker + Run */}
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Target column to predict
          </label>
          <div className="relative">
            <select
              value={target}
              onChange={(e) => { setTarget(e.target.value); setResult(null); setError(null); }}
              className="w-full appearance-none bg-slate-800/60 border border-slate-700 rounded-xl
                         px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-rose-500
                         transition-colors pr-10"
            >
              <option value="" disabled>Select a column…</option>
              {columns.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleRun}
          disabled={!target || loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500
                     hover:from-rose-400 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-bold text-sm transition-all shadow-lg shadow-rose-500/20"
        >
          {loading
            ? <><Loader2 size={15} className="animate-spin" /> Running…</>
            : <><FlaskConical size={15} /> Run Predictions</>}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-900/20 border border-red-800 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 size={36} className="text-rose-400 animate-spin" />
          <div className="text-center">
            <p className="text-slate-200 font-semibold">Testing multiple models…</p>
            <p className="text-slate-400 text-sm mt-1">Cross-validating algorithms to find the best fit</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-5 animate-fade-in">

          {/* Winner banner */}
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
            <Trophy size={18} className="text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-300">
                Best model: {result.best_model}
              </p>
              <p className="text-xs text-slate-400">
                Selected via {result.task_type === "classification" ? "accuracy" : "R²"} cross-validation
                across all candidates
              </p>
            </div>
          </div>

          {/* Viz tabs */}
          {visibleTabs.length > 1 && (
            <div className="flex gap-1 bg-slate-800/60 border border-slate-700 rounded-xl p-1 flex-wrap">
              {visibleTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setVizTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                    ${vizTab === t.id
                      ? "bg-rose-500 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"}`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          )}

          {/* ── Overview tab ─────────────────────────────────────────────── */}
          {vizTab === "overview" && (
            <div className="space-y-5">
              {/* Primary score cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    label: result.metric_label,
                    value: `${result.score}%`,
                    color: scoreColor,
                    sub: result.score >= 80 ? "Excellent" : result.score >= 60 ? "Good" : "Needs more data",
                  },
                  {
                    label: "Task Type",
                    value: isClassification ? "Classification" : "Regression",
                    color: "#a78bfa",
                    sub:   isClassification ? "Predicts a category" : "Predicts a number",
                  },
                  { label: "Training Rows", value: result.train_rows.toString(), color: "#38bdf8", sub: "80% of dataset" },
                  { label: "Test Rows",     value: result.test_rows.toString(),  color: "#34d399", sub: "20% held out" },
                ].map(({ label, value, color, sub }) => (
                  <div key={label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">{label}</p>
                    <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
                    <p className="text-xs text-slate-500 mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Extended metrics */}
              {isClassification ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "F1 Score",  value: result.f1        != null ? `${result.f1}%`        : "—", tip: "Balance of precision & recall" },
                    { label: "Precision", value: result.precision != null ? `${result.precision}%` : "—", tip: "Of predicted positives, how many were right" },
                    { label: "Recall",    value: result.recall    != null ? `${result.recall}%`    : "—", tip: "Of actual positives, how many were caught" },
                    { label: "AUC-ROC",   value: result.auc       != null ? `${result.auc}%`       : "N/A", tip: "50% = random guessing, 100% = perfect" },
                  ].map(({ label, value, tip }) => (
                    <div key={label} className="bg-slate-800/30 border border-slate-700/40 rounded-xl px-4 py-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{label}</p>
                      <p className="text-xl font-bold text-violet-300">{value}</p>
                      <p className="text-xs text-slate-600 mt-1 leading-tight">{tip}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "MAE",  value: result.mae  != null ? result.mae.toString()  : "—", tip: "Mean Absolute Error — avg prediction distance from truth" },
                    { label: "RMSE", value: result.rmse != null ? result.rmse.toString() : "—", tip: "Root Mean Squared Error — penalises large errors more" },
                  ].map(({ label, value, tip }) => (
                    <div key={label} className="bg-slate-800/30 border border-slate-700/40 rounded-xl px-4 py-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{label}</p>
                      <p className="text-xl font-bold text-sky-300">{value}</p>
                      <p className="text-xs text-slate-600 mt-1 leading-tight">{tip}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Model comparison leaderboard */}
              {result.model_comparison?.length > 0 && (
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy size={15} className="text-amber-400" />
                    <h3 className="text-sm font-bold text-slate-200">Model Leaderboard</h3>
                    <span className="text-xs text-slate-500">— all algorithms tested (CV score)</span>
                  </div>
                  <div className="space-y-2">
                    {[...result.model_comparison]
                      .sort((a, b) => b.cv_score - a.cv_score)
                      .map((row) => {
                        const pct = Math.max(0, Math.min(100, row.cv_score));
                        const barColor = row.winner ? "#f59e0b" : "#475569";
                        return (
                          <div key={row.model} className={`flex items-center gap-3 rounded-lg px-3 py-2
                            ${row.winner ? "bg-amber-500/10 border border-amber-500/20" : "bg-slate-800/30"}`}>
                            <span className={`text-xs font-semibold w-36 shrink-0 ${row.winner ? "text-amber-300" : "text-slate-400"}`}>
                              {row.winner ? <><Trophy size={11} className="inline mr-1 text-amber-400" /></> : null}{row.model}
                            </span>
                            <div className="flex-1 bg-slate-700/50 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, background: barColor }}
                              />
                            </div>
                            <span className={`text-xs font-mono w-20 text-right shrink-0 ${row.winner ? "text-amber-300 font-bold" : "text-slate-400"}`}>
                              {row.cv_score}% ±{row.cv_std}%
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Feature importance chart */}
              {result.feature_importances.length > 0 && (
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={15} className="text-rose-400" />
                    <h3 className="text-sm font-bold text-slate-200">Feature Importance</h3>
                    <span className="text-xs text-slate-500">— which columns the winning model relied on most</span>
                  </div>
                  <ResponsiveContainer width="100%" height={Math.max(200, result.feature_importances.length * 32)}>
                    <BarChart
                      data={[...result.feature_importances].reverse()}
                      layout="vertical"
                      margin={{ top: 0, right: 40, left: 8, bottom: 0 }}
                    >
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }}
                        tickFormatter={(v) => `${v}%`} />
                      <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: "#94a3b8" }} width={120} />
                      <Tooltip
                        formatter={(v: number) => [`${v}%`, "Importance"]}
                        contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: "#e2e8f0" }}
                      />
                      <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                        {result.feature_importances.map((_, i) => (
                          <Cell
                            key={i}
                            fill={i === result.feature_importances.length - 1 ? "#f43f5e" : `hsl(${250 + i * 8}, 70%, 60%)`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Confusion matrix */}
              {isClassification && result.confusion_matrix.length > 0 && result.target_labels.length > 0 && (
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={15} className="text-violet-400" />
                    <h3 className="text-sm font-bold text-slate-200">Confusion Matrix</h3>
                    <span className="text-xs text-slate-500">— predicted vs actual</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="text-xs text-center">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-slate-500 text-left">Actual → Predicted</th>
                          {result.target_labels.map((lbl) => (
                            <th key={lbl} className="px-3 py-2 text-violet-400 font-semibold">{lbl}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.confusion_matrix.map((row, i) => (
                          <tr key={i}>
                            <td className="px-3 py-2 text-slate-400 font-semibold text-left">
                              {result.target_labels[i]}
                            </td>
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className="px-3 py-2 rounded font-mono"
                                style={{
                                  background: i === j
                                    ? `rgba(34,197,94,${Math.min(0.15 + cell / 20, 0.5)})`
                                    : cell > 0 ? `rgba(239,68,68,${Math.min(0.1 + cell / 20, 0.4)})` : "transparent",
                                  color: i === j ? "#86efac" : cell > 0 ? "#fca5a5" : "#475569",
                                }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ROC Curve tab ─────────────────────────────────────────────── */}
          {vizTab === "roc" && result.roc_curve && (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={15} className="text-sky-400" />
                <h3 className="text-sm font-bold text-slate-200">ROC Curve</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Receiver Operating Characteristic — AUC {result.auc != null ? `= ${result.auc}%` : ""}. Curves closer to the top-left corner indicate better discrimination.
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={result.roc_curve.fpr.map((fpr, i) => ({
                    fpr,
                    tpr: result.roc_curve!.tpr[i],
                    random: fpr,
                  }))}
                  margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="fpr" type="number" domain={[0, 1]}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    label={{ value: "False Positive Rate", position: "insideBottom", offset: -10, fontSize: 11, fill: "#64748b" }} />
                  <YAxis type="number" domain={[0, 1]}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    formatter={(v: number, name: string) => [v.toFixed(3), name === "tpr" ? "TPR" : name === "random" ? "Random" : name]}
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                  <Line type="monotone" dataKey="tpr" name="ROC" stroke="#f43f5e" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="random" name="Random" stroke="#475569" dot={false} strokeDasharray="4 4" strokeWidth={1} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── Calibration tab ───────────────────────────────────────────── */}
          {vizTab === "calibration" && result.calibration_curve && (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <Target size={15} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-200">Calibration Curve</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Shows how well the predicted probabilities match the actual outcomes. A perfectly calibrated model follows the diagonal.
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={result.calibration_curve.mean_predicted.map((mp, i) => ({
                    mean_predicted: mp,
                    fraction_of_positives: result.calibration_curve!.fraction_of_positives[i],
                    perfect: mp,
                  }))}
                  margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="mean_predicted" type="number" domain={[0, 1]}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    label={{ value: "Mean Predicted Probability", position: "insideBottom", offset: -10, fontSize: 11, fill: "#64748b" }} />
                  <YAxis type="number" domain={[0, 1]}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    label={{ value: "Fraction of Positives", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    formatter={(v: number) => [v.toFixed(3)]}
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                  <Line type="monotone" dataKey="fraction_of_positives" name="Model" stroke="#34d399" dot={{ r: 4 }} strokeWidth={2} />
                  <Line type="monotone" dataKey="perfect" name="Perfect" stroke="#475569" dot={false} strokeDasharray="4 4" strokeWidth={1} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── Learning Curves tab ───────────────────────────────────────── */}
          {vizTab === "learning" && result.learning_curve && (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={15} className="text-violet-400" />
                <h3 className="text-sm font-bold text-slate-200">Learning Curves</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Shows model performance as training data increases. A large gap between training and validation scores indicates overfitting.
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={result.learning_curve.train_sizes.map((size, i) => ({
                    size,
                    train: result.learning_curve!.train_scores[i],
                    validation: result.learning_curve!.val_scores[i],
                  }))}
                  margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="size" tick={{ fontSize: 10, fill: "#64748b" }}
                    label={{ value: "Training Examples", position: "insideBottom", offset: -10, fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }}
                    tickFormatter={(v) => `${v}%`} domain={["auto", "auto"]} />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`]}
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                  <Line type="monotone" dataKey="train" name="Training score" stroke="#f43f5e" dot={{ r: 4 }} strokeWidth={2} />
                  <Line type="monotone" dataKey="validation" name="Validation score" stroke="#38bdf8" dot={{ r: 4 }} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── SHAP Values tab ───────────────────────────────────────────── */}
          {vizTab === "shap" && result.shap_values && result.shap_values.length > 0 && (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={15} className="text-amber-400" />
                <h3 className="text-sm font-bold text-slate-200">SHAP Feature Contributions</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Mean |SHAP value| — average impact of each feature on model output. Larger values indicate higher influence.
              </p>
              <ResponsiveContainer width="100%" height={Math.max(200, result.shap_values.length * 32)}>
                <BarChart
                  data={[...result.shap_values].reverse()}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 8, bottom: 0 }}
                >
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: "#94a3b8" }} width={120} />
                  <Tooltip
                    formatter={(v: number) => [v.toFixed(4), "Mean |SHAP|"]}
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="shap_value" radius={[0, 4, 4, 0]}>
                    {result.shap_values.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i === result.shap_values!.length - 1 ? "#f59e0b" : `hsl(${40 + i * 12}, 80%, 60%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
