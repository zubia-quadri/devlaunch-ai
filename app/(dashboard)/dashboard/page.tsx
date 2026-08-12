import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Star, GitFork, Code2, Sparkles, ArrowRight,
  Globe, Zap, ExternalLink, CheckCircle2, ChevronRight,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { LanguageDonut } from "@/components/dashboard/LanguageDonut";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { ImportButton } from "@/components/repository/ImportButton";
import { formatMonth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard — DevLaunch AI",
  description: "Your developer career overview.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [repos, skills, user, portfolio] = await Promise.all([
    prisma.repository.findMany({
      where: { userId },
      include: { developerInsights: { select: { id: true, status: true } } },
      orderBy: { stars: "desc" },
    }),
    prisma.userSkill.findMany({
      where: { userId, category: "LANGUAGE" },
      orderBy: { repoCount: "desc" },
      take: 8,
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, githubUsername: true, image: true },
    }),
    prisma.portfolio.findUnique({
      where: { userId },
      select: { username: true, isPublic: true, headline: true },
    }),
  ]);

  const totalStars   = repos.reduce((s, r) => s + r.stars, 0);
  const totalForks   = repos.reduce((s, r) => s + r.forks, 0);
  const insightCount = repos.filter((r) => r.developerInsights?.status === "DONE").length;
  const firstName    = user?.name?.split(" ")[0] ?? "Developer";
  const hasRepos     = repos.length > 0;
  const portfolioUrl = portfolio?.username ? `/${portfolio.username}` : null;
  const pendingCount = repos.filter((r) => !r.developerInsights || r.developerInsights.status !== "DONE").length;

  // Language distribution
  const languageData = skills.map((s) => ({ language: s.name, count: s.repoCount }));

  // Activity chart — last 6 months
  const now = new Date();
  const activityMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    activityMap[formatMonth(d)] = 0;
  }
  for (const repo of repos) {
    if (repo.pushedAt) {
      const key = formatMonth(repo.pushedAt);
      if (key in activityMap) activityMap[key]++;
    }
  }
  const activityData = Object.entries(activityMap).map(([month, repos]) => ({ month, repos }));

  const topRepos = repos.slice(0, 6);

  // Progress steps
  const steps = [
    { done: hasRepos,         label: "Import GitHub repositories",        href: "/repositories" },
    { done: insightCount > 0, label: "Generate AI insights on your repos", href: "/repositories" },
    { done: !!portfolio?.headline, label: "Add headline & bio in Settings",   href: "/settings" },
    { done: portfolio?.isPublic ?? false, label: "Share your public portfolio",  href: portfolioUrl ?? "/settings" },
  ];
  const stepsCompleted = steps.filter((s) => s.done).length;

  return (
    <div className="p-6 space-y-6 max-w-6xl">

      {/* ── Welcome + Portfolio Banner ───────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            {hasRepos
              ? `${repos.length} repos · ${insightCount} AI-analysed · ${pendingCount} pending`
              : "Start by importing your GitHub repositories below"}
          </p>
        </div>

        {portfolioUrl && portfolio?.isPublic && (
          <Link
            href={portfolioUrl}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-all shrink-0 group"
          >
            <Globe className="w-4 h-4" />
            Portfolio is Live
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
          </Link>
        )}
      </div>

      {/* ── Value Proposition Banner (shown until all steps done) ── */}
      {stepsCompleted < 4 && (
        <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--primary)/0.2)] bg-gradient-to-r from-[hsl(var(--primary)/0.07)] to-violet-500/5 p-5 animate-fade-in-up delay-150 animate-bg-pan"
          style={{ background: "linear-gradient(135deg, hsl(239 84% 67% / 0.07), hsl(270 70% 60% / 0.05), hsl(199 89% 48% / 0.04))", backgroundSize: "200% 200%" }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[hsl(var(--primary)/0.06)] blur-3xl -z-10 animate-float-slow" />
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[hsl(var(--primary)/0.15)] shrink-0">
              <Zap className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-[hsl(var(--foreground))] text-sm">
                What DevLaunch AI does for you
              </h2>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed max-w-2xl">
                GitHub shows recruiters <em>code</em>. DevLaunch AI shows them your{" "}
                <strong className="text-[hsl(var(--foreground))]">impact</strong> — AI-written project
                summaries, skill proficiency scores, and a shareable one-link portfolio that speaks
                business language, not just tech jargon.
              </p>
              {/* Progress steps */}
              <div className="mt-4 grid sm:grid-cols-2 gap-2">
                {steps.map((step, i) => (
                  <Link
                    key={i}
                    href={step.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      step.done
                        ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-400 cursor-default"
                        : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.3)] hover:text-[hsl(var(--foreground))]"
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-[hsl(var(--border))] shrink-0" />
                    )}
                    {step.label}
                    {!step.done && <ChevronRight className="w-3 h-3 ml-auto shrink-0" />}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── No repos state ── */}
      {!hasRepos && (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-[hsl(var(--border))] gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--accent))] flex items-center justify-center">
            <Code2 className="w-7 h-7 text-[hsl(var(--muted-foreground))]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">No repositories yet</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Import from GitHub to start building your AI-powered portfolio
            </p>
          </div>
          <ImportButton hasRepos={false} />
        </div>
      )}

      {/* ── Stats row ── */}
      {hasRepos && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard label="Repositories" value={repos.length} icon={Code2}
            iconColor="text-violet-400" iconBg="bg-violet-500/10" delay={0} glowClass="glow-violet" />
          <StatsCard label="Total Stars" value={totalStars} icon={Star}
            iconColor="text-amber-400" iconBg="bg-amber-500/10" delay={75} glowClass="glow-amber" />
          <StatsCard label="Total Forks" value={totalForks} icon={GitFork}
            iconColor="text-sky-400" iconBg="bg-sky-500/10" delay={150} glowClass="glow-sky" />
          <StatsCard label="AI Insights" value={insightCount} icon={Sparkles}
            iconColor="text-emerald-400" iconBg="bg-emerald-500/10" delay={225} glowClass="glow-emerald"
            delta={pendingCount > 0 ? `${pendingCount} pending` : undefined}
          />
        </div>
      )}

      {/* ── Charts ── */}
      {hasRepos && (
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <h2 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">Language Mix</h2>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">Distribution across all repos</p>
            <LanguageDonut data={languageData} />
          </div>
          <div className="lg:col-span-3 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <h2 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">Push Activity</h2>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4">Repositories pushed in last 6 months</p>
            <ActivityChart data={activityData} />
          </div>
        </div>
      )}

      {/* ── AI Insights CTA (when repos exist but insights are pending) ── */}
      {hasRepos && pendingCount > 0 && (
        <div className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.04)] card-hover shine animate-fade-in-up delay-300">
          <div className="flex items-center gap-3">
            <div className="animate-pulse-glow rounded-full">
              <Sparkles className="w-5 h-5 text-[hsl(var(--primary))] shrink-0" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                {pendingCount} {pendingCount === 1 ? "repo needs" : "repos need"} AI analysis
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Generate recruiter-friendly summaries, skill scores &amp; project highlights
              </p>
            </div>
          </div>
          <Link
            href="/repositories"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(var(--primary))] text-white text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            Analyse Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* ── Top repos ── */}
      {topRepos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Top Repositories</h2>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Click any repo to view AI insights</p>
            </div>
            <Link href="/repositories" className="flex items-center gap-1 text-xs text-[hsl(var(--primary))] hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {topRepos.map((repo, i) => (
              <Link
                key={repo.id}
                href={`/repositories/${repo.id}`}
                className="group flex flex-col gap-2 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] gradient-card ombre-glow shine animate-fade-in-up glow-primary"
                style={{ animationDelay: `${350 + i * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[hsl(var(--foreground))] truncate group-hover:text-[hsl(var(--primary))] transition-colors">
                      {repo.name}
                    </p>
                    {repo.description && (
                      <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-1 mt-0.5">
                        {repo.description}
                      </p>
                    )}
                  </div>
                  {repo.developerInsights?.status === "DONE" ? (
                    <span className="shrink-0 flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Sparkles className="w-2.5 h-2.5" /> AI
                    </span>
                  ) : (
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]">
                      No AI
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] opacity-70" />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" /> {repo.forks}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
