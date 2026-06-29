import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { getCurrentUser } from "@/lib/auth";
import Withdrawal from "@/lib/models/Withdrawal";
import Wallet from "@/lib/models/Wallet";
import { createNotification } from "@/lib/notify";
import { sendAdminWithdrawalEmail } from "@/lib/emails";
import { fail } from "@/lib/api";

export async function GET() {
  try {
    await connectDB();
    const wallets = await Wallet.find({ isActive: true }).lean();
    return NextResponse.json({ wallets });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    const { amount, coin, walletAddress } = await req.json();
    const value = Number(amount);

    if (!Number.isFinite(value) || value < 50)
      return fail("Minimum withdrawal is $50");
    if (!coin) return fail("Select a coin");
    if (!walletAddress) return fail("Enter your wallet address");
    if (value > user.balance)
      return fail("Insufficient balance");

    const rounded = +value.toFixed(2);

    await Withdrawal.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.fullName,
      amount: rounded,
      coin,
      walletAddress,
      status: "pending",
    });

    await createNotification(user._id, {
      title: "Withdrawal Requested",
      message: `Your withdrawal of $${rounded.toLocaleString()} via ${coin} has been submitted and is awaiting admin approval.`,
      type: "withdrawal",
    });

    await sendAdminWithdrawalEmail({
      fullName: user.fullName,
      email: user.email,
      amount: rounded,
      coin,
      walletAddress,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("withdraw error:", err);
    return fail("Failed to submit withdrawal", 500);
  }
}