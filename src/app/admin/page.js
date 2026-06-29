"use client";

import { useEffect, useState } from "react";
import { Users, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Clock } from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const cards = stats
    ? [
        { label: "Total Users",        value: stats.totalUsers,                          icon: Users },
        { label: "Total Deposited",    value: `$${stats.totalDeposits.toLocaleString()}`, icon: ArrowDownToLine },
        { label: "Total Withdrawn",    value: `$${stats.totalWithdrawals.toLocaleString()}`, icon: ArrowUpFromLine },
        { label: "Active Investments", value: stats.activeInvestments,                   icon: TrendingUp },
        { label: "Pending Actions",    value: stats.pendingDeposits + stats.pendingWithdrawals, icon: Clock },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
          Overview
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Platform snapshot in real time.
        </p>
      </div>

      {!stats ? (
        <p className="text-sm text-ink-muted">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/5 bg-navy-800/60 p-6"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-ink-muted">{card.label}</p>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
                  <card.icon size={17} strokeWidth={1.75} />
                </span>
              </div>
              <p className="mt-4 font-display text-3xl text-ink">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}