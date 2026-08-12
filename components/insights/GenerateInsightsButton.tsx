"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";

interface GenerateInsightsButtonProps {
  repoId: string;
  hasInsights: boolean;
  compact?: boolean;
}

export function GenerateInsightsButton({
  repoId,
  hasInsights,
  compact = false,
}: GenerateInsightsButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleGenerate() {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/insights/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      setStatus("success");
      setMessage("Insights generated!");
      startTransition(() => router.refresh());
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }

    setTimeout(() => setStatus("idle"), 5000);
  }

  const isLoading = status === "loading" || isPending;

  if (compact) {
    return (
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        title={hasInsights ? "Regenerate insights" : "Generate AI insights"}
        className="p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] hover:bg-[hsl(var(--accent))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : hasInsights ? (
          <RefreshCw className="w-3.5 h-3.5" />
        ) : (
          <Sparkles className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        id={`generate-insights-${repoId}`}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : hasInsights ? (
          <RefreshCw className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {isLoading
          ? "Generating…"
          : hasInsights
          ? "Regenerate Insights"
          : "Generate AI Insights"}
      </button>
      {message && (
        <p
          className={`text-xs ${
            status === "success" ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
