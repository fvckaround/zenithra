"use client";

import { useState, useRef } from "react";
import { ShieldCheck, ShieldAlert, Clock, Upload, X } from "lucide-react";
import { useUser } from "@/components/dashboard/UserContext";
import { apiFetch } from "@/lib/apiClient";
import { formatDate, initialsFrom } from "@/lib/format";

export default function ProfilePage() {
  const { user, setUser } = useUser();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Manage your account details and security.
        </p>
      </div>

      {/* Avatar + info */}
      <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-navy-800/60 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/15 font-display text-xl font-semibold text-gold-400">
          {initialsFrom(user?.fullName) || "ZH"}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-display text-lg text-ink">{user?.fullName}</p>
            <KycBadge status={user?.kycStatus} />
          </div>
          <p className="text-sm text-ink-muted">{user?.email}</p>
          <p className="mt-1 text-xs text-ink-faint">
            Member since {formatDate(user?.createdAt)}
          </p>
        </div>
      </div>

      <DetailsForm user={user} setUser={setUser} />
      <PasswordForm />
      <KycForm user={user} setUser={setUser} />
    </div>
  );
}

function KycBadge({ status }) {
  if (!status || status === "none") return null;
  const map = {
    pending:  { label: "KYC Pending",  color: "bg-amber-500/10 text-amber-400",   icon: Clock },
    approved: { label: "KYC Verified", color: "bg-emerald-500/10 text-emerald-400", icon: ShieldCheck },
    rejected: { label: "KYC Rejected", color: "bg-red-500/10 text-red-400",        icon: ShieldAlert },
  };
  const { label, color, icon: Icon } = map[status] || {};
  return (
    <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      <Icon size={11} />
      {label}
    </span>
  );
}

function KycForm({ user, setUser }) {
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const frontRef = useRef();
  const backRef = useRef();

  const handleFile = (side, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setStatus({ type: "error", message: "Only image files are accepted" });
    if (file.size > 5 * 1024 * 1024)
      return setStatus({ type: "error", message: "Each image must be under 5MB" });

    const url = URL.createObjectURL(file);
    if (side === "front") { setFrontFile(file); setFrontPreview(url); }
    else { setBackFile(file); setBackPreview(url); }
    setStatus({ type: null, message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!frontFile || !backFile)
      return setStatus({ type: "error", message: "Both front and back images are required" });

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const formData = new FormData();
      formData.append("frontImage", frontFile);
      formData.append("backImage", backFile);

      const res = await fetch("/api/kyc", { method: "POST", body: formData });
      const data = await res.json();

      if (!data.ok) throw new Error(data.error || "Failed to submit KYC");

      setUser(data.user);
      setStatus({ type: "success", message: "KYC submitted successfully! Admin will review within 24 hours." });
      setFrontFile(null); setBackFile(null);
      setFrontPreview(null); setBackPreview(null);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const kycStatus = user?.kycStatus || "none";

  return (
    <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6 space-y-5">
      <div>
        <p className="text-sm font-medium text-ink">Identity Verification (KYC)</p>
        <p className="mt-1 text-xs text-ink-muted">
          Upload a government-issued ID to verify your account and unlock higher limits.
        </p>
      </div>

      {kycStatus === "approved" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
          <ShieldCheck size={20} className="text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-400">Identity Verified</p>
            <p className="text-xs text-emerald-400/70">Your account is fully verified.</p>
          </div>
        </div>
      )}

      {kycStatus === "pending" && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
          <Clock size={20} className="text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-400">Verification Pending</p>
            <p className="text-xs text-amber-400/70">Admin is reviewing your documents. This usually takes up to 24 hours.</p>
          </div>
        </div>
      )}

      {kycStatus === "rejected" && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4">
          <ShieldAlert size={20} className="text-red-400" />
          <div>
            <p className="text-sm font-medium text-red-400">Verification Rejected</p>
            {user?.kycRejectedReason && (
              <p className="text-xs text-red-400/70">Reason: {user.kycRejectedReason}</p>
            )}
            <p className="text-xs text-red-400/70 mt-0.5">Please resubmit with clearer images.</p>
          </div>
        </div>
      )}

      {(kycStatus === "none" || kycStatus === "rejected") && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Front ID */}
            <div>
              <p className="mb-2 text-xs font-medium text-ink-muted">Front of ID</p>
              {frontPreview ? (
                <div className="relative">
                  <img src={frontPreview} alt="Front ID" className="h-40 w-full rounded-xl object-cover border border-white/10" />
                  <button
                    type="button"
                    onClick={() => { setFrontFile(null); setFrontPreview(null); }}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-navy-900/80 text-ink-muted hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => frontRef.current?.click()}
                  className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-navy-900/40 text-ink-muted transition-colors hover:border-gold-500/30 hover:text-gold-400"
                >
                  <Upload size={22} />
                  <span className="text-xs">Click to upload front</span>
                  <span className="text-[10px] text-ink-faint">JPG, PNG — max 5MB</span>
                </button>
              )}
              <input
                ref={frontRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile("front", e.target.files[0])}
              />
            </div>

            {/* Back ID */}
            <div>
              <p className="mb-2 text-xs font-medium text-ink-muted">Back of ID</p>
              {backPreview ? (
                <div className="relative">
                  <img src={backPreview} alt="Back ID" className="h-40 w-full rounded-xl object-cover border border-white/10" />
                  <button
                    type="button"
                    onClick={() => { setBackFile(null); setBackPreview(null); }}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-navy-900/80 text-ink-muted hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => backRef.current?.click()}
                  className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-navy-900/40 text-ink-muted transition-colors hover:border-gold-500/30 hover:text-gold-400"
                >
                  <Upload size={22} />
                  <span className="text-xs">Click to upload back</span>
                  <span className="text-[10px] text-ink-faint">JPG, PNG — max 5MB</span>
                </button>
              )}
              <input
                ref={backRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile("back", e.target.files[0])}
              />
            </div>
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

          <button
            type="submit"
            disabled={isSubmitting || !frontFile || !backFile}
            className="flex items-center gap-2 rounded-md bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShieldCheck size={16} />
            {isSubmitting ? "Submitting..." : "Submit for Verification"}
          </button>

          <p className="text-xs text-ink-faint">
            Accepted: Passport, National ID, Driver&apos;s License. Images must be clear and all corners visible.
          </p>
        </form>
      )}
    </div>
  );
}

function DetailsForm({ user, setUser }) {
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setIsSubmitting(true);
    try {
      const res = await apiFetch("/api/profile", {
        method: "PATCH",
        body: { fullName },
      });
      setUser(res.user);
      setStatus({ type: "success", message: "Profile updated." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/5 bg-navy-800/60 p-6"
    >
      <p className="text-sm font-medium text-ink">Account details</p>

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-muted">Full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-sm text-ink outline-none focus:border-gold-500/50"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-muted">Email address</label>
          <input
            value={user?.email || ""}
            readOnly
            className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-navy-900/50 px-4 py-3 text-sm text-ink-faint outline-none"
          />
        </div>
      </div>

      <StatusBanner status={status} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 rounded-md bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

function PasswordForm() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setIsSubmitting(true);
    try {
      await apiFetch("/api/profile", { method: "PATCH", body: form });
      setForm({ currentPassword: "", newPassword: "" });
      setStatus({ type: "success", message: "Password changed." });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/5 bg-navy-800/60 p-6"
    >
      <p className="text-sm font-medium text-ink">Change password</p>

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-muted">Current password</label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-sm text-ink outline-none focus:border-gold-500/50"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-muted">New password</label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
            placeholder="At least 8 characters"
            className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-sm text-ink outline-none focus:border-gold-500/50"
          />
        </div>
      </div>

      <StatusBanner status={status} />

      <button
        type="submit"
        disabled={isSubmitting || !form.currentPassword || !form.newPassword}
        className="mt-5 rounded-md border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-gold-500/50 hover:text-gold-400 disabled:opacity-60"
      >
        {isSubmitting ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

function StatusBanner({ status }) {
  if (!status.type) return null;
  return (
    <div className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
      status.type === "success"
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
        : "border-red-500/30 bg-red-500/10 text-red-400"
    }`}>
      {status.message}
    </div>
  );
}