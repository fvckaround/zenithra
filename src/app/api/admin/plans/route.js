import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Plan from "@/lib/models/Plan";

export async function GET() {
  try {
    await connectDB();
    const plans = await Plan.find().sort({ minDeposit: 1 }).lean();
    return NextResponse.json(plans);
  } catch (err) {
    console.error("admin plans GET error:", err);
    return NextResponse.json({ error: "Failed to load plans" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const plan = await Plan.create(body);
    return NextResponse.json(plan);
  } catch (err) {
    console.error("admin plans POST error:", err);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}