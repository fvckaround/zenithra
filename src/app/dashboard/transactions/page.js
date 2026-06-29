"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { formatCurrency, formatDate } from "@/lib/format";

const FILTERS = ["All", "Deposit", "Withdrawal", "Earning", "Investment"];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    apiFetch("/api/transactions")
      .then((res) => setTransactions(res.transactions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "All"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          A complete history of your account activity.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              filter === f
                ? "bg-gold-500/10 text-gold-400"
                : "text-ink-muted hover:bg-navy-700/50 hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-navy-800/60">
        {loading ? (
          <p className="p-6 text-sm text-ink-faint">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-ink-faint">No transactions to show.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5 text-xs uppercase tracking-wider text-ink-faint">
              <tr>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const isCredit = tx.type === "Deposit" || tx.type === "Earning";
                const isDebit =
                  tx.type === "Withdrawal" || tx.type === "Investment";
                return (
                  <tr
                    key={tx.id}
                    className="border-b border-white/5 last:border-0 transition-colors hover:bg-navy-700/30"
                  >
                    <td className="px-6 py-4">
                      <p className="text-ink">{tx.type}</p>
                      {tx.note && (
                        <p className="text-xs text-ink-faint">{tx.note}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-ink-muted">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
                        {tx.status}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-medium ${
                        isCredit
                          ? "text-emerald-400"
                          : isDebit
                          ? "text-red-400"
                          : "text-ink"
                      }`}
                    >
                      {isDebit ? "-" : isCredit ? "+" : ""}
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
