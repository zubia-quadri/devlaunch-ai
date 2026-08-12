"use client";

import { useState, useEffect } from "react";

const sections = [
  { id: "about",      label: "About" },
  { id: "projects",   label: "Projects" },
  { id: "skills",     label: "Skills" },
  { id: "highlights", label: "Highlights" },
  { id: "activity",   label: "Activity" },
  { id: "contact",    label: "Contact" },
];

export function PortfolioNav({ name }: { name: string }) {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Determine active section
      for (const s of [...sections].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActive(s.id);
          return;
        }
      }
      setActive("");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[hsl(var(--background)/0.85)] backdrop-blur-xl border-b border-[hsl(var(--border))] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
          {name}
        </span>
        <nav className="flex items-center gap-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active === s.id
                  ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
