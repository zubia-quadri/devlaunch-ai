import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sparkles, Code2 } from "lucide-react";
import { getLanguageColor } from "@/lib/utils";
import { GenerateBatchButton } from "@/components/insights/GenerateBatchButton";
import { SkillRing } from "@/components/skills/SkillRing";

export const metadata: Metadata = {
  title: "Developer Insights — DevLaunch AI Studio",
  description: "Your technology skills derived from GitHub repositories.",
};

const BLUEPRINT_COLORS = [
  { color: "#81ACEC", glow: "#81ACEC40" },
  { color: "#5ea685", glow: "#5ea68540" },
  { color: "#d19a4e", glow: "#d19a4e40" },
  { color: "#bf616a", glow: "#bf616a40" },
  { color: "#b48ead", glow: "#b48ead40" },
  { color: "#88c0d0", glow: "#88c0d040" },
];

export default async function SkillsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [skills, repos, allInsightRepos] = await Promise.all([
    prisma.userSkill.findMany({ where: { userId }, orderBy: { repoCount: "desc" } }),
    prisma.repository.findMany({
      where: { userId },
      include: { developerInsights: { select: { id: true, status: true } } },
      orderBy: { stars: "desc" },
    }),
    prisma.repository.findMany({
      where: { userId },
      include: { developerInsights: { select: { techStack: true, status: true } } },
    }),
  ]);

  const pendingCount = repos.filter(
    (r) => !r.developerInsights || r.developerInsights.status !== "DONE"
  ).length;
  const totalRepos = repos.length;

  const discoveredSkills = new Map<string, number>();
  for (const repo of allInsightRepos) {
    if (repo.developerInsights?.status === "DONE") {
      const stack = repo.developerInsights.techStack as string[];
      for (const tech of stack) {
        discoveredSkills.set(tech, (discoveredSkills.get(tech) ?? 0) + 1);
      }
    }
  }
  const discoveredList = Array.from(discoveredSkills.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24);

  const topRingSkills = skills.slice(0, 6);
  const remainingSkills = skills.slice(6);

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
            <span>workspace</span>
            <span>/</span>
            <span className="text-[hsl(var(--foreground))]">developer-insights</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-[hsl(var(--foreground))] mt-0.5">
            skills &amp; tech stack
          </h1>
          <p className="font-mono text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
            derived from {totalRepos} repositories · {discoveredList.length} technologies mapped
          </p>
        </div>

        {totalRepos > 0 && <GenerateBatchButton pendingCount={pendingCount} />}
      </div>

      {/* Empty State */}
      {skills.length === 0 && (
        <div className="paper-card p-12 text-center space-y-3">
          <Code2 className="w-8 h-8 text-[hsl(var(--muted-foreground))] mx-auto opacity-50" />
          <h2 className="text-sm font-medium text-[hsl(var(--foreground))]">no skills indexed</h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))] max-w-xs mx-auto">
            import your repositories first to evaluate your tech stack.
          </p>
        </div>
      )}

      {skills.length > 0 && (
        <>
          {/* Top Language Gauges */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                language proficiency
              </span>
              <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">top {topRingSkills.length}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {topRingSkills.map((skill, i) => {
                const bprint = BLUEPRINT_COLORS[i % BLUEPRINT_COLORS.length];
                const pct = Math.min(100, skill.proficiencyScore);
                return (
                  <div
                    key={skill.id}
                    className="paper-card p-4 flex flex-col items-center gap-2 text-center"
                  >
                    <div className="relative my-1">
                      <SkillRing pct={pct} color={bprint.color} glowColor={bprint.glow} size={80} stroke={6} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-base font-medium text-[hsl(var(--foreground))]">
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[hsl(var(--foreground))] truncate max-w-[100px]">{skill.name}</p>
                      <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                        {skill.repoCount} repo{skill.repoCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secondary languages */}
          {remainingSkills.length > 0 && (
            <div className="paper-card p-5 space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                additional languages
              </span>
              <div className="grid sm:grid-cols-2 gap-3">
                {remainingSkills.map((skill) => {
                  const color = getLanguageColor(skill.name);
                  const pct = Math.min(100, skill.proficiencyScore);
                  return (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          <span className="font-medium text-[hsl(var(--foreground))]">{skill.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{pct}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Discovered Tech Bento Grid */}
          {discoveredList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#81ACEC]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    ai-discovered stack
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                  frameworks · libraries · tools
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {discoveredList.map(([tech, count]) => (
                  <div
                    key={tech}
                    className="paper-card p-3 flex items-center justify-between gap-2"
                  >
                    <span className="text-xs font-medium text-[hsl(var(--foreground))] truncate">{tech}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] shrink-0">
                      ×{count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending note */}
          {pendingCount > 0 && discoveredList.length === 0 && (
            <div className="paper-card p-4 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#81ACEC] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-[hsl(var(--foreground))]">
                  {pendingCount} {pendingCount === 1 ? "repository needs" : "repositories need"} AI analysis
                </p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">
                  Click Generate Insights above to discover detected frameworks and tools.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
