import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth";
import { verifyOtp } from "@/lib/otp";
import { ok, fail } from "@/lib/api";

export async function POST(request) {
  try {
    const { email, code, password } = await request.json();
    if (!email || !code) return fail("Email and reset code are required");
    if (!password || password.length < 8)
      return fail("Password must be at least 8 characters");

    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return fail("Invalid reset request", 400);

    if (user.otpPurpose !== "reset" || !user.otpExpiresAt)
      return fail("No reset in progress. Request a new code.");
    if (user.otpExpiresAt.getTime() < Date.now())
      return fail("This code has expired. Request a new one.");

    const valid = await verifyOtp(code, user.otpHash);
    if (!valid) return fail("Incorrect reset code. Please try again.");

    user.passwordHash = await hashPassword(password);
    user.otpHash = null;
    user.otpExpiresAt = null;
    user.otpPurpose = null;
    user.emailVerified = true; // a successful reset proves email ownership
    await user.save();

    return ok({ email: user.email });
  } catch (err) {
    console.error("reset-password error:", err);
    return fail("Something went wrong. Please try again.", 500);
  }
}
