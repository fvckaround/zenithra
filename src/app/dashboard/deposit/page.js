"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, Copy, CheckCheck } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";
import { formatCurrency } from "@/lib/format";

export default function DepositPage() {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [step, setStep] = useState(1); // 1: select coin, 2: show address + confirm
  const [form, setForm] = useState({ amount: "", txHash: "" });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/deposit")
      .then((res) => { setWallets(res.wallets || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setIsSubmitting(true);
    try {
      await apiFetch("/api/deposit", {
        method: "POST",
        body: {
          amount: Number(form.amount),
          coin: selectedWallet.coin,
          walletAddress: selectedWallet.address,
          txHash: form.txHash,
        },
      });
      setStatus({
        type: "success",
        message: "Deposit submitted successfully! It will be credited once admin confirms your payment.",
      });
      setForm({ amount: "", txHash: "" });
      setStep(1);
      setSelectedWallet(null);
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
          Deposit Funds
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Send crypto to one of our wallets and submit your transaction hash for confirmation.
        </p>
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
        <p className="text-sm text-ink-muted">Loading wallets...</p>
      ) : wallets.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-8 text-center">
          <p className="text-sm text-ink-muted">No deposit wallets available yet. Please contact support.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6 space-y-6">

          {/* Step 1: Select coin */}
          <div>
            <p className="text-sm font-medium text-ink mb-3">
              Step 1 — Select a coin to deposit
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {wallets.map((w) => (
                <button
                  key={w._id}
                  onClick={() => { setSelectedWallet(w); setStep(2); setStatus({ type: null, message: "" }); }}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    selectedWallet?._id === w._id
                      ? "border-gold-500/50 bg-gold-500/5"
                      : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-xs font-bold text-gold-400">
                    {w.symbol}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{w.coin}</p>
                    {w.network && (
                      <p className="text-xs text-ink-faint">{w.network}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Show address + form */}
          {step === 2 && selectedWallet && (
            <div className="space-y-5 border-t border-white/5 pt-6">
              <p className="text-sm font-medium text-ink">
                Step 2 — Send {selectedWallet.coin} to this address
              </p>

              <div className="rounded-xl bg-navy-700/50 p-4">
                <p className="mb-2 text-xs text-ink-faint">
                  {selectedWallet.coin} {selectedWallet.network ? `(${selectedWallet.network})` : ""} Address
                </p>
                <div className="flex items-center gap-3">
                  <p className="flex-1 break-all text-sm font-mono text-gold-400">
                    {selectedWallet.address}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="flex-shrink-0 text-ink-muted hover:text-gold-400 transition-colors"
                  >
                    {copied ? <CheckCheck size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-amber-400/80">
                ⚠ Only send {selectedWallet.coin} to this address. Sending any other asset will result in permanent loss.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm font-medium text-ink">
                  Step 3 — Enter your deposit details
                </p>

                <div>
                  <label className="mb-2 block text-xs text-ink-muted">Amount (USD equivalent)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint">$</span>
                    <input
                      type="number"
                      min="100"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-white/10 bg-navy-800/60 py-3 pl-8 pr-4 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-gold-500/50"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-ink-faint">Minimum deposit: $100</p>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-ink-muted">Transaction Hash (optional but recommended)</label>
                  <input
                    type="text"
                    value={form.txHash}
                    onChange={(e) => setForm((p) => ({ ...p, txHash: e.target.value }))}
                    placeholder="Paste your transaction hash here"
                    className="w-full rounded-lg border border-white/10 bg-navy-800/60 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-gold-500/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !form.amount}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowDownToLine size={17} />
                  {isSubmitting ? "Submitting..." : "Submit Deposit"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl border border-white/5 bg-navy-800/30 p-5 text-xs text-ink-faint space-y-1">
        <p>• Deposits are manually reviewed and credited within 30 minutes to 2 hours.</p>
        <p>• Minimum deposit is $100. Contact support for large deposits above $50,000.</p>
        <p>• Always double-check the wallet address before sending.</p>
      </div>
    </div>
  );
}