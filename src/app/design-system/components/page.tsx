import Link from "next/link";
import type { CSSProperties } from "react";
import { LayoutGrid, Palette, Wand2, X } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui";

export const metadata = {
  title: "컴포넌트 | xGen 디자인 시스템",
  description: "xGen 사이트와 앱에서 사용하는 컴포넌트 기준.",
};

type ComponentSpec = {
  name: string;
  className: string;
  role: string;
  tokens: string[];
  usage: string;
};

type ComponentGroupSpec = {
  id: string;
  title: string;
  summary: string;
  variants: string[];
  states: string[];
};

const componentSpecs: ComponentSpec[] = [
  {
    name: "Brand Lockup",
    className: ".brand-lockup .brand-mark .brand-name",
    role: "홈과 디자인 시스템 상단 좌측에서 제품 정체성과 현재 위치를 표시하는 브랜드 묶음.",
    tokens: ["--ui-radius-xl", "--brand-warm", "--brand-ember-soft", "--brand-mint", "--ui-type-lg"],
    usage: "상단 내비게이션의 첫 항목으로만 사용합니다.",
  },
  {
    name: "Brand Breadcrumb",
    className: ".brand-breadcrumb .breadcrumb-link .breadcrumb-current",
    role: "디자인 시스템 하위 화면의 현재 위치와 상위 이동 경로를 표시.",
    tokens: ["--ui-space-8", "--ui-type-lg", "--text-primary", "--text-secondary"],
    usage: "문서성 화면에서 홈/상위 페이지 이동을 우상단 버튼으로 중복하지 않습니다.",
  },
  {
    name: "Studio Topbar",
    className: ".studio-topbar .studio-actions",
    role: "홈과 디자인 시스템 페이지 상단의 브랜드 영역과 주요 액션을 정렬하는 내비게이션 바.",
    tokens: ["--ui-space-20", "--ui-space-10", "--ease-out-expo"],
    usage: "페이지 상단에서 브랜드 락업과 화면 액션을 양끝 정렬합니다.",
  },
  {
    name: "Primary Command",
    className: ".primary-command",
    role: "주요 생성, 새 보드 생성처럼 다음 행동이 하나일 때 쓰는 강한 액션.",
    tokens: ["--component-action-height", "--component-action-radius", "--component-action-primary-bg", "--component-action-label-type"],
    usage: "한 화면에서 하나의 주요 흐름에만 사용합니다.",
  },
  {
    name: "Secondary Command",
    className: ".secondary-command",
    role: "디자인 시스템 이동, 보조 내비게이션처럼 현재 흐름을 깨지 않는 이동 액션.",
    tokens: ["--component-action-height", "--component-action-secondary-bg", "--component-action-secondary-fg"],
    usage: "상단 바와 문서 내 이동에 사용합니다.",
  },
  {
    name: "Icon Toggle",
    className: ".icon-toggle",
    role: "테마, 보기 모드, 툴 토글처럼 반복 조작하는 단일 아이콘 컨트롤.",
    tokens: ["--component-action-height", "--component-action-radius", "--size-control-input-lg"],
    usage: "텍스트 라벨 대신 aria-label과 title을 제공합니다.",
  },
  {
    name: "Round Tool",
    className: ".round-tool .back-tool",
    role: "뒤로가기처럼 공간을 적게 쓰는 원형 도구 버튼.",
    tokens: ["--ui-radius-xl", "--size-control-sm", "--text-primary", "--border-node"],
    usage: "툴바 내부에서만 사용하고 단독 CTA로 사용하지 않습니다.",
  },
  {
    name: "Kicker",
    className: ".kicker",
    role: "히어로와 문서 섹션 위에 붙는 짧은 상위 라벨.",
    tokens: ["--ui-type-xs", "--port-style", "--text-primary"],
    usage: "문장 설명 대신 짧은 분류명에만 사용합니다.",
  },
  {
    name: "System Pulse",
    className: ".system-pulse",
    role: "로컬 처리 상태처럼 시스템 준비 상태를 조용하게 알리는 상태 칩.",
    tokens: ["--ui-radius-pill", "--component-chip-type", "--port-prompt"],
    usage: "상시 상태 표시에 사용하며 주요 액션 버튼을 대체하지 않습니다.",
  },
  {
    name: "Tool Pill",
    className: ".tool-pill",
    role: "라이브러리 필터/수량/상태 같은 작은 메타 정보를 표시하는 칩.",
    tokens: ["--ui-radius-pill", "--ui-type-xs-2", "--border-node", "--text-secondary"],
    usage: "짧은 숫자와 라벨 조합에 사용합니다.",
  },
  {
    name: "Metrics Panel",
    className: ".metrics-panel",
    role: "홈 히어로 우측의 여러 지표 카드를 묶는 패널.",
    tokens: ["--ui-radius-3xl-2", "--ui-space-12", "--border-node", "--bg-node-base"],
    usage: "반복 카드 그룹을 한 번만 묶는 요약 패널로 사용합니다.",
  },
  {
    name: "Gallery Card",
    className: ".gallery-card.studio-card",
    role: "생성 결과 이미지를 보여주고 메타 정보를 hover/하단 칩으로 보조하는 결과 카드.",
    tokens: ["--component-card-bg", "--component-card-radius", "--component-card-shadow", "--component-chip-type"],
    usage: "반복 목록에서만 사용하며, 섹션 컨테이너 대용으로 쓰지 않습니다.",
  },
  {
    name: "Gallery Masonry",
    className: ".gallery-masonry.redesigned",
    role: "생성 결과 카드를 세로 밀도에 맞춰 배치하는 라이브러리 목록.",
    tokens: ["--ui-space-20", "--component-card-radius", "--component-card-shadow"],
    usage: "갤러리 결과 목록에서만 사용합니다.",
  },
  {
    name: "Gallery Card Overlay",
    className: ".gallery-card-overlay .gallery-card-copy .gallery-card-footer",
    role: "결과 카드 위에 제목, 프롬프트 요약, 생성 시각, 열기 신호를 올리는 정보 오버레이.",
    tokens: ["--overlay-ink-strong", "--ui-space-16", "--ui-type-base-6", "--ui-type-xs"],
    usage: "이미지 위 텍스트는 짧게 유지하고 상세 설명은 에디터에서 보여줍니다.",
  },
  {
    name: "Gallery Delete Button",
    className: ".gallery-card-delete",
    role: "갤러리 카드의 삭제 액션을 카드 우상단에 노출하는 위험 액션 버튼.",
    tokens: ["--ui-radius-pill", "--border-node", "--port-constraint"],
    usage: "클릭 전 확인 절차가 있는 삭제 액션에만 사용합니다.",
  },
  {
    name: "Asset Status",
    className: ".asset-status",
    role: "분석 중, 고정 완료, 재시도 상태를 이미지 카드 위에 표시하는 상태 배지.",
    tokens: ["--ui-radius-pill", "--component-chip-type", "--port-prompt", "--port-constraint"],
    usage: "상태별 색은 ready/pending/failed 의미와 일치해야 합니다.",
  },
  {
    name: "Asset Data Strip",
    className: ".asset-data-strip",
    role: "비율, 해상도, 앨리먼트 수처럼 결과 이미지의 메타 데이터를 나열.",
    tokens: ["--ui-space-10", "--ui-radius-pill", "--ui-type-xs"],
    usage: "카드 하단에서 짧은 메타값만 표시합니다.",
  },
  {
    name: "Open Cue",
    className: ".open-cue",
    role: "카드 오버레이에서 상세 열기 가능성을 알려주는 작은 신호.",
    tokens: ["--ui-type-xs", "--ui-surface-white", "--ui-space-unit"],
    usage: "카드 전체가 열기 동작을 가질 때 보조 힌트로만 사용합니다.",
  },
  {
    name: "Empty State",
    className: ".empty-studio .empty-signal",
    role: "라이브러리에 결과가 없을 때 첫 생성 행동을 안내하는 빈 상태.",
    tokens: ["--ui-radius-3xl-3", "--ui-space-48", "--brand-warm", "--brand-mint"],
    usage: "빈 목록에서만 사용하고 일반 안내 패널로 재사용하지 않습니다.",
  },
  {
    name: "Metric Card",
    className: ".metric-card",
    role: "홈 히어로 우측에서 결과 수, 분석률, 최근 생성 상태를 짧게 보여주는 요약 카드.",
    tokens: ["--component-panel-bg", "--component-panel-radius", "--ui-type-xs", "--ui-type-5xl"],
    usage: "숫자 또는 한 단어 상태처럼 스캔 가능한 값에만 사용합니다.",
  },
  {
    name: "Metric Bar",
    className: ".metric-bar",
    role: "일관성 분석률과 스타일 참조율을 짧게 보여주는 진행 막대.",
    tokens: ["--ui-radius-pill", "--port-element-board", "--port-prompt", "--port-style"],
    usage: "0-100 사이의 비율 값에만 사용합니다.",
  },
  {
    name: "Library Heading",
    className: ".library-heading .library-tools",
    role: "라이브러리 섹션 제목과 도구 칩을 한 줄로 묶는 섹션 헤더.",
    tokens: ["--ui-type-section-title", "--ui-space-20", "--ui-space-24"],
    usage: "결과 목록 상단에서만 사용합니다.",
  },
  {
    name: "Editor Topbar",
    className: ".editor-topbar",
    role: "에디터 화면의 뒤로가기와 작업 제목 입력을 묶는 떠 있는 툴바.",
    tokens: ["--component-panel-bg", "--component-panel-radius", "--component-panel-shadow", "--ui-type-lg"],
    usage: "모드 토글과 분리해서 좌측 상단에 둡니다.",
  },
  {
    name: "Editor Title Input",
    className: ".editor-title-input",
    role: "이미지 캔버스 제목을 표시하고 사용자가 직접 수정하는 입력 필드.",
    tokens: ["--ui-type-lg", "--ui-radius-xl", "--text-primary", "--border-node"],
    usage: "자동 생성 제목보다 사용자가 직접 입력한 제목을 우선합니다.",
  },
  {
    name: "Editor Mode Toggle",
    className: ".editor-mode-toggle",
    role: "React Flow 확대/축소 컨트롤과 테마 토글을 묶는 우상단 도구군.",
    tokens: ["--ui-radius-2xl-2", "--ui-space-unit", "--component-panel-shadow"],
    usage: "에디터 제목바와 분리해 캔버스 우상단에 둡니다.",
  },
  {
    name: "Node Add Dock",
    className: ".node-add-dock",
    role: "설정 노드 추가 트리거와 팝오버의 고정 위치 컨테이너.",
    tokens: ["--ui-space-20", "--component-popover-radius", "--component-panel-shadow"],
    usage: "에디터 캔버스 좌상단 두 번째 줄에 배치합니다.",
  },
  {
    name: "Node Add Trigger",
    className: ".node-add-trigger",
    role: "추가 가능한 설정 노드 수를 보여주며 팝오버를 여는 콤팩트 버튼.",
    tokens: ["--ui-radius-2xl", "--ui-type-xs-2", "--component-panel-shadow"],
    usage: "항상 남은 추가 가능 수와 함께 표시합니다.",
  },
  {
    name: "Node Add Popover",
    className: ".node-add-popover",
    role: "선택 가능한 설정 노드를 좁은 면적으로 추가하는 메뉴.",
    tokens: ["--component-popover-bg", "--component-popover-radius", "--component-panel-shadow", "--component-chip-type"],
    usage: "에디터 캔버스 위에만 노출합니다.",
  },
  {
    name: "Node Add Option",
    className: ".node-add-option",
    role: "팝오버 안에서 추가할 수 있는 개별 설정 노드를 표시하는 옵션 행.",
    tokens: ["--node-accent", "--ui-space-10", "--ui-type-xs-2", "--border-node"],
    usage: "노드 의미에 맞는 포트 색을 accent로 사용합니다.",
  },
  {
    name: "Node Added Chip",
    className: ".node-added-chip",
    role: "이미 캔버스에 추가된 설정 노드를 읽기 전용으로 보여주는 작은 칩.",
    tokens: ["--ui-radius-pill", "--component-chip-type", "--text-secondary"],
    usage: "추가 목록 아래의 보조 상태로만 사용합니다.",
  },
  {
    name: "Flow Node",
    className: "src/components/nodes/*Node.tsx",
    role: "프롬프트, 스타일, 구도, 배경, 출력처럼 생성 파이프라인의 조작 단위를 표현.",
    tokens: ["--component-node-bg", "--component-node-header-bg", "--component-node-radius", "--component-node-title-type", "--component-node-shadow"],
    usage: "항상 포트 색과 연결 상태를 함께 표시합니다.",
  },
  {
    name: "Prompt Node",
    className: "PromptNode",
    role: "이미지 생성의 기본 설명 프롬프트를 입력하는 핵심 노드.",
    tokens: ["--component-node-bg", "--component-node-header-bg", "--port-prompt"],
    usage: "모든 생성 보드의 시작 입력으로 사용합니다.",
  },
  {
    name: "Style Node",
    className: "StyleNode",
    role: "스타일 참조 이미지와 분석 결과를 관리하는 노드.",
    tokens: ["--component-node-bg", "--port-style", "--size-icon-container"],
    usage: "스타일 추가 모달과 함께 사용합니다.",
  },
  {
    name: "Reference Node",
    className: "ReferenceNode",
    role: "캐릭터/오브젝트 참조 이미지를 고정하는 노드.",
    tokens: ["--component-node-bg", "--port-character-reference", "--port-object-reference"],
    usage: "반복 생성에서 대상 일관성이 필요할 때 사용합니다.",
  },
  {
    name: "Canvas Node",
    className: "CanvasNode",
    role: "선택한 결과 이미지를 에디터 캔버스 안에서 미리보고 저장하는 노드.",
    tokens: ["--component-node-bg", "--bg-node-header", "--ui-radius-xl"],
    usage: "이미지 결과 상세 편집 흐름에서 사용합니다.",
  },
  {
    name: "Output Node",
    className: "OutputNode",
    role: "연결된 노드 값을 모아 생성 실행, 복사, 다운로드를 담당하는 출력 노드.",
    tokens: ["--component-node-bg", "--port-prompt", "--component-action-primary-bg"],
    usage: "생성 파이프라인의 마지막 노드로 사용합니다.",
  },
  {
    name: "Output Settings Node",
    className: "OutputSettingsNode",
    role: "비율과 해상도 같은 출력 조건을 한 노드에서 제어.",
    tokens: ["--component-node-bg", "--port-resolution", "--component-chip-radius"],
    usage: "기본 보드에 항상 포함합니다.",
  },
  {
    name: "Element Board Node",
    className: "ElementBoardNode",
    role: "이미지에서 추출한 캐릭터, 오브젝트, 스타일, 구도 규칙을 구조화.",
    tokens: ["--component-node-bg", "--port-element-board", "--size-element-board-max-height"],
    usage: "일관성 분석 결과가 있는 이미지에서 활성화합니다.",
  },
  {
    name: "Element Item Node",
    className: "ElementItemNode",
    role: "앨리먼트 보드의 개별 요소를 시트 생성과 연결 상태로 관리.",
    tokens: ["--component-node-bg", "--port-element-board", "--component-chip-radius"],
    usage: "개별 캐릭터/오브젝트/스타일 요소를 독립적으로 다룰 때 사용합니다.",
  },
  {
    name: "Optional Text Node",
    className: "CompositionNode BackgroundNode ConstraintNode MoodNode PaletteNode PropsNode",
    role: "구도, 배경, 제한, 무드, 팔레트, 소품처럼 텍스트 옵션을 고르는 설정 노드 그룹.",
    tokens: ["--component-node-bg", "--port-composition", "--port-background", "--port-constraint"],
    usage: "필요한 설정만 추가 메뉴에서 선택해 사용합니다.",
  },
  {
    name: "Optional Control Node",
    className: "CameraAngleNode ObjectAngleNode LightingNode GestureNode DetailNode",
    role: "카메라, 오브젝트 방향, 조명, 제스처, 출력 밀도처럼 조작형 설정을 담당하는 노드 그룹.",
    tokens: ["--component-node-bg", "--port-camera-angle", "--port-lighting", "--port-detail"],
    usage: "시각 방향성이 중요한 생성 보드에서 추가합니다.",
  },
  {
    name: "Port Chip",
    className: "node port controls",
    role: "노드 간 연결 가능 지점과 연결 해제 상태를 표시하는 작은 칩.",
    tokens: ["--size-port-dot", "--component-chip-radius", "--component-chip-type", "--port-*"],
    usage: "포트 색은 노드 의미와 같아야 합니다.",
  },
  {
    name: "Node Remove Button",
    className: ".nodrag remove button",
    role: "선택적으로 추가된 노드를 캔버스에서 제거하는 작은 헤더 버튼.",
    tokens: ["--size-control-sm", "--ui-radius-pill", "--text-muted"],
    usage: "필수 노드에는 노출하지 않습니다.",
  },
  {
    name: "Style Add Modal",
    className: "StyleAddModal",
    role: "스타일 참조 이미지를 추가하고 분석하는 집중형 모달.",
    tokens: ["--size-modal-style-width", "--size-modal-preview-height", "--component-panel-radius", "--component-panel-shadow"],
    usage: "이미지 미리보기, 분석 결과, 취소/적용 액션을 한 흐름으로 묶습니다.",
  },
];

const componentDisplayNames: Record<string, string> = {
  "Brand Lockup": "Brand / Lockup",
  "Brand Breadcrumb": "Navigation / Breadcrumb",
  "Studio Topbar": "Navigation / Top Bar",
  "Primary Command": "Button / Primary",
  "Secondary Command": "Button / Secondary",
  "Icon Toggle": "Button / Icon Toggle",
  "Round Tool": "Button / Icon Round",
  Kicker: "Text / Eyebrow",
  "System Pulse": "Badge / Live Status",
  "Tool Pill": "Badge / Metadata",
  "Metrics Panel": "Panel / Metrics",
  "Gallery Card": "Card / Media",
  "Gallery Masonry": "Grid / Masonry",
  "Gallery Card Overlay": "Card / Media Overlay",
  "Gallery Delete Button": "Button / Icon Destructive",
  "Asset Status": "Badge / Status",
  "Asset Data Strip": "Metadata / Strip",
  "Open Cue": "Cue / Open",
  "Empty State": "State / Empty",
  "Metric Card": "Card / Metric",
  "Metric Bar": "Progress / Metric Bar",
  "Library Heading": "Section Header / Library",
  "Editor Topbar": "Toolbar / Editor Title",
  "Editor Title Input": "Input / Title",
  "Editor Mode Toggle": "Toolbar / Mode Controls",
  "Node Add Dock": "Dock / Node Add",
  "Node Add Trigger": "Button / Node Add",
  "Node Add Popover": "Popover / Node Add",
  "Node Add Option": "Menu Item / Node Option",
  "Node Added Chip": "Badge / Added Node",
  "Flow Node": "Node / Base",
  "Prompt Node": "Node / Prompt",
  "Style Node": "Node / Style",
  "Reference Node": "Node / Reference",
  "Canvas Node": "Node / Canvas",
  "Output Node": "Node / Output",
  "Output Settings Node": "Node / Output Settings",
  "Element Board Node": "Node / Element Board",
  "Element Item Node": "Node / Element Item",
  "Optional Text Node": "Node / Optional Text",
  "Optional Control Node": "Node / Optional Control",
  "Port Chip": "Port / Chip",
  "Node Remove Button": "Button / Node Remove",
  "Style Add Modal": "Modal / Add Reference",
};

function getComponentDisplayName(name: string) {
  return componentDisplayNames[name] ?? name;
}

function getComponentSpec(name: string) {
  return componentSpecs.find((component) => component.name === name);
}

const componentGroups: ComponentGroupSpec[] = [
  {
    id: "component-button",
    title: "Button",
    summary: "명령, 보조 이동, 아이콘 전용 조작, 위험 액션을 담당하는 액션 컴포넌트 패밀리.",
    variants: ["Primary Command", "Secondary Command", "Icon Toggle", "Round Tool", "Gallery Delete Button", "Node Add Trigger", "Node Remove Button"],
    states: ["Default", "Hover", "Active", "Disabled"],
  },
  {
    id: "component-badge",
    title: "Badge",
    summary: "상태, 메타데이터, 추가됨 여부를 짧은 라벨로 표시하는 컴포넌트 패밀리.",
    variants: ["System Pulse", "Tool Pill", "Asset Status", "Node Added Chip"],
    states: ["Ready", "Pending", "Failed", "Static"],
  },
  {
    id: "component-navigation",
    title: "Navigation",
    summary: "브랜드, 브레드크럼, 상단 액션을 묶어 화면 위치와 이동을 제공하는 패밀리.",
    variants: ["Brand Lockup", "Brand Breadcrumb", "Studio Topbar"],
    states: ["Default", "Responsive", "Current"],
  },
  {
    id: "component-text",
    title: "Text",
    summary: "섹션의 상위 맥락과 짧은 보조 신호를 표시하는 텍스트 컴포넌트.",
    variants: ["Kicker", "Open Cue"],
    states: ["Default"],
  },
  {
    id: "component-input",
    title: "Input",
    summary: "사용자가 직접 편집하는 단일 입력 컴포넌트.",
    variants: ["Editor Title Input"],
    states: ["Default", "Hover", "Focus", "Placeholder"],
  },
  {
    id: "component-progress",
    title: "Progress",
    summary: "비율과 완료 수준을 시각적으로 표현하는 진행 컴포넌트.",
    variants: ["Metric Bar"],
    states: ["0%", "Partial", "Complete"],
  },
  {
    id: "component-menu",
    title: "Menu",
    summary: "노드 추가처럼 선택 가능한 항목을 좁은 공간에 표시하는 메뉴 패밀리.",
    variants: ["Node Add Option", "Node Add Popover", "Node Add Dock"],
    states: ["Closed", "Open", "Empty", "Added"],
  },
  {
    id: "component-card",
    title: "Card",
    summary: "반복되는 정보 단위를 담는 카드 패밀리. 카드 안에는 배지, 버튼, 메타데이터가 조합됩니다.",
    variants: ["Metric Card", "Gallery Card", "Gallery Card Overlay"],
    states: ["Default", "Hover", "Selected"],
  },
  {
    id: "component-gallery",
    title: "Gallery",
    summary: "생성 결과 목록을 구성하는 메타데이터와 레이아웃 패밀리.",
    variants: ["Gallery Masonry", "Asset Data Strip", "Library Heading", "Empty State"],
    states: ["Empty", "Populated", "Loading"],
  },
  {
    id: "component-toolbar",
    title: "Toolbar",
    summary: "에디터의 반복 조작 컨트롤을 고정 위치에 묶는 패밀리.",
    variants: ["Editor Topbar", "Editor Mode Toggle"],
    states: ["Default", "Compact"],
  },
  {
    id: "component-node",
    title: "Node",
    summary: "생성 파이프라인을 구성하는 에디터 노드 패밀리.",
    variants: ["Flow Node", "Prompt Node", "Style Node", "Reference Node", "Canvas Node", "Output Node", "Output Settings Node", "Element Board Node", "Element Item Node", "Optional Text Node", "Optional Control Node"],
    states: ["Default", "Connected", "Removable", "Generating"],
  },
  {
    id: "component-port",
    title: "Port",
    summary: "노드 간 연결 지점과 연결 상태를 표현하는 포트 컴포넌트.",
    variants: ["Port Chip"],
    states: ["Available", "Connected", "Hover"],
  },
  {
    id: "component-modal",
    title: "Modal",
    summary: "스타일/참조 추가처럼 집중형 작업을 처리하는 오버레이 패밀리.",
    variants: ["Style Add Modal"],
    states: ["Open", "Analyzing", "Ready"],
  },
];

const codeStyle: CSSProperties = {
  display: "inline-block",
  color: "var(--text-tertiary)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: "var(--ui-type-xs-2-size)",
  lineHeight: 1.4,
};

export default function ComponentsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-[min(1120px,calc(100vw-48px))] py-4 pb-20">
        <header className="mb-20 flex h-9 items-center justify-between gap-5 text-sm" aria-label="xGen 디자인 시스템 컴포넌트">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground no-underline">
            <span className="grid size-6 place-items-center rounded-md bg-foreground text-background text-xs">×</span>
            xGen
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex" aria-label="디자인 시스템 내비게이션">
            <Link className="transition-colors hover:text-foreground" href="/design-system">Docs</Link>
            <a className="font-medium text-foreground" href="#components">Components</a>
            <a className="transition-colors hover:text-foreground" href="#blocks">Blocks</a>
            <Link className="transition-colors hover:text-foreground" href="/design-system/templates">Templates</Link>
          </nav>
          <Button asChild size="sm">
            <Link href="/">New board</Link>
          </Button>
        </header>

        <section id="components" className="grid gap-12">
          <section className="mx-auto grid max-w-4xl justify-items-center gap-5 text-center">
            <Badge variant="secondary" className="rounded-md px-3 py-1">shadcn/ui primitives</Badge>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
              The foundation for xGen design system
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              컴포넌트는 복잡한 시각 장식을 줄이고, 조합 가능한 shadcn/ui primitive와 block 패턴 위에서 확장합니다.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <a href="#blocks">View blocks</a>
              </Button>
              <Button asChild variant="outline">
                <a href="#catalog">Component catalog</a>
              </Button>
            </div>
          </section>

          <section id="blocks" className="mx-auto grid w-full max-w-[980px] gap-5 pt-4">
            <div className="grid gap-2 text-center">
              <h2 className="text-2xl font-semibold tracking-normal">Composable blocks</h2>
              <p className="text-muted-foreground">shadcn/ui의 Card, Button, Badge, ToggleGroup을 실제 화면 블록으로 조합합니다.</p>
            </div>
            <ShadcnShowcase />
          </section>

          <section id="catalog" className="mx-auto grid w-full max-w-[980px] gap-5 pt-8">
            <div className="grid gap-2">
              <Badge variant="outline" className="w-fit rounded-full">xGen catalog</Badge>
              <h2 className="text-2xl font-semibold tracking-normal">Component catalog</h2>
              <p className="max-w-2xl text-muted-foreground leading-7">
                기존 xGen 컴포넌트 목록은 아래에서 참조용으로 유지합니다. 첫 화면은 shadcn-style block을 우선합니다.
              </p>
            </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {componentGroups.map((group) => (
              <Card key={group.id} className="group overflow-hidden p-5 shadow-none transition-colors hover:bg-muted/20">
                <Link href={`#${group.id}`} className="grid h-full gap-4 text-inherit no-underline">
                  <CardHeader className="gap-2 px-0">
                    <Badge variant="secondary" className="w-fit rounded-md">{group.variants.length} variants</Badge>
                    <CardTitle className="text-lg">{group.title}</CardTitle>
                    <CardDescription className="line-clamp-2 leading-6">{group.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <GroupPreview group={group} />
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 px-0">
                  {group.variants.slice(0, 5).map((variant) => (
                    <Badge key={variant} variant="outline" className="rounded-md">{getComponentDisplayName(variant)}</Badge>
                  ))}
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
          </section>
          {componentGroups.map((group) => (
            <ComponentGroupDetail key={group.id} group={group} />
          ))}
        </section>
      </div>
    </main>
  );
}

function ShadcnShowcase() {
  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[1fr_1fr_0.86fr]">
      <Card className="p-6 shadow-none">
        <CardHeader className="px-0 pt-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Button</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 px-0">
          <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">Name</div>
          <div className="rounded-lg bg-muted px-3 py-4 text-sm text-muted-foreground">Prompt message</div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Generate</Button>
            <Button size="sm" variant="secondary">Preview</Button>
            <Button size="sm" variant="outline">Export</Button>
          </div>
        </CardContent>
        <CardFooter className="px-0 pb-0">
          <ToggleGroup type="single" defaultValue="ratio" size="sm" className="w-full justify-between">
            <ToggleGroupItem value="ratio" className="flex-1">Ratio</ToggleGroupItem>
            <ToggleGroupItem value="style" className="flex-1">Style</ToggleGroupItem>
            <ToggleGroupItem value="quality" className="flex-1">Quality</ToggleGroupItem>
          </ToggleGroup>
        </CardFooter>
      </Card>

      <Card className="p-6 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Render activity</CardTitle>
          <CardDescription>Last 6 local generations</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="flex h-36 items-end gap-3">
            {[42, 68, 56, 78, 48, 74].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-md bg-foreground/55" style={{ height }} />
                <span className="text-xs text-muted-foreground">{["M", "T", "W", "T", "F", "S"][index]}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="px-0 pb-0">
          <Button className="w-full" size="sm">View report</Button>
        </CardFooter>
      </Card>

      <Card className="p-6 shadow-none md:col-span-2 lg:col-span-1">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Output preset</CardTitle>
          <CardDescription>Reusable settings block</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 px-0 pb-0">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="text-3xl font-semibold">1:1 / HD</div>
            <div className="mt-1 text-sm text-muted-foreground">square render preset</div>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Ratio</span><strong>1:1</strong></div>
            <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Quality</span><strong>HD</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="secondary" className="rounded-md">Ready</Badge></div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6 shadow-none lg:col-span-2">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Component blocks</CardTitle>
          <CardDescription>Small primitives combine into production-facing controls.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 px-0 pb-0 sm:grid-cols-2">
          {["Prompt builder", "Style reference", "Output settings", "Gallery action"].map((item) => (
            <div key={item} className="rounded-lg border bg-card p-4">
              <div className="mb-8 h-2 w-16 rounded-full bg-muted" />
              <div className="font-medium">{item}</div>
              <div className="mt-1 text-sm text-muted-foreground">Card, Badge, Button</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="p-6 shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Handoff ready</CardTitle>
          <CardDescription>Local design-system state</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 px-0 pb-0">
          <div className="rounded-md bg-muted p-3 text-sm">Button, Badge, Card, ToggleGroup</div>
          <div className="rounded-md bg-muted p-3 text-sm">Theme tokens mapped to shadcn</div>
          <div className="rounded-md bg-muted p-3 text-sm">Legacy catalog kept below</div>
        </CardContent>
      </Card>
    </div>
  );
}

function ComponentPreview({ name }: { name: string }) {
  return (
    <div style={previewStyle}>
      {name === "Brand Lockup" ? <BrandLockupPreview /> : null}
      {name === "Brand Breadcrumb" ? <BrandBreadcrumbPreview /> : null}
      {name === "Studio Topbar" ? <StudioTopbarPreview /> : null}
      {name === "Primary Command" ? (
        <button className="primary-command" type="button">
          <Wand2 size={17} />
          새 보드 만들기
        </button>
      ) : null}
      {name === "Secondary Command" ? (
        <Link className="secondary-command" href="/design-system">
          <Palette size={16} />
          디자인 시스템
        </Link>
      ) : null}
      {name === "Icon Toggle" ? <button className="icon-toggle" type="button" aria-label="테마 변경">☾</button> : null}
      {name === "Round Tool" ? <button className="round-tool back-tool" type="button" aria-label="뒤로가기">←</button> : null}
      {name === "Kicker" ? <div className="kicker">Visual Identity Lab</div> : null}
      {name === "System Pulse" ? <div className="system-pulse"><span />로컬 처리 준비됨</div> : null}
      {name === "Tool Pill" ? (
        <span className="tool-pill">
          <LayoutGrid size={14} />
          12 assets
        </span>
      ) : null}
      {name === "Metrics Panel" ? <MetricsPanelPreview /> : null}
      {name === "Gallery Card" ? <GalleryCardPreview /> : null}
      {name === "Gallery Masonry" ? <GalleryMasonryPreview /> : null}
      {name === "Gallery Card Overlay" ? <GalleryOverlayPreview /> : null}
      {name === "Gallery Delete Button" ? <button className="gallery-card-delete" type="button" aria-label="삭제" style={{ position: "relative", top: "auto", right: "auto" }}>×</button> : null}
      {name === "Asset Status" ? <AssetStatusPreview /> : null}
      {name === "Asset Data Strip" ? <AssetDataStripPreview /> : null}
      {name === "Open Cue" ? <div className="open-cue">◎ 열기</div> : null}
      {name === "Empty State" ? <EmptyStatePreview /> : null}
      {name === "Metric Card" ? <MetricCardPreview /> : null}
      {name === "Metric Bar" ? <MetricBarPreview /> : null}
      {name === "Library Heading" ? <LibraryHeadingPreview /> : null}
      {name === "Editor Topbar" ? <EditorTopbarPreview /> : null}
      {name === "Editor Title Input" ? <input className="editor-title-input" value="새 브랜드 이미지" readOnly aria-label="이미지 캔버스 제목" style={{ background: "var(--bg-node-base)" }} /> : null}
      {name === "Editor Mode Toggle" ? <EditorModeTogglePreview /> : null}
      {name === "Node Add Dock" ? <NodeAddDockPreview /> : null}
      {name === "Node Add Trigger" ? <button type="button" className="node-add-trigger"><span>＋</span><span>설정 노드</span><strong>4</strong></button> : null}
      {name === "Node Add Popover" ? <NodeAddPreview /> : null}
      {name === "Node Add Option" ? <button type="button" className="node-add-option" style={{ "--node-accent": "var(--port-background)" } as CSSProperties}><span>배경</span><span>＋</span></button> : null}
      {name === "Node Added Chip" ? <span className="node-added-chip">구도</span> : null}
      {name === "Flow Node" ? <FlowNodePreview /> : null}
      {name === "Prompt Node" ? <TypedNodePreview title="Prompt" label="프롬프트" color="var(--port-prompt)" body="장면 설명 입력" /> : null}
      {name === "Style Node" ? <TypedNodePreview title="Style" label="스타일" color="var(--port-style)" body="참조 이미지 분석" media /> : null}
      {name === "Reference Node" ? <TypedNodePreview title="Reference" label="캐릭터 참조" color="var(--port-character-reference)" body="일관성 참조" media /> : null}
      {name === "Canvas Node" ? <CanvasNodePreview /> : null}
      {name === "Output Node" ? <OutputNodePreview /> : null}
      {name === "Output Settings Node" ? <SettingsNodePreview /> : null}
      {name === "Element Board Node" ? <ElementBoardPreview /> : null}
      {name === "Element Item Node" ? <ElementItemPreview /> : null}
      {name === "Optional Text Node" ? <TypedNodePreview title="Composition" label="구도" color="var(--port-composition)" body="전신, 반신, 클로즈업" /> : null}
      {name === "Optional Control Node" ? <TypedNodePreview title="Lighting" label="조명" color="var(--port-lighting)" body="부드러운 측면광" /> : null}
      {name === "Port Chip" ? <PortChipPreview /> : null}
      {name === "Node Remove Button" ? <button type="button" aria-label="노드 제거" style={removeButtonStyle}>×</button> : null}
      {name === "Style Add Modal" ? <StyleModalPreview /> : null}
    </div>
  );
}

function GroupPreview({ group }: { group: ComponentGroupSpec }) {
  const representativeVariant = group.variants[0];
  return (
    <div className="component-group-preview">
      <ComponentPreview name={representativeVariant} />
    </div>
  );
}

function ComponentGroupDetail({ group }: { group: ComponentGroupSpec }) {
  return (
    <section id={group.id} className="component-detail-overlay" aria-label={`${group.title} 상세`}>
      <a className="component-detail-backdrop" href="#components" aria-label="상세 닫기" />
      <Card className="component-detail-panel overflow-hidden">
        <CardHeader className="component-detail-header">
          <div>
            <CardTitle className="text-2xl">{group.title}</CardTitle>
            <CardDescription className="mt-2 leading-6">{group.summary}</CardDescription>
          </div>
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <a href="#components" aria-label="상세 닫기">
              <X size={16} />
            </a>
          </Button>
        </CardHeader>

        <div className="component-state-row" aria-label={`${group.title} 상태`}>
          {group.states.map((state) => (
            <Badge key={state} variant="secondary" className="rounded-full">{state}</Badge>
          ))}
        </div>

        <div className="component-detail-grid">
          {group.variants.map((variant) => {
            const component = getComponentSpec(variant);
            if (!component) return null;
            return (
              <Card key={variant} className="component-variant-card gap-4">
                <CardHeader className="gap-2">
                  <code style={codeStyle}>{component.className}</code>
                  <CardTitle className="text-lg">{getComponentDisplayName(component.name)}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <ComponentPreview name={component.name} />
                  <CardDescription className="leading-6">{component.role}</CardDescription>
                  <strong className="text-sm font-medium">{component.usage}</strong>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  {component.tokens.map((token) => (
                    <Badge key={token} variant="outline" className="rounded-full font-mono">{token}</Badge>
                  ))}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Card>
    </section>
  );
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 44 44" focusable="false">
        <rect x="5" y="5" width="34" height="34" rx="7.5" fill="currentColor" />
        <path d="M16.2 16.2 27.8 27.8M27.8 16.2 16.2 27.8" />
      </svg>
    </div>
  );
}

function BrandLockupPreview() {
  return (
    <div className="brand-lockup">
      <BrandMark />
      <div className="brand-name">xGen</div>
    </div>
  );
}

function BrandBreadcrumbPreview() {
  return (
    <div className="brand-lockup">
      <BrandMark />
      <div className="brand-breadcrumb">
        <Link className="brand-name" href="/">xGen</Link>
        <span className="breadcrumb-separator">/</span>
        <Link className="breadcrumb-link" href="/design-system">디자인 시스템</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">컴포넌트</span>
      </div>
    </div>
  );
}

function StudioTopbarPreview() {
  return (
    <div className="studio-topbar" style={{ width: "100%" }}>
      <BrandLockupPreview />
      <div className="studio-actions">
        <Link className="secondary-command" href="/design-system"><Palette size={16} />디자인 시스템</Link>
        <button className="icon-toggle" type="button" aria-label="테마">☾</button>
      </div>
    </div>
  );
}

function MetricsPanelPreview() {
  return (
    <div className="metrics-panel" style={{ width: "min(100%, 360px)" }}>
      <MetricCardPreview />
      <div className="metric-card">
        <span className="metric-label">일관성 분석</span>
        <strong>78%</strong>
        <div className="metric-bar"><span style={{ width: "78%" }} /></div>
      </div>
    </div>
  );
}

function GalleryCardPreview() {
  return (
    <div className="gallery-card studio-card" style={{ width: "min(100%, 240px)", margin: 0, cursor: "default" }}>
      <div className="gallery-card-media" style={{ aspectRatio: "4 / 3", background: "linear-gradient(135deg, var(--brand-warm), var(--brand-ember-soft) 52%, var(--brand-mint))" }}>
        <div className="asset-status"><span />locked</div>
      </div>
      <div className="asset-data-strip">
        <span>1:1</span>
        <span>4K</span>
        <span>3 elements</span>
      </div>
    </div>
  );
}

function GalleryMasonryPreview() {
  return (
    <div className="gallery-masonry redesigned" style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--ui-space-10)" }}>
      {[0, 1, 2].map((item) => (
        <div key={item} className="gallery-card studio-card" style={{ minHeight: item === 1 ? 130 : 96, margin: 0 }} />
      ))}
    </div>
  );
}

function GalleryOverlayPreview() {
  return (
    <div className="gallery-card studio-card" style={{ width: "min(100%, 260px)", margin: 0 }}>
      <div className="gallery-card-media" style={{ minHeight: 150, background: "linear-gradient(135deg, var(--brand-warm), var(--brand-mint))" }}>
        <div className="gallery-card-overlay" style={{ opacity: 1 }}>
          <div className="gallery-card-copy">
            <div className="gallery-card-title">신제품 캠페인</div>
            <div className="gallery-card-style">밝은 스튜디오 조명과 선명한 제품 중심 구도</div>
          </div>
          <div className="gallery-card-footer">
            <div className="gallery-card-date">2026. 5. 25.</div>
            <div className="open-cue">◎ 열기</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssetStatusPreview() {
  return (
    <div style={{ display: "flex", gap: "var(--ui-space-8)", flexWrap: "wrap" }}>
      <div className="asset-status" style={{ position: "relative", top: "auto", left: "auto" }}><span />locked</div>
      <div className="asset-status pending" style={{ position: "relative", top: "auto", left: "auto" }}><span />analyzing</div>
      <div className="asset-status failed" style={{ position: "relative", top: "auto", left: "auto" }}><span />retry</div>
    </div>
  );
}

function AssetDataStripPreview() {
  return (
    <div className="asset-data-strip">
      <span>1:1</span>
      <span>4K</span>
      <span>6 elements</span>
    </div>
  );
}

function EmptyStatePreview() {
  return (
    <div className="empty-studio" style={{ minHeight: 260, width: "100%", padding: "var(--ui-space-24)" }}>
      <div>
        <div className="empty-signal" aria-hidden="true" style={{ width: 220, height: 72 }}>
          <span />
          <span />
          <span />
        </div>
        <h3 style={{ fontSize: 26 }}>첫 번째 기준 이미지를 만드세요</h3>
        <button type="button" className="primary-command"><Wand2 size={17} />이미지 생성</button>
      </div>
    </div>
  );
}

function MetricCardPreview() {
  return (
    <div className="metric-card" style={{ width: "min(100%, 220px)", minHeight: 118 }}>
      <span className="metric-label">결과</span>
      <strong style={{ fontSize: 44 }}>12</strong>
      <small>stored renders</small>
    </div>
  );
}

function MetricBarPreview() {
  return (
    <div className="metric-card" style={{ width: "min(100%, 240px)", minHeight: 92 }}>
      <span className="metric-label">스타일 참조</span>
      <div className="metric-bar warm"><span style={{ width: "64%" }} /></div>
    </div>
  );
}

function LibraryHeadingPreview() {
  return (
    <div className="library-heading" style={{ width: "100%", marginBottom: 0 }}>
      <div><h2>라이브러리</h2></div>
      <div className="library-tools">
        <span className="tool-pill">12 assets</span>
        <span className="tool-pill">8 locks</span>
      </div>
    </div>
  );
}

function EditorTopbarPreview() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: 64 }}>
      <div className="editor-topbar" style={{ position: "relative", top: "auto", left: "auto", maxWidth: "100%" }}>
        <button className="round-tool back-tool" type="button" aria-label="뒤로가기">←</button>
        <input className="editor-title-input" value="새 브랜드 이미지" readOnly aria-label="이미지 캔버스 제목" />
      </div>
    </div>
  );
}

function EditorModeTogglePreview() {
  return (
    <div className="editor-mode-toggle" style={{ position: "relative", top: "auto", right: "auto" }}>
      <button type="button" className="icon-toggle compact" aria-label="확대">＋</button>
      <button type="button" className="icon-toggle compact" aria-label="축소">－</button>
      <button type="button" className="icon-toggle compact" aria-label="테마">☾</button>
    </div>
  );
}

function NodeAddDockPreview() {
  return (
    <div className="node-add-dock" style={{ position: "relative", top: "auto", left: "auto" }}>
      <button type="button" className="node-add-trigger"><span>＋</span><span>설정 노드</span><strong>4</strong></button>
    </div>
  );
}

function NodeAddPreview() {
  return (
    <div style={{ position: "relative", minHeight: 228 }}>
      <button type="button" className="node-add-trigger" aria-expanded="true">
        <span>＋</span>
        <span>설정 노드</span>
        <strong>4</strong>
      </button>
      <div className="node-add-popover" style={{ position: "relative", top: "var(--ui-space-10)", left: 0, width: "min(100%, 238px)" }}>
        <div className="node-add-popover-header"><span>추가 가능</span><small>4</small></div>
        <div className="node-add-list">
          <button type="button" className="node-add-option" style={{ "--node-accent": "var(--port-composition)" } as CSSProperties}><span>구도</span><span>＋</span></button>
          <button type="button" className="node-add-option" style={{ "--node-accent": "var(--port-background)" } as CSSProperties}><span>배경</span><span>＋</span></button>
        </div>
      </div>
    </div>
  );
}

function TypedNodePreview({ title, label, color, body, media = false }: { title: string; label: string; color: string; body: string; media?: boolean }) {
  return (
    <div style={{ width: "min(100%, var(--size-node-md))", borderRadius: "var(--component-node-radius)", overflow: "hidden", background: "var(--component-node-bg)", boxShadow: "var(--component-node-shadow)" }}>
      <div style={{ padding: "var(--ui-space-8) var(--ui-space-12)", background: "var(--component-node-header-bg)", display: "flex", alignItems: "center", gap: "var(--ui-space-8)" }}>
        <span style={{ width: 14, height: 14, borderRadius: "50%", background: color }} />
        <strong style={{ font: "var(--component-node-title-type)", color: "var(--text-secondary)", textTransform: "uppercase" }}>{title}</strong>
        <button type="button" aria-label="노드 제거" style={{ ...removeButtonStyle, marginLeft: "auto" }}>×</button>
      </div>
      <div style={{ padding: "var(--ui-space-12)", display: "grid", gap: "var(--ui-space-10)" }}>
        {media ? <div style={{ height: 72, borderRadius: "var(--ui-radius-xl)", background: "linear-gradient(135deg, var(--brand-warm), var(--brand-mint))" }} /> : null}
        <div style={{ padding: "var(--ui-space-10)", borderRadius: "var(--ui-radius-xl)", border: "1px solid var(--border-node)", background: "var(--bg-canvas)", color: "var(--text-secondary)", font: "var(--ui-type-xs-2)", fontWeight: 800 }}>{body}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--ui-space-8)", width: "fit-content", padding: "var(--ui-space-4) var(--ui-space-10)", borderRadius: "var(--component-chip-radius)", border: `1px solid ${color}`, color }}>
          <span style={{ font: "var(--component-chip-type)", fontWeight: 800 }}>{label}</span>
          <span style={{ width: "var(--size-port-dot)", height: "var(--size-port-dot)", borderRadius: "50%", background: color }} />
        </div>
      </div>
    </div>
  );
}

function FlowNodePreview() {
  return (
    <div style={{ width: "min(100%, var(--size-node-md))", borderRadius: "var(--component-node-radius)", overflow: "hidden", background: "var(--component-node-bg)", boxShadow: "var(--component-node-shadow)" }}>
      <div style={{ padding: "var(--ui-space-8) var(--ui-space-12)", background: "var(--component-node-header-bg)", display: "flex", alignItems: "center", gap: "var(--ui-space-8)" }}>
        <span style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--port-prompt)" }} />
        <strong style={{ font: "var(--component-node-title-type)", color: "var(--text-secondary)", textTransform: "uppercase" }}>Prompt</strong>
      </div>
      <div style={{ padding: "var(--ui-space-12)", display: "grid", gap: "var(--ui-space-10)" }}>
        <div style={{ minHeight: 54, borderRadius: "var(--ui-radius-xl)", border: "1px solid var(--border-node)", background: "var(--bg-canvas)" }} />
        <PortChipPreview />
      </div>
    </div>
  );
}

function CanvasNodePreview() {
  return (
    <TypedNodePreview title="Canvas" label="이미지" color="var(--port-element-board)" body="선택한 결과 이미지" media />
  );
}

function OutputNodePreview() {
  return (
    <div style={{ width: "min(100%, var(--size-node-lg))", borderRadius: "var(--component-node-radius)", overflow: "hidden", background: "var(--component-node-bg)", boxShadow: "var(--component-node-shadow)" }}>
      <div style={{ padding: "var(--ui-space-8) var(--ui-space-12)", background: "var(--component-node-header-bg)" }}>
        <strong style={{ font: "var(--component-node-title-type)", color: "var(--text-secondary)", textTransform: "uppercase" }}>Output</strong>
      </div>
      <div style={{ padding: "var(--ui-space-12)", display: "grid", gap: "var(--ui-space-10)" }}>
        <button type="button" className="primary-command">생성</button>
        <div style={{ display: "flex", gap: "var(--ui-space-8)" }}>
          <button type="button" className="secondary-command">복사</button>
          <button type="button" className="secondary-command">저장</button>
        </div>
      </div>
    </div>
  );
}

function SettingsNodePreview() {
  return (
    <TypedNodePreview title="Output Settings" label="1:1 / 4K" color="var(--port-resolution)" body="비율과 해상도" />
  );
}

function ElementBoardPreview() {
  return (
    <div style={{ width: "min(100%, var(--size-node-lg))", borderRadius: "var(--component-node-radius)", overflow: "hidden", background: "var(--component-node-bg)", boxShadow: "var(--component-node-shadow)" }}>
      <div style={{ padding: "var(--ui-space-8) var(--ui-space-12)", background: "var(--component-node-header-bg)", display: "flex", alignItems: "center", gap: "var(--ui-space-8)" }}>
        <span style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--port-element-board)" }} />
        <strong style={{ font: "var(--component-node-title-type)", color: "var(--text-secondary)", textTransform: "uppercase" }}>Element Board</strong>
      </div>
      <div style={{ padding: "var(--ui-space-12)", display: "grid", gap: "var(--ui-space-8)" }}>
        {["캐릭터", "오브젝트", "스타일"].map((item) => (
          <span key={item} className="tool-pill" style={{ justifyContent: "flex-start" }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function ElementItemPreview() {
  return (
    <TypedNodePreview title="Element Item" label="시트 생성" color="var(--port-element-board)" body="개별 요소 설명" media />
  );
}

function PortChipPreview() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "calc(var(--ui-space-unit) * 1.5)", padding: "var(--ui-space-4) calc(var(--ui-space-unit) * 1.5) var(--ui-space-4) var(--ui-space-10)", borderRadius: "var(--component-chip-radius)", border: "1px solid var(--port-prompt)", background: "color-mix(in srgb, var(--port-prompt) 15%, transparent)", color: "var(--port-prompt)", width: "fit-content" }}>
      <span style={{ font: "var(--component-chip-type)", fontWeight: 800, textTransform: "uppercase" }}>프롬프트</span>
      <span style={{ width: "var(--size-port-dot)", height: "var(--size-port-dot)", borderRadius: "50%", background: "var(--port-prompt)", border: "2px solid var(--bg-node-base)" }} />
    </div>
  );
}

function StyleModalPreview() {
  return (
    <div style={{ width: "min(100%, 320px)", borderRadius: "var(--component-panel-radius)", border: "1px solid var(--border-node)", background: "var(--bg-node-base)", boxShadow: "var(--component-panel-shadow)", overflow: "hidden" }}>
      <div style={{ padding: "var(--ui-space-12) var(--ui-space-16)", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-node)" }}>
        <strong style={{ font: "var(--ui-type-sm-8)" }}>스타일 추가</strong>
        <span style={{ color: "var(--text-muted)" }}>×</span>
      </div>
      <div style={{ padding: "var(--ui-space-16)", display: "grid", gap: "var(--ui-space-12)" }}>
        <div style={{ height: 110, borderRadius: "var(--ui-radius-xl)", background: "linear-gradient(135deg, var(--brand-warm), var(--brand-mint))" }} />
        <span className="tool-pill" style={{ width: "fit-content" }}>분석 완료</span>
      </div>
    </div>
  );
}

const previewStyle: CSSProperties = {
  minHeight: 150,
  display: "grid",
  placeItems: "center",
  margin: "var(--ui-space-16) 0",
  padding: "var(--ui-space-20)",
  borderRadius: "var(--ui-radius-2xl)",
  border: "1px solid color-mix(in srgb, var(--border-node) 76%, transparent)",
  background: "var(--bg-canvas)",
  overflow: "hidden",
};

const removeButtonStyle: CSSProperties = {
  width: "var(--size-control-sm)",
  height: "var(--size-control-sm)",
  borderRadius: "var(--ui-radius-pill)",
  border: "none",
  background: "transparent",
  color: "var(--text-muted)",
  font: "var(--ui-type-sm-8)",
};
