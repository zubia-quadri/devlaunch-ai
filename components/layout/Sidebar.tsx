"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, GitFork, Sparkles, Settings,
  Zap, ExternalLink, LogOut, Globe, X, Menu, FileText,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",          href: "/dashboard",    icon: LayoutDashboard, badge: null },
  { label: "Resume Builder",     href: "/resume",       icon: FileText,        badge: "NEW" },
  { label: "Repositories",       href: "/repositories", icon: GitFork,         badge: null },
  { label: "Developer Insights", href: "/skills",       icon: Sparkles,        badge: null },
  { label: "Settings",           href: "/settings",     icon: Settings,        badge: null },
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

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between gap-2.5 px-5 py-4 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg animated-border p-0.5 shrink-0">
            <div className="flex items-center justify-center w-full h-full rounded-md bg-[hsl(var(--card))]">
              <Zap className="w-4 h-4 text-[hsl(var(--primary))]" />
            </div>
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight gradient-text block">DevLaunch AI</span>
            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Career Platform</span>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          Platform
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]"
              }`} />
              {item.label}
              {item.badge && !isActive && (
                <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-violet-500/15 text-violet-400 border border-violet-500/20 tracking-wide">
                  {item.badge}
                </span>
              )}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />}
            </Link>
          );
        })}

        {/* Portfolio link */}
        {portfolioUsername && (
          <div className="pt-3 mt-3 border-t border-[hsl(var(--border))]">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
              Public
            </p>
            <Link
              href={`/${portfolioUsername}`}
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 transition-all duration-150 group"
            >
              <Globe className="w-4 h-4 shrink-0" />
              My Portfolio
              <ExternalLink className="w-3 h-3 ml-auto opacity-60 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        )}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-3 border-t border-[hsl(var(--border))]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[hsl(var(--accent)/0.5)]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name ?? "User"} className="w-7 h-7 rounded-full border border-[hsl(var(--border))] shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[hsl(var(--primary)/0.2)] shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[hsl(var(--foreground))] truncate">{name ?? username ?? "User"}</p>
            {username && <p className="text-[10px] text-[hsl(var(--muted-foreground))] truncate">@{username}</p>}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
            className="shrink-0 p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
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
      <aside className="hidden md:flex flex-col w-64 min-h-screen border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile: hamburger trigger (rendered by MobileHeader via context) */}
      {/* We expose a global open function via a custom event */}
      <button
        id="sidebar-mobile-trigger"
        className="hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      />

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] md:hidden animate-slide-in-left shadow-2xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

// Export trigger so MobileHeader can open it
export function openMobileSidebar() {
  document.getElementById("sidebar-mobile-trigger")?.click();
}
