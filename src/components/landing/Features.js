"use client";

import {
  ShieldCheck,
  Globe2,
  Zap,
  LineChart,
  Lock,
  Headphones,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Cold-Storage Security",
    description:
      "98% of assets are held in offline, multi-signature cold storage, protected by institutional-grade encryption.",
  },
  {
    icon: Globe2,
    title: "Multi-Chain Support",
    description:
      "Deposit and invest across Bitcoin, Ethereum, and major stablecoins with zero network friction.",
  },
  {
    icon: Zap,
    title: "Instant Transactions",
    description:
      "Deposits are credited in minutes. Withdrawals are processed instantly for verified accounts, 24/7.",
  },
  {
    icon: LineChart,
    title: "Automated Compounding",
    description:
      "Your returns are automatically reinvested daily, so your portfolio grows without manual intervention.",
  },
  {
    icon: Lock,
    title: "Transparent Returns",
    description:
      "Track every deposit, payout, and projection in real time — no hidden fees, no fine print.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Premium and Elite investors get a direct line to an account manager for portfolio guidance.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-navy-900 py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="Why Zenithra"
            title="Crafted for Serious Investors"
            subtitle="Every feature is built to give you security, clarity, and consistent growth — without the complexity."
          />
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 0.08}>
              <FeatureCard {...feature} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group h-full rounded-2xl border border-white/5 bg-navy-800/60 p-7 transition-colors duration-300 hover:border-gold-500/30 hover:bg-navy-800">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 transition-colors duration-300 group-hover:bg-gold-500/20">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 font-display text-lg font-medium text-ink">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
    </div>
  );
}