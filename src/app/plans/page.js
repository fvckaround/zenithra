import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { Check } from "lucide-react";
import { connectDB } from "@/lib/mongoose";
import Plan from "@/lib/models/Plan";

async function getPlans() {
  await connectDB();
  const plans = await Plan.find({ isActive: true }).sort({ minDeposit: 1 }).lean();
  return plans;
}

export const metadata = {
  title: "Investment Plans | Zenithra Holding",
};

export default async function PlansPage() {
  const plans = await getPlans();

  return (
    <>
      <Navbar />
      <main className="bg-navy-900 pt-32 pb-20">
        <Container>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">
              Investment Plans
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
              Choose Your Growth Path
            </h1>
            <p className="mt-4 mx-auto max-w-xl text-sm text-ink-muted">
              Transparent terms, fixed returns, and flexible entry points —
              select the plan that matches your capital and goals.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <PlanCard
                key={plan._id.toString()}
                plan={plan}
                highlight={index === 1}
              />
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-white/5 bg-navy-800/60 p-8">
            <h2 className="font-display text-2xl font-medium text-ink text-center">
              How It Works
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Step
                number="01"
                title="Create an Account"
                description="Sign up in minutes and complete identity verification to unlock all features."
              />
              <Step
                number="02"
                title="Make a Deposit"
                description="Fund your account with Bitcoin, Ethereum, or USDT. Deposits are confirmed within 30 minutes."
              />
              <Step
                number="03"
                title="Earn Daily Returns"
                description="Choose a plan and watch your balance grow every day with automated compounding."
              />
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-ink-faint">
            Returns are illustrative and subject to market conditions. Past
            performance does not guarantee future results.
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}

function PlanCard({ plan, highlight }) {
  return (
    <div
      className={[
        "relative flex h-full flex-col rounded-2xl p-7 sm:p-8",
        highlight
          ? "border border-gold-500/40 bg-navy-800 shadow-gold"
          : "border border-white/5 bg-navy-800/50",
      ].join(" ")}
    >
      {highlight && (
        <span className="absolute -top-3 right-7 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-900">
          Most Popular
        </span>
      )}

      <h3 className="font-display text-xl font-medium text-ink">{plan.name}</h3>
      <p className="mt-1 text-sm text-ink-muted">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl text-gold-400">
          {plan.dailyRoi}%
        </span>
        <span className="text-sm text-ink-muted">/ daily</span>
      </div>
      <p className="mt-1 text-xs text-ink-faint">for {plan.durationDays} days</p>

      <div className="mt-6 flex items-center justify-between rounded-lg bg-navy-700/50 px-4 py-3 text-sm">
        <span className="text-ink-muted">Deposit range</span>
        <span className="font-medium text-ink">
          ${plan.minDeposit.toLocaleString()} –{" "}
          {plan.maxDeposit
            ? `$${plan.maxDeposit.toLocaleString()}`
            : "No limit"}
        </span>
      </div>

      {plan.features?.length > 0 && (
        <ul className="mt-6 flex-1 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Check size={16} className="mt-0.5 flex-shrink-0 text-gold-500" />
              <span className="text-sm text-ink-muted">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      <a
        href="/signup"
        className={[
          "mt-8 flex w-full items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-all",
          highlight
            ? "bg-gold-500 text-navy-900 hover:bg-gold-400"
            : "border border-ink/15 text-ink hover:border-gold-500/50 hover:text-gold-400",
        ].join(" ")}
      >
        Get Started
      </a>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div className="text-center">
      <p className="font-display text-4xl font-medium text-gold-500/30">
        {number}
      </p>
      <p className="mt-3 text-sm font-medium text-ink">{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-ink-muted">{description}</p>
    </div>
  );
}