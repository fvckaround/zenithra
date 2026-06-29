import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Transaction from "@/lib/models/Transaction";

export async function GET() {
  await connectDB();
  const transactions = await Transaction.find()
    .sort({ createdAt: -1 })
    .populate("user", "fullName email")
    .lean();
  return NextResponse.json(transactions);
}