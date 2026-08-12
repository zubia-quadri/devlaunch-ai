import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sparkles, Code2, Zap } from "lucide-react";
import { getLanguageColor } from "@/lib/utils";
import { GenerateBatchButton } from "@/components/insights/GenerateBatchButton";
import { SkillRing } from "@/components/skills/SkillRing";

export const metadata: Metadata = {
  title: "Developer Insights — DevLaunch AI",
  description: "Your technology skills derived from GitHub repositories.",
};

// Unique gradient pair per language position
const RING_GRADIENTS = [
  { color: "#818cf8", glow: "#a855f7" }, // violet
  { color: "#22d3ee", glow: "#06b6d4" }, // cyan
  { color: "#34d399", glow: "#10b981" }, // emerald
  { color: "#fb923c", glow: "#f59e0b" }, // amber
  { color: "#f472b6", glow: "#e879f9" }, // pink
  { color: "#60a5fa", glow: "#3b82f6" }, // blue
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
    <div className="p-6 space-y-8 max-w-6xl">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse-glow" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
              Developer Insights
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">
            Skills &amp; Stack
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Proficiency scores derived from {totalRepos} GitHub repositories
          </p>
        </div>
        {totalRepos > 0 && <GenerateBatchButton pendingCount={pendingCount} />}
      </div>

      {/* ── Empty state ── */}
      {skills.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in-up">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[hsl(var(--primary)/0.15)] to-violet-500/10 flex items-center justify-center">
              <Code2 className="w-10 h-10 text-[hsl(var(--primary)/0.5)]" />
            </div>
            <div className="absolute inset-0 rounded-3xl bg-[hsl(var(--primary)/0.05)] blur-xl" />
          </div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">No skills yet</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2 max-w-xs">
            Import your GitHub repositories first, then skills will be auto-computed.
          </p>
        </div>
      )}

      {skills.length > 0 && (
        <>
          {/* ── Ring grid — top languages ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-5 animate-fade-in-up delay-75">
              Language Proficiency
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {topRingSkills.map((skill, i) => {
                const grad = RING_GRADIENTS[i % RING_GRADIENTS.length];
                const pct = Math.min(100, skill.proficiencyScore);
                return (
                  <div
                    key={skill.id}
                    className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] ombre-glow shine animate-fade-in-up"
                    style={{ animationDelay: `${100 + i * 80}ms` }}
                  >
                    {/* Ambient glow behind ring */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(ellipse at 50% 40%, ${grad.color}18 0%, transparent 70%)`,
                      }}
                    />
                    {/* Ring */}
                    <div className="relative">
                      <SkillRing pct={pct} color={grad.color} glowColor={grad.glow} size={100} stroke={8} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-[hsl(var(--foreground))] tabular-nums">
                          {pct}%
                        </span>
                      </div>
                    </div>
                    {/* Label */}
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{skill.name}</p>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">
                        {skill.repoCount} repo{skill.repoCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Secondary languages (bar style, compact) ── */}
          {remainingSkills.length > 0 && (
            <div className="p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] animate-fade-in-up delay-300">
              <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-4">
                Other Languages
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {remainingSkills.map((skill, i) => {
                  const color = getLanguageColor(skill.name);
                  const pct = Math.min(100, skill.proficiencyScore);
                  return (
                    <div key={skill.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          <span className="font-medium text-[hsl(var(--foreground))]">{skill.name}</span>
                        </div>
                        <span className="text-[hsl(var(--muted-foreground))] tabular-nums">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[hsl(var(--accent))] overflow-hidden">
                        <div
                          className="h-full rounded-full animate-bar-fill"
                          style={{ width: `${pct}%`, backgroundColor: color, animationDelay: `${400 + i * 50}ms` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── AI-discovered tech — bento grid ── */}
          {discoveredList.length > 0 && (
            <div className="animate-fade-in-up delay-375">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                    AI-Discovered Stack
                  </p>
                </div>
                <div className="flex-1 h-px bg-[hsl(var(--border))]" />
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                  frameworks · libraries · tools
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {discoveredList.map(([tech, count], i) => {
                  const color = getLanguageColor(tech);
                  const intensity = Math.min(1, count / (discoveredList[0]?.[1] ?? 1));
                  return (
                    <div
                      key={tech}
                      className="group relative flex items-center gap-3 p-3.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] ombre-glow animate-fade-in-up cursor-default"
                      style={{ animationDelay: `${400 + i * 30}ms` }}
                    >
                      {/* Colored left accent */}
                      <div
                        className="w-0.5 h-8 rounded-full shrink-0 opacity-60"
                        style={{ backgroundColor: color }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">{tech}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex-1 h-1 rounded-full bg-[hsl(var(--accent))]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${intensity * 100}%`, backgroundColor: color, opacity: 0.7 }}
                            />
                          </div>
                          <span className="text-[10px] text-[hsl(var(--muted-foreground))] shrink-0">
                            ×{count}
                          </span>
                        </div>
                      </div>
                      {/* Hover ambient */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `${color}08` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Pending note ── */}
          {pendingCount > 0 && discoveredList.length === 0 && (
            <div className="flex items-start gap-3 p-5 rounded-2xl border border-[hsl(var(--primary)/0.15)] bg-[hsl(var(--primary)/0.04)] animate-fade-in-up delay-300">
              <div className="animate-pulse-glow mt-0.5">
                <Zap className="w-4 h-4 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[hsl(var(--foreground))]">
                  {pendingCount} {pendingCount === 1 ? "repository hasn't" : "repositories haven't"} been AI-analysed yet
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  Click <strong>Generate Insights</strong> above to discover your full tech stack beyond just primary languages.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
