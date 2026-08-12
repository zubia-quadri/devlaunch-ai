"use client";

import { Zap, Menu } from "lucide-react";

export function MobileHeader() {
  function handleOpen() {
    document.getElementById("sidebar-mobile-trigger")?.click();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/0.95)] backdrop-blur-md md:hidden">
      <button
        onClick={handleOpen}
        aria-label="Open navigation menu"
        className="p-2 rounded-xl text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg animated-border p-0.5">
          <div className="flex items-center justify-center w-full h-full rounded-md bg-[hsl(var(--card))]">
            <Zap className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
          </div>
        </div>
        <span className="font-bold text-sm gradient-text">DevLaunch AI</span>
      </div>
    </header>
  );
}
