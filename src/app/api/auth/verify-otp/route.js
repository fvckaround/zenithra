import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { verifyOtp } from "@/lib/otp";
import { signSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/jwt";
import { fail } from "@/lib/api";
import { sendWelcomeEmail, sendAdminNewUserEmail } from "@/lib/emails";

export async function POST(request) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) return fail("Email and code are required");

    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return fail("Account not found", 404);

    if (user.otpPurpose !== "verify" || !user.otpExpiresAt)
      return fail("No verification in progress. Please sign up again.");
    if (user.otpExpiresAt.getTime() < Date.now())
      return fail("This code has expired. Request a new one.");

    const valid = await verifyOtp(code, user.otpHash);
    if (!valid) return fail("Incorrect code. Please try again.");

    user.emailVerified = true;
    user.otpHash = null;
    user.otpExpiresAt = null;
    user.otpPurpose = null;
    await user.save();

    await sendWelcomeEmail({
      to: user.email,
      fullName: user.fullName,
    });

    await sendAdminNewUserEmail({
      fullName: user.fullName,
      email: user.email,
    });

    const token = await signSession({ sub: user._id.toString(), email: user.email });
    const res = NextResponse.json({ ok: true, email: user.email });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error("verify-otp error:", err);
    return fail("Something went wrong. Please try again.", 500);
  }
}