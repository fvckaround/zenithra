"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Receipt,
  Settings,
  Wallet,
  ShieldCheck,
  X,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview",     href: "/admin",                icon: LayoutDashboard },
  { label: "Users",        href: "/admin/users",          icon: Users },
  { label: "KYC",          href: "/admin/kyc",            icon: ShieldCheck },
  { label: "Deposits",     href: "/admin/deposits",       icon: ArrowDownToLine },
  { label: "Withdrawals",  href: "/admin/withdrawals",    icon: ArrowUpFromLine },
  { label: "Investments",  href: "/admin/investments",    icon: TrendingUp },
  { label: "Transactions", href: "/admin/transactions",   icon: Receipt },
  { label: "Wallets",      href: "/admin/wallets",        icon: Wallet },
  { label: "Plans",        href: "/admin/plans",          icon: TrendingUp },
  { label: "Settings",     href: "/admin/settings",       icon: Settings },
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

function SidebarContent({ pathname, onNavigate, onClose }) {
  return (
    <>
      <div className="flex h-20 items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-wide text-ink"
        >
          ZENITHRA
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-ink-muted lg:hidden">
            <X size={22} />
          </button>
        )}
      </div>
      <p className="px-7 pb-4 text-[10px] uppercase tracking-widest text-ink-faint">
        Admin Panel
      </p>
      <NavLinks pathname={pathname} onNavigate={onNavigate} />
      <div className="px-4 py-6">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-navy-700/50 hover:text-red-400">
          <LogOut size={18} strokeWidth={1.75} />
          Log Out
        </button>
      </div>
    </>
  );
}

export default function AdminSidebar({ isMobileOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop */}
      <aside className="hidden h-screen w-64 flex-shrink-0 flex-col border-r border-white/5 bg-navy-950 lg:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
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
              <SidebarContent
                pathname={pathname}
                onNavigate={onClose}
                onClose={onClose}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}