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
      ko: "색, 타입, 간격, 상태의 기본값을 확인합니다.",
      en: "Check the defaults for color, type, spacing, and state.",
    },
    items: ["color", "type", "spacing", "state"],
  },
  {
    title: { ko: "컴포넌트", en: "Components" },
    href: "/design-system/components",
    description: {
      ko: "새 화면에 바로 쓸 로컬 shadcn 컴포넌트입니다.",
      en: "Local shadcn components ready for new screens.",
    },
    items: ["actions", "inputs", "selection", "feedback"],
  },
  {
    title: { ko: "패턴", en: "Patterns" },
    href: "/design-system/patterns",
    description: {
      ko: "생성 흐름에 맞춘 컴포넌트 조합을 봅니다.",
      en: "See component combinations for generation flows.",
    },
    items: ["prompt", "reference", "queue", "gallery"],
  },
  {
    title: { ko: "템플릿", en: "Templates" },
    href: "/design-system/templates",
    description: {
      ko: "진입, 작업, 갤러리, 문서 화면의 뼈대입니다.",
      en: "Page structures for entry, work, gallery, and docs.",
    },
    items: ["entry", "canvas", "gallery", "docs"],
  },
];

export const foundationGroups = [
  {
    title: { ko: "테마 토큰", en: "Theme tokens" },
    description: {
      ko: "새 UI는 globals.css의 shadcn 변수에서 시작합니다.",
      en: "New UI starts from the shadcn variables in globals.css.",
    },
    items: ["background", "foreground", "card", "muted", "border", "ring"],
  },
  {
    title: { ko: "타입과 리듬", en: "Type and rhythm" },
    description: {
      ko: "예외를 만들기 전에 Tailwind와 shadcn 스케일을 먼저 씁니다.",
      en: "Use Tailwind and shadcn scales before adding local exceptions.",
    },
    items: ["text-sm", "text-base", "text-3xl", "leading-7", "tracking-tight"],
  },
  {
    title: { ko: "형태와 상태", en: "Shape and state" },
    description: {
      ko: "radius, focus, disabled, border는 컴포넌트 기본 동작을 따릅니다.",
      en: "Radius, focus, disabled, and border behavior come from the component defaults.",
    },
    items: ["radius-md", "radius-lg", "focus-visible", "disabled", "aria state"],
  },
];

export const componentGroups = [
  {
    title: { ko: "액션", en: "Actions" },
    description: { ko: "주요 명령, 보조 액션, 아이콘 버튼, 버튼 그룹.", en: "Primary commands, secondary actions, icon buttons, and button groups." },
    components: ["Button", "ButtonGroup", "ToggleGroup"],
  },
  {
    title: { ko: "입력", en: "Inputs" },
    description: { ko: "프롬프트, 이름, 검색, 긴 생성 브리프를 입력합니다.", en: "Inputs for prompts, names, search, and longer generation briefs." },
    components: ["Input", "Textarea", "Label"],
  },
  {
    title: { ko: "선택", en: "Selection" },
    description: { ko: "프리셋, 모드, 이진 설정을 선택합니다.", en: "Controls for presets, modes, and binary settings." },
    components: ["Select", "Switch", "Checkbox", "Slider", "Tabs"],
  },
  {
    title: { ko: "피드백", en: "Feedback" },
    description: { ko: "준비, 로딩, 진행률, 완료 상태를 보여줍니다.", en: "Shows readiness, loading, progress, and completion states." },
    components: ["Badge", "Progress", "Skeleton", "Chart"],
  },
  {
    title: { ko: "서피스", en: "Surfaces" },
    description: { ko: "반복되는 정보 블록을 안정적으로 묶습니다.", en: "Groups repeated information blocks with consistent structure." },
    components: ["Card", "Separator", "Avatar"],
  },
  {
    title: { ko: "조합", en: "Composition" },
    description: {
      ko: "화면에 적용하기 전 컴포넌트를 조합하는 방식입니다.",
      en: "How components combine before they land in production screens.",
    },
    components: ["Container", "Grid", "Section intro", "Directory"],
  },
];

export const componentUsageNotes = [
  {
    title: { ko: "액션", en: "Actions" },
    do: { ko: "한 영역에는 가장 중요한 명령 하나만 강조하고, 나머지는 보조 액션으로 묶습니다.", en: "Highlight one main command per area and group the rest as secondary actions." },
    dont: { ko: "모든 버튼을 강조하거나, 컴포넌트 예시에 제품 흐름 결정을 섞지 않습니다.", en: "Do not make every button primary or mix product-flow decisions into component examples." },
  },
  {
    title: { ko: "입력", en: "Inputs" },
    do: { ko: "모든 필드에는 보이는 레이블을 붙이고, 도움말은 필드 바로 아래에 둡니다.", en: "Give every field a visible label and keep helper text directly below it." },
    dont: { ko: "placeholder만으로 입력 방법을 설명하지 않습니다.", en: "Do not use placeholder text as the only instruction." },
  },
  {
    title: { ko: "선택", en: "Selection" },
    do: { ko: "여러 옵션은 Select, 켜고 끄는 설정은 Switch, 짧은 모드 전환은 ToggleGroup을 씁니다.", en: "Use Select for option sets, Switch for on/off settings, and ToggleGroup for compact modes." },
    dont: { ko: "서로 다른 명령을 하나의 segmented control처럼 묶지 않습니다.", en: "Do not group unrelated commands as if they were one segmented control." },
  },
  {
    title: { ko: "피드백", en: "Feedback" },
    do: { ko: "Badge와 Progress로 상태를 짧게 보여주고, 레이아웃 높이는 흔들지 않습니다.", en: "Use Badge and Progress for short status cues without shifting layout height." },
    dont: { ko: "실제 진행값이 없으면 progress bar를 장식으로 쓰지 않습니다.", en: "Do not use a progress bar decoratively when there is no real progress value." },
  },
  {
    title: { ko: "서피스", en: "Surfaces" },
    do: { ko: "Card는 제목과 내용의 리듬이 분명한 반복 항목에만 씁니다.", en: "Use Card for repeated items with a clear title-and-content rhythm." },
    dont: { ko: "카드 안에 카드를 넣거나, 큰 페이지 섹션 전체를 카드로 감싸지 않습니다.", en: "Do not nest cards or wrap entire page sections inside a card." },
  },
  {
    title: { ko: "조합", en: "Composition" },
    do: { ko: "컴포넌트를 고른 뒤, 흐름에 맞춘 조합은 Patterns에서 다룹니다.", en: "Choose components first, then document workflow combinations in Patterns." },
    dont: { ko: "컴포넌트 목록에 완성 화면 예시를 과하게 섞지 않습니다.", en: "Do not overload the component list with finished-screen examples." },
  },
];

export const templateCards = [
  {
    name: { ko: "생성 시작", en: "Generation start" },
    route: "/",
    purpose: {
      ko: "프롬프트를 먼저 받고 필요한 설정만 이어서 여는 시작 화면입니다.",
      en: "A prompt-first start screen that reveals settings only when needed.",
    },
    regions: [
      { ko: "헤더", en: "header" },
      { ko: "프롬프트", en: "prompt" },
      { ko: "레퍼런스", en: "references" },
      { ko: "갤러리", en: "gallery" },
    ],
  },
  {
    name: { ko: "캔버스 작업", en: "Canvas workspace" },
    route: "/ active workspace",
    purpose: {
      ko: "생성 결과를 확인하고 세부 조정을 이어가는 집중 작업 화면입니다.",
      en: "A focused workspace for reviewing outputs and continuing detailed edits.",
    },
    regions: [
      { ko: "상단 바", en: "topbar" },
      { ko: "툴 레일", en: "tool rail" },
      { ko: "캔버스", en: "canvas" },
      { ko: "결과", en: "result" },
    ],
  },
  {
    name: { ko: "디자인 시스템 문서", en: "Design system docs" },
    route: "/design-system/*",
    purpose: {
      ko: "xGen UI 결정을 shadcn 기준으로 정리하는 별도 문서 화면입니다.",
      en: "A separate docs area for xGen UI decisions grounded in shadcn.",
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
    purpose: { ko: "브리프, 출력 대상, 첫 생성 액션을 한 흐름에서 받습니다.", en: "Collect the brief, output target, and first generation action in one flow." },
    primitives: ["Input", "Textarea", "Select", "ButtonGroup"],
    signal: { ko: "진입", en: "Entry" },
  },
  {
    name: { ko: "스타일 레퍼런스 선택", en: "Style reference picker" },
    purpose: { ko: "시각 레퍼런스를 추가하고 생성에 반영할 강도를 조절합니다.", en: "Attach visual references and tune how strongly they guide generation." },
    primitives: ["Card", "Avatar", "Slider", "Switch"],
    signal: { ko: "레퍼런스", en: "Reference" },
  },
  {
    name: { ko: "생성 큐", en: "Generation queue" },
    purpose: { ko: "프롬프트부터 갤러리 저장까지 각 단계의 상태를 보여줍니다.", en: "Show the status from prompt intake through gallery handoff." },
    primitives: ["Badge", "Progress", "Separator"],
    signal: { ko: "상태", en: "Status" },
  },
  {
    name: { ko: "출력 프리셋", en: "Output preset" },
    purpose: { ko: "생성 전 비율, 품질, 내보내기 목적을 짧게 확인합니다.", en: "Confirm ratio, quality, and export intent before rendering." },
    primitives: ["Card", "Badge", "ToggleGroup"],
    signal: { ko: "출력", en: "Output" },
  },
  {
    name: { ko: "갤러리 액션", en: "Gallery action" },
    purpose: { ko: "결과를 검토한 뒤 재사용, 내보내기, 캔버스 편집으로 이어갑니다.", en: "Review a result, then move to reuse, export, or canvas editing." },
    primitives: ["Button", "ButtonGroup", "Card"],
    signal: { ko: "검토", en: "Review" },
  },
  {
    name: { ko: "설정 행", en: "Settings row" },
    purpose: { ko: "모달을 열지 않고 필요한 설정만 한 줄로 제공합니다.", en: "Expose only the needed setting in a compact row without a modal." },
    primitives: ["Label", "Switch", "Checkbox"],
    signal: { ko: "컨트롤", en: "Control" },
  },
];

export const runtimeBoundary = [
  {
    title: { ko: "기준 소스", en: "Standard source" },
    description: {
      ko: "새 디자인 시스템 문서와 shadcn 마이그레이션 작업은 이 기준을 사용합니다.",
      en: "Use these for new design-system docs and shadcn migration work.",
    },
    items: ["components.json", "src/components/ui/*", "bg-background", "text-foreground"],
  },
  {
    title: { ko: "이전 화면용", en: "Legacy support" },
    description: {
      ko: "마이그레이션 위험을 설명할 때만 언급하고, 새 기준으로 삼지 않습니다.",
      en: "Mention these only when explaining migration risk; do not use them as new standards.",
    },
    items: ["design-md/*", "Xgen* wrappers", "--ui-* aliases", "legacy node styling"],
  },
];
