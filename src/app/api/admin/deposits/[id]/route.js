import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Deposit from "@/lib/models/Deposit";
import User from "@/lib/models/User";
import Transaction from "@/lib/models/Transaction";
import { createNotification } from "@/lib/notify";
import {
  sendDepositApprovedEmail,
  sendDepositRejectedEmail,
  sendReferralBonusEmail,
} from "@/lib/emails";

const REFERRAL_BONUS_PERCENT = 5;

export async function PATCH(req, { params }) {
  const { id } = await params;
  await connectDB();
  const { status } = await req.json();

  const deposit = await Deposit.findByIdAndUpdate(id, { status }, { new: true });
  if (!deposit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (status === "approved") {
    const user = await User.findById(deposit.userId);
    user.balance = +(user.balance + deposit.amount).toFixed(2);
    user.totalInvested = +(user.totalInvested + deposit.amount).toFixed(2);
    await user.save();

    await Transaction.create({
      user: deposit.userId,
      type: "Deposit",
      amount: deposit.amount,
      status: "Completed",
      note: `Deposit of $${deposit.amount} via ${deposit.coin} approved`,
    });

    await createNotification(deposit.userId, {
      title: "Deposit Approved",
      message: `Your deposit of $${deposit.amount.toLocaleString()} via ${deposit.coin} has been approved and credited to your balance.`,
      type: "deposit",
    });

    await sendDepositApprovedEmail({
      to: user.email,
      fullName: user.fullName,
      amount: deposit.amount,
      coin: deposit.coin,
    });

    // Referral bonus
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        const bonus = +(deposit.amount * (REFERRAL_BONUS_PERCENT / 100)).toFixed(2);
        referrer.balance = +(referrer.balance + bonus).toFixed(2);
        referrer.totalEarnings = +(referrer.totalEarnings + bonus).toFixed(2);
        await referrer.save();

        await Transaction.create({
          user: referrer._id,
          type: "Earning",
          amount: bonus,
          status: "Completed",
          note: `Referral bonus (${REFERRAL_BONUS_PERCENT}%) from ${user.fullName}'s deposit`,
        });

        await createNotification(referrer._id, {
          title: "Referral Bonus Received",
          message: `You earned a $${bonus.toLocaleString()} referral bonus from ${user.fullName}'s deposit.`,
          type: "referral",
        });

        await sendReferralBonusEmail({
          to: referrer.email,
          fullName: referrer.fullName,
          bonus,
          referredName: user.fullName,
        });
      }
    }
  }

  if (status === "rejected") {
    const user = await User.findById(deposit.userId);

    await createNotification(deposit.userId, {
      title: "Deposit Rejected",
      message: `Your deposit of $${deposit.amount.toLocaleString()} via ${deposit.coin} was rejected. Please contact support.`,
      type: "deposit",
    });

    await sendDepositRejectedEmail({
      to: user.email,
      fullName: user.fullName,
      amount: deposit.amount,
      coin: deposit.coin,
    });
  }

  return NextResponse.json(deposit);
}