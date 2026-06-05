"use client";

import type { VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "./button";

type XgenButtonColor = "primary" | "secondary" | "danger" | "success" | "info" | "discovery" | "caution" | "warning";
type XgenButtonVariant = "solid" | "soft" | "outline" | "ghost" | "link";
type XgenButtonSize = "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type XgenButtonProps = Omit<React.ComponentProps<typeof Button>, "color" | "variant" | "size"> & {
  color?: XgenButtonColor;
  variant?: XgenButtonVariant;
  size?: XgenButtonSize;
  pill?: boolean;
  block?: boolean;
  uniform?: boolean;
};

function mapVariant(color: XgenButtonColor, variant: XgenButtonVariant): VariantProps<typeof buttonVariants>["variant"] {
  if (variant === "link") return "link";
  if (variant === "ghost") return "ghost";
  if (variant === "outline") return "outline";
  if (variant === "soft") return "secondary";
  if (color === "danger") return "destructive";
  return "default";
}

function mapSize(size: XgenButtonSize, uniform?: boolean): VariantProps<typeof buttonVariants>["size"] {
  if (uniform) return "icon";
  if (size === "3xs" || size === "2xs" || size === "xs" || size === "sm") return "sm";
  if (size === "lg" || size === "xl" || size === "2xl" || size === "3xl") return "lg";
  return "default";
}

export function XgenButton({
  color = "secondary",
  variant = "soft",
  size = "md",
  pill = true,
  block = false,
  uniform = false,
  className,
  children,
  ...props
}: XgenButtonProps) {
  return (
    <Button
      variant={mapVariant(color, variant)}
      size={mapSize(size, uniform)}
      className={cn(pill && "rounded-full", block && "w-full", uniform && "px-0", className)}
      {...props}
    >
      {children}
    </Button>
  );
}
