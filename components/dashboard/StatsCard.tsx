import { type LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Card3D } from "@/components/ui/Card3D";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  delta?: string;
  deltaPositive?: boolean;
  delay?: number;
  sysId?: string;
}

const COLOR_THEMES: Record<
  string,
  {
    iconColor: string;
    iconBg: string;
    glowBg: string;
    badgeBorder: string;
    badgeText: string;
    badgeBg: string;
    beamGradient: string;
  }
> = {
  "SYS.01": {
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/15 border-blue-500/30",
    glowBg: "bg-blue-500/30",
    badgeBorder: "border-blue-500/30",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBg: "bg-blue-500/10",
    beamGradient: "via-blue-500",
  },
  "SYS.02": {
    iconColor: "text-amber-500 dark:text-amber-400",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30",
    glowBg: "bg-amber-500/30",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-700 dark:text-amber-300",
    badgeBg: "bg-amber-500/10",
    beamGradient: "via-amber-400",
  },
  "SYS.03": {
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-500/10 dark:bg-purple-500/15 border-purple-500/30",
    glowBg: "bg-purple-500/30",
    badgeBorder: "border-purple-500/30",
    badgeText: "text-purple-700 dark:text-purple-300",
    badgeBg: "bg-purple-500/10",
    beamGradient: "via-purple-500",
  },
  "SYS.04": {
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30",
    glowBg: "bg-emerald-500/30",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    badgeBg: "bg-emerald-500/10",
    beamGradient: "via-emerald-400",
  },
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaPositive,
  sysId = "SYS.01",
}: StatsCardProps) {
  const isNumber = typeof value === "number";
  const theme = COLOR_THEMES[sysId] || COLOR_THEMES["SYS.01"];

  return (
    <Card3D className="p-4 space-y-3 shadow-md hover:shadow-xl transition-all duration-300" intensity={10}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {sysId && (
            <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border font-semibold ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
              {sysId}
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-[hsl(var(--muted-foreground))]">
            {label}
          </span>
        </div>

        {/* 3D Elevated Icon Pod with Distinct Color Glow */}
        <div className="relative group">
          <div className={`absolute inset-0 rounded-lg blur-[6px] transition-opacity group-hover:opacity-100 opacity-60 ${theme.glowBg}`} />
          <div className={`relative w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${theme.iconBg} ${theme.iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-0.5">
        <p className="text-3xl font-semibold font-mono text-[hsl(var(--foreground))] tracking-tight select-none">
          {isNumber ? (
            <AnimatedCounter value={value as number} duration={600} />
          ) : (
            value
          )}
        </p>

        {delta && (
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
              deltaPositive
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
            }`}
          >
            {delta}
          </span>
        )}
      </div>

      {/* Cybernetic telemetry line indicator with matching vibrant beam */}
      <div className="h-[2px] w-full bg-slate-200/60 dark:bg-[hsl(var(--border)/0.4)] rounded-full overflow-hidden">
        <div className={`h-full w-1/3 bg-gradient-to-r from-transparent ${theme.beamGradient} to-transparent rounded-full animate-grid-beam-x`} />
      </div>
    </Card3D>
  );
}

