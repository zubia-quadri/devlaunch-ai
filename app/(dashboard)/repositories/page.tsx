import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RepoCard } from "@/components/repository/RepoCard";
import { ImportButton } from "@/components/repository/ImportButton";
import { GitFork, Star, Code2, PackageOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Repositories — DevLaunch AI",
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
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Repositories
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            {repos.length > 0
              ? `${repos.length} repositories imported from GitHub`
              : "Import your GitHub repositories to get started"}
          </p>
        </div>
        <ImportButton hasRepos={repos.length > 0} />
      </div>

      {/* Summary stats */}
      {repos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Repos", value: repos.length, icon: Code2, color: "text-violet-400", bg: "bg-violet-500/10" },
            { label: "Total Stars", value: totalStars, icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Total Forks", value: totalForks, icon: GitFork, color: "text-sky-400", bg: "bg-sky-500/10" },
            { label: "Languages", value: languages, icon: PackageOpen, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
            >
              <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${s.bg}`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-[hsl(var(--foreground))] leading-none">{s.value}</p>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {repos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--accent))] flex items-center justify-center mb-4">
            <Code2 className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
          </div>
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
            No repositories yet
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2 max-w-sm">
            Click <strong>Import Repos</strong> above to pull in your GitHub repositories.
            AI insights will be generated after import.
          </p>
        </div>
      )}

      {/* Repo grid */}
      {repos.length > 0 && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
              hasInsights={repo.developerInsights !== null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
