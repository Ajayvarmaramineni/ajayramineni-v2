"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart2, Upload, Clock, BookOpen, FileText, LogOut,
  GraduationCap, ShoppingCart, Heart, TrendingUp, ChevronRight,
  Sparkles, Database, FlaskConical, BarChart, Trash2, Loader2,
  Share2, Wand2, Lock, Crown,
} from "lucide-react";
import UpgradeModal from "@/components/ui/UpgradeModal";
import { uploadFile } from "@/lib/api";

interface UserSession {
  name:        string;
  email:       string;
  institution: string;
  joinedAt?:   string;
}

interface HistoryItem {
  id:        string;
  fileName:  string;
  analyzedAt: string;
}

const GLOSSARY = [
  { term: "p-value",         def: "Probability that the observed result occurred by chance. Below 0.05 is typically significant." },
  { term: "Correlation",     def: "Measures how strongly two variables move together. Ranges from -1 (inverse) to +1 (direct)." },
  { term: "Standard Dev.",   def: "How spread out values are around the mean. Higher = more variation in the data." },
  { term: "Null Hypothesis", def: "The default assumption that there is no effect or relationship between variables." },
  { term: "Outlier",         def: "A data point that differs significantly from others. Can skew results if not handled." },
  { term: "Skewness",        def: "Measures asymmetry of a distribution. Positive = tail on right, Negative = tail on left." },
  { term: "R-squared",       def: "How much variance in the outcome is explained by the model. Closer to 1 is better." },
  { term: "Mean vs Median",  def: "Mean is the average; median is the middle value. Median is more robust to outliers." },
];

const SAMPLES = [
  { id: "students", name: "Student Grades",  desc: "40 students · GPA, scores, major",        icon: GraduationCap, color: "sky",    file: "/samples/students.csv" },
  { id: "sales",    name: "Retail Sales",    desc: "40 orders · revenue, products, regions",   icon: ShoppingCart,  color: "violet", file: "/samples/sales.csv"    },
  { id: "health",   name: "Health Metrics",  desc: "40 patients · BMI, BP, cholesterol",       icon: Heart,         color: "rose",   file: "/samples/health.csv"   },
];

const COLOR_MAP: Record<string, string> = {
  sky:    "text-sky-400 bg-sky-500/10 border-sky-500/20",
  violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  rose:   "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return "just now";
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function formatJoinDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function DashboardPage() {
  const router = useRouter();
  const [user,    setUser]    = useState<UserSession | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [glossaryOpen,   setGlossaryOpen]   = useState(false);
  const [loadingSample, setLoadingSample]   = useState<string | null>(null);
  const [sampleError,   setSampleError]     = useState<string | null>(null);
  const [isPro,         setIsPro]           = useState(false);
  const [isAdmin,       setIsAdmin]         = useState(false);
  const [upgradeOpen,   setUpgradeOpen]     = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<string | undefined>();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("datastatz_user");
      if (!raw) { router.replace("/login"); return; }
      const u = JSON.parse(raw) as UserSession;
      if (!u.joinedAt) {
        u.joinedAt = new Date().toISOString();
        localStorage.setItem("datastatz_user", JSON.stringify(u));
      }
      setUser(u);
    } catch {
      router.replace("/login");
    }

    try {
      const raw = localStorage.getItem("datastatz_history");
      if (raw) setHistory(JSON.parse(raw) as HistoryItem[]);
    } catch { /* ignore */ }

    try {
      const raw = localStorage.getItem("datastatz_user");
      if (raw) {
        const u = JSON.parse(raw) as { isPro?: boolean; name?: string };
        setIsPro(u.isPro === true);
        setIsAdmin(u.name === "Admin");
      }
    } catch { /* ignore */ }
  }, [router]);

  function openUpgrade(feature?: string) {
    setUpgradeFeature(feature);
    setUpgradeOpen(true);
  }

  function signOut() {
    localStorage.removeItem("datastatz_user");
    router.replace("/");
  }

  function clearHistory() {
    localStorage.removeItem("datastatz_history");
    setHistory([]);
  }

  async function analyseSample(sample: typeof SAMPLES[number]) {
    if (loadingSample) return;
    setSampleError(null);
    setLoadingSample(sample.id);
    try {
      // Fetch the CSV from /public/samples/
      const res  = await fetch(sample.file);
      if (!res.ok) throw new Error("Could not fetch sample file.");
      const blob = await res.blob();
      const file = new File([blob], `${sample.id}.csv`, { type: "text/csv" });

      // Upload to backend — this returns file_id + preview_rows + columns
      const uploadResponse = await uploadFile(file);
      const { file_id, columns, preview_rows } = uploadResponse;

      // Cache preview so the Data tab works immediately
      try {
        sessionStorage.setItem(
          `datastatz_preview_${file_id}`,
          JSON.stringify({ columns, rows: preview_rows }),
        );
      } catch { /* non-blocking */ }

      // Navigate directly to results — no upload page involved
      router.push(`/results/${file_id}`);
    } catch (err: unknown) {
      setSampleError(err instanceof Error ? err.message : "Failed to load sample.");
      setLoadingSample(null);
    }
  }

  const firstName = user?.name?.split(" ")[0] || "there";
  const totalRuns = history.length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        feature={upgradeFeature}
      />

      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur border-b border-slate-800 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center">
              <BarChart2 size={16} className="text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-base">
              <span className="text-sky-400">Data</span><span className="text-slate-100">Statz</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">{user.email}</span>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 rounded-lg px-2.5 py-1 transition-all"
              >
                <Crown size={11} /> Admin
              </Link>
            )}
            {isPro ? (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-lg px-2.5 py-1">
                <Crown size={11} /> Pro
              </span>
            ) : (
              <button
                onClick={() => openUpgrade()}
                className="flex items-center gap-1 text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/30 hover:border-sky-400/60 hover:bg-sky-500/20 rounded-lg px-2.5 py-1 transition-all"
              >
                <Sparkles size={11} /> Upgrade
              </button>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200
                         border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition-all"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* ── Welcome Banner ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/20 via-violet-500/10 to-transparent border border-sky-500/20 px-8 py-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.08),transparent_60%)]" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-sky-400 font-semibold uppercase tracking-widest mb-1">Dashboard</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-2">
                Welcome back, {firstName}!
              </h1>
              <p className="text-slate-400 text-sm max-w-md">
                Upload a dataset and get a full statistical analysis - EDA, cleaning diagnostics, scope assessment, and plain-language insights.
              </p>
            </div>
            <Link
              href="/upload"
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold
                         px-6 py-3 rounded-xl transition-colors text-sm flex-shrink-0 self-start sm:self-auto"
            >
              <Upload size={16} /> New Analysis
            </Link>
          </div>
        </div>

        {/* ── Stats Strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Analyses Run",  value: totalRuns.toString(),                             icon: TrendingUp,  color: "text-sky-400"    },
            { label: "Member Since",  value: user.joinedAt ? formatJoinDate(user.joinedAt) : "Today", icon: Sparkles,   color: "text-violet-400" },
            { label: "Institution",   value: user.institution || "Not set",                    icon: GraduationCap, color: "text-green-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-5 py-4">
              <div className={`${color} mb-2`}><Icon size={18} /></div>
              <p className="text-lg font-bold text-slate-100">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Recent Analyses ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-sky-400" />
              <h2 className="text-base font-bold text-slate-200">Recent Analyses</h2>
            </div>
            {history.length > 0 && (
              <button onClick={clearHistory}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 size={12} /> Clear history
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="border border-dashed border-slate-700 rounded-xl px-6 py-10 text-center">
              <Database size={28} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No analyses yet.</p>
              <p className="text-slate-600 text-xs mt-1">Upload a file to get started.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  href={`/results/${item.id}`}
                  className="group bg-slate-800/50 border border-slate-700/50 hover:border-sky-500/40
                             rounded-xl px-5 py-4 transition-all hover:bg-slate-800"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                      <BarChart size={15} className="text-sky-400" />
                    </div>
                    <ChevronRight size={15} className="text-slate-600 group-hover:text-sky-400 transition-colors mt-0.5 flex-shrink-0" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200 truncate">{item.fileName}</p>
                  <p className="text-xs text-slate-500 mt-1">{timeAgo(item.analyzedAt)}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Tools Grid ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical size={16} className="text-violet-400" />
            <h2 className="text-base font-bold text-slate-200">Quick Tools</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Upload */}
            <Link href="/upload"
              className="group bg-slate-800/50 border border-slate-700/50 hover:border-sky-500/40
                         rounded-xl px-5 py-5 transition-all hover:bg-slate-800">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-3">
                <Upload size={18} className="text-sky-400" />
              </div>
              <p className="font-semibold text-slate-200 text-sm mb-1">Upload & Analyze</p>
              <p className="text-xs text-slate-500">Upload a CSV or Excel file for full statistical analysis.</p>
              <div className="flex items-center gap-1 text-xs text-sky-400 mt-3 group-hover:gap-2 transition-all">
                Start <ChevronRight size={12} />
              </div>
            </Link>

            {/* Statistical Glossary */}
            <button onClick={() => setGlossaryOpen((v) => !v)}
              className="group bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/40
                         rounded-xl px-5 py-5 transition-all hover:bg-slate-800 text-left">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-3">
                <BookOpen size={18} className="text-violet-400" />
              </div>
              <p className="font-semibold text-slate-200 text-sm mb-1">Statistical Glossary</p>
              <p className="text-xs text-slate-500">Quick reference for p-values, correlation, std dev, and more.</p>
              <div className="flex items-center gap-1 text-xs text-violet-400 mt-3 group-hover:gap-2 transition-all">
                {glossaryOpen ? "Close" : "Open"} <ChevronRight size={12} />
              </div>
            </button>

            {/* Export PDF */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-5 py-5">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
                <FileText size={18} className="text-green-400" />
              </div>
              <p className="font-semibold text-slate-200 text-sm mb-1">Export as PDF</p>
              <p className="text-xs text-slate-500">On any results page, click the Export PDF button in the top bar to download.</p>
              <p className="text-xs text-green-400 mt-3">Available on Results page</p>
            </div>

          </div>
        </section>

        {/* ── Pro Features ── */}
        {!isPro && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-amber-400" />
              <h2 className="text-base font-bold text-slate-200">Pro Features</h2>
              <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2 py-0.5">Coming soon</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Share2,      color: "text-sky-400",    bg: "bg-sky-500/10 border-sky-500/20",       title: "Share Reports",        desc: "Share analysis via public link." },
                { icon: Wand2,       color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", title: "Interactive Cleaning", desc: "Fix data issues and re-run analysis." },
                { icon: FlaskConical, color: "text-rose-400",  bg: "bg-rose-500/10 border-rose-500/20",     title: "AutoML Predictions",   desc: "Predict outcomes with no-code ML." },
                { icon: Database,    color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20",   title: "Google Sheets",        desc: "Analyze live Sheets data by URL." },
              ].map(({ icon: Icon, color, bg, title, desc }) => (
                <button
                  key={title}
                  onClick={() => openUpgrade(title)}
                  className={`group text-left border rounded-xl px-4 py-4 transition-all hover:scale-[1.02] ${bg}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                      <Icon size={15} className={color} />
                    </div>
                    <Lock size={12} className="text-slate-500 group-hover:text-slate-400 transition-colors" />
                  </div>
                  <p className={`text-sm font-semibold ${color}`}>{title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => openUpgrade()}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl
                         border border-dashed border-slate-600 hover:border-sky-500/50
                         text-slate-400 hover:text-sky-400 text-sm font-medium transition-all"
            >
              <Sparkles size={14} /> View all Pro features & get early access
            </button>
          </section>
        )}

        {/* ── Glossary Drawer ── */}
        {glossaryOpen && (
          <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={15} className="text-violet-400" />
                <span className="font-semibold text-sm text-slate-200">Statistical Glossary</span>
              </div>
              <button onClick={() => setGlossaryOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Close</button>
            </div>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-700/50">
              {GLOSSARY.map((g, i) => (
                <div key={g.term}
                  className={`px-6 py-4 ${i < GLOSSARY.length - 2 ? "border-b border-slate-700/50" : ""}`}>
                  <p className="text-xs font-bold text-violet-400 mb-1">{g.term}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{g.def}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Sample Datasets ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Database size={16} className="text-green-400" />
            <h2 className="text-base font-bold text-slate-200">Sample Datasets</h2>
            <span className="text-xs text-slate-500">- try the tool with real data</span>
          </div>

          {sampleError && (
            <div className="mb-4 flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800/40
                            rounded-xl px-4 py-2.5 text-xs">
              {sampleError}
              <button onClick={() => setSampleError(null)} className="ml-auto text-red-600 hover:text-red-400">✕</button>
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4">
            {SAMPLES.map(({ id, name, desc, icon: Icon, color }) => {
              const isLoading = loadingSample === id;
              const isDisabled = !!loadingSample;
              return (
                <button
                  key={id}
                  onClick={() => analyseSample(SAMPLES.find((s) => s.id === id)!)}
                  disabled={isDisabled}
                  className={`group text-left bg-slate-800/50 border border-slate-700/50 rounded-xl px-5 py-4
                              transition-all disabled:opacity-60
                              ${!isDisabled ? "hover:border-opacity-60 hover:bg-slate-800 cursor-pointer" : "cursor-not-allowed"}`}
                >
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${COLOR_MAP[color]}`}>
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
                  </div>
                  <p className="font-semibold text-slate-200 text-sm">{name}</p>
                  <p className="text-xs text-slate-500 mt-1 mb-3">{desc}</p>
                  <div className={`flex items-center gap-1 text-xs transition-all
                                  ${!isDisabled ? "group-hover:gap-2" : ""}
                                  ${COLOR_MAP[color].split(" ")[0]}`}>
                    {isLoading ? "Preparing analysis…" : <>Analyse this <ChevronRight size={12} /></>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
