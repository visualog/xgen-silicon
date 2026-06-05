"use client";

import type { VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

import { Badge, badgeVariants } from "./badge";

type XgenBadgeColor = "primary" | "secondary" | "danger" | "success" | "info" | "discovery" | "caution" | "warning";
type XgenBadgeVariant = "solid" | "soft" | "outline";
type XgenBadgeSize = "xs" | "sm" | "md" | "lg";

export type XgenBadgeProps = Omit<React.ComponentProps<typeof Badge>, "color" | "variant"> & {
  color?: XgenBadgeColor;
  variant?: XgenBadgeVariant;
  size?: XgenBadgeSize;
  pill?: boolean;
};

function mapVariant(color: XgenBadgeColor, variant: XgenBadgeVariant): VariantProps<typeof badgeVariants>["variant"] {
  if (variant === "outline") return "outline";
  if (variant === "solid" && color === "danger") return "destructive";
  if (variant === "solid" && color === "primary") return "default";
  return "secondary";
}

export function XgenBadge({
  color = "secondary",
  variant = "soft",
  size = "md",
  pill = true,
  className,
  children,
  ...props
}: XgenBadgeProps) {
  return (
    <Badge
      variant={mapVariant(color, variant)}
      className={cn(
        pill && "rounded-full",
        size === "xs" && "px-1.5 text-[10px]",
        size === "lg" && "px-2.5 py-1 text-sm",
        color === "success" && "bg-emerald-50 text-emerald-700 border-transparent",
        color === "warning" && "bg-amber-50 text-amber-700 border-transparent",
        color === "info" && "bg-sky-50 text-sky-700 border-transparent",
        className
      )}
      {...props}
    >
      {children}
    </Badge>
  );
}
