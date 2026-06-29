import { getCurrentUser } from "@/lib/auth";
import { settleEarnings } from "@/lib/accrual";
import Transaction from "@/lib/models/Transaction";
import { ok, fail } from "@/lib/api";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Not authenticated", 401);

    await settleEarnings(user);

    const txns = await Transaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return ok({
      transactions: txns.map((t) => ({
        id: t._id.toString(),
        type: t.type,
        amount: t.amount,
        status: t.status,
        note: t.note,
        date: t.createdAt,
      })),
    });
  } catch (err) {
    console.error("transactions error:", err);
    return fail("Failed to load transactions", 500);
  }
}
