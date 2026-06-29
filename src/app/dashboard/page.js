"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
} from "lucide-react";
import { useUser } from "@/components/dashboard/UserContext";
import { apiFetch } from "@/lib/apiClient";
import { formatCurrency, formatDate } from "@/lib/format";

export default function DashboardOverviewPage() {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch("/api/dashboard")
      .then((res) => {
        if (active) setData(res);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const summary = data?.user || user;

  const stats = [
    {
      label: "Total Balance",
      value: formatCurrency(summary?.balance),
      sub: "Available to invest or withdraw",
      icon: Wallet,
    },
    {
      label: "Total Invested",
      value: formatCurrency(summary?.totalInvested),
      sub: "Active principal",
      icon: ArrowDownToLine,
    },
    {
      label: "Total Earnings",
      value: formatCurrency(summary?.totalEarnings),
      sub: "Lifetime returns",
      positive: (summary?.totalEarnings || 0) > 0,
      icon: TrendingUp,
    },
    {
      label: "Total Withdrawn",
      value: formatCurrency(summary?.totalWithdrawn),
      sub: "Across all withdrawals",
      icon: ArrowUpFromLine,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
          Portfolio Overview
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Here&apos;s how your investments are performing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PortfolioChart summary={summary} />
        </div>
        <div>
          <ActivePlan plan={data?.activePlan} loading={loading} />
        </div>
      </div>

      <RecentTransactions
        transactions={data?.recentTransactions || []}
        loading={loading}
      />
    </div>
  );
}

function StatCard({ label, value, sub, positive, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6">
      <div className="flex items-start justify-between">
        <p className="text-sm text-ink-muted">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
          <Icon size={17} strokeWidth={1.75} />
        </span>
      </div>
      <p className="mt-4 font-display text-2xl text-ink">{value}</p>
      {sub && (
        <p
          className={`mt-1 text-xs font-medium ${
            positive ? "text-emerald-400" : "text-ink-faint"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function PortfolioChart({ summary }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Portfolio Value</p>
        <span className="rounded-full bg-gold-500/10 px-3 py-1 text-xs text-gold-400">
          Live
        </span>
      </div>

      <p className="mt-4 font-display text-3xl text-ink">
        {formatCurrency(summary?.balance)}
      </p>
      <p className="mt-1 text-sm text-emerald-400">
        {formatCurrency(summary?.totalEarnings, { sign: true })} earned to date
      </p>

      <svg viewBox="0 0 500 120" className="mt-6 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="overviewFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,100 L50,95 L100,88 L150,80 L200,72 L250,60 L300,55 L350,40 L400,30 L450,18 L500,10 L500,120 L0,120 Z"
          fill="url(#overviewFill)"
        />
        <path
          d="M0,100 L50,95 L100,88 L150,80 L200,72 L250,60 L300,55 L350,40 L400,30 L450,18 L500,10"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p className="mt-4 text-center text-xs text-ink-faint">
        Growth shown is illustrative of your account&apos;s upward trajectory.
      </p>
    </div>
  );
}

function ActivePlan({ plan, loading }) {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-white/5 bg-navy-800/60 p-6 text-sm text-ink-faint">
        Loading…
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex h-full flex-col items-start justify-center rounded-2xl border border-gold-500/20 bg-navy-800/60 p-6">
        <p className="text-sm font-medium text-ink">No active plan</p>
        <p className="mt-2 text-xs text-ink-muted">
          Start an investment plan to begin earning daily returns.
        </p>
        <Link
          href="/dashboard/investments"
          className="mt-5 rounded-md bg-gold-500 px-4 py-2 text-xs font-semibold text-navy-900 transition-colors hover:bg-gold-400"
        >
          Browse plans
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gold-500/20 bg-navy-800/60 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Active Plan</p>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          Running
        </span>
      </div>

      <div className="mt-5">
        <p className="font-display text-2xl text-gold-400">{plan.planName}</p>
        <p className="mt-1 text-xs text-ink-muted">
          {(plan.dailyRate * 100).toFixed(1)}% daily · {plan.durationDays} day term
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <InfoRow label="Principal" value={formatCurrency(plan.principal)} />
        <InfoRow
          label="Earned so far"
          value={formatCurrency(plan.earnedToDate)}
          highlight
        />
        <InfoRow label="Start date" value={formatDate(plan.startDate)} />
        <InfoRow label="Matures" value={formatDate(plan.maturityDate)} />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs text-ink-muted">
          <span>Progress</span>
          <span>{plan.progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-navy-700">
          <div
            className="h-1.5 rounded-full bg-gold-500"
            style={{ width: `${plan.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-ink-faint">{label}</span>
      <span
        className={`text-xs font-medium ${
          highlight ? "text-emerald-400" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function RecentTransactions({ transactions, loading }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Recent Transactions</p>
        <Link
          href="/dashboard/transactions"
          className="text-xs text-gold-400 hover:text-gold-300"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-ink-faint">Loading…</p>
      ) : transactions.length === 0 ? (
        <p className="mt-5 text-sm text-ink-faint">
          No transactions yet. Make your first deposit to get started.
        </p>
      ) : (
        <div className="mt-5 space-y-1">
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TransactionRow({ tx }) {
  const isCredit = tx.type === "Deposit" || tx.type === "Earning";
  const isDebit = tx.type === "Withdrawal" || tx.type === "Investment";
  const amount = formatCurrency(tx.amount, { sign: isCredit });

  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-navy-700/40">
      <div>
        <p className="text-sm text-ink">{tx.type}</p>
        <p className="text-xs text-ink-faint">{formatDate(tx.date)}</p>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-medium ${
            isCredit ? "text-emerald-400" : isDebit ? "text-red-400" : "text-ink"
          }`}
        >
          {isDebit ? `-${formatCurrency(tx.amount)}` : amount}
        </p>
        <p className="text-xs text-ink-faint">{tx.status}</p>
      </div>
    </div>
  );
}
