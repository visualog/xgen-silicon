import Link from "next/link";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";

export const metadata = {
  title: "디자인 시스템 | xGen",
  description: "shadcn/ui 기반 xGen 인터페이스 기준.",
};

const foundations = [
  {
    title: "Theme",
    description: "Use shadcn CSS variables from globals.css as the runtime foundation.",
    items: ["background", "foreground", "card", "muted", "border", "ring"],
  },
  {
    title: "Components",
    description: "Install official registry components and replace only the product content.",
    items: ["button", "card", "input", "select", "switch", "chart"],
  },
  {
    title: "Composition",
    description: "Build screens from responsive blocks instead of custom one-off inline styles.",
    items: ["container", "grid", "section", "directory"],
  },
];

export default function DesignSystemPage() {
  return (
    <main className="shadcn-docs-surface min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm font-medium" aria-label="Design system navigation">
            <Link href="/" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/design-system" className="rounded-md border px-3 py-1.5 text-foreground shadow-xs">
              Design system
            </Link>
            <Link href="/design-system/components" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground">
              Components
            </Link>
            <Link href="/design-system/templates" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground">
              Templates
            </Link>
          </nav>
          <Button asChild size="sm">
            <Link href="/design-system/components">Open registry page</Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Badge variant="outline">shadcn/ui foundation</Badge>
          <div className="space-y-5">
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              xGen design system now starts from shadcn/ui.
            </h1>
            <p className="text-muted-foreground text-base leading-7 text-balance sm:text-lg">
              This route documents the active runtime source of truth: shadcn theme variables, official registry components,
              and responsive block composition.
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-3 md:gap-6">
          {foundations.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>

        <Separator className="my-16" />

        <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-3">
            <Badge variant="outline">Runtime boundary</Badge>
            <h2 className="text-3xl font-semibold tracking-tight">What is not the active foundation</h2>
            <p className="text-muted-foreground leading-7">
              `design-md` remains archived for historical reference only. Production app compatibility tokens can stay for
              older screens, but design-system pages should use shadcn primitives and token classes directly.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Archived</CardTitle>
                <CardDescription>Kept out of runtime imports.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <code>design-md/variables.css</code>
                <code>design-md/theme.css</code>
                <code>scripts/sync-design-tokens.mjs</code>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active</CardTitle>
                <CardDescription>Allowed on design-system pages.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <code>components.json</code>
                <code>src/components/ui/*</code>
                <code>bg-background text-foreground</code>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
