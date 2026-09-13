"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  User, MapPin, Globe, AtSign, Link2, Save,
  Check, AlertCircle, LayoutTemplate,
  Star, Mail, Sparkles,
} from "lucide-react";

// ── Floating-label input ─────────────────────────────────────
function FloatInput({
  id, label, value, onChange, type = "text", placeholder, icon: Icon,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; icon?: React.ElementType;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const raised = focused || hasValue;

  return (
    <div className="relative group">
      <div className="relative flex items-center">
        {Icon && (
          <Icon
            className={`absolute left-3.5 w-4 h-4 shrink-0 transition-colors duration-200 ${
              raised ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]"
            }`}
          />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=" "
          className={`peer w-full rounded-xl border bg-[hsl(var(--card))] text-sm text-[hsl(var(--foreground))] placeholder-transparent transition-all duration-200 outline-none
            ${Icon ? "pl-10 pr-4 pt-5 pb-2" : "pl-4 pr-4 pt-5 pb-2"}
            ${focused
              ? "border-[hsl(var(--primary)/0.6)] shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
              : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)]"
            }`}
        />
        {/* Floating label */}
        <label
          htmlFor={id}
          className={`absolute transition-all duration-200 pointer-events-none select-none
            ${Icon ? "left-10" : "left-4"}
            ${raised
              ? "top-2 text-[10px] font-semibold text-[hsl(var(--primary))] uppercase tracking-wide"
              : "top-1/2 -translate-y-1/2 text-sm text-[hsl(var(--muted-foreground))]"
            }`}
        >
          {label}
        </label>
      </div>
    </div>
  );
}

// ── Floating-label textarea ──────────────────────────────────
function FloatTextarea({ id, label, value, onChange }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;

  return (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={3}
        placeholder=" "
        className={`peer w-full rounded-xl border bg-[hsl(var(--card))] text-sm text-[hsl(var(--foreground))] placeholder-transparent resize-none transition-all duration-200 outline-none pl-4 pr-4 pt-6 pb-3
          ${focused
            ? "border-[hsl(var(--primary)/0.6)] shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
            : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)]"
          }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none select-none
          ${raised
            ? "top-2 text-[10px] font-semibold text-[hsl(var(--primary))] uppercase tracking-wide"
            : "top-4 text-sm text-[hsl(var(--muted-foreground))]"
          }`}
      >
        {label}
      </label>
      <span className="absolute bottom-2 right-3 text-[10px] text-[hsl(var(--muted-foreground))]">
        {value.length}/300
      </span>
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────
function Toggle({ checked, onChange, label, description }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[hsl(var(--border)/0.5)] last:border-0">
      <div>
        <p className="text-sm font-medium text-[hsl(var(--foreground))]">{label}</p>
        {description && <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.5)] focus:ring-offset-2 focus:ring-offset-[hsl(var(--background))]
          ${checked
            ? "bg-gradient-to-r from-[hsl(var(--primary))] to-violet-500 shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
            : "bg-[hsl(var(--accent))]"
          }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300
            ${checked ? "left-6" : "left-1"}`}
        />
      </button>
    </div>
  );
}

// ── Repo checkbox ─────────────────────────────────────────────
function RepoCheck({ id, name, language, stars, checked, onChange }: {
  id: string; name: string; language: string | null; stars: number;
  checked: boolean; onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`group w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200
        ${checked
          ? "border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--primary)/0.06)] shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
          : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.25)] hover:bg-[hsl(var(--accent)/0.5)]"
        }`}
    >
      <div className={`flex items-center justify-center w-5 h-5 rounded-md border-2 shrink-0 transition-all duration-200
        ${checked
          ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]"
          : "border-[hsl(var(--border))]"
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[hsl(var(--foreground))] truncate">{name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {language && (
            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{language}</span>
          )}
          <span className="flex items-center gap-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
            <Star className="w-2.5 h-2.5" />{stars}
          </span>
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Settings Client Component
// ─────────────────────────────────────────────────────────────

export type ProfileInitial = {
  name: string | null; bio: string | null; location: string | null;
  website: string | null; twitterHandle: string | null; linkedinUrl: string | null;
  email: string | null; image: string | null; githubUsername: string | null;
  phone: string | null; education: string | null; currentRole: string | null;
};

export type PortfolioInitial = {
  headline: string | null; bio: string | null; email: string | null;
  linkedinUrl: string | null; twitterHandle: string | null; websiteUrl: string | null;
  isPublic: boolean; showEmail: boolean; showActivity: boolean;
  featuredRepoIds: string[]; username: string;
};

export type RepoOption = { id: string; name: string; language: string | null; stars: number };

interface SettingsClientProps {
  profile: ProfileInitial;
  portfolio: PortfolioInitial;
  repos: RepoOption[];
}

type Tab = "profile" | "portfolio";
type SaveStatus = "idle" | "saving" | "saved" | "error";

export function SettingsClient({ profile, portfolio, repos }: SettingsClientProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");

  // Profile state
  const [name, setName]                 = useState(profile.name ?? "");
  const [bio, setBio]                   = useState(profile.bio ?? "");
  const [location, setLocation]         = useState(profile.location ?? "");
  const [website, setWebsite]           = useState(profile.website ?? "");
  const [twitter, setTwitter]           = useState(profile.twitterHandle ?? "");
  const [linkedin, setLinkedin]       = useState(profile.linkedinUrl ?? "");
  const [phone, setPhone]             = useState(profile.phone ?? "");
  const [education, setEducation]     = useState(profile.education ?? "");
  const [currentRole, setCurrentRole] = useState(profile.currentRole ?? "");

  // Portfolio state
  const [headline, setHeadline]         = useState(portfolio.headline ?? "");
  const [portBio, setPortBio]           = useState(portfolio.bio ?? "");
  const [portEmail, setPortEmail]       = useState(portfolio.email ?? "");
  const [portTwitter, setPortTwitter]   = useState(portfolio.twitterHandle ?? "");
  const [portLinkedin, setPortLinkedin] = useState(portfolio.linkedinUrl ?? "");
  const [portWebsite, setPortWebsite]   = useState(portfolio.websiteUrl ?? "");
  const [isPublic, setIsPublic]         = useState(portfolio.isPublic);
  const [showEmail, setShowEmail]       = useState(portfolio.showEmail);
  const [showActivity, setShowActivity] = useState(portfolio.showActivity);
  const [featuredIds, setFeaturedIds]   = useState<Set<string>>(new Set(portfolio.featuredRepoIds));

  const [profileStatus, setProfileStatus] = useState<SaveStatus>("idle");
  const [portStatus, setPortStatus]       = useState<SaveStatus>("idle");
  const [, startTransition]               = useTransition();

  async function saveProfile() {
    setProfileStatus("saving");
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, location, website, twitterHandle: twitter, linkedinUrl: linkedin, phone, education, currentRole }),
      });
      if (!res.ok) throw new Error();
      setProfileStatus("saved");
      startTransition(() => router.refresh());
      setTimeout(() => setProfileStatus("idle"), 3000);
    } catch {
      setProfileStatus("error");
      setTimeout(() => setProfileStatus("idle"), 4000);
    }
  }

  async function savePortfolio() {
    setPortStatus("saving");
    try {
      const res = await fetch("/api/settings/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline, bio: portBio, email: portEmail,
          twitterHandle: portTwitter, linkedinUrl: portLinkedin,
          websiteUrl: portWebsite, isPublic, showEmail, showActivity,
          featuredRepoIds: Array.from(featuredIds),
        }),
      });
      if (!res.ok) throw new Error();
      setPortStatus("saved");
      startTransition(() => router.refresh());
      setTimeout(() => setPortStatus("idle"), 3000);
    } catch {
      setPortStatus("error");
      setTimeout(() => setPortStatus("idle"), 4000);
    }
  }

  function toggleRepo(id: string, checked: boolean) {
    setFeaturedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  const SaveButton = ({ status, onSave }: { status: SaveStatus; onSave: () => void }) => (
    <button
      type="button"
      onClick={onSave}
      disabled={status === "saving"}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 btn-magnetic
        ${status === "saved"
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          : status === "error"
          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
          : "bg-gradient-to-r from-[hsl(var(--primary))] to-violet-500 text-white shadow-[0_0_16px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_24px_hsl(var(--primary)/0.45)]"
        }`}
    >
      {status === "saving" && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {status === "saved" && <Check className="w-4 h-4" />}
      {status === "error" && <AlertCircle className="w-4 h-4" />}
      {status === "idle" && <Save className="w-4 h-4" />}
      {status === "saving" ? "Saving…" : status === "saved" ? "Saved!" : status === "error" ? "Error" : "Save Changes"}
    </button>
  );

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in-up">

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[hsl(var(--accent)/0.5)] border border-[hsl(var(--border))] w-fit">
        {(["profile", "portfolio"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200
              ${tab === t
                ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm border border-[hsl(var(--border))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
          >
            {t === "profile" ? <User className="w-3.5 h-3.5" /> : <LayoutTemplate className="w-3.5 h-3.5" />}
            {t === "profile" ? "Profile" : "Portfolio"}
          </button>
        ))}
      </div>

      {/* ── Profile tab ── */}
      {tab === "profile" && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Avatar section */}
          <div className="flex items-center gap-5 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="relative">
              {profile.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.image}
                  alt={profile.name ?? "Avatar"}
                  className="w-16 h-16 rounded-2xl border-2 border-[hsl(var(--primary)/0.3)] object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary)/0.2)] to-violet-500/10 border border-[hsl(var(--border))] flex items-center justify-center">
                  <User className="w-8 h-8 text-[hsl(var(--primary)/0.4)]" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[hsl(var(--card))]" />
            </div>
            <div>
              <p className="font-bold text-[hsl(var(--foreground))]">{profile.name ?? "Your Name"}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">@{profile.githubUsername}</p>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
                Avatar synced from GitHub
              </p>
            </div>
          </div>

          {/* Form fields */}
          <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FloatInput id="name" label="Full Name" value={name} onChange={setName} icon={User} />
              <FloatInput id="location" label="Location" value={location} onChange={setLocation} icon={MapPin} />
            </div>
            <FloatTextarea id="bio" label="Bio" value={bio} onChange={setBio} />
            <div className="grid sm:grid-cols-2 gap-4">
              <FloatInput id="website" label="Website URL" value={website} onChange={setWebsite} icon={Globe} />
              <FloatInput id="twitter" label="Twitter / X handle" value={twitter} onChange={setTwitter} icon={AtSign} />
            </div>
            <FloatInput id="linkedin" label="LinkedIn URL" value={linkedin} onChange={setLinkedin} icon={Link2} />
          </div>

          {/* Resume fields */}
          <div className="p-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <p className="text-sm font-semibold text-[hsl(var(--foreground))]">Resume Information</p>
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-violet-500/15 text-violet-400 border border-violet-500/20">FOR AI RESUME</span>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">These fields are used by the AI Resume Builder to generate your tailored resume.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <FloatInput id="phone" label="Phone Number" value={phone} onChange={setPhone} icon={User} />
              <FloatInput id="currentRole" label="Current Role / Title" value={currentRole} onChange={setCurrentRole} icon={Star} />
            </div>
            <FloatInput id="education" label="Education (e.g. B.Tech CS, Delhi University, 2024)" value={education} onChange={setEducation} icon={Globe} />
          </div>

          <div className="flex justify-end">
            <SaveButton status={profileStatus} onSave={saveProfile} />
          </div>
        </div>
      )}

      {/* ── Portfolio tab ── */}
      {tab === "portfolio" && (
        <div className="space-y-4 animate-fade-in-up">

          {/* Visibility card */}
          <div className="p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-[hsl(var(--primary))]" />
              <p className="text-sm font-semibold text-[hsl(var(--foreground))]">Visibility &amp; Privacy</p>
            </div>
            <Toggle
              checked={isPublic}
              onChange={setIsPublic}
              label="Public Portfolio"
              description={isPublic
                ? `Live at devlaunch.ai/${portfolio.username}`
                : "Your portfolio is private — only you can see it"}
            />
            <Toggle
              checked={showEmail}
              onChange={setShowEmail}
              label="Show Email"
              description="Display your contact email on the public portfolio"
            />
            <Toggle
              checked={showActivity}
              onChange={setShowActivity}
              label="Show Activity Chart"
              description="Display GitHub push activity graph"
            />
          </div>

          {/* Portfolio content */}
          <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
              <p className="text-sm font-semibold text-[hsl(var(--foreground))]">Portfolio Content</p>
            </div>
            <FloatInput id="headline" label="Headline (e.g. Full-Stack Engineer)" value={headline} onChange={setHeadline} icon={AtSign} />
            <FloatTextarea id="portBio" label="Portfolio Bio" value={portBio} onChange={setPortBio} />
            <div className="grid sm:grid-cols-2 gap-4">
              <FloatInput id="portEmail" label="Contact Email" value={portEmail} onChange={setPortEmail} icon={Mail} />
              <FloatInput id="portWebsite" label="Website URL" value={portWebsite} onChange={setPortWebsite} icon={Globe} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <FloatInput id="portTwitter" label="Twitter Handle" value={portTwitter} onChange={setPortTwitter} icon={AtSign} />
              <FloatInput id="portLinkedin" label="LinkedIn URL" value={portLinkedin} onChange={setPortLinkedin} icon={Link2} />
            </div>
          </div>

          {/* Featured repos */}
          {repos.length > 0 && (
            <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))]">Featured Projects</p>
                </div>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  {featuredIds.size} selected
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {repos.map((repo) => (
                  <RepoCheck
                    key={repo.id}
                    id={repo.id}
                    name={repo.name}
                    language={repo.language}
                    stars={repo.stars}
                    checked={featuredIds.has(repo.id)}
                    onChange={(c) => toggleRepo(repo.id, c)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <SaveButton status={portStatus} onSave={savePortfolio} />
          </div>
        </div>
      )}
    </div>
  );
}
