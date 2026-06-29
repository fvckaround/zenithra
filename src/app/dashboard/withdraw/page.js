"use client";

import { useEffect, useState } from "react";
import { ArrowUpFromLine } from "lucide-react";
import { useUser } from "@/components/dashboard/UserContext";
import { apiFetch } from "@/lib/apiClient";
import { formatCurrency } from "@/lib/format";

export default function WithdrawPage() {
  const { user } = useUser();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ amount: "", coin: "", walletAddress: "" });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const balance = user?.balance || 0;

  useEffect(() => {
    apiFetch("/api/withdraw")
      .then((res) => { setWallets(res.wallets || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setIsSubmitting(true);
    try {
      await apiFetch("/api/withdraw", {
        method: "POST",
        body: {
          amount: Number(form.amount),
          coin: form.coin,
          walletAddress: form.walletAddress,
        },
      });
      setStatus({
        type: "success",
        message: "Withdrawal request submitted! Admin will process it within 24 hours.",
      });
      setForm({ amount: "", coin: "", walletAddress: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
          Withdraw Funds
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Submit a withdrawal request. Admin will process and send to your wallet within 24 hours.
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6 space-y-6">
        <div className="flex items-center justify-between rounded-xl bg-navy-700/40 px-5 py-4">
          <span className="text-sm text-ink-muted">Available balance</span>
          <span className="font-display text-xl text-gold-400">
            {formatCurrency(balance)}
          </span>
        </div>

        {status.type && (
          <div className={`rounded-lg border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}>
            {status.message}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-ink-muted">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs text-ink-muted">Select Coin</label>
              <select
                value={form.coin}
                onChange={(e) => setForm((p) => ({ ...p, coin: e.target.value }))}
                required
                className="w-full rounded-lg border border-white/10 bg-navy-800/60 px-4 py-3 text-sm text-ink outline-none focus:border-gold-500/50"
              >
                <option value="">-- Select a coin --</option>
                {wallets.map((w) => (
                  <option key={w._id} value={w.coin}>
                    {w.coin} {w.network ? `(${w.network})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs text-ink-muted">Your Wallet Address</label>
              <input
                type="text"
                value={form.walletAddress}
                onChange={(e) => setForm((p) => ({ ...p, walletAddress: e.target.value }))}
                placeholder="Enter your receiving wallet address"
                required
                className="w-full rounded-lg border border-white/10 bg-navy-800/60 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-gold-500/50"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs text-ink-muted">Amount (USD)</label>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, amount: String(balance) }))}
                  className="text-xs text-gold-400 hover:text-gold-300"
                >
                  Withdraw max
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint">$</span>
                <input
                  type="number"
                  min="50"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="0.00"
                  required
                  className="w-full rounded-lg border border-white/10 bg-navy-800/60 py-3 pl-8 pr-4 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-gold-500/50"
                />
              </div>
              <p className="mt-1 text-xs text-ink-faint">Minimum withdrawal: $50</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !form.amount || !form.coin || !form.walletAddress || balance <= 0}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowUpFromLine size={17} />
              {isSubmitting ? "Submitting..." : "Request Withdrawal"}
            </button>
          </form>
        )}
      </div>

      <div className="rounded-xl border border-white/5 bg-navy-800/30 p-5 text-xs text-ink-faint space-y-1">
        <p>• Withdrawals are processed within 24 hours after admin approval.</p>
        <p>• Minimum withdrawal is $50.</p>
        <p>• Double-check your wallet address — transactions cannot be reversed.</p>
      </div>
    </div>
  );
}