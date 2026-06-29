import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { getCurrentUser, comparePassword, hashPassword } from "@/lib/auth";

export async function PATCH(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword)
      return NextResponse.json({ ok: false, error: "All fields are required" }, { status: 400 });

    if (newPassword.length < 8)
      return NextResponse.json({ ok: false, error: "Password must be at least 8 characters" }, { status: 400 });

    const valid = await comparePassword(currentPassword, user.passwordHash);
    if (!valid)
      return NextResponse.json({ ok: false, error: "Current password is incorrect" }, { status: 401 });

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Failed to change password" }, { status: 500 });
  }
}