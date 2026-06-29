import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/lib/models/User";

export async function PATCH(req, { params }) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  // never allow passwordHash to be patched through admin
  delete body.passwordHash;
  delete body.otpHash;
  const user = await User.findByIdAndUpdate(id, body, { new: true })
    .select("-passwordHash -otpHash")
    .lean();
  return NextResponse.json(user);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await connectDB();
  await User.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}