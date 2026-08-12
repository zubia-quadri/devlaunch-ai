import { Sparkles, Users, Lightbulb, Code2, Clock } from "lucide-react";
import { ComplexityBadge } from "./ComplexityBadge";
import { TechBadge } from "@/components/repository/TechBadge";
import { formatRelativeTime } from "@/lib/utils";

interface InsightsPanelProps {
  summary: string | null;
  highlights: string[];
  techStack: string[];
  useCases: string | null;
  targetAudience: string | null;
  complexityScore: number | null;
  analyzedAt: Date | null;
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
        <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

export function InsightsPanel({
  summary,
  highlights,
  techStack,
  useCases,
  targetAudience,
  complexityScore,
  analyzedAt,
}: InsightsPanelProps) {
  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Developer Insights
          </h2>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] border border-[hsl(var(--primary)/0.2)] font-medium">
            AI Generated
          </span>
        </div>
        {analyzedAt && (
          <span className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(analyzedAt)}
          </span>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <Section icon={Sparkles} title="Summary">
          <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed">
            {summary}
          </p>
        </Section>
      )}

      {/* Highlights */}
      {highlights.length > 0 && (
        <Section icon={Lightbulb} title="Key Highlights">
          <ul className="space-y-2">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-[hsl(var(--foreground))]">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] shrink-0" />
                <span className="leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Tech Stack */}
      {techStack.length > 0 && (
        <Section icon={Code2} title="Technologies Detected">
          <div className="flex flex-wrap gap-2">
            {techStack.map((t) => (
              <TechBadge key={t} name={t} size="md" />
            ))}
          </div>
        </Section>
      )}

      {/* Use Cases & Audience row */}
      <div className="grid sm:grid-cols-2 gap-4">
        {useCases && (
          <Section icon={Lightbulb} title="Use Cases">
            <p className="text-sm text-[hsl(var(--foreground)/0.85)] leading-relaxed">
              {useCases}
            </p>
          </Section>
        )}
        {targetAudience && (
          <Section icon={Users} title="Target Audience">
            <p className="text-sm text-[hsl(var(--foreground)/0.85)] leading-relaxed">
              {targetAudience}
            </p>
          </Section>
        )}
      </div>

      {/* Complexity */}
      {complexityScore !== null && (
        <Section icon={Code2} title="Complexity">
          <ComplexityBadge score={complexityScore} />
        </Section>
      )}
    </div>
  );
}
