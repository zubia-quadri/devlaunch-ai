interface ComplexityBadgeProps {
  score: number; // 1–10
}

const levels = [
  { max: 2, label: "Trivial",     color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/20" },
  { max: 4, label: "Basic",       color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { max: 6, label: "Moderate",    color: "text-sky-400",     bg: "bg-sky-500/10",     border: "border-sky-500/20" },
  { max: 8, label: "Advanced",    color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20" },
  { max: 10, label: "Expert",     color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/20" },
];

export function ComplexityBadge({ score }: ComplexityBadgeProps) {
  const level = levels.find((l) => score <= l.max) ?? levels[levels.length - 1];

  return (
    <span
      title={`Complexity: ${score}/10`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${level.color} ${level.bg} ${level.border}`}
    >
      <span className="font-bold">{score}</span>
      <span className="opacity-70">/10</span>
      <span className="ml-0.5">{level.label}</span>
    </span>
  );
}
