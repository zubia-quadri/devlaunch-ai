"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";

interface GenerateBatchButtonProps {
  pendingCount: number;
}

export function GenerateBatchButton({ pendingCount }: GenerateBatchButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleBatch() {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/insights/batch", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStatus("success");
      setMessage(data.message ?? "Done!");
      startTransition(() => router.refresh());
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
    setTimeout(() => setStatus("idle"), 5000);
  }

  const isLoading = status === "loading" || isPending;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={handleBatch}
        disabled={isLoading || pendingCount === 0}
        id="batch-insights-btn"
        className="paper-btn-primary text-xs py-2 px-3.5 rounded-lg shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {isLoading
          ? "Analyzing…"
          : `Generate Insights (${pendingCount} pending)`}
      </button>
      {message && (
        <p className={`text-xs ${status === "success" ? "text-emerald-400" : "text-rose-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
