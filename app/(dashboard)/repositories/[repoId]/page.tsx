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
    <div className="space-y-6 max-w-4xl p-4 sm:p-8">
      {/* Back */}
      <Link
        href="/repositories"
        className="inline-flex items-center gap-2 text-xs font-mono text-[hsl(var(--muted-foreground))] hover:text-[#81ACEC] transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <span>back to repositories</span>
      </Link>

      {/* 3D Header card */}
      <div className="card-3d p-6 space-y-4 relative overflow-hidden">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
              <span className="inline-flex items-center gap-1 text-[#81ACEC] bg-[#81ACEC]/10 px-2 py-0.5 rounded-full border border-[#81ACEC]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#81ACEC] animate-pulse" />
                REPO.INSPECT
              </span>
              <span>//</span>
              <span>{repo.name}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                {repo.name}
              </h1>
              {repo.isFork && (
                <span className="font-mono text-[9px] px-2 py-0.5 rounded-md border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
                  Fork
                </span>
              )}
              {repo.isArchived && (
                <span className="font-mono text-[9px] px-2 py-0.5 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-500 uppercase tracking-wide">
                  Archived
                </span>
              )}
              {hasInsights && (
                <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  AI Analyzed
                </span>
              )}
            </div>
            {repo.description && (
              <p className="text-xs text-[hsl(var(--muted-foreground))] max-w-xl leading-relaxed">
                {repo.description}
              </p>
            )}
          </div>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="paper-btn-secondary text-xs py-2 px-3.5 rounded-xl hover:border-[#81ACEC] transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>view on github</span>
          </a>
        </div>

        {/* HUD Stats */}
        <div className="flex flex-wrap gap-4 pt-3 border-t border-[hsl(var(--border)/0.4)] font-mono text-xs text-[hsl(var(--muted-foreground))]">
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400" />
            <strong className="text-[hsl(var(--foreground))]">{formatNumber(repo.stars)}</strong> stars
          </span>
          <span className="flex items-center gap-1.5">
            <GitFork className="w-4 h-4 text-[#81ACEC]" />
            <strong className="text-[hsl(var(--foreground))]">{formatNumber(repo.forks)}</strong> forks
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-violet-400" />
            <strong className="text-[hsl(var(--foreground))]">{formatNumber(repo.watchers)}</strong> watchers
          </span>
          <span className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <strong className="text-[hsl(var(--foreground))]">{formatNumber(repo.openIssues)}</strong> issues
          </span>
          {repo.pushedAt && (
            <span className="flex items-center gap-1.5 ml-auto">
              <Clock className="w-3.5 h-3.5 opacity-60" />
              pushed {formatRelativeTime(repo.pushedAt)}
            </span>
          )}
        </div>

        {/* Language + Topics */}
        <div className="flex flex-wrap gap-2 pt-1">
          {repo.language && <TechBadge name={repo.language} size="md" />}
          {topics.map((t) => (
            <TechBadge key={t} name={t} size="md" showDot={false} />
          ))}
        </div>
      </div>

      {/* 3D Developer Insights card */}
      <div className="card-3d p-6 relative overflow-hidden space-y-4">
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
            <div className="mt-6 pt-5 border-t border-[hsl(var(--border)/0.5)]">
              <GenerateInsightsButton repoId={repo.id} hasInsights={true} />
            </div>
          </>
        ) : ins?.status === "ANALYZING" ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#81ACEC]/10 border border-[#81ACEC]/20">
            <div className="w-4 h-4 rounded-full border-2 border-[#81ACEC] border-t-transparent animate-spin shrink-0" />
            <p className="text-xs text-[hsl(var(--foreground))] font-mono">
              AI is analyzing repository architecture… Refreshing telemetry shortly.
            </p>
          </div>
        ) : ins?.status === "ERROR" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Analysis encountered an error. Click below to retry.
              </p>
            </div>
            <GenerateInsightsButton repoId={repo.id} hasInsights={false} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))]">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                No AI insights yet. Generate insights to extract recruiter-ready architectural highlights and detected technologies.
              </p>
            </div>
            <GenerateInsightsButton repoId={repo.id} hasInsights={false} />
          </div>
        )}
      </div>
    </div>
  );
}
