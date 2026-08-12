"use client";
import { useEffect } from "react";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("[Portfolio Error]", error); }, [error]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[hsl(var(--background))]">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-rose-400" />
      </div>
      <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-2">Portfolio unavailable</h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm mb-6">This portfolio could not be loaded. It may be private or the username may not exist.</p>
      <Link href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
        <Home className="w-4 h-4" /> Go Home
      </Link>
    </div>
  );
}
