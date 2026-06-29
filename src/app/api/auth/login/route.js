import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { comparePassword } from "@/lib/auth";
import { signSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/jwt";
import { fail } from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return fail("Email and password are required");

    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return fail("Invalid email or password", 401);

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) return fail("Invalid email or password", 401);

    if (!user.emailVerified)
      return fail("Please verify your email before logging in.", 403, {
        needsVerification: true,
        email: user.email,
      });

   const token = await signSession({ sub: user._id.toString(), email: user.email });

    // Build response manually so cookies.set works correctly
    const res = NextResponse.json({
      ok: true,
      email: user.email,
      isAdmin: user.email === process.env.ADMIN_EMAIL,
    });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error("login error:", err);
    return fail("Something went wrong. Please try again.", 500);
  }
}