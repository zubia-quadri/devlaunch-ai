"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ActivityChartProps {
  data: { month: string; repos: number }[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl border border-[#81ACEC]/30 bg-[hsl(var(--card)/0.95)] backdrop-blur-md shadow-xl text-xs">
        <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-wider">{label}</p>
        <p className="font-mono font-semibold text-[#81ACEC] mt-0.5">
          {payload[0].value} {payload[0].value === 1 ? "push event" : "push events"}
        </p>
      </div>
    );
  }
  return null;
};

export function ActivityChart({ data }: ActivityChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-[hsl(var(--muted-foreground))]">
        No activity data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="barActivityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#81ACEC" stopOpacity={0.95} />
            <stop offset="70%" stopColor="#4f46e5" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="2 4"
          vertical={false}
          stroke="hsl(var(--border) / 0.5)"
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "JetBrains Mono" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "JetBrains Mono" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(129, 172, 236, 0.08)" }} />
        <Bar
          dataKey="repos"
          fill="url(#barActivityGrad)"
          radius={[6, 6, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

