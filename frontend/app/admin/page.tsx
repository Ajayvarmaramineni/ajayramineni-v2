"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart2, Users, TrendingUp, Crown, Activity,
  Share2, RefreshCw, Loader2, AlertCircle, CheckCircle2,
  ChevronUp, ChevronDown, ArrowLeft, Database, GitBranch,
  Maximize2, Download,
} from "lucide-react";
import { getAdminStats, getAdminUsers, setUserPro } from "@/lib/api";

interface Stats {
  total_users:    number;
  pro_users:      number;
  free_users:     number;
  new_this_week:  number;
  total_analyses: number;
  avg_analyses:   number;
  total_shares:   number;
  avg_rows:       number;
}

interface User {
  id:              string;
  name:            string;
  email:           string;
  institution:     string;
  is_pro:          boolean;
  analyses_count:  number;
  created_at:      string;
  last_active:     string;
}

function fmt(n: number | undefined, decimals = 0) {
  if (n == null) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

function timeAgo(iso: string) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return "just now";
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
}

export default function AdminPage() {
  const router  = useRouter();
  const [secret,       setSecret]       = useState("");
  const [authed,       setAuthed]       = useState(false);
  const [authError,    setAuthError]    = useState("");
  const [stats,        setStats]        = useState<Stats | null>(null);
  const [users,        setUsers]        = useState<User[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [proToggles,   setProToggles]   = useState<Record<string, boolean>>({});
  const [sortCol,      setSortCol]      = useState<keyof User>("created_at");
  const [sortAsc,      setSortAsc]      = useState(false);
  const [search,       setSearch]       = useState("");

  // Guard: only admin can see this
  useEffect(() => {
    try {
      const raw = localStorage.getItem("datastatz_user");
      if (raw) {
        const u = JSON.parse(raw) as { name?: string };
        if (u.name === "Admin") return; // already verified
      }
    } catch {}
    // not admin — redirect
    router.replace("/dashboard");
  }, [router]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAuthError("");
    try {
      await getAdminStats(secret);
      setAuthed(true);
      loadData(secret);
    } catch {
      setAuthError("Wrong secret.");
    } finally {
      setLoading(false);
    }
  }

  async function loadData(s = secret) {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        getAdminStats(s) as Promise<Stats>,
        getAdminUsers(s) as Promise<User[]>,
      ]);
      setStats(statsRes);
      setUsers(usersRes);
    } catch {/* ignore */}
    finally { setLoading(false); }
  }

  async function togglePro(email: string, current: boolean) {
    setProToggles((p) => ({ ...p, [email]: true }));
    try {
      await setUserPro(secret, email, !current);
      if (!current) {
        const user = users.find((u) => u.email === email);
        fetch("/api/mailer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "send_pro_upgrade_email",
            email,
            userName: user?.name || "",
          }),
        }).catch((err) => console.error("Pro upgrade email error:", err));
      }
      setUsers((prev) => prev.map((u) => u.email === email ? { ...u, is_pro: !current } : u));
    } catch {}
    finally { setProToggles((p) => { const n = { ...p }; delete n[email]; return n; }); }
  }

  function sortedUsers() {
    const filtered = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.institution?.toLowerCase().includes(search.toLowerCase()),
    );
    return [...filtered].sort((a, b) => {
      const av = a[sortCol] ?? "";
      const bv = b[sortCol] ?? "";
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });
  }

  function SortIcon({ col }: { col: keyof User }) {
    if (sortCol !== col) return null;
    return sortAsc ? <ChevronUp size={11} /> : <ChevronDown size={11} />;
  }

  function handleSort(col: keyof User) {
    if (sortCol === col) setSortAsc((v) => !v);
    else { setSortCol(col); setSortAsc(false); }
  }

  // ── Auth gate ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-[#1e293b] border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Crown size={16} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">Admin Dashboard</p>
              <p className="text-xs text-slate-500">DataStatz internal</p>
            </div>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              placeholder="Admin secret"
              value={secret}
              onChange={(e) => { setSecret(e.target.value); setAuthError(""); }}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5
                         text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              autoFocus
            />
            {authError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle size={12} /> {authError}
              </p>
            )}
            <button
              type="submit"
              disabled={!secret || loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                         bg-amber-500 hover:bg-amber-400 disabled:opacity-50
                         text-white font-bold text-sm transition-all"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
              Enter Admin
            </button>
          </form>
          <Link href="/dashboard" className="block text-center text-xs text-slate-600 hover:text-slate-400 mt-4 transition-colors">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100">

      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Crown size={13} className="text-amber-400" />
              </div>
              <span className="text-sm font-bold text-slate-200">Admin Dashboard</span>
            </div>
          </div>
          <button
            onClick={() => loadData()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700
                       text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Users",    value: fmt(stats.total_users),    icon: Users,      color: "#38bdf8", sub: `+${fmt(stats.new_this_week)} this week` },
              { label: "Pro Users",      value: fmt(stats.pro_users),      icon: Crown,      color: "#f59e0b", sub: `${fmt(stats.free_users)} free` },
              { label: "Analyses Run",   value: fmt(stats.total_analyses), icon: TrendingUp, color: "#22c55e", sub: `${stats.avg_analyses} avg/user` },
              { label: "Shared Reports", value: fmt(stats.total_shares),   icon: Share2,     color: "#a78bfa", sub: "all time" },
            ].map(({ label, value, icon: Icon, color, sub }) => (
              <div key={label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</p>
                  <Icon size={14} style={{ color }} />
                </div>
                <p className="text-3xl font-extrabold" style={{ color }}>{value}</p>
                <p className="text-xs text-slate-600 mt-1">{sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Secondary stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Avg Dataset Size", value: `${fmt(stats.avg_rows)} rows`, icon: Database, color: "#34d399" },
              { label: "Pro Conversion",   value: stats.total_users ? `${Math.round((stats.pro_users / stats.total_users) * 100)}%` : "—", icon: Activity, color: "#f43f5e" },
              { label: "New This Week",    value: fmt(stats.new_this_week), icon: TrendingUp, color: "#38bdf8" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-slate-800/30 border border-slate-700/40 rounded-xl px-4 py-3 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                  <p className="text-lg font-bold text-slate-100">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users table */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-sky-400" />
              <h2 className="text-sm font-bold text-slate-200">All Users</h2>
              <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full">{users.length}</span>
            </div>
            <input
              type="text"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5
                         text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-48"
            />
          </div>

          {loading && !users.length ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="text-sky-400 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    {([
                      ["name",            "Name"],
                      ["email",           "Email"],
                      ["institution",     "Institution"],
                      ["analyses_count",  "Analyses"],
                      ["created_at",      "Joined"],
                      ["last_active",     "Last Active"],
                      ["is_pro",          "Plan"],
                    ] as [keyof User, string][]).map(([col, label]) => (
                      <th
                        key={col}
                        onClick={() => handleSort(col)}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider
                                   cursor-pointer hover:text-slate-300 transition-colors select-none"
                      >
                        <span className="flex items-center gap-1">
                          {label} <SortIcon col={col} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers().map((user) => (
                    <tr key={user.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-200 whitespace-nowrap">{user.name || "—"}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">{user.email}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{user.institution || "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sky-300 font-bold">{user.analyses_count ?? 0}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{timeAgo(user.created_at)}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{timeAgo(user.last_active)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => togglePro(user.email, user.is_pro)}
                          disabled={!!proToggles[user.email]}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            user.is_pro
                              ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                              : "bg-slate-700/50 border border-slate-600 text-slate-400 hover:border-sky-500/40 hover:text-sky-400"
                          }`}
                        >
                          {proToggles[user.email]
                            ? <Loader2 size={10} className="animate-spin" />
                            : user.is_pro
                              ? <><Crown size={10} /> Pro</>
                              : <><CheckCircle2 size={10} /> Free</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sortedUsers().length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-slate-500 text-sm">
                        {search ? "No users match your search." : "No users yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Architecture Diagram ── */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <GitBranch size={16} className="text-sky-400" />
              <h2 className="text-sm font-bold text-slate-200 tracking-wide uppercase">System Architecture</h2>
            </div>
            <a
              href="/architecture.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 border border-slate-700 hover:border-sky-500/50 rounded-lg px-3 py-1.5 transition-all"
            >
              <Maximize2 size={12} /> Open full screen
            </a>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#070d1a]" style={{ height: 520 }}>
            <iframe
              src="/architecture.html"
              className="w-full h-full"
              style={{ border: "none", display: "block" }}
              title="DataStatz System Architecture"
            />
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Scroll to zoom · Drag to pan · Use &quot;Export PNG&quot; inside the diagram to save
          </p>
        </div>

      </main>
    </div>
  );
}
