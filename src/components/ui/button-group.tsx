import * as React from "react";

import { cn } from "@/lib/utils";

function ButtonGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="button-group" className={cn("inline-flex items-center", className)} role="group" {...props} />;
}

function ButtonGroupSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="button-group-separator" className={cn("bg-border h-4 w-px", className)} {...props} />;
}

export { ButtonGroup, ButtonGroupSeparator };
