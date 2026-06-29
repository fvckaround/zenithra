"use client";

import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

const PLANS = [
  {
    name: "Starter",
    tagline: "For first-time investors",
    minDeposit: "$500",
    maxDeposit: "$4,999",
    roi: "1.8%",
    roiPeriod: "daily",
    duration: "30 days",
    popular: false,
    features: [
      "Daily payouts",
      "Real-time portfolio tracking",
      "Standard email support",
      "Instant withdrawal requests",
    ],
  },
  {
    name: "Growth",
    tagline: "For serious, hands-on investors",
    minDeposit: "$5,000",
    maxDeposit: "$24,999",
    roi: "2.6%",
    roiPeriod: "daily",
    duration: "45 days",
    popular: true,
    features: [
      "Everything in Starter",
      "Automated daily compounding",
      "Dedicated account manager",
      "Priority withdrawal processing",
      "Quarterly strategy review",
    ],
  },
  {
    name: "Elite",
    tagline: "For institutional-grade capital",
    minDeposit: "$25,000",
    maxDeposit: "No limit",
    roi: "3.4%",
    roiPeriod: "daily",
    duration: "60 days",
    popular: false,
    features: [
      "Everything in Growth",
      "Private wallet allocation",
      "24/7 direct line to portfolio team",
      "Custom investment structuring",
      "Early access to new asset pools",
    ],
  },
];

export default function Plans() {
  return (
    <section id="plans" className="bg-navy-900 py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow="Investment Plans"
            title="Choose Your Growth Path"
            subtitle="Transparent terms, fixed returns, and flexible entry points — select the plan that matches your capital and goals."
          />
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={index * 0.1}>
              <PlanCard {...plan} />
            </ScrollReveal>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-ink-faint">
          Returns are illustrative and subject to market conditions. Past
          performance does not guarantee future results.
        </p>
      </Container>
    </section>
  );
}

function PlanCard({
  name,
  tagline,
  minDeposit,
  maxDeposit,
  roi,
  roiPeriod,
  duration,
  popular,
  features,
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl p-7 sm:p-8 ${
        popular
          ? "border border-gold-500/40 bg-navy-800 shadow-gold"
          : "border border-white/5 bg-navy-800/50"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 right-7 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-900">
          Most Popular
        </span>
      )}

      <h3 className="font-display text-xl font-medium text-ink">{name}</h3>
      <p className="mt-1 text-sm text-ink-muted">{tagline}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl text-gold-400">{roi}</span>
        <span className="text-sm text-ink-muted">/ {roiPeriod}</span>
      </div>
      <p className="mt-1 text-xs text-ink-faint">for {duration}</p>

      <div className="mt-6 flex items-center justify-between rounded-lg bg-navy-700/50 px-4 py-3 text-sm">
        <span className="text-ink-muted">Deposit range</span>
        <span className="font-medium text-ink">
          {minDeposit} – {maxDeposit}
        </span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check size={16} className="mt-0.5 flex-shrink-0 text-gold-500" />
            <span className="text-sm text-ink-muted">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        href="/signup"
        variant={popular ? "primary" : "secondary"}
        className="mt-8 w-full"
      >
        Invest in {name}
      </Button>
    </div>
  );
}