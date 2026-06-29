"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-navy-800/60 px-4 py-3 text-sm text-ink outline-none focus:border-gold-500/50 placeholder:text-ink-faint";

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">Platform configuration</p>
      </div>

      <div className="space-y-5 rounded-2xl border border-white/5 bg-navy-800/60 p-6">
        <p className="text-sm font-medium text-ink">Platform Info</p>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs text-ink-muted">Platform Name</label>
            <input className={inputClass} defaultValue="Zenithra Holding" />
          </div>
          <div>
            <label className="mb-2 block text-xs text-ink-muted">Support Email</label>
            <input className={inputClass} defaultValue="support@zenithra.com" />
          </div>
          <div>
            <label className="mb-2 block text-xs text-ink-muted">Minimum Withdrawal ($)</label>
            <input className={inputClass} type="number" defaultValue="100" />
          </div>
          <div>
            <label className="mb-2 block text-xs text-ink-muted">Withdrawal Fee (%)</label>
            <input className={inputClass} type="number" defaultValue="1.5" />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-400 transition-colors"
        >
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}