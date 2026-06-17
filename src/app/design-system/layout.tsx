import type { ReactNode } from "react";

import { DesignSystemShell } from "./_components/design-system-shell";

export default function DesignSystemLayout({ children }: { children: ReactNode }) {
  return <DesignSystemShell>{children}</DesignSystemShell>;
}
