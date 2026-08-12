import { Star, GitFork, Code2, Sparkles, TrendingUp } from "lucide-react";
import { SectionLabel } from "./PortfolioAbout";

interface CareerHighlightsProps {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  languageCount: number;
  topLanguage: string | null;
  insightCount: number;
}

export function CareerHighlights({
  totalRepos,
  totalStars,
  totalForks,
  languageCount,
  topLanguage,
  insightCount,
}: CareerHighlightsProps) {
  const tiles = [
    {
      icon: Code2,
      value: totalRepos,
      label: "Public Repositories",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      icon: Star,
      value: totalStars,
      label: "Total Stars Earned",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      icon: GitFork,
      value: totalForks,
      label: "Times Forked",
      color: "text-sky-400",
      bg: "bg-sky-500/10",
    },
    {
      icon: TrendingUp,
      value: languageCount,
      label: "Languages Used",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Sparkles,
      value: insightCount,
      label: "AI-Analysed Projects",
      color: "text-[hsl(var(--primary))]",
      bg: "bg-[hsl(var(--primary)/0.1)]",
    },
  ];

  return (
    <section
      id="highlights"
      className="py-16 px-6 border-t border-[hsl(var(--border))] bg-[hsl(var(--accent)/0.2)]"
    >
      <div className="max-w-5xl mx-auto">
        <SectionLabel>Career Highlights</SectionLabel>
        {topLanguage && (
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Primary language:{" "}
            <span className="font-semibold text-[hsl(var(--foreground))]">{topLanguage}</span>
          </p>
        )}

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {tiles.map(({ icon: Icon, value, label, color, bg }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-center"
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
                {value.toLocaleString()}
              </p>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))] leading-snug">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
