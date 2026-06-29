"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/apiClient";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index, value) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanValue;
    setDigits(newDigits);
    setError("");
    if (cleanValue && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;
    const newDigits = Array(OTP_LENGTH).fill("");
    pasted.slice(0, OTP_LENGTH).split("").forEach((char, i) => {
      newDigits[i] = char;
    });
    setDigits(newDigits);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the full 6-digit code");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await apiFetch("/api/auth/verify-otp", {
        method: "POST",
        body: { email, code },
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    setError("");
    setResendSuccess(false);
    try {
      await apiFetch("/api/auth/resend-otp", {
        method: "POST",
        body: { email },
      });
      setSecondsLeft(RESEND_SECONDS);
      setResendSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
        Verify your email
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Enter the 6-digit code sent to{" "}
        <span className="font-medium text-ink">{email || "your email"}</span>
      </p>

      {resendSuccess && (
        <div className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          A new code has been sent to your email.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8">
        <div
          className="flex justify-between gap-2 sm:gap-3"
          onPaste={handlePaste}
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`h-14 w-full rounded-lg border text-center text-lg font-semibold text-ink outline-none transition-colors focus:border-gold-500/50 sm:h-16 ${
                error
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-white/10 bg-navy-800"
              }`}
            />
          ))}
        </div>

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          className="mt-8 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify Account"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Didn&apos;t receive a code?{" "}
        {secondsLeft > 0 ? (
          <span className="text-ink-faint">Resend in {secondsLeft}s</span>
        ) : (
          <button
            onClick={handleResend}
            className="font-medium text-gold-400 hover:text-gold-300"
          >
            Resend code
          </button>
        )}
      </p>

      <p className="mt-4 text-center text-sm text-ink-muted">
        <Link href="/signup" className="hover:text-gold-400">
          ← Back to sign up
        </Link>
      </p>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}