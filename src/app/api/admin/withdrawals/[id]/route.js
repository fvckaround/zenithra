import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Withdrawal from "@/lib/models/Withdrawal";
import User from "@/lib/models/User";
import Transaction from "@/lib/models/Transaction";
import { createNotification } from "@/lib/notify";
import {
  sendWithdrawalApprovedEmail,
  sendWithdrawalRejectedEmail,
} from "@/lib/emails";

export async function PATCH(req, { params }) {
  const { id } = await params;
  await connectDB();
  const { status } = await req.json();

  const withdrawal = await Withdrawal.findByIdAndUpdate(id, { status }, { new: true });
  if (!withdrawal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const user = await User.findById(withdrawal.userId);

  if (status === "approved") {
    user.balance = +(user.balance - withdrawal.amount).toFixed(2);
    user.totalWithdrawn = +(user.totalWithdrawn + withdrawal.amount).toFixed(2);
    await user.save();

    await Transaction.create({
      user: withdrawal.userId,
      type: "Withdrawal",
      amount: withdrawal.amount,
      status: "Completed",
      note: `Withdrawal of $${withdrawal.amount} via ${withdrawal.coin} approved`,
    });

    await createNotification(withdrawal.userId, {
      title: "Withdrawal Approved",
      message: `Your withdrawal of $${withdrawal.amount.toLocaleString()} via ${withdrawal.coin} has been approved and is being processed.`,
      type: "withdrawal",
    });

    await sendWithdrawalApprovedEmail({
      to: user.email,
      fullName: user.fullName,
      amount: withdrawal.amount,
      coin: withdrawal.coin,
      walletAddress: withdrawal.walletAddress,
    });
  }

  if (status === "rejected") {
    await createNotification(withdrawal.userId, {
      title: "Withdrawal Rejected",
      message: `Your withdrawal of $${withdrawal.amount.toLocaleString()} via ${withdrawal.coin} was rejected. Your balance has not been affected.`,
      type: "withdrawal",
    });

    await sendWithdrawalRejectedEmail({
      to: user.email,
      fullName: user.fullName,
      amount: withdrawal.amount,
      coin: withdrawal.coin,
    });
  }

  return NextResponse.json(withdrawal);
}