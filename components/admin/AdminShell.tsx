"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import type { CurrentProfile } from "@/lib/cms/auth";

const THEME_STORAGE_KEY = "admin-theme";

export function AdminShell({
  profile,
  children,
}: {
  profile: CurrentProfile;
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so it can't be read in a lazy
    // useState initializer without mismatching the server-rendered HTML.
    // Setting state here, after mount, is the correct SSR-safe pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(localStorage.getItem(THEME_STORAGE_KEY) === "dark");
  }, []);

  function toggleDark() {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  }

  return (
    <div className={`${isDark ? "dark" : ""} w-full min-h-screen`}>
      {/* Fixed sidebar - positioned fixed, doesn't affect layout flow */}
      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      {/* Main content area - uses padding to offset for fixed sidebar */}
      <div className="flex flex-col h-full w-full pl-64">
        <Topbar
          profile={profile}
          isDark={isDark}
          onToggleDark={toggleDark}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}