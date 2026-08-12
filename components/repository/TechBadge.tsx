import { getLanguageColor } from "@/lib/utils";

interface TechBadgeProps {
  name: string;
  showDot?: boolean;
  size?: "sm" | "md";
}

export function TechBadge({ name, showDot = true, size = "sm" }: TechBadgeProps) {
  const color = getLanguageColor(name);
  const textSize = size === "md" ? "text-xs" : "text-[10px]";
  const padding = size === "md" ? "px-2.5 py-1" : "px-2 py-0.5";
  const dotSize = size === "md" ? "w-2 h-2" : "w-1.5 h-1.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${padding} rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--accent)/0.5)] ${textSize} font-medium text-[hsl(var(--foreground)/0.8)] whitespace-nowrap`}
    >
      {showDot && (
        <span
          className={`${dotSize} rounded-full shrink-0`}
          style={{ backgroundColor: color }}
        />
      )}
      {name}
    </span>
  );
}
