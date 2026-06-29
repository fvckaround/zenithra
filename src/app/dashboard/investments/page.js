"use client";

import { useEffect, useState, useCallback } from "react";
import { Check } from "lucide-react";
import { useUser } from "@/components/dashboard/UserContext";
import { apiFetch } from "@/lib/apiClient";
import { formatCurrency, formatDate } from "@/lib/format";

export default function InvestmentsPage() {
  const { user, setUser } = useUser();
  const [plans, setPlans] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch("/api/investments");
      setPlans(res.plans);
      setInvestments(res.investments);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSubscribed = (updatedUser) => {
    if (updatedUser) setUser(updatedUser);
    setSelectedPlan(null);
    load();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
          Investment Plans
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Put your balance to work. Available balance:{" "}
          <span className="font-medium text-gold-400">
            {formatCurrency(user?.balance)}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSelect={() => setSelectedPlan(plan)}
          />
        ))}
      </div>

      <div>
        <h2 className="font-display text-xl text-ink">Your Investments</h2>
        {loading ? (
          <p className="mt-4 text-sm text-ink-faint">Loading…</p>
        ) : investments.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-white/5 bg-navy-800/60 p-6 text-sm text-ink-faint">
            You have no investments yet. Choose a plan above to begin earning.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {investments.map((inv) => (
              <InvestmentRow key={inv.id} inv={inv} />
            ))}
          </div>
        )}
      </div>

      {selectedPlan && (
        <InvestModal
          plan={selectedPlan}
          balance={user?.balance || 0}
          onClose={() => setSelectedPlan(null)}
          onSubscribed={onSubscribed}
        />
      )}
    </div>
  );
}

function PlanCard({ plan, onSelect }) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl p-7 ${
        plan.popular
          ? "border border-gold-500/40 bg-navy-800 shadow-gold"
          : "border border-white/5 bg-navy-800/50"
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 right-7 rounded-full bg-gold-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-900">
          Most Popular
        </span>
      )}

      <h3 className="font-display text-xl font-medium text-ink">{plan.name}</h3>
      <p className="mt-1 text-sm text-ink-muted">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl text-gold-400">
          {(plan.dailyRate * 100).toFixed(1)}%
        </span>
        <span className="text-sm text-ink-muted">/ daily</span>
      </div>
      <p className="mt-1 text-xs text-ink-faint">for {plan.durationDays} days</p>

      <div className="mt-6 flex items-center justify-between rounded-lg bg-navy-700/50 px-4 py-3 text-sm">
        <span className="text-ink-muted">Deposit range</span>
        <span className="font-medium text-ink">
          {formatCurrency(plan.minDeposit).replace(".00", "")} –{" "}
          {plan.maxDeposit
            ? formatCurrency(plan.maxDeposit).replace(".00", "")
            : "No limit"}
        </span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check size={16} className="mt-0.5 flex-shrink-0 text-gold-500" />
            <span className="text-sm text-ink-muted">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`mt-8 w-full rounded-md px-6 py-3 text-sm font-semibold transition-all ${
          plan.popular
            ? "bg-gold-500 text-navy-900 shadow-gold-sm hover:bg-gold-400 hover:shadow-gold"
            : "border border-ink/15 text-ink hover:border-gold-500/50 hover:text-gold-400"
        }`}
      >
        Invest in {plan.name}
      </button>
    </div>
  );
}

function InvestmentRow({ inv }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-display text-lg text-ink">{inv.planName}</p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                inv.status === "Active"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : inv.status === "Matured"
                  ? "bg-gold-500/10 text-gold-400"
                  : "bg-navy-700 text-ink-faint"
              }`}
            >
              {inv.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            {(inv.dailyRate * 100).toFixed(1)}% daily · matures{" "}
            {formatDate(inv.maturityDate)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-faint">Principal</p>
          <p className="font-medium text-ink">{formatCurrency(inv.principal)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-faint">Earned</p>
          <p className="font-medium text-emerald-400">
            {formatCurrency(inv.earnedToDate)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-ink-muted">
          <span>Progress</span>
          <span>{inv.progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-navy-700">
          <div
            className="h-1.5 rounded-full bg-gold-500"
            style={{ width: `${inv.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function InvestModal({ plan, balance, onClose, onSubscribed }) {
  const [amount, setAmount] = useState(String(plan.minDeposit));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projected =
    (Number(amount) || 0) * plan.dailyRate * plan.durationDays;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await apiFetch("/api/investments", {
        method: "POST",
        body: { planId: plan.id, amount: Number(amount) },
      });
      onSubscribed(res.user);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-navy-800 p-6">
        <h3 className="font-display text-xl text-ink">Invest in {plan.name}</h3>
        <p className="mt-1 text-sm text-ink-muted">
          {(plan.dailyRate * 100).toFixed(1)}% daily for {plan.durationDays} days.
          Available balance: {formatCurrency(balance)}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-muted">
              Investment amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint">
                $
              </span>
              <input
                type="number"
                min={plan.minDeposit}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-navy-900 py-3 pl-8 pr-4 text-sm text-ink outline-none focus:border-gold-500/50"
              />
            </div>
            <p className="mt-1.5 text-xs text-ink-faint">
              Range: {formatCurrency(plan.minDeposit).replace(".00", "")} –{" "}
              {plan.maxDeposit
                ? formatCurrency(plan.maxDeposit).replace(".00", "")
                : "No limit"}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-navy-700/40 px-4 py-3 text-sm">
            <span className="text-ink-muted">Projected total earnings</span>
            <span className="font-medium text-emerald-400">
              {formatCurrency(projected, { sign: projected > 0 })}
            </span>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-ink/15 px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-gold-500/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-md bg-gold-500 px-4 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-60"
            >
              {isSubmitting ? "Investing..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
