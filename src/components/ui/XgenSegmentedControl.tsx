"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

export type XgenSegmentedOption<T extends string> = {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
};

type XgenSegmentedSize = "xs" | "sm" | "md" | "lg";

export type XgenSegmentedControlProps<T extends string> = {
  value: T;
  onChange?: (value: T) => void;
  options: XgenSegmentedOption<T>[];
  size?: XgenSegmentedSize;
  pill?: boolean;
  block?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

function mapSize(size: XgenSegmentedSize): "sm" | "default" | "lg" {
  if (size === "xs" || size === "sm") return "sm";
  if (size === "lg") return "lg";
  return "default";
}

export function XgenSegmentedControl<T extends string>({
  options,
  size = "sm",
  pill = false,
  block = false,
  className,
  value,
  onChange,
  id,
  "aria-label": ariaLabel,
}: XgenSegmentedControlProps<T>) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) onChange?.(nextValue as T);
      }}
      size={mapSize(size)}
      className={cn("xgen-segmented-control", block && "w-full", pill && "rounded-full", className)}
      id={id}
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.ariaLabel}
          disabled={option.disabled}
          size={mapSize(size)}
          className={cn(block && "flex-1", pill && "rounded-full")}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
