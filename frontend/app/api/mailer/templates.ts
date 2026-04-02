export function proUpgradeEmailHtml(userName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0ea5e9,#06b6d4);padding:28px 40px;text-align:center;">
          <p style="margin:0 0 8px;color:#fff;font-size:28px;">🎉</p>
          <p style="margin:0;color:#fff;font-size:20px;font-weight:800;letter-spacing:-0.5px;">
            Congratulations! You've been upgraded to Pro
          </p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 20px;color:#e2e8f0;font-size:16px;font-weight:600;">
            Hi ${userName},
          </p>
          <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
            Great news — your DataStatz account has been upgraded to <strong style="color:#0ea5e9;">Pro</strong>.
            You now have access to all of our premium features:
          </p>

          <!-- Features list -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="padding:10px 16px;background:#0f172a;border-radius:10px;margin-bottom:8px;">
              <p style="margin:0;color:#e2e8f0;font-size:14px;">🔗 &nbsp;<strong>Shareable Reports</strong> — Share your analyses with a public link</p>
            </td></tr>
            <tr><td style="padding:8px 0;"></td></tr>
            <tr><td style="padding:10px 16px;background:#0f172a;border-radius:10px;">
              <p style="margin:0;color:#e2e8f0;font-size:14px;">✨ &nbsp;<strong>Interactive Cleaning</strong> — Fix data issues with guided workflows</p>
            </td></tr>
            <tr><td style="padding:8px 0;"></td></tr>
            <tr><td style="padding:10px 16px;background:#0f172a;border-radius:10px;">
              <p style="margin:0;color:#e2e8f0;font-size:14px;">🤖 &nbsp;<strong>AutoML Predictions</strong> — Run machine learning models automatically</p>
            </td></tr>
            <tr><td style="padding:8px 0;"></td></tr>
            <tr><td style="padding:10px 16px;background:#0f172a;border-radius:10px;">
              <p style="margin:0;color:#e2e8f0;font-size:14px;">📊 &nbsp;<strong>Unlimited Uploads</strong> — Upload datasets up to 50MB</p>
            </td></tr>
          </table>

          <!-- CTA button -->
          <a href="https://datastatz.com/upload"
             style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;
                    font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;">
            Start Using Pro →
          </a>

          <p style="margin:24px 0 0;color:#64748b;font-size:12px;line-height:1.6;">
            Questions? Contact us at <a href="mailto:analytics@datastatz.com" style="color:#0ea5e9;text-decoration:none;">analytics@datastatz.com</a>
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
