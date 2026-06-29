"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-navy-800/60 px-4 py-3 text-sm text-ink outline-none focus:border-gold-500/50 placeholder:text-ink-faint";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-ink-muted">Platform configuration</p>
      </div>

      <PlatformInfoForm />
      <ChangePasswordForm />
    </div>
  );
}

function PlatformInfoForm() {
  const [form, setForm] = useState({
    platformName: "Zenithra Holding",
    supportEmail: "zenithraholding@outlook.com",
    minWithdrawal: "100",
    withdrawalFee: "1.5",
  });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to save");
      setStatus({ type: "success", message: "Settings saved successfully." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus({ type: null, message: "" }), 3000);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-white/5 bg-navy-800/60 p-6">
      <p className="text-sm font-medium text-ink">Platform Info</p>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs text-ink-muted">Platform Name</label>
          <input
            name="platformName"
            value={form.platformName}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs text-ink-muted">Support Email</label>
          <input
            name="supportEmail"
            value={form.supportEmail}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs text-ink-muted">
            Minimum Withdrawal ($)
          </label>
          <input
            name="minWithdrawal"
            type="number"
            value={form.minWithdrawal}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs text-ink-muted">
            Withdrawal Fee (%)
          </label>
          <input
            name="withdrawalFee"
            type="number"
            value={form.withdrawalFee}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {status.type && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {status.message}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-400 transition-colors disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (form.newPassword.length < 8) {
      return setStatus({ type: "error", message: "New password must be at least 8 characters" });
    }
    if (form.newPassword !== form.confirmPassword) {
      return setStatus({ type: "error", message: "Passwords do not match" });
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to change password");
      setStatus({ type: "success", message: "Password changed successfully." });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-white/5 bg-navy-800/60 p-6"
    >
      <p className="text-sm font-medium text-ink">Change Admin Password</p>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs text-ink-muted">Current Password</label>
          <input
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs text-ink-muted">New Password</label>
          <input
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="At least 8 characters"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs text-ink-muted">Confirm New Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter new password"
            required
            className={inputClass}
          />
        </div>
      </div>

      {status.type && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={saving || !form.currentPassword || !form.newPassword || !form.confirmPassword}
        className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-400 transition-colors disabled:opacity-60"
      >
        {saving ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}