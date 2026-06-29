import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Withdrawal from "@/lib/models/Withdrawal";

export async function GET() {
  await connectDB();
  const withdrawals = await Withdrawal.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(withdrawals);
}