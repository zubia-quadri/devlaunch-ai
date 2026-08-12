"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getLanguageColor } from "@/lib/utils";

interface LanguageDonutProps {
  data: { language: string; count: number }[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { language: string } }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg text-xs">
        <p className="font-semibold text-[hsl(var(--foreground))]">
          {payload[0].payload.language}
        </p>
        <p className="text-[hsl(var(--muted-foreground))]">
          {payload[0].value} repo{payload[0].value !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
    {(payload ?? []).map((entry) => (
      <div key={entry.value} className="flex items-center gap-1.5">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
          {entry.value}
        </span>
      </div>
    ))}
  </div>
);

export function LanguageDonut({ data }: LanguageDonutProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-[hsl(var(--muted-foreground))]">
        No language data yet
      </div>
    );
  }

  const chartData = data.slice(0, 8).map((d) => ({
    language: d.language,
    count: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="count"
          nameKey="language"
          strokeWidth={0}
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.language}
              fill={getLanguageColor(entry.language)}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
