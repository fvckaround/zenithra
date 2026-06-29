import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Deposit from "@/lib/models/Deposit";

export async function GET() {
  await connectDB();
  const deposits = await Deposit.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(deposits);
}