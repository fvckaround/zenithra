import { sendEmail } from "@/lib/otp";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function baseTemplate(content) {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
      <body style="margin:0;padding:0;background-color:#080B14;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080B14;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
                <tr>
                  <td style="padding-bottom:32px;">
                    <p style="margin:0;font-size:22px;font-weight:700;color:#F5F4F0;letter-spacing:2px;">ZENITHRA</p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#10141F;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:40px 36px;">
                    ${content}
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:28px;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#5C6478;line-height:1.6;">
                      © ${new Date().getFullYear()} Zenithra Holding. All rights reserved.<br/>
                      Digital assets carry risk. Invest responsibly.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function btn(label, href) {
  return `
    <div style="text-align:center;margin-top:28px;">
      <a href="${href}" style="display:inline-block;background-color:#D4AF37;color:#080B14;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;">
        ${label}
      </a>
    </div>
  `;
}

function badge(text, color) {
  return `<span style="display:inline-block;background-color:${color}20;color:${color};font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;">${text}</span>`;
}

// ── Deposit approved ──────────────────────────────────────────────────────────
export async function sendDepositApprovedEmail({ to, fullName, amount, coin }) {
  await sendEmail({
    to,
    subject: "Your deposit has been approved — Zenithra",
    html: baseTemplate(`
      <p style="margin:0 0 6px;font-size:22px;font-weight:600;color:#F5F4F0;">Deposit Approved ✓</p>
      <p style="margin:0 0 28px;font-size:14px;color:#8C93A6;">Hi ${fullName}, your deposit has been confirmed and credited to your account.</p>
      <div style="background-color:#080B14;border:1px solid rgba(212,175,55,0.2);border-radius:12px;padding:24px;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#8C93A6;padding-bottom:10px;">Amount</td>
            <td style="font-size:13px;color:#F5F4F0;font-weight:600;text-align:right;padding-bottom:10px;">$${Number(amount).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#8C93A6;padding-bottom:10px;">Coin</td>
            <td style="font-size:13px;color:#F5F4F0;font-weight:600;text-align:right;padding-bottom:10px;">${coin}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#8C93A6;">Status</td>
            <td style="text-align:right;">${badge("Approved", "#10B981")}</td>
          </tr>
        </table>
      </div>
      ${btn("View Dashboard", `${APP_URL}/dashboard`)}
    `),
  });
}

// ── Deposit rejected ──────────────────────────────────────────────────────────
export async function sendDepositRejectedEmail({ to, fullName, amount, coin }) {
  await sendEmail({
    to,
    subject: "Your deposit could not be processed — Zenithra",
    html: baseTemplate(`
      <p style="margin:0 0 6px;font-size:22px;font-weight:600;color:#F5F4F0;">Deposit Rejected</p>
      <p style="margin:0 0 28px;font-size:14px;color:#8C93A6;">Hi ${fullName}, unfortunately your deposit could not be processed. Please contact support for assistance.</p>
      <div style="background-color:#080B14;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#8C93A6;padding-bottom:10px;">Amount</td>
            <td style="font-size:13px;color:#F5F4F0;font-weight:600;text-align:right;padding-bottom:10px;">$${Number(amount).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#8C93A6;padding-bottom:10px;">Coin</td>
            <td style="font-size:13px;color:#F5F4F0;font-weight:600;text-align:right;padding-bottom:10px;">${coin}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#8C93A6;">Status</td>
            <td style="text-align:right;">${badge("Rejected", "#EF4444")}</td>
          </tr>
        </table>
      </div>
      ${btn("Contact Support", `${APP_URL}/dashboard`)}
    `),
  });
}

// ── Withdrawal approved ───────────────────────────────────────────────────────
export async function sendWithdrawalApprovedEmail({ to, fullName, amount, coin, walletAddress }) {
  await sendEmail({
    to,
    subject: "Your withdrawal has been processed — Zenithra",
    html: baseTemplate(`
      <p style="margin:0 0 6px;font-size:22px;font-weight:600;color:#F5F4F0;">Withdrawal Approved ✓</p>
      <p style="margin:0 0 28px;font-size:14px;color:#8C93A6;">Hi ${fullName}, your withdrawal has been approved and is being sent to your wallet.</p>
      <div style="background-color:#080B14;border:1px solid rgba(212,175,55,0.2);border-radius:12px;padding:24px;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#8C93A6;padding-bottom:10px;">Amount</td>
            <td style="font-size:13px;color:#F5F4F0;font-weight:600;text-align:right;padding-bottom:10px;">$${Number(amount).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#8C93A6;padding-bottom:10px;">Coin</td>
            <td style="font-size:13px;color:#F5F4F0;font-weight:600;text-align:right;padding-bottom:10px;">${coin}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#8C93A6;padding-bottom:10px;">Wallet</td>
            <td style="font-size:11px;color:#F5F4F0;font-family:monospace;text-align:right;padding-bottom:10px;word-break:break-all;">${walletAddress}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#8C93A6;">Status</td>
            <td style="text-align:right;">${badge("Approved", "#10B981")}</td>
          </tr>
        </table>
      </div>
      ${btn("View Dashboard", `${APP_URL}/dashboard`)}
    `),
  });
}

// ── Withdrawal rejected ───────────────────────────────────────────────────────
export async function sendWithdrawalRejectedEmail({ to, fullName, amount, coin }) {
  await sendEmail({
    to,
    subject: "Your withdrawal request was rejected — Zenithra",
    html: baseTemplate(`
      <p style="margin:0 0 6px;font-size:22px;font-weight:600;color:#F5F4F0;">Withdrawal Rejected</p>
      <p style="margin:0 0 28px;font-size:14px;color:#8C93A6;">Hi ${fullName}, your withdrawal request could not be processed. Your balance has not been affected. Please contact support.</p>
      <div style="background-color:#080B14;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#8C93A6;padding-bottom:10px;">Amount</td>
            <td style="font-size:13px;color:#F5F4F0;font-weight:600;text-align:right;padding-bottom:10px;">$${Number(amount).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#8C93A6;padding-bottom:10px;">Coin</td>
            <td style="font-size:13px;color:#F5F4F0;font-weight:600;text-align:right;padding-bottom:10px;">${coin}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#8C93A6;">Status</td>
            <td style="text-align:right;">${badge("Rejected", "#EF4444")}</td>
          </tr>
        </table>
      </div>
      ${btn("Contact Support", `${APP_URL}/dashboard`)}
    `),
  });
}

// ── KYC approved ──────────────────────────────────────────────────────────────
export async function sendKycApprovedEmail({ to, fullName }) {
  await sendEmail({
    to,
    subject: "Your identity has been verified — Zenithra",
    html: baseTemplate(`
      <p style="margin:0 0 6px;font-size:22px;font-weight:600;color:#F5F4F0;">Identity Verified ✓</p>
      <p style="margin:0 0 28px;font-size:14px;color:#8C93A6;">Hi ${fullName}, your identity verification has been approved. Your account is now fully verified.</p>
      <div style="background-color:#080B14;border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="margin:0;font-size:32px;">✓</p>
        <p style="margin:8px 0 0;font-size:14px;color:#10B981;font-weight:600;">Account Fully Verified</p>
      </div>
      ${btn("Go to Dashboard", `${APP_URL}/dashboard`)}
    `),
  });
}

// ── KYC rejected ──────────────────────────────────────────────────────────────
export async function sendKycRejectedEmail({ to, fullName, reason }) {
  await sendEmail({
    to,
    subject: "Identity verification failed — Zenithra",
    html: baseTemplate(`
      <p style="margin:0 0 6px;font-size:22px;font-weight:600;color:#F5F4F0;">Verification Failed</p>
      <p style="margin:0 0 28px;font-size:14px;color:#8C93A6;">Hi ${fullName}, unfortunately your identity verification could not be approved.</p>
      ${reason ? `
      <div style="background-color:#080B14;border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 6px;font-size:12px;color:#8C93A6;text-transform:uppercase;letter-spacing:1px;">Reason</p>
        <p style="margin:0;font-size:14px;color:#F5F4F0;">${reason}</p>
      </div>` : ""}
      <p style="font-size:14px;color:#8C93A6;">Please resubmit your documents with clearer images. Make sure all corners of your ID are visible and the text is readable.</p>
      ${btn("Resubmit Documents", `${APP_URL}/dashboard/profile`)}
    `),
  });
}

// ── Referral bonus ────────────────────────────────────────────────────────────
export async function sendReferralBonusEmail({ to, fullName, bonus, referredName }) {
  await sendEmail({
    to,
    subject: "You earned a referral bonus — Zenithra",
    html: baseTemplate(`
      <p style="margin:0 0 6px;font-size:22px;font-weight:600;color:#F5F4F0;">Referral Bonus Received 🎉</p>
      <p style="margin:0 0 28px;font-size:14px;color:#8C93A6;">Hi ${fullName}, you just earned a referral bonus!</p>
      <div style="background-color:#080B14;border:1px solid rgba(212,175,55,0.2);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:12px;color:#8C93A6;text-transform:uppercase;letter-spacing:2px;">Bonus Amount</p>
        <p style="margin:0;font-size:36px;font-weight:700;color:#D4AF37;">$${Number(bonus).toLocaleString()}</p>
        <p style="margin:8px 0 0;font-size:13px;color:#8C93A6;">From ${referredName}'s deposit</p>
      </div>
      ${btn("View Dashboard", `${APP_URL}/dashboard`)}
    `),
  });
}

// ── Welcome email ─────────────────────────────────────────────────────────────
export async function sendWelcomeEmail({ to, fullName }) {
  await sendEmail({
    to,
    subject: "Welcome to Zenithra Holding",
    html: baseTemplate(`
      <p style="margin:0 0 6px;font-size:22px;font-weight:600;color:#F5F4F0;">Welcome, ${fullName} 👋</p>
      <p style="margin:0 0 28px;font-size:14px;color:#8C93A6;">Your account has been verified and you're ready to start investing with Zenithra Holding.</p>
      <div style="background-color:#080B14;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-size:13px;color:#F5F4F0;font-weight:600;">Get started in 3 steps:</p>
        <p style="margin:0 0 8px;font-size:13px;color:#8C93A6;">1. Make your first deposit</p>
        <p style="margin:0 0 8px;font-size:13px;color:#8C93A6;">2. Choose an investment plan</p>
        <p style="margin:0;font-size:13px;color:#8C93A6;">3. Watch your balance grow daily</p>
      </div>
      ${btn("Start Investing", `${APP_URL}/dashboard`)}
    `),
  });
}