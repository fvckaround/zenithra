import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/lib/models/User";

export async function GET() {
  await connectDB();
  const users = await User.find()
    .sort({ createdAt: -1 })
    .select("-passwordHash -otpHash")
    .lean();
  return NextResponse.json(users);
}