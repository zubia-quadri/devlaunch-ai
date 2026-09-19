"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, GitFork, Sparkles, Settings,
  ArrowUpRight, LogOut, Globe, X, FileText,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const navItems = [
  { label: "dashboard",          href: "/dashboard",    icon: LayoutDashboard, badge: null },
  { label: "resume builder",     href: "/resume",       icon: FileText,        badge: "new" },
  { label: "repositories",       href: "/repositories", icon: GitFork,         badge: null },
  { label: "developer insights", href: "/skills",       icon: Sparkles,        badge: null },
  { label: "settings",           href: "/settings",     icon: Settings,        badge: null },
];

interface SidebarProps {
  username: string | null;
  name: string | null;
  image: string | null;
  portfolioUsername: string | null;
}

export function Sidebar({ username, name, image, portfolioUsername }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[hsl(var(--card))]">
      {/* Paper Logo & Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(var(--border))]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          {/* Paper Geometric Logo Mark */}
          <div className="w-6 h-6 rounded-md bg-[#81ACEC] flex items-center justify-center shadow-sm">
            <div className="w-2.5 h-2.5 bg-[hsl(var(--background))] rounded-[1.5px]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-[hsl(var(--foreground))]">buildfolio</span>
              <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">/studio</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 rounded-md text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 pb-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground)/0.8)]">
            workspace
          </p>
          <span className="font-mono text-[9px] text-[hsl(var(--muted-foreground)/0.6)]">v2.4</span>
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[hsl(var(--foreground))] text-[hsl(var(--background))] shadow-sm"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted)/0.6)] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              <item.icon className="w-3.5 h-3.5 shrink-0" />
              <span className="capitalize">{item.label}</span>
              {item.badge && !isActive && (
                <span className="ml-auto font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-[rgba(129,172,236,0.15)] text-[#4a77bf] dark:text-[#9ec2f7] border border-[rgba(129,172,236,0.3)]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Public Portfolio link */}
        {portfolioUsername && (
          <div className="pt-4 mt-3 border-t border-[hsl(var(--border))]">
            <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground)/0.8)]">
              published
            </p>
            <Link
              href={`/${portfolioUsername}`}
              target="_blank"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.6)] transition-all group border border-transparent hover:border-[hsl(var(--border))]"
            >
              <Globe className="w-3.5 h-3.5 text-[#81ACEC]" />
              <span>live portfolio</span>
              <ArrowUpRight className="w-3 h-3 ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        )}
      </nav>

      {/* Footer User Card */}
      <div className="p-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="flex items-center gap-2.5 p-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.5)]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name ?? "User"} className="w-6 h-6 rounded-md border border-[hsl(var(--border))] shrink-0" />
          ) : (
            <div className="w-6 h-6 rounded-md bg-[hsl(var(--muted))] border border-[hsl(var(--border))] shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[hsl(var(--foreground))] truncate">{name ?? username ?? "User"}</p>
            {username && <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] truncate">@{username}</p>}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
            className="p-1 rounded text-[hsl(var(--muted-foreground))] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile hidden trigger */}
      <button
        id="sidebar-mobile-trigger"
        className="hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      />

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] md:hidden shadow-2xl animate-fade-in-up">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

export function openMobileSidebar() {
  document.getElementById("sidebar-mobile-trigger")?.click();
}
