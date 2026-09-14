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
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
            <span>workspace</span>
            <span>/</span>
            <span className="text-[hsl(var(--foreground))]">overview</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-[hsl(var(--foreground))] mt-0.5">
            welcome back, {firstName.toLowerCase()}
          </h1>
          <p className="font-mono text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
            {hasRepos
              ? `${repos.length} repositories · ${insightCount} analyzed · ${pendingCount} pending`
              : "connect your repositories to begin"}
          </p>
        </div>

        {portfolioUrl && portfolio?.isPublic && (
          <Link
            href={portfolioUrl}
            target="_blank"
            className="paper-btn-secondary text-xs py-1.5 px-3 rounded-lg self-start sm:self-auto"
          >
            <Globe className="w-3.5 h-3.5 text-[#81ACEC]" />
            <span>view live portfolio</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </Link>
        )}
      </div>

      {/* Checklist Banner */}
      {stepsCompleted < 4 && (
        <div className="paper-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="paper-tag paper-tag-blue">setup guide</span>
              <span className="text-xs font-semibold text-[hsl(var(--foreground))]">onboarding roadmap</span>
            </div>
            <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{stepsCompleted}/4 complete</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            {steps.map((step, i) => (
              <Link
                key={i}
                href={step.href}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs transition-colors ${
                  step.done
                    ? "border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] text-[hsl(var(--muted-foreground))]"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:border-[#81ACEC]"
                }`}
              >
                {step.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-[hsl(var(--border))] shrink-0" />
                )}
                <span className="font-medium text-[11px]">{step.label}</span>
                {!step.done && <ChevronRight className="w-3 h-3 ml-auto opacity-40" />}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No repos state */}
      {!hasRepos && (
        <div className="paper-card p-12 text-center space-y-3">
          <Code2 className="w-8 h-8 text-[hsl(var(--muted-foreground))] mx-auto opacity-50" />
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">no repositories found</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            import your repositories from github to build your tailored resume and portfolio.
          </p>
          <div className="pt-2">
            <ImportButton hasRepos={false} />
          </div>
        </div>
      )}

      {/* Stats row */}
      {hasRepos && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard label="repositories" value={repos.length} icon={Code2}
            iconColor="" iconBg="" />
          <StatsCard label="total stars" value={totalStars} icon={Star}
            iconColor="" iconBg="" />
          <StatsCard label="total forks" value={totalForks} icon={GitFork}
            iconColor="" iconBg="" />
          <StatsCard label="ai insights" value={insightCount} icon={Sparkles}
            iconColor="" iconBg=""
            delta={pendingCount > 0 ? `${pendingCount} pending` : undefined}
          />
        </div>
      )}

      {/* Charts */}
      {hasRepos && (
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 paper-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-semibold text-[hsl(var(--foreground))]">language mix</h2>
                <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">code distribution across repos</p>
              </div>
              <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">chart 01</span>
            </div>
            <LanguageDonut data={languageData} />
          </div>

          <div className="lg:col-span-3 paper-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xs font-semibold text-[hsl(var(--foreground))]">push activity</h2>
                <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">commits &amp; pushes in last 6 months</p>
              </div>
              <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">chart 02</span>
            </div>
            <ActivityChart data={activityData} />
          </div>
        </div>
      )}

      {/* Top repos */}
      {topRepos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold text-[hsl(var(--foreground))]">top repositories</h2>
              <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">sorted by stars &amp; complexity</p>
            </div>
            <Link href="/repositories" className="font-mono text-[11px] text-[#4a77bf] dark:text-[#9ec2f7] hover:underline flex items-center gap-1">
              view all ({repos.length}) <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topRepos.map((repo) => (
              <Link
                key={repo.id}
                href={`/repositories/${repo.id}`}
                className="paper-card p-4 space-y-2 block group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-[hsl(var(--foreground))] group-hover:text-[#4a77bf] dark:group-hover:text-[#9ec2f7] transition-colors truncate">
                    {repo.name}
                  </p>
                  {repo.developerInsights?.status === "DONE" ? (
                    <span className="paper-tag-blue text-[9px] px-1.5 py-0.5 shrink-0">analyzed</span>
                  ) : (
                    <span className="paper-tag text-[9px] px-1.5 py-0.5 shrink-0">pending</span>
                  )}
                </div>

                {repo.description && (
                  <p className="text-[11px] text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed">
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-1 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                  {repo.language && <span>{repo.language}</span>}
                  <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {repo.stars}</span>
                  <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {repo.forks}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
