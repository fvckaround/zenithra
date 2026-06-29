"use client";

import { Menu } from "lucide-react";

export default function AdminTopbar({ onMenuClick }) {
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
        <p className="text-[10px] uppercase tracking-widest text-ink-faint">
          Admin Panel
        </p>
        <p className="font-display text-base text-ink">Zenithra Holding</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15 text-sm font-semibold text-gold-400">
        A
      </div>
    </header>
  );
}