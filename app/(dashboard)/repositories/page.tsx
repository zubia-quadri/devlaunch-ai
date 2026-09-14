import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RepoCard } from "@/components/repository/RepoCard";
import { ImportButton } from "@/components/repository/ImportButton";
import { GitFork, Star, Code2, PackageOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Repositories — DevLaunch AI Studio",
  description: "Manage and explore your imported GitHub repositories.",
};

export default async function RepositoriesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const repos = await prisma.repository.findMany({
    where: { userId: session.user.id },
    include: { developerInsights: { select: { id: true } } },
    orderBy: [{ stars: "desc" }, { pushedAt: "desc" }],
  });

  const totalStars = repos.reduce((s, r) => s + r.stars, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks, 0);
  const languages = new Set(repos.map((r) => r.language).filter(Boolean)).size;

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
            <span>workspace</span>
            <span>/</span>
            <span className="text-[hsl(var(--foreground))]">repositories</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-[hsl(var(--foreground))] mt-0.5">
            repository catalog
          </h1>
          <p className="font-mono text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
            {repos.length > 0
              ? `${repos.length} repositories indexed from GitHub`
              : "connect your github account to index your work"}
          </p>
        </div>

        <ImportButton hasRepos={repos.length > 0} />
      </div>

      {/* Summary stats */}
      {repos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "repositories", value: repos.length, icon: Code2 },
            { label: "total stars", value: totalStars, icon: Star },
            { label: "total forks", value: totalForks, icon: GitFork },
            { label: "languages", value: languages, icon: PackageOpen },
          ].map((s) => (
            <div
              key={s.label}
              className="paper-card p-4 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  {s.label}
                </span>
                <s.icon className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))] opacity-60" />
              </div>
              <p className="font-mono text-2xl font-normal text-[hsl(var(--foreground))] leading-tight pt-1">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {repos.length === 0 && (
        <div className="paper-card p-12 text-center space-y-3">
          <Code2 className="w-8 h-8 text-[hsl(var(--muted-foreground))] mx-auto opacity-50" />
          <h2 className="text-sm font-medium text-[hsl(var(--foreground))]">no repositories imported</h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))] max-w-xs mx-auto">
            click import repositories above to connect your github projects.
          </p>
        </div>
      )}

      {/* Repositories grid */}
      {repos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              indexed projects
            </span>
            <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
              {repos.length} items
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {repos.map((repo) => (
              <RepoCard
                key={repo.id}
                id={repo.id}
                name={repo.name}
                description={repo.description}
                language={repo.language}
                topics={repo.topics as string[]}
                stars={repo.stars}
                forks={repo.forks}
                url={repo.url}
                pushedAt={repo.pushedAt}
                isFork={repo.isFork}
                isArchived={repo.isArchived}
                hasInsights={!!repo.developerInsights}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
