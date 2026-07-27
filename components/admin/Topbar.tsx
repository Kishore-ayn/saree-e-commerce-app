"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import { signOut } from "@/app/admin/logout/actions";
import type { CurrentProfile } from "@/lib/cms/auth";

export function Topbar({
  profile,
  isDark,
  onToggleDark,
  onOpenMobileNav,
}: {
  profile: CurrentProfile;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenMobileNav: () => void;
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-950">
      <button
        aria-label="Open menu"
        onClick={onOpenMobileNav}
        className="text-neutral-500 md:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-600 dark:text-neutral-300">
          {profile.email} <span className="text-neutral-400">({profile.role})</span>
        </span>
        <ThemeToggle isDark={isDark} onToggle={onToggleDark} />
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
