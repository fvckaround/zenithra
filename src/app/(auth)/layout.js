import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-navy-900">
      {/* Left branding panel - desktop only */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-navy-950 p-12 lg:flex">
        <div className="bg-grid-lines absolute inset-0 opacity-40" />
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-gold-500/10 blur-[120px]" />

        <Link
          href="/"
          className="relative z-10 font-display text-xl font-semibold tracking-wide text-ink"
        >
          ZENITHRA
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-3xl font-medium leading-tight text-ink">
            Secure access to{" "}
            <span className="italic text-gold-400">your portfolio.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Bank-grade encryption, cold-storage custody, and full
            transparency on every transaction.
          </p>
        </div>

        <p className="relative z-10 text-xs text-ink-faint">
          © {new Date().getFullYear()} Zenithra Holding. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 block text-center font-display text-xl font-semibold tracking-wide text-ink lg:hidden"
          >
            ZENITHRA
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}