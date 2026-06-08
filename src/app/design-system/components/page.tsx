import Link from "next/link";
import { Bell, CheckCircle2, ImageIcon, Layers3, Moon, Plus, WandSparkles } from "lucide-react";

import { LazyRenderProgressChart } from "@/components/LazyRenderProgressChart";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui";

export const metadata = {
  title: "컴포넌트 | xGen 디자인 시스템",
  description: "xGen 사이트와 앱에서 사용하는 컴포넌트 기준.",
};

const catalogGroups = [
  {
    title: "Button",
    description: "명령, 보조 이동, 아이콘 조작을 담당합니다.",
    items: ["Default", "Secondary", "Outline", "Ghost"],
  },
  {
    title: "Badge",
    description: "상태, 메타데이터, 추가됨 여부를 짧게 표시합니다.",
    items: ["Default", "Secondary", "Outline"],
  },
  {
    title: "Card",
    description: "반복되는 정보 단위와 제품 블록을 구성합니다.",
    items: ["Header", "Content", "Footer"],
  },
  {
    title: "Input",
    description: "검색, 프롬프트, 이름 입력에 사용합니다.",
    items: ["Default", "Placeholder", "Focus"],
  },
  {
    title: "ToggleGroup",
    description: "비율, 스타일, 품질처럼 단일 선택값을 조작합니다.",
    items: ["Single", "Ratio", "Quality"],
  },
  {
    title: "Layout",
    description: "Container, Stack, Grid 조합으로 화면을 구성합니다.",
    items: ["Container", "Grid", "Stack"],
  },
];

const generationRows = [
  ["Character sheet", "Preview", "64%"],
  ["Product poster", "Final", "Queued"],
  ["Gallery cover", "Analysis", "Ready"],
];

const bodyShellClassName = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const pageShellClassName = "mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28";
const centeredSectionClassName = "mx-auto grid w-full max-w-5xl";
const sectionStackClassName = `${centeredSectionClassName} gap-8 lg:gap-10`;

export default function ComponentsPage() {
  return (
    <main className="shadcn-docs-surface min-h-screen bg-background text-foreground">
      <header className="w-full border-b">
        <div className={`${bodyShellClassName} flex h-14 items-center justify-between gap-4`}>
          <nav
            className="flex items-center gap-1 text-sm font-medium"
            aria-label="Design system navigation"
          >
            <Link
              href="/"
              className="rounded-md border px-3 py-1.5 text-foreground shadow-xs"
              aria-current="page"
            >
              Home
            </Link>
            <Link
              href="/design-system"
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Docs
            </Link>
            <a
              href="#components"
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              Components
            </a>
            <a
              href="#blocks"
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              Blocks
            </a>
            <a
              href="#component-progress"
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
            >
              Charts
            </a>
            <a
              href="#catalog"
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
            >
              Directory
            </a>
            <Link
              href="/"
              className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
            >
              Create
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Input
              className="hidden w-56 lg:block"
              placeholder="Search documentation..."
              aria-label="Search documentation"
            />
            <Button variant="ghost" size="sm" aria-label="GitHub repository">
              GitHub
            </Button>
            <span className="hidden text-sm text-muted-foreground lg:inline">116k</span>
            <Button variant="ghost" size="icon" aria-label="Toggle theme">
              <Moon />
            </Button>
            <Button asChild size="sm">
              <Link href="/">
                <Plus />
                New
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className={pageShellClassName}>
        <section id="components" className={`${centeredSectionClassName} gap-10 lg:gap-12`}>
          <div className="flex w-full flex-col items-center gap-6 text-center">
            <Badge variant="outline">shadcn/ui registry foundation</Badge>
            <div className="max-w-5xl space-y-5">
              <h1 className="scroll-m-20 text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl lg:text-nowrap">
                The foundation for xGen design system
              </h1>
              <p className="text-muted-foreground text-base leading-7 text-balance sm:text-lg">
                Official shadcn/ui components, spacing, typography, and responsive block patterns rebuilt around the xGen generation workflow.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <a href="#blocks">View blocks</a>
              </Button>
              <Button asChild variant="outline">
                <a href="#catalog">Component catalog</a>
              </Button>
            </div>
          </div>
          <FoundationShowcase />
        </section>

        <section id="blocks" className={`mt-16 ${sectionStackClassName}`}>
          <SectionIntro
            label="Blocks"
            title="Composable blocks"
            description="shadcn/ui 컴포넌트를 xGen 생성 워크플로우 내용으로 조합합니다."
          />
          <div className="grid w-full auto-rows-min gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
            <PromptBuilderCard />
            <RenderActivityCard />
            <OutputPresetCard />
            <StyleReferencesCard />
            <NavigationCard />
            <ComponentBlocksCard />
            <GenerationQueueCard />
            <GalleryActionCard />
            <NotificationsCard />
            <HandoffCard />
          </div>
        </section>

        <section id="component-progress" className={`mt-16 ${sectionStackClassName}`}>
          <SectionIntro
            label="Charts"
            title="Render progress"
            description="공식 shadcn chart 컴포넌트와 Recharts를 사용해 생성 흐름을 표시합니다."
          />
          <div className="grid w-full auto-rows-min gap-5 md:grid-cols-3 md:gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Generation throughput</CardTitle>
                <CardDescription>Current workflow stages mapped to chart data.</CardDescription>
              </CardHeader>
              <CardContent>
                <LazyRenderProgressChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Chart readiness</CardTitle>
                <CardDescription>Official registry component now installed.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Library</span>
                  <span className="font-medium">Recharts</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Component</span>
                  <span className="font-medium">Chart</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary">Installed</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="catalog" className={`mt-16 ${sectionStackClassName}`}>
          <SectionIntro
            label="Directory"
            title="Component catalog"
            description="초기 로딩을 줄이기 위해 카탈로그는 요약만 렌더링합니다."
          />
          <div className="grid w-full auto-rows-min gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {catalogGroups.map((group) => (
              <Card key={group.title}>
                <CardHeader>
                  <CardTitle>{group.title}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} variant="outline">{item}</Badge>
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3 text-center">
      <Badge variant="outline">{label}</Badge>
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function FoundationShowcase() {
  return (
    <div className="w-full">
      <div className="grid gap-5 md:grid-cols-6 lg:grid-cols-12 lg:gap-6">
        <Card className="md:col-span-3 lg:col-span-6">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Prompt system</CardTitle>
                <CardDescription>Registry form controls mapped to xGen input.</CardDescription>
              </div>
              <Badge variant="secondary">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="showcase-brief">Generation brief</Label>
              <Textarea
                id="showcase-brief"
                defaultValue="Product poster for a tactile ceramic speaker, warm morning light, editorial still-life composition."
                className="min-h-24 resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="showcase-output">Output preset</Label>
              <Select defaultValue="square">
                <SelectTrigger id="showcase-output" className="w-full">
                  <SelectValue placeholder="Choose preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">1:1 HD render</SelectItem>
                  <SelectItem value="poster">4:5 product poster</SelectItem>
                  <SelectItem value="cover">16:9 gallery cover</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ButtonGroup>
              <Button>Generate</Button>
              <Button variant="secondary">Preview</Button>
              <Button variant="outline">Save</Button>
            </ButtonGroup>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 lg:col-span-6">
          <CardHeader>
            <CardTitle>Style reference</CardTitle>
            <CardDescription>Images, strength, and analysis stay inside shadcn spacing.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid grid-cols-3 gap-3">
              {["Light", "Texture", "Scene", "Angle", "Palette", "Mood"].map((label, index) => (
                <div key={label} className="grid gap-2">
                  <div data-slot="media-tile" className="grid aspect-square place-items-center rounded-xl border bg-background">
                    {index % 2 === 0 ? (
                      <ImageIcon className="size-5 text-muted-foreground" />
                    ) : (
                      <Skeleton className="size-10 rounded-full" />
                    )}
                  </div>
                  <span className="truncate text-center text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-4">
                <Label>Reference strength</Label>
                <Badge variant="outline">Balanced</Badge>
              </div>
              <Slider defaultValue={[64]} max={100} step={1} />
            </div>
            <div data-slot="control-row" className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="showcase-consistency">Consistency pass</Label>
                <p className="text-sm text-muted-foreground">Analyze references before render.</p>
              </div>
              <Switch id="showcase-consistency" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-6 lg:col-span-5">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Generation queue</CardTitle>
                <CardDescription>Preview, final, and gallery states.</CardDescription>
              </div>
              <Bell className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["Prompt", "Ready", 100],
              ["Reference analysis", "Running", 72],
              ["Final render", "Queued", 28],
            ].map(([title, status, value]) => (
              <div key={title} data-slot="status-tile" className="grid gap-3 rounded-xl border p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{title}</div>
                      <div className="text-sm text-muted-foreground">{status}</div>
                    </div>
                  </div>
                  <Badge variant={status === "Running" ? "secondary" : "outline"}>{value}%</Badge>
                </div>
                <Progress value={Number(value)} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-3 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WandSparkles className="size-4" />
              Output block
            </CardTitle>
            <CardDescription>Canvas handoff uses native card rhythm.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div data-slot="preview-frame" className="aspect-video rounded-xl border bg-background p-3">
              <div className="h-full rounded-lg bg-muted" />
            </div>
            <Button variant="outline">Open canvas</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers3 className="size-4" />
              Foundation checklist
            </CardTitle>
            <CardDescription>Active rules for this route.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {[
              ["Tokens", "Use background, foreground, muted, border, ring."],
              ["Spacing", "Let Card, Input, Select, and Button own padding."],
              ["Responsive", "Compose sections with grid spans, not fixed widths."],
            ].map(([title, body]) => (
              <div key={title} data-slot="summary-tile" className="rounded-xl border p-4">
                <div className="font-medium">{title}</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-6 lg:col-span-12">
          <CardHeader>
            <CardTitle>Directory state</CardTitle>
            <CardDescription>Installed registry components.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {["card", "button", "input", "select", "switch", "slider", "textarea", "chart"].map((item) => (
              <Badge key={item} variant="secondary">{item}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PromptBuilderCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt builder</CardTitle>
        <CardDescription>Build a generation brief from small controls.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Input placeholder="Name" aria-label="Prompt name" />
        <Input placeholder="Prompt message" aria-label="Prompt message" />
        <ButtonGroup>
          <Button>Generate</Button>
          <Button variant="secondary">Preview</Button>
          <Button variant="outline">Export</Button>
        </ButtonGroup>
      </CardContent>
      <CardFooter>
        <ToggleGroup type="single" defaultValue="ratio" size="sm" className="w-full justify-between">
          <ToggleGroupItem value="ratio" className="flex-1">Ratio</ToggleGroupItem>
          <ToggleGroupItem value="style" className="flex-1">Style</ToggleGroupItem>
          <ToggleGroupItem value="quality" className="flex-1">Quality</ToggleGroupItem>
        </ToggleGroup>
      </CardFooter>
    </Card>
  );
}

function RenderActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Render activity</CardTitle>
        <CardDescription>Last 6 local generations</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {[
          ["Prompt", 72],
          ["Style", 56],
          ["Output", 84],
          ["Gallery", 64],
        ].map(([label, value]) => (
          <div key={label} className="grid gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground">{value}%</span>
            </div>
            <Progress value={Number(value)} />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full">View report</Button>
      </CardFooter>
    </Card>
  );
}

function OutputPresetCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Output preset</CardTitle>
        <CardDescription>Reusable settings block</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div data-slot="summary-panel" className="rounded-lg border bg-muted/30 p-4">
          <div className="text-lg font-semibold">1:1 / HD</div>
          <div className="mt-1 text-sm text-muted-foreground">square render preset</div>
        </div>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Ratio</span><strong>1:1</strong></div>
          <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Quality</span><strong>HD</strong></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="secondary">Ready</Badge></div>
        </div>
      </CardContent>
    </Card>
  );
}

function StyleReferencesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Style references</CardTitle>
        <CardDescription>Source images connected to prompt intent.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-3 gap-3">
          {["Warm light", "Soft grain", "Studio", "Editorial", "Product", "Clean set"].map((label, index) => (
            <Avatar key={label} className="size-full aspect-square rounded-xl border">
              <AvatarFallback className="rounded-xl">{index + 1}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div data-slot="summary-panel" className="rounded-xl border bg-muted/30 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Reference strength</span>
            <Badge variant="secondary">Balanced</Badge>
          </div>
          <Progress value={66} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">Open library</Button>
      </CardFooter>
    </Card>
  );
}

function NavigationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace navigation</CardTitle>
        <CardDescription>Expose core xGen flows as a compact menu.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger data-state="active">Create</TabsTrigger>
            <TabsTrigger>Library</TabsTrigger>
          </TabsList>
          <TabsContent className="grid gap-3 pt-4">
            {["Prompt board", "Style references", "Output settings", "Gallery"].map((item) => (
              <div key={item} data-slot="control-row" className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <span>{item}</span>
                <Badge variant="outline">Open</Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ComponentBlocksCard() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Component blocks</CardTitle>
        <CardDescription>Small primitives combine into production-facing controls.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {["Prompt builder", "Style reference", "Output settings", "Gallery action"].map((item) => (
          <div key={item} data-slot="summary-tile" className="rounded-lg border bg-card p-4">
            <div className="mb-8 h-2 w-16 rounded-full bg-muted" />
            <div className="font-medium">{item}</div>
            <div className="mt-1 text-sm text-muted-foreground">Card, Badge, Button</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function GenerationQueueCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Generation queue</CardTitle>
            <CardDescription>Preview and final jobs stay visible.</CardDescription>
          </div>
          <Badge variant="secondary">3 active</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {generationRows.map(([title, type, status]) => (
          <div key={title} data-slot="status-tile" className="grid gap-3 rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{title}</div>
                <div className="text-sm text-muted-foreground">{type}</div>
              </div>
              <Badge variant={status === "Ready" ? "secondary" : "outline"}>{status}</Badge>
            </div>
            <Separator />
            <div>
              <Progress value={status === "Ready" ? 100 : status === "Queued" ? 24 : 64} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function GalleryActionCard() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Gallery action</CardTitle>
        <CardDescription>Review output and branch from a result.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div data-slot="preview-frame" className="aspect-video rounded-xl border bg-muted/40 p-3">
          <div className="h-full rounded-lg bg-background/70" />
        </div>
        <ButtonGroup>
          <Button>Open canvas</Button>
          <Button variant="secondary">Reuse prompt</Button>
          <Button variant="outline">Export</Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  );
}

function NotificationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose which generation updates should interrupt you.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {[
          ["Render complete", "Generated assets and previews."],
          ["Reference analysis", "Style and consistency updates."],
          ["Gallery milestones", "Batch status and export notices."],
        ].map(([title, description], index) => (
          <label key={title} data-slot="option-row" className="flex items-start gap-3 rounded-lg border p-3 text-sm">
            <Checkbox defaultChecked={index < 2} aria-label={title} />
            <span className="grid gap-1">
              <span className="font-medium">{title}</span>
              <span className="text-muted-foreground">{description}</span>
            </span>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}

function HandoffCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Handoff ready</CardTitle>
        <CardDescription>Local design-system state</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div data-slot="muted-row" className="rounded-md bg-muted p-3 text-sm">Button, Badge, Card, Input, ToggleGroup</div>
        <div data-slot="muted-row" className="rounded-md bg-muted p-3 text-sm">Theme tokens mapped to shadcn</div>
        <div data-slot="muted-row" className="rounded-md bg-muted p-3 text-sm">Catalog summary kept below</div>
      </CardContent>
    </Card>
  );
}
