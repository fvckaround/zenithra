import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Wallet from "@/lib/models/Wallet";

export async function PATCH(req, { params }) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const wallet = await Wallet.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(wallet);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await connectDB();
  await Wallet.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}