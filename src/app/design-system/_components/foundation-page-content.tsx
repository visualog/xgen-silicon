"use client";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui";
import {
  foundationColorTokens,
  foundationRadiusTokens,
  foundationRawColorScales,
  foundationSemanticColors,
  foundationSpacingTokens,
  foundationStateRules,
  foundationTypeTokens,
} from "../_data/foundation";
import { useDesignSystemPreferences } from "./design-system-preferences";
import { SectionIntro } from "./page-sections";

export function FoundationPageContent() {
  return (
    <div className="grid gap-16">
      <section className="grid gap-8">
        <SectionIntro
          label={{ ko: "토큰 지도", en: "Token map" }}
          title={{ ko: "색, 글자, 간격을 실제 값으로 확인합니다.", en: "Inspect color, type, and spacing as real values." }}
          description={{
            ko: "이 페이지는 파운데이션의 원칙만 설명하지 않습니다. 새 화면에서 바로 골라 써야 할 토큰과 사용 범위를 함께 보여줍니다.",
            en: "This page does not stop at principles. It shows the tokens and usage boundaries new screens should start from.",
          }}
        />
        <ColorTokenGrid />
      </section>

      <section className="grid gap-8">
        <SectionIntro
          label={{ ko: "원시 컬러 스케일", en: "Raw color scale" }}
          title={{ ko: "시맨틱 컬러 아래에는 원시 팔레트가 있습니다.", en: "Semantic color sits on a raw palette." }}
          description={{
            ko: "이 스케일은 현재 shadcn source token을 만드는 실제 OKLCH 값입니다. semantic role은 이 stop을 의미에 맞게 묶어 쓰는 층입니다.",
            en: "This scale shows the real OKLCH values behind the current shadcn source tokens. Semantic roles group these stops by meaning.",
          }}
        />
        <RawColorScaleGrid />
      </section>

      <section className="grid gap-8">
        <SectionIntro
          label={{ ko: "시맨틱 컬러", en: "Semantic color" }}
          title={{ ko: "색은 정보의 위계와 위험도를 먼저 말합니다.", en: "Color communicates hierarchy and risk first." }}
          description={{
            ko: "primitive token은 값이고, semantic color는 의미입니다. 새 색을 만들기 전에 이 역할 중 어떤 정보를 표현하는지 먼저 정합니다.",
            en: "Primitive tokens are values; semantic color is meaning. Before adding a new color, decide which information role it needs to express.",
          }}
        />
        <SemanticColorGrid />
      </section>

      <section className="grid gap-8">
        <SectionIntro
          label={{ ko: "타입 스케일", en: "Type scale" }}
          title={{ ko: "문서와 UI 문장은 같은 리듬을 씁니다.", en: "Docs and UI copy share the same rhythm." }}
          description={{
            ko: "크기를 늘리기 전에 역할을 먼저 정합니다. 라벨, 설명, 본문, 섹션 제목은 서로 다른 행간과 무게를 가집니다.",
            en: "Choose the role before increasing size. Labels, descriptions, body copy, and section titles each have distinct rhythm and weight.",
          }}
        />
        <TypeScaleGrid />
      </section>

      <section className="grid gap-8">
        <SectionIntro
          label={{ ko: "공간과 형태", en: "Space and shape" }}
          title={{ ko: "4px grid와 radius 기준을 눈으로 맞춥니다.", en: "Use the 4px grid and radius scale visually." }}
          description={{
            ko: "간격은 4px 단위에서 시작하고, 큰 페이지 리듬은 8px 배수로 맞춥니다. 둥근 정도는 shadcn radius 파생값을 씁니다.",
            en: "Spacing starts on the 4px grid, with larger page rhythm on 8px multiples. Shape uses the derived shadcn radius scale.",
          }}
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
          <SpacingScaleCard />
          <RadiusScaleCard />
        </div>
      </section>

      <section className="grid gap-8">
        <SectionIntro
          label={{ ko: "상태 규칙", en: "State rules" }}
          title={{ ko: "상태는 장식이 아니라 동작의 증거입니다.", en: "State is evidence of behavior, not decoration." }}
          description={{
            ko: "focus, disabled, invalid, open 같은 상태는 접근성과 조작 가능성을 설명합니다. 임의 wrapper보다 primitive 상태 속성을 먼저 씁니다.",
            en: "Focus, disabled, invalid, and open states explain accessibility and operability. Prefer primitive state attributes over custom wrappers.",
          }}
        />
        <StateRuleGrid />
      </section>
    </div>
  );
}

function ColorTokenGrid() {
  const { text } = useDesignSystemPreferences();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {foundationColorTokens.map((token) => (
        <Card key={token.name}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-sm">{token.name}</CardTitle>
                <CardDescription>{text(token.role)}</CardDescription>
              </div>
              <span
                aria-hidden="true"
                className="size-10 shrink-0 rounded-lg border shadow-sm"
                style={{ background: token.value }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <code data-slot="docs-code-chip" className="rounded-md bg-muted px-2 py-1 text-xs">
              {token.value}
            </code>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RawColorScaleGrid() {
  const { text } = useDesignSystemPreferences();

  return (
    <div className="grid gap-6">
      {foundationRawColorScales.map((scale) => (
        <Card key={text(scale.family)}>
          <CardHeader>
            <CardTitle>{text(scale.family)}</CardTitle>
            <CardDescription>{text(scale.description)}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {scale.stops.map((stop) => (
              <div key={stop.name} className="grid gap-4 rounded-lg border p-4 md:grid-cols-[minmax(120px,0.35fr)_minmax(0,1fr)_minmax(180px,0.55fr)] md:items-center">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="size-10 shrink-0 rounded-lg border shadow-sm"
                    style={{ background: stop.value }}
                  />
                  <div className="grid gap-1">
                    <span className="text-sm font-semibold">{stop.name}</span>
                    <code data-slot="docs-code-chip" className="rounded-md bg-muted px-2 py-1 text-xs">
                      {stop.value}
                    </code>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stop.mapsTo.map((token) => <Badge key={token} variant="outline">{token}</Badge>)}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{text(stop.usage)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SemanticColorGrid() {
  const { text } = useDesignSystemPreferences();

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {foundationSemanticColors.map((color) => (
        <Card key={text(color.role)}>
          <CardHeader>
            <div
              className="mb-4 flex h-16 items-end rounded-lg border p-4"
              style={{
                background: color.surface,
                borderColor: color.border ?? "var(--border)",
                color: color.ink,
              }}
            >
              <span className="text-sm font-semibold">{text(color.role)}</span>
            </div>
            <CardTitle className="text-sm">{text(color.meaning)}</CardTitle>
            <CardDescription>{text(color.usage)}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {color.tokens.map((token) => (
              <code key={token} data-slot="docs-code-chip" className="rounded-md bg-muted px-2 py-1 text-xs">
                {token}
              </code>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TypeScaleGrid() {
  const { text } = useDesignSystemPreferences();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {foundationTypeTokens.map((token) => (
        <Card key={token.name}>
          <CardHeader>
            <Badge variant="outline">{token.name}</Badge>
            <CardTitle className={token.className}>{text(token.sample)}</CardTitle>
            <CardDescription>{text(token.usage)}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function SpacingScaleCard() {
  const { text } = useDesignSystemPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{text({ ko: "Spacing scale", en: "Spacing scale" })}</CardTitle>
        <CardDescription>{text({ ko: "허용 간격을 4px grid 위에서 비교합니다.", en: "Compare allowed spacing on the 4px grid." })}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {foundationSpacingTokens.map((token, index) => (
          <div key={token.name} className="grid gap-2 sm:grid-cols-[72px_minmax(0,1fr)_minmax(120px,0.7fr)] sm:items-center">
            <code data-slot="docs-code-chip" className="rounded-md bg-muted px-2 py-1 text-xs">
              {token.name}
            </code>
            <div className="h-3 rounded-full bg-muted">
              <div
                className="h-3 rounded-full bg-foreground"
                style={{ width: `${Math.max(24, (index + 1) * 12)}%` }}
              />
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{text(token.usage)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RadiusScaleCard() {
  const { text } = useDesignSystemPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{text({ ko: "Radius scale", en: "Radius scale" })}</CardTitle>
        <CardDescription>{text({ ko: "둥근 정도는 하나의 radius에서 파생합니다.", en: "Shape is derived from one radius source." })}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {foundationRadiusTokens.map((token) => (
          <div key={token.name} className="grid gap-4">
            <div className="flex items-center justify-between gap-4">
              <code data-slot="docs-code-chip" className="rounded-md bg-muted px-2 py-1 text-xs">
                {token.name}
              </code>
              <span className="text-sm text-muted-foreground">{text(token.usage)}</span>
            </div>
            <div className="h-12 border bg-muted/60" style={{ borderRadius: token.value }} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function StateRuleGrid() {
  const { text } = useDesignSystemPreferences();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {foundationStateRules.map((rule) => (
        <Card key={rule.state}>
          <CardHeader>
            <Badge variant="secondary">{rule.state}</Badge>
            <CardTitle>{text(rule.signal)}</CardTitle>
            <CardDescription>{text(rule.rule)}</CardDescription>
          </CardHeader>
          <CardContent>
            <Separator />
            <div className="mt-4 flex items-center gap-4 rounded-lg border bg-muted/40 p-4">
              <span className="size-3 rounded-full bg-ring" />
              <span className="text-sm leading-6 text-muted-foreground">{text({ ko: "상태 표현은 의미와 복구 방법을 함께 가집니다.", en: "State expression carries meaning and recovery guidance." })}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
