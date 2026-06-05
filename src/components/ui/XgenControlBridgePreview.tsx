"use client";

import { SlidersHorizontal, Wand2 } from "lucide-react";
import { useState } from "react";
import { XgenBadge } from "./XgenBadge";
import { XgenButton } from "./XgenButton";
import { XgenSegmentedControl } from "./XgenSegmentedControl";
import { XgenSelectControl } from "./XgenSelectControl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

type RatioValue = "1:1" | "4:5" | "16:9";

export function XgenControlBridgePreview() {
  const [ratio, setRatio] = useState<RatioValue>("1:1");
  const [quality, setQuality] = useState("HD");

  return (
    <div className="grid w-full gap-4 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(260px,0.72fr)]">
      <div className="grid min-w-0 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">shadcn/ui bridge</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-normal text-foreground">Output control block</h3>
        </div>
        <XgenSegmentedControl
          aria-label="출력 비율"
          value={ratio}
          onChange={(nextValue) => setRatio(nextValue)}
          options={[
            { value: "1:1", label: "1:1" },
            { value: "4:5", label: "4:5" },
            { value: "16:9", label: "16:9" },
          ]}
          block
        />
        <XgenSelectControl
          StartIcon={SlidersHorizontal}
          onInteract={() => setQuality((current) => (current === "HD" ? "4K" : "HD"))}
        >
          {quality} render
        </XgenSelectControl>
        <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
          <XgenButton color="primary" variant="solid" block>
            <Wand2 />
            생성
          </XgenButton>
          <XgenButton variant="ghost" block>
            초기화
          </XgenButton>
        </div>
      </div>
      <Card className="gap-4 py-4">
        <CardHeader className="flex grid-cols-none flex-row items-start justify-between gap-3 px-4">
          <div className="min-w-0">
            <CardDescription>Selected output</CardDescription>
            <CardTitle className="mt-1 text-2xl">{ratio} / {quality}</CardTitle>
          </div>
          <XgenBadge color="success">Ready</XgenBadge>
        </CardHeader>
        <CardContent className="px-4">
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 border-t border-border pt-4 text-sm">
          <dt className="font-medium text-muted-foreground">Ratio</dt>
          <dd className="text-right">{ratio}</dd>
          <dt className="font-medium text-muted-foreground">Quality</dt>
          <dd className="text-right">{quality}</dd>
          <dt className="font-medium text-muted-foreground">Boundary</dt>
          <dd className="text-right">local wrapper</dd>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
