"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { stage: "Prompt", renders: 72 },
  { stage: "Style", renders: 56 },
  { stage: "Output", renders: 84 },
  { stage: "Gallery", renders: 64 },
  { stage: "Review", renders: 92 },
];

const chartConfig = {
  renders: {
    label: "Progress",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function RenderProgressChart() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 0, right: 0, top: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis hide domain={[0, 100]} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="renders"
          type="natural"
          fill="var(--color-renders)"
          fillOpacity={0.2}
          stroke="var(--color-renders)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
