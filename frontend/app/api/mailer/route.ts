import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { proUpgradeEmailHtml } from "./templates";

// ── Nodemailer transporter (Hostinger SMTP) ───────────────────────────────────
function createTransport() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST || "smtp.hostinger.com",
    port:   Number(process.env.SMTP_PORT) || 465,
    secure: true, // port 465 = SSL
    auth: {
      user: process.env.SMTP_USER || "analytics@datastatz.com",
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = `"DataStatz" <${process.env.SMTP_USER || "analytics@datastatz.com"}>`;

// ── Stateless OTP token helpers ───────────────────────────────────────────────
// Token = base64url( email:otp:expiry:hmac )
// HMAC is over "email:otp:expiry" with OTP_SECRET — tamper-proof, no DB needed.

function createOtpToken(email: string, otp: string): string {
  const expiry  = Date.now() + 10 * 60 * 1000; // 10 min
  const payload = `${email}:${otp}:${expiry}`;
  const secret  = process.env.OTP_SECRET || "fallback-dev-secret";
  const hmac    = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64url");
}

function verifyOtpToken(
  token: string,
  email: string,
  otp: string,
): { ok: true } | { ok: false; reason: string } {
  try {
    const raw   = Buffer.from(token, "base64url").toString("utf8");
    const parts = raw.split(":");
    if (parts.length < 4) return { ok: false, reason: "Malformed token." };

    // Last part is HMAC, everything before is payload
    const hmacFromToken = parts[parts.length - 1];
    const payload       = parts.slice(0, -1).join(":");
    const [tEmail, tOtp, tExpiry] = parts;

    // Recompute HMAC
    const secret = process.env.OTP_SECRET || "fallback-dev-secret";
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    if (
      !crypto.timingSafeEqual(Buffer.from(hmacFromToken, "hex"), Buffer.from(expected, "hex"))
    ) {
      return { ok: false, reason: "Invalid code." };
    }
    if (Date.now() > Number(tExpiry))  return { ok: false, reason: "Code expired. Request a new one." };
    if (tEmail !== email.toLowerCase()) return { ok: false, reason: "Email mismatch." };
    if (tOtp   !== otp)                return { ok: false, reason: "Incorrect code." };

    return { ok: true };
  } catch {
    return { ok: false, reason: "Invalid token." };
  }
}

function generateOtp(): string {
  return String(crypto.randomInt(100000, 999999));
}

// ── Email templates ───────────────────────────────────────────────────────────

function otpEmailHtml(otp: string, purpose: "login" | "verify" | "reset"): string {
  const label =
    purpose === "reset"  ? "password reset" :
    purpose === "verify" ? "email verification" :
    "sign-in";

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0ea5e9,#8b5cf6);padding:28px 40px;text-align:center;">
          <p style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
            DataStatz
          </p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 8px;color:#e2e8f0;font-size:18px;font-weight:700;">Your ${label} code</p>
          <p style="margin:0 0 28px;color:#94a3b8;font-size:14px;line-height:1.6;">
            Use the 6-digit code below to complete your ${label}. It expires in <strong style="color:#e2e8f0;">10 minutes</strong>.
          </p>

          <!-- OTP box -->
          <div style="background:#0a0f1e;border:2px solid #0ea5e9;border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
            <p style="margin:0;color:#38bdf8;font-size:40px;font-weight:800;letter-spacing:0.2em;font-family:monospace;">${otp}</p>
          </div>

          <p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">
            If you didn't request this code, you can safely ignore this email. Never share this code with anyone.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="border-top:1px solid #334155;padding:20px 40px;text-align:center;">
          <p style="margin:0;color:#475569;font-size:11px;">
            © ${new Date().getFullYear()} DataStatz · <a href="https://datastatz.com/privacy" style="color:#0ea5e9;text-decoration:none;">Privacy Policy</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function welcomeEmailHtml(name: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#0ea5e9,#8b5cf6);padding:28px 40px;text-align:center;">
          <p style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">DataStatz</p>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 12px;color:#e2e8f0;font-size:20px;font-weight:700;">Welcome, ${name}!</p>
          <p style="margin:0 0 20px;color:#94a3b8;font-size:14px;line-height:1.6;">
            Your account is all set. You can now upload CSV or Excel files and get instant EDA,
            cleaning diagnostics, scope assessment, and plain-English insights.
          </p>
          <a href="https://datastatz.com/upload"
             style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;
                    font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;">
            Start Analysing →
          </a>
          <p style="margin:24px 0 0;color:#64748b;font-size:12px;line-height:1.6;">
            Questions? Reply to this email and we'll get back to you.
          </p>
        </td></tr>
        <tr><td style="border-top:1px solid #334155;padding:20px 40px;text-align:center;">
          <p style="margin:0;color:#475569;font-size:11px;">
            © ${new Date().getFullYear()} DataStatz · <a href="https://datastatz.com/privacy" style="color:#0ea5e9;text-decoration:none;">Privacy Policy</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const { action } = body;

  // ── sendOtp ────────────────────────────────────────────────────────────────
  if (action === "sendOtp") {
    const email   = (body.email || "").toLowerCase().trim();
    const purpose = (body.purpose as "login" | "verify" | "reset") || "login";
    if (!email) return NextResponse.json({ success: false, error: "Email required." }, { status: 400 });

    const otp   = generateOtp();
    const token = createOtpToken(email, otp);

    try {
      const transport = createTransport();
      await transport.sendMail({
        from:    FROM,
        to:      email,
        subject: purpose === "reset"
          ? "DataStatz — Password Reset Code"
          : purpose === "verify"
          ? "DataStatz — Verify Your Email"
          : "DataStatz — Sign-In Code",
        html:    otpEmailHtml(otp, purpose),
      });
    } catch (err) {
      console.error("SMTP sendOtp error:", err);
      return NextResponse.json({ success: false, error: "Failed to send code. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ success: true, token });
  }

  // ── verifyOtp ──────────────────────────────────────────────────────────────
  if (action === "verifyOtp") {
    const email = (body.email || "").toLowerCase().trim();
    const otp   = (body.otp   || "").trim();
    const token = (body.token || "").trim();

    if (!email || !otp || !token) {
      return NextResponse.json({ success: false, error: "Missing fields." }, { status: 400 });
    }

    const result = verifyOtpToken(token, email, otp);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.reason }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  }

  // ── register (welcome email) ───────────────────────────────────────────────
  if (action === "register") {
    const name  = (body.name  || "").trim();
    const email = (body.email || "").toLowerCase().trim();
    if (!email) return NextResponse.json({ success: false, error: "Email required." }, { status: 400 });

    try {
      const transport = createTransport();
      // Welcome email to new user
      await transport.sendMail({
        from:    FROM,
        to:      email,
        subject: "Welcome to DataStatz!",
        html:    welcomeEmailHtml(name || "there"),
      });
      // Internal notification
      await transport.sendMail({
        from:    FROM,
        to:      "analytics@datastatz.com",
        subject: `New signup: ${name} <${email}>`,
        text:    `New user registered:\nName: ${name}\nEmail: ${email}\nInstitution: ${body.institution || "—"}\nTime: ${new Date().toISOString()}`,
      });
    } catch (err) {
      console.error("SMTP register error:", err);
      // Non-blocking: registration already saved client-side
    }

    return NextResponse.json({ success: true });
  }

  // ── feedback ───────────────────────────────────────────────────────────────
  if (action === "feedback") {
    const userEmail = (body.email   || "anonymous").trim();
    const message   = (body.message || "").trim();
    const analysisId = (body.analysisId || "").trim();

    if (!message) return NextResponse.json({ success: false, error: "Message required." }, { status: 400 });

    try {
      const transport = createTransport();
      await transport.sendMail({
        from:    FROM,
        to:      "analytics@datastatz.com",
        subject: `Feedback from ${userEmail}`,
        text:    `From: ${userEmail}\nAnalysis: ${analysisId || "—"}\n\n${message}`,
      });
    } catch (err) {
      console.error("SMTP feedback error:", err);
      return NextResponse.json({ success: false, error: "Could not send feedback." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  }

  // ── send_pro_upgrade_email ─────────────────────────────────────────────────
  if (action === "send_pro_upgrade_email") {
    const email    = (body.email    || "").toLowerCase().trim();
    const userName = (body.userName || "there").trim();
    if (!email) return NextResponse.json({ success: false, error: "Email required." }, { status: 400 });

    try {
      const transport = createTransport();
      await transport.sendMail({
        from:    FROM,
        to:      email,
        subject: "🎉 Welcome to DataStatz Pro!",
        html:    proUpgradeEmailHtml(userName),
      });
      await transport.sendMail({
        from:    FROM,
        to:      "analytics@datastatz.com",
        subject: `[Log] User upgraded to Pro: ${email}`,
        text:    `${userName} (${email}) was upgraded to Pro at ${new Date().toISOString()}`,
      });
    } catch (err) {
      console.error("SMTP pro upgrade error:", err);
      return NextResponse.json({ success: false, error: "Could not send upgrade email." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: "Unknown action." }, { status: 400 });
}
