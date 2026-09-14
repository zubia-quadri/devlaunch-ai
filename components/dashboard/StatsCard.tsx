import { type LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  delta?: string;
  deltaPositive?: boolean;
  delay?: number;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaPositive,
}: StatsCardProps) {
  const isNumber = typeof value === "number";

  return (
    <div className="paper-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          {label}
        </span>
        <div className="w-7 h-7 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] flex items-center justify-center text-[hsl(var(--foreground))]">
          <Icon className="w-3.5 h-3.5 opacity-75" />
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <p className="text-2xl font-normal font-mono text-[hsl(var(--foreground))] tracking-tight">
          {isNumber ? (
            <AnimatedCounter value={value as number} duration={600} />
          ) : (
            value
          )}
        </p>

        {delta && (
          <span
            className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
              deltaPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
