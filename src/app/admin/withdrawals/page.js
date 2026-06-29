"use client";

import { useEffect, useState } from "react";

const STATUS_STYLE = {
  pending:  "bg-amber-500/10 text-amber-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-red-500/10 text-red-400",
};

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/withdrawals")
      .then((r) => r.json())
      .then((data) => { setWithdrawals(data); setLoading(false); });
  }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/admin/withdrawals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setWithdrawals((prev) => prev.map((w) => (w._id === updated._id ? updated : w)));
  };

  const filtered = filter === "all"
    ? withdrawals
    : withdrawals.filter((w) => w.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Withdrawals
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {withdrawals.length} total withdrawal requests
          </p>
        </div>
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
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
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Coin</th>
                  <th className="px-6 py-4">Wallet Address</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => (
                  <tr
                    key={w._id}
                    className="border-b border-white/5 last:border-0 hover:bg-navy-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{w.userName}</p>
                      <p className="text-xs text-ink-faint">{w.userEmail}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-ink">
                      ${w.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-ink-muted">{w.coin}</td>
                    <td className="px-6 py-4 text-ink-muted max-w-[140px] truncate font-mono text-xs">
                      {w.walletAddress}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[w.status]}`}>
                        {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">
                      {new Date(w.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {w.status === "pending" ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateStatus(w._id, "approved")}
                            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(w._id, "rejected")}
                            className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-ink-faint">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-ink-faint">
                      No withdrawals found.
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