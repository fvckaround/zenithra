import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { generateOtp, hashOtp, otpExpiry, sendOtpEmail } from "@/lib/otp";
import { ok, fail } from "@/lib/api";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) return fail("Email is required");

    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Don't reveal whether the account exists; only resend if unverified.
    if (!user || user.emailVerified) return ok({ email });

    const code = generateOtp();
    user.otpHash = await hashOtp(code);
    user.otpExpiresAt = otpExpiry();
    user.otpPurpose = "verify";
    await user.save();

    const devCode = await sendOtpEmail(user.email, code, "verify");
    return ok({ email: user.email, devCode });
  } catch (err) {
    console.error("resend-otp error:", err);
    return fail("Something went wrong. Please try again.", 500);
  }
}
