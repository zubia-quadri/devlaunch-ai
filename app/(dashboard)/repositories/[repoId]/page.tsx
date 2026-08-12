import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  Star, GitFork, ExternalLink, ArrowLeft,
  Code2, Clock, Eye, AlertCircle,
} from "lucide-react";
import { TechBadge } from "@/components/repository/TechBadge";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { GenerateInsightsButton } from "@/components/insights/GenerateInsightsButton";
import { formatRelativeTime, formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "Repository — DevLaunch AI" };

export default async function RepoDetailPage({
  params,
}: {
  params: { repoId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const repo = await prisma.repository.findFirst({
    where: { id: params.repoId, userId: session.user.id },
    include: { developerInsights: true },
  });

  if (!repo) notFound();

  const topics = repo.topics as string[];
  const ins = repo.developerInsights;
  const hasInsights = !!ins && ins.status === "DONE";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link
        href="/repositories"
        className="inline-flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All Repositories
      </Link>

      {/* Header card */}
      <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
                {repo.name}
              </h1>
              {repo.isFork && (
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
                  Fork
                </span>
              )}
              {repo.isArchived && (
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-400 uppercase tracking-wide">
                  Archived
                </span>
              )}
            </div>
            {repo.description && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-xl">
                {repo.description}
              </p>
            )}
          </div>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] text-xs text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View on GitHub
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-[hsl(var(--muted-foreground))]">
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400" />
            {formatNumber(repo.stars)} stars
          </span>
          <span className="flex items-center gap-1.5">
            <GitFork className="w-4 h-4 text-sky-400" />
            {formatNumber(repo.forks)} forks
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-violet-400" />
            {formatNumber(repo.watchers)} watchers
          </span>
          <span className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-emerald-400" />
            {formatNumber(repo.openIssues)} open issues
          </span>
          {repo.pushedAt && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Last push {formatRelativeTime(repo.pushedAt)}
            </span>
          )}
        </div>

        {/* Language + Topics */}
        <div className="flex flex-wrap gap-2 mt-4">
          {repo.language && <TechBadge name={repo.language} size="md" />}
          {topics.map((t) => (
            <TechBadge key={t} name={t} size="md" showDot={false} />
          ))}
        </div>
      </div>

      {/* Developer Insights card */}
      <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        {hasInsights && ins ? (
          <>
            <InsightsPanel
              summary={ins.summary}
              highlights={ins.highlights as string[]}
              techStack={ins.techStack as string[]}
              useCases={ins.useCases}
              targetAudience={ins.targetAudience}
              complexityScore={ins.complexityScore}
              analyzedAt={ins.analyzedAt}
            />
            <div className="mt-6 pt-5 border-t border-[hsl(var(--border))]">
              <GenerateInsightsButton repoId={repo.id} hasInsights={true} />
            </div>
          </>
        ) : ins?.status === "ANALYZING" ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(var(--accent)/0.5)]">
            <div className="w-4 h-4 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-spin shrink-0" />
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              AI is analyzing this repository… Refresh the page in a moment.
            </p>
          </div>
        ) : ins?.status === "ERROR" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Analysis failed last time. Try generating again.
              </p>
            </div>
            <GenerateInsightsButton repoId={repo.id} hasInsights={false} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(var(--accent)/0.5)] border border-[hsl(var(--border))]">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                No AI insights yet. Generate them to get a recruiter-ready summary,
                key highlights, and technology analysis.
              </p>
            </div>
            <GenerateInsightsButton repoId={repo.id} hasInsights={false} />
          </div>
        )}
      </div>
    </div>
  );
}
