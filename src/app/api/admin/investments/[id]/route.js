import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Investment from "@/lib/models/Investment";

export async function PATCH(req, { params }) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const investment = await Investment.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(investment);
}