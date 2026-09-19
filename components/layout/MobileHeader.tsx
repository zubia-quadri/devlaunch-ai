"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function MobileHeader() {
  function handleOpen() {
    document.getElementById("sidebar-mobile-trigger")?.click();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-13 border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/0.9)] backdrop-blur-md md:hidden">
      <div className="flex items-center gap-2.5">
        <button
          onClick={handleOpen}
          aria-label="Open navigation menu"
          className="p-1.5 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#81ACEC] flex items-center justify-center shadow-xs">
            <div className="w-2 h-2 bg-[hsl(var(--background))] rounded-[1px]" />
          </div>
          <span className="font-semibold text-xs tracking-tight text-[hsl(var(--foreground))]">buildfolio</span>
        </div>
      </div>

      <ThemeToggle />
    </header>
  );
}
