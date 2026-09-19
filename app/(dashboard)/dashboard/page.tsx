import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Star, GitFork, Code2, Sparkles, ArrowRight,
  Globe, ArrowUpRight, CheckCircle2, ChevronRight,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { LanguageDonut } from "@/components/dashboard/LanguageDonut";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { ImportButton } from "@/components/repository/ImportButton";
import { formatMonth } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard — DevLaunch AI Studio",
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

  const languageData = skills.map((s) => ({ language: s.name, count: s.repoCount }));

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

  const steps = [
    { done: hasRepos,         label: "Import GitHub repositories",        href: "/repositories" },
    { done: insightCount > 0, label: "Generate AI insights on your repos", href: "/skills" },
    { done: !!portfolio?.headline, label: "Add headline & bio in Settings",   href: "/settings" },
    { done: portfolio?.isPublic ?? false, label: "Share your public portfolio",  href: portfolioUrl ?? "/settings" },
  ];
  const stepsCompleted = steps.filter((s) => s.done).length;

  return (
    <div className="p-4 sm:p-8 space-y-7 max-w-5xl mx-auto w-full">
      {/* ── 3D Futuristic HUD Header with Dimensional Glass & Gradients ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200/80 dark:border-[hsl(var(--border))] bg-gradient-to-r from-white/95 via-white/90 to-indigo-50/40 dark:from-[hsl(var(--card)/0.85)] dark:to-[hsl(var(--card)/0.65)] backdrop-blur-xl shadow-lg shadow-indigo-500/5 dark:shadow-black/40 relative overflow-hidden">
        {/* Ambient header glow */}
        <div className="absolute top-0 right-1/4 w-80 h-28 bg-gradient-to-b from-indigo-500/15 via-sky-400/10 to-transparent blur-3xl pointer-events-none" />

        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM.ACTIVE
            </span>
            <span>//</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">OVERVIEW.CONSOLE</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-normal tracking-tight text-[hsl(var(--foreground))] pt-0.5">
            welcome back, <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#81ACEC] dark:to-cyan-400 bg-clip-text text-transparent">{firstName.toLowerCase()}</span>
          </h1>
          <p className="font-mono text-xs text-slate-500 dark:text-[hsl(var(--muted-foreground))] flex items-center gap-2">
            <span>{repos.length} repositories indexed</span>
            <span>·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{insightCount} analyzed</span>
            {pendingCount > 0 && (
              <>
                <span>·</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">{pendingCount} pending</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          {portfolioUrl && portfolio?.isPublic && (
            <Link
              href={portfolioUrl}
              target="_blank"
              className="paper-btn-secondary text-xs py-2 px-3.5 rounded-xl shadow-xs hover:border-[#81ACEC] hover:shadow-[0_0_15px_rgba(129,172,236,0.25)] transition-all flex items-center gap-2"
            >
              <Globe className="w-3.5 h-3.5 text-[#81ACEC]" />
              <span>live portfolio</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>
          )}
        </div>
      </div>

      {/* ── 3D Cybernetic Roadmap Console ── */}
      {stepsCompleted < 4 && (
        <div className="card-3d p-6 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="paper-tag paper-tag-blue">MISSION PROTOCOL</span>
              <span className="text-xs font-semibold text-[hsl(var(--foreground))]">system onboarding pipeline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#81ACEC] to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_#81ACEC]"
                  style={{ width: `${(stepsCompleted / 4) * 100}%` }}
                />
              </div>
              <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{stepsCompleted}/4 complete</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {steps.map((step, i) => (
              <Link
                key={i}
                href={step.href}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
                  step.done
                    ? "border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.25)] text-[hsl(var(--muted-foreground))]"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[#81ACEC] hover:shadow-[0_0_12px_rgba(129,172,236,0.15)] hover:translate-x-0.5"
                }`}
              >
                {step.done ? (
                  <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-md border border-[hsl(var(--border))] flex items-center justify-center shrink-0 font-mono text-[9px] text-[hsl(var(--muted-foreground))]">
                    0{i + 1}
                  </div>
                )}
                <span className="font-medium text-xs">{step.label}</span>
                {!step.done && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50 text-[#81ACEC]" />}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No repos state */}
      {!hasRepos && (
        <div className="card-3d p-12 text-center space-y-4">
          <Code2 className="w-10 h-10 text-[#81ACEC] mx-auto opacity-75 animate-bounce" />
          <p className="text-sm font-semibold text-[hsl(var(--foreground))]">no repositories connected</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] max-w-sm mx-auto">
            import your repositories from github to unleash ai insights, 3d analytics, and automated resume compiling.
          </p>
          <div className="pt-2">
            <ImportButton hasRepos={false} />
          </div>
        </div>
      )}

      {/* ── 3D Stats Row with Holographic Depth ── */}
      {hasRepos && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatsCard
            sysId="SYS.01"
            label="repositories"
            value={repos.length}
            icon={Code2}
          />
          <StatsCard
            sysId="SYS.02"
            label="total stars"
            value={totalStars}
            icon={Star}
          />
          <StatsCard
            sysId="SYS.03"
            label="total forks"
            value={totalForks}
            icon={GitFork}
          />
          <StatsCard
            sysId="SYS.04"
            label="ai insights"
            value={insightCount}
            icon={Sparkles}
            delta={pendingCount > 0 ? `${pendingCount} pending` : undefined}
          />
        </div>
      )}

      {/* ── 3D Charts Grid ── */}
      {hasRepos && (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Language Mix Card */}
          <div className="lg:col-span-2 card-3d p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-[hsl(var(--border)/0.5)] pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#81ACEC]" />
                  <h2 className="text-xs font-semibold text-[hsl(var(--foreground))]">language mix</h2>
                </div>
                <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">code telemetry across repos</p>
              </div>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">CHART // 01</span>
            </div>
            <LanguageDonut data={languageData} />
          </div>

          {/* Push Activity Card */}
          <div className="lg:col-span-3 card-3d p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-[hsl(var(--border)/0.5)] pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />
                  <h2 className="text-xs font-semibold text-[hsl(var(--foreground))]">push velocity</h2>
                </div>
                <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">commit cadence (last 6 months)</p>
              </div>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">CHART // 02</span>
            </div>
            <ActivityChart data={activityData} />
          </div>
        </div>
      )}

      {/* ── 3D Top Repositories Grid ── */}
      {topRepos.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#81ACEC] shadow-[0_0_8px_#81ACEC]" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]">top repositories</h2>
              <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">({repos.length} indexed)</span>
            </div>
            <Link
              href="/repositories"
              className="font-mono text-[11px] text-[#4a77bf] dark:text-[#9ec2f7] hover:underline flex items-center gap-1 group"
            >
              <span>manage repositories</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {topRepos.map((repo) => (
              <Link
                key={repo.id}
                href={`/repositories/${repo.id}`}
                className="card-3d p-4 space-y-2.5 block group hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-[hsl(var(--foreground))] group-hover:text-[#81ACEC] transition-colors truncate">
                    {repo.name}
                  </p>
                  {repo.developerInsights?.status === "DONE" ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      analyzed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                      <span className="w-1 h-1 rounded-full bg-amber-400" />
                      pending
                    </span>
                  )}
                </div>

                {repo.description ? (
                  <p className="text-[11px] text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed h-8">
                    {repo.description}
                  </p>
                ) : (
                  <p className="text-[11px] text-[hsl(var(--muted-foreground)/0.5)] italic h-8">
                    no description provided
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[hsl(var(--border)/0.4)] font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                  <div className="flex items-center gap-1.5">
                    {repo.language && (
                      <span className="text-[hsl(var(--foreground))] font-medium">{repo.language}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {repo.stars}</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3 h-3 text-[#81ACEC]" /> {repo.forks}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
