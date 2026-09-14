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
      <div className="px-3 py-2 rounded-xl border border-[#81ACEC]/30 bg-[hsl(var(--card)/0.95)] backdrop-blur-md shadow-xl text-xs">
        <p className="font-semibold text-[hsl(var(--foreground))]">
          {payload[0].payload.language}
        </p>
        <p className="font-mono text-[10px] text-[#81ACEC] mt-0.5">
          {payload[0].value} {payload[0].value === 1 ? "repository" : "repositories"}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => (
  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-2">
    {(payload ?? []).map((entry) => (
      <div key={entry.value} className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.6)]">
        <span
          className="inline-block w-2 h-2 rounded-full shrink-0 shadow-[0_0_6px_currentColor]"
          style={{ backgroundColor: entry.color, color: entry.color }}
        />
        <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
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

  const totalReposCount = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="relative">
      {/* Center Radar / Total count label */}
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none z-10">
        <p className="text-xl font-bold font-mono text-[hsl(var(--foreground))] tracking-tight">
          {chartData.length}
        </p>
        <p className="text-[9px] font-mono uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          LANGS
        </p>
      </div>

      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={54}
            outerRadius={78}
            paddingAngle={4}
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
    </div>
  );
}

