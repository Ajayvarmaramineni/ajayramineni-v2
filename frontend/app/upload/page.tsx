"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, GraduationCap, ShoppingCart, Heart } from "lucide-react";
import DropZone from "@/components/upload/DropZone";
import { uploadFile } from "@/lib/api";


const SAMPLES = [
  {
    id:   "students",
    name: "Student Grades",
    desc: "40 students · GPA, scores, major",
    icon: GraduationCap,
    file: "/samples/students.csv",
    color: "sky",
  },
  {
    id:   "sales",
    name: "Retail Sales",
    desc: "40 orders · revenue, products, regions",
    icon: ShoppingCart,
    file: "/samples/sales.csv",
    color: "violet",
  },
  {
    id:   "health",
    name: "Health Metrics",
    desc: "40 patients · BMI, BP, cholesterol",
    icon: Heart,
    file: "/samples/health.csv",
    color: "rose",
  },
] as const;

type Stage =
  | "idle"
  | "uploading"
  | "analyzing"
  | "done"
  | "error";

const STAGE_LABELS: Record<Stage, string> = {
  idle:      "",
  uploading: "Uploading file…",
  analyzing: "Running analysis pipeline…",
  done:      "Analysis complete!",
  error:     "Something went wrong",
};

export default function UploadPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("datastatz_user");
    if (!user) {
      router.replace("/login");
    }
  }, [router]);
  const [file,        setFile]        = useState<File | null>(null);
  const [stage,       setStage]       = useState<Stage>("idle");
  const [errMsg,      setErrMsg]      = useState<string>("");
  const [loadingSample, setLoadingSample] = useState<string | null>(null);

  async function loadSample(sample: typeof SAMPLES[number]) {
    setLoadingSample(sample.id);
    try {
      const res  = await fetch(sample.file);
      const blob = await res.blob();
      const f    = new File([blob], `${sample.id}.csv`, { type: "text/csv" });
      setFile(f);
    } catch {
      setErrMsg("Failed to load sample dataset.");
    } finally {
      setLoadingSample(null);
    }
  }

  const handleStart = async () => {
    if (!file) return;
    setStage("uploading");
    setErrMsg("");

    try {
      // 1. Upload — response includes preview_rows and columns
      const uploadResponse = await uploadFile(file);
      const { file_id, columns, preview_rows } = uploadResponse;

      // Save data preview to sessionStorage so the Results Data tab can show it
      try {
        sessionStorage.setItem(
          `datastatz_preview_${file_id}`,
          JSON.stringify({ columns, rows: preview_rows }),
        );
      } catch { /* storage full / unavailable — non-blocking */ }

      // 2. Small UX pause before redirect (pipeline runs server-side on demand)
      setStage("analyzing");
      await new Promise((r) => setTimeout(r, 800));

      setStage("done");
      await new Promise((r) => setTimeout(r, 400));

      // 3. Navigate to results page
      router.push(`/results/${file_id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setErrMsg(msg);
      setStage("error");
    }
  };

  const isLoading = stage === "uploading" || stage === "analyzing";

  function signOut() {
    localStorage.removeItem("datastatz_user");
    router.replace("/");
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      {/* Top bar */}
      <div className="w-full max-w-xl mb-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <button
          onClick={signOut}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Card */}
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-100">Analyse Your Data</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Upload a CSV or Excel file to get instant EDA, cleaning diagnostics,
            scope assessment, and insights.
          </p>
        </div>

        <div className="card space-y-6">
          <DropZone onFileAccepted={setFile} disabled={isLoading} />

          {/* Progress indicator */}
          {stage !== "idle" && stage !== "error" && (
            <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3">
              {stage === "done" ? (
                <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
              ) : (
                <Loader2 size={18} className="text-sky-400 flex-shrink-0 animate-spin" />
              )}
              <p className="text-sm font-medium text-slate-300">
                {STAGE_LABELS[stage]}
              </p>
            </div>
          )}

          {/* Error */}
          {stage === "error" && (
            <div className="flex items-start gap-3 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-300">Upload failed</p>
                <p className="text-xs text-red-400 mt-0.5">{errMsg}</p>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleStart}
            disabled={!file || isLoading}
            className={`w-full btn-primary justify-center py-3 text-base
              ${(!file || isLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {STAGE_LABELS[stage]}
              </>
            ) : (
              "Start Analysis"
            )}
          </button>

          <p className="text-xs text-center text-slate-500">
            Files are processed in-memory and not permanently stored.
          </p>
        </div>

        {/* Sample datasets */}
        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Or try a sample dataset
          </p>
          <div className="grid grid-cols-3 gap-3">
            {SAMPLES.map((s) => {
              const Icon = s.icon;
              const isActive = file?.name === `${s.id}.csv`;
              return (
                <button
                  key={s.id}
                  onClick={() => loadSample(s)}
                  disabled={isLoading}
                  className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border text-left transition-all
                    ${isActive
                      ? "border-sky-500 bg-sky-500/10"
                      : "border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800"
                    }`}
                >
                  {loadingSample === s.id ? (
                    <Loader2 size={16} className="text-sky-400 animate-spin" />
                  ) : (
                    <Icon size={16} className={isActive ? "text-sky-400" : "text-slate-400"} />
                  )}
                  <p className={`text-xs font-semibold leading-tight ${isActive ? "text-sky-300" : "text-slate-300"}`}>
                    {s.name}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">{s.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 card text-sm text-slate-400 space-y-1.5">
          <p className="font-semibold text-slate-300 text-xs uppercase tracking-wider mb-2">
            Tips for best results
          </p>
          <p>• First row should be column headers.</p>
          <p>• Include at least 30 rows for meaningful EDA.</p>
          <p>• Date columns should be in ISO format (YYYY-MM-DD) when possible.</p>
          <p>• Numeric target columns improve scope assessment accuracy.</p>
        </div>
      </div>
    </main>
  );
}
