"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, Check } from "lucide-react";

const EMPTY = { coin: "", symbol: "", address: "", network: "", isActive: true };
const inputClass = "w-full rounded-lg border border-white/10 bg-navy-800/60 px-4 py-2.5 text-sm text-ink outline-none focus:border-gold-500/50 placeholder:text-ink-faint";

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/wallets")
      .then((r) => r.json())
      .then((data) => { setWallets(data); setLoading(false); });
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCreate = async () => {
    if (!form.coin || !form.symbol || !form.address) {
      return alert("Coin, symbol and address are required");
    }
    setSaving(true);
    const res = await fetch("/api/admin/wallets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newWallet = await res.json();
    setWallets((p) => [newWallet, ...p]);
    setForm(EMPTY);
    setShowForm(false);
    setSaving(false);
  };

  const toggleActive = async (wallet) => {
    const res = await fetch(`/api/admin/wallets/${wallet._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !wallet.isActive }),
    });
    const updated = await res.json();
    setWallets((p) => p.map((w) => (w._id === updated._id ? updated : w)));
  };

  const deleteWallet = async (id) => {
    if (!confirm("Delete this wallet?")) return;
    await fetch(`/api/admin/wallets/${id}`, { method: "DELETE" });
    setWallets((p) => p.filter((w) => w._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Wallets
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Deposit wallet addresses shown to users
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-400 transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Wallet"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-gold-500/20 bg-navy-800/60 p-6 space-y-4">
          <p className="text-sm font-medium text-ink">Add Deposit Wallet</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              className={inputClass}
              name="coin"
              placeholder="Coin name (e.g. Bitcoin)"
              value={form.coin}
              onChange={handleChange}
            />
            <input
              className={inputClass}
              name="symbol"
              placeholder="Symbol (e.g. BTC)"
              value={form.symbol}
              onChange={handleChange}
            />
            <input
              className={`${inputClass} sm:col-span-2`}
              name="address"
              placeholder="Wallet address"
              value={form.address}
              onChange={handleChange}
            />
            <input
              className={inputClass}
              name="network"
              placeholder="Network (e.g. TRC20, ERC20 — optional)"
              value={form.network}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-400 disabled:opacity-60 transition-colors"
            >
              <Check size={15} />
              {saving ? "Saving..." : "Add Wallet"}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY); }}
              className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-muted">Loading...</p>
      ) : wallets.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-10 text-center text-sm text-ink-faint">
          No wallets added yet. Add your first deposit wallet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-navy-800/60">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-ink-faint">
                  <th className="px-6 py-4">Coin</th>
                  <th className="px-6 py-4">Network</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((w) => (
                  <tr
                    key={w._id}
                    className="border-b border-white/5 last:border-0 hover:bg-navy-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{w.coin}</p>
                      <p className="text-xs text-ink-faint">{w.symbol}</p>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">{w.network || "—"}</td>
                    <td className="px-6 py-4 text-ink-muted max-w-[200px] truncate font-mono text-xs">
                      {w.address}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(w)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                          w.isActive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {w.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteWallet(w._id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}