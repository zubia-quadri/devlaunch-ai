"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Check } from "lucide-react";

interface ProfileFormProps {
  initial: {
    name: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
    twitterHandle: string | null;
    linkedinUrl: string | null;
    email: string | null;
    image: string | null;
    githubUsername: string | null;
  };
}

export function ProfileForm({ initial }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: initial.name ?? "",
    bio: initial.bio ?? "",
    location: initial.location ?? "",
    website: initial.website ?? "",
    twitterHandle: initial.twitterHandle ?? "",
    linkedinUrl: initial.linkedinUrl ?? "",
  });

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");

    try {
      const res = await fetch("/api/settings/profile", {
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
    <form onSubmit={handleSave} className="space-y-5">
      {/* Avatar row */}
      <div className="flex items-center gap-4">
        {initial.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={initial.image}
            alt={initial.name ?? "Avatar"}
            className="w-14 h-14 rounded-full border-2 border-[hsl(var(--border))]"
          />
        )}
        <div>
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">
            {initial.name ?? "Your Name"}
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            @{initial.githubUsername}
            {initial.email && ` · ${initial.email}`}
          </p>
          <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">
            Avatar synced from GitHub
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Display Name" id="name">
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            maxLength={100}
            placeholder="Your full name"
            className={inputClass}
          />
        </Field>

        <Field label="Location" id="location">
          <input
            id="location"
            type="text"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            maxLength={100}
            placeholder="City, Country"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Bio" id="bio">
        <textarea
          id="bio"
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="A short bio that will appear on your public portfolio…"
          className={`${inputClass} resize-none`}
        />
        <p className="text-[10px] text-[hsl(var(--muted-foreground))] text-right mt-1">
          {form.bio.length}/500
        </p>
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Website" id="website">
          <input
            id="website"
            type="url"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="https://yoursite.com"
            className={inputClass}
          />
        </Field>

        <Field label="Twitter / X" id="twitterHandle">
          <div className="flex">
            <span className="flex items-center px-3 rounded-l-xl border border-r-0 border-[hsl(var(--border))] bg-[hsl(var(--accent))] text-xs text-[hsl(var(--muted-foreground))]">
              @
            </span>
            <input
              id="twitterHandle"
              type="text"
              value={form.twitterHandle}
              onChange={(e) => set("twitterHandle", e.target.value)}
              maxLength={50}
              placeholder="username"
              className={`${inputClass} rounded-l-none`}
            />
          </div>
        </Field>
      </div>

      <Field label="LinkedIn URL" id="linkedinUrl">
        <input
          id="linkedinUrl"
          type="url"
          value={form.linkedinUrl}
          onChange={(e) => set("linkedinUrl", e.target.value)}
          placeholder="https://linkedin.com/in/your-profile"
          className={inputClass}
        />
      </Field>

      {/* Save row */}
      <div className="flex items-center justify-between pt-2">
        {errorMsg && (
          <p className="text-xs text-rose-400">{errorMsg}</p>
        )}
        {status === "saved" && !errorMsg && (
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <Check className="w-3 h-3" /> Saved successfully
          </p>
        )}
        {status !== "saved" && !errorMsg && <span />}

        <button
          type="submit"
          disabled={isSaving}
          id="save-profile-btn"
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving…" : "Save Profile"}
        </button>
      </div>
    </form>
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
