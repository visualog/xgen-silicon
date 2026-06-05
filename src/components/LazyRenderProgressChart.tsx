"use client";

import dynamic from "next/dynamic";

const RenderProgressChart = dynamic(
  () => import("@/components/RenderProgressChart").then((mod) => mod.RenderProgressChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full rounded-md bg-muted/30" role="status">
        <span className="sr-only">Loading chart</span>
      </div>
    ),
  }
);

export function LazyRenderProgressChart() {
  return <RenderProgressChart />;
}
