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
import { formatMonth } from "@/lib/utils";

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
      <div className="px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg text-xs">
        <p className="font-semibold text-[hsl(var(--foreground))]">{label}</p>
        <p className="text-[hsl(var(--muted-foreground))]">
          {payload[0].value} push{payload[0].value !== 1 ? "es" : ""}
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
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border))"
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))" }} />
        <Bar
          dataKey="repos"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
