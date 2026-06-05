"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const toggleGroupVariants = cva("inline-flex items-center rounded-md bg-muted p-1 text-muted-foreground", {
  variants: {
    size: {
      sm: "h-8",
      default: "h-9",
      lg: "h-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const toggleGroupItemVariants = cva(
  "inline-flex min-w-0 items-center justify-center gap-2 rounded-sm px-3 text-sm font-medium whitespace-nowrap transition-colors hover:bg-background/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-xs [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "h-6 px-2 text-xs",
        default: "h-7",
        lg: "h-8 px-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

function ToggleGroup({
  className,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleGroupVariants>) {
  return <ToggleGroupPrimitive.Root data-slot="toggle-group" className={cn(toggleGroupVariants({ size }), className)} {...props} />;
}

function ToggleGroupItem({
  className,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleGroupItemVariants>) {
  return <ToggleGroupPrimitive.Item data-slot="toggle-group-item" className={cn(toggleGroupItemVariants({ size }), className)} {...props} />;
}

export { ToggleGroup, ToggleGroupItem };
