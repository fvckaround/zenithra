import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { generateOtp, hashOtp, otpExpiry, sendOtpEmail } from "@/lib/otp";
import { ok, fail } from "@/lib/api";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return fail("A valid email address is required");

    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond success to avoid leaking which emails are registered.
    if (!user) return ok({ email });

    const code = generateOtp();
    user.otpHash = await hashOtp(code);
    user.otpExpiresAt = otpExpiry();
    user.otpPurpose = "reset";
    await user.save();

    const devCode = await sendOtpEmail(user.email, code, "reset");
    return ok({ email: user.email, devCode });
  } catch (err) {
    console.error("forgot-password error:", err);
    return fail("Something went wrong. Please try again.", 500);
  }
}
