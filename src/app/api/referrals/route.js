import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { getCurrentUser } from "@/lib/auth";
import User from "@/lib/models/User";
import Transaction from "@/lib/models/Transaction";
import { fail } from "@/lib/api";

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const [referrals, bonusTransactions] = await Promise.all([
      User.find({ referredBy: user._id })
        .select("fullName email createdAt")
        .lean(),
      Transaction.find({
        user: user._id,
        type: "Earning",
        note: /Referral bonus/,
      }).lean(),
    ]);

    const totalBonus = bonusTransactions.reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      referrals: referrals.map((r) => ({
        id: r._id.toString(),
        fullName: r.fullName,
        email: r.email,
        joinedAt: r.createdAt,
      })),
      totalBonus: +totalBonus.toFixed(2),
    });
  } catch (err) {
    console.error("referrals error:", err);
    return fail("Failed to load referrals", 500);
  }
}