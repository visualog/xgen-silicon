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
        title={{ ko: "새 화면에 쓸 기본 UI를 확인합니다.", en: "Check the core UI for new screens." }}
        description={{
          ko: "버튼, 입력, 선택, 피드백처럼 화면마다 반복되는 요소를 모았습니다. 생성 흐름에 맞춘 조합은 Patterns에서 확인합니다.",
          en: "Buttons, inputs, selection controls, and feedback pieces live here. Workflow-specific combinations belong in Patterns.",
        }}
        action={{ href: "/design-system/foundation", label: { ko: "파운데이션 검토", en: "Review foundation" } }}
      />

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "디렉터리", en: "Directory" }}
          title={{ ko: "필요한 컴포넌트를 역할별로 찾습니다.", en: "Find components by role." }}
          description={{
            ko: "작업을 시작하기 전에 어떤 컴포넌트가 이미 준비되어 있고, 어떤 상황에 쓰는지 확인하세요.",
            en: "Before building, check which components already exist and when to use each one.",
          }}
        />
        <InfoGrid groups={componentGroups} />
      </section>

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "프리뷰", en: "Preview" }}
          title={{ ko: "기본 상태를 빠르게 확인합니다.", en: "Scan the default states quickly." }}
          description={{
            ko: "이 영역은 컴포넌트의 크기, 간격, 포커스, 상태 표현을 확인하기 위한 작은 샘플입니다.",
            en: "These small samples help verify size, spacing, focus, and state behavior.",
          }}
        />
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <CardHeader>
              <CardTitle>{text({ ko: "폼 컨트롤", en: "Form controls" })}</CardTitle>
              <CardDescription>
                {text({
                  ko: "입력, 긴 텍스트, 선택, 토글, 액션 버튼을 함께 확인합니다.",
                  en: "Review inputs, long text, selection, toggles, and actions together.",
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
                    ko: "필드 안쪽 여백, 텍스트 리듬, 포커스 상태를 확인하는 예시입니다.",
                    en: "Use this sample to check field padding, text rhythm, and focus state.",
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
              <CardTitle>{text({ ko: "상태 표시", en: "Status feedback" })}</CardTitle>
              <CardDescription>
                {text({ ko: "진행률, 배지, 스위치가 한 화면에서 어떻게 보이는지 확인합니다.", en: "Check how progress, badges, and switches read together." })}
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
          label={{ ko: "사용 기준", en: "Usage" }}
          title={{ ko: "컴포넌트를 쓰기 전 확인할 기준입니다.", en: "Check these rules before using a component." }}
          description={{
            ko: "작은 선택이 화면 전체의 밀도와 리듬을 바꿉니다. 아래 기준으로 같은 방식의 UI를 유지합니다.",
            en: "Small choices shape the density and rhythm of the whole screen. Use these notes to keep UI decisions consistent.",
          }}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {componentUsageNotes.map((note) => (
            <Card key={text(note.title)}>
              <CardHeader>
                <CardTitle>{text(note.title)}</CardTitle>
                <CardDescription>{text({ ko: "사용할 때 지킬 기준", en: "Usage guidance" })}</CardDescription>
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
          label={{ ko: "구조", en: "Anatomy" }}
          title={{ ko: "작은 구조부터 일관되게 맞춥니다.", en: "Keep small structures consistent first." }}
          description={{
            ko: "예시는 제품 콘텐츠를 넣기 전, 컴포넌트가 어떤 부품으로 구성되는지 보여줍니다.",
            en: "These examples show component structure before product-specific content is added.",
          }}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <AnatomyCard
            title="Button"
            description={text({ ko: "라벨, variant, 크기, 포커스 상태를 함께 봅니다.", en: "Label, variant, size, and focus state work together." })}
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
              ko: "헤더, 설명, 본문, 선택적 footer로 리듬을 만듭니다.",
              en: "Header, description, content, and optional footer create the rhythm.",
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
            description={text({ ko: "보이는 레이블, 입력 영역, 도움말, 상태를 함께 둡니다.", en: "Use a visible label, control, helper text, and state together." })}
            parts={["Label", "Input", "helper", "aria"]}
          >
            <div className="grid gap-2">
              <Label htmlFor="anatomy-input">{text({ ko: "필드 레이블", en: "Field label" })}</Label>
              <Input id="anatomy-input" placeholder={text({ ko: "중립 값", en: "Neutral value" })} />
              <p className="text-sm text-muted-foreground">
                {text({ ko: "도움말은 입력 필드 바로 가까이에 둡니다.", en: "Helper text stays close to the field." })}
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
