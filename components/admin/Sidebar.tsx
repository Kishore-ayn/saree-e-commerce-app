"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { adminNavItems } from "@/lib/cms/admin-nav";
import { cn } from "@/lib/utils";

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop - only shown when sidebar is open on mobile */ }
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar - fixed on desktop, overlay on mobile */ }
      <aside
        className={cn(
          "flex flex-col min-h-screen w-64 shrink-0 border-r border-neutral-200 bg-white transition-transform dark:border-neutral-800 dark:bg-neutral-950",
          // Positioning
          "fixed left-0",
          // Height
          "min-h-screen",
          // Mobile: full height coverage
          "inset-y-0",
          // Mobile transform for open/close state
          !open && "-translate-x-full",
          open && "translate-x-0",
          // Desktop: always visible (override mobile transform)
          "md:translate-x-0",
          // Ensure it's above content
          "z-40"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800 shrink-0 bg-white dark:bg-neutral-950 sticky top-0 z-20">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Admin
          </span>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="text-neutral-500 md:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 p-3 pt-4">
          {adminNavItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
