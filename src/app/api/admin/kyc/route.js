import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({ kycStatus: { $in: ["pending", "approved", "rejected"] } })
      .select("fullName email kycStatus kycFrontImage kycBackImage kycRejectedReason createdAt")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}