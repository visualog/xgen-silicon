"use client";

import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardDescription,
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
  Slider,
  Switch,
  Textarea,
} from "@/components/ui";
import { patternCards } from "../_data/design-system";
import { useDesignSystemPreferences } from "./design-system-preferences";
import { InfoGrid, PageHero, SectionIntro } from "./page-sections";

export function PatternsPageContent() {
  return (
    <div className="grid gap-16">
      <PageHero
        label={{ ko: "패턴", en: "Patterns" }}
        title={{ ko: "생성 작업을 위한 워크플로 패턴.", en: "Workflow patterns for generation work." }}
        description={{
          ko: "패턴은 승인된 shadcn 프리미티브가 xGen 제품 순간으로 바뀌는 방식을 보여줍니다: 프롬프트 진입, 레퍼런스 제어, 렌더 상태, 갤러리 검토.",
          en: "Patterns show how approved shadcn primitives become xGen-specific product moments: prompt entry, reference control, render status, and gallery review.",
        }}
        action={{ href: "/design-system/components", label: { ko: "프리미티브 검토", en: "Review primitives" } }}
      />

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "디렉터리", en: "Directory" }}
          title={{ ko: "새 프리미티브가 아닌 조합.", en: "Compositions, not new primitives." }}
          description={{
            ko: "프로덕션 화면에 워크플로 동작이 필요할 때 이 패턴을 사용합니다. 버튼, 필드, 상태 badge만 필요하다면 Components에 머무릅니다.",
            en: "Use these patterns when a production screen needs workflow behavior. If the need is only a button, field, or status badge, stay in Components.",
          }}
        />
        <InfoGrid
          groups={patternCards.map(({ name, purpose, primitives }) => ({
            title: name,
            description: purpose,
            items: primitives,
          }))}
        />
      </section>

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "프리뷰", en: "Preview" }}
          title={{ ko: "핵심 xGen 워크플로 스택.", en: "Core xGen workflow stack." }}
          description={{
            ko: "예시는 Patterns 페이지에 함께 두어 컴포넌트 카탈로그가 프리미티브 중심으로 남게 합니다.",
            en: "This preview keeps the examples together on the Patterns page so the component catalog can remain primitive-focused.",
          }}
        />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <PromptPattern />
          <StatusPattern />
          <ReferencePattern />
          <ReviewPattern />
        </div>
      </section>
    </div>
  );
}

function PromptPattern() {
  const { text } = useDesignSystemPreferences();

  return (
    <Card>
      <CardHeader>
        <Badge className="w-fit" variant="secondary">
          {text({ ko: "진입", en: "Entry" })}
        </Badge>
        <CardTitle>{text({ ko: "프롬프트 빌더", en: "Prompt builder" })}</CardTitle>
        <CardDescription>
          {text({ ko: "브리프, 프리셋, 기본 생성 액션.", en: "Brief, preset, and primary generation action." })}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Input placeholder={text({ ko: "제품 포스터 콘셉트", en: "Product poster concept" })} aria-label={text({ ko: "프롬프트 제목", en: "Prompt title" })} />
        <Textarea
          className="min-h-24 resize-none"
          aria-label={text({ ko: "생성 브리프", en: "Generation brief" })}
          value={text({
            ko: "세라믹 데스크 스피커, 촉각적인 표면, 따뜻한 에디토리얼 스튜디오 조명.",
            en: "Ceramic desk speaker, tactile surface, warm editorial studio lighting.",
          })}
          readOnly
        />
        <Select defaultValue="poster">
          <SelectTrigger className="w-full" aria-label={text({ ko: "출력 프리셋", en: "Output preset" })}>
            <SelectValue placeholder={text({ ko: "프리셋 선택", en: "Choose preset" })} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="square">1:1 HD render</SelectItem>
            <SelectItem value="poster">4:5 product poster</SelectItem>
            <SelectItem value="cover">16:9 gallery cover</SelectItem>
          </SelectContent>
        </Select>
        <ButtonGroup>
          <Button>{text({ ko: "생성", en: "Generate" })}</Button>
          <Button variant="secondary">{text({ ko: "미리보기", en: "Preview" })}</Button>
          <Button variant="outline">{text({ ko: "저장", en: "Save" })}</Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  );
}

function StatusPattern() {
  const { text } = useDesignSystemPreferences();
  const rows = [
    [{ ko: "프롬프트", en: "Prompt" }, { ko: "준비", en: "Ready" }, 100],
    [{ ko: "레퍼런스 분석", en: "Reference analysis" }, { ko: "실행 중", en: "Running" }, 72],
    [{ ko: "최종 렌더", en: "Final render" }, { ko: "대기", en: "Queued" }, 28],
  ] as const;

  return (
    <Card>
      <CardHeader>
        <Badge className="w-fit" variant="secondary">
          {text({ ko: "상태", en: "Status" })}
        </Badge>
        <CardTitle>{text({ ko: "생성 큐", en: "Generation queue" })}</CardTitle>
        <CardDescription>{text({ ko: "렌더 파이프라인을 압축적으로 보여줍니다.", en: "Compact visibility for the render pipeline." })}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {rows.map(([title, status, value]) => (
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
      </CardContent>
    </Card>
  );
}

function ReferencePattern() {
  const { text } = useDesignSystemPreferences();
  const tags = [
    { ko: "빛", en: "Light" },
    { ko: "질감", en: "Texture" },
    { ko: "장면", en: "Scene" },
    { ko: "각도", en: "Angle" },
    { ko: "팔레트", en: "Palette" },
    { ko: "무드", en: "Mood" },
  ];

  return (
    <Card>
      <CardHeader>
        <Badge className="w-fit" variant="secondary">
          {text({ ko: "레퍼런스", en: "Reference" })}
        </Badge>
        <CardTitle>{text({ ko: "스타일 레퍼런스 선택", en: "Style reference picker" })}</CardTitle>
        <CardDescription>{text({ ko: "레퍼런스 강도와 일관성 컨트롤.", en: "Reference strength and consistency controls." })}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid grid-cols-3 gap-3">
          {tags.map((item) => (
            <div key={item.en} className="grid gap-2">
              <div data-slot="media-tile" className="aspect-square rounded-lg border bg-muted/40" />
              <span className="truncate text-center text-xs text-muted-foreground">{text(item)}</span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label>{text({ ko: "레퍼런스 강도", en: "Reference strength" })}</Label>
            <Badge variant="outline">{text({ ko: "균형", en: "Balanced" })}</Badge>
          </div>
          <Slider defaultValue={[64]} max={100} step={1} />
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewPattern() {
  const { text } = useDesignSystemPreferences();

  return (
    <Card>
      <CardHeader>
        <Badge className="w-fit" variant="secondary">
          {text({ ko: "검토", en: "Review" })}
        </Badge>
        <CardTitle>{text({ ko: "갤러리 액션과 설정", en: "Gallery action and settings" })}</CardTitle>
        <CardDescription>{text({ ko: "맥락을 잃지 않고 결과에서 분기합니다.", en: "Branch from a result without losing context." })}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div data-slot="preview-frame" className="aspect-video rounded-lg border bg-muted/40 p-3">
          <div className="h-full rounded-md bg-background" />
        </div>
        <ButtonGroup>
          <Button>{text({ ko: "캔버스 열기", en: "Open canvas" })}</Button>
          <Button variant="secondary">{text({ ko: "프롬프트 재사용", en: "Reuse prompt" })}</Button>
          <Button variant="outline">{text({ ko: "내보내기", en: "Export" })}</Button>
        </ButtonGroup>
        <label data-slot="option-row" className="flex items-start gap-3 rounded-lg border p-3 text-sm">
          <Checkbox defaultChecked aria-label={text({ ko: "생성 메타데이터 저장", en: "Save generation metadata" })} />
          <span className="grid gap-1">
            <span className="font-medium">{text({ ko: "생성 메타데이터 저장", en: "Save generation metadata" })}</span>
            <span className="text-muted-foreground">
              {text({
                ko: "프롬프트, 레퍼런스, 출력 설정을 함께 유지합니다.",
                en: "Keep prompt, references, and output settings together.",
              })}
            </span>
          </span>
        </label>
        <div data-slot="option-row" className="flex items-center justify-between rounded-lg border p-3">
          <Label htmlFor="pattern-consistency">{text({ ko: "일관성 패스", en: "Consistency pass" })}</Label>
          <Switch id="pattern-consistency" defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
}
