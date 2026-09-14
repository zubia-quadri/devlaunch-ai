import Link from "next/link";
import { Star, GitFork, ExternalLink, Clock, AlertCircle } from "lucide-react";
import { TechBadge } from "./TechBadge";
import { formatRelativeTime, formatNumber } from "@/lib/utils";

interface RepoCardProps {
  id: string;
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  url: string;
  pushedAt: Date | null;
  isFork: boolean;
  isArchived: boolean;
  hasInsights: boolean;
}

export function RepoCard({
  id,
  name,
  description,
  language,
  topics,
  stars,
  forks,
  url,
  pushedAt,
  isFork,
  isArchived,
  hasInsights,
}: RepoCardProps) {
  return (
    <div className="card-3d p-5 space-y-3.5 flex flex-col justify-between group hover:-translate-y-1 hover:border-[#81ACEC]/50 hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.5),0_0_25px_-5px_rgba(129,172,236,0.2)] transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/repositories/${id}`}
              className="font-semibold text-sm text-[hsl(var(--foreground))] group-hover:text-[#81ACEC] transition-colors truncate"
            >
              {name}
            </Link>
            {isFork && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
                Fork
              </span>
            )}
            {isArchived && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-500 uppercase tracking-wide">
                Archived
              </span>
            )}
            {hasInsights && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                AI Analyzed
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
          aria-label={`Open ${name} on GitHub`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Topics */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {topics.slice(0, 4).map((t) => (
            <TechBadge key={t} name={t} showDot={false} />
          ))}
          {topics.length > 4 && (
            <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
              +{topics.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[hsl(var(--border)/0.4)]">
        <div className="flex items-center gap-3 font-mono text-[11px] text-[hsl(var(--muted-foreground))]">
          {language && <TechBadge name={language} />}
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400" />
            {formatNumber(stars)}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3 h-3 text-[#81ACEC]" />
            {formatNumber(forks)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!hasInsights && (
            <span
              title="No AI insights yet"
              className="text-amber-500 flex items-center gap-1 font-mono text-[10px]"
            >
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          )}
          {pushedAt && (
            <span className="flex items-center gap-1 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(pushedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
