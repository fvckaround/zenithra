import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { getCurrentUser } from "@/lib/auth";
import Deposit from "@/lib/models/Deposit";
import Wallet from "@/lib/models/Wallet";
import { createNotification } from "@/lib/notify";
import { sendAdminDepositEmail } from "@/lib/emails";
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

    const { amount, coin, walletAddress, txHash } = await req.json();
    const value = Number(amount);

    if (!Number.isFinite(value) || value < 100)
      return fail("Minimum deposit is $100");
    if (!coin) return fail("Select a coin");
    if (!walletAddress) return fail("Wallet address is required");

    const rounded = +value.toFixed(2);

    await Deposit.create({
      userId: user._id,
      userEmail: user.email,
      userName: user.fullName,
      amount: rounded,
      coin,
      walletAddress,
      txHash: txHash || "",
      status: "pending",
    });

    await createNotification(user._id, {
      title: "Deposit Submitted",
      message: `Your deposit of $${rounded.toLocaleString()} via ${coin} has been submitted and is awaiting admin approval.`,
      type: "deposit",
    });

    await sendAdminDepositEmail({
      fullName: user.fullName,
      email: user.email,
      amount: rounded,
      coin,
      txHash: txHash || "",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("deposit error:", err);
    return fail("Failed to submit deposit", 500);
  }
}