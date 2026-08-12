"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Check, Globe, EyeOff } from "lucide-react";

interface Repo {
  id: string;
  name: string;
  language: string | null;
  stars: number;
}

interface PortfolioFormProps {
  initial: {
    headline: string | null;
    bio: string | null;
    email: string | null;
    linkedinUrl: string | null;
    twitterHandle: string | null;
    websiteUrl: string | null;
    isPublic: boolean;
    showEmail: boolean;
    showActivity: boolean;
    featuredRepoIds: string[];
    username: string;
  };
  repos: Repo[];
}

export function PortfolioForm({ initial, repos }: PortfolioFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    headline: initial.headline ?? "",
    bio: initial.bio ?? "",
    email: initial.email ?? "",
    linkedinUrl: initial.linkedinUrl ?? "",
    twitterHandle: initial.twitterHandle ?? "",
    websiteUrl: initial.websiteUrl ?? "",
    isPublic: initial.isPublic,
    showEmail: initial.showEmail,
    showActivity: initial.showActivity,
    featuredRepoIds: initial.featuredRepoIds,
  });

  function setField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleRepo(repoId: string) {
    setForm((prev) => {
      const already = prev.featuredRepoIds.includes(repoId);
      const next = already
        ? prev.featuredRepoIds.filter((id) => id !== repoId)
        : prev.featuredRepoIds.length < 6
        ? [...prev.featuredRepoIds, repoId]
        : prev.featuredRepoIds; // max 6
      return { ...prev, featuredRepoIds: next };
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");

    try {
      const res = await fetch("/api/settings/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setStatus("saved");
      startTransition(() => router.refresh());
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  const isSaving = status === "saving" || isPending;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Portfolio URL preview */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--accent)/0.4)]">
        <Globe className="w-4 h-4 text-[hsl(var(--primary))] shrink-0" />
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          Your portfolio URL:{" "}
          <span className="font-semibold text-[hsl(var(--foreground))]">
            {typeof window !== "undefined" ? window.location.origin : ""}/{initial.username}
          </span>
        </p>
      </div>

      {/* Visibility toggles */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
          Visibility
        </p>
        <Toggle
          id="isPublic"
          label="Public Portfolio"
          description="Make your portfolio visible to anyone with the link"
          checked={form.isPublic}
          onChange={(v) => setField("isPublic", v)}
          icon={Globe}
        />
        <Toggle
          id="showEmail"
          label="Show Email"
          description="Display your contact email on the portfolio"
          checked={form.showEmail}
          onChange={(v) => setField("showEmail", v)}
          icon={EyeOff}
        />
        <Toggle
          id="showActivity"
          label="Show GitHub Activity"
          description="Display the recent repository activity chart"
          checked={form.showActivity}
          onChange={(v) => setField("showActivity", v)}
          icon={Globe}
        />
      </div>

      {/* Headline */}
      <Field label="Headline" id="headline">
        <input
          id="headline"
          type="text"
          value={form.headline}
          onChange={(e) => setField("headline", e.target.value)}
          maxLength={160}
          placeholder="e.g. Full-Stack Engineer · Open Source Enthusiast"
          className={inputClass}
        />
        <p className="text-[10px] text-[hsl(var(--muted-foreground))] text-right mt-1">
          {form.headline.length}/160
        </p>
      </Field>

      {/* Bio */}
      <Field label="Portfolio Bio" id="portfolio-bio">
        <textarea
          id="portfolio-bio"
          value={form.bio}
          onChange={(e) => setField("bio", e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Tell recruiters and visitors about yourself…"
          className={`${inputClass} resize-none`}
        />
        <p className="text-[10px] text-[hsl(var(--muted-foreground))] text-right mt-1">
          {form.bio.length}/1000
        </p>
      </Field>

      {/* Contact links */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Contact Email" id="email">
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>
        <Field label="Website" id="websiteUrl">
          <input
            id="websiteUrl"
            type="url"
            value={form.websiteUrl}
            onChange={(e) => setField("websiteUrl", e.target.value)}
            placeholder="https://yoursite.com"
            className={inputClass}
          />
        </Field>
        <Field label="Twitter / X" id="portfolio-twitter">
          <div className="flex">
            <span className="flex items-center px-3 rounded-l-xl border border-r-0 border-[hsl(var(--border))] bg-[hsl(var(--accent))] text-xs text-[hsl(var(--muted-foreground))]">
              @
            </span>
            <input
              id="portfolio-twitter"
              type="text"
              value={form.twitterHandle}
              onChange={(e) => setField("twitterHandle", e.target.value)}
              maxLength={50}
              placeholder="username"
              className={`${inputClass} rounded-l-none`}
            />
          </div>
        </Field>
        <Field label="LinkedIn URL" id="portfolio-linkedin">
          <input
            id="portfolio-linkedin"
            type="url"
            value={form.linkedinUrl}
            onChange={(e) => setField("linkedinUrl", e.target.value)}
            placeholder="https://linkedin.com/in/..."
            className={inputClass}
          />
        </Field>
      </div>

      {/* Featured Repos */}
      {repos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
              Featured Repositories
            </p>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
              {form.featuredRepoIds.length}/6 selected
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {repos.map((repo) => {
              const selected = form.featuredRepoIds.includes(repo.id);
              const maxed = !selected && form.featuredRepoIds.length >= 6;
              return (
                <button
                  key={repo.id}
                  type="button"
                  onClick={() => !maxed && toggleRepo(repo.id)}
                  disabled={maxed}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150 ${
                    selected
                      ? "border-[hsl(var(--primary)/0.6)] bg-[hsl(var(--primary)/0.08)]"
                      : maxed
                      ? "border-[hsl(var(--border))] bg-[hsl(var(--card))] opacity-40 cursor-not-allowed"
                      : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.3)]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                      selected
                        ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]"
                        : "border-[hsl(var(--border))]"
                    }`}
                  >
                    {selected && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[hsl(var(--foreground))] truncate">
                      {repo.name}
                    </p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      {repo.language ?? "—"} · ★ {repo.stars}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Save row */}
      <div className="flex items-center justify-between pt-2">
        <div>
          {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
          {status === "saved" && !errorMsg && (
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Portfolio settings saved
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSaving}
          id="save-portfolio-btn"
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Saving…" : "Save Portfolio"}
        </button>
      </div>
    </form>
  );
}

function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon: React.ElementType;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-4 p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] cursor-pointer hover:border-[hsl(var(--primary)/0.3)] transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0" />
        <div>
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">{label}</p>
          <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{description}</p>
        </div>
      </div>
      <div className="relative shrink-0">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-9 h-5 rounded-full transition-colors duration-200 ${
            checked ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--border))]"
          }`}
        >
          <div
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
              checked ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </div>
      </div>
    </label>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground)/0.5)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.4)] focus:border-[hsl(var(--primary)/0.6)] transition-colors";
