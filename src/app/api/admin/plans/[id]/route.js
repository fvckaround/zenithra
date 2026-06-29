import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Plan from "@/lib/models/Plan";

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const plan = await Plan.findById(id).lean();
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    return NextResponse.json(plan);
  } catch (err) {
    console.error("admin plan GET error:", err);
    return NextResponse.json({ error: "Failed to load plan" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const body = await req.json();
    const plan = await Plan.findByIdAndUpdate(id, body, { new: true });
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    return NextResponse.json(plan);
  } catch (err) {
    console.error("admin plan PATCH error:", err);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    await Plan.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("admin plan DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}