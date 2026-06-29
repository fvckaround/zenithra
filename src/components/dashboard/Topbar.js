"use client";

import { useEffect, useState } from "react";
import { Menu, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Topbar({ onMenuClick }) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => setUnreadCount(data.unreadCount || 0))
      .catch(() => {});
  }, []);

  const handleBellClick = () => {
    setUnreadCount(0);
    router.push("/dashboard/notifications");
  };

  return (
    <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-white/5 bg-navy-900 px-5 sm:px-8">
      <button
        onClick={onMenuClick}
        className="text-ink lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-ink-muted">Welcome back,</p>
        <p className="font-display text-base text-ink">Investor</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleBellClick}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-navy-800 hover:text-gold-400"
          aria-label="Notifications"
        >
          <Bell size={19} />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[9px] font-bold text-navy-900">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15 text-sm font-semibold text-gold-400">
          JD
        </div>
      </div>
    </header>
  );
}