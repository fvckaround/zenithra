import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Wallet from "@/lib/models/Wallet";

export async function GET() {
  try {
    await connectDB();
    const wallets = await Wallet.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(wallets);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const wallet = await Wallet.create(body);
    return NextResponse.json(wallet);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}