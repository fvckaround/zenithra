"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/apiClient";
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Receipt,
  TrendingUp,
  Users,
  Bell,
  User,
  LogOut,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Deposit", href: "/dashboard/deposit", icon: ArrowDownToLine },
  { label: "Withdraw", href: "/dashboard/withdraw", icon: ArrowUpFromLine },
  { label: "Investments", href: "/dashboard/investments", icon: TrendingUp },
  { label: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { label: "Referrals", href: "/dashboard/referrals", icon: Users },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-4">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-gold-500/10 text-gold-400"
                : "text-ink-muted hover:bg-navy-700/50 hover:text-ink"
            }`}
          >
            <Icon size={18} strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore — clear client state regardless
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-navy-700/50 hover:text-red-400"
    >
      <LogOut size={18} strokeWidth={1.75} />
      Log Out
    </button>
  );
}

export default function Sidebar({ isMobileOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar - always visible */}
      <aside className="hidden h-screen w-64 flex-shrink-0 flex-col border-r border-white/5 bg-navy-950 lg:flex">
        <div className="flex h-20 items-center px-6">
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-wide text-ink"
          >
            ZENITHRA
          </Link>
        </div>

        <NavLinks pathname={pathname} />

        <div className="px-4 py-6">
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile sidebar - overlay drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-navy-950 lg:hidden"
            >
              <div className="flex h-20 items-center justify-between px-6">
                <Link
                  href="/"
                  onClick={onClose}
                  className="font-display text-xl font-semibold tracking-wide text-ink"
                >
                  ZENITHRA
                </Link>
                <button
                  onClick={onClose}
                  className="text-ink-muted"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <NavLinks pathname={pathname} onNavigate={onClose} />

              <div className="px-4 py-6">
                <LogoutButton />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}