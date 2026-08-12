"use client";

import { useState, useTransition } from "react";
import { RefreshCw, Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface ImportButtonProps {
  hasRepos: boolean;
}

export function ImportButton({ hasRepos }: ImportButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleImport() {
    setStatus("loading");
    setMessage("");
    const endpoint = hasRepos ? "/api/github/sync" : "/api/github/import";

    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Import failed");

      setStatus("success");
      setMessage(
        hasRepos
          ? `Synced ${data.synced} repositories.`
          : `Imported ${data.imported} repositories!`
      );
      startTransition(() => router.refresh());
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }

    setTimeout(() => setStatus("idle"), 4000);
  }

  const isLoading = status === "loading" || isPending;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={handleImport}
        disabled={isLoading}
        id="import-repos-btn"
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:bg-[hsl(var(--primary)/0.85)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
      >
        {isLoading ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : hasRepos ? (
          <RefreshCw className="w-4 h-4" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {isLoading ? "Working…" : hasRepos ? "Sync Repos" : "Import Repos"}
      </button>
      {message && (
        <p
          className={`text-xs ${
            status === "success"
              ? "text-emerald-400"
              : status === "error"
              ? "text-rose-400"
              : "text-[hsl(var(--muted-foreground))]"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
