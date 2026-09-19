import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RepoCard } from "@/components/repository/RepoCard";
import { ImportButton } from "@/components/repository/ImportButton";
import { GitFork, Star, Code2, PackageOpen } from "lucide-react";
import { Card3D } from "@/components/ui/Card3D";

export const metadata: Metadata = {
  title: "Repositories — BuildFolio Studio",
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
    <div className="p-4 sm:p-8 space-y-7 max-w-5xl mx-auto w-full">
      {/* ── 3D Futuristic HUD Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.65)] backdrop-blur-md shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-20 bg-[#81ACEC]/15 blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
            <span className="inline-flex items-center gap-1 text-[#81ACEC] bg-[#81ACEC]/10 px-2 py-0.5 rounded-full border border-[#81ACEC]/25 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#81ACEC] animate-pulse" />
              REPO.INDEX // ACTIVE
            </span>
            <span>//</span>
            <span className="text-[hsl(var(--foreground))]">CATALOG.VIEW</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-[hsl(var(--foreground))] pt-0.5">
            repository catalog
          </h1>
          <p className="font-mono text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-2">
            <span>{repos.length} repositories indexed from GitHub</span>
            <span>·</span>
            <span className="text-[#81ACEC] font-semibold">{totalStars} total stars</span>
          </p>
        </div>

        <div className="relative z-10">
          <ImportButton hasRepos={repos.length > 0} />
        </div>
      </div>

      {/* ── Summary Stats in 3D ── */}
      {repos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {[
            { sysId: "SYS.01", label: "repositories", value: repos.length, icon: Code2, color: "#81ACEC" },
            { sysId: "SYS.02", label: "total stars", value: totalStars, icon: Star, color: "#f59e0b" },
            { sysId: "SYS.03", label: "total forks", value: totalForks, icon: GitFork, color: "#81ACEC" },
            { sysId: "SYS.04", label: "languages", value: languages, icon: PackageOpen, color: "#10b981" },
          ].map((s) => (
            <Card3D
              key={s.label}
              className="p-4 space-y-3 group"
              intensity={10}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] text-[#81ACEC]/80 bg-[#81ACEC]/10 px-1 py-0.5 rounded border border-[#81ACEC]/20">
                    {s.sysId}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    {s.label}
                  </span>
                </div>
                <div className="relative">
                  <div className="w-7 h-7 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex items-center justify-center text-[hsl(var(--foreground))] group-hover:text-[#81ACEC] transition-colors">
                    <s.icon className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
              <p className="font-mono text-3xl font-normal text-[hsl(var(--foreground))] leading-tight select-none">
                {s.value}
              </p>
              <div className="h-[2px] w-full bg-[hsl(var(--border)/0.4)] rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#81ACEC] to-transparent rounded-full animate-grid-beam-x" />
              </div>
            </Card3D>
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
