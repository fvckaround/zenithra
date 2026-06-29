"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import FormInput, { Checkbox } from "@/components/auth/FormInput";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/apiClient";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || "";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.agreed) {
      newErrors.agreed = "You must agree to the Terms to continue";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setFormError("");
    setIsSubmitting(true);
    try {
      const res = await apiFetch("/api/auth/signup", {
        method: "POST",
        body: {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          referralCode: refCode,
        },
      });
      if (res.devCode) {
        sessionStorage.setItem("zenithra_dev_otp", res.devCode);
      }
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setFormError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Start investing with Zenithra in minutes.
      </p>

      {refCode && (
        <div className="mt-4 rounded-lg border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-sm text-gold-400">
          Referral code <span className="font-semibold">{refCode}</span> applied ✓
        </div>
      )}

      {formError && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <FormInput
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          error={errors.fullName}
        />

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
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          error={errors.password}
        />

        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          error={errors.confirmPassword}
        />

        <Checkbox
          name="agreed"
          checked={form.agreed}
          onChange={handleChange}
          error={errors.agreed}
          label={
            <>
              I agree to Zenithra Holding&apos;s{" "}
              <Link href="/terms" className="text-gold-400 hover:text-gold-300">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-gold-400 hover:text-gold-300">
                Privacy Policy
              </Link>
              .
            </>
          }
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-gold-400 hover:text-gold-300"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}