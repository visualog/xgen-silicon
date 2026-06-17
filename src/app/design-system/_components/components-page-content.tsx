"use client";

import type { ReactNode } from "react";

import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui";
import { componentGroups, componentUsageNotes } from "../_data/design-system";
import { useDesignSystemPreferences } from "./design-system-preferences";
import { InfoGrid, PageHero, SectionIntro } from "./page-sections";

export function ComponentsPageContent() {
  const { text } = useDesignSystemPreferences();
  const feedbackRows = [
    [{ ko: "1단계", en: "Step one" }, { ko: "준비", en: "Ready" }, 100],
    [{ ko: "2단계", en: "Step two" }, { ko: "실행 중", en: "Running" }, 72],
    [{ ko: "3단계", en: "Step three" }, { ko: "대기", en: "Queued" }, 28],
  ] as const;

  return (
    <div className="grid gap-16">
      <PageHero
        label={{ ko: "컴포넌트", en: "Components" }}
        title={{ ko: "xGen 프리미티브의 집중 카탈로그.", en: "A focused catalog of xGen primitives." }}
        description={{
          ko: "이 페이지는 새 xGen UI가 조합해야 할 로컬 shadcn/ui 컴포넌트를 문서화합니다. 워크플로 블록은 프리미티브 카탈로그가 아니라 Patterns에 둡니다.",
          en: "This page documents the local shadcn/ui components that new xGen UI should compose. Workflow blocks belong in Patterns, not in the primitive catalog.",
        }}
        action={{ href: "/design-system/foundation", label: { ko: "파운데이션 검토", en: "Review foundation" } }}
      />

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "디렉터리", en: "Directory" }}
          title={{ ko: "컴포넌트 카테고리.", en: "Component categories." }}
          description={{
            ko: "더 큰 워크플로 패턴을 만들기 전에 사용 가능한 프리미티브와 xGen에서의 역할을 확인합니다.",
            en: "Use this page to confirm available primitives and their xGen role before building larger workflow patterns.",
          }}
        />
        <InfoGrid groups={componentGroups} />
      </section>

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "레퍼런스 프리뷰", en: "Reference preview" }}
          title={{ ko: "프리미티브 동작을 한곳에서 확인합니다.", en: "Primitive behavior in one place." }}
          description={{
            ko: "프리뷰는 의도적으로 작고 중립적으로 유지해, 페이지가 워크플로 쇼케이스가 아니라 카탈로그로 남게 합니다.",
            en: "The preview stays intentionally small and neutral so the page remains a catalog instead of a workflow showcase.",
          }}
        />
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <CardHeader>
              <CardTitle>{text({ ko: "폼 프리미티브", en: "Form primitives" })}</CardTitle>
              <CardDescription>
                {text({
                  ko: "Input, textarea, select, toggle, action variant.",
                  en: "Input, textarea, select, toggle, and action variants.",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="component-name">{text({ ko: "이름", en: "Name" })}</Label>
                <Input
                  id="component-name"
                  placeholder={text({ ko: "재사용 컨트롤 그룹", en: "Reusable control group" })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="component-brief">{text({ ko: "설명", en: "Description" })}</Label>
                <Textarea
                  id="component-brief"
                  className="min-h-24 resize-none"
                  value={text({
                    ko: "필드 padding, 텍스트 리듬, focus 동작을 확인하는 영역입니다.",
                    en: "Use this area to verify field padding, text rhythm, and focus behavior.",
                  })}
                  readOnly
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="component-preset">{text({ ko: "프리셋", en: "Preset" })}</Label>
                <Select defaultValue="square">
                  <SelectTrigger id="component-preset" className="w-full">
                    <SelectValue placeholder={text({ ko: "프리셋 선택", en: "Choose preset" })} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">{text({ ko: "컴팩트", en: "Compact" })}</SelectItem>
                    <SelectItem value="poster">{text({ ko: "균형", en: "Balanced" })}</SelectItem>
                    <SelectItem value="cover">{text({ ko: "확장", en: "Expanded" })}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ToggleGroup type="single" defaultValue="style" size="sm" className="justify-start">
                <ToggleGroupItem value="ratio">{text({ ko: "하나", en: "One" })}</ToggleGroupItem>
                <ToggleGroupItem value="style">{text({ ko: "둘", en: "Two" })}</ToggleGroupItem>
                <ToggleGroupItem value="quality">{text({ ko: "셋", en: "Three" })}</ToggleGroupItem>
              </ToggleGroup>
              <ButtonGroup>
                <Button>{text({ ko: "기본", en: "Primary" })}</Button>
                <Button variant="secondary">{text({ ko: "보조", en: "Secondary" })}</Button>
                <Button variant="outline">{text({ ko: "저장", en: "Save" })}</Button>
              </ButtonGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{text({ ko: "피드백 프리미티브", en: "Feedback primitives" })}</CardTitle>
              <CardDescription>
                {text({ ko: "압축 progress, badge, switch 동작.", en: "Compact progress, badges, and switch behavior." })}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              {feedbackRows.map(([title, status, value]) => (
                <div key={title.en} data-slot="status-tile" className="grid gap-3 rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">{text(title)}</div>
                      <div className="text-sm text-muted-foreground">{text(status)}</div>
                    </div>
                    <Badge variant={status.en === "Running" ? "secondary" : "outline"}>{value}%</Badge>
                  </div>
                  <Progress value={Number(value)} />
                </div>
              ))}
              <div data-slot="option-row" className="flex items-center justify-between rounded-lg border p-3">
                <div className="grid gap-1">
                  <Label htmlFor="component-consistency">{text({ ko: "활성 상태", en: "Enabled state" })}</Label>
                  <p className="text-sm text-muted-foreground">
                    {text({ ko: "이진 설정에는 switch를 사용합니다.", en: "Use switches for binary settings." })}
                  </p>
                </div>
                <Switch id="component-consistency" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "사용 규칙", en: "Usage" }}
          title={{ ko: "Do and don't 규칙.", en: "Do and don't rules." }}
          description={{
            ko: "패턴이나 템플릿이 제품 흐름으로 조합되기 전에 프리미티브 사용을 일관되게 유지합니다.",
            en: "These notes keep primitive usage consistent before patterns or templates compose them into product flows.",
          }}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {componentUsageNotes.map((note) => (
            <Card key={text(note.title)}>
              <CardHeader>
                <CardTitle>{text(note.title)}</CardTitle>
                <CardDescription>{text({ ko: "프리미티브 사용 규칙", en: "Primitive usage rule" })}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div data-slot="summary-tile" data-tone="do" className="rounded-lg border bg-muted/30 p-3">
                  <div data-slot="summary-tile-label" className="mb-1 font-medium">{text({ ko: "권장", en: "Do" })}</div>
                  <p className="leading-6 text-muted-foreground">{text(note.do)}</p>
                </div>
                <div data-slot="summary-tile" data-tone="dont" className="rounded-lg border p-3">
                  <div data-slot="summary-tile-label" className="mb-1 font-medium">{text({ ko: "피하기", en: "Don't" })}</div>
                  <p className="leading-6 text-muted-foreground">{text(note.dont)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "해부", en: "Anatomy" }}
          title={{ ko: "작은 프리미티브 구조 예시.", en: "Small primitive anatomy examples." }}
          description={{
            ko: "Anatomy 예시는 워크플로별 콘텐츠를 도입하지 않고 기대 구조만 설명합니다.",
            en: "Anatomy examples describe the expected structure without introducing workflow-specific content.",
          }}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <AnatomyCard
            title="Button"
            description={text({ ko: "명령 텍스트, variant, size, focus ring.", en: "Command text, variant, size, focus ring." })}
            parts={["label", "variant", "size", "focus-visible"]}
          >
            <ButtonGroup>
              <Button>{text({ ko: "기본", en: "Primary" })}</Button>
              <Button variant="secondary">{text({ ko: "보조", en: "Secondary" })}</Button>
            </ButtonGroup>
          </AnatomyCard>
          <AnatomyCard
            title="Card"
            description={text({
              ko: "Header, description, content, 선택적 footer.",
              en: "Header, description, content, optional footer.",
            })}
            parts={["CardHeader", "CardTitle", "CardDescription", "CardContent"]}
          >
            <div data-slot="preview-frame" className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 h-3 w-1/3 rounded-full bg-muted-foreground/20" />
              <div className="h-16 rounded-md bg-background" />
            </div>
          </AnatomyCard>
          <AnatomyCard
            title="Input"
            description={text({ ko: "보이는 label, control, helper text, state.", en: "Visible label, control, helper text, state." })}
            parts={["Label", "Input", "helper", "aria"]}
          >
            <div className="grid gap-2">
              <Label htmlFor="anatomy-input">{text({ ko: "필드 레이블", en: "Field label" })}</Label>
              <Input id="anatomy-input" placeholder={text({ ko: "중립 값", en: "Neutral value" })} />
              <p className="text-sm text-muted-foreground">
                {text({ ko: "Helper text는 필드 가까이에 둡니다.", en: "Helper text stays near the field." })}
              </p>
            </div>
          </AnatomyCard>
        </div>
      </section>
    </div>
  );
}

function AnatomyCard({
  title,
  description,
  parts,
  children,
}: {
  title: string;
  description: string;
  parts: string[];
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {children}
        <div className="flex flex-wrap gap-2">
          {parts.map((part) => (
            <Badge key={part} variant="outline">
              {part}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
