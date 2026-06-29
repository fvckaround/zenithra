"use client";

import { useEffect, useState } from "react";

const TYPE_STYLE = {
  Deposit:    "bg-emerald-500/10 text-emerald-400",
  Withdrawal: "bg-red-500/10 text-red-400",
  Earning:    "bg-blue-500/10 text-blue-400",
  Investment: "bg-gold-500/10 text-gold-400",
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/transactions")
      .then((r) => r.json())
      .then((data) => { setTransactions(data); setLoading(false); });
  }, []);

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Transactions</h1>
          <p className="mt-1 text-sm text-ink-muted">{transactions.length} total transactions</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "Deposit", "Withdrawal", "Earning", "Investment"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-gold-500/10 text-gold-400"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-ink-muted">Loading...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-navy-800/60">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-ink-faint">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Note</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t._id} className="border-b border-white/5 last:border-0 hover:bg-navy-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{t.user?.fullName || "—"}</p>
                      <p className="text-xs text-ink-faint">{t.user?.email || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${TYPE_STYLE[t.type] || ""}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-ink">${t.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${
                        t.status === "Completed" ? "text-emerald-400" :
                        t.status === "Pending"   ? "text-amber-400"  :
                                                   "text-red-400"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink-muted max-w-[200px] truncate">{t.note || "—"}</td>
                    <td className="px-6 py-4 text-ink-muted">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-ink-faint">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}