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
  title: "템플릿 | xGen 디자인 시스템",
  description: "shadcn/ui 기반 xGen 화면 템플릿 기준.",
};

const templates = [
  {
    name: "Generation entry",
    route: "/",
    purpose: "Prompt-first generation start using shadcn form and action primitives.",
    regions: ["header", "prompt card", "reference controls", "gallery summary"],
  },
  {
    name: "Canvas workspace",
    route: "/ active workspace",
    purpose: "Responsive working surface for generated outputs and node-like controls.",
    regions: ["topbar", "tool rail", "canvas", "result card"],
  },
  {
    name: "Design documentation",
    route: "/design-system/*",
    purpose: "Pure shadcn documentation pages without xGen compatibility wrappers.",
    regions: ["docs nav", "hero", "registry blocks", "directory"],
  },
];

export default function TemplatesPage() {
  return (
    <main className="shadcn-docs-surface min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm font-medium" aria-label="Template navigation">
            <Link href="/" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/design-system" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground">
              Design system
            </Link>
            <Link href="/design-system/components" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground">
              Components
            </Link>
            <Link href="/design-system/templates" className="rounded-md border px-3 py-1.5 text-foreground shadow-xs">
              Templates
            </Link>
          </nav>
          <Button asChild size="sm" variant="outline">
            <Link href="/design-system/components">Components</Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <section className="mx-auto max-w-3xl space-y-5 text-center">
          <Badge variant="outline">shadcn block templates</Badge>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Templates define composition, not another token system.
          </h1>
          <p className="text-muted-foreground text-base leading-7 text-balance sm:text-lg">
            Use these templates as shadcn-native layout contracts. App-specific legacy tokens should not be introduced into
            this documentation route.
          </p>
        </section>

        <section className="mt-16 grid gap-4 lg:grid-cols-3 lg:gap-6">
          {templates.map((template) => (
            <Card key={template.name}>
              <CardHeader>
                <Badge className="w-fit" variant="secondary">{template.route}</Badge>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.purpose}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="grid gap-2">
                    <div className="h-3 w-2/5 rounded-full bg-muted-foreground/20" />
                    <div className="h-20 rounded-lg bg-background" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-10 rounded-md bg-background" />
                      <div className="h-10 rounded-md bg-background" />
                      <div className="h-10 rounded-md bg-background" />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {template.regions.map((region) => (
                    <Badge key={region} variant="outline">{region}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
