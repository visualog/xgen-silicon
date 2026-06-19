import type { LocalizedText } from "../_components/design-system-preferences";

export type FoundationColorToken = {
  name: string;
  value: string;
  role: LocalizedText;
};

export type FoundationTypeToken = {
  name: string;
  className: string;
  sample: LocalizedText;
  usage: LocalizedText;
};

export type FoundationSemanticColor = {
  role: LocalizedText;
  meaning: LocalizedText;
  usage: LocalizedText;
  tokens: string[];
  surface: string;
  ink: string;
  border?: string;
};

export type FoundationRawColorStop = {
  name: string;
  value: string;
  mapsTo: string[];
  usage: LocalizedText;
};

export type FoundationRawColorScale = {
  family: LocalizedText;
  description: LocalizedText;
  stops: FoundationRawColorStop[];
};

export type FoundationScaleToken = {
  name: string;
  value: string;
  usage: LocalizedText;
};

export type FoundationStateRule = {
  state: string;
  signal: LocalizedText;
  rule: LocalizedText;
};

export const foundationColorTokens = [
  {
    name: "--background",
    value: "var(--background)",
    role: { ko: "문서와 화면의 기본 바탕", en: "Base page surface" },
  },
  {
    name: "--foreground",
    value: "var(--foreground)",
    role: { ko: "본문과 핵심 정보", en: "Body and primary information" },
  },
  {
    name: "--card",
    value: "var(--card)",
    role: { ko: "반복 항목과 정보 카드", en: "Repeated items and information cards" },
  },
  {
    name: "--muted",
    value: "var(--muted)",
    role: { ko: "보조 표면과 약한 구획", en: "Secondary surfaces and quiet grouping" },
  },
  {
    name: "--muted-foreground",
    value: "var(--muted-foreground)",
    role: { ko: "보조 설명과 메타 정보", en: "Supporting copy and metadata" },
  },
  {
    name: "--border",
    value: "var(--border)",
    role: { ko: "필요한 경계만 얇게 표시", en: "Minimal boundaries only when needed" },
  },
  {
    name: "--ring",
    value: "var(--ring)",
    role: { ko: "키보드 포커스와 활성 신호", en: "Keyboard focus and active signals" },
  },
  {
    name: "--destructive",
    value: "var(--destructive)",
    role: { ko: "삭제, 실패, 되돌릴 수 없는 동작", en: "Delete, failure, and irreversible actions" },
  },
] satisfies FoundationColorToken[];

export const foundationRawColorScales = [
  {
    family: { ko: "Neutral scale", en: "Neutral scale" },
    description: {
      ko: "xGen 문서, 표면, 본문, 경계를 구성하는 기본 무채색 스케일입니다.",
      en: "The base neutral scale for xGen docs, surfaces, text, and boundaries.",
    },
    stops: [
      {
        name: "neutral-0",
        value: "oklch(1 0 0)",
        mapsTo: ["--card", "--popover"],
        usage: { ko: "가장 높은 정보 표면", en: "Highest information surfaces" },
      },
      {
        name: "neutral-50",
        value: "oklch(0.985 0 0)",
        mapsTo: ["--background", "--primary-foreground"],
        usage: { ko: "페이지 배경과 반전 텍스트", en: "Page canvas and inverse text" },
      },
      {
        name: "neutral-100",
        value: "oklch(0.97 0 0)",
        mapsTo: ["--muted", "--secondary", "--accent"],
        usage: { ko: "보조 표면과 약한 구획", en: "Quiet surfaces and weak grouping" },
      },
      {
        name: "neutral-200",
        value: "oklch(0.922 0 0)",
        mapsTo: ["--border", "--input"],
        usage: { ko: "경계, 입력 테두리", en: "Boundaries and input borders" },
      },
      {
        name: "neutral-500",
        value: "oklch(0.708 0 0)",
        mapsTo: ["--ring"],
        usage: { ko: "포커스와 활성 신호", en: "Focus and active signals" },
      },
      {
        name: "neutral-600",
        value: "oklch(0.556 0 0)",
        mapsTo: ["--muted-foreground"],
        usage: { ko: "보조 텍스트와 메타 정보", en: "Supporting text and metadata" },
      },
      {
        name: "neutral-900",
        value: "oklch(0.205 0 0)",
        mapsTo: ["--primary", "--secondary-foreground", "--accent-foreground"],
        usage: { ko: "명령 표면과 강한 보조 텍스트", en: "Command surfaces and strong supporting text" },
      },
      {
        name: "neutral-950",
        value: "oklch(0.145 0 0)",
        mapsTo: ["--foreground"],
        usage: { ko: "가장 높은 본문 위계", en: "Highest content hierarchy" },
      },
    ],
  },
  {
    family: { ko: "Critical scale", en: "Critical scale" },
    description: {
      ko: "삭제, 실패, 되돌릴 수 없는 결정에만 쓰는 위험 신호 스케일입니다.",
      en: "The risk signal scale reserved for failure, deletion, and irreversible decisions.",
    },
    stops: [
      {
        name: "red-600",
        value: "oklch(0.577 0.245 27.325)",
        mapsTo: ["--destructive"],
        usage: { ko: "파괴적 액션과 오류 상태", en: "Destructive actions and error states" },
      },
    ],
  },
] satisfies FoundationRawColorScale[];

export const foundationSemanticColors = [
  {
    role: { ko: "Canvas", en: "Canvas" },
    meaning: { ko: "작업이 놓이는 가장 낮은 배경", en: "The lowest surface where work sits" },
    usage: { ko: "페이지 배경, 넓은 문서 영역, 빈 상태의 기본 바탕", en: "Page backgrounds, broad docs areas, and empty-state bases" },
    tokens: ["--background", "--foreground"],
    surface: "var(--background)",
    ink: "var(--foreground)",
    border: "var(--border)",
  },
  {
    role: { ko: "Surface", en: "Surface" },
    meaning: { ko: "반복 정보와 선택지를 담는 한 단계 높은 면", en: "A raised layer for repeated information and choices" },
    usage: { ko: "Card, popover, preview frame, 선택 가능한 목록 항목", en: "Cards, popovers, preview frames, and selectable rows" },
    tokens: ["--card", "--card-foreground"],
    surface: "var(--card)",
    ink: "var(--card-foreground)",
    border: "var(--border)",
  },
  {
    role: { ko: "Primary content", en: "Primary content" },
    meaning: { ko: "사용자가 먼저 읽어야 하는 정보", en: "Information users should read first" },
    usage: { ko: "제목, 핵심 문장, 현재 값, 주요 숫자", en: "Titles, key copy, current values, and primary numbers" },
    tokens: ["--foreground"],
    surface: "var(--background)",
    ink: "var(--foreground)",
  },
  {
    role: { ko: "Secondary content", en: "Secondary content" },
    meaning: { ko: "판단을 돕지만 먼저 읽지 않아도 되는 정보", en: "Supporting information that helps judgment" },
    usage: { ko: "설명, 메타 정보, 보조 라벨, 비활성 힌트", en: "Descriptions, metadata, helper labels, and quiet hints" },
    tokens: ["--muted", "--muted-foreground"],
    surface: "var(--muted)",
    ink: "var(--muted-foreground)",
  },
  {
    role: { ko: "Action", en: "Action" },
    meaning: { ko: "실행 가능한 명령과 선택의 무게", en: "The weight of executable commands and choices" },
    usage: { ko: "주요 버튼, 선택된 컨트롤, 명령성이 필요한 상태", en: "Primary buttons, selected controls, and command-heavy states" },
    tokens: ["--primary", "--primary-foreground"],
    surface: "var(--primary)",
    ink: "var(--primary-foreground)",
  },
  {
    role: { ko: "Focus", en: "Focus" },
    meaning: { ko: "키보드 탐색과 현재 조작 대상", en: "Keyboard navigation and the current interaction target" },
    usage: { ko: "focus-visible ring, 활성 테두리, 검토 중인 입력", en: "Focus-visible rings, active borders, and reviewed inputs" },
    tokens: ["--ring"],
    surface: "var(--background)",
    ink: "var(--foreground)",
    border: "var(--ring)",
  },
  {
    role: { ko: "Critical", en: "Critical" },
    meaning: { ko: "실패, 삭제, 되돌리기 어려운 결정", en: "Failure, deletion, and hard-to-reverse decisions" },
    usage: { ko: "삭제 버튼, 오류 상태, 파괴적 확인", en: "Delete buttons, error states, and destructive confirmations" },
    tokens: ["--destructive"],
    surface: "var(--destructive)",
    ink: "white",
  },
] satisfies FoundationSemanticColor[];

export const foundationTypeTokens = [
  {
    name: "text-xs / leading-4",
    className: "text-xs leading-4",
    sample: { ko: "상태 메타", en: "Status meta" },
    usage: { ko: "badge, 보조 라벨, 짧은 상태", en: "Badges, helper labels, short status" },
  },
  {
    name: "text-sm / leading-6",
    className: "text-sm leading-6",
    sample: { ko: "설명 문장", en: "Description copy" },
    usage: { ko: "카드 설명, 입력 도움말", en: "Card descriptions and input help" },
  },
  {
    name: "text-base / leading-7",
    className: "text-base leading-7",
    sample: { ko: "기본 본문", en: "Default body" },
    usage: { ko: "문서 본문과 주요 안내", en: "Docs body and primary guidance" },
  },
  {
    name: "text-3xl / tracking-tight",
    className: "text-3xl leading-10 font-semibold tracking-tight",
    sample: { ko: "섹션 제목", en: "Section title" },
    usage: { ko: "페이지 안의 큰 구획 제목", en: "Major section headings inside pages" },
  },
] satisfies FoundationTypeToken[];

export const foundationSpacingTokens = [
  { name: "4px", value: "0.25rem", usage: { ko: "아이콘과 라벨 사이", en: "Icon-to-label gaps" } },
  { name: "8px", value: "0.5rem", usage: { ko: "칩, 필드 내부 간격", en: "Chips and field internals" } },
  { name: "12px", value: "0.75rem", usage: { ko: "작은 컴포넌트 묶음", en: "Small component groups" } },
  { name: "16px", value: "1rem", usage: { ko: "카드 내부 기본 리듬", en: "Default card interior rhythm" } },
  { name: "24px", value: "1.5rem", usage: { ko: "표면 padding과 묶음 간격", en: "Surface padding and group gaps" } },
  { name: "32px", value: "2rem", usage: { ko: "섹션 내부 블록 간격", en: "Blocks inside a section" } },
  { name: "48px", value: "3rem", usage: { ko: "큰 섹션 사이", en: "Major section separation" } },
  { name: "64px", value: "4rem", usage: { ko: "페이지 단위 호흡", en: "Page-level breathing room" } },
] satisfies FoundationScaleToken[];

export const foundationRadiusTokens = [
  { name: "radius-sm", value: "calc(var(--radius) - 4px)", usage: { ko: "작은 입력, 칩", en: "Small inputs and chips" } },
  { name: "radius-md", value: "calc(var(--radius) - 2px)", usage: { ko: "버튼, 컨트롤", en: "Buttons and controls" } },
  { name: "radius-lg", value: "var(--radius)", usage: { ko: "로컬 기본 표면", en: "Local default surfaces" } },
  { name: "radius-xl", value: "calc(var(--radius) + 4px)", usage: { ko: "카드와 preview frame", en: "Cards and preview frames" } },
] satisfies FoundationScaleToken[];

export const foundationStateRules = [
  {
    state: "focus-visible",
    signal: { ko: "링은 접근성 신호", en: "Ring is an accessibility signal" },
    rule: { ko: "키보드 탐색에서는 ring을 숨기지 않습니다.", en: "Do not hide rings during keyboard navigation." },
  },
  {
    state: "disabled",
    signal: { ko: "불가 상태는 명령성을 낮춤", en: "Unavailable state lowers command weight" },
    rule: { ko: "투명도와 cursor 상태는 shadcn primitive 기본값을 따릅니다.", en: "Use shadcn primitive defaults for opacity and cursor state." },
  },
  {
    state: "aria-invalid",
    signal: { ko: "오류는 필드 가까이에서 설명", en: "Explain errors close to the field" },
    rule: { ko: "색만 쓰지 말고 helper text로 복구 방법을 붙입니다.", en: "Pair color with helper text that tells users how to recover." },
  },
  {
    state: "data-state",
    signal: { ko: "컴포넌트 상태는 속성으로 표현", en: "Component state lives in attributes" },
    rule: { ko: "선택, 열림, 활성 상태는 wrapper class보다 primitive state를 우선합니다.", en: "Prefer primitive state attributes over wrapper-only classes." },
  },
] satisfies FoundationStateRule[];
