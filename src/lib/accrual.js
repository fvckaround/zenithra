import Investment from "./models/Investment";
import Transaction from "./models/Transaction";

const DAY_MS = 24 * 60 * 60 * 1000;

// Settle daily earnings for all of a user's active investments. Credits one
// "Earning" transaction (and balance/earnings bump) per whole day that has
// elapsed since the investment started, capped at the plan duration. Marks
// investments matured once fully accrued. Idempotent: re-running the same day
// produces no new earnings.
export async function settleEarnings(user) {
  const investments = await Investment.find({
    user: user._id,
    status: "Active",
  });

  let creditedTotal = 0;

  for (const inv of investments) {
    const elapsedDays = Math.floor((Date.now() - inv.startDate.getTime()) / DAY_MS);
    const accruableDays = Math.min(Math.max(elapsedDays, 0), inv.durationDays);

    const expectedEarned = +(inv.principal * inv.dailyRate * accruableDays).toFixed(2);
    const delta = +(expectedEarned - inv.earnedToDate).toFixed(2);

    if (delta > 0) {
      inv.earnedToDate = expectedEarned;
      creditedTotal += delta;

      await Transaction.create({
        user: user._id,
        type: "Earning",
        amount: delta,
        status: "Completed",
        note: `${inv.planName} plan daily earnings`,
      });
    }

    if (accruableDays >= inv.durationDays) {
      inv.status = "Matured";
    }

    if (delta > 0 || inv.isModified("status")) {
      await inv.save();
    }
  }

  if (creditedTotal > 0) {
    user.balance = +(user.balance + creditedTotal).toFixed(2);
    user.totalEarnings = +(user.totalEarnings + creditedTotal).toFixed(2);
    await user.save();
  }

  return creditedTotal;
}
