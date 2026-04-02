"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Upload, BarChart2, Lightbulb, CheckCircle, Zap,
  BookOpen, Database, TrendingUp, FlaskConical,
  ChevronRight, Menu, X, ArrowRight, Sparkles,
} from "lucide-react";

function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconSize  = size === "lg" ? 28 : size === "md" ? 22 : 16;
  const textClass = size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm";

  return (
    <div className="flex items-center gap-2.5">
      <div className={`rounded-xl bg-gradient-to-br from-sky-400 to-violet-500
                       flex items-center justify-center shadow-lg shadow-sky-500/20
                       ${size === "lg" ? "w-12 h-12" : size === "md" ? "w-9 h-9" : "w-7 h-7"}`}>
        <BarChart2 size={iconSize} className="text-white" />
      </div>
      <span className={`font-extrabold tracking-tight ${textClass}`}>
        <span className="text-sky-400">Data</span>
        <span className="text-slate-100">Statz</span>
      </span>
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo size="md" />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a href="#features"     className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">How It Works</a>
          <a href="#pricing"      className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Pricing</a>
          <Link href="/about"     className="text-sm text-slate-400 hover:text-slate-200 transition-colors">About</Link>
          <Link href="/login"     className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Sign In</Link>
          <Link href="/login"
            className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 transition-colors
                       text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md shadow-sky-500/20">
            Try Free <ArrowRight size={14} />
          </Link>
        </div>

        <button className="md:hidden text-slate-400" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-800 bg-[#0a0f1e] px-6 py-4 space-y-3">
          <a href="#features"     onClick={() => setOpen(false)} className="block text-sm text-slate-300 py-1.5">Features</a>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="block text-sm text-slate-300 py-1.5">How It Works</a>
          <a href="#pricing"      onClick={() => setOpen(false)} className="block text-sm text-slate-300 py-1.5">Pricing</a>
          <Link href="/about"     onClick={() => setOpen(false)} className="block text-sm text-slate-300 py-1.5">About</Link>
          <Link href="/login"     onClick={() => setOpen(false)}
            className="block w-full text-center bg-sky-500 text-white text-sm font-semibold py-2.5 rounded-xl mt-2">
            Try Free
          </Link>
        </div>
      )}
    </nav>
  );
}

function DataBot() {
  return (
    <div className="flex flex-col items-center relative select-none">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none" style={{ inset: "-40px" }}>
        {[
          { dur:"4s",  delay:"0s",   op:0.6, w:6,  h:6,  bg:"#38bdf8", top:"10%", left:"15%",  br:"50%" },
          { dur:"5s",  delay:"0.5s", op:0.4, w:4,  h:4,  bg:"#a78bfa", top:"20%", right:"10%", br:"50%" },
          { dur:"3.5s",delay:"1s",   op:0.5, w:8,  h:8,  bg:"#38bdf8", top:"60%", left:"5%",   br:"2px" },
          { dur:"4.5s",delay:"1.5s", op:0.3, w:5,  h:5,  bg:"#4ade80", top:"75%", right:"8%",  br:"50%" },
          { dur:"5.2s",delay:"0.3s", op:0.35,w:6,  h:6,  bg:"#f59e0b", top:"30%", right:"20%", br:"50%" },
        ].map((p, i) => (
          <div key={i} className="absolute" style={{
            width: p.w, height: p.h, background: p.bg, borderRadius: p.br,
            top: p.top, left: p.left, right: (p as any).right,
            animation: `floatParticle ${p.dur} ease-in-out infinite ${p.delay}`,
            opacity: p.op,
          }} />
        ))}
      </div>

      {/* Floating data cards */}
      <div className="absolute z-20 rounded-xl px-3 py-2 backdrop-blur-sm"
        style={{ top:"-10px", left:"-40px", background:"rgba(15,23,42,0.9)", border:"1px solid rgba(56,189,248,0.25)", animation:"cardFloat 4s ease-in-out infinite 0s", boxShadow:"0 0 20px rgba(56,189,248,0.1)", whiteSpace:"nowrap" }}>
        <p style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.8px" }}>Correlation</p>
        <p style={{ fontSize:18, fontWeight:900, color:"#38bdf8", marginTop:2 }}>r = 0.87</p>
      </div>

      <div className="absolute z-20 rounded-xl px-3 py-2 backdrop-blur-sm"
        style={{ top:"70px", right:"-50px", background:"rgba(15,23,42,0.9)", border:"1px solid rgba(56,189,248,0.25)", animation:"cardFloat 5s ease-in-out infinite 1s", boxShadow:"0 0 20px rgba(56,189,248,0.1)" }}>
        <p style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.8px" }}>Distribution</p>
        <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:28, marginTop:6 }}>
          {[30,60,90,75,45,25].map((h, i) => (
            <div key={i} style={{ width:8, height:`${h}%`, background:"#38bdf8", opacity:0.8, borderRadius:"2px 2px 0 0" }} />
          ))}
        </div>
      </div>

      <div className="absolute z-20 rounded-xl px-3 py-2 backdrop-blur-sm"
        style={{ bottom:"170px", left:"-55px", background:"rgba(15,23,42,0.9)", border:"1px solid rgba(56,189,248,0.25)", animation:"cardFloat 4.5s ease-in-out infinite 0.7s", boxShadow:"0 0 20px rgba(56,189,248,0.1)", whiteSpace:"nowrap" }}>
        <p style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.8px" }}>p-value</p>
        <p style={{ fontSize:18, fontWeight:900, color:"#4ade80", marginTop:2 }}>0.024 ✓</p>
      </div>

      <div className="absolute z-20 rounded-xl px-3 py-2 backdrop-blur-sm"
        style={{ bottom:"100px", right:"-30px", background:"rgba(15,23,42,0.9)", border:"1px solid rgba(56,189,248,0.25)", animation:"cardFloat 3.8s ease-in-out infinite 1.5s", boxShadow:"0 0 20px rgba(56,189,248,0.1)", whiteSpace:"nowrap" }}>
        <p style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.8px" }}>Missing</p>
        <p style={{ fontSize:18, fontWeight:900, color:"#f59e0b", marginTop:2 }}>2.1%</p>
      </div>

      {/* DataBot SVG */}
      <div className="bot-float relative z-10">
        <svg width="260" viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Antenna */}
          <rect x="76" y="4" width="8" height="20" fill="#334155"/>
          <rect x="70" y="0" width="20" height="12" rx="6" fill="#334155"/>
          <rect x="74" y="2" width="12" height="8" rx="4" fill="#1e293b"/>
          <circle cx="80" cy="6" r="4" fill="#38bdf8" className="antenna-light" filter="url(#glow)"/>
          {/* Head */}
          <rect x="28" y="24" width="104" height="76" rx="10" fill="#1e293b"/>
          <rect x="28" y="24" width="104" height="76" rx="10" fill="none" stroke="#334155" strokeWidth="2"/>
          <rect x="34" y="30" width="92" height="64" rx="6" fill="#0f172a"/>
          {/* Left eye */}
          <g className="blink-eye" style={{ transformOrigin:"50px 56px" }}>
            <rect x="38" y="42" width="28" height="28" rx="4" fill="#0a0f1e"/>
            <rect x="44" y="46" width="18" height="20" rx="2" fill="#38bdf8" fillOpacity="0.15"/>
            <rect x="48" y="49" width="10" height="12" rx="2" fill="#38bdf8"/>
            <rect x="50" y="50" width="4" height="4" rx="1" fill="white" fillOpacity="0.8"/>
          </g>
          {/* Right eye */}
          <g className="blink-eye" style={{ transformOrigin:"110px 56px" }}>
            <rect x="94" y="42" width="28" height="28" rx="4" fill="#0a0f1e"/>
            <rect x="100" y="46" width="18" height="20" rx="2" fill="#38bdf8" fillOpacity="0.15"/>
            <rect x="104" y="49" width="10" height="12" rx="2" fill="#38bdf8"/>
            <rect x="106" y="50" width="4" height="4" rx="1" fill="white" fillOpacity="0.8"/>
          </g>
          {/* Mouth */}
          <rect x="62" y="76" width="36" height="4" rx="2" fill="#334155"/>
          <rect x="62" y="76" width="8" height="8" rx="2" fill="#334155"/>
          <rect x="90" y="76" width="8" height="8" rx="2" fill="#334155"/>
          {/* Ears */}
          <rect x="20" y="44" width="8" height="20" rx="3" fill="#334155"/>
          <rect x="132" y="44" width="8" height="20" rx="3" fill="#334155"/>
          <rect x="22" y="50" width="4" height="8" rx="2" fill="#38bdf8" fillOpacity="0.5"/>
          <rect x="134" y="50" width="4" height="8" rx="2" fill="#38bdf8" fillOpacity="0.5"/>
          {/* Neck */}
          <rect x="64" y="100" width="32" height="12" rx="4" fill="#334155"/>
          <rect x="68" y="102" width="24" height="8" rx="2" fill="#1e293b"/>
          {/* Body */}
          <rect x="20" y="112" width="120" height="80" rx="12" fill="#1e293b"/>
          <rect x="20" y="112" width="120" height="80" rx="12" fill="none" stroke="#334155" strokeWidth="2"/>
          {/* Chest screen */}
          <rect x="34" y="122" width="92" height="60" rx="6" fill="#070d1a"/>
          <rect x="34" y="122" width="92" height="60" rx="6" fill="none" stroke="#334155" strokeWidth="1"/>
          <rect x="35" y="123" width="90" height="58" rx="5" fill="#38bdf8" fillOpacity="0.03"/>
          {/* Screen bars */}
          <g className="bar-anim-1"><rect x="46" y="158" width="12" height="18" rx="2" fill="#38bdf8" fillOpacity="0.85"/></g>
          <g className="bar-anim-2"><rect x="62" y="144" width="12" height="32" rx="2" fill="#38bdf8" fillOpacity="0.95"/></g>
          <g className="bar-anim-3"><rect x="78" y="150" width="12" height="26" rx="2" fill="#a78bfa" fillOpacity="0.85"/></g>
          <g className="bar-anim-1"><rect x="94" y="138" width="12" height="38" rx="2" fill="#38bdf8" fillOpacity="0.9"/></g>
          <g className="bar-anim-2"><rect x="110" y="154" width="12" height="22" rx="2" fill="#4ade80" fillOpacity="0.8"/></g>
          <rect x="40" y="176" width="88" height="2" rx="1" fill="#334155"/>
          <rect x="40" y="128" width="30" height="4" rx="2" fill="#334155" fillOpacity="0.8"/>
          <rect x="74" y="128" width="15" height="4" rx="2" fill="#38bdf8" fillOpacity="0.4"/>
          <rect x="35" y="123" width="90" height="3" rx="1" fill="#38bdf8" fillOpacity="0.1" className="scan-line"/>
          {/* Body lights */}
          <rect x="28" y="118" width="8" height="8" rx="2" fill="#4ade80" fillOpacity="0.8"/>
          <rect x="28" y="130" width="8" height="8" rx="2" fill="#f59e0b" fillOpacity="0.6"/>
          <rect x="28" y="142" width="8" height="8" rx="2" fill="#38bdf8" fillOpacity="0.8"/>
          <rect x="124" y="118" width="8" height="8" rx="2" fill="#38bdf8" fillOpacity="0.8"/>
          <rect x="124" y="130" width="8" height="8" rx="2" fill="#a78bfa" fillOpacity="0.6"/>
          {/* Arms */}
          <rect x="0" y="116" width="20" height="60" rx="8" fill="#1e293b"/>
          <rect x="0" y="116" width="20" height="60" rx="8" fill="none" stroke="#334155" strokeWidth="1.5"/>
          <rect x="2" y="172" width="16" height="16" rx="6" fill="#334155"/>
          <rect x="140" y="116" width="20" height="60" rx="8" fill="#1e293b"/>
          <rect x="140" y="116" width="20" height="60" rx="8" fill="none" stroke="#334155" strokeWidth="1.5"/>
          <rect x="142" y="172" width="16" height="16" rx="6" fill="#334155"/>
          <rect x="144" y="175" width="3" height="8" rx="1" fill="#38bdf8" fillOpacity="0.7"/>
          <rect x="149" y="178" width="3" height="5" rx="1" fill="#a78bfa" fillOpacity="0.7"/>
          <rect x="154" y="174" width="3" height="9" rx="1" fill="#4ade80" fillOpacity="0.7"/>
          {/* Legs */}
          <rect x="44" y="192" width="28" height="16" rx="6" fill="#334155"/>
          <rect x="40" y="200" width="36" height="10" rx="5" fill="#1e293b"/>
          <rect x="88" y="192" width="28" height="16" rx="6" fill="#334155"/>
          <rect x="84" y="200" width="36" height="10" rx="5" fill="#1e293b"/>
        </svg>
        {/* Glow shadow under bot */}
        <div className="bot-glow absolute left-1/2 bottom-[-20px]"
          style={{ width:200, height:30, background:"radial-gradient(ellipse, rgba(56,189,248,0.4) 0%, transparent 70%)", transform:"translateX(-50%)" }} />
      </div>

      {/* Terminal card */}
      <div className="mt-6 w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{ background:"rgba(15,23,42,0.95)", border:"1px solid rgba(51,65,85,0.6)" }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/60 bg-slate-900/60">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs text-slate-500 font-mono">datastatz - analysis</span>
        </div>
        <div className="px-4 py-3 font-mono text-xs space-y-1">
          <div className="t-line-1"><span className="text-sky-400">▶ </span><span className="text-slate-100">uploading sales_data.csv</span></div>
          <div className="t-line-2"><span className="text-green-400">✓ </span><span className="text-slate-500">Parsed 1,240 rows × 18 cols</span></div>
          <div className="t-line-3"><span className="text-green-400">✓ </span><span className="text-slate-500">EDA complete - 4 strong correlations</span></div>
          <div className="t-line-4"><span className="text-green-400">✓ </span><span className="text-slate-500">Hypothesis tests - p &lt; 0.05 found</span></div>
          <div className="t-line-5"><span className="text-sky-400">▶ </span><span className="text-slate-100">Ready in 8.3s</span><span className="t-cursor inline-block w-2 h-3.5 bg-sky-400 ml-0.5 align-middle" /></div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center px-6 py-20 overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }} />
      {/* Glow orbs */}
      <div className="fixed pointer-events-none" style={{ top:"15%", left:"20%", width:600, height:600, background:"radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)" }} />
      <div className="fixed pointer-events-none" style={{ top:"20%", right:"15%", width:500, height:500, background:"radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

        {/* Left: text */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/30
                          text-sky-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-7">
            <span className="badge-dot w-1.5 h-1.5 rounded-full bg-sky-400" />
            Now in Beta · Free to try · No credit card needed
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight
                         text-slate-50 leading-[1.08] mb-5">
            Your data,<br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400
                             bg-clip-text text-transparent">
              understood.
            </span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
            DataStatz gives students and researchers instant EDA, cleaning diagnostics,
            hypothesis tests, and plain-language insights. Just upload and go.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
            <Link href="/login"
              className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400
                         transition-all text-white font-bold text-base px-8 py-3.5 rounded-xl
                         shadow-xl shadow-sky-500/25 hover:-translate-y-0.5">
              <Upload size={18} />
              Analyse My Data Free
            </Link>
            <a href="#how-it-works"
              className="flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800
                         border border-slate-700 text-slate-200 font-semibold text-base
                         px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5">
              See How It Works <ChevronRight size={16} />
            </a>
          </div>

          <div className="flex gap-7 pt-7 border-t border-slate-800/60 justify-center lg:justify-start">
            {[
              { value:"10s",  label:"Full analysis" },
              { value:"5",    label:"Analysis modules" },
              { value:"50MB", label:"Max file size" },
              { value:"Free", label:"To get started" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-sky-400">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: DataBot */}
        <div className="flex-shrink-0 w-full lg:w-[380px] relative px-14 lg:px-0">
          <DataBot />
        </div>

      </div>
    </section>
  );
}

const STATS = [
  { value: "10 sec", label: "Avg analysis time" },
  { value: "5",      label: "Analysis modules" },
  { value: "100%",   label: "No-code required" },
  { value: "Free",   label: "To get started" },
];

function StatsBar() {
  return (
    <section className="border-y border-slate-800/60 bg-slate-900/30 py-10 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl font-extrabold text-sky-400">{s.value}</p>
            <p className="text-sm text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: Database,
    title: "Smart Column Profiling",
    desc: "Semantic type detection - identifiers, dates, numeric, categorical, and free text columns detected automatically.",
    color: "from-sky-500/20 to-sky-500/5 border-sky-700/40",
    iconColor: "text-sky-400",
  },
  {
    icon: CheckCircle,
    title: "Cleaning Diagnostics",
    desc: "Missing values, duplicates, outliers, and high cardinality columns - each with fix recommendations.",
    color: "from-green-500/20 to-green-500/5 border-green-700/40",
    iconColor: "text-green-400",
  },
  {
    icon: BarChart2,
    title: "Full EDA Suite",
    desc: "Histograms, correlation heatmaps, skewness, kurtosis, category charts, and time-series trends.",
    color: "from-violet-500/20 to-violet-500/5 border-violet-700/40",
    iconColor: "text-violet-400",
  },
  {
    icon: FlaskConical,
    title: "Hypothesis Testing",
    desc: "Shapiro-Wilk normality, independent t-tests, one-way ANOVA, and chi-square - with plain-English results.",
    color: "from-amber-500/20 to-amber-500/5 border-amber-700/40",
    iconColor: "text-amber-400",
  },
  {
    icon: TrendingUp,
    title: "Scope Assessment",
    desc: "Know if your data suits regression, classification, clustering, or time-series - with confidence scores.",
    color: "from-sky-500/20 to-sky-500/5 border-sky-700/40",
    iconColor: "text-sky-400",
  },
  {
    icon: Zap,
    title: "Under 10 Seconds",
    desc: "The entire pipeline - parse, profile, analyse, insights - runs in parallel, so you're never waiting.",
    color: "from-rose-500/20 to-rose-500/5 border-rose-700/40",
    iconColor: "text-rose-400",
  },
];

function Features() {
  return (
    <section id="features" className="px-6 py-24 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <span className="inline-flex items-center gap-1.5 text-sky-400 text-xs font-semibold
                         bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full mb-4">
          <Sparkles size={11} /> Everything in one place
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
          Every tool students need
        </h2>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto">
          No more juggling Python notebooks, Excel, and StackOverflow.
          DataStatz covers the full analysis workflow automatically.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <div key={f.title}
            className={`bg-gradient-to-b ${f.color} border rounded-2xl p-5 flex gap-4`}>
            <div className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-xl bg-slate-900/60
                            flex items-center justify-center">
              <f.icon size={20} className={f.iconColor} />
            </div>
            <div>
              <p className="font-semibold text-slate-100 mb-1.5">{f.title}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  {
    num: "01",
    icon: Upload,
    title: "Upload Your File",
    desc: "Drop a CSV or Excel file - or pick one of our sample datasets to try instantly.",
    color: "sky",
  },
  {
    num: "02",
    icon: BarChart2,
    title: "Auto-Analysis Runs",
    desc: "DataStatz runs EDA, cleaning checks, correlations, hypothesis tests, and scope assessment in parallel.",
    color: "violet",
  },
  {
    num: "03",
    icon: Lightbulb,
    title: "Get Real Answers",
    desc: "Browse interactive results across 5 tabs. Export a full PDF report when you're done.",
    color: "amber",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 bg-slate-900/30 border-y border-slate-800/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 text-violet-400 text-xs font-semibold
                           bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-4">
            Simple by design
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
            From file to insights in 3 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-sky-500/40 via-violet-500/40 to-amber-500/40" />

          {STEPS.map((s) => {
            const iconBg = s.color === "sky"    ? "bg-sky-900/60 border-sky-700/60 text-sky-400"
                         : s.color === "violet" ? "bg-violet-900/60 border-violet-700/60 text-violet-400"
                         :                        "bg-amber-900/60 border-amber-700/60 text-amber-400";
            const numColor = s.color === "sky" ? "text-sky-400" : s.color === "violet" ? "text-violet-400" : "text-amber-400";

            return (
              <div key={s.num} className="flex flex-col items-center text-center gap-5">
                <div className={`relative w-14 h-14 rounded-2xl border flex items-center justify-center ${iconBg}`}>
                  <s.icon size={24} />
                  <span className={`absolute -top-2.5 -right-2.5 text-[10px] font-black ${numColor}
                                    bg-[#0a0f1e] border border-slate-800 px-1.5 py-0.5 rounded-md`}>
                    {s.num}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-slate-100 mb-2">{s.title}</p>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24 max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
          Simple, student-friendly pricing
        </h2>
        <p className="text-slate-400 mt-3">No hidden fees. Cancel anytime.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Free */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 flex flex-col gap-5">
          <div>
            <p className="text-base font-bold text-slate-100">Free</p>
            <p className="text-4xl font-extrabold text-slate-100 mt-2">
              $0<span className="text-base font-normal text-slate-400"> / mo</span>
            </p>
            <p className="text-sm text-slate-500 mt-1">For occasional use</p>
          </div>
          <ul className="space-y-2.5 text-sm text-slate-300 flex-1">
            {["5 uploads / month", "Files up to 10 MB", "All 5 analysis tabs", "Sample datasets"].map(i => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-400 flex-shrink-0" />{i}
              </li>
            ))}
          </ul>
          <Link href="/login"
            className="w-full text-center py-2.5 rounded-xl border border-slate-600
                       text-slate-200 text-sm font-semibold hover:border-slate-500 hover:bg-slate-800 transition-all">
            Get Started Free
          </Link>
        </div>

        {/* Pro - Coming Soon */}
        <div className="relative bg-gradient-to-b from-sky-950/80 to-slate-900/80
                        border border-sky-600/50 rounded-2xl p-6 flex flex-col gap-5
                        shadow-xl shadow-sky-500/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white
                          text-[10px] font-black px-4 py-1 rounded-full tracking-wider">
            MOST POPULAR
          </div>
          <div>
            <p className="text-base font-bold text-slate-100">Pro</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1.5 bg-sky-500/15 border border-sky-500/30
                               text-sky-400 text-xs font-bold px-3 py-1.5 rounded-lg tracking-wide">
                <Sparkles size={11} /> Coming Soon
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">Students &amp; researchers</p>
          </div>
          <ul className="space-y-2.5 text-sm text-slate-300 flex-1">
            {[
              "Unlimited uploads",
              "Files up to 50 MB",
              "All 5 analysis tabs",
              "Hypothesis testing",
              "Export full PDF report",
              "Priority processing",
            ].map(i => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-sky-400 flex-shrink-0" />{i}
              </li>
            ))}
          </ul>
          <button disabled
            className="w-full text-center py-2.5 rounded-xl bg-sky-500/40 cursor-not-allowed
                       text-white/60 text-sm font-bold">
            Coming Soon
          </button>
        </div>

        {/* Team - Coming Soon */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 flex flex-col gap-5">
          <div>
            <p className="text-base font-bold text-slate-100">Team</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1.5 bg-violet-500/15 border border-violet-500/30
                               text-violet-400 text-xs font-bold px-3 py-1.5 rounded-lg tracking-wide">
                <Sparkles size={11} /> Coming Soon
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">Research groups &amp; labs</p>
          </div>
          <ul className="space-y-2.5 text-sm text-slate-300 flex-1">
            {[
              "Everything in Pro",
              "Up to 5 team members",
              "Shared file history",
              "Priority support",
              "Early feature access",
            ].map(i => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-violet-400 flex-shrink-0" />{i}
              </li>
            ))}
          </ul>
          <button disabled
            className="w-full text-center py-2.5 rounded-xl border border-violet-700/30 cursor-not-allowed
                       text-violet-300/50 text-sm font-semibold">
            Coming Soon
          </button>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-sky-950/60 to-violet-950/60
                      border border-sky-700/30 rounded-3xl p-12 text-center
                      shadow-2xl shadow-sky-500/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-sky-500/5 rounded-3xl pointer-events-none" />
        <div className="relative">
          <Logo size="lg" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-6 mb-4">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
            Upload your dataset and get a full analysis report in under 10 seconds.
            Free to try, no credit card required.
          </p>
          <Link href="/login"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400
                       transition-all text-white font-bold text-base px-10 py-4 rounded-xl
                       shadow-xl shadow-sky-500/30 hover:-translate-y-0.5">
            <Upload size={18} />
            Analyse My Data for Free
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800/60 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo size="sm" />
        <div className="flex gap-6 text-xs text-slate-500">
          <a href="#features"  className="hover:text-slate-300 transition-colors">Features</a>
          <a href="#pricing"   className="hover:text-slate-300 transition-colors">Pricing</a>
          <Link href="/about"  className="hover:text-slate-300 transition-colors">About</Link>
          <Link href="/login"  className="hover:text-slate-300 transition-colors">Sign In</Link>
          <a href="https://github.com/Ajayvarmaramineni/statlab" target="_blank" rel="noreferrer"
             className="hover:text-slate-300 transition-colors">GitHub</a>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
        </div>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} DataStatz · datastatz.com
        </p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <Hero />
        <StatsBar />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
