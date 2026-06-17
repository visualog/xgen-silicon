import type { LocalizedText } from "../_components/design-system-preferences";

export const designSystemNav = [
  { href: "/design-system", label: { ko: "개요", en: "Overview" } },
  { href: "/design-system/foundation", label: { ko: "파운데이션", en: "Foundation" } },
  { href: "/design-system/components", label: { ko: "컴포넌트", en: "Components" } },
  { href: "/design-system/patterns", label: { ko: "패턴", en: "Patterns" } },
  { href: "/design-system/templates", label: { ko: "템플릿", en: "Templates" } },
] satisfies Array<{ href: string; label: LocalizedText }>;

export const overviewCards = [
  {
    title: { ko: "파운데이션", en: "Foundation" },
    href: "/design-system/foundation",
    description: {
      ko: "shadcn 테마 변수, 타이포그래피, 간격, radius, 상태 규칙.",
      en: "shadcn theme variables, typography, spacing, radius, and state rules.",
    },
    items: ["color", "type", "spacing", "state"],
  },
  {
    title: { ko: "컴포넌트", en: "Components" },
    href: "/design-system/components",
    description: {
      ko: "xGen 화면이 조합할 수 있는 로컬 shadcn 프리미티브.",
      en: "Local shadcn primitives that xGen screens are allowed to compose.",
    },
    items: ["actions", "inputs", "selection", "feedback"],
  },
  {
    title: { ko: "패턴", en: "Patterns" },
    href: "/design-system/patterns",
    description: {
      ko: "승인된 프리미티브로 조립한 xGen 워크플로 조합.",
      en: "xGen workflow compositions assembled from approved primitives.",
    },
    items: ["prompt", "reference", "queue", "gallery"],
  },
  {
    title: { ko: "템플릿", en: "Templates" },
    href: "/design-system/templates",
    description: {
      ko: "진입, 작업 공간, 갤러리, 문서 화면의 화면 단위 계약.",
      en: "Screen-level contracts for entry, workspace, gallery, and docs pages.",
    },
    items: ["entry", "canvas", "gallery", "docs"],
  },
];

export const foundationGroups = [
  {
    title: { ko: "테마 토큰", en: "Theme tokens" },
    description: {
      ko: "런타임 UI는 globals.css의 shadcn 변수에서 시작해야 합니다.",
      en: "Runtime UI should start from shadcn variables in globals.css.",
    },
    items: ["background", "foreground", "card", "muted", "border", "ring"],
  },
  {
    title: { ko: "타입과 리듬", en: "Type and rhythm" },
    description: {
      ko: "로컬 예외를 추가하기 전에 Tailwind/shadcn 스케일 유틸리티를 우선 사용합니다.",
      en: "Use Tailwind/shadcn scale utilities before adding local exceptions.",
    },
    items: ["text-sm", "text-base", "text-3xl", "leading-7", "tracking-tight"],
  },
  {
    title: { ko: "형태와 상태", en: "Shape and state" },
    description: {
      ko: "컨트롤은 radius, focus, disabled, border 동작을 프리미티브에서 상속해야 합니다.",
      en: "Controls should inherit radius, focus, disabled, and border behavior from primitives.",
    },
    items: ["radius-md", "radius-lg", "focus-visible", "disabled", "aria state"],
  },
];

export const componentGroups = [
  {
    title: { ko: "액션", en: "Actions" },
    description: { ko: "명령, 보조 액션, 아이콘 버튼, 그룹 컨트롤.", en: "Commands, secondary actions, icon buttons, and grouped controls." },
    components: ["Button", "ButtonGroup", "ToggleGroup"],
  },
  {
    title: { ko: "입력", en: "Inputs" },
    description: { ko: "프롬프트, 이름, 검색, 긴 생성 브리프.", en: "Prompt text, naming, search, and longer generation briefs." },
    components: ["Input", "Textarea", "Label"],
  },
  {
    title: { ko: "선택", en: "Selection" },
    description: { ko: "단일 프리셋과 이진 렌더 옵션.", en: "Single-value presets and binary render options." },
    components: ["Select", "Switch", "Checkbox", "Slider", "Tabs"],
  },
  {
    title: { ko: "피드백", en: "Feedback" },
    description: { ko: "생성 상태, 준비 상태, 로딩, 진행 표시.", en: "Generation state, readiness, loading, and progress indicators." },
    components: ["Badge", "Progress", "Skeleton", "Chart"],
  },
  {
    title: { ko: "서피스", en: "Surfaces" },
    description: { ko: "반복 정보 블록을 위한 재사용 콘텐츠 셸.", en: "Reusable content shells for repeated information blocks." },
    components: ["Card", "Separator", "Avatar"],
  },
  {
    title: { ko: "조합", en: "Composition" },
    description: {
      ko: "프로덕션 화면에 적용하기 전 프리미티브를 결합하는 방식.",
      en: "How primitives should be combined before production screens adopt them.",
    },
    components: ["Container", "Grid", "Section intro", "Directory"],
  },
];

export const componentUsageNotes = [
  {
    title: { ko: "액션", en: "Actions" },
    do: { ko: "로컬 서피스마다 기본 명령은 하나만 두고 관련 보조 액션을 그룹화합니다.", en: "Use one primary command per local surface and group related secondary actions." },
    dont: { ko: "모든 액션을 primary로 만들거나 워크플로 결정을 프리미티브 예시에 섞지 않습니다.", en: "Do not make every action primary or mix workflow decisions into primitive examples." },
  },
  {
    title: { ko: "입력", en: "Inputs" },
    do: { ko: "모든 필드에 보이는 레이블을 붙이고 helper text는 필드 가까이에 둡니다.", en: "Pair every field with a visible label and keep helper text close to the field." },
    dont: { ko: "placeholder 문구를 유일한 안내로 사용하지 않습니다.", en: "Do not rely on placeholder copy as the only instruction." },
  },
  {
    title: { ko: "선택", en: "Selection" },
    do: { ko: "옵션 세트는 Select, 이진 설정은 Switch, 압축 모드는 ToggleGroup을 씁니다.", en: "Use Select for option sets, Switch for binary settings, and ToggleGroup for compact modes." },
    dont: { ko: "무관한 명령을 segmented control로 묶지 않습니다.", en: "Do not use segmented controls for unrelated commands." },
  },
  {
    title: { ko: "피드백", en: "Feedback" },
    do: { ko: "Badge와 Progress로 레이아웃 높이를 흔들지 않고 상태를 설명합니다.", en: "Use Badge and Progress to describe state without changing layout height." },
    dont: { ko: "실제 progress 값이 없을 때 progress bar를 장식으로 쓰지 않습니다.", en: "Do not use progress bars as decoration when no progress value exists." },
  },
  {
    title: { ko: "서피스", en: "Surfaces" },
    do: { ko: "Card는 명확한 header/content 리듬이 있는 반복 콘텐츠 단위에만 사용합니다.", en: "Use Card for repeated content units with a clear header/content rhythm." },
    dont: { ko: "카드 안에 카드를 중첩하거나 전체 페이지 섹션을 카드로 감싸지 않습니다.", en: "Do not nest cards inside cards or wrap full page sections as cards." },
  },
  {
    title: { ko: "조합", en: "Composition" },
    do: { ko: "프리미티브 선택 이후 워크플로별 조합은 Patterns로 옮깁니다.", en: "Move workflow-specific combinations to Patterns after primitives are chosen." },
    dont: { ko: "컴포넌트 카탈로그를 제품 화면 쇼케이스로 바꾸지 않습니다.", en: "Do not turn the component catalog into a product screen showcase." },
  },
];

export const templateCards = [
  {
    name: { ko: "생성 진입", en: "Generation entry" },
    route: "/",
    purpose: {
      ko: "shadcn form과 action 프리미티브를 사용하는 prompt-first 생성 시작 화면.",
      en: "Prompt-first generation start using shadcn form and action primitives.",
    },
    regions: [
      { ko: "헤더", en: "header" },
      { ko: "프롬프트", en: "prompt" },
      { ko: "레퍼런스", en: "references" },
      { ko: "갤러리", en: "gallery" },
    ],
  },
  {
    name: { ko: "캔버스 작업 공간", en: "Canvas workspace" },
    route: "/ active workspace",
    purpose: {
      ko: "생성 결과와 node-like 컨트롤을 위한 집중 작업 서피스.",
      en: "Focused working surface for generated outputs and node-like controls.",
    },
    regions: [
      { ko: "상단 바", en: "topbar" },
      { ko: "툴 레일", en: "tool rail" },
      { ko: "캔버스", en: "canvas" },
      { ko: "결과", en: "result" },
    ],
  },
  {
    name: { ko: "디자인 문서", en: "Design documentation" },
    route: "/design-system/*",
    purpose: {
      ko: "xGen UI 결정을 위한 별도 shadcn-native 문서 사이트.",
      en: "Separate shadcn-native documentation site for xGen UI decisions.",
    },
    regions: [
      { ko: "문서 내비게이션", en: "docs nav" },
      { ko: "히어로", en: "hero" },
      { ko: "카탈로그", en: "catalog" },
      { ko: "템플릿", en: "templates" },
    ],
  },
];

export const patternCards = [
  {
    name: { ko: "프롬프트 빌더", en: "Prompt builder" },
    purpose: { ko: "크리에이티브 브리프, 출력 대상, 첫 생성 액션을 수집합니다.", en: "Capture the creative brief, output target, and first generation action." },
    primitives: ["Input", "Textarea", "Select", "ButtonGroup"],
    signal: { ko: "진입", en: "Entry" },
  },
  {
    name: { ko: "스타일 레퍼런스 선택", en: "Style reference picker" },
    purpose: { ko: "시각 레퍼런스를 붙이고 생성 영향 강도를 조정합니다.", en: "Attach visual references and tune how strongly they influence generation." },
    primitives: ["Card", "Avatar", "Slider", "Switch"],
    signal: { ko: "레퍼런스", en: "Reference" },
  },
  {
    name: { ko: "생성 큐", en: "Generation queue" },
    purpose: { ko: "프롬프트, 레퍼런스 분석, 렌더, 갤러리 전달 상태를 보여줍니다.", en: "Show prompt, reference analysis, render, and gallery handoff status." },
    primitives: ["Badge", "Progress", "Separator"],
    signal: { ko: "상태", en: "Status" },
  },
  {
    name: { ko: "출력 프리셋", en: "Output preset" },
    purpose: { ko: "렌더 전 비율, 품질, export 의도를 요약합니다.", en: "Summarize ratio, quality, and export intent before creating a render." },
    primitives: ["Card", "Badge", "ToggleGroup"],
    signal: { ko: "출력", en: "Output" },
  },
  {
    name: { ko: "갤러리 액션", en: "Gallery action" },
    purpose: { ko: "결과를 검토하고 재사용, export, 캔버스 편집으로 분기합니다.", en: "Review a result and branch into reuse, export, or canvas editing." },
    primitives: ["Button", "ButtonGroup", "Card"],
    signal: { ko: "검토", en: "Review" },
  },
  {
    name: { ko: "설정 행", en: "Settings row" },
    purpose: { ko: "모달 없이 압축된 이진 또는 상태 컨트롤을 노출합니다.", en: "Expose compact binary or status controls without opening a modal." },
    primitives: ["Label", "Switch", "Checkbox"],
    signal: { ko: "컨트롤", en: "Control" },
  },
];

export const runtimeBoundary = [
  {
    title: { ko: "활성 소스", en: "Active source" },
    description: {
      ko: "디자인 시스템 페이지와 새 shadcn 마이그레이션 작업에는 이 기준을 사용합니다.",
      en: "Use these for design-system pages and new shadcn migration work.",
    },
    items: ["components.json", "src/components/ui/*", "bg-background", "text-foreground"],
  },
  {
    title: { ko: "호환성 전용", en: "Compatibility only" },
    description: {
      ko: "마이그레이션 위험을 문서화하는 경우가 아니라면 디자인 시스템 문서에서 제외합니다.",
      en: "Keep these away from design-system docs unless documenting migration risk.",
    },
    items: ["design-md/*", "Xgen* wrappers", "--ui-* aliases", "legacy node styling"],
  },
];
