"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={`w-8 h-8 rounded-lg border border-[hsl(var(--border))] opacity-20 ${className ?? ""}`} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      id="theme-toggle"
      type="button"
      aria-label={isDark ? "Switch to paper light mode" : "Switch to obsidian dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative flex items-center justify-center w-8 h-8 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground)/0.3)] transition-all duration-150 active:scale-95 shadow-sm ${className ?? ""}`}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-neutral-700 transition-transform duration-200 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
