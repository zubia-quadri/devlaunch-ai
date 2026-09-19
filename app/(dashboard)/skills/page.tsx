import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sparkles, Code2, Cpu, Layers } from "lucide-react";
import { getLanguageColor } from "@/lib/utils";
import { GenerateBatchButton } from "@/components/insights/GenerateBatchButton";
import { SkillRing } from "@/components/skills/SkillRing";
import { Card3D } from "@/components/ui/Card3D";

export const metadata: Metadata = {
  title: "Developer Insights — BuildFolio Studio",
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
    <div className="p-4 sm:p-8 space-y-7 max-w-5xl mx-auto w-full">
      {/* ── 3D Futuristic HUD Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.65)] backdrop-blur-md shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-20 bg-[#81ACEC]/15 blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
            <span className="inline-flex items-center gap-1 text-[#81ACEC] bg-[#81ACEC]/10 px-2 py-0.5 rounded-full border border-[#81ACEC]/25 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#81ACEC] animate-pulse" />
              SKILL.MATRIX // ACTIVE
            </span>
            <span>//</span>
            <span className="text-[hsl(var(--foreground))]">TECH.DEEP-SCAN</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-[hsl(var(--foreground))] pt-0.5">
            skills &amp; technology stack
          </h1>
          <p className="font-mono text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-2">
            <span>derived from {totalRepos} repositories</span>
            <span>·</span>
            <span className="text-[#81ACEC] font-semibold">{discoveredList.length} technologies mapped</span>
          </p>
        </div>

        <div className="relative z-10">
          {totalRepos > 0 && <GenerateBatchButton pendingCount={pendingCount} />}
        </div>
      </div>

      {/* Empty State */}
      {skills.length === 0 && (
        <div className="card-3d p-12 text-center space-y-4">
          <Code2 className="w-10 h-10 text-[#81ACEC] mx-auto opacity-75 animate-bounce" />
          <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">no skills indexed yet</h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))] max-w-xs mx-auto leading-relaxed">
            import your repositories first to evaluate and render your 3D technology matrix.
          </p>
        </div>
      )}

      {skills.length > 0 && (
        <>
          {/* Top Language Gauges in 3D */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#81ACEC] shadow-[0_0_8px_#81ACEC]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  language proficiency gauges
                </span>
              </div>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                TOP {topRingSkills.length} MODULES
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {topRingSkills.map((skill, i) => {
                const bprint = BLUEPRINT_COLORS[i % BLUEPRINT_COLORS.length];
                const pct = Math.min(100, skill.proficiencyScore);
                return (
                  <Card3D
                    key={skill.id}
                    className="p-4 flex flex-col items-center gap-2 text-center group"
                    intensity={12}
                  >
                    <div className="relative my-1">
                      <SkillRing pct={pct} color={bprint.color} glowColor={bprint.glow} size={80} stroke={6} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-base font-bold text-[hsl(var(--foreground))] group-hover:text-[#81ACEC] transition-colors">
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[hsl(var(--foreground))] truncate max-w-[100px]">{skill.name}</p>
                      <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                        {skill.repoCount} {skill.repoCount === 1 ? "repo" : "repos"}
                      </p>
                    </div>
                  </Card3D>
                );
              })}
            </div>
          </div>

          {/* Secondary languages */}
          {remainingSkills.length > 0 && (
            <div className="card-3d p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[hsl(var(--border)/0.5)] pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#81ACEC]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    additional language index
                  </span>
                </div>
                <span className="font-mono text-[9px] text-[hsl(var(--muted-foreground))]">{remainingSkills.length} languages</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {remainingSkills.map((skill) => {
                  const color = getLanguageColor(skill.name);
                  const pct = Math.min(100, skill.proficiencyScore);
                  return (
                    <div key={skill.id} className="space-y-1.5 p-2 rounded-lg hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: color }} />
                          <span className="font-semibold text-[hsl(var(--foreground))]">{skill.name}</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-[hsl(var(--muted-foreground))]">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 shadow-xs"
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
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-[#81ACEC]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    ai-discovered framework &amp; tool architecture
                  </span>
                </div>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                  {discoveredList.length} EXTRACTED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {discoveredList.map(([tech, count]) => (
                  <div
                    key={tech}
                    className="card-3d p-3.5 flex items-center justify-between gap-2 group hover:-translate-y-1 hover:border-[#81ACEC]/50 hover:shadow-[0_0_15px_rgba(129,172,236,0.2)] transition-all duration-200"
                  >
                    <span className="text-xs font-medium text-[hsl(var(--foreground))] group-hover:text-[#81ACEC] transition-colors truncate">
                      {tech}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#81ACEC]/10 text-[#81ACEC] border border-[#81ACEC]/20 shrink-0">
                      ×{count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending note */}
          {pendingCount > 0 && discoveredList.length === 0 && (
            <div className="card-3d p-4 flex items-start gap-3 border-amber-500/30">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[hsl(var(--foreground))]">
                  {pendingCount} {pendingCount === 1 ? "repository needs" : "repositories need"} AI analysis
                </p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">
                  Click Generate Insights above to discover detected frameworks, libraries, and security tools.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
