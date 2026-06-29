import { connectDB } from "@/lib/mongoose";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { settleEarnings } from "@/lib/accrual";
import Investment from "@/lib/models/Investment";
import Plan from "@/lib/models/Plan";
import Transaction from "@/lib/models/Transaction";
import { ok, fail } from "@/lib/api";
import { sendAdminNewInvestmentEmail } from "@/lib/emails";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    await settleEarnings(user);

    const [plans, investments] = await Promise.all([
      Plan.find({ isActive: true }).sort({ minDeposit: 1 }).lean(),
      Investment.find({ user: user._id }).sort({ createdAt: -1 }).lean(),
    ]);

    return ok({
      plans: plans.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        tagline: p.tagline,
        minDeposit: p.minDeposit,
        maxDeposit: p.maxDeposit,
        dailyRate: p.dailyRoi / 100,
        durationDays: p.durationDays,
        popular: false,
        features: p.features || [],
      })),
      investments: investments.map((inv) => {
        const elapsed = Math.floor(
          (Date.now() - new Date(inv.startDate)) / DAY_MS
        );
        const progress = Math.min(
          100,
          Math.round((elapsed / inv.durationDays) * 100)
        );
        return {
          id: inv._id.toString(),
          planId: inv.planId,
          planName: inv.planName,
          principal: inv.principal,
          dailyRate: inv.dailyRate,
          durationDays: inv.durationDays,
          earnedToDate: inv.earnedToDate,
          startDate: inv.startDate,
          maturityDate: inv.maturityDate,
          status: inv.status,
          progress,
        };
      }),
    });
  } catch (err) {
    console.error("investments GET error:", err);
    return fail("Failed to load investments", 500);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    await settleEarnings(user);

    const { planId, amount } = await request.json();

    const plan = await Plan.findById(planId).lean();
    if (!plan || !plan.isActive) return fail("Invalid or inactive plan");

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0)
      return fail("Enter a valid investment amount");

    const principal = +value.toFixed(2);
    if (principal < plan.minDeposit)
      return fail(`Minimum for ${plan.name} is $${plan.minDeposit.toLocaleString()}`);
    if (plan.maxDeposit && principal > plan.maxDeposit)
      return fail(`Maximum for ${plan.name} is $${plan.maxDeposit.toLocaleString()}`);
    if (principal > user.balance)
      return fail("Insufficient balance. Make a deposit first.");

    const dailyRate = plan.dailyRoi / 100;
    const startDate = new Date();
    const maturityDate = new Date(
      startDate.getTime() + plan.durationDays * DAY_MS
    );

    await Investment.create({
      user: user._id,
      planId: plan._id.toString(),
      planName: plan.name,
      principal,
      dailyRate,
      durationDays: plan.durationDays,
      startDate,
      maturityDate,
    });

    await Transaction.create({
      user: user._id,
      type: "Investment",
      amount: principal,
      status: "Completed",
      note: `${plan.name} plan subscription`,
    });

    user.balance = +(user.balance - principal).toFixed(2);
    user.totalInvested = +(user.totalInvested + principal).toFixed(2);
    await user.save();

    await sendAdminNewInvestmentEmail({
      fullName: user.fullName,
      email: user.email,
      planName: plan.name,
      amount: principal,
    });

    return ok({ user: publicUser(user) });
  } catch (err) {
    console.error("investments POST error:", err);
    return fail("Failed to start investment", 500);
  }
}