"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, BarChart2, Share2 } from "lucide-react";
import { getShare } from "@/lib/api";
import OverviewTab  from "@/components/dashboard/OverviewTab";
import CleaningTab  from "@/components/dashboard/CleaningTab";
import EdaTab       from "@/components/dashboard/EdaTab";
import ScopeTab     from "@/components/dashboard/ScopeTab";
import InsightsTab  from "@/components/dashboard/InsightsTab";

type Tab = "overview" | "cleaning" | "eda" | "scope" | "insights";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview",  label: "Overview"  },
  { id: "cleaning",  label: "Data Quality" },
  { id: "eda",       label: "EDA"       },
  { id: "scope",     label: "Scope"     },
  { id: "insights",  label: "Insights"  },
];

export default function SharedReportPage() {
  const { id } = useParams<{ id: string }>();
  const [report,  setReport]  = useState<{ file_name: string; data: Record<string, unknown>; created_at: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [tab,     setTab]     = useState<Tab>("overview");

  useEffect(() => {
    (async () => {
      try {
        const res = await getShare(id);
        setReport(res);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Report not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const data = report?.data as Record<string, Record<string, unknown>> | undefined;
  const createdAt = report?.created_at
    ? new Date(report.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100">

      {/* Top bar */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center">
                <BarChart2 size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-slate-200">DataStatz</span>
            </Link>
            {report && (
              <>
                <span className="text-slate-600">/</span>
                <span className="text-sm text-slate-400 truncate max-w-xs">{report.file_name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {createdAt && (
              <span className="text-xs text-slate-500">Shared {createdAt}</span>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
              <Share2 size={11} className="text-sky-400" />
              <span className="text-xs text-sky-400 font-medium">Public Report</span>
            </div>
          </div>
        </div>
      </header>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 size={32} className="text-sky-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading report…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
          <div className="flex items-center gap-3 bg-red-900/20 border border-red-800 rounded-xl px-5 py-4 max-w-md text-center">
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-300">Report not found</p>
              <p className="text-xs text-slate-400 mt-1">This link may have expired or is invalid.</p>
            </div>
          </div>
          <Link href="/" className="text-xs text-sky-400 hover:text-sky-300 transition-colors">
            ← Go to DataStatz
          </Link>
        </div>
      )}

      {/* Report content */}
      {report && data && !loading && (
        <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

          {/* Tab bar */}
          <div className="flex gap-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-1 overflow-x-auto">
            {TABS.map(({ id: tid, label }) => (
              <button
                key={tid}
                onClick={() => setTab(tid)}
                className={`flex-1 min-w-max px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  tab === tid
                    ? "bg-slate-700 text-slate-100 shadow"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>
            {tab === "overview"  && data.analyze  && <OverviewTab  data={data.analyze}  />}
            {tab === "cleaning"  && data.cleaning  && <CleaningTab  data={data.cleaning} />}
            {tab === "eda"       && data.eda        && <EdaTab       data={data.eda}      />}
            {tab === "scope"     && data.scope      && <ScopeTab     data={data.scope}    fileId={id} />}
            {tab === "insights"  && data.insights   && <InsightsTab  data={data.insights} />}
          </div>

          {/* Footer CTA */}
          <div className="text-center py-8 border-t border-slate-800">
            <p className="text-sm text-slate-400 mb-3">Want to analyse your own data?</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                         bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-400 hover:to-violet-400
                         text-white text-sm font-bold transition-all shadow-lg shadow-sky-500/20"
            >
              <BarChart2 size={15} />
              Try DataStatz free
            </Link>
          </div>

        </main>
      )}
    </div>
  );
}
