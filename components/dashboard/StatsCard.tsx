// Server Component — no "use client" needed.
// AnimatedCounter is a client component rendered as a child — that's fine.
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
  glowClass?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  delta,
  deltaPositive,
  delay = 0,
  glowClass = "card-hover",
}: StatsCardProps) {
  const isNumber = typeof value === "number";

  return (
    <div
      className={`group flex items-center gap-4 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] ombre-glow shine animate-fade-in-up ${glowClass}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon */}
      <div
        className={`relative flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${iconBg} transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>

      <div className="min-w-0">
        <p className="text-2xl font-bold text-[hsl(var(--foreground))] leading-none tabular-nums">
          {isNumber ? (
            <AnimatedCounter value={value as number} duration={900} />
          ) : (
            value
          )}
        </p>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{label}</p>
        {delta && (
          <p
            className={`text-[10px] mt-0.5 font-medium ${
              deltaPositive ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {delta}
          </p>
        )}
      </div>
    </div>
  );
}
