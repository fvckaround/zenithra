import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth";
import { generateOtp, hashOtp, otpExpiry, sendOtpEmail } from "@/lib/otp";
import { ok, fail } from "@/lib/api";

export async function POST(request) {
  try {
    const { fullName, email, password, referralCode } = await request.json();

    if (!fullName?.trim()) return fail("Full name is required");
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return fail("A valid email address is required");
    if (!password || password.length < 8)
      return fail("Password must be at least 8 characters");

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      if (existing.emailVerified)
        return fail("An account with this email already exists", 409);

      // Unverified account exists — resend a fresh code
      const code = generateOtp();
      existing.otpHash = await hashOtp(code);
      existing.otpExpiresAt = otpExpiry();
      existing.otpPurpose = "verify";
      await existing.save();
      await sendOtpEmail(normalizedEmail, code, "verify");
      return ok({ email: normalizedEmail });
    }

    // Find referrer if code was provided
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({
        referralCode: referralCode.toUpperCase().trim(),
      });
      if (referrer) referredBy = referrer._id;
    }

    const code = generateOtp();
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      otpHash: await hashOtp(code),
      otpExpiresAt: otpExpiry(),
      otpPurpose: "verify",
      referralCode: crypto.randomBytes(4).toString("hex").toUpperCase(),
      referredBy,
    });

    await sendOtpEmail(user.email, code, "verify");
    return ok({ email: user.email });
  } catch (err) {
    console.error("signup error:", err);
    return fail("Something went wrong. Please try again.", 500);
  }
}