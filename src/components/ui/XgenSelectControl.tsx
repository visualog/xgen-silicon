"use client";

import { ChevronDown } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

type XgenSelectVariant = "soft" | "outline" | "ghost";
type XgenSelectSize = "sm" | "md" | "lg";

export type XgenSelectControlProps = Omit<React.ComponentProps<"button">, "size" | "onClick"> & {
  variant?: XgenSelectVariant;
  size?: XgenSelectSize;
  block?: boolean;
  selected?: boolean;
  dropdownIconType?: "dropdown" | "chevronDown" | "none";
  StartIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onInteract?: () => void;
};

function mapVariant(variant: XgenSelectVariant): React.ComponentProps<typeof Button>["variant"] {
  if (variant === "outline") return "outline";
  if (variant === "ghost") return "ghost";
  return "secondary";
}

function mapSize(size: XgenSelectSize): React.ComponentProps<typeof Button>["size"] {
  if (size === "sm") return "sm";
  if (size === "lg") return "lg";
  return "default";
}

export function XgenSelectControl({
  variant = "soft",
  size = "md",
  block = true,
  selected = true,
  dropdownIconType = "dropdown",
  StartIcon,
  onInteract,
  className,
  children,
  ...props
}: XgenSelectControlProps) {
  return (
    <Button
      type="button"
      variant={mapVariant(variant)}
      size={mapSize(size)}
      aria-pressed={selected}
      onClick={onInteract}
      className={cn("justify-between rounded-full", block && "w-full", className)}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2">
        {StartIcon ? <StartIcon aria-hidden="true" className="size-4 shrink-0" /> : null}
        <span className="truncate">{children}</span>
      </span>
      {dropdownIconType !== "none" ? <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /> : null}
    </Button>
  );
}
