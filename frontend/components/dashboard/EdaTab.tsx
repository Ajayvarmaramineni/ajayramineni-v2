"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/helpers";
import DistributionChart  from "@/components/charts/DistributionChart";
import CorrelationHeatmap from "@/components/charts/CorrelationHeatmap";
import CategoryChart      from "@/components/charts/CategoryChart";
import Tooltip            from "@/components/ui/Tooltip";
import { CheckCircle, XCircle, AlertCircle, AlertTriangle, TrendingUp } from "lucide-react";

interface EdaTabProps {
  data: Record<string, unknown>;
}

interface NumericSummary {
  column:   string;
  mean:     number;
  median:   number;
  std:      number;
  min:      number;
  max:      number;
  q1:       number;
  q3:       number;
  skewness: number;
  kurtosis: number;
}

interface CategoricalSummary {
  column:       string;
  unique_count: number;
  top_values?:  { value: string; count: number }[];
  top_categories?: { value: string; count: number }[];
}

interface StrongPair {
  col_a: string;
  col_b: string;
  r:     number;
}

interface HypothesisTest {
  group_col?:    string;
  value_col?:    string;
  col_a?:        string;
  col_b?:        string;
  column?:       string;
  group_a?:      string;
  group_b?:      string;
  groups?:       string[];
  t_statistic?:  number;
  f_statistic?:  number;
  chi2?:         number;
  statistic?:    number;
  p_value:       number;
  significant:   boolean;
  interpretation: string;
  normal?:       boolean;
  test?:         string;
}

interface OutlierInfo {
  column:       string;
  outlier_count: number;
  outlier_pct:  number;
  lower_bound:  number;
  upper_bound:  number;
  q1:           number;
  q3:           number;
}

interface GroupComparison {
  grouping_col: string;
  group_a:      string;
  group_b:      string;
  numeric_col:  string;
  mean_a:       number;
  mean_b:       number;
  median_a:     number;
  median_b:     number;
  std_a:        number;
  std_b:        number;
  count_a:      number;
  count_b:      number;
}


const STAT_TIPS: Record<string, string> = {
  Mean:   "The average value. Sum of all values divided by the count. Sensitive to outliers.",
  Median: "The middle value when sorted. More robust than mean when outliers are present.",
  Std:    "Standard Deviation - how spread out the values are. Larger = more spread.",
  Min:    "The smallest value in this column.",
  Max:    "The largest value in this column.",
  Skew:   "Skewness measures asymmetry. Near 0 = symmetric. Positive = right tail, negative = left tail.",
  Q1:     "25th percentile - 25% of values fall below this point.",
  Q3:     "75th percentile - 75% of values fall below this point.",
};


function NumericCard({
  summary,
  dist,
}: {
  summary: NumericSummary;
  dist?:   { bin_edges: number[]; counts: number[] };
}) {
  const stats = [
    { label: "Mean",   value: formatNumber(summary.mean) },
    { label: "Median", value: formatNumber(summary.median) },
    { label: "Std",    value: formatNumber(summary.std) },
    { label: "Min",    value: formatNumber(summary.min) },
    { label: "Max",    value: formatNumber(summary.max) },
    { label: "Skew",   value: formatNumber(summary.skewness, 3) },
  ];

  return (
    <div className="card space-y-4">
      <p className="font-semibold text-slate-100 font-mono text-sm">{summary.column}</p>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="flex items-center gap-1">
              <p className="stat-label text-[10px]">{s.label}</p>
              {STAT_TIPS[s.label] && (
                <Tooltip text={STAT_TIPS[s.label]} size={10} />
              )}
            </div>
            <p className="text-sm font-bold text-slate-200 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {dist && (
        <DistributionChart
          column={summary.column}
          binEdges={dist.bin_edges}
          counts={dist.counts}
        />
      )}
    </div>
  );
}


function TestRow({ test }: { test: HypothesisTest }) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm
      ${test.significant
        ? "bg-amber-900/10 border-amber-800/40"
        : "bg-slate-800/40 border-slate-700/50"
      }`}
    >
      <span className="flex-shrink-0 mt-0.5">
        {test.significant
          ? <AlertCircle size={15} className="text-amber-400" />
          : <CheckCircle size={15} className="text-green-500" />
        }
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-slate-200 text-xs leading-relaxed">{test.interpretation}</p>
        <p className="text-slate-500 text-[10px] mt-0.5">p = {test.p_value}</p>
      </div>
      <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full
        ${test.significant ? "bg-amber-500/20 text-amber-300" : "bg-slate-700 text-slate-400"}`}>
        {test.significant ? "p < 0.05" : "p ≥ 0.05"}
      </span>
    </div>
  );
}


function HypothesisSection({ hyp }: { hyp: Record<string, unknown> }) {
  const [activeTab, setActiveTab] = useState<"normality" | "t_tests" | "anova" | "chi_square">("normality");

  const normality  = (hyp.normality  ?? []) as HypothesisTest[];
  const tTests     = (hyp.t_tests    ?? []) as HypothesisTest[];
  const anova      = (hyp.anova      ?? []) as HypothesisTest[];
  const chiSquare  = (hyp.chi_square ?? []) as HypothesisTest[];

  const tabs = [
    { id: "normality"  as const, label: "Normality",    count: normality.length,  tip: "Tests whether each numeric column follows a normal distribution (Shapiro-Wilk)." },
    { id: "t_tests"    as const, label: "T-Tests",      count: tTests.length,     tip: "Compares means between two groups. Significant = the groups differ." },
    { id: "anova"      as const, label: "ANOVA",        count: anova.length,      tip: "Compares means across 3+ groups. Like a t-test but for multiple groups." },
    { id: "chi_square" as const, label: "Chi-Square",   count: chiSquare.length,  tip: "Tests whether two categorical variables are independent of each other." },
  ];

  const current = { normality, t_tests: tTests, anova, chi_square: chiSquare }[activeTab];

  const NormalityRow = ({ test }: { test: HypothesisTest }) => (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm
      ${test.normal ? "bg-slate-800/40 border-slate-700/50" : "bg-amber-900/10 border-amber-800/40"}`}>
      <div className="flex items-center gap-2">
        {test.normal
          ? <CheckCircle size={14} className="text-green-500" />
          : <XCircle    size={14} className="text-amber-400" />
        }
        <span className="font-mono text-xs text-slate-200">{test.column}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-slate-500">{test.test} · p = {test.p_value}</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
          ${test.normal ? "bg-green-500/20 text-green-300" : "bg-amber-500/20 text-amber-300"}`}>
          {test.normal ? "Normal" : "Non-normal"}
        </span>
      </div>
    </div>
  );

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="section-title text-base">Hypothesis Tests</h2>
        <Tooltip text="Statistical tests that help you determine if patterns in your data are real or due to chance. p < 0.05 is the conventional significance threshold." />
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            disabled={t.count === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${activeTab === t.id
                ? "bg-sky-500 text-white"
                : t.count === 0
                  ? "text-slate-600 cursor-not-allowed"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
          >
            {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full
              ${activeTab === t.id ? "bg-white/20" : "bg-slate-700 text-slate-500"}`}>
              {t.count}
            </span>
            <Tooltip text={t.tip} size={10} />
          </button>
        ))}
      </div>

      {current.length === 0 ? (
        <div className="card text-slate-500 text-sm text-center py-6">
          No {activeTab.replace("_", "-")} tests available for this dataset.
          <p className="text-xs mt-1 text-slate-600">
            {activeTab === "t_tests" ? "Need a binary categorical column paired with numeric columns." :
             activeTab === "anova"   ? "Need a categorical column with 3–6 groups." :
             activeTab === "chi_square" ? "Need two categorical columns with ≤10 unique values each." :
             "Need numeric columns with fewer than 5000 rows."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeTab === "normality"
            ? current.map((t, i) => <NormalityRow key={i} test={t} />)
            : current.map((t, i) => <TestRow key={i} test={t} />)
          }
        </div>
      )}
    </section>
  );
}


function OutlierSection({ outliers }: { outliers: OutlierInfo[] }) {
  const significant = outliers.filter((o) => o.outlier_pct > 2);
  if (significant.length === 0) return null;
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="section-title text-base">Outlier Analysis</h2>
        <Tooltip text="Outliers detected using the IQR method. Values outside Q1 - 1.5×IQR to Q3 + 1.5×IQR are flagged." />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {significant.map((o) => {
          const pct = o.outlier_pct;
          const severity = pct > 15 ? "high" : pct > 5 ? "medium" : "low";
          return (
            <div
              key={o.column}
              className="card border border-amber-800/40 bg-amber-900/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
                  <p className="font-semibold text-slate-100 font-mono text-sm">{o.column}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  severity === "high"
                    ? "bg-red-500/20 text-red-300"
                    : severity === "medium"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-yellow-500/20 text-yellow-300"
                }`}>
                  {pct.toFixed(1)}% outliers
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="stat-label text-[10px]">Count</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{o.outlier_count}</p>
                </div>
                <div>
                  <p className="stat-label text-[10px]">Q1</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{formatNumber(o.q1)}</p>
                </div>
                <div>
                  <p className="stat-label text-[10px]">Q3</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{formatNumber(o.q3)}</p>
                </div>
              </div>
              <p className="text-[11px] text-amber-300/80">
                💡 {o.outlier_count} data point{o.outlier_count !== 1 ? "s" : ""} fall outside normal range [{formatNumber(o.lower_bound)}, {formatNumber(o.upper_bound)}]
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}


function GroupComparisonSection({ comparisons }: { comparisons: GroupComparison[] }) {
  if (comparisons.length === 0) return null;

  // Group by grouping_col
  const byGroup: Record<string, GroupComparison[]> = {};
  for (const c of comparisons) {
    if (!byGroup[c.grouping_col]) byGroup[c.grouping_col] = [];
    byGroup[c.grouping_col].push(c);
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="section-title text-base">Group Comparisons</h2>
        <Tooltip text="Compares numeric column statistics between two groups defined by binary categorical columns. Differences > 10% are highlighted." />
      </div>
      <div className="space-y-6">
        {Object.entries(byGroup).map(([groupCol, rows]) => {
          const topRows = rows.slice(0, 5);
          const sample  = topRows[0];
          return (
            <div key={groupCol} className="card space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400 flex-shrink-0" />
                <p className="font-semibold text-slate-100 text-sm">
                  Grouped by: <span className="font-mono">{groupCol}</span>
                </p>
                <span className="badge badge-gray">{sample.group_a} vs {sample.group_b}</span>
              </div>
              <div className="space-y-2">
                {topRows.map((row) => {
                  const diffPct = row.mean_a !== 0
                    ? Math.abs((row.mean_b - row.mean_a) / Math.abs(row.mean_a)) * 100
                    : 0;
                  const significant = diffPct > 10;
                  return (
                    <div
                      key={row.numeric_col}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${
                        significant
                          ? "bg-sky-900/10 border-sky-800/40"
                          : "bg-slate-800/40 border-slate-700/50"
                      }`}
                    >
                      <span className="font-mono text-slate-300 w-1/4 truncate">{row.numeric_col}</span>
                      <div className="flex gap-6">
                        <div className="text-center">
                          <p className="text-[10px] text-slate-500">{row.group_a} (n={row.count_a})</p>
                          <p className="font-bold text-slate-200">{formatNumber(row.mean_a)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-slate-500">{row.group_b} (n={row.count_b})</p>
                          <p className="font-bold text-slate-200">{formatNumber(row.mean_b)}</p>
                        </div>
                        {significant && (
                          <span className="self-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300">
                            {diffPct.toFixed(1)}% diff
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


export default function EdaTab({ data }: EdaTabProps) {
  const numericSummaries     = (data.numeric_summaries     ?? []) as NumericSummary[];
  const categoricalSummaries = (data.categorical_summaries ?? []) as CategoricalSummary[];
  const correlations         = (data.correlations          ?? {}) as Record<string, unknown>;
  const distList = (data.distribution_data ?? []) as { column: string; bin_edges: number[]; counts: number[] }[];
  const distributionData: Record<string, { bin_edges: number[]; counts: number[] }> =
    Object.fromEntries(distList.map((d) => [d.column, { bin_edges: d.bin_edges, counts: d.counts }]));
  const hypothesisTests = (data.hypothesis_tests   ?? {}) as Record<string, unknown>;
  const strongPairs     = ((correlations.strong_pairs ?? []) as StrongPair[]);
  const outlierAnalysis  = (data.outlier_analysis  ?? []) as OutlierInfo[];
  const groupComparisons = (data.group_comparisons ?? []) as GroupComparison[];

  return (
    <div className="space-y-10 animate-slide-up">

      {/* Numeric summaries */}
      {numericSummaries.length > 0 && (
        <section>
          <h2 className="section-title text-base mb-4">
            Numeric Columns ({numericSummaries.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {numericSummaries.map((s) => (
              <NumericCard
                key={s.column}
                summary={s}
                dist={distributionData[s.column]}
              />
            ))}
          </div>
        </section>
      )}

      {/* Categorical summaries */}
      {categoricalSummaries.length > 0 && (
        <section>
          <h2 className="section-title text-base mb-4">
            Categorical Columns ({categoricalSummaries.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {categoricalSummaries.map((s) => (
              <div key={s.column} className="card space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-100 font-mono text-sm">
                    {s.column}
                  </p>
                  <span className="badge badge-gray">
                    {formatNumber(s.unique_count, 0)} unique
                  </span>
                </div>
                <CategoryChart
                  column={s.column}
                  topValues={s.top_values ?? s.top_categories ?? []}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Correlation */}
      {strongPairs.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="section-title text-base">Strong Correlations (|r| ≥ 0.7)</h2>
            <Tooltip text="Pearson r measures linear relationship strength. |r| ≥ 0.7 is considered strong. r > 0 = positive, r < 0 = inverse relationship." />
          </div>
          <CorrelationHeatmap strongPairs={strongPairs} />
        </section>
      )}

      {/* Hypothesis tests */}
      {Object.keys(hypothesisTests).length > 0 && (
        <HypothesisSection hyp={hypothesisTests} />
      )}

      {/* Time trends */}
      {Array.isArray(data.time_trend_data) && (data.time_trend_data as unknown[]).length > 0 && (
        <section>
          <h2 className="section-title text-base mb-4">Time Trends</h2>
          <div className="card text-sm text-slate-400">
            Time series data detected.
            <pre className="mt-3 text-xs text-slate-500 overflow-auto max-h-40">
              {JSON.stringify(data.time_trend_data, null, 2)}
            </pre>
          </div>
        </section>
      )}

      {/* Outlier analysis */}
      <OutlierSection outliers={outlierAnalysis} />

      {/* Group comparisons */}
      <GroupComparisonSection comparisons={groupComparisons} />

      {numericSummaries.length === 0 && categoricalSummaries.length === 0 && (
        <div className="card text-slate-400 text-sm">
          No EDA data available for this dataset.
        </div>
      )}
    </div>
  );
}
