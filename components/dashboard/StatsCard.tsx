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

export function StatsCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaPositive,
  sysId,
}: StatsCardProps) {
  const isNumber = typeof value === "number";

  return (
    <Card3D className="p-4 space-y-3" intensity={10}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {sysId && (
            <span className="font-mono text-[9px] text-[#81ACEC]/80 bg-[#81ACEC]/10 px-1 py-0.5 rounded border border-[#81ACEC]/20">
              {sysId}
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            {label}
          </span>
        </div>

        {/* 3D Elevated Icon Pod with Glow */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-lg bg-[#81ACEC]/25 blur-[6px] transition-opacity group-hover:opacity-100 opacity-60" />
          <div className="relative w-8 h-8 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex items-center justify-center text-[#81ACEC] shadow-xs">
            <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-0.5">
        <p className="text-3xl font-normal font-mono text-[hsl(var(--foreground))] tracking-tight select-none">
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
                ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                : "bg-amber-500/15 text-amber-500 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
            }`}
          >
            {delta}
          </span>
        )}
      </div>

      {/* Cybernetic telemetry line indicator */}
      <div className="h-[2px] w-full bg-[hsl(var(--border)/0.4)] rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#81ACEC] to-transparent rounded-full animate-grid-beam-x" />
      </div>
    </Card3D>
  );
}

