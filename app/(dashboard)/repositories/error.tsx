"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("[Repositories Error]", error); }, [error]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-rose-400" />
      </div>
      <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-2">Couldn&apos;t load repositories</h2>
      <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm mb-6">{error.message || "Something went wrong fetching your repositories."}</p>
      <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-90 transition-opacity btn-magnetic">
        <RefreshCw className="w-4 h-4" /> Try again
      </button>
    </div>
  );
}
