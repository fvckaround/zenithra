import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Investment from "@/lib/models/Investment";

export async function GET() {
  await connectDB();
  const investments = await Investment.find()
    .sort({ createdAt: -1 })
    .populate("user", "fullName email")
    .lean();
  return NextResponse.json(investments);
}