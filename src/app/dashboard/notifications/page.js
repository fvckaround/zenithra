"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShieldCheck,
  Users,
  TrendingUp,
  Info,
  CheckCheck,
} from "lucide-react";
import { formatDate } from "@/lib/format";

const TYPE_ICON = {
  deposit:    ArrowDownToLine,
  withdrawal: ArrowUpFromLine,
  kyc:        ShieldCheck,
  referral:   Users,
  investment: TrendingUp,
  general:    Info,
};

const TYPE_COLOR = {
  deposit:    "bg-emerald-500/10 text-emerald-400",
  withdrawal: "bg-red-500/10 text-red-400",
  kyc:        "bg-blue-500/10 text-blue-400",
  referral:   "bg-gold-500/10 text-gold-400",
  investment: "bg-purple-500/10 text-purple-400",
  general:    "bg-navy-700 text-ink-muted",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    setMarking(true);
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setMarking(false);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            disabled={marking}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-ink-muted transition-colors hover:border-gold-500/30 hover:text-gold-400 disabled:opacity-60"
          >
            <CheckCheck size={14} />
            {marking ? "Marking..." : "Mark all read"}
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-ink-muted">Loading...</p>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-navy-800/60 py-16 text-center">
          <Bell size={32} className="text-ink-faint" />
          <p className="mt-4 text-sm font-medium text-ink">No notifications yet</p>
          <p className="mt-1 text-xs text-ink-faint">
            You&apos;ll be notified about deposits, withdrawals, and account activity here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = TYPE_ICON[n.type] || Info;
            const color = TYPE_COLOR[n.type] || TYPE_COLOR.general;
            return (
              <div
                key={n._id}
                className={`flex gap-4 rounded-2xl border p-5 transition-colors ${
                  n.isRead
                    ? "border-white/5 bg-navy-800/40"
                    : "border-gold-500/10 bg-navy-800/80"
                }`}
              >
                <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${color}`}>
                  <Icon size={17} strokeWidth={1.75} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.isRead ? "text-ink-muted" : "text-ink"}`}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gold-500" />
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                    {n.message}
                  </p>
                  <p className="mt-2 text-[10px] text-ink-faint">
                    {formatDate(n.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}