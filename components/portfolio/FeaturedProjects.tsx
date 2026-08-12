import Link from "next/link";
import { Star, GitFork, ExternalLink, Sparkles } from "lucide-react";
import { SectionLabel } from "./PortfolioAbout";
import { TechBadge } from "@/components/repository/TechBadge";
import { formatNumber } from "@/lib/utils";

interface FeaturedRepo {
  id: string;
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  url: string;
  developerInsights: {
    summary: string | null;
    highlights: string[];
    techStack: string[];
  } | null;
}

interface FeaturedProjectsProps {
  repos: FeaturedRepo[];
  ownerUsername: string;
}

export function FeaturedProjects({ repos, ownerUsername }: FeaturedProjectsProps) {
  if (repos.length === 0) return null;

  return (
    <section id="projects" className="py-16 px-6 border-t border-[hsl(var(--border))] bg-[hsl(var(--accent)/0.2)]">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>Featured Projects</SectionLabel>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          {repos.map((repo) => (
            <ProjectCard key={repo.id} repo={repo} ownerUsername={ownerUsername} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  repo,
  ownerUsername,
}: {
  repo: FeaturedRepo;
  ownerUsername: string;
}) {
  const insights = repo.developerInsights;
  const topics = repo.topics as string[];

  return (
    <div className="group flex flex-col gap-4 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.4)] hover:shadow-lg hover:shadow-[hsl(var(--primary)/0.05)] transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <h3 className="font-bold text-[hsl(var(--foreground))] truncate">{repo.name}</h3>
          {repo.description && (
            <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-2 leading-relaxed">
              {repo.description}
            </p>
          )}
        </div>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-1.5 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* AI Summary */}
      {insights?.summary && (
        <div className="flex gap-2 p-3 rounded-xl bg-[hsl(var(--primary)/0.06)] border border-[hsl(var(--primary)/0.12)]">
          <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--primary))] shrink-0 mt-0.5" />
          <p className="text-xs text-[hsl(var(--foreground)/0.8)] leading-relaxed line-clamp-3">
            {insights.summary}
          </p>
        </div>
      )}

      {/* Highlights */}
      {insights?.highlights && insights.highlights.length > 0 && (
        <ul className="space-y-1">
          {insights.highlights.slice(0, 3).map((h, i) => (
            <li key={i} className="flex gap-2 text-xs text-[hsl(var(--foreground)/0.75)]">
              <span className="text-[hsl(var(--primary))] shrink-0 mt-0.5">•</span>
              <span className="leading-relaxed">{h}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Topics */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {topics.slice(0, 4).map((t) => (
            <TechBadge key={t} name={t} showDot={false} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
          {repo.language && <TechBadge name={repo.language} />}
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {formatNumber(repo.stars)}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            {formatNumber(repo.forks)}
          </span>
        </div>
      </div>
    </div>
  );
}
