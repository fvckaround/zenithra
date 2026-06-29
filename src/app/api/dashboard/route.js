import { getCurrentUser, publicUser } from "@/lib/auth";
import { settleEarnings } from "@/lib/accrual";
import Investment from "@/lib/models/Investment";
import Transaction from "@/lib/models/Transaction";
import { ok, fail } from "@/lib/api";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    // Accrue any earnings due before reading balances.
    await settleEarnings(user);

    const activeInvestment = await Investment.findOne({
      user: user._id,
      status: "Active",
    }).sort({ createdAt: -1 });

    const recent = await Transaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    let activePlan = null;
    if (activeInvestment) {
      const elapsed = Math.floor(
        (Date.now() - activeInvestment.startDate.getTime()) / DAY_MS
      );
      const progress = Math.min(
        100,
        Math.round((elapsed / activeInvestment.durationDays) * 100)
      );
      activePlan = {
        planId: activeInvestment.planId,
        planName: activeInvestment.planName,
        principal: activeInvestment.principal,
        dailyRate: activeInvestment.dailyRate,
        durationDays: activeInvestment.durationDays,
        earnedToDate: activeInvestment.earnedToDate,
        startDate: activeInvestment.startDate,
        maturityDate: activeInvestment.maturityDate,
        progress,
      };
    }

    return ok({
      user: publicUser(user),
      activePlan,
      recentTransactions: recent.map((t) => ({
        id: t._id.toString(),
        type: t.type,
        amount: t.amount,
        status: t.status,
        date: t.createdAt,
      })),
    });
  } catch (err) {
    console.error("dashboard error:", err);
    return fail("Failed to load dashboard", 500);
  }
}
