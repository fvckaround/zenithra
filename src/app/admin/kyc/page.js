"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, Clock, Eye, X } from "lucide-react";

const STATUS_STYLE = {
  pending:  "bg-amber-500/10 text-amber-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-red-500/10 text-red-400",
};

export default function AdminKycPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch("/api/admin/kyc")
      .then((r) => r.json())
      .then((data) => { setUsers(data); setLoading(false); });
  }, []);

  const updateStatus = async (id, status) => {
    setProcessing(true);
    const res = await fetch(`/api/admin/kyc/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reason }),
    });
    const updated = await res.json();
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? { ...u, ...updated } : u)));
    setSelected(null);
    setReason("");
    setProcessing(false);
  };

  const filtered = filter === "all" ? users : users.filter((u) => u.kycStatus === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">KYC Verification</h1>
          <p className="mt-1 text-sm text-ink-muted">{users.length} total submissions</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filter === s ? "bg-gold-500/10 text-gold-400" : "text-ink-muted hover:text-ink"
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
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id} className="border-b border-white/5 last:border-0 hover:bg-navy-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{u.fullName}</p>
                      <p className="text-xs text-ink-faint">{u.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLE[u.kycStatus]}`}>
                        {u.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelected(u)}
                        className="flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors"
                      >
                        <Eye size={14} /> Review
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-ink-faint">
                      No KYC submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-10">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-navy-800 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl text-ink">{selected.fullName}</h2>
                <p className="text-sm text-ink-muted">{selected.email}</p>
              </div>
              <button onClick={() => { setSelected(null); setReason(""); }} className="text-ink-muted hover:text-ink">
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-ink-faint">Front of ID</p>
                {selected.kycFrontImage ? (
                  <img
                    src={selected.kycFrontImage}
                    alt="Front ID"
                    className="w-full rounded-xl border border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-xl border border-white/5 bg-navy-900 text-xs text-ink-faint">
                    No image
                  </div>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs text-ink-faint">Back of ID</p>
                {selected.kycBackImage ? (
                  <img
                    src={selected.kycBackImage}
                    alt="Back ID"
                    className="w-full rounded-xl border border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-xl border border-white/5 bg-navy-900 text-xs text-ink-faint">
                    No image
                  </div>
                )}
              </div>
            </div>

            {selected.kycStatus === "pending" && (
              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-xs text-ink-muted">
                    Rejection reason (required if rejecting)
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Image is blurry, ID is expired..."
                    className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-2.5 text-sm text-ink outline-none focus:border-gold-500/50 placeholder:text-ink-faint"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateStatus(selected._id, "approved")}
                    disabled={processing}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-60 transition-colors"
                  >
                    <ShieldCheck size={15} />
                    {processing ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => updateStatus(selected._id, "rejected")}
                    disabled={processing || !reason}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60 transition-colors"
                  >
                    <ShieldAlert size={15} />
                    {processing ? "Processing..." : "Reject"}
                  </button>
                </div>
                <p className="text-xs text-ink-faint">Rejection reason is required before you can reject.</p>
              </div>
            )}

            {selected.kycStatus === "approved" && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                <ShieldCheck size={16} />
                This user is verified.
              </div>
            )}

            {selected.kycStatus === "rejected" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <p className="font-medium">Rejected</p>
                  {selected.kycRejectedReason && (
                    <p className="mt-1 text-xs">Reason: {selected.kycRejectedReason}</p>
                  )}
                </div>
                <button
                  onClick={() => updateStatus(selected._id, "approved")}
                  disabled={processing}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-60 transition-colors"
                >
                  <ShieldCheck size={15} />
                  {processing ? "Processing..." : "Approve Anyway"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}