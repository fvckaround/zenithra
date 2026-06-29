import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || "onboarding@resend.dev";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const OTP_TTL_MINUTES = 10;

export function generateOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

export async function hashOtp(code) {
  return bcrypt.hash(code, 10);
}

export async function verifyOtp(code, hash) {
  if (!hash) return false;
  return bcrypt.compare(code, hash);
}

export function otpExpiry() {
  return new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
}

export async function sendEmail({ to, subject, html }) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });
    console.log(`[Zenithra] Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error("[Zenithra] Failed to send email:", err);
  }
}

export async function sendOtpEmail(email, code, purpose) {
  const isReset = purpose === "reset";
  const subject = isReset
    ? "Reset your Zenithra password"
    : "Verify your Zenithra account";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:0;background-color:#080B14;font-family:'DM Sans',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080B14;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

                <!-- Header -->
                <tr>
                  <td style="padding-bottom:32px;">
                    <p style="margin:0;font-size:22px;font-weight:700;color:#F5F4F0;letter-spacing:2px;">
                      ZENITHRA
                    </p>
                  </td>
                </tr>

                <!-- Card -->
                <tr>
                  <td style="background-color:#10141F;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:40px 36px;">

                    <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#F5F4F0;">
                      ${isReset ? "Reset your password" : "Verify your email"}
                    </p>
                    <p style="margin:0 0 32px;font-size:14px;color:#8C93A6;line-height:1.6;">
                      ${
                        isReset
                          ? "We received a request to reset your Zenithra password. Use the code below to continue."
                          : "Thanks for signing up with Zenithra. Use the code below to verify your email address."
                      }
                    </p>

                    <!-- OTP Box -->
                    <div style="background-color:#080B14;border:1px solid rgba(212,175,55,0.25);border-radius:12px;padding:28px;text-align:center;margin-bottom:32px;">
                      <p style="margin:0 0 8px;font-size:12px;color:#8C93A6;text-transform:uppercase;letter-spacing:2px;">
                        Your ${isReset ? "reset" : "verification"} code
                      </p>
                      <p style="margin:0;font-size:40px;font-weight:700;color:#D4AF37;letter-spacing:12px;">
                        ${code}
                      </p>
                    </div>

                    <p style="margin:0 0 24px;font-size:13px;color:#8C93A6;line-height:1.6;">
                      This code expires in <strong style="color:#F5F4F0;">${OTP_TTL_MINUTES} minutes</strong>.
                      If you did not request this, you can safely ignore this email.
                    </p>

                    <!-- CTA Button -->
                    <div style="text-align:center;">
                      <a href="${APP_URL}/${isReset ? "reset-password" : "verify-otp"}?email=${encodeURIComponent(email)}"
                        style="display:inline-block;background-color:#D4AF37;color:#080B14;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;">
                        ${isReset ? "Reset Password" : "Verify Account"}
                      </a>
                    </div>

                  </td>
                </tr>

                <!-- Footer -->
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

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject,
      html,
    });
    console.log(`[Zenithra] OTP email sent to ${email}`);
    return null;
  } catch (err) {
    console.error("[Zenithra] Failed to send OTP email:", err);
    throw new Error("Failed to send verification email. Please try again.");
  }
}