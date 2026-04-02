"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/api";
import {
  Eye, EyeOff, Loader2, CheckCircle, AlertCircle,
  BarChart2, ArrowLeft, KeyRound,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Mode = "login" | "signup" | "forgot";
type Step = "form" | "otp" | "reset" | "done";

interface SignupForm {
  name:        string;
  email:       string;
  institution: string;
  password:    string;
}

interface StoredUser {
  name:        string;
  email:       string;
  institution: string;
  pw:          string;  // btoa(password)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const INPUT_CLS =
  "w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 " +
  "text-sm text-slate-100 placeholder-slate-500 " +
  "focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors";

function checkStrength(pw: string) {
  return {
    upper:  /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
    length: pw.length >= 8,
  };
}

function strengthScore(pw: string): number {
  const c = checkStrength(pw);
  return [c.upper, c.number, c.symbol, c.length].filter(Boolean).length;
}

function strengthLabel(score: number): { label: string; color: string } {
  if (score === 0) return { label: "",         color: "bg-slate-700" };
  if (score === 1) return { label: "Weak",     color: "bg-red-500"   };
  if (score === 2) return { label: "Fair",     color: "bg-amber-500" };
  if (score === 3) return { label: "Good",     color: "bg-yellow-400"};
  return               { label: "Strong",   color: "bg-emerald-500" };
}

async function postMailer(body: Record<string, string>) {
  const res  = await fetch("/api/mailer", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  return res.json() as Promise<{ success: boolean; token?: string; error?: string }>;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800/40 rounded-xl px-3 py-2.5">
      <AlertCircle size={14} className="flex-shrink-0" />
      <p className="text-xs">{msg}</p>
    </div>
  );
}

function SuccessScreen({ headline, sub }: { headline: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <CheckCircle size={44} className="text-emerald-400" />
      <p className="text-slate-100 font-bold text-lg">{headline}</p>
      <p className="text-slate-400 text-sm text-center">{sub}</p>
    </div>
  );
}

function OtpInput({
  value, onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={6}
      placeholder="000000"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      className={INPUT_CLS + " text-center text-3xl tracking-[0.5em] font-mono"}
      autoFocus
    />
  );
}

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const score  = strengthScore(password);
  const info   = strengthLabel(score);
  const checks = checkStrength(password);

  return (
    <div className="space-y-2">
      {/* Bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            i < score ? info.color : "bg-slate-700"
          }`} />
        ))}
      </div>

      {/* Label + criteria */}
      {score > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            {(
              [
                { key: "upper",  label: "A–Z" },
                { key: "number", label: "0–9" },
                { key: "symbol", label: "#!?" },
                { key: "length", label: "8+ chars" },
              ] as { key: keyof ReturnType<typeof checkStrength>; label: string }[]
            ).map(({ key, label }) => (
              <span key={key}
                className={`text-[10px] font-medium transition-colors ${
                  checks[key] ? "text-emerald-400" : "text-slate-600"
                }`}>
                {checks[key] ? "✓ " : "· "}{label}
              </span>
            ))}
          </div>
          {info.label && (
            <span className={`text-[10px] font-bold ${info.color.replace("bg-", "text-")}`}>
              {info.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function PasswordField({
  value, onChange, placeholder = "••••••••", label = "Password",
}: {
  value:       string;
  onChange:    (v: string) => void;
  placeholder?: string;
  label?:      string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={INPUT_CLS + " pr-11"}
          autoComplete="current-password"
        />
        <button type="button" onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState<string | null>(null);

  // OTP token returned by server (stateless)
  const otpToken = useRef<string>("");

  // Resend countdown
  const [resendCd, setResendCd] = useState(0);
  const resendTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Signup state
  const [signup, setSignup] = useState<SignupForm>({
    name: "", email: "", institution: "", password: "",
  });
  const [otpCode, setOtpCode] = useState("");

  // ── Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass,  setLoginPass]  = useState("");

  // ── Forgot state
  const [forgotEmail,    setForgotEmail]    = useState("");
  const [forgotOtp,      setForgotOtp]      = useState("");
  const [newPassword,    setNewPassword]    = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── Helpers ───────────────────────────────────────────────────────────────

  function resetAll(m: Mode) {
    setMode(m);
    setStep("form");
    setError(null);
    setOtpCode("");
    setForgotOtp("");
    otpToken.current = "";
    if (resendTimer.current) clearInterval(resendTimer.current);
    setResendCd(0);
  }

  function startResend() {
    setResendCd(30);
    if (resendTimer.current) clearInterval(resendTimer.current);
    resendTimer.current = setInterval(() => {
      setResendCd((n) => {
        if (n <= 1) { clearInterval(resendTimer.current!); return 0; }
        return n - 1;
      });
    }, 1000);
  }

  // ── SIGNUP ────────────────────────────────────────────────────────────────

  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { name, email, institution, password } = signup;
    if (!name.trim() || !email.trim() || !institution.trim() || !password) {
      setError("Please fill in all fields."); return;
    }
    const score = strengthScore(password);
    if (score < 4) {
      setError("Password must be 8+ chars and include uppercase, number, and symbol."); return;
    }

    setLoading(true);
    try {
      const data = await postMailer({
        action:  "sendOtp",
        email:   email.trim().toLowerCase(),
        purpose: "verify",
      });
      if (!data.success || !data.token) throw new Error(data.error || "Could not send code.");
      otpToken.current = data.token;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not send code.");
      setLoading(false);
      return;
    }

    setStep("otp");
    startResend();
    setLoading(false);
  }

  async function handleSignupVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otpCode.length !== 6) { setError("Enter the 6-digit code."); return; }
    setLoading(true);
    setError(null);

    try {
      const data = await postMailer({
        action: "verifyOtp",
        email:  signup.email.trim().toLowerCase(),
        otp:    otpCode,
        token:  otpToken.current,
      });
      if (!data.success) throw new Error(data.error || "Invalid code.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid code.");
      setLoading(false);
      return;
    }

    // Save user to localStorage
    const user: StoredUser = {
      name:        signup.name.trim(),
      email:       signup.email.trim().toLowerCase(),
      institution: signup.institution.trim(),
      pw:          btoa(signup.password),
    };
    localStorage.setItem("datastatz_user", JSON.stringify(user));

    // Save to Supabase (non-blocking)
    registerUser(user.name, user.email, user.institution).catch(() => {});

    // Fire welcome email (non-blocking)
    postMailer({
      action:      "register",
      name:        user.name,
      email:       user.email,
      institution: user.institution,
    }).catch(() => {});

    setStep("done");
    // Redirect to login after 2s
    setTimeout(() => {
      resetAll("login");
    }, 2000);
    setLoading(false);
  }

  async function handleSignupResend() {
    if (resendCd > 0) return;
    setError(null);
    setOtpCode("");
    setLoading(true);
    try {
      const data = await postMailer({
        action:  "sendOtp",
        email:   signup.email.trim().toLowerCase(),
        purpose: "verify",
      });
      if (!data.success || !data.token) throw new Error(data.error || "Could not resend.");
      otpToken.current = data.token;
      startResend();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not resend.");
    }
    setLoading(false);
  }

  // ── LOGIN ─────────────────────────────────────────────────────────────────

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const email = loginEmail.trim().toLowerCase();
    const pass  = loginPass.trim();
    if (!email || !pass) { setError("Please enter your email and password."); return; }

    setLoading(true);

    // 1. Admin check (server-side, secret never in client bundle)
    try {
      const res  = await fetch("/api/admin-check", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, secret: pass }),
      });
      const data = await res.json() as { success: boolean };
      if (data.success) {
        localStorage.setItem("datastatz_user", JSON.stringify({
          name: "Admin", email, institution: "DataStatz", isPro: true,
        }));
        setStep("done");
        setTimeout(() => router.push("/dashboard"), 1200);
        setLoading(false);
        return;
      }
    } catch { /* fall through */ }

    // 2. Local user check
    let storedUser: StoredUser | null = null;
    try {
      const raw = localStorage.getItem("datastatz_user");
      if (raw) storedUser = JSON.parse(raw) as StoredUser;
    } catch { /* ignore */ }

    if (!storedUser || storedUser.email !== email) {
      setError("No account found with that email. Please sign up first.");
      setLoading(false);
      return;
    }

    // Password check
    try {
      if (atob(storedUser.pw) !== pass) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Incorrect password.");
      setLoading(false);
      return;
    }

    // Password match — sign in
    setStep("done");
    setTimeout(() => router.push("/dashboard"), 1200);
    setLoading(false);
  }

  // ── FORGOT PASSWORD ───────────────────────────────────────────────────────

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const email = forgotEmail.trim().toLowerCase();
    if (!email) { setError("Please enter your email."); return; }

    setLoading(true);
    try {
      const data = await postMailer({ action: "sendOtp", email, purpose: "reset" });
      if (!data.success || !data.token) throw new Error(data.error || "Could not send code.");
      otpToken.current = data.token;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not send code.");
      setLoading(false);
      return;
    }

    setStep("otp");
    startResend();
    setLoading(false);
  }

  async function handleForgotOtpVerify(e: React.FormEvent) {
    e.preventDefault();
    if (forgotOtp.length !== 6) { setError("Enter the 6-digit code."); return; }
    setLoading(true);
    setError(null);

    try {
      const data = await postMailer({
        action: "verifyOtp",
        email:  forgotEmail.trim().toLowerCase(),
        otp:    forgotOtp,
        token:  otpToken.current,
      });
      if (!data.success) throw new Error(data.error || "Invalid code.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid code.");
      setLoading(false);
      return;
    }

    setStep("reset");
    setLoading(false);
  }

  function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (strengthScore(newPassword) < 4) {
      setError("Password must be 8+ chars and include uppercase, number, and symbol."); return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match."); return;
    }

    // Update password in localStorage
    try {
      const raw = localStorage.getItem("datastatz_user");
      if (raw) {
        const u = JSON.parse(raw) as StoredUser;
        if (u.email === forgotEmail.trim().toLowerCase()) {
          u.pw = btoa(newPassword);
          localStorage.setItem("datastatz_user", JSON.stringify(u));
        }
      }
    } catch { /* ignore */ }

    setStep("done");
    setTimeout(() => resetAll("login"), 2500);
  }

  async function handleForgotResend() {
    if (resendCd > 0) return;
    setError(null);
    setForgotOtp("");
    setLoading(true);
    try {
      const data = await postMailer({
        action:  "sendOtp",
        email:   forgotEmail.trim().toLowerCase(),
        purpose: "reset",
      });
      if (!data.success || !data.token) throw new Error(data.error || "Could not resend.");
      otpToken.current = data.token;
      startResend();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not resend.");
    }
    setLoading(false);
  }

  // ── Resend row shared UI ──────────────────────────────────────────────────

  const ResendRow = useCallback(({ onResend }: { onResend: () => void }) => (
    <p className="text-center text-xs text-slate-500">
      Didn&apos;t receive it?{" "}
      {resendCd > 0 ? (
        <span className="text-slate-600">Resend in {resendCd}s</span>
      ) : (
        <button type="button" onClick={onResend}
          className="text-sky-400 hover:text-sky-300 transition-colors">Resend code</button>
      )}
    </p>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [resendCd]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center px-4 py-16">

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500
                        flex items-center justify-center shadow-lg shadow-sky-500/20">
          <BarChart2 size={22} className="text-white" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">
          <span className="text-sky-400">Data</span>
          <span className="text-slate-100">Statz</span>
        </span>
      </div>

      <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-2xl p-8 shadow-2xl">

        {/* ── Forgot Password flow ── */}
        {mode === "forgot" && (
          <>
            <button onClick={() => resetAll("login")}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-6">
              <ArrowLeft size={13} /> Back to Sign In
            </button>

            <p className="text-slate-100 font-bold text-lg mb-1">Reset password</p>

            {step === "form" && (
              <form onSubmit={handleForgotSubmit} className="space-y-5 mt-5">
                <p className="text-slate-400 text-sm">Enter the email linked to your account and we&apos;ll send a reset code.</p>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Email Address</label>
                  <input type="email" placeholder="you@university.edu" value={forgotEmail}
                    onChange={(e) => { setForgotEmail(e.target.value); setError(null); }}
                    className={INPUT_CLS} autoFocus />
                </div>
                {error && <ErrorMsg msg={error} />}
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                             bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white font-semibold text-sm transition-colors">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : "Send Reset Code"}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleForgotOtpVerify} className="space-y-5 mt-5">
                <div className="bg-sky-500/10 border border-sky-500/25 rounded-xl px-4 py-3 text-sm text-slate-300">
                  Code sent to <span className="text-sky-400 font-medium">{forgotEmail}</span>. Check your inbox.
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">6-digit code</label>
                  <OtpInput value={forgotOtp} onChange={(v) => { setForgotOtp(v); setError(null); }} />
                  <p className="text-xs text-slate-500">Expires in 10 minutes.</p>
                </div>
                {error && <ErrorMsg msg={error} />}
                <button type="submit" disabled={loading || forgotOtp.length < 6}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                             bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white font-semibold text-sm transition-colors">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : "Verify Code"}
                </button>
                <ResendRow onResend={handleForgotResend} />
              </form>
            )}

            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4 mt-5">
                <p className="text-slate-400 text-sm">Choose a new strong password for your account.</p>
                <PasswordField value={newPassword} onChange={(v) => { setNewPassword(v); setError(null); }} label="New Password" />
                {newPassword && <PasswordStrengthBar password={newPassword} />}
                <PasswordField value={confirmPassword} onChange={(v) => { setConfirmPassword(v); setError(null); }} label="Confirm Password" placeholder="Re-enter password" />
                {error && <ErrorMsg msg={error} />}
                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                             bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white font-semibold text-sm transition-colors mt-2">
                  <KeyRound size={15} /> Reset Password
                </button>
              </form>
            )}

            {step === "done" && (
              <div className="mt-5">
                <SuccessScreen
                  headline="Password updated!"
                  sub="You can now sign in with your new password."
                />
              </div>
            )}
          </>
        )}

        {/* ── Login / Signup tabs ── */}
        {mode !== "forgot" && (
          <>
            <div className="flex rounded-xl bg-slate-800/60 p-1 mb-8">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button key={m} onClick={() => resetAll(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    mode === m ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-slate-200"
                  }`}>
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            {/* ═════════════ SIGN IN ═════════════ */}
            {mode === "login" && (
              <>
                {step === "form" && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Email Address</label>
                      <input type="email" placeholder="you@university.edu" value={loginEmail}
                        onChange={(e) => { setLoginEmail(e.target.value); setError(null); }}
                        className={INPUT_CLS} autoFocus />
                    </div>

                    <PasswordField
                      value={loginPass}
                      onChange={(v) => { setLoginPass(v); setError(null); }}
                    />

                    {error && <ErrorMsg msg={error} />}

                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                                 bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white font-semibold text-sm transition-colors mt-1">
                      {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "Sign In"}
                    </button>

                    <div className="flex items-center justify-between pt-1">
                      <button type="button" onClick={() => resetAll("forgot")}
                        className="text-xs text-slate-500 hover:text-sky-400 transition-colors">
                        Forgot password?
                      </button>
                      <button type="button" onClick={() => resetAll("signup")}
                        className="text-xs text-sky-400 hover:text-sky-300 transition-colors">
                        Create account
                      </button>
                    </div>
                  </form>
                )}

                {step === "done" && (
                  <SuccessScreen headline="Signed in!" sub="Redirecting to your workspace…" />
                )}
              </>
            )}

            {/* ═════════════ CREATE ACCOUNT ═════════════ */}
            {mode === "signup" && (
              <>
                {step === "form" && (
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Full Name</label>
                      <input type="text" placeholder="Jane Smith" value={signup.name}
                        onChange={(e) => { setSignup((f) => ({ ...f, name: e.target.value })); setError(null); }}
                        className={INPUT_CLS} autoFocus />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Institution / University</label>
                      <input type="text" placeholder="MIT, Stanford, etc." value={signup.institution}
                        onChange={(e) => { setSignup((f) => ({ ...f, institution: e.target.value })); setError(null); }}
                        className={INPUT_CLS} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Email Address</label>
                      <input type="email" placeholder="you@university.edu" value={signup.email}
                        onChange={(e) => { setSignup((f) => ({ ...f, email: e.target.value })); setError(null); }}
                        className={INPUT_CLS} />
                    </div>

                    <div className="space-y-2">
                      <PasswordField
                        value={signup.password}
                        onChange={(v) => { setSignup((f) => ({ ...f, password: v })); setError(null); }}
                      />
                      <PasswordStrengthBar password={signup.password} />
                    </div>

                    {error && <ErrorMsg msg={error} />}

                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                                 bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white font-semibold text-sm transition-colors mt-2">
                      {loading ? <><Loader2 size={16} className="animate-spin" /> Sending code…</> : "Create Account"}
                    </button>

                    <p className="text-center text-xs text-slate-500">
                      Already have an account?{" "}
                      <button type="button" onClick={() => resetAll("login")}
                        className="text-sky-400 hover:text-sky-300 transition-colors">Sign in</button>
                    </p>
                  </form>
                )}

                {step === "otp" && (
                  <form onSubmit={handleSignupVerify} className="space-y-5">
                    <button type="button" onClick={() => { setStep("form"); setError(null); setOtpCode(""); }}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2">
                      <ArrowLeft size={13} /> Back
                    </button>

                    <div className="bg-sky-500/10 border border-sky-500/25 rounded-xl px-4 py-3 text-sm text-slate-300">
                      Code sent to <span className="text-sky-400 font-medium">{signup.email}</span>. Check your inbox.
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">6-digit code</label>
                      <OtpInput value={otpCode} onChange={(v) => { setOtpCode(v); setError(null); }} />
                      <p className="text-xs text-slate-500">Expires in 10 minutes.</p>
                    </div>

                    {error && <ErrorMsg msg={error} />}

                    <button type="submit" disabled={loading || otpCode.length < 6}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                                 bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white font-semibold text-sm transition-colors">
                      {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : "Verify Email"}
                    </button>

                    <ResendRow onResend={handleSignupResend} />
                  </form>
                )}

                {step === "done" && (
                  <SuccessScreen
                    headline="Email verified!"
                    sub="Your account is ready. Taking you to Sign In…"
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      <Link href="/" className="mt-8 text-xs text-slate-500 hover:text-slate-300 transition-colors">
        ← Back to home
      </Link>
    </main>
  );
}
