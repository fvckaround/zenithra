"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import FormInput from "@/components/auth/FormInput";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/apiClient";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
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
    const data = await apiFetch("/api/auth/login", { method: "POST", body: form });
    router.refresh();
    if (data.isAdmin) {
      router.push("/admin");
    } else {
      router.push(nextPath);
    }
  } catch (err) {
    if (err.data?.needsVerification) {
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
      return;
    }
    setFormError(err.message);
    setIsSubmitting(false);
  }
};

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Log in to access your portfolio.
      </p>

      {formError && (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email}
        />

        <FormInput
          label="Password"
          labelAction={
            <Link
              href="/forgot-password"
              className="text-xs text-gold-400 hover:text-gold-300"
            >
              Forgot password?
            </Link>
          }
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-gold-400 hover:text-gold-300">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}