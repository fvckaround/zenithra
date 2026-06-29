"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Users, Gift } from "lucide-react";
import { useUser } from "@/components/dashboard/UserContext";
import { formatCurrency, formatDate } from "@/lib/format";

export default function ReferralsPage() {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const code = user?.referralCode || "—";
  const link =
    typeof window !== "undefined" && user?.referralCode
      ? `${window.location.origin}/signup?ref=${user.referralCode}`
      : "";

  useEffect(() => {
    fetch("/api/referrals")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
          Referrals
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Invite friends and earn a {" "}
          <span className="text-gold-400 font-medium">5% bonus</span>
          {" "} on their first deposit.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
            <Users size={18} />
          </span>
          <p className="mt-4 font-display text-2xl text-ink">
            {loading ? "—" : data?.referrals?.length || 0}
          </p>
          <p className="mt-1 text-xs text-ink-faint">Friends referred</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
            <Gift size={18} />
          </span>
          <p className="mt-4 font-display text-2xl text-ink">
            {loading ? "—" : formatCurrency(data?.totalBonus || 0)}
          </p>
          <p className="mt-1 text-xs text-ink-faint">Bonus earned</p>
        </div>
      </div>

      {/* Referral link */}
      <div className="rounded-2xl border border-gold-500/20 bg-navy-800/60 p-6">
        <p className="text-sm font-medium text-ink">Your referral code</p>
        <p className="mt-2 font-display text-3xl tracking-wider text-gold-400">
          {code}
        </p>

        <p className="mt-6 text-sm font-medium text-ink">Your referral link</p>
        <div className="mt-2 flex gap-2">
          <input
            readOnly
            value={link}
            className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-sm text-ink-muted outline-none"
          />
          <button
            onClick={copy}
            className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-gold-500 px-4 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Referred users list */}
      <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6">
        <p className="text-sm font-medium text-ink mb-4">Referred Users</p>
        {loading ? (
          <p className="text-sm text-ink-faint">Loading...</p>
        ) : !data?.referrals?.length ? (
          <p className="text-sm text-ink-faint">
            No referrals yet. Share your link to start earning.
          </p>
        ) : (
          <div className="space-y-3">
            {data.referrals.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-navy-700/40 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{r.fullName}</p>
                  <p className="text-xs text-ink-faint">{r.email}</p>
                </div>
                <p className="text-xs text-ink-faint">{formatDate(r.joinedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-white/5 bg-navy-800/30 p-5 text-xs text-ink-faint space-y-1">
        <p>• You earn 5% of every deposit made by users you refer.</p>
        <p>• Bonus is credited instantly when admin approves their deposit.</p>
        <p>• There is no limit on how many friends you can refer.</p>
      </div>
    </div>
  );
}