import { SectionLabel } from "./PortfolioAbout";
import { getLanguageColor } from "@/lib/utils";

interface Skill {
  name: string;
  proficiencyScore: number;
  repoCount: number;
}

interface SkillsSectionProps {
  skills: Skill[];
  discoveredTech: string[];
}

export function SkillsSection({ skills, discoveredTech }: SkillsSectionProps) {
  if (skills.length === 0 && discoveredTech.length === 0) return null;

  return (
    <section id="skills" className="py-16 px-6 border-t border-[hsl(var(--border))]">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Language proficiency */}
        {skills.length > 0 && (
          <div>
            <SectionLabel>Skills</SectionLabel>
            <div className="mt-6 grid sm:grid-cols-2 gap-x-10 gap-y-4">
              {skills.map((skill) => {
                const color = getLanguageColor(skill.name);
                const pct = Math.min(100, skill.proficiencyScore);
                return (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        {skill.repoCount} repo{skill.repoCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[hsl(var(--accent))] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tech stack cloud */}
        {discoveredTech.length > 0 && (
          <div>
            <SectionLabel>Technology Stack</SectionLabel>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {discoveredTech.map((tech) => {
                const color = getLanguageColor(tech);
                return (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--accent)/0.4)] text-sm font-medium text-[hsl(var(--foreground)/0.85)] hover:border-[hsl(var(--primary)/0.3)] hover:bg-[hsl(var(--primary)/0.05)] transition-colors cursor-default"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    {tech}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
