import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/lib/models/User";
import Deposit from "@/lib/models/Deposit";
import Withdrawal from "@/lib/models/Withdrawal";
import Investment from "@/lib/models/Investment";

export async function GET() {
  try {
    await connectDB();

    const [
      totalUsers,
      totalDepositsAgg,
      totalWithdrawalsAgg,
      pendingDeposits,
      pendingWithdrawals,
      activeInvestments,
    ] = await Promise.all([
      User.countDocuments(),
      Deposit.aggregate([{ $match: { status: "approved" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Withdrawal.aggregate([{ $match: { status: "approved" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Deposit.countDocuments({ status: "pending" }),
      Withdrawal.countDocuments({ status: "pending" }),
      Investment.countDocuments({ status: "Active" }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalDeposits: totalDepositsAgg[0]?.total || 0,
      totalWithdrawals: totalWithdrawalsAgg[0]?.total || 0,
      pendingDeposits,
      pendingWithdrawals,
      activeInvestments,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    );
  }
}