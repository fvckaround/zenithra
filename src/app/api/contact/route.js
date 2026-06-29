import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/otp";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ ok: false, error: "All fields are required" }, { status: 400 });
    }

    // Send to admin
    if (ADMIN_EMAIL) {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `New contact message — ${subject} from ${name}`,
        html: `
          <!DOCTYPE html>
          <html>
            <body style="margin:0;padding:0;background-color:#080B14;font-family:Arial,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080B14;padding:40px 20px;">
                <tr>
                  <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
                      <tr>
                        <td style="padding-bottom:24px;">
                          <p style="margin:0;font-size:22px;font-weight:700;color:#F5F4F0;letter-spacing:2px;">ZENITHRA</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color:#10141F;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:36px;">
                          <p style="margin:0 0 6px;font-size:20px;font-weight:600;color:#F5F4F0;">New Contact Message</p>
                          <p style="margin:0 0 24px;font-size:14px;color:#8C93A6;">Someone submitted the contact form on Zenithra.</p>
                          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080B14;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px;margin-bottom:20px;">
                            <tr>
                              <td style="font-size:13px;color:#8C93A6;padding-bottom:10px;">Name</td>
                              <td style="font-size:13px;color:#F5F4F0;font-weight:600;text-align:right;padding-bottom:10px;">${name}</td>
                            </tr>
                            <tr>
                              <td style="font-size:13px;color:#8C93A6;padding-bottom:10px;">Email</td>
                              <td style="font-size:13px;color:#F5F4F0;text-align:right;padding-bottom:10px;">${email}</td>
                            </tr>
                            <tr>
                              <td style="font-size:13px;color:#8C93A6;">Subject</td>
                              <td style="font-size:13px;color:#D4AF37;font-weight:600;text-align:right;">${subject}</td>
                            </tr>
                          </table>
                          <p style="margin:0 0 8px;font-size:12px;color:#8C93A6;text-transform:uppercase;letter-spacing:1px;">Message</p>
                          <p style="margin:0;font-size:14px;color:#F5F4F0;line-height:1.6;background-color:#080B14;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:16px;">${message}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:24px;text-align:center;">
                          <p style="margin:0;font-size:12px;color:#5C6478;">© ${new Date().getFullYear()} Zenithra Holding</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });
    }

    // Send confirmation to user
    await sendEmail({
      to: email,
      subject: "We received your message — Zenithra",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background-color:#080B14;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080B14;padding:40px 20px;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
                    <tr>
                      <td style="padding-bottom:24px;">
                        <p style="margin:0;font-size:22px;font-weight:700;color:#F5F4F0;letter-spacing:2px;">ZENITHRA</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color:#10141F;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:36px;">
                        <p style="margin:0 0 6px;font-size:20px;font-weight:600;color:#F5F4F0;">Message Received ✓</p>
                        <p style="margin:0 0 24px;font-size:14px;color:#8C93A6;">Hi ${name}, thank you for reaching out. We've received your message and will get back to you within 24 hours.</p>
                        <div style="background-color:#080B14;border:1px solid rgba(212,175,55,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
                          <p style="margin:0 0 6px;font-size:12px;color:#8C93A6;text-transform:uppercase;letter-spacing:1px;">Your subject</p>
                          <p style="margin:0;font-size:14px;color:#D4AF37;font-weight:600;">${subject}</p>
                        </div>
                        <p style="margin:0;font-size:13px;color:#8C93A6;line-height:1.6;">If your issue is urgent, you can also reach us directly at <a href="mailto:zenithraholding@outlook.com" style="color:#D4AF37;">support@zenithra.com</a>.</p>
                        <div style="text-align:center;margin-top:28px;">
                          <a href="${APP_URL}/dashboard" style="display:inline-block;background-color:#D4AF37;color:#080B14;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;">
                            Go to Dashboard
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:24px;text-align:center;">
                        <p style="margin:0;font-size:12px;color:#5C6478;">© ${new Date().getFullYear()} Zenithra Holding. All rights reserved.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact error:", err);
    return NextResponse.json({ ok: false, error: "Failed to send message" }, { status: 500 });
  }
}