// Circular SVG progress ring — pure server component, no JS needed for the arc
interface RingProps {
  pct: number;
  color: string;
  glowColor: string;
  size?: number;
  stroke?: number;
}

export function SkillRing({ pct, color, glowColor, size = 140, stroke = 10 }: RingProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const cx = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      {/* Glow filter */}
      <defs>
        <filter id={`glow-${color.replace(/[^a-z0-9]/gi, "")}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`grad-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke="hsl(216 34% 17%)"
        strokeWidth={stroke}
      />
      {/* Progress arc */}
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke={`url(#grad-${color.replace(/[^a-z0-9]/gi, "")})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        filter={`url(#glow-${color.replace(/[^a-z0-9]/gi, "")})`}
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
      />
      {/* End dot glow */}
      <circle
        cx={cx + r * Math.cos((2 * Math.PI * pct) / 100 - Math.PI / 2)}
        cy={cx + r * Math.sin((2 * Math.PI * pct) / 100 - Math.PI / 2)}
        r={stroke / 2}
        fill={color}
        filter={`url(#glow-${color.replace(/[^a-z0-9]/gi, "")})`}
        style={{ transform: "rotate(90deg)", transformOrigin: "50% 50%" }}
      />
    </svg>
  );
}
