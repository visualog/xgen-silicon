import Link from "next/link";

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
  Progress,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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

export default function ComponentsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground no-underline">
              <span className="grid size-6 place-items-center rounded-md bg-foreground text-background text-xs">x</span>
              xGen
            </Link>
            <nav className="hidden items-center gap-5 text-sm font-medium md:flex" aria-label="Design system navigation">
              <Link href="/" className="transition-colors hover:text-muted-foreground">Home</Link>
              <Link href="/design-system" className="transition-colors hover:text-muted-foreground">Docs</Link>
              <a href="#components" className="transition-colors hover:text-muted-foreground">Components</a>
              <a href="#blocks" className="transition-colors hover:text-muted-foreground">Blocks</a>
              <Link href="/design-system/templates" className="transition-colors hover:text-muted-foreground">Templates</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Input className="hidden w-48 lg:block" placeholder="Search..." aria-label="Search components" />
            <Button asChild size="sm">
              <Link href="/">New</Link>
            </Button>
          </div>
        </div>
      </header>

      <section id="components" className="container mx-auto px-4">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 py-24 text-center">
          <Badge variant="secondary">shadcn/ui primitives</Badge>
          <div className="space-y-4">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
              The foundation for xGen design system
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              xGen의 생성, 참조, 출력, 갤러리 흐름을 shadcn/ui 컴포넌트와 레이아웃 패턴 위에 구성합니다.
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
      </section>

      <section id="blocks" className="container mx-auto px-4 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

      <section id="catalog" className="container mx-auto px-4 pb-24">
        <div className="space-y-2">
          <Badge variant="outline">xGen catalog</Badge>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Component catalog</h2>
          <p className="text-sm text-muted-foreground">
            초기 로딩을 줄이기 위해 카탈로그는 요약만 렌더링합니다.
          </p>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </main>
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
        <ButtonGroup className="gap-2">
          <Button size="sm">Generate</Button>
          <Button size="sm" variant="secondary">Preview</Button>
          <Button size="sm" variant="outline">Export</Button>
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
        <Button className="w-full" size="sm">View report</Button>
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
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="text-3xl font-semibold">1:1 / HD</div>
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
        <div className="rounded-xl border bg-muted/30 p-4">
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
              <div key={item} className="flex items-center justify-between rounded-lg border p-3 text-sm">
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
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Component blocks</CardTitle>
        <CardDescription>Small primitives combine into production-facing controls.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {["Prompt builder", "Style reference", "Output settings", "Gallery action"].map((item) => (
          <div key={item} className="rounded-lg border bg-card p-4">
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
          <div key={title} className="grid gap-3 rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{title}</div>
                <div className="text-xs text-muted-foreground">{type}</div>
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
        <div className="aspect-video rounded-xl border bg-muted/40 p-3">
          <div className="h-full rounded-lg bg-background/70" />
        </div>
        <ButtonGroup className="gap-2">
          <Button size="sm">Open canvas</Button>
          <Button size="sm" variant="secondary">Reuse prompt</Button>
          <Button size="sm" variant="outline">Export</Button>
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
          <label key={title} className="flex items-start gap-3 text-sm">
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
        <div className="rounded-md bg-muted p-3 text-sm">Button, Badge, Card, Input, ToggleGroup</div>
        <div className="rounded-md bg-muted p-3 text-sm">Theme tokens mapped to shadcn</div>
        <div className="rounded-md bg-muted p-3 text-sm">Catalog summary kept below</div>
      </CardContent>
    </Card>
  );
}
