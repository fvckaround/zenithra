"use client";

import { useEffect, useState } from "react";

const STATUS_STYLE = {
  pending:  "bg-amber-500/10 text-amber-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-red-500/10 text-red-400",
};

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/deposits")
      .then((r) => r.json())
      .then((data) => { setDeposits(data); setLoading(false); });
  }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/admin/deposits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setDeposits((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
  };

  const filtered = filter === "all" ? deposits : deposits.filter((d) => d.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Deposits</h1>
          <p className="mt-1 text-sm text-ink-muted">{deposits.length} total requests</p>
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
                  <th className="px-6 py-4">Tx Hash</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d._id} className="border-b border-white/5 last:border-0 hover:bg-navy-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{d.userName}</p>
                      <p className="text-xs text-ink-faint">{d.userEmail}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-ink">${d.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-ink-muted">{d.coin}</td>
                    <td className="px-6 py-4 text-ink-muted max-w-[120px] truncate">
                      {d.txHash || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[d.status]}`}>
                        {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {d.status === "pending" ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateStatus(d._id, "approved")}
                            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(d._id, "rejected")}
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
                      No deposits found.
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