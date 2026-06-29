"use client";

import { useEffect, useState } from "react";

const STATUS_STYLE = {
  Active:    "bg-emerald-500/10 text-emerald-400",
  Matured:   "bg-blue-500/10 text-blue-400",
  Cancelled: "bg-red-500/10 text-red-400",
};

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/investments")
      .then((r) => r.json())
      .then((data) => { setInvestments(data); setLoading(false); });
  }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/admin/investments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setInvestments((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
  };

  const filtered =
    filter === "all" ? investments : investments.filter((i) => i.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Investments</h1>
          <p className="mt-1 text-sm text-ink-muted">{investments.length} total investments</p>
        </div>
        <div className="flex gap-2">
          {["all", "Active", "Matured", "Cancelled"].map((s) => (
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
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Principal</th>
                  <th className="px-6 py-4">Daily ROI</th>
                  <th className="px-6 py-4">Earned</th>
                  <th className="px-6 py-4">Matures</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv._id} className="border-b border-white/5 last:border-0 hover:bg-navy-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{inv.user?.fullName || "—"}</p>
                      <p className="text-xs text-ink-faint">{inv.user?.email || "—"}</p>
                    </td>
                    <td className="px-6 py-4 text-ink">{inv.planName}</td>
                    <td className="px-6 py-4 font-medium text-ink">${inv.principal.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gold-400">{inv.dailyRate}%</td>
                    <td className="px-6 py-4 text-emerald-400">${(inv.earnedToDate || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-ink-muted">
                      {new Date(inv.maturityDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {inv.status === "Active" ? (
                        <button
                          onClick={() => updateStatus(inv._id, "Cancelled")}
                          className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-xs text-ink-faint">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-ink-faint">
                      No investments found.
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