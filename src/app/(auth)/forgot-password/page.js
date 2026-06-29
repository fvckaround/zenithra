"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormInput from "@/components/auth/FormInput";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/apiClient";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const res = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: { email },
      });
      // Dev: no email provider, so carry the reset code forward to the next page.
      if (res.devCode) {
        sessionStorage.setItem("zenithra_dev_reset", res.devCode);
      }
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
        Forgot your password?
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Enter your email and we&apos;ll send you a code to reset it.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          placeholder="you@example.com"
          error={error}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Code"}
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
