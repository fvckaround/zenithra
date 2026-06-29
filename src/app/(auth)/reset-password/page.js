"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import FormInput from "@/components/auth/FormInput";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/apiClient";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [form, setForm] = useState({ code: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [devCode, setDevCode] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("zenithra_dev_reset");
    if (stored) setDevCode(stored);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.code.trim()) newErrors.code = "Enter the reset code";
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: { email, code: form.code.trim(), password: form.password },
      });
      sessionStorage.removeItem("zenithra_dev_reset");
      setIsDone(true);
    } catch (err) {
      setFormError(err.message);
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 size={22} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-medium text-ink sm:text-3xl">
          Password updated
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Your password has been changed successfully. You can now log in
          with your new password.
        </p>

        <Button
          variant="primary"
          className="mt-8 w-full"
          onClick={() => router.push("/login")}
        >
          Go to Log In
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
        Set a new password
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Enter the code sent to{" "}
        <span className="font-medium text-ink">{email || "your email"}</span> and
        choose a new password.
      </p>

      {devCode && (
        <div className="mt-5 rounded-lg border border-gold-500/30 bg-gold-500/5 px-4 py-3 text-xs text-ink-muted">
          <span className="font-medium text-gold-400">Dev mode:</span> your reset
          code is{" "}
          <span className="font-mono font-semibold text-ink">{devCode}</span>.
        </div>
      )}

      {formError && (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <FormInput
          label="Reset Code"
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="6-digit code"
          inputMode="numeric"
          error={errors.code}
        />

        <FormInput
          label="New Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          error={errors.password}
        />

        <FormInput
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your new password"
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        <Link href="/login" className="hover:text-gold-400">
          ← Back to log in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
