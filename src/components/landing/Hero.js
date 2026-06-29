"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 pt-32 pb-20 sm:pt-40 lg:pt-48 lg:pb-32">
      <div className="bg-grid-lines absolute inset-0 opacity-60" />
      <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[120px]" />

      <Container className="relative grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
        {/* Left: copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-gold-500"
          >
            Digital Asset Investment
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl font-medium leading-[1.1] text-ink sm:text-6xl lg:text-7xl"
          >
            Wealth,
            <br />
            <span className="italic text-gold-400">Compounded.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-md text-base text-ink-muted sm:text-lg"
          >
            Zenithra Holding gives you secure, transparent access to
            high-yield crypto investment plans — built for investors who
            expect more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button href="/signup" variant="primary" className="w-full sm:w-auto">
              Start Investing
            </Button>
            <Button href="/plans" variant="secondary" className="w-full sm:w-auto">
              View Plans
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 text-xs uppercase tracking-wider text-ink-faint"
          >
            Cold-storage secured &nbsp;·&nbsp; $50M+ assets managed
            &nbsp;·&nbsp; 12,000+ investors
          </motion.p>
        </div>

        {/* Right: portfolio visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <PortfolioCard />
          <FloatingBadge />
        </motion.div>
      </Container>
    </section>
  );
}

function PortfolioCard() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-navy-800/80 p-6 shadow-gold backdrop-blur-xl sm:p-8">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-muted">Portfolio Overview</span>
        <span className="flex items-center gap-1.5 text-xs text-gold-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
          Live
        </span>
      </div>

      <div className="mt-5">
        <p className="font-display text-4xl text-ink">$284,392.18</p>
        <p className="mt-1 text-sm font-medium text-emerald-400">
          +12.4% this month
        </p>
      </div>

      <svg viewBox="0 0 300 80" className="mt-6 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 L30,55 L60,58 L90,40 L120,45 L150,30 L180,35 L210,18 L240,22 L270,8 L300,12 L300,80 L0,80 Z"
          fill="url(#chartFill)"
        />
        <path
          d="M0,60 L30,55 L60,58 L90,40 L120,45 L150,30 L180,35 L210,18 L240,22 L270,8 L300,12"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="mt-6 space-y-3 border-t border-white/5 pt-5">
        <HoldingRow symbol="BTC" name="Bitcoin" amount="1.842" change="+4.2%" positive />
        <HoldingRow symbol="ETH" name="Ethereum" amount="14.07" change="+6.8%" positive />
        <HoldingRow symbol="USDT" name="Tether" amount="42,180" change="0.0%" />
      </div>
    </div>
  );
}

function HoldingRow({ symbol, name, amount, change, positive }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-[10px] font-semibold text-gold-400">
          {symbol}
        </span>
        <div>
          <p className="text-sm text-ink">{name}</p>
          <p className="text-xs text-ink-faint">
            {amount} {symbol}
          </p>
        </div>
      </div>
      <span
        className={`text-xs font-medium ${
          positive ? "text-emerald-400" : "text-ink-faint"
        }`}
      >
        {change}
      </span>
    </div>
  );
}

function FloatingBadge() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-6 -left-6 hidden rounded-xl border border-white/10 bg-navy-800/90 px-5 py-3 shadow-gold-sm backdrop-blur-xl sm:block"
    >
      <p className="text-xs text-ink-muted">Today&apos;s Earnings</p>
      <p className="font-display text-lg text-gold-400">+$1,248.30</p>
    </motion.div>
  );
}