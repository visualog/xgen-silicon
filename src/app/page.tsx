"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect, useMemo, useRef, type CSSProperties } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnNodeDrag,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Eye,
  ExternalLink,
  FolderOpen,
  Info,
  Moon,
  Palette as PaletteIcon,
  Plus,
  Settings,
  Sparkles,
  Sun,
  Trash2,
} from "lucide-react";

import { PromptNode } from "@/components/nodes/PromptNode";
import { StyleNode } from "@/components/nodes/StyleNode";
import { ReferenceNode } from "@/components/nodes/ReferenceNode";
import { ElementItemNode } from "@/components/nodes/ElementItemNode";
import { OutputSettingsNode } from "@/components/nodes/OutputSettingsNode";
import { CompositionNode } from "@/components/nodes/CompositionNode";
import { BackgroundNode } from "@/components/nodes/BackgroundNode";
import { ConstraintNode } from "@/components/nodes/ConstraintNode";
import { MoodNode } from "@/components/nodes/MoodNode";
import { PaletteNode } from "@/components/nodes/PaletteNode";
import { CameraAngleNode } from "@/components/nodes/CameraAngleNode";
import { ObjectAngleNode } from "@/components/nodes/ObjectAngleNode";
import { LightingNode } from "@/components/nodes/LightingNode";
import { GestureNode } from "@/components/nodes/GestureNode";
import { PropsNode } from "@/components/nodes/PropsNode";
import { DetailNode } from "@/components/nodes/DetailNode";
import { OutputNode } from "@/components/nodes/OutputNode";
import { CanvasNode } from "@/components/nodes/CanvasNode";
import { ImageMixNode, type ImageMixItem, type ImageMixRole, type ImageMixWeight } from "@/components/nodes/ImageMixNode";
import { ImageLayerNode } from "@/components/nodes/ImageLayerNode";
import { MaskEditNode, type MaskEditSettings, type MaskRegion } from "@/components/nodes/MaskEditNode";

import type { StyleEntry } from "@/components/StyleAddModal";

const STORAGE_KEY = "brandgen_state";
const LOCAL_STORAGE_MAX_BYTES = 500_000;
const FLOW_INPUT_EDGE_STYLE: CSSProperties = { stroke: "var(--flow-line-input)", strokeWidth: 2.5 };
const FLOW_OUTPUT_EDGE_STYLE: CSSProperties = { stroke: "var(--flow-line-output)", strokeWidth: 3 };
const FLOW_PENDING_EDGE_STYLE: CSSProperties = { stroke: "var(--flow-line-pending)", strokeWidth: 2.5 };
const FLOW_ARIA_LABELS = {
  "controls.ariaLabel": "캔버스 컨트롤",
  "controls.zoomIn.ariaLabel": "확대",
  "controls.zoomOut.ariaLabel": "축소",
  "controls.fitView.ariaLabel": "화면에 맞추기",
  "controls.interactive.ariaLabel": "인터랙션 전환",
};

const OPTIONAL_NODE_CONFIG = {
  composition: {
    id: "composition-node",
    type: "compositionNode",
    label: "구도",
    description: "전신, 반신, 클로즈업, 원거리 같은 장면 구도를 제어합니다.",
    position: { x: 50, y: 850 },
    sourceHandle: "composition-out",
    edgeId: "e-composition-output",
    color: "var(--port-composition)",
  },
  characterReference: {
    id: "character-reference-node",
    type: "referenceNode",
    label: "캐릭터 참조",
    description: "같은 캐릭터 외형, 의상, 비율을 반복 생성에 고정합니다.",
    position: { x: 300, y: 850 },
    sourceHandle: "character-reference-out",
    edgeId: "e-character-reference-output",
    color: "var(--port-character-reference)",
  },
  objectReference: {
    id: "object-reference-node",
    type: "referenceNode",
    label: "오브젝트 참조",
    description: "제품, 자전거, 소품 같은 반복 오브젝트 형태를 고정합니다.",
    position: { x: 550, y: 850 },
    sourceHandle: "object-reference-out",
    edgeId: "e-object-reference-output",
    color: "var(--port-object-reference)",
  },
  elementBoard: {
    id: "element-board-node",
    type: "elementBoardNode",
    label: "앨리먼트 보드",
    description: "생성 이미지에서 추출한 캐릭터, 오브젝트, 스타일, 방향 정의를 구조화해 일관성을 고정합니다.",
    position: { x: 800, y: 850 },
    sourceHandle: "element-board-out",
    edgeId: "e-element-board-output",
    color: "var(--port-element-board)",
  },
  imageMix: {
    id: "image-mix-node",
    type: "imageMixNode",
    label: "이미지 믹스",
    description: "여러 참조 이미지를 역할과 강도로 섞어 생성 기준을 만듭니다.",
    position: { x: 300, y: 850 },
    sourceHandle: "image-mix-out",
    edgeId: "e-image-mix-output",
    color: "var(--port-image-mix)",
  },
  background: {
    id: "background-node",
    type: "backgroundNode",
    label: "배경",
    description: "배경 밀도와 환경 분위기를 제어합니다.",
    position: { x: 800, y: 850 },
    sourceHandle: "background-out",
    edgeId: "e-background-output",
    color: "var(--port-background)",
  },
  constraints: {
    id: "constraint-node",
    type: "constraintNode",
    label: "제한사항",
    description: "텍스트, 로고, 인원 수 같은 금지 조건을 고정합니다.",
    position: { x: 1050, y: 850 },
    sourceHandle: "constraint-out",
    edgeId: "e-constraint-output",
    color: "var(--port-constraint)",
  },
  mood: {
    id: "mood-node",
    type: "moodNode",
    label: "무드",
    description: "장면의 감정 톤과 에너지 레벨을 제어합니다.",
    position: { x: 1300, y: 850 },
    sourceHandle: "mood-out",
    edgeId: "e-mood-output",
    color: "var(--port-mood)",
  },
  palette: {
    id: "palette-node",
    type: "paletteNode",
    label: "색상 팔레트",
    description: "색 사용 규칙과 톤 방향을 분리해서 제어합니다.",
    position: { x: 1550, y: 850 },
    sourceHandle: "palette-out",
    edgeId: "e-palette-output",
    color: "var(--port-palette)",
  },
  cameraAngle: {
    id: "camera-angle-node",
    type: "cameraAngleNode",
    label: "카메라 앵글",
    description: "정면, 측면, 로우, 탑뷰 같은 시점 방향을 제어합니다.",
    position: { x: 1800, y: 850 },
    sourceHandle: "camera-angle-out",
    edgeId: "e-camera-angle-output",
    color: "var(--port-camera-angle)",
  },
  objectAngle: {
    id: "object-angle-node",
    type: "objectAngleNode",
    label: "오브젝트 앵글",
    description: "피사체 자체의 좌우/상하 회전 방향을 구 컨트롤로 조절합니다.",
    position: { x: 2050, y: 850 },
    sourceHandle: "object-angle-out",
    edgeId: "e-object-angle-output",
    color: "var(--port-object-angle)",
  },
  lighting: {
    id: "lighting-node",
    type: "lightingNode",
    label: "조명",
    description: "장면의 빛 방향과 광질을 분리해서 제어합니다.",
    position: { x: 2300, y: 850 },
    sourceHandle: "lighting-out",
    edgeId: "e-lighting-output",
    color: "var(--port-lighting)",
  },
  gesture: {
    id: "gesture-node",
    type: "gestureNode",
    label: "표정/제스처",
    description: "표정과 몸의 에너지, 동작감을 강화합니다.",
    position: { x: 2550, y: 850 },
    sourceHandle: "gesture-out",
    edgeId: "e-gesture-output",
    color: "var(--port-gesture)",
  },
  props: {
    id: "props-node",
    type: "propsNode",
    label: "소품",
    description: "핵심 소품을 설명과 분리해서 안정적으로 고정합니다.",
    position: { x: 2800, y: 850 },
    sourceHandle: "props-out",
    edgeId: "e-props-output",
    color: "var(--port-props)",
  },
  detail: {
    id: "detail-node",
    type: "detailNode",
    label: "출력 밀도",
    description: "얼마나 단순하거나 정교하게 그릴지 제어합니다.",
    position: { x: 3050, y: 850 },
    sourceHandle: "detail-out",
    edgeId: "e-detail-output",
    color: "var(--port-detail)",
  },
} as const;

type OptionalNodeKey = keyof typeof OPTIONAL_NODE_CONFIG;
type ViewMode = "gallery" | "editor";
type NodePositionMap = Record<string, { x: number; y: number }>;
type ConsistencyElements = {
  character: string;
  object: string;
  style: string;
  composition: string;
  elements?: ElementBoardItem[];
  rules: string[];
};
type ElementSheetStatus = "idle" | "generating" | "ready" | "failed";
type ElementBoardItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  enabled?: boolean;
  sheetStatus?: ElementSheetStatus;
  sheetImageUrl?: string;
  sheetPrompt?: string;
  sheetGeneratedAt?: string;
};
type ElementBoard = {
  character: string;
  object: string;
  style: string;
  composition: string;
  elements: ElementBoardItem[];
  rules: string[];
};
type ConsistencyStatus = "pending" | "ready" | "failed";

type EditorSnapshot = {
  title: string;
  isTitleUserEdited?: boolean;
  prompt: string;
  styles: StyleEntry[];
  activeStyleId: string | null;
  characterReferences: StyleEntry[];
  activeCharacterReferenceId: string | null;
  objectReferences: StyleEntry[];
  activeObjectReferenceId: string | null;
  elementBoard: ElementBoard;
  imageMixItems: ImageMixItem[];
  maskEdit: MaskEditSettings;
  ratio: string;
  resolution: string;
  composition: string;
  backgroundPrompt: string;
  constraints: string;
  mood: string;
  palette: string;
  cameraAngle: string;
  objectAngle: string;
  lighting: string;
  gesture: string;
  propsPrompt: string;
  detailLevel: string;
  englishPrompt: string;
  koreanPrompt: string;
  imageUrl: string | null;
  visibleOptionalNodes: OptionalNodeKey[];
  connectedOptionalNodes: OptionalNodeKey[];
  nodePositions?: NodePositionMap;
};

type GeneratedResult = EditorSnapshot & {
  id: string;
  title: string;
  createdAt: string;
  imagePath?: string;
  generationDurationSeconds?: number;
  tokenUsage?: GenerationTokenUsage | null;
  tokenUsageBreakdown?: GenerationTokenUsageBreakdownItem[];
  consistency?: ConsistencyElements;
  consistencyStatus?: ConsistencyStatus;
};

type GenerationTokenUsage = {
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
  totalTokens: number;
};

type GenerationTokenUsageBreakdownItem = GenerationTokenUsage & {
  label: string;
};

type PersistedState = {
  theme?: "light" | "dark";
  generatedResults?: GeneratedResult[];
  draft?: EditorSnapshot;
};

type FlowNode = Node<Record<string, unknown>, string>;
type FlowEdge = Edge;
type NodeRect = { x: number; y: number; width: number; height: number };
type GalleryColumnItem = { result: GeneratedResult; index: number };

const NODE_SIZE_BY_TYPE: Record<string, { width: number; height: number }> = {
  promptNode: { width: 320, height: 240 },
  styleNode: { width: 320, height: 250 },
  referenceNode: { width: 280, height: 260 },
  imageMixNode: { width: 300, height: 360 },
  elementItemNode: { width: 260, height: 180 },
  imageLayerNode: { width: 300, height: 220 },
  maskEditNode: { width: 330, height: 470 },
  outputSettingsNode: { width: 240, height: 220 },
  objectAngleNode: { width: 260, height: 290 },
  outputNode: { width: 380, height: 320 },
  canvasNode: { width: 480, height: 560 },
  default: { width: 220, height: 170 },
};

const OPTIONAL_NODE_LAYOUT = {
  minX: 24,
  minY: 24,
  gap: 36,
  promptAnchorOffsetX: 100,
  promptAnchorOffsetY: 16,
  candidateOffsets: [
    { x: 0, y: 220 },
    { x: 260, y: 160 },
    { x: 320, y: 20 },
    { x: -260, y: 180 },
    { x: 0, y: -220 },
    { x: 320, y: -120 },
    { x: -260, y: -100 },
    { x: 260, y: 300 },
  ],
} as const;

function getNodeSize(type: string | undefined) {
  if (!type) return NODE_SIZE_BY_TYPE.default;
  return NODE_SIZE_BY_TYPE[type] ?? NODE_SIZE_BY_TYPE.default;
}

function getNodeRect(node: FlowNode): NodeRect {
  const size = getNodeSize(node.type);
  return {
    x: node.position.x,
    y: node.position.y,
    width: size.width,
    height: size.height,
  };
}

function getOverlapArea(a: NodeRect, b: NodeRect) {
  const overlapWidth = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const overlapHeight = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return overlapWidth * overlapHeight;
}

function getCenterDistance(a: NodeRect, b: NodeRect) {
  const ax = a.x + a.width / 2;
  const ay = a.y + a.height / 2;
  const bx = b.x + b.width / 2;
  const by = b.y + b.height / 2;
  return Math.hypot(ax - bx, ay - by);
}

function findOptionalNodePosition(nodes: FlowNode[], nodeType: string, fallback: { x: number; y: number }) {
  const promptNode = nodes.find((node) => node.id === "prompt-node");
  if (!promptNode) return fallback;

  const promptSize = getNodeSize(promptNode.type);
  const optionalSize = getNodeSize(nodeType);
  const anchorX = promptNode.position.x + promptSize.width / 2 - OPTIONAL_NODE_LAYOUT.promptAnchorOffsetX;
  const anchorY = promptNode.position.y + promptSize.height / 2 - OPTIONAL_NODE_LAYOUT.promptAnchorOffsetY;

  const candidates = OPTIONAL_NODE_LAYOUT.candidateOffsets.map((offset) => ({
    x: Math.max(OPTIONAL_NODE_LAYOUT.minX, anchorX + offset.x),
    y: Math.max(OPTIONAL_NODE_LAYOUT.minY, anchorY + offset.y),
  }));

  const existingRects = nodes.map(getNodeRect);

  let bestPosition = fallback;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const rect = { ...candidate, width: optionalSize.width, height: optionalSize.height };
    const overlapPenalty = existingRects.reduce((sum, existing) => sum + getOverlapArea(rect, existing), 0);
    const proximityPenalty = existingRects.reduce((sum, existing) => {
      const minAllowedDistance =
        Math.max(rect.width, existing.width) / 2 + OPTIONAL_NODE_LAYOUT.gap;
      const distance = getCenterDistance(rect, existing);
      return distance < minAllowedDistance ? sum + (minAllowedDistance - distance) ** 2 : sum;
    }, 0);
    const anchorDistancePenalty = Math.hypot(candidate.x - anchorX, candidate.y - anchorY);
    const score = overlapPenalty * 1000 + proximityPenalty * 10 + anchorDistancePenalty;

    if (score < bestScore) {
      bestScore = score;
      bestPosition = candidate;
    }
  }

  return bestPosition;
}

function emptyElementBoard(): ElementBoard {
  return {
    character: "",
    object: "",
    style: "",
    composition: "",
    elements: [],
    rules: [],
  };
}

function normalizeElementBoardItem(item: Partial<ElementBoardItem>, index: number): ElementBoardItem | null {
  const name = typeof item.name === "string" ? item.name.trim() : "";
  const description = typeof item.description === "string" ? item.description.trim() : "";
  if (!name || !description) return null;

  return {
    id: typeof item.id === "string" && item.id.trim() ? item.id : `element-${Date.now()}-${index}`,
    name,
    category: typeof item.category === "string" && item.category.trim() ? item.category.trim() : "object",
    description,
    enabled: item.enabled !== false,
    sheetStatus: item.sheetStatus,
    sheetImageUrl: typeof item.sheetImageUrl === "string" ? item.sheetImageUrl : undefined,
    sheetPrompt: typeof item.sheetPrompt === "string" ? item.sheetPrompt : undefined,
    sheetGeneratedAt: typeof item.sheetGeneratedAt === "string" ? item.sheetGeneratedAt : undefined,
  };
}

function normalizeElementBoard(board?: Partial<ElementBoard> | null): ElementBoard {
  const elements = Array.isArray(board?.elements)
    ? board.elements
        .map((item, index) => normalizeElementBoardItem(item, index))
        .filter((item): item is ElementBoardItem => Boolean(item))
    : [];

  return {
    character: typeof board?.character === "string" ? board.character : "",
    object: typeof board?.object === "string" ? board.object : "",
    style: typeof board?.style === "string" ? board.style : "",
    composition: typeof board?.composition === "string" ? board.composition : "",
    elements,
    rules: Array.isArray(board?.rules) ? board.rules.filter((rule): rule is string => typeof rule === "string") : [],
  };
}

function normalizeImageMixRole(role: unknown): ImageMixRole {
  return role === "character" ||
    role === "object" ||
    role === "style" ||
    role === "palette" ||
    role === "composition" ||
    role === "background"
    ? role
    : "style";
}

function normalizeImageMixWeight(weight: unknown): ImageMixWeight {
  return weight === "low" || weight === "medium" || weight === "high" ? weight : "medium";
}

function normalizeStyleWeight(weight: unknown): NonNullable<StyleEntry["weight"]> {
  return weight === "subtle" || weight === "strong" ? weight : "medium";
}

function normalizeReferenceMode(mode: unknown): NonNullable<StyleEntry["referenceMode"]> {
  return mode === "image-reference" ? "image-reference" : "text-only";
}

function normalizeStyleEntry(entry: Partial<StyleEntry>, index: number): StyleEntry | null {
  const imageUrl = typeof entry.imageUrl === "string" ? entry.imageUrl.trim() : "";
  const prompt = typeof entry.prompt === "string" ? entry.prompt.trim() : "";
  if (!imageUrl && !prompt) return null;

  return {
    id: typeof entry.id === "string" && entry.id.trim() ? entry.id : `style-${Date.now()}-${index}`,
    imageUrl,
    prompt,
    label: typeof entry.label === "string" && entry.label.trim()
      ? entry.label.trim()
      : prompt.slice(0, 30) || `스타일 참조 ${index + 1}`,
    weight: normalizeStyleWeight(entry.weight),
    mode: "style-only",
    referenceMode: normalizeReferenceMode(entry.referenceMode),
    requiresImage: Boolean(entry.requiresImage),
    source: entry.source,
  };
}

function normalizeStyleEntries(entries?: Partial<StyleEntry>[] | null): StyleEntry[] {
  return Array.isArray(entries)
    ? entries
        .map((entry, index) => normalizeStyleEntry(entry, index))
        .filter((entry): entry is StyleEntry => Boolean(entry))
    : [];
}

function normalizeImageMixItem(item: Partial<ImageMixItem>, index: number): ImageMixItem | null {
  const imageUrl = typeof item.imageUrl === "string" ? item.imageUrl.trim() : "";
  if (!imageUrl) return null;

  const prompt = typeof item.prompt === "string" ? item.prompt.trim() : "";
  const label = typeof item.label === "string" && item.label.trim()
    ? item.label.trim()
    : prompt.slice(0, 30) || `이미지 믹스 ${index + 1}`;

  return {
    id: typeof item.id === "string" && item.id.trim() ? item.id : `image-mix-${Date.now()}-${index}`,
    imageUrl,
    prompt,
    label,
    role: normalizeImageMixRole(item.role),
    weight: normalizeImageMixWeight(item.weight),
    enabled: item.enabled !== false,
  };
}

function normalizeImageMixItems(items?: Partial<ImageMixItem>[] | null): ImageMixItem[] {
  return Array.isArray(items)
    ? items
        .map((item, index) => normalizeImageMixItem(item, index))
        .filter((item): item is ImageMixItem => Boolean(item))
    : [];
}

function normalizeMaskRegion(region: unknown): MaskRegion {
  return region === "center" ||
    region === "subject" ||
    region === "background" ||
    region === "top" ||
    region === "bottom" ||
    region === "left" ||
    region === "right"
    ? region
    : "subject";
}

function normalizeMaskEdit(settings?: Partial<MaskEditSettings> | null): MaskEditSettings {
  return {
    enabled: Boolean(settings?.enabled),
    region: normalizeMaskRegion(settings?.region),
    instruction: typeof settings?.instruction === "string" ? settings.instruction : "",
  };
}

function fallbackElementsFromConsistency(consistency: ConsistencyElements): ElementBoardItem[] {
  const elements: Array<ElementBoardItem | null> = [
    consistency.character.trim()
      ? {
          id: `element-character-${Date.now()}`,
          name: "Main character",
          category: "character",
          description: consistency.character.trim(),
          sheetStatus: "idle" as const,
        }
      : null,
    consistency.object.trim()
      ? {
          id: `element-object-${Date.now()}`,
          name: "Primary object",
          category: "object",
          description: consistency.object.trim(),
          sheetStatus: "idle" as const,
        }
      : null,
  ];
  return elements.filter((item): item is ElementBoardItem => Boolean(item));
}

function createElementBoardFromConsistency(consistency: ConsistencyElements, objectAngle: string): ElementBoard {
  const compositionBase = consistency.composition.trim();
  const extractedElements = Array.isArray(consistency.elements)
    ? consistency.elements
        .map((element, index) =>
          normalizeElementBoardItem(
            {
              ...element,
              id: element.id || `element-${Date.now()}-${index}`,
              sheetStatus: "idle",
            },
            index,
          ),
        )
        .filter((item): item is ElementBoardItem => Boolean(item))
    : [];

  return {
    ...normalizeElementBoard(consistency),
    elements: extractedElements.length ? extractedElements : fallbackElementsFromConsistency(consistency),
    rules: [
      ...consistency.rules,
      "Use generated element sheets as visual identity references when available.",
      objectAngle.trim() ? objectAngle.trim() : "Respect requested object orientation with visible perspective cues.",
      compositionBase ? `Preserve composition anchor: ${compositionBase}` : "",
    ].filter(Boolean),
  };
}

const DEFAULT_SNAPSHOT: EditorSnapshot = {
  title: "새 브랜드 이미지",
  isTitleUserEdited: false,
  prompt: "",
  styles: [],
  activeStyleId: null,
  characterReferences: [],
  activeCharacterReferenceId: null,
  objectReferences: [],
  activeObjectReferenceId: null,
  elementBoard: emptyElementBoard(),
  imageMixItems: [],
  maskEdit: {
    enabled: false,
    region: "subject",
    instruction: "",
  },
  ratio: "1:1",
  resolution: "HD",
  composition: "full-body composition with visible limbs and clear silhouette",
  backgroundPrompt: "pure white background with no environmental details",
  constraints: "no text, letters, numbers, captions, or typography anywhere",
  mood: "refined and premium mood with polished restraint",
  palette: "soft muted pastel palette with low saturation and gentle warmth",
  cameraAngle: "front-facing camera angle with direct clear presentation",
  objectAngle: "object facing forward with neutral object rotation",
  lighting: "soft diffused lighting with gentle even illumination",
  gesture: "hurried gesture with swinging arms and strong forward momentum",
  propsPrompt: "include a stack of documents or loose papers as the main prop",
  detailLevel: "balanced detail level with readable features and restrained extras",
  englishPrompt: "",
  koreanPrompt: "",
  imageUrl: null,
  visibleOptionalNodes: [],
  connectedOptionalNodes: [],
  nodePositions: {},
};

const OPTIONAL_NODE_KEYS = Object.keys(OPTIONAL_NODE_CONFIG) as OptionalNodeKey[];

function isOptionalNodeKey(key: unknown): key is OptionalNodeKey {
  return typeof key === "string" && key in OPTIONAL_NODE_CONFIG;
}

function normalizeOptionalNodeKeys(keys: unknown): OptionalNodeKey[] {
  if (!Array.isArray(keys)) return [];
  return keys.filter(isOptionalNodeKey);
}

function normalizeNodePositions(positions?: NodePositionMap): NodePositionMap {
  if (!positions) return {};

  const normalized = { ...positions };
  if (!normalized["output-settings-node"]) {
    const legacyOutputSettingsPosition = normalized["ratio-node"] ?? normalized["resolution-node"];
    if (legacyOutputSettingsPosition) normalized["output-settings-node"] = legacyOutputSettingsPosition;
  }

  return normalized;
}

function normalizeEditorSnapshot(snapshot: Partial<EditorSnapshot>): EditorSnapshot {
  return {
    ...DEFAULT_SNAPSHOT,
    ...snapshot,
    title: typeof snapshot.title === "string" ? snapshot.title : DEFAULT_SNAPSHOT.title,
    isTitleUserEdited: Boolean(snapshot.isTitleUserEdited),
    prompt: typeof snapshot.prompt === "string" ? snapshot.prompt : DEFAULT_SNAPSHOT.prompt,
    styles: normalizeStyleEntries(snapshot.styles),
    activeStyleId: typeof snapshot.activeStyleId === "string" ? snapshot.activeStyleId : null,
    characterReferences: normalizeStyleEntries(snapshot.characterReferences),
    activeCharacterReferenceId:
      typeof snapshot.activeCharacterReferenceId === "string" ? snapshot.activeCharacterReferenceId : null,
    objectReferences: normalizeStyleEntries(snapshot.objectReferences),
    activeObjectReferenceId:
      typeof snapshot.activeObjectReferenceId === "string" ? snapshot.activeObjectReferenceId : null,
    elementBoard: normalizeElementBoard(snapshot.elementBoard),
    imageMixItems: normalizeImageMixItems(snapshot.imageMixItems),
    maskEdit: normalizeMaskEdit(snapshot.maskEdit),
    ratio: typeof snapshot.ratio === "string" ? snapshot.ratio : DEFAULT_SNAPSHOT.ratio,
    resolution: typeof snapshot.resolution === "string" ? snapshot.resolution : DEFAULT_SNAPSHOT.resolution,
    composition: typeof snapshot.composition === "string" ? snapshot.composition : DEFAULT_SNAPSHOT.composition,
    backgroundPrompt:
      typeof snapshot.backgroundPrompt === "string" ? snapshot.backgroundPrompt : DEFAULT_SNAPSHOT.backgroundPrompt,
    constraints: typeof snapshot.constraints === "string" ? snapshot.constraints : DEFAULT_SNAPSHOT.constraints,
    mood: typeof snapshot.mood === "string" ? snapshot.mood : DEFAULT_SNAPSHOT.mood,
    palette: typeof snapshot.palette === "string" ? snapshot.palette : DEFAULT_SNAPSHOT.palette,
    cameraAngle: typeof snapshot.cameraAngle === "string" ? snapshot.cameraAngle : DEFAULT_SNAPSHOT.cameraAngle,
    objectAngle: typeof snapshot.objectAngle === "string" ? snapshot.objectAngle : DEFAULT_SNAPSHOT.objectAngle,
    lighting: typeof snapshot.lighting === "string" ? snapshot.lighting : DEFAULT_SNAPSHOT.lighting,
    gesture: typeof snapshot.gesture === "string" ? snapshot.gesture : DEFAULT_SNAPSHOT.gesture,
    propsPrompt: typeof snapshot.propsPrompt === "string" ? snapshot.propsPrompt : DEFAULT_SNAPSHOT.propsPrompt,
    detailLevel: typeof snapshot.detailLevel === "string" ? snapshot.detailLevel : DEFAULT_SNAPSHOT.detailLevel,
    englishPrompt: typeof snapshot.englishPrompt === "string" ? snapshot.englishPrompt : "",
    koreanPrompt: typeof snapshot.koreanPrompt === "string" ? snapshot.koreanPrompt : "",
    imageUrl: typeof snapshot.imageUrl === "string" ? snapshot.imageUrl : null,
    visibleOptionalNodes: normalizeOptionalNodeKeys(snapshot.visibleOptionalNodes),
    connectedOptionalNodes: normalizeOptionalNodeKeys(snapshot.connectedOptionalNodes),
    nodePositions: normalizeNodePositions(snapshot.nodePositions),
  };
}

const MANDATORY_EDGES = [
  {
    id: "e-prompt-output",
    source: "prompt-node",
    sourceHandle: "prompt-out",
    target: "output-node",
    targetHandle: "general-in",
    style: FLOW_INPUT_EDGE_STYLE,
  },
  {
    id: "e-style-output",
    source: "style-node",
    sourceHandle: "style-out",
    target: "output-node",
    targetHandle: "general-in",
    style: FLOW_INPUT_EDGE_STYLE,
  },
  {
    id: "e-output-settings-output",
    source: "output-settings-node",
    sourceHandle: "output-settings-out",
    target: "output-node",
    targetHandle: "general-in",
    style: FLOW_INPUT_EDGE_STYLE,
  },
];

function buildEditorNodes(optionalKeys: OptionalNodeKey[], includeCanvas: boolean): FlowNode[] {
  const baseNodes: FlowNode[] = [
    { id: "prompt-node", type: "promptNode", position: { x: 50, y: 50 }, data: {} },
    { id: "style-node", type: "styleNode", position: { x: 50, y: 500 }, data: {} },
    { id: "output-settings-node", type: "outputSettingsNode", position: { x: 50, y: 800 }, data: {} },
    { id: "output-node", type: "outputNode", position: { x: 450, y: 150 }, data: {} },
  ];

  const optionalNodes = optionalKeys.map((key) => {
    const config = OPTIONAL_NODE_CONFIG[key];
    return {
      id: config.id,
      type: config.type,
      position: config.position,
      data: {},
    };
  });

  const canvasNodes: FlowNode[] = includeCanvas
    ? [
        { id: "canvas-node", type: "canvasNode", position: { x: 850, y: 150 }, data: {} },
        { id: "image-layer-node", type: "imageLayerNode", position: { x: 1380, y: 150 }, data: {} },
        { id: "mask-edit-node", type: "maskEditNode", position: { x: 1740, y: 150 }, data: {} },
      ]
    : [];

  return [...baseNodes, ...optionalNodes, ...canvasNodes];
}

function getNodePositions(nodes: FlowNode[]): NodePositionMap {
  return nodes.reduce<NodePositionMap>((positions, node) => {
    positions[node.id] = { x: node.position.x, y: node.position.y };
    return positions;
  }, {});
}

function applyNodePositions(nodes: FlowNode[], positions?: NodePositionMap): FlowNode[] {
  if (!positions) return nodes;

  return nodes.map((node) => {
    const position =
      positions[node.id] ??
      (node.id === "output-settings-node"
        ? positions["ratio-node"] ?? positions["resolution-node"]
        : undefined);
    return position ? { ...node, position } : node;
  });
}

function buildEditorEdges(connectedOptionalKeys: OptionalNodeKey[], includeCanvas: boolean): FlowEdge[] {
  const optionalEdges: FlowEdge[] = connectedOptionalKeys
    .filter((key) => key !== "elementBoard")
    .map((key) => {
      const config = OPTIONAL_NODE_CONFIG[key];
      return {
        id: config.edgeId,
        source: config.id,
        sourceHandle: config.sourceHandle,
        target: "output-node",
        targetHandle: "general-in",
        style: FLOW_INPUT_EDGE_STYLE,
      };
    });

  const canvasEdges: FlowEdge[] = includeCanvas
    ? [
        {
          id: "e-prompt-canvas",
          source: "output-node",
          sourceHandle: "output-out",
          target: "canvas-node",
          targetHandle: "canvas-in",
          style: FLOW_OUTPUT_EDGE_STYLE,
          animated: false,
        },
        {
          id: "e-canvas-image-layer",
          source: "canvas-node",
          sourceHandle: "canvas-out",
          target: "image-layer-node",
          targetHandle: "layer-in",
          style: FLOW_OUTPUT_EDGE_STYLE,
        },
        {
          id: "e-image-layer-mask",
          source: "image-layer-node",
          sourceHandle: "layer-out",
          target: "mask-edit-node",
          targetHandle: "mask-in",
          style: FLOW_OUTPUT_EDGE_STYLE,
        },
        {
          id: "e-mask-output",
          source: "mask-edit-node",
          sourceHandle: "mask-out",
          target: "output-node",
          targetHandle: "general-in",
          style: FLOW_OUTPUT_EDGE_STYLE,
        },
      ]
    : [];

  return [...MANDATORY_EDGES, ...optionalEdges, ...canvasEdges];
}

function createResultTitle(prompt: string, englishPrompt: string) {
  const source = prompt.trim() || englishPrompt.trim() || "새 브랜드 이미지";
  return source.slice(0, 42);
}

function createFallbackDisplayTitle(prompt: string, englishPrompt: string, koreanPrompt: string) {
  const source = (koreanPrompt || prompt || englishPrompt || "새 브랜드 이미지")
    .replace(/\s+/g, " ")
    .trim();
  const firstClause = source.split(/[,.!?:;\n]/)[0]?.trim() || source;
  return firstClause.length > 24 ? `${firstClause.slice(0, 24).trim()}…` : firstClause;
}

function isLegacyGeneratedTitle(result: Pick<GeneratedResult, "title" | "prompt" | "englishPrompt" | "isTitleUserEdited">) {
  if (result.isTitleUserEdited) return false;
  const legacyTitle = createResultTitle(result.prompt, result.englishPrompt);
  return !result.title?.trim() || result.title === legacyTitle;
}

function getDisplayTitle(result: Pick<GeneratedResult, "title" | "prompt" | "englishPrompt" | "koreanPrompt" | "isTitleUserEdited">) {
  if (!isLegacyGeneratedTitle(result as Pick<GeneratedResult, "title" | "prompt" | "englishPrompt" | "isTitleUserEdited">)) {
    return result.title.trim();
  }
  return createFallbackDisplayTitle(result.prompt, result.englishPrompt, result.koreanPrompt);
}

function formatDurationLabel(totalSeconds: number | null) {
  if (totalSeconds === null) return null;
  if (totalSeconds < 60) return `${totalSeconds}초`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds === 0 ? `${minutes}분` : `${minutes}분 ${seconds}초`;
}

function formatTokenCount(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value.toLocaleString("ko-KR") : "0";
}

function formatTokenUsageSummary(usage?: GenerationTokenUsage | null) {
  if (!usage) return null;
  return `${formatTokenCount(usage.totalTokens)} tokens`;
}

function getActiveStylePrompt(result: GeneratedResult) {
  if (!result.activeStyleId) return "";
  return result.styles.find((styleEntry) => styleEntry.id === result.activeStyleId)?.prompt || "";
}

function getPreviewTitle(activeResult: GeneratedResult | null, prompt: string, englishPrompt: string) {
  if (activeResult) return getDisplayTitle(activeResult);
  return createFallbackDisplayTitle(prompt, englishPrompt, "");
}

function getPreviewPrompt(activeResult: GeneratedResult | null, englishPrompt: string) {
  return activeResult?.englishPrompt ?? englishPrompt ?? "";
}

function getPreviewKoreanPrompt(activeResult: GeneratedResult | null, koreanPrompt: string) {
  return activeResult?.koreanPrompt ?? koreanPrompt ?? "";
}

function getSnapshotTitle(snapshot: Partial<EditorSnapshot>) {
  return snapshot.title?.trim() || createFallbackDisplayTitle(snapshot.prompt || "", snapshot.englishPrompt || "", snapshot.koreanPrompt || "");
}

function emptyConsistency(): ConsistencyElements {
  return {
    character: "",
    object: "",
    style: "",
    composition: "",
    elements: [],
    rules: [],
  };
}

function getElementNodeId(elementId: string) {
  return `element-item-${elementId}`;
}

function getElementCanvasNodeId(elementId: string) {
  return `element-canvas-${elementId}`;
}

function getGalleryColumnCount(width: number) {
  if (width <= 640) return 1;
  if (width <= 900) return 2;
  if (width <= 1100) return 3;
  return 4;
}

function getResultHeightEstimate(result: GeneratedResult) {
  const [widthText, heightText] = result.ratio.split(":");
  const width = Number(widthText);
  const height = Number(heightText);
  const ratioHeight = width > 0 && height > 0 ? height / width : 1;
  return ratioHeight + 0.08;
}

function distributeResultsToColumns(results: GeneratedResult[], columnCount: number): GalleryColumnItem[][] {
  const columns = Array.from({ length: columnCount }, () => [] as GalleryColumnItem[]);
  const heights = Array.from({ length: columnCount }, () => 0);

  results.forEach((result, index) => {
    const targetIndex = heights.indexOf(Math.min(...heights));
    columns[targetIndex].push({ result, index });
    heights[targetIndex] += getResultHeightEstimate(result);
  });

  return columns;
}

function createReferenceEntryFromConsistency(kind: "character" | "object" | "style", prompt: string, imageUrl: string): StyleEntry {
  const labelPrefix = kind === "character" ? "캐릭터" : kind === "object" ? "오브젝트" : "스타일";
  return {
    id: `${kind}-consistency-${Date.now()}`,
    imageUrl,
    prompt,
    label: `${labelPrefix} 앨리먼트`,
    referenceMode: kind === "character" ? "image-reference" : "text-only",
  };
}

function appendObjectAnglePrompt(englishPrompt: string, objectAngle: string | null | undefined) {
  const nextObjectAngle = objectAngle?.trim();
  if (!nextObjectAngle || nextObjectAngle === DEFAULT_SNAPSHOT.objectAngle) return englishPrompt;
  if (englishPrompt.includes(nextObjectAngle)) return englishPrompt;
  if (englishPrompt.includes("OBJECT ORIENTATION LOCK") || englishPrompt.includes("mandatory object orientation")) return englishPrompt;

  return [englishPrompt.trim(), nextObjectAngle].filter(Boolean).join(", ");
}

function appendConsistencyReferences(
  englishPrompt: string,
  characterReference: string | null | undefined,
  objectReference: string | null | undefined,
) {
  const parts = [englishPrompt.trim()].filter(Boolean);
  const nextCharacterReference = characterReference?.trim();
  const nextObjectReference = objectReference?.trim();

  if (nextCharacterReference && !englishPrompt.includes(nextCharacterReference)) {
    parts.push(`fixed character reference: ${nextCharacterReference}`);
  }
  if (nextObjectReference && !englishPrompt.includes(nextObjectReference)) {
    parts.push(`fixed object reference: ${nextObjectReference}`);
  }

  return parts.join(", ");
}

function formatElementBoardPrompt(board: ElementBoard) {
  const normalized = normalizeElementBoard(board);
  const elementPrompts = normalized.elements.filter((element) => element.enabled !== false).map((element) => {
    const sheetReference = element.sheetImageUrl
      ? "visual turnaround sheet is available and must be treated as the primary identity reference"
      : "turnaround sheet not generated yet; use text identity only";
    return `${element.name} (${element.category}): ${element.description}. ${sheetReference}`;
  });
  const parts = [
    normalized.character.trim() ? `character identity: ${normalized.character.trim()}` : "",
    normalized.object.trim() ? `object identity: ${normalized.object.trim()}` : "",
    normalized.style.trim() ? `style identity: ${normalized.style.trim()}` : "",
    normalized.composition.trim() ? `composition anchor: ${normalized.composition.trim()}` : "",
    elementPrompts.length ? `classified elements: ${elementPrompts.join(" | ")}` : "",
    normalized.rules.length ? `consistency rules: ${normalized.rules.join("; ")}` : "",
  ].filter(Boolean);

  if (parts.length === 0) return "";
  return `ELEMENT BOARD CONSISTENCY LOCK: ${parts.join(". ")}. Preserve these classified elements across generations; when an element sheet exists, match that sheet's front, left, right, and back identity rather than inventing a new design.`;
}

function appendElementBoardPrompt(englishPrompt: string, board: ElementBoard | null | undefined) {
  if (!board) return englishPrompt;
  const elementBoardPrompt = formatElementBoardPrompt(board);
  if (!elementBoardPrompt) return englishPrompt;
  if (englishPrompt.includes("ELEMENT BOARD CONSISTENCY LOCK")) return englishPrompt;
  return [englishPrompt.trim(), elementBoardPrompt].filter(Boolean).join(", ");
}

function formatImageMixPrompt(items: ImageMixItem[]) {
  const enabledItems = items.filter((item) => item.enabled !== false && item.imageUrl.trim());
  if (enabledItems.length === 0) return "";

  const roleLabel: Record<ImageMixRole, string> = {
    character: "character identity",
    object: "object form",
    style: "visual style",
    palette: "color palette",
    composition: "composition",
    background: "background mood",
  };
  const weightLabel: Record<ImageMixWeight, string> = {
    low: "subtle influence",
    medium: "balanced influence",
    high: "strong influence",
  };
  const parts = enabledItems.map((item, index) => {
    const prompt = item.prompt.trim() || item.label.trim() || "use visible traits from this image";
    return `reference ${index + 1}: ${roleLabel[item.role]}, ${weightLabel[item.weight]}, ${prompt}`;
  });

  return `IMAGE MIX REFERENCES: ${parts.join(" | ")}. Use attached mix images as controlled references by role; combine their intended traits into one coherent new image, not a collage. Resolve conflicts by favoring stronger influence settings.`;
}

function appendImageMixPrompt(englishPrompt: string, items: ImageMixItem[]) {
  const imageMixPrompt = formatImageMixPrompt(items);
  if (!imageMixPrompt) return englishPrompt;
  if (englishPrompt.includes("IMAGE MIX REFERENCES")) return englishPrompt;
  return [englishPrompt.trim(), imageMixPrompt].filter(Boolean).join(", ");
}

function formatMaskEditPrompt(settings: MaskEditSettings) {
  if (!settings.enabled || !settings.instruction.trim()) return "";

  const regionLabel: Record<MaskRegion, string> = {
    center: "center area",
    subject: "main subject area",
    background: "background area",
    top: "top area",
    bottom: "bottom area",
    left: "left area",
    right: "right area",
  };

  return `MASKED LAYER EDIT: Use the attached generated layer as the source image. Change only the ${regionLabel[settings.region]}: ${settings.instruction.trim()}. Preserve all unmasked areas, composition, identity, lighting continuity, and camera perspective unless the edit instruction explicitly overrides them.`;
}

function appendMaskEditPrompt(englishPrompt: string, settings: MaskEditSettings) {
  const maskEditPrompt = formatMaskEditPrompt(settings);
  if (!maskEditPrompt) return englishPrompt;
  if (englishPrompt.includes("MASKED LAYER EDIT")) return englishPrompt;
  return [englishPrompt.trim(), maskEditPrompt].filter(Boolean).join(", ");
}

function appendAuthoritativeNodeSettings(englishPrompt: string, settings: string[]) {
  const normalized = settings.map((setting) => setting.trim()).filter(Boolean);
  if (normalized.length === 0) return englishPrompt;
  const marker = "AUTHORITATIVE NODE SETTINGS";
  if (englishPrompt.includes(marker)) return englishPrompt;
  return [
    englishPrompt.trim(),
    `${marker}: ${normalized.join(" | ")}. These connected node settings are current and must override weaker or stale wording elsewhere in the prompt. Preserve every explicit setting unless it directly conflicts with a stricter consistency lock.`,
  ].filter(Boolean).join(", ");
}

function compactPromptValue(value: string, maxLength = 420) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

function buildCompactExecutionPrompt({
  corePrompt,
  settings,
  imageMixCount,
  styleReferenceSummary,
}: {
  corePrompt: string;
  settings: string[];
  imageMixCount: number;
  styleReferenceSummary: { label: string; weight: "subtle" | "medium" | "strong"; hasImage: boolean } | null;
}) {
  const lines = ["xGen image brief."];
  if (corePrompt.trim()) lines.push(`Subject: ${compactPromptValue(corePrompt, 520)}`);
  for (const setting of settings) lines.push(compactPromptValue(setting, 520));
  if (styleReferenceSummary?.hasImage) {
    lines.push(`Style image: use ${styleReferenceSummary.label} as ${styleReferenceSummary.weight} style-only reference; copy palette, texture, lighting, finish, not subject/layout.`);
  }
  if (imageMixCount > 0) lines.push(`Image mix: use ${imageMixCount} attached role-weighted references only for declared traits.`);
  lines.push("Quality: premium brand image, coherent composition, high detail, no readable text, no logo, no watermark.");
  return Array.from(new Set(lines.filter(Boolean))).join("\n");
}

function mergeGeneratedResults(
  localResults: GeneratedResult[] = [],
  fileResults: GeneratedResult[] = [],
) {
  const merged = new Map<string, GeneratedResult>();
  for (const result of [...fileResults, ...localResults]) {
    if (result?.id) merged.set(result.id, result);
  }
  return [...merged.values()].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function readLocalPersistedState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    if (raw.length > LOCAL_STORAGE_MAX_BYTES) {
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }
    const parsed = JSON.parse(raw) as PersistedState;
    return {
      theme: parsed.theme,
      generatedResults: Array.isArray(parsed.generatedResults) ? parsed.generatedResults : [],
      draft: parsed.draft,
    };
  } catch {
    return {};
  }
}

async function readFilePersistedState(): Promise<PersistedState> {
  try {
    const res = await fetch("/api/gallery", { cache: "no-store" });
    if (!res.ok) return {};
    const parsed = (await res.json()) as PersistedState;
    return {
      theme: parsed.theme,
      generatedResults: Array.isArray(parsed.generatedResults) ? parsed.generatedResults : [],
      draft: parsed.draft,
    };
  } catch {
    return {};
  }
}

async function writeFilePersistedState(payload: PersistedState) {
  try {
    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Keep the UI responsive even if the local file DB is temporarily unavailable.
  }
}

export default function Home() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}

function FlowContent() {
  const hasLoadedRef = useRef(false);
  const skipNextPersistRef = useRef(false);
  const titleBackfillRequestedRef = useRef<Set<string>>(new Set());
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [isNodeAddMenuOpen, setIsNodeAddMenuOpen] = useState(false);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const [generatedResults, setGeneratedResults] = useState<GeneratedResult[]>([]);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isPreviewPromptCopied, setIsPreviewPromptCopied] = useState(false);
  const [isPreviewImageDownloaded, setIsPreviewImageDownloaded] = useState(false);
  const [previewPromptLanguage, setPreviewPromptLanguage] = useState<"ko" | "en">("ko");
  const [isPreviewKoreanPromptLoading, setIsPreviewKoreanPromptLoading] = useState(false);
  const [galleryColumnCount, setGalleryColumnCount] = useState(4);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [outputDirectory, setOutputDirectory] = useState("");
  const [isDefaultOutputDirectory, setIsDefaultOutputDirectory] = useState(true);
  const [settingsStatus, setSettingsStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  const [editorTitle, setEditorTitle] = useState(DEFAULT_SNAPSHOT.title);
  const [isTitleUserEdited, setIsTitleUserEdited] = useState(Boolean(DEFAULT_SNAPSHOT.isTitleUserEdited));
  const [prompt, setPrompt] = useState(DEFAULT_SNAPSHOT.prompt);
  const [styles, setStyles] = useState<StyleEntry[]>(DEFAULT_SNAPSHOT.styles);
  const [activeStyleId, setActiveStyleId] = useState<string | null>(DEFAULT_SNAPSHOT.activeStyleId);
  const [characterReferences, setCharacterReferences] = useState<StyleEntry[]>(DEFAULT_SNAPSHOT.characterReferences);
  const [activeCharacterReferenceId, setActiveCharacterReferenceId] = useState<string | null>(DEFAULT_SNAPSHOT.activeCharacterReferenceId);
  const [objectReferences, setObjectReferences] = useState<StyleEntry[]>(DEFAULT_SNAPSHOT.objectReferences);
  const [activeObjectReferenceId, setActiveObjectReferenceId] = useState<string | null>(DEFAULT_SNAPSHOT.activeObjectReferenceId);
  const [elementBoard, setElementBoard] = useState<ElementBoard>(DEFAULT_SNAPSHOT.elementBoard);
  const [imageMixItems, setImageMixItems] = useState<ImageMixItem[]>(DEFAULT_SNAPSHOT.imageMixItems);
  const [maskEdit, setMaskEdit] = useState<MaskEditSettings>(DEFAULT_SNAPSHOT.maskEdit);
  const [ratio, setRatio] = useState(DEFAULT_SNAPSHOT.ratio);
  const [resolution, setResolution] = useState(DEFAULT_SNAPSHOT.resolution);
  const [composition, setComposition] = useState(DEFAULT_SNAPSHOT.composition);
  const [backgroundPrompt, setBackgroundPrompt] = useState(DEFAULT_SNAPSHOT.backgroundPrompt);
  const [constraints, setConstraints] = useState(DEFAULT_SNAPSHOT.constraints);
  const [mood, setMood] = useState(DEFAULT_SNAPSHOT.mood);
  const [palette, setPalette] = useState(DEFAULT_SNAPSHOT.palette);
  const [cameraAngle, setCameraAngle] = useState(DEFAULT_SNAPSHOT.cameraAngle);
  const [objectAngle, setObjectAngle] = useState(DEFAULT_SNAPSHOT.objectAngle);
  const [lighting, setLighting] = useState(DEFAULT_SNAPSHOT.lighting);
  const [gesture, setGesture] = useState(DEFAULT_SNAPSHOT.gesture);
  const [propsPrompt, setPropsPrompt] = useState(DEFAULT_SNAPSHOT.propsPrompt);
  const [detailLevel, setDetailLevel] = useState(DEFAULT_SNAPSHOT.detailLevel);
  const [englishPrompt, setEnglishPrompt] = useState(DEFAULT_SNAPSHOT.englishPrompt);
  const [koreanPrompt, setKoreanPrompt] = useState(DEFAULT_SNAPSHOT.koreanPrompt);
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [optimizedPromptEdited, setOptimizedPromptEdited] = useState(false);
  const [promptComposeStatus, setPromptComposeStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [promptComposeError, setPromptComposeError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(DEFAULT_SNAPSHOT.imageUrl);
  const [generationErrorMessage, setGenerationErrorMessage] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateElapsedSeconds, setTranslateElapsedSeconds] = useState(0);
  const [lastTranslateDurationSeconds, setLastTranslateDurationSeconds] = useState<number | null>(null);
  const [generateElapsedSeconds, setGenerateElapsedSeconds] = useState(0);
  const [lastGenerateDurationSeconds, setLastGenerateDurationSeconds] = useState<number | null>(null);
  const [lastGenerationTokenUsage, setLastGenerationTokenUsage] = useState<GenerationTokenUsage | null>(null);
  const [lastGenerationTokenUsageBreakdown, setLastGenerationTokenUsageBreakdown] = useState<GenerationTokenUsageBreakdownItem[]>([]);
  const [nodes, setNodes] = useState<FlowNode[]>(
    buildEditorNodes(DEFAULT_SNAPSHOT.visibleOptionalNodes, false),
  );
  const [edges, setEdges] = useState<FlowEdge[]>(
    buildEditorEdges(DEFAULT_SNAPSHOT.connectedOptionalNodes, false),
  );
  const translateStartedAtRef = useRef<number | null>(null);
  const generateStartedAtRef = useRef<number | null>(null);
  const nodesRef = useRef<FlowNode[]>(nodes);
  const skipNextBriefResetRef = useRef(false);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const applySnapshotToEditor = useCallback((snapshot: EditorSnapshot, options?: { preserveKoreanPrompt?: boolean }) => {
    const normalizedSnapshot = normalizeEditorSnapshot(snapshot);

    skipNextBriefResetRef.current = true;
    setEditorTitle(getSnapshotTitle(normalizedSnapshot));
    setIsTitleUserEdited(Boolean(normalizedSnapshot.isTitleUserEdited));
    setPrompt(normalizedSnapshot.prompt);
    setStyles(normalizedSnapshot.styles);
    setActiveStyleId(normalizedSnapshot.activeStyleId);
    setCharacterReferences(normalizedSnapshot.characterReferences);
    setActiveCharacterReferenceId(normalizedSnapshot.activeCharacterReferenceId);
    setObjectReferences(normalizedSnapshot.objectReferences);
    setActiveObjectReferenceId(normalizedSnapshot.activeObjectReferenceId);
    setElementBoard(normalizedSnapshot.elementBoard);
    setImageMixItems(normalizedSnapshot.imageMixItems);
    setMaskEdit(normalizedSnapshot.maskEdit);
    setRatio(normalizedSnapshot.ratio);
    setResolution(normalizedSnapshot.resolution);
    setComposition(normalizedSnapshot.composition);
    setBackgroundPrompt(normalizedSnapshot.backgroundPrompt);
    setConstraints(normalizedSnapshot.constraints);
    setMood(normalizedSnapshot.mood);
    setPalette(normalizedSnapshot.palette);
    setCameraAngle(normalizedSnapshot.cameraAngle);
    setObjectAngle(normalizedSnapshot.objectAngle);
    setLighting(normalizedSnapshot.lighting);
    setGesture(normalizedSnapshot.gesture);
    setPropsPrompt(normalizedSnapshot.propsPrompt);
    setDetailLevel(normalizedSnapshot.detailLevel);
    setEnglishPrompt(normalizedSnapshot.englishPrompt);
    setKoreanPrompt(options?.preserveKoreanPrompt ? normalizedSnapshot.koreanPrompt : "");
    setOptimizedPrompt("");
    setOptimizedPromptEdited(false);
    setPromptComposeStatus("idle");
    setPromptComposeError("");
    setImageUrl(normalizedSnapshot.imageUrl);
    const snapshotWithUsage = snapshot as EditorSnapshot & {
      tokenUsage?: GenerationTokenUsage | null;
      tokenUsageBreakdown?: GenerationTokenUsageBreakdownItem[];
    };
    setLastGenerationTokenUsage(snapshotWithUsage.tokenUsage ?? null);
    setLastGenerationTokenUsageBreakdown(Array.isArray(snapshotWithUsage.tokenUsageBreakdown) ? snapshotWithUsage.tokenUsageBreakdown : []);
    setError(false);
    setGenerationErrorMessage("");
    setNodes(
      applyNodePositions(
        buildEditorNodes(normalizedSnapshot.visibleOptionalNodes, Boolean(normalizedSnapshot.imageUrl)),
        normalizedSnapshot.nodePositions,
      ),
    );
    setEdges(
      buildEditorEdges(normalizedSnapshot.connectedOptionalNodes, Boolean(normalizedSnapshot.imageUrl)),
    );
  }, []);

  const captureCurrentSnapshot = useCallback(
    (nextImageUrl?: string | null): EditorSnapshot => {
      const visibleOptionalNodes = OPTIONAL_NODE_KEYS.filter((key) =>
        nodes.some((node) => node.id === OPTIONAL_NODE_CONFIG[key].id),
      );
      const connectedOptionalNodes = OPTIONAL_NODE_KEYS.filter((key) =>
        key === "elementBoard"
          ? elementBoard.elements.length > 0
          : edges.some(
              (edge) =>
                edge.source === OPTIONAL_NODE_CONFIG[key].id && edge.target === "output-node",
            ),
      );

      return {
        title: getSnapshotTitle({ title: editorTitle, prompt, englishPrompt, koreanPrompt }),
        isTitleUserEdited,
        prompt,
        styles,
        activeStyleId,
        characterReferences,
        activeCharacterReferenceId,
        objectReferences,
        activeObjectReferenceId,
        elementBoard,
        imageMixItems,
        maskEdit,
        ratio,
        resolution,
        composition,
        backgroundPrompt,
        constraints,
        mood,
        palette,
        cameraAngle,
        objectAngle,
        lighting,
        gesture,
        propsPrompt,
        detailLevel,
        englishPrompt,
        koreanPrompt,
        imageUrl: nextImageUrl === undefined ? imageUrl : nextImageUrl,
        visibleOptionalNodes,
        connectedOptionalNodes,
        nodePositions: getNodePositions(nodes),
      };
    },
    [
      editorTitle,
      isTitleUserEdited,
      prompt,
      styles,
      activeStyleId,
      characterReferences,
      activeCharacterReferenceId,
      objectReferences,
      activeObjectReferenceId,
      elementBoard,
      imageMixItems,
      maskEdit,
      ratio,
      resolution,
      composition,
      backgroundPrompt,
      constraints,
      mood,
      palette,
      cameraAngle,
      objectAngle,
      lighting,
      gesture,
      propsPrompt,
      detailLevel,
      englishPrompt,
      koreanPrompt,
      imageUrl,
      nodes,
      edges,
    ],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadPersistedState() {
      const localState = readLocalPersistedState();
      const fileState = await readFilePersistedState();
      const mergedResults = mergeGeneratedResults(
        localState.generatedResults,
        fileState.generatedResults,
      );
      const saved: PersistedState = {
        theme: localState.theme || fileState.theme,
        generatedResults: mergedResults,
        draft: localState.draft || fileState.draft,
      };

      if (cancelled) return;
      skipNextPersistRef.current = true;
      queueMicrotask(() => {
        if (cancelled) return;
        if (saved.theme) setTheme(saved.theme);
        if (saved.generatedResults?.length) setGeneratedResults(saved.generatedResults);
        if (saved.draft) applySnapshotToEditor(saved.draft, { preserveKoreanPrompt: true });
        hasLoadedRef.current = true;
      });

      const localCount = localState.generatedResults?.length ?? 0;
      const fileCount = fileState.generatedResults?.length ?? 0;
      if (mergedResults.length > fileCount || localCount > 0) {
        await writeFilePersistedState(saved);
      }
    }

    void loadPersistedState().catch(() => {
      if (!cancelled) hasLoadedRef.current = true;
    });

    return () => {
      cancelled = true;
    };
  }, [applySnapshotToEditor]);

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }
    const timeoutId = window.setTimeout(() => {
      try {
        const payload = {
          theme,
          generatedResults,
          draft: captureCurrentSnapshot(),
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme }));
        } catch {
          // Large data URLs can exceed localStorage quota; the file store remains authoritative.
        }
        void writeFilePersistedState(payload);
      } catch {
        // ignore snapshot failures
      }
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [theme, generatedResults, captureCurrentSnapshot]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const updateGalleryColumnCount = () => {
      setGalleryColumnCount(getGalleryColumnCount(window.innerWidth));
    };

    updateGalleryColumnCount();
    window.addEventListener("resize", updateGalleryColumnCount);
    return () => window.removeEventListener("resize", updateGalleryColumnCount);
  }, []);

  useEffect(() => {
    if (!previewImageUrl) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewImageUrl(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewImageUrl]);

  useEffect(() => {
    if (!isPreviewPromptCopied) return;
    const timeoutId = window.setTimeout(() => setIsPreviewPromptCopied(false), 1600);
    return () => window.clearTimeout(timeoutId);
  }, [isPreviewPromptCopied]);

  useEffect(() => {
    if (!isPreviewImageDownloaded) return;
    const timeoutId = window.setTimeout(() => setIsPreviewImageDownloaded(false), 1600);
    return () => window.clearTimeout(timeoutId);
  }, [isPreviewImageDownloaded]);

  useEffect(() => {
    if (!isNodeAddMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsNodeAddMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNodeAddMenuOpen]);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as {
          outputDirectory?: string;
          isDefaultOutputDirectory?: boolean;
        };
        if (cancelled) return;
        setOutputDirectory(data.outputDirectory || "");
        setIsDefaultOutputDirectory(Boolean(data.isDefaultOutputDirectory));
      } catch {
        if (!cancelled) setSettingsStatus("failed");
      }
    }

    void loadSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isSettingsOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSettingsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsOpen]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const saveOutputDirectory = useCallback(async (nextOutputDirectory: string | null) => {
    setSettingsStatus("saving");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outputDirectory: nextOutputDirectory }),
      });
      const data = (await res.json()) as {
        outputDirectory?: string;
        isDefaultOutputDirectory?: boolean;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "설정을 저장하지 못했습니다.");
      setOutputDirectory(data.outputDirectory || "");
      setIsDefaultOutputDirectory(Boolean(data.isDefaultOutputDirectory));
      setSettingsStatus("saved");
      window.setTimeout(() => setSettingsStatus("idle"), 1600);
    } catch {
      setSettingsStatus("failed");
    }
  }, []);

  const chooseOutputDirectory = useCallback(async () => {
    if (!window.xgen?.selectOutputDirectory) return;
    const selectedDirectory = await window.xgen.selectOutputDirectory();
    if (!selectedDirectory) return;
    await saveOutputDirectory(selectedDirectory);
  }, [saveOutputDirectory]);

  const resetOutputDirectory = useCallback(() => {
    void saveOutputDirectory(null);
  }, [saveOutputDirectory]);

  const connectedState = useMemo(() => {
    const isPromptConnected = edges.some((e) => e.target === "output-node" && e.source === "prompt-node");
    const isStyleConnected = edges.some((e) => e.target === "output-node" && e.source === "style-node");
    const isOutputSettingsConnected = edges.some(
      (e) => e.target === "output-node" && e.source === "output-settings-node",
    );

    const optionals = Object.fromEntries(
        OPTIONAL_NODE_KEYS.map((key) => {
        const config = OPTIONAL_NODE_CONFIG[key];
        const isConnected =
          key === "elementBoard"
            ? elementBoard.elements.some((element) => element.enabled !== false)
            : key === "imageMix"
              ? imageMixItems.some((item) => item.enabled !== false) &&
                edges.some((e) => e.target === "output-node" && e.source === config.id)
            : edges.some((e) => e.target === "output-node" && e.source === config.id);
        return [key, isConnected];
      }),
    ) as Record<OptionalNodeKey, boolean>;

    return {
      isPromptConnected,
      isStyleConnected,
      isOutputSettingsConnected,
      isRatioConnected: isOutputSettingsConnected,
      isResolutionConnected: isOutputSettingsConnected,
      ...optionals,
    };
  }, [edges, elementBoard.elements, imageMixItems]);

  const hasAnyConnection = useMemo(
    () =>
      connectedState.isPromptConnected ||
      connectedState.isStyleConnected ||
      connectedState.isOutputSettingsConnected ||
      OPTIONAL_NODE_KEYS.some((key) => connectedState[key]),
    [connectedState],
  );

  const activeCharacterReferencePrompt = useMemo(
    () => characterReferences.find((entry) => entry.id === activeCharacterReferenceId)?.prompt || "",
    [characterReferences, activeCharacterReferenceId],
  );
  const activeObjectReferencePrompt = useMemo(
    () => objectReferences.find((entry) => entry.id === activeObjectReferenceId)?.prompt || "",
    [objectReferences, activeObjectReferenceId],
  );
  const activeCharacterReferenceEntry = useMemo(
    () => characterReferences.find((entry) => entry.id === activeCharacterReferenceId) ?? null,
    [characterReferences, activeCharacterReferenceId],
  );
  const activeStyleEntry = useMemo(
    () => styles.find((styleEntry) => styleEntry.id === activeStyleId) ?? null,
    [styles, activeStyleId],
  );
  const activeCharacterReferenceImages = useMemo(
    () =>
      connectedState.characterReference &&
      activeCharacterReferenceEntry?.referenceMode === "image-reference" &&
      activeCharacterReferenceEntry.imageUrl?.trim()
        ? [{
            imageUrl: activeCharacterReferenceEntry.imageUrl.trim(),
            prompt: activeCharacterReferenceEntry.prompt.trim(),
            label: activeCharacterReferenceEntry.label || "캐릭터 참조",
            weight: normalizeStyleWeight(activeCharacterReferenceEntry.weight),
          }]
        : [],
    [activeCharacterReferenceEntry, connectedState.characterReference],
  );
  const activeStyleReferenceImages = useMemo(
    () =>
      connectedState.isStyleConnected && activeStyleEntry?.imageUrl?.trim()
        ? [{
            imageUrl: activeStyleEntry.imageUrl.trim(),
            prompt: activeStyleEntry.prompt.trim(),
            label: activeStyleEntry.label || "스타일 참조",
            weight: normalizeStyleWeight(activeStyleEntry.weight),
            mode: "style-only" as const,
          }]
        : [],
    [activeStyleEntry, connectedState.isStyleConnected],
  );
  const activeStyleReferenceSummary = useMemo(
    () =>
      connectedState.isStyleConnected && activeStyleEntry
        ? {
            label: activeStyleEntry.label || "스타일 참조",
            weight: normalizeStyleWeight(activeStyleEntry.weight),
            hasImage: Boolean(activeStyleEntry.imageUrl?.trim()),
          }
        : null,
    [activeStyleEntry, connectedState.isStyleConnected],
  );
  const enabledElementCount = useMemo(
    () => elementBoard.elements.filter((element) => element.enabled !== false).length,
    [elementBoard.elements],
  );
  const promptBriefSourceKey = useMemo(
    () =>
      JSON.stringify({
        prompt,
        activeStyleId,
        activeStyleWeight: activeStyleEntry?.weight || "medium",
        activeCharacterReferenceId,
        activeObjectReferenceId,
        ratio,
        resolution,
        composition,
        backgroundPrompt,
        constraints,
        mood,
        palette,
        cameraAngle,
        objectAngle,
        lighting,
        gesture,
        propsPrompt,
        detailLevel,
        elementIds: elementBoard.elements
          .filter((element) => element.enabled !== false)
          .map((element) => element.id),
        imageMixIds: imageMixItems
          .filter((item) => item.enabled !== false)
          .map((item) => `${item.id}:${item.role}:${item.weight}`),
        maskEdit: `${maskEdit.enabled}:${maskEdit.region}:${maskEdit.instruction}`,
        connectedState,
      }),
    [
      prompt,
      activeStyleId,
      activeStyleEntry,
      activeCharacterReferenceId,
      activeObjectReferenceId,
      ratio,
      resolution,
      composition,
      backgroundPrompt,
      constraints,
      mood,
      palette,
      cameraAngle,
      objectAngle,
      lighting,
      gesture,
      propsPrompt,
      detailLevel,
      elementBoard.elements,
      imageMixItems,
      maskEdit,
      connectedState,
    ],
  );
  const connectedImageMixItems = useMemo(
    () => (connectedState.imageMix ? imageMixItems.filter((item) => item.enabled !== false && item.imageUrl.trim()) : []),
    [connectedState.imageMix, imageMixItems],
  );
  const imageMixPrompt = useMemo(
    () => formatImageMixPrompt(connectedImageMixItems),
    [connectedImageMixItems],
  );
  const maskEditLayerReference = useMemo(
    () =>
      imageUrl && maskEdit.enabled && maskEdit.instruction.trim()
        ? {
            imageUrl,
            role: "composition" as ImageMixRole,
            weight: "high" as ImageMixWeight,
            prompt: formatMaskEditPrompt(maskEdit),
            label: "Generated image layer",
          }
        : null,
    [imageUrl, maskEdit],
  );
  const authoritativeNodeSettings = useMemo(() => {
    const settings: string[] = [];
    if (connectedState.isPromptConnected && prompt.trim()) settings.push(`Core prompt: ${prompt.trim()}`);
    if (connectedState.isStyleConnected && activeStyleEntry?.prompt?.trim()) settings.push(`Style reference: ${activeStyleEntry.prompt.trim()}`);
    if (connectedState.isStyleConnected && activeStyleEntry?.imageUrl?.trim()) {
      settings.push(`Style reference image: ${activeStyleEntry.label || "active style"} (${normalizeStyleWeight(activeStyleEntry.weight)} influence, style-only)`);
    }
    if (connectedState.characterReference && activeCharacterReferencePrompt.trim()) settings.push(`Character lock: ${activeCharacterReferencePrompt.trim()}`);
    if (activeCharacterReferenceImages.length) settings.push(`Character reference image: ${activeCharacterReferenceImages[0].label} (identity reference)`);
    if (connectedState.objectReference && activeObjectReferencePrompt.trim()) settings.push(`Object lock: ${activeObjectReferencePrompt.trim()}`);
    if (connectedState.isRatioConnected && ratio.trim()) settings.push(`Aspect ratio: ${ratio.trim()}`);
    if (connectedState.isResolutionConnected && resolution.trim()) settings.push(`Resolution: ${resolution.trim()}`);
    if (connectedState.composition && composition.trim()) settings.push(`Composition: ${composition.trim()}`);
    if (connectedState.background && backgroundPrompt.trim()) settings.push(`Background: ${backgroundPrompt.trim()}`);
    if (connectedState.constraints && constraints.trim()) settings.push(`Constraints: ${constraints.trim()}`);
    if (connectedState.mood && mood.trim()) settings.push(`Mood: ${mood.trim()}`);
    if (connectedState.palette && palette.trim()) settings.push(`Palette: ${palette.trim()}`);
    if (connectedState.cameraAngle && cameraAngle.trim()) settings.push(`Camera angle: ${cameraAngle.trim()}`);
    if (connectedState.objectAngle && objectAngle.trim()) settings.push(`Object orientation: ${objectAngle.trim()}`);
    if (connectedState.lighting && lighting.trim()) settings.push(`Lighting: ${lighting.trim()}`);
    if (connectedState.gesture && gesture.trim()) settings.push(`Gesture/expression: ${gesture.trim()}`);
    if (connectedState.props && propsPrompt.trim()) settings.push(`Props: ${propsPrompt.trim()}`);
    if (connectedState.detail && detailLevel.trim()) settings.push(`Detail density: ${detailLevel.trim()}`);
    if (connectedState.elementBoard && enabledElementCount > 0) settings.push(`Element board: ${enabledElementCount} enabled consistency elements`);
    if (connectedState.imageMix && connectedImageMixItems.length > 0) settings.push(`Image mix: ${connectedImageMixItems.length} role-weighted visual references`);
    if (imageUrl && maskEdit.enabled && maskEdit.instruction.trim()) settings.push(`Mask edit: ${maskEdit.region} region on the generated image layer`);
    return settings;
  }, [
    activeCharacterReferenceImages,
    activeCharacterReferencePrompt,
    activeObjectReferencePrompt,
    activeStyleEntry,
    backgroundPrompt,
    cameraAngle,
    composition,
    connectedImageMixItems,
    connectedState,
    constraints,
    detailLevel,
    enabledElementCount,
    gesture,
    imageUrl,
    lighting,
    maskEdit,
    mood,
    objectAngle,
    palette,
    prompt,
    propsPrompt,
    ratio,
    resolution,
  ]);
  const visibleEnglishPrompt = hasAnyConnection
    ? buildCompactExecutionPrompt({
        corePrompt: connectedState.isPromptConnected ? prompt : englishPrompt,
        settings: authoritativeNodeSettings,
        imageMixCount: connectedImageMixItems.length + (maskEditLayerReference ? 1 : 0),
        styleReferenceSummary: activeStyleReferenceSummary,
      })
    : "";
  const generationEnglishPrompt = visibleEnglishPrompt;
  const visibleKoreanPrompt = useMemo(() => {
    if (!hasAnyConnection) return "";

    const primaryLines: string[] = [];
    const detailLines: string[] = [];

    if (connectedState.isPromptConnected && prompt.trim()) {
      primaryLines.push(prompt.trim());
    }
    if (connectedState.isStyleConnected && activeStyleEntry?.label) {
      detailLines.push(`스타일 참조 이미지: ${activeStyleEntry.label}`);
      detailLines.push(`스타일 영향도: ${normalizeStyleWeight(activeStyleEntry.weight) === "strong" ? "강하게" : normalizeStyleWeight(activeStyleEntry.weight) === "subtle" ? "약하게" : "보통"}`);
      detailLines.push("스타일 전용 가드: 참조 이미지의 피사체/구도는 복사하지 않고 색, 질감, 조명, 마감감만 반영");
    }
    if (connectedState.characterReference && activeCharacterReferenceId) {
      const label = characterReferences.find((entry) => entry.id === activeCharacterReferenceId)?.label;
      detailLines.push(`캐릭터 참조: ${label || "선택된 참조"}`);
    }
    if (connectedState.objectReference && activeObjectReferenceId) {
      const label = objectReferences.find((entry) => entry.id === activeObjectReferenceId)?.label;
      detailLines.push(`오브젝트 참조: ${label || "선택된 참조"}`);
    }
    if (connectedState.isRatioConnected) detailLines.push(`비율: ${ratio}`);
    if (connectedState.isResolutionConnected) detailLines.push(`해상도: ${resolution}`);
    if (connectedState.composition && composition.trim()) detailLines.push(`구도: ${composition.trim()}`);
    if (connectedState.background && backgroundPrompt.trim()) detailLines.push(`배경: ${backgroundPrompt.trim()}`);
    if (connectedState.constraints && constraints.trim()) detailLines.push(`제한사항: ${constraints.trim()}`);
    if (connectedState.mood && mood.trim()) detailLines.push(`무드: ${mood.trim()}`);
    if (connectedState.palette && palette.trim()) detailLines.push(`팔레트: ${palette.trim()}`);
    if (connectedState.cameraAngle && cameraAngle.trim()) detailLines.push(`카메라 앵글: ${cameraAngle.trim()}`);
    if (connectedState.objectAngle && objectAngle.trim()) detailLines.push(`오브젝트 방향: ${objectAngle.trim()}`);
    if (connectedState.lighting && lighting.trim()) detailLines.push(`조명: ${lighting.trim()}`);
    if (connectedState.gesture && gesture.trim()) detailLines.push(`제스처: ${gesture.trim()}`);
    if (connectedState.props && propsPrompt.trim()) detailLines.push(`소품: ${propsPrompt.trim()}`);
    if (connectedState.detail && detailLevel.trim()) detailLines.push(`밀도: ${detailLevel.trim()}`);
    if (connectedState.elementBoard && enabledElementCount > 0) {
      detailLines.push(`앨리먼트 보드: ${enabledElementCount}개 요소 고정`);
    }
    if (connectedState.imageMix && connectedImageMixItems.length > 0) {
      detailLines.push(`이미지 믹스: ${connectedImageMixItems.length}개 참조를 역할별로 혼합`);
    }
    if (imageUrl && maskEdit.enabled && maskEdit.instruction.trim()) {
      detailLines.push(`마스크 편집: 생성 이미지 레이어의 ${maskEdit.region} 영역만 변경 - ${maskEdit.instruction.trim()}`);
      detailLines.push("마스크 밖 영역은 최대한 보존");
    }

    const automaticBrief = [...primaryLines, ...detailLines].join("\n");
    return koreanPrompt.trim() || automaticBrief || "연결된 노드를 기준으로 생성 브리프를 준비 중입니다.";
  }, [
    hasAnyConnection,
    connectedState,
    prompt,
    activeStyleEntry,
    activeCharacterReferenceId,
    characterReferences,
    activeObjectReferenceId,
    objectReferences,
    ratio,
    resolution,
    composition,
    backgroundPrompt,
    constraints,
    mood,
    palette,
    cameraAngle,
    objectAngle,
    lighting,
    gesture,
    propsPrompt,
    detailLevel,
    enabledElementCount,
    connectedImageMixItems,
    imageUrl,
    maskEdit,
    koreanPrompt,
  ]);

  useEffect(() => {
    if (skipNextBriefResetRef.current) {
      skipNextBriefResetRef.current = false;
      return;
    }
    setKoreanPrompt("");
  }, [promptBriefSourceKey]);

  const connectedElementSheetImages = useMemo(
    () =>
      connectedState.elementBoard
        ? elementBoard.elements
            .filter((element) => element.enabled !== false)
            .map((element) => element.sheetImageUrl)
            .filter((sheetImageUrl): sheetImageUrl is string => Boolean(sheetImageUrl?.trim()))
        : [],
    [connectedState.elementBoard, elementBoard.elements],
  );

  const composePromptFromNodes = useCallback(async () => {
    if (!hasAnyConnection || promptComposeStatus === "loading") return;

    setPromptComposeStatus("loading");
    setPromptComposeError("");

    try {
      const res = await fetch("/api/compose-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: connectedState.isPromptConnected ? prompt : "",
          style: connectedState.isStyleConnected ? (activeStyleEntry?.prompt || null) : null,
          characterReference: connectedState.characterReference ? activeCharacterReferencePrompt : null,
          objectReference: connectedState.objectReference ? activeObjectReferencePrompt : null,
          ratio: connectedState.isRatioConnected ? ratio : null,
          resolution: connectedState.isResolutionConnected ? resolution : null,
          composition: connectedState.composition ? composition : null,
          background: connectedState.background ? backgroundPrompt : null,
          constraints: connectedState.constraints ? constraints : null,
          mood: connectedState.mood ? mood : null,
          palette: connectedState.palette ? palette : null,
          cameraAngle: connectedState.cameraAngle ? cameraAngle : null,
          objectAngle: connectedState.objectAngle ? objectAngle : null,
          lighting: connectedState.lighting ? lighting : null,
          gesture: connectedState.gesture ? gesture : null,
          propsPrompt: connectedState.props ? propsPrompt : null,
          detailLevel: connectedState.detail ? detailLevel : null,
          imageMixPrompt: connectedState.imageMix ? imageMixPrompt : null,
        }),
      });

      const data = (await res.json()) as { optimizedPrompt?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error || "프롬프트 구성에 실패했습니다.");
      }

      setOptimizedPrompt(data.optimizedPrompt?.trim() || "");
      setOptimizedPromptEdited(false);
      setPromptComposeStatus("ready");
    } catch (composeError) {
      const message =
        composeError instanceof Error
          ? composeError.message
          : "프롬프트 구성에 실패했습니다.";
      setPromptComposeStatus("error");
      setPromptComposeError(message);
    }
  }, [
    activeCharacterReferencePrompt,
    activeObjectReferencePrompt,
    activeStyleEntry,
    backgroundPrompt,
    cameraAngle,
    composition,
    connectedState,
    constraints,
    detailLevel,
    gesture,
    hasAnyConnection,
    imageMixPrompt,
    lighting,
    mood,
    objectAngle,
    palette,
    prompt,
    promptComposeStatus,
    propsPrompt,
    ratio,
    resolution,
  ]);

  const updateOptimizedPrompt = useCallback((value: string) => {
    setOptimizedPrompt(value);
    setOptimizedPromptEdited(true);
    setPromptComposeError("");
    setPromptComposeStatus(value.trim() ? "ready" : "idle");
  }, []);

  const useOptimizedPromptForGeneration = useCallback(() => {
    const nextPrompt = optimizedPrompt.trim();
    if (!nextPrompt) return;
    setEnglishPrompt(nextPrompt);
    setOptimizedPrompt(nextPrompt);
    setOptimizedPromptEdited(false);
    setPromptComposeStatus("ready");
    setPromptComposeError("");
  }, [optimizedPrompt]);

  const requestKoreanPromptInBackground = useCallback(
    async (resultId: string, nextEnglishPrompt: string) => {
      if (!nextEnglishPrompt.trim()) return;

      try {
        const res = await fetch("/api/translate-korean", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ englishPrompt: nextEnglishPrompt }),
        });

        const data = (await res.json()) as { koreanPrompt?: string };
        if (typeof data.koreanPrompt !== "string") return;

        setGeneratedResults((prev) =>
          prev.map((result) =>
            result.id === resultId ? { ...result, koreanPrompt: data.koreanPrompt || "" } : result,
          ),
        );
        setKoreanPrompt((prev) => (prev ? prev : data.koreanPrompt || ""));
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  const requestTitleInBackground = useCallback(
    async (result: GeneratedResult) => {
      if (result.isTitleUserEdited) return;
      if (titleBackfillRequestedRef.current.has(result.id)) return;
      titleBackfillRequestedRef.current.add(result.id);

      try {
        const res = await fetch("/api/generate-title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: result.prompt,
            englishPrompt: result.englishPrompt,
            koreanPrompt: result.koreanPrompt,
          }),
        });

        const data = (await res.json()) as { title?: string };
        if (!data.title?.trim()) return;

        setGeneratedResults((prev) =>
          prev.map((entry) =>
            entry.id === result.id && !entry.isTitleUserEdited
              ? { ...entry, title: data.title!.trim() }
              : entry,
          ),
        );
        if (activeResultId === result.id && !isTitleUserEdited) {
          setEditorTitle(data.title.trim());
        }
      } catch (error) {
        console.error(error);
      }
    },
    [activeResultId, isTitleUserEdited],
  );

  const requestConsistencyInBackground = useCallback(
    async (resultId: string, nextImageUrl: string, nextPrompt: string) => {
      if (!nextImageUrl.trim()) return;

      setGeneratedResults((prev) =>
        prev.map((result) =>
          result.id === resultId ? { ...result, consistencyStatus: "pending" } : result,
        ),
      );

      try {
        const res = await fetch("/api/analyze-consistency", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: nextImageUrl, prompt: nextPrompt }),
        });
        const data = (await res.json()) as Partial<ConsistencyElements> & { error?: string };
        if (!res.ok) throw new Error(data.error || "일관성 앨리먼트 분석 실패");

        const consistency: ConsistencyElements = {
          character: typeof data.character === "string" ? data.character.trim() : "",
          object: typeof data.object === "string" ? data.object.trim() : "",
          style: typeof data.style === "string" ? data.style.trim() : "",
          composition: typeof data.composition === "string" ? data.composition.trim() : "",
          elements: Array.isArray(data.elements)
            ? data.elements
                .map((element, index) => normalizeElementBoardItem({ ...element, sheetStatus: "idle" }, index))
                .filter((element): element is ElementBoardItem => Boolean(element))
            : [],
          rules: Array.isArray(data.rules) ? data.rules.filter((rule): rule is string => typeof rule === "string") : [],
        };

        setGeneratedResults((prev) =>
          prev.map((result) =>
            result.id === resultId ? { ...result, consistency, consistencyStatus: "ready" } : result,
          ),
        );
      } catch (error) {
        console.error(error);
        setGeneratedResults((prev) =>
          prev.map((result) =>
            result.id === resultId ? { ...result, consistencyStatus: "failed" } : result,
          ),
        );
      }
    },
    [],
  );

  useEffect(() => {
    if (!hasAnyConnection) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsTranslating(true);
      try {
        const activeStyle = styles.find((styleEntry) => styleEntry.id === activeStyleId);
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: connectedState.isPromptConnected ? prompt : "",
            style: connectedState.isStyleConnected ? (activeStyle?.prompt || null) : null,
            characterReference: connectedState.characterReference ? activeCharacterReferencePrompt : null,
            objectReference: connectedState.objectReference ? activeObjectReferencePrompt : null,
            ratio: connectedState.isRatioConnected ? ratio : null,
            resolution: connectedState.isResolutionConnected ? resolution : null,
            composition: connectedState.composition ? composition : null,
            background: connectedState.background ? backgroundPrompt : null,
            constraints: connectedState.constraints ? constraints : null,
            mood: connectedState.mood ? mood : null,
            palette: connectedState.palette ? palette : null,
            cameraAngle: connectedState.cameraAngle ? cameraAngle : null,
            objectAngle: connectedState.objectAngle ? objectAngle : null,
            lighting: connectedState.lighting ? lighting : null,
            gesture: connectedState.gesture ? gesture : null,
            propsPrompt: connectedState.props ? propsPrompt : null,
            detailLevel: connectedState.detail ? detailLevel : null,
            imageMixPrompt: connectedState.imageMix ? imageMixPrompt : null,
          }),
          signal: controller.signal,
        });

        const data = (await res.json()) as { englishPrompt?: string };
        if (data.englishPrompt) {
          setEnglishPrompt(data.englishPrompt);
        }
      } catch (error: unknown) {
        if (!(error instanceof Error && error.name === "AbortError")) {
          console.error(error);
        }
      } finally {
        setIsTranslating(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [
    prompt,
    styles,
    activeStyleId,
    activeCharacterReferencePrompt,
    activeObjectReferencePrompt,
    ratio,
    resolution,
    composition,
    backgroundPrompt,
    constraints,
    mood,
    palette,
    cameraAngle,
    objectAngle,
    lighting,
    gesture,
    propsPrompt,
    detailLevel,
    imageMixPrompt,
    connectedState,
    hasAnyConnection,
  ]);

  const regenerateEnglishPromptFromBrief = useCallback(async () => {
    const nextBrief = visibleKoreanPrompt.trim();
    if (!nextBrief || isTranslating) return;

    const controller = new AbortController();
    setIsTranslating(true);
    setKoreanPrompt(nextBrief);
    try {
      const activeStyle = connectedState.isStyleConnected ? activeStyleEntry : null;
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: nextBrief,
          style: connectedState.isStyleConnected ? (activeStyle?.prompt || null) : null,
          characterReference: connectedState.characterReference ? activeCharacterReferencePrompt : null,
          objectReference: connectedState.objectReference ? activeObjectReferencePrompt : null,
          ratio: connectedState.isRatioConnected ? ratio : null,
          resolution: connectedState.isResolutionConnected ? resolution : null,
          composition: connectedState.composition ? composition : null,
          background: connectedState.background ? backgroundPrompt : null,
          constraints: connectedState.constraints ? constraints : null,
          mood: connectedState.mood ? mood : null,
          palette: connectedState.palette ? palette : null,
          cameraAngle: connectedState.cameraAngle ? cameraAngle : null,
          objectAngle: connectedState.objectAngle ? objectAngle : null,
          lighting: connectedState.lighting ? lighting : null,
          gesture: connectedState.gesture ? gesture : null,
          propsPrompt: connectedState.props ? propsPrompt : null,
          detailLevel: connectedState.detail ? detailLevel : null,
          imageMixPrompt: connectedState.imageMix ? imageMixPrompt : null,
        }),
        signal: controller.signal,
      });

      const data = (await res.json()) as { englishPrompt?: string };
      if (data.englishPrompt?.trim()) {
        setEnglishPrompt(data.englishPrompt.trim());
      }
    } catch (error: unknown) {
      if (!(error instanceof Error && error.name === "AbortError")) {
        console.error(error);
      }
    } finally {
      setIsTranslating(false);
    }
  }, [
    activeCharacterReferencePrompt,
    activeObjectReferencePrompt,
    activeStyleEntry,
    backgroundPrompt,
    cameraAngle,
    composition,
    connectedState,
    constraints,
    detailLevel,
    imageMixPrompt,
    gesture,
    isTranslating,
    lighting,
    mood,
    objectAngle,
    palette,
    propsPrompt,
    ratio,
    resolution,
    visibleKoreanPrompt,
  ]);

  useEffect(() => {
    const pendingResults = generatedResults.filter((result) => !result.isTitleUserEdited && isLegacyGeneratedTitle(result));
    if (pendingResults.length === 0) return;

    const timeoutId = window.setTimeout(() => {
      for (const result of pendingResults) {
        void requestTitleInBackground(result);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [generatedResults, requestTitleInBackground]);

  useEffect(() => {
    if (!isTranslating) {
      if (translateStartedAtRef.current !== null) {
        const elapsed = Math.max(1, Math.round((Date.now() - translateStartedAtRef.current) / 1000));
        setLastTranslateDurationSeconds(elapsed);
        setTranslateElapsedSeconds(0);
        translateStartedAtRef.current = null;
      }
      return;
    }

    translateStartedAtRef.current = Date.now();
    setTranslateElapsedSeconds(0);
    const intervalId = window.setInterval(() => {
      if (translateStartedAtRef.current === null) return;
      setTranslateElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - translateStartedAtRef.current) / 1000)),
      );
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isTranslating]);

  useEffect(() => {
    if (!isGenerating) {
      if (generateStartedAtRef.current !== null) {
        const elapsed = Math.max(1, Math.round((Date.now() - generateStartedAtRef.current) / 1000));
        setLastGenerateDurationSeconds(elapsed);
        setGenerateElapsedSeconds(0);
        generateStartedAtRef.current = null;
      }
      return;
    }

    generateStartedAtRef.current = Date.now();
    setGenerateElapsedSeconds(0);
    const intervalId = window.setInterval(() => {
      if (generateStartedAtRef.current === null) return;
      setGenerateElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - generateStartedAtRef.current) / 1000)),
      );
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isGenerating]);

  const handleGenerate = useCallback(async () => {
    const activeStyle = connectedState.isStyleConnected
      ? styles.find((styleEntry) => styleEntry.id === activeStyleId)
      : null;
    const effectivePrompt = connectedState.isPromptConnected ? prompt : "";
    const reviewedPrompt = optimizedPrompt.trim();
    const generationPromptForRequest = reviewedPrompt || generationEnglishPrompt;

    if ((!effectivePrompt.trim() && !activeStyle && !generationPromptForRequest.trim()) || isGenerating || isTranslating) return;

    setIsGenerating(true);
    setError(false);
    setGenerationErrorMessage("");
    setLastGenerationTokenUsage(null);
    setLastGenerationTokenUsageBreakdown([]);
    const generationStartedAt = Date.now();

    setNodes((prevNodes) => {
      const nextNodes = [...prevNodes];
      if (!nextNodes.some((node) => node.id === "canvas-node")) {
        nextNodes.push({ id: "canvas-node", type: "canvasNode", position: { x: 850, y: 150 }, data: {} });
      }
      if (!nextNodes.some((node) => node.id === "image-layer-node")) {
        nextNodes.push({ id: "image-layer-node", type: "imageLayerNode", position: { x: 1380, y: 150 }, data: {} });
      }
      if (!nextNodes.some((node) => node.id === "mask-edit-node")) {
        nextNodes.push({ id: "mask-edit-node", type: "maskEditNode", position: { x: 1740, y: 150 }, data: {} });
      }
      return nextNodes.length === prevNodes.length ? prevNodes : nextNodes;
    });

    setEdges((prevEdges) => {
      const nextEdges = [...prevEdges];
      if (!nextEdges.some((edge) => edge.id === "e-prompt-canvas")) {
        nextEdges.push({
          id: "e-prompt-canvas",
          source: "output-node",
          sourceHandle: "output-out",
          target: "canvas-node",
          targetHandle: "canvas-in",
          style: FLOW_OUTPUT_EDGE_STYLE,
          animated: false,
        });
      }
      if (!nextEdges.some((edge) => edge.id === "e-canvas-image-layer")) {
        nextEdges.push({
          id: "e-canvas-image-layer",
          source: "canvas-node",
          sourceHandle: "canvas-out",
          target: "image-layer-node",
          targetHandle: "layer-in",
          style: FLOW_OUTPUT_EDGE_STYLE,
        });
      }
      if (!nextEdges.some((edge) => edge.id === "e-image-layer-mask")) {
        nextEdges.push({
          id: "e-image-layer-mask",
          source: "image-layer-node",
          sourceHandle: "layer-out",
          target: "mask-edit-node",
          targetHandle: "mask-in",
          style: FLOW_OUTPUT_EDGE_STYLE,
        });
      }
      if (!nextEdges.some((edge) => edge.id === "e-mask-output")) {
        nextEdges.push({
          id: "e-mask-output",
          source: "mask-edit-node",
          sourceHandle: "mask-out",
          target: "output-node",
          targetHandle: "general-in",
          style: FLOW_OUTPUT_EDGE_STYLE,
        });
      }
      return nextEdges.length === prevEdges.length ? prevEdges : nextEdges;
    });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: effectivePrompt,
          style: activeStyle?.prompt || null,
          characterReference: connectedState.characterReference ? activeCharacterReferencePrompt : null,
          objectReference: connectedState.objectReference ? activeObjectReferencePrompt : null,
          ratio,
          resolution,
          composition: connectedState.composition ? composition : null,
          background: connectedState.background ? backgroundPrompt : null,
          constraints: connectedState.constraints ? constraints : null,
          mood: connectedState.mood ? mood : null,
          palette: connectedState.palette ? palette : null,
          cameraAngle: connectedState.cameraAngle ? cameraAngle : null,
          objectAngle: connectedState.objectAngle ? objectAngle : null,
          lighting: connectedState.lighting ? lighting : null,
          gesture: connectedState.gesture ? gesture : null,
          propsPrompt: connectedState.props ? propsPrompt : null,
          detailLevel: connectedState.detail ? detailLevel : null,
          prebuiltPrompt: generationPromptForRequest.trim() || null,
          elementSheetImages: connectedElementSheetImages,
          characterReferenceImages: activeCharacterReferenceImages,
          styleReferenceImages: activeStyleReferenceImages,
          imageMixImages: [
            ...connectedImageMixItems.map((item) => ({
              imageUrl: item.imageUrl,
              role: item.role,
              weight: item.weight,
              prompt: item.prompt,
              label: item.label,
            })),
            ...(maskEditLayerReference ? [maskEditLayerReference] : []),
          ],
        }),
      });

      const data = (await res.json()) as {
        url?: string;
        imagePath?: string;
        title?: string;
        englishPrompt?: string;
        koreanPrompt?: string;
        tokenUsage?: GenerationTokenUsage | null;
        tokenUsageBreakdown?: GenerationTokenUsageBreakdownItem[];
        error?: string;
      };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "이미지 생성 결과를 받지 못했습니다.");
      }

      setImageUrl(data.url);
      const snapshot = {
        ...captureCurrentSnapshot(data.url),
        englishPrompt: data.englishPrompt?.trim() || generationPromptForRequest,
        koreanPrompt: data.koreanPrompt?.trim() || visibleKoreanPrompt,
      };

      const resultId = `result-${Date.now()}`;
      const generatedTitle = data.title?.trim() || createFallbackDisplayTitle(snapshot.prompt, snapshot.englishPrompt, snapshot.koreanPrompt);
      const nextTitle = snapshot.isTitleUserEdited ? snapshot.title : generatedTitle;
      const generationDurationSeconds = Math.max(1, Math.round((Date.now() - generationStartedAt) / 1000));
      const tokenUsage = data.tokenUsage ?? null;
      const tokenUsageBreakdown = Array.isArray(data.tokenUsageBreakdown) ? data.tokenUsageBreakdown : [];
      setLastGenerationTokenUsage(tokenUsage);
      setLastGenerationTokenUsageBreakdown(tokenUsageBreakdown);
      setGeneratedResults((prev) => {
        const nextResult: GeneratedResult = {
          ...snapshot,
          id: resultId,
          title: nextTitle,
          createdAt: new Date().toISOString(),
          imagePath: data.imagePath,
          generationDurationSeconds,
          tokenUsage,
          tokenUsageBreakdown,
          consistencyStatus: "pending",
        };

        setActiveResultId(resultId);
        return [nextResult, ...prev];
      });
      setEditorTitle(nextTitle);
      void requestConsistencyInBackground(resultId, data.url, snapshot.englishPrompt);
      if (data.englishPrompt?.trim()) {
        setEnglishPrompt(data.englishPrompt.trim());
      }
      if (data.koreanPrompt?.trim()) {
        setKoreanPrompt(data.koreanPrompt.trim());
      } else if (visibleKoreanPrompt.trim()) {
        setKoreanPrompt(visibleKoreanPrompt.trim());
      }
    } catch (generationError) {
      const message =
        generationError instanceof Error
          ? generationError.message
          : "이미지 생성 중 알 수 없는 오류가 발생했습니다.";
      setError(true);
      setGenerationErrorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  }, [
    activeStyleId,
    activeCharacterReferencePrompt,
    activeObjectReferencePrompt,
    backgroundPrompt,
    captureCurrentSnapshot,
    composition,
    connectedState,
    connectedElementSheetImages,
    connectedImageMixItems,
    maskEditLayerReference,
    activeCharacterReferenceImages,
    activeStyleReferenceImages,
    constraints,
    detailLevel,
    gesture,
    generationEnglishPrompt,
    optimizedPrompt,
    isGenerating,
    isTranslating,
    lighting,
    mood,
    palette,
    prompt,
    propsPrompt,
    requestConsistencyInBackground,
    ratio,
    resolution,
    styles,
    cameraAngle,
    objectAngle,
    visibleKoreanPrompt,
  ]);

  const addOptionalNode = useCallback((key: OptionalNodeKey) => {
    const config = OPTIONAL_NODE_CONFIG[key];
    if (key === "elementBoard") return;
    setNodes((prev) => {
      if (prev.some((node) => node.id === config.id)) return prev;
      const position = findOptionalNodePosition(prev, config.type, config.position);
      return [...prev, { id: config.id, type: config.type, position, data: {} }];
    });
    setEdges((prev) => {
      if (prev.some((edge) => edge.id === config.edgeId)) return prev;
      return [
        ...prev,
        {
          id: config.edgeId,
          source: config.id,
          sourceHandle: config.sourceHandle,
          target: "output-node",
          targetHandle: "general-in",
          style: FLOW_INPUT_EDGE_STYLE,
        },
      ];
    });
  }, []);

  const removeOptionalNode = useCallback((key: OptionalNodeKey) => {
    const config = OPTIONAL_NODE_CONFIG[key];
    setNodes((prev) => prev.filter((node) => node.id !== config.id));
    setEdges((prev) => prev.filter((edge) => edge.source !== config.id && edge.target !== config.id));
  }, []);

  const openPreviewImage = useCallback((nextPreviewImageUrl: string) => {
    setPreviewPromptLanguage("en");
    setPreviewImageUrl(nextPreviewImageUrl);
  }, []);

  const deleteGeneratedResult = useCallback((resultId: string) => {
    setGeneratedResults((prev) => prev.filter((result) => result.id !== resultId));
    if (activeResultId === resultId) {
      setActiveResultId(null);
    }
  }, [activeResultId]);

  const generateElementSheet = useCallback(
    async (elementId: string) => {
      const element = elementBoard.elements.find((item) => item.id === elementId);
      if (!element || element.sheetStatus === "generating") return;

      setElementBoard((prev) => ({
        ...prev,
        elements: prev.elements.map((item) =>
          item.id === elementId ? { ...item, sheetStatus: "generating" } : item,
        ),
      }));

      try {
        const activeStylePrompt = styles.find((styleEntry) => styleEntry.id === activeStyleId)?.prompt || "";
        const res = await fetch("/api/generate-element-sheet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            element: {
              name: element.name,
              category: element.category,
              description: element.description,
            },
            sourceImage: imageUrl,
            sourcePrompt: visibleEnglishPrompt || englishPrompt || prompt,
            style: activeStylePrompt || elementBoard.style,
          }),
        });
        const data = (await res.json()) as { url?: string; prompt?: string; error?: string };
        if (!res.ok || !data.url) throw new Error(data.error || "앨리먼트 전개도 생성 실패");

        setElementBoard((prev) => ({
          ...prev,
          elements: prev.elements.map((item) =>
            item.id === elementId
              ? {
                  ...item,
                  sheetStatus: "ready",
                  sheetImageUrl: data.url,
                  sheetPrompt: data.prompt,
                  sheetGeneratedAt: new Date().toISOString(),
                }
              : item,
          ),
        }));
      } catch (error) {
        console.error(error);
        setElementBoard((prev) => ({
          ...prev,
          elements: prev.elements.map((item) =>
            item.id === elementId ? { ...item, sheetStatus: "failed" } : item,
          ),
        }));
      }
    },
    [activeStyleId, elementBoard, englishPrompt, imageUrl, prompt, styles, visibleEnglishPrompt],
  );

  const updateElementBoardItem = useCallback((elementId: string, patch: Partial<ElementBoardItem>) => {
    setElementBoard((prev) => ({
      ...prev,
      elements: prev.elements.map((element) =>
        element.id === elementId ? { ...element, ...patch } : element,
      ),
    }));
  }, []);

  const activeOptionalNodes = useMemo(
    () =>
      Object.fromEntries(
        OPTIONAL_NODE_KEYS.map((key) => [
          key,
          nodes.some((node) => node.id === OPTIONAL_NODE_CONFIG[key].id),
        ]),
      ) as Record<OptionalNodeKey, boolean>,
    [nodes],
  );
  const optionalNodeEntries = useMemo(
    () =>
      OPTIONAL_NODE_KEYS
        .filter((key) => key !== "elementBoard")
        .map((key) => ({ key, config: OPTIONAL_NODE_CONFIG[key], isActive: activeOptionalNodes[key] })),
    [activeOptionalNodes],
  );
  const availableOptionalNodeEntries = useMemo(
    () => optionalNodeEntries.filter((entry) => !entry.isActive),
    [optionalNodeEntries],
  );
  const addedOptionalNodeEntries = useMemo(
    () => optionalNodeEntries.filter((entry) => entry.isActive),
    [optionalNodeEntries],
  );

  useEffect(() => {
    const elementIds = new Set(elementBoard.elements.map((element) => element.id));
    const sheetElementIds = new Set(
      elementBoard.elements
        .filter((element) => Boolean(element.sheetImageUrl?.trim()))
        .map((element) => element.id),
    );

    queueMicrotask(() => {
      setNodes((prev) => {
        const canvasNode = prev.find((node) => node.id === "canvas-node");

        const filtered = prev.filter((node) => {
          if (node.id === OPTIONAL_NODE_CONFIG.elementBoard.id) return false;
          if (node.id.startsWith("element-item-")) {
            return elementIds.has(node.id.replace("element-item-", ""));
          }
          if (node.id.startsWith("element-canvas-")) {
            return sheetElementIds.has(node.id.replace("element-canvas-", ""));
          }
          return true;
        });

        const nextNodes = [...filtered];
        let changed = filtered.length !== prev.length;
        if (!canvasNode) return changed ? nextNodes : prev;

        elementBoard.elements.forEach((element, index) => {
          const elementNodeId = getElementNodeId(element.id);
          if (!nextNodes.some((node) => node.id === elementNodeId)) {
            changed = true;
            nextNodes.push({
              id: elementNodeId,
              type: "elementItemNode",
              position: {
                x: canvasNode.position.x + getNodeSize(canvasNode.type).width + 260,
                y: canvasNode.position.y + index * 210,
              },
              data: {},
            });
          }

          if (element.sheetImageUrl?.trim()) {
            const canvasNodeId = getElementCanvasNodeId(element.id);
            if (!nextNodes.some((node) => node.id === canvasNodeId)) {
              changed = true;
              nextNodes.push({
                id: canvasNodeId,
                type: "canvasNode",
                position: {
                  x: canvasNode.position.x + getNodeSize(canvasNode.type).width + 620,
                  y: canvasNode.position.y + index * 240,
                },
                data: {},
              });
            }
          }
        });

        return changed ? nextNodes : prev;
      });

      setEdges((prev) => {
        const filtered = prev.filter((edge) => {
          if (edge.source === OPTIONAL_NODE_CONFIG.elementBoard.id || edge.target === OPTIONAL_NODE_CONFIG.elementBoard.id) {
            return false;
          }
          if (edge.id.startsWith("e-canvas-element-item-")) {
            return elementIds.has(edge.target.replace("element-item-", ""));
          }
          if (edge.id.startsWith("e-element-item-canvas-")) {
            return sheetElementIds.has(edge.source.replace("element-item-", ""));
          }
          return true;
        });

        const nextEdges = [...filtered];
        let changed = filtered.length !== prev.length;
        elementBoard.elements.forEach((element) => {
          const elementNodeId = getElementNodeId(element.id);
          const canvasEdgeId = `e-canvas-element-item-${element.id}`;
          if (!nextEdges.some((edge) => edge.id === canvasEdgeId)) {
            changed = true;
            nextEdges.push({
              id: canvasEdgeId,
              source: "canvas-node",
              sourceHandle: "canvas-out",
              target: elementNodeId,
              targetHandle: "element-in",
              style: FLOW_OUTPUT_EDGE_STYLE,
            });
          }

          if (element.sheetImageUrl?.trim()) {
            const elementCanvasEdgeId = `e-element-item-canvas-${element.id}`;
            if (!nextEdges.some((edge) => edge.id === elementCanvasEdgeId)) {
              changed = true;
              nextEdges.push({
                id: elementCanvasEdgeId,
                source: elementNodeId,
                sourceHandle: "element-out",
                target: getElementCanvasNodeId(element.id),
                targetHandle: "canvas-in",
                style: FLOW_OUTPUT_EDGE_STYLE,
              });
            }
          }
        });

        return changed ? nextEdges : prev;
      });
    });
  }, [elementBoard.elements]);

  const nodeTypes = useMemo(
    () => ({
      promptNode: PromptNode,
      styleNode: StyleNode,
      referenceNode: ReferenceNode,
      imageMixNode: ImageMixNode,
      elementItemNode: ElementItemNode,
      outputSettingsNode: OutputSettingsNode,
      compositionNode: CompositionNode,
      backgroundNode: BackgroundNode,
      constraintNode: ConstraintNode,
      moodNode: MoodNode,
      paletteNode: PaletteNode,
      cameraAngleNode: CameraAngleNode,
      objectAngleNode: ObjectAngleNode,
      lightingNode: LightingNode,
      gestureNode: GestureNode,
      propsNode: PropsNode,
      detailNode: DetailNode,
      outputNode: OutputNode,
      canvasNode: CanvasNode,
      imageLayerNode: ImageLayerNode,
      maskEditNode: MaskEditNode,
    }),
    [],
  );

  const onNodesChange = useCallback((changes: NodeChange<FlowNode>[]) => {
    setNodes((prev) => applyNodeChanges(changes, prev));
  }, []);

  const onNodeDragStop = useCallback<OnNodeDrag<FlowNode>>(() => {
    if (!activeResultId) return;

    const nodePositions = getNodePositions(nodesRef.current);
    setGeneratedResults((prevResults) =>
      prevResults.map((result) =>
        result.id === activeResultId ? { ...result, nodePositions } : result,
      ),
    );
  }, [activeResultId]);

  const onEdgesChange = useCallback((changes: EdgeChange<FlowEdge>[]) => {
    setEdges((prev) => applyEdgeChanges(changes, prev));
  }, []);
  const onConnect = useCallback((params: Connection) => {
      let targetHandle = params.targetHandle;
      if (params.target === "output-node") targetHandle = "general-in";

      let style = FLOW_PENDING_EDGE_STYLE;
      if (params.target === "output-node") style = FLOW_INPUT_EDGE_STYLE;
      if (
        params.sourceHandle === "output-out" ||
        params.sourceHandle === "canvas-out" ||
        params.sourceHandle === "layer-out" ||
        params.sourceHandle === "mask-out" ||
        params.sourceHandle === "element-out"
      ) {
        style = FLOW_OUTPUT_EDGE_STYLE;
      }
      for (const key of OPTIONAL_NODE_KEYS) {
        if (params.sourceHandle === OPTIONAL_NODE_CONFIG[key].sourceHandle) {
          style = FLOW_INPUT_EDGE_STYLE;
        }
      }

      setEdges((prev) => {
        const filtered = prev.filter(
          (edge) => !(edge.source === params.source && edge.target === "output-node"),
        );
        return addEdge({ ...params, targetHandle, style }, filtered);
      });
    }, []);

  const finalNodes = useMemo(() => {
    return nodes.map((node) => {
      const baseData = node.data || {};
      if (node.id === "prompt-node") {
        return { ...node, data: { ...baseData, prompt, onChange: setPrompt } };
      }
      if (node.id === "style-node") {
        return { ...node, data: { ...baseData, styles, activeStyleId, setStyles, setActiveStyleId } };
      }
      if (node.id === "character-reference-node") {
        return {
          ...node,
          data: {
            ...baseData,
            kind: "character",
            references: characterReferences,
            activeReferenceId: activeCharacterReferenceId,
            setReferences: setCharacterReferences,
            setActiveReferenceId: setActiveCharacterReferenceId,
            onRemove: () => removeOptionalNode("characterReference"),
          },
        };
      }
      if (node.id === "object-reference-node") {
        return {
          ...node,
          data: {
            ...baseData,
            kind: "object",
            references: objectReferences,
            activeReferenceId: activeObjectReferenceId,
            setReferences: setObjectReferences,
            setActiveReferenceId: setActiveObjectReferenceId,
            onRemove: () => removeOptionalNode("objectReference"),
          },
        };
      }
      if (node.id === "image-mix-node") {
        return {
          ...node,
          data: {
            ...baseData,
            items: imageMixItems,
            setItems: setImageMixItems,
            onRemove: () => removeOptionalNode("imageMix"),
          },
        };
      }
      if (node.id === "output-settings-node") {
        return { ...node, data: { ...baseData, ratio, setRatio, resolution, setResolution } };
      }
      if (node.id === "composition-node") {
        return { ...node, data: { ...baseData, composition, setComposition, onRemove: () => removeOptionalNode("composition") } };
      }
      if (node.id === "background-node") {
        return { ...node, data: { ...baseData, backgroundPrompt, setBackgroundPrompt, onRemove: () => removeOptionalNode("background") } };
      }
      if (node.id === "constraint-node") {
        return { ...node, data: { ...baseData, constraints, setConstraints, onRemove: () => removeOptionalNode("constraints") } };
      }
      if (node.id === "mood-node") {
        return { ...node, data: { ...baseData, mood, setMood, onRemove: () => removeOptionalNode("mood") } };
      }
      if (node.id === "palette-node") {
        return { ...node, data: { ...baseData, palette, setPalette, onRemove: () => removeOptionalNode("palette") } };
      }
      if (node.id === "camera-angle-node") {
        return { ...node, data: { ...baseData, cameraAngle, setCameraAngle, onRemove: () => removeOptionalNode("cameraAngle") } };
      }
      if (node.id === "object-angle-node") {
        return { ...node, data: { ...baseData, objectAngle, setObjectAngle, onRemove: () => removeOptionalNode("objectAngle") } };
      }
      if (node.id === "lighting-node") {
        return { ...node, data: { ...baseData, lighting, setLighting, onRemove: () => removeOptionalNode("lighting") } };
      }
      if (node.id === "gesture-node") {
        return { ...node, data: { ...baseData, gesture, setGesture, onRemove: () => removeOptionalNode("gesture") } };
      }
      if (node.id === "props-node") {
        return { ...node, data: { ...baseData, propsPrompt, setPropsPrompt, onRemove: () => removeOptionalNode("props") } };
      }
      if (node.id === "detail-node") {
        return { ...node, data: { ...baseData, detailLevel, setDetailLevel, onRemove: () => removeOptionalNode("detail") } };
      }
      if (node.id.startsWith("element-item-")) {
        const elementId = node.id.replace("element-item-", "");
        const element = elementBoard.elements.find((item) => item.id === elementId);
        return {
          ...node,
          data: {
            ...baseData,
            name: element?.name,
            category: element?.category,
            description: element?.description,
            enabled: element?.enabled !== false,
            sheetStatus: element?.sheetStatus,
            onUpdate: (patch: Partial<ElementBoardItem>) => updateElementBoardItem(elementId, patch),
            onGenerateSheet: () => generateElementSheet(elementId),
          },
        };
      }
      if (node.id.startsWith("element-canvas-")) {
        const elementId = node.id.replace("element-canvas-", "");
        const element = elementBoard.elements.find((item) => item.id === elementId);
        return {
          ...node,
          data: {
            ...baseData,
            imageUrl: element?.sheetImageUrl ?? null,
            error: element?.sheetStatus === "failed",
            isGenerating: element?.sheetStatus === "generating",
            ratio: "1:1",
            title: "앨리먼트 캔버스",
            onPreviewImage: openPreviewImage,
          },
        };
      }
      if (node.id === "image-layer-node") {
        return {
          ...node,
          data: {
            ...baseData,
            imageUrl,
            title: "이미지 레이어",
            layerName: editorTitle || "Generated layer",
            onPreviewImage: openPreviewImage,
          },
        };
      }
      if (node.id === "mask-edit-node") {
        return {
          ...node,
          data: {
            ...baseData,
            settings: maskEdit,
            setSettings: setMaskEdit,
            sourceImageUrl: imageUrl,
            onGenerateMaskEdit: handleGenerate,
            isGenerating,
          },
        };
      }
      if (node.id === "output-node") {
        return {
          ...node,
          data: {
            ...baseData,
            prompt,
            ratio,
            resolution,
            englishPrompt: generationEnglishPrompt,
            koreanPrompt: visibleKoreanPrompt,
            setKoreanPrompt,
            onRegenerateEnglishPrompt: regenerateEnglishPromptFromBrief,
            isTranslating,
            translateElapsedLabel: formatDurationLabel(translateElapsedSeconds),
            lastTranslateDurationLabel: formatDurationLabel(lastTranslateDurationSeconds),
            optimizedPrompt,
            setOptimizedPrompt: updateOptimizedPrompt,
            optimizedPromptEdited,
            promptComposeStatus,
            promptComposeError,
            onComposePrompt: composePromptFromNodes,
            onUseOptimizedPrompt: useOptimizedPromptForGeneration,
            canComposePrompt: hasAnyConnection && !isGenerating,
            onGenerate: handleGenerate,
            canGenerate: !isTranslating && !!(optimizedPrompt.trim() || generationEnglishPrompt.trim()),
            isGenerating,
            generateElapsedLabel: formatDurationLabel(generateElapsedSeconds),
            lastGenerateDurationLabel: formatDurationLabel(lastGenerateDurationSeconds),
            styleReferenceSummary: activeStyleReferenceSummary,
          },
        };
      }
      if (node.id === "canvas-node") {
        return {
          ...node,
          data: {
            ...baseData,
            imageUrl,
            error,
            errorMessage: generationErrorMessage,
            isGenerating,
            ratio,
            title: "캔버스",
            generateElapsedLabel: formatDurationLabel(generateElapsedSeconds),
            lastGenerateDurationLabel: formatDurationLabel(lastGenerateDurationSeconds),
            tokenUsage: lastGenerationTokenUsage,
            tokenUsageBreakdown: lastGenerationTokenUsageBreakdown,
            onPreviewImage: openPreviewImage,
          },
        };
      }
      return node;
    });
  }, [
    nodes,
    prompt,
    styles,
    activeStyleId,
    characterReferences,
    activeCharacterReferenceId,
    objectReferences,
    activeObjectReferenceId,
    imageMixItems,
    elementBoard,
    editorTitle,
    generateElementSheet,
    updateElementBoardItem,
    ratio,
    resolution,
    composition,
    backgroundPrompt,
    constraints,
    mood,
    palette,
    cameraAngle,
    objectAngle,
    lighting,
    gesture,
    propsPrompt,
    detailLevel,
    isTranslating,
    handleGenerate,
    maskEdit,
    generationEnglishPrompt,
    optimizedPrompt,
    optimizedPromptEdited,
    promptComposeStatus,
    promptComposeError,
    composePromptFromNodes,
    updateOptimizedPrompt,
    useOptimizedPromptForGeneration,
    regenerateEnglishPromptFromBrief,
    isGenerating,
    hasAnyConnection,
    imageUrl,
    error,
    generationErrorMessage,
    openPreviewImage,
    removeOptionalNode,
    visibleKoreanPrompt,
    translateElapsedSeconds,
    lastTranslateDurationSeconds,
    generateElapsedSeconds,
    lastGenerateDurationSeconds,
    lastGenerationTokenUsage,
    lastGenerationTokenUsageBreakdown,
    activeStyleReferenceSummary,
  ]);

  const startNewGeneration = useCallback(() => {
    applySnapshotToEditor(DEFAULT_SNAPSHOT);
    setActiveResultId(null);
    setViewMode("editor");
  }, [applySnapshotToEditor]);

  const openResultInEditor = useCallback((result: GeneratedResult) => {
    applySnapshotToEditor(result);
    setActiveResultId(result.id);
    setViewMode("editor");
  }, [applySnapshotToEditor]);

  const activeResult = useMemo(
    () => generatedResults.find((result) => result.id === activeResultId) || null,
    [generatedResults, activeResultId],
  );
  const galleryColumns = useMemo(
    () => distributeResultsToColumns(generatedResults, galleryColumnCount),
    [generatedResults, galleryColumnCount],
  );
  const activePreviewResult = useMemo(
    () => {
      if (activeResult && (!previewImageUrl || activeResult.imageUrl === previewImageUrl)) return activeResult;
      return generatedResults.find((result) => result.imageUrl === previewImageUrl) || activeResult;
    },
    [activeResult, generatedResults, previewImageUrl],
  );

  const handleEditorTitleChange = useCallback(
    (nextTitle: string) => {
      setEditorTitle(nextTitle);
      setIsTitleUserEdited(true);
      if (!activeResultId) return;
      setGeneratedResults((prev) =>
        prev.map((result) =>
          result.id === activeResultId
            ? { ...result, title: nextTitle, isTitleUserEdited: true }
            : result,
        ),
      );
    },
    [activeResultId],
  );

  const previewTitle = useMemo(
    () => getPreviewTitle(activePreviewResult, prompt, visibleEnglishPrompt),
    [activePreviewResult, prompt, visibleEnglishPrompt],
  );

  const previewPrompt = useMemo(
    () => getPreviewPrompt(activePreviewResult, visibleEnglishPrompt),
    [activePreviewResult, visibleEnglishPrompt],
  );

  const previewKoreanPrompt = useMemo(
    () => getPreviewKoreanPrompt(activePreviewResult, visibleKoreanPrompt),
    [activePreviewResult, visibleKoreanPrompt],
  );
  const editorTitleInputSize = useMemo(() => {
    const titleLength = Array.from(editorTitle.trim() || "새 브랜드 이미지").length;
    return Math.min(Math.max(titleLength + 2, 10), 34);
  }, [editorTitle]);

  const activePreviewPrompt = (previewPromptLanguage === "ko" ? previewKoreanPrompt : previewPrompt) ?? "";
  const activePreviewConsistency = activePreviewResult?.consistency ?? emptyConsistency();
  const previewImagePath = activePreviewResult?.imagePath;
  const canUseNativeFileActions = Boolean(typeof window !== "undefined" && window.xgen && previewImagePath);
  const canAnalyzePreviewConsistency = Boolean(
    activePreviewResult?.id &&
    previewImageUrl &&
    activePreviewResult?.consistencyStatus !== "pending",
  );

  const handlePreviewPromptLanguageChange = useCallback(
    async (language: "ko" | "en") => {
      setPreviewPromptLanguage(language);

      if (language !== "ko") return;
      if (!previewImageUrl) return;
      if (!previewPrompt.trim()) return;
      if (previewKoreanPrompt.trim()) return;
      if (isPreviewKoreanPromptLoading) return;

      setIsPreviewKoreanPromptLoading(true);
      try {
        if (activePreviewResult?.id) {
          await requestKoreanPromptInBackground(activePreviewResult.id, previewPrompt);
          return;
        }

        const res = await fetch("/api/translate-korean", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ englishPrompt: previewPrompt }),
        });

        const data = (await res.json()) as { koreanPrompt?: string };
        if (typeof data.koreanPrompt === "string") {
          setKoreanPrompt(data.koreanPrompt);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsPreviewKoreanPromptLoading(false);
      }
    },
    [
      previewImageUrl,
      previewPrompt,
      previewKoreanPrompt,
      isPreviewKoreanPromptLoading,
      activePreviewResult,
      requestKoreanPromptInBackground,
    ],
  );

  const copyPreviewPrompt = useCallback(async () => {
    if (!activePreviewPrompt.trim()) return;
    try {
      await navigator.clipboard.writeText(activePreviewPrompt);
      setIsPreviewPromptCopied(true);
    } catch {
      setIsPreviewPromptCopied(false);
    }
  }, [activePreviewPrompt]);

  const downloadPreviewImage = useCallback(() => {
    if (!previewImageUrl) return;
    const a = document.createElement("a");
    a.href = previewImageUrl;
    a.download = `xgen-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsPreviewImageDownloaded(true);
  }, [previewImageUrl]);

  const showPreviewImageInFolder = useCallback(async () => {
    if (!previewImagePath || !window.xgen?.showItemInFolder) return;
    try {
      await window.xgen.showItemInFolder(previewImagePath);
      setIsPreviewImageDownloaded(true);
    } catch {
      setIsPreviewImageDownloaded(false);
    }
  }, [previewImagePath]);

  const openPreviewImageFile = useCallback(async () => {
    if (!previewImagePath || !window.xgen?.openPath) return;
    try {
      const result = await window.xgen.openPath(previewImagePath);
      setIsPreviewImageDownloaded(!result.error);
    } catch {
      setIsPreviewImageDownloaded(false);
    }
  }, [previewImagePath]);

  const analyzePreviewConsistency = useCallback(() => {
    if (!activePreviewResult?.id || !previewImageUrl) return;
    void requestConsistencyInBackground(activePreviewResult.id, previewImageUrl, previewPrompt);
  }, [activePreviewResult, previewImageUrl, previewPrompt, requestConsistencyInBackground]);

  const applyConsistencyAsReference = useCallback(
    (kind: "character" | "object" | "style") => {
      if (!previewImageUrl) return;
      const promptByKind = {
        character: activePreviewConsistency.character,
        object: activePreviewConsistency.object,
        style: activePreviewConsistency.style,
      };
      const nextPrompt = promptByKind[kind]?.trim();
      if (!nextPrompt) return;

      const entry = createReferenceEntryFromConsistency(kind, nextPrompt, previewImageUrl);
      if (kind === "character") {
        setCharacterReferences((prev) => [entry, ...prev]);
        setActiveCharacterReferenceId(entry.id);
        addOptionalNode("characterReference");
        return;
      }
      if (kind === "object") {
        setObjectReferences((prev) => [entry, ...prev]);
        setActiveObjectReferenceId(entry.id);
        addOptionalNode("objectReference");
        return;
      }

      setStyles((prev) => [entry, ...prev]);
      setActiveStyleId(entry.id);
    },
    [activePreviewConsistency, addOptionalNode, previewImageUrl],
  );

  const applyConsistencyAsElementBoard = useCallback(() => {
    if (!activePreviewResult?.consistency) return;
    setElementBoard(createElementBoardFromConsistency(activePreviewResult.consistency, objectAngle));
    setNodes((prev) => prev.filter((node) => node.id !== OPTIONAL_NODE_CONFIG.elementBoard.id));
    setEdges((prev) =>
      prev.filter(
        (edge) =>
          edge.source !== OPTIONAL_NODE_CONFIG.elementBoard.id &&
          edge.target !== OPTIONAL_NODE_CONFIG.elementBoard.id,
      ),
    );
  }, [activePreviewResult, objectAngle]);

  const applyAllConsistency = useCallback(() => {
    applyConsistencyAsReference("character");
    applyConsistencyAsReference("object");
    applyConsistencyAsReference("style");
    applyConsistencyAsElementBoard();
  }, [applyConsistencyAsElementBoard, applyConsistencyAsReference]);

  const galleryStats = useMemo(() => {
    const total = generatedResults.length;
    const recentResult = generatedResults[0] ?? null;
    const recentStyleCount = recentResult?.styles?.length ?? 0;
    const recentElementCount = recentResult
      ? normalizeElementBoard(recentResult.elementBoard).elements.length
      : 0;
    const generationDurations = generatedResults
      .map((result) => result.generationDurationSeconds)
      .filter((duration): duration is number => typeof duration === "number" && Number.isFinite(duration));
    const averageGenerationDuration =
      generationDurations.length > 0
        ? Math.round(generationDurations.reduce((sum, duration) => sum + duration, 0) / generationDurations.length)
        : null;

    return {
      total,
      recentStyleCount,
      recentElementCount,
      averageGenerationDurationLabel:
        averageGenerationDuration === null ? "기록 없음" : formatDurationLabel(averageGenerationDuration),
    };
  }, [generatedResults]);

  const canChooseOutputDirectory = Boolean(typeof window !== "undefined" && window.xgen?.selectOutputDirectory);
  const settingsModal = isSettingsOpen ? (
    <div className="settings-overlay" onClick={() => setIsSettingsOpen(false)}>
      <div className="settings-modal" role="dialog" aria-modal="true" aria-label="저장 설정" onClick={(event) => event.stopPropagation()}>
        <div className="settings-header">
          <div>
            <h2>저장 설정</h2>
            <p>새로 생성되는 이미지는 선택한 폴더에 이미지 파일로 저장됩니다.</p>
          </div>
          <button
            type="button"
            className="icon-toggle compact"
            onClick={() => setIsSettingsOpen(false)}
            aria-label="설정 닫기"
            title="설정 닫기"
          >
            <Check size={14} />
          </button>
        </div>

        <div className="settings-field">
          <div className="settings-field-label">
            <span>이미지 저장 폴더</span>
            <small>{isDefaultOutputDirectory ? "기본값" : "사용자 지정"}</small>
          </div>
          <div className="settings-path">{outputDirectory || "저장 폴더를 불러오는 중입니다."}</div>
          <div className="settings-actions">
            <button
              type="button"
              className="secondary-command"
              onClick={chooseOutputDirectory}
              disabled={!canChooseOutputDirectory || settingsStatus === "saving"}
            >
              <FolderOpen size={16} />
              폴더 선택
            </button>
            <button
              type="button"
              className="secondary-command"
              onClick={resetOutputDirectory}
              disabled={settingsStatus === "saving"}
            >
              기본값
            </button>
          </div>
          {!canChooseOutputDirectory && (
            <div className="settings-note">폴더 선택은 Electron 앱에서 사용할 수 있습니다.</div>
          )}
          <div className={`settings-status ${settingsStatus}`}>
            {settingsStatus === "saving"
              ? "저장 중"
              : settingsStatus === "saved"
                ? "저장됨"
                : settingsStatus === "failed"
                  ? "설정을 처리하지 못했습니다."
                  : " "}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  if (viewMode === "gallery") {
    return (
      <main className="studio-shell">
        <div className="studio-noise" aria-hidden="true" />
        <section className="studio-hero">
          <nav className="studio-topbar" aria-label="xGen 작업공간">
            <div className="brand-lockup">
              <div className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 44 44" focusable="false">
                  <rect x="5" y="5" width="34" height="34" rx="7.5" fill="currentColor" />
                  <path d="M16.2 16.2 27.8 27.8M27.8 16.2 16.2 27.8" />
                </svg>
              </div>
              <div>
                <div className="brand-name">xGen</div>
              </div>
            </div>

            <div className="studio-actions">
              <Link href="/xmark" className="secondary-command studio-action-plain">
                <Sparkles size={16} />
                xMark
              </Link>
              <span className="studio-action-divider" aria-hidden="true" />
              <Link
                href="/design-system"
                className="secondary-command studio-action-plain"
                title="xGen 디자인 시스템 문서"
                aria-label="xGen 디자인 시스템 문서 열기"
              >
                <PaletteIcon size={16} />
                디자인 시스템 문서
              </Link>
              <span className="studio-action-divider" aria-hidden="true" />
              <Link
                href="/guide"
                className="icon-toggle studio-action-plain"
                title="프로젝트 구조와 사용법"
                aria-label="프로젝트 구조와 사용법"
              >
                <Info size={16} />
              </Link>
              <span className="studio-action-divider" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="icon-toggle studio-action-plain"
                title="저장 설정"
                aria-label="저장 설정"
              >
                <Settings size={16} />
              </button>
              <span className="studio-action-divider" aria-hidden="true" />
              <button
                type="button"
                onClick={toggleTheme}
                className="icon-toggle studio-action-plain"
                title={theme === "dark" ? "라이트 테마로 전환" : "다크 테마로 전환"}
                aria-label={theme === "dark" ? "라이트 테마로 전환" : "다크 테마로 전환"}
              >
                {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>
          </nav>

          <div className="hero-grid info-grid">
            <div className="metrics-panel" aria-label="작업공간 요약">
              <div className="metric-card major">
                <strong>{galleryStats.total}</strong>
                <small>라이브러리</small>
              </div>
              <div className="metric-card">
                <strong>{galleryStats.recentStyleCount}</strong>
                <small>스타일</small>
              </div>
              <div className="metric-card">
                <strong>{galleryStats.recentElementCount}</strong>
                <small>앨리먼트</small>
              </div>
              <div className="metric-card">
                <strong>{galleryStats.averageGenerationDurationLabel}</strong>
                <small>이미지 생성 평균 속도</small>
              </div>
            </div>
          </div>
        </section>

        <section className="library-section" aria-label="생성 이미지 라이브러리">
          <div className="library-heading">
            <div>
              <h2>라이브러리</h2>
            </div>
            <div className="library-tools">
              <button type="button" onClick={startNewGeneration} className="primary-command">
                만들기
              </button>
            </div>
          </div>

          {generatedResults.length === 0 ? (
            <div className="empty-studio">
              <div className="empty-signal" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <h3>첫 번째 기준 이미지를 만드세요</h3>
              <p>생성 후 이 화면에서 이미지별 프롬프트, 스타일, 일관성 앨리먼트를 바로 재사용할 수 있습니다.</p>
              <button type="button" onClick={startNewGeneration} className="primary-command large">
                <Sparkles size={18} />
                이미지 생성
              </button>
            </div>
          ) : (
            <div
              className="gallery-masonry redesigned"
              style={{ "--gallery-column-count": galleryColumnCount } as CSSProperties}
            >
              {galleryColumns.map((column, columnIndex) => (
                <div className="gallery-masonry-column" key={`gallery-column-${columnIndex}`}>
                  {column.map(({ result, index }) => {
                    const status = result.consistencyStatus || "pending";
                    const title = getDisplayTitle(result);
                    const cardPrompt = result.koreanPrompt || getActiveStylePrompt(result) || result.englishPrompt;
                    const tokenSummary = formatTokenUsageSummary(result.tokenUsage);
                    return (
                      <div
                        key={result.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => openResultInEditor(result)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openResultInEditor(result);
                          }
                        }}
                        className="gallery-card studio-card"
                        style={{ animationDelay: `${Math.min(index, 10) * 55}ms` }}
                      >
                        <div className="gallery-card-media">
                          {result.imageUrl ? (
                            <Image
                              src={result.imageUrl}
                              alt={title}
                              width={900}
                              height={1200}
                              unoptimized
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              className="gallery-card-image"
                            />
                          ) : null}
                          <div className={`asset-status ${status}`}>
                            <span />
                            {status === "ready" ? "locked" : status === "failed" ? "retry" : "analyzing"}
                          </div>
                          <button
                            type="button"
                            className="gallery-card-delete"
                            title="이미지 삭제"
                            aria-label={`${title} 삭제`}
                            onClick={(event) => {
                              event.stopPropagation();
                              if (!window.confirm("이 이미지를 라이브러리에서 삭제할까요?")) return;
                              deleteGeneratedResult(result.id);
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="asset-data-strip">
                          <span>{result.ratio}</span>
                          <span>{result.resolution}</span>
                          <span>{result.elementBoard?.elements?.length || 0} elements</span>
                          {tokenSummary ? <span>{tokenSummary}</span> : null}
                        </div>
                        <div className="gallery-card-overlay">
                          <div className="gallery-card-copy">
                            <div className="gallery-card-title">{title}</div>
                            <div className="gallery-card-style">
                              {cardPrompt || "프롬프트 정보 없음"}
                            </div>
                          </div>
                          <div className="gallery-card-footer">
                            <div className="gallery-card-date">
                              {new Date(result.createdAt).toLocaleString("ko-KR")}
                            </div>
                            <div className="open-cue">
                              <Eye size={14} />
                              열기
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </section>
        {settingsModal}
      </main>
    );
  }

  return (
    <main className="editor-shell">
      <ReactFlow
        nodes={finalNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeDragStop={onNodeDragStop}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ type: "default", animated: false, style: FLOW_INPUT_EDGE_STYLE }}
        connectionLineStyle={FLOW_PENDING_EDGE_STYLE}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        colorMode={theme}
        ariaLabelConfig={FLOW_ARIA_LABELS}
      >
        <Background color="var(--border-node)" gap={24} size={1} />
      </ReactFlow>

      <div className="editor-topbar">
        <button
          onClick={() => setViewMode("gallery")}
          className="round-tool back-tool"
          title="결과 보드로 돌아가기"
          aria-label="결과 보드로 돌아가기"
        >
          <ArrowLeft size={16} />
        </button>
        <input
          className="editor-title-input"
          value={editorTitle}
          onChange={(event) => handleEditorTitleChange(event.target.value)}
          size={editorTitleInputSize}
          placeholder="새 브랜드 이미지"
          aria-label="이미지 캔버스 제목"
        />
      </div>

      <div className="editor-mode-toggle" aria-label="편집 모드 컨트롤">
        <Controls
          aria-label="캔버스 컨트롤"
          showInteractive={false}
          position="top-right"
          style={{
            position: "relative",
            top: "auto",
            right: "auto",
            margin: 0,
            display: "flex",
            flexDirection: "row",
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
          }}
        />
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "라이트 테마로 전환" : "다크 테마로 전환"}
          className="icon-toggle compact"
          aria-label={theme === "dark" ? "라이트 테마로 전환" : "다크 테마로 전환"}
        >
          {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="저장 설정"
          className="icon-toggle compact"
          aria-label="저장 설정"
        >
          <Settings size={14} />
        </button>
      </div>

      <div className="node-add-dock">
        <button
          type="button"
          className="node-add-trigger"
          onClick={() => setIsNodeAddMenuOpen((prev) => !prev)}
          aria-expanded={isNodeAddMenuOpen}
          aria-label="설정 노드 추가"
        >
          <Sparkles size={14} />
          <span>설정 노드</span>
          <strong>{availableOptionalNodeEntries.length}</strong>
        </button>

        {isNodeAddMenuOpen && (
          <div className="node-add-popover" role="menu" aria-label="설정 노드 추가">
            <div className="node-add-popover-header">
              <span>추가 가능</span>
              <small>{availableOptionalNodeEntries.length}</small>
            </div>

            <div className="node-add-list">
              {availableOptionalNodeEntries.length > 0 ? (
                availableOptionalNodeEntries.map(({ key, config }) => (
                  <button
                    key={key}
                    type="button"
                    role="menuitem"
                    className="nodrag optional-node-button node-add-option"
                    data-tip={config.description}
                    title={config.description}
                    onClick={() => {
                      addOptionalNode(key);
                      setIsNodeAddMenuOpen(false);
                    }}
                    style={{ "--node-accent": config.color } as CSSProperties}
                  >
                    <span>{config.label}</span>
                    <Plus size={14} />
                  </button>
                ))
              ) : (
                <div className="node-add-empty">모든 설정 노드가 추가되었습니다.</div>
              )}
            </div>

            {addedOptionalNodeEntries.length > 0 && (
              <div className="node-added-section">
                <div className="node-add-popover-header muted">
                  <span>추가됨</span>
                  <small>{addedOptionalNodeEntries.length}</small>
                </div>
                <div className="node-added-list">
                  {addedOptionalNodeEntries.map(({ key, config }) => (
                    <span key={key} className="node-added-chip">
                      {config.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {previewImageUrl && (
        <div
          className="preview-overlay"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div
            className="preview-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="preview-header">
              <div style={{ minWidth: 0 }}>
                <div className="preview-title">
                  {previewTitle}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setPreviewImageUrl(null)}
                  style={{
                    height: "36px",
                    padding: "0 14px",
                    borderRadius: "999px",
                    border: "1px solid var(--border-node)",
                    backgroundColor: "var(--bg-node-base)",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
            <div className="preview-body">
              <div className="preview-image-column">
                <div className="preview-image-stage">
                  <Image
                    src={previewImageUrl}
                    alt={previewTitle}
                    width={1800}
                    height={1800}
                    unoptimized
                    sizes="(max-width: 1200px) 100vw, 72vw"
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
              <aside
                className="preview-sidebar"
              >
                <div
                  className="preview-prompt-panel"
                  style={{
                    color: activePreviewPrompt.trim() ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  <div className="preview-language-toggle">
                    {(["ko", "en"] as const).map((language) => {
                      const isActive = previewPromptLanguage === language;
                      return (
                        <button
                          key={language}
                          type="button"
                          onClick={() => {
                            void handlePreviewPromptLanguageChange(language);
                          }}
                          style={{
                            height: "28px",
                            padding: "0 12px",
                            borderRadius: "999px",
                            border: "none",
                            backgroundColor: isActive ? "var(--bg-canvas)" : "transparent",
                            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {language === "ko" ? "한글" : "English"}
                        </button>
                      );
                    })}
                  </div>
                  {activePreviewPrompt.trim()
                    || (previewPromptLanguage === "ko"
                      ? (isPreviewKoreanPromptLoading ? "한글 프롬프트를 번역 중입니다." : "한글 프롬프트를 준비 중입니다.")
                      : "영문 프롬프트가 없습니다.")}
                </div>
                <div
                  className="preview-consistency-panel"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-primary)" }}>일관성 앨리먼트</span>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: activePreviewResult?.consistencyStatus === "ready" ? "var(--port-prompt)" : "var(--text-muted)" }}>
                      {activePreviewResult?.consistencyStatus === "pending"
                        ? "분석 중"
                        : activePreviewResult?.consistencyStatus === "failed"
                          ? "분석 실패"
                          : activePreviewResult?.consistencyStatus === "ready"
                            ? "준비됨"
                            : "없음"}
                    </span>
                  </div>
                  {activePreviewResult?.consistencyStatus === "pending" ? (
                    <div style={{ fontSize: "12px", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                      생성 이미지를 분석해 다음 생성에 재사용할 캐릭터, 오브젝트, 스타일 정보를 추출 중입니다.
                    </div>
                  ) : activePreviewResult?.consistency ? (
                    <>
                      {([
                        ["character", "캐릭터", activePreviewConsistency.character],
                        ["object", "오브젝트", activePreviewConsistency.object],
                        ["style", "스타일", activePreviewConsistency.style],
                        ["composition", "구도", activePreviewConsistency.composition],
                      ] as const).map((item) => {
                        const [key, label, value] = item;
                        if (!value.trim()) return null;
                        return (
                          <div key={key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</span>
                            <span style={{ fontSize: "11px", lineHeight: 1.55, color: "var(--text-primary)" }}>{value}</span>
                          </div>
                        );
                      })}
                      {activePreviewConsistency.rules.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.4 }}>규칙</span>
                          <span style={{ fontSize: "11px", lineHeight: 1.55, color: "var(--text-primary)" }}>
                            {activePreviewConsistency.rules.join(" · ")}
                          </span>
                        </div>
                      )}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                        <button type="button" onClick={() => applyConsistencyAsReference("character")} disabled={!activePreviewConsistency.character.trim()} style={{ height: 32, borderRadius: 999, border: "1px solid var(--border-node)", backgroundColor: "var(--bg-node-base)", color: activePreviewConsistency.character.trim() ? "var(--text-primary)" : "var(--text-muted)", fontSize: 11, fontWeight: 800, cursor: activePreviewConsistency.character.trim() ? "pointer" : "default" }}>캐릭터로 사용</button>
                        <button type="button" onClick={() => applyConsistencyAsReference("object")} disabled={!activePreviewConsistency.object.trim()} style={{ height: 32, borderRadius: 999, border: "1px solid var(--border-node)", backgroundColor: "var(--bg-node-base)", color: activePreviewConsistency.object.trim() ? "var(--text-primary)" : "var(--text-muted)", fontSize: 11, fontWeight: 800, cursor: activePreviewConsistency.object.trim() ? "pointer" : "default" }}>오브젝트로 사용</button>
                        <button type="button" onClick={() => applyConsistencyAsReference("style")} disabled={!activePreviewConsistency.style.trim()} style={{ height: 32, borderRadius: 999, border: "1px solid var(--border-node)", backgroundColor: "var(--bg-node-base)", color: activePreviewConsistency.style.trim() ? "var(--text-primary)" : "var(--text-muted)", fontSize: 11, fontWeight: 800, cursor: activePreviewConsistency.style.trim() ? "pointer" : "default" }}>스타일로 사용</button>
                        <button type="button" onClick={applyConsistencyAsElementBoard} style={{ height: 32, borderRadius: 999, border: "1px solid color-mix(in srgb, var(--port-element-board) 50%, var(--border-node))", backgroundColor: "color-mix(in srgb, var(--port-element-board) 12%, transparent)", color: "var(--text-primary)", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>보드로 사용</button>
                        <button type="button" onClick={applyAllConsistency} style={{ height: 32, borderRadius: 999, border: "1px solid color-mix(in srgb, var(--port-prompt) 50%, var(--border-node))", backgroundColor: "color-mix(in srgb, var(--port-prompt) 12%, transparent)", color: "var(--text-primary)", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>전체 적용</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "12px", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                        이 결과에는 아직 일관성 앨리먼트가 없습니다. 버튼을 눌러 기존 이미지에서도 앨리먼트를 생성할 수 있습니다.
                      </div>
                      <button
                        type="button"
                        onClick={analyzePreviewConsistency}
                        disabled={!canAnalyzePreviewConsistency}
                        style={{
                          height: 34,
                          borderRadius: 999,
                          border: "1px solid color-mix(in srgb, var(--port-prompt) 50%, var(--border-node))",
                          backgroundColor: canAnalyzePreviewConsistency ? "color-mix(in srgb, var(--port-prompt) 12%, transparent)" : "var(--bg-node-base)",
                          color: canAnalyzePreviewConsistency ? "var(--text-primary)" : "var(--text-muted)",
                          fontSize: 11,
                          fontWeight: 800,
                          cursor: canAnalyzePreviewConsistency ? "pointer" : "default",
                        }}
                      >
                        일관성 앨리먼트 생성
                      </button>
                    </>
                  )}
                  {activePreviewResult?.consistencyStatus === "failed" && (
                    <button
                      type="button"
                      onClick={analyzePreviewConsistency}
                      disabled={!canAnalyzePreviewConsistency}
                      style={{
                        height: 34,
                        borderRadius: 999,
                        border: "1px solid color-mix(in srgb, var(--port-prompt) 50%, var(--border-node))",
                        backgroundColor: "color-mix(in srgb, var(--port-prompt) 12%, transparent)",
                        color: "var(--text-primary)",
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      다시 생성
                    </button>
                  )}
                </div>
                <div className="preview-actions">
                  {canUseNativeFileActions ? (
                    <>
                      <button
                        type="button"
                        onClick={showPreviewImageInFolder}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          flex: 1,
                          height: "38px",
                          padding: "0 12px",
                          borderRadius: "999px",
                          border: "1px solid var(--border-node)",
                          backgroundColor: "var(--bg-node-base)",
                          color: "var(--text-primary)",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.18s ease",
                        }}
                      >
                        {isPreviewImageDownloaded ? <Check size={14} /> : <FolderOpen size={14} />}
                        Finder에서 보기
                      </button>
                      <button
                        type="button"
                        onClick={openPreviewImageFile}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          flex: 1,
                          height: "38px",
                          padding: "0 12px",
                          borderRadius: "999px",
                          border: "1px solid var(--border-node)",
                          backgroundColor: "var(--bg-node-base)",
                          color: "var(--text-primary)",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.18s ease",
                        }}
                      >
                        <ExternalLink size={14} />
                        이미지 열기
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={downloadPreviewImage}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        flex: 1,
                        height: "38px",
                        padding: "0 12px",
                        borderRadius: "999px",
                        border: "1px solid var(--border-node)",
                        backgroundColor: "var(--bg-node-base)",
                        color: "var(--text-primary)",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.18s ease",
                      }}
                    >
                      {isPreviewImageDownloaded ? <Check size={14} /> : <Download size={14} />}
                      이미지 다운로드
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={copyPreviewPrompt}
                    disabled={!activePreviewPrompt.trim()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      flex: 1,
                      height: "38px",
                      padding: "0 12px",
                      borderRadius: "999px",
                      border: "1px solid var(--border-node)",
                      backgroundColor: activePreviewPrompt.trim() ? "var(--bg-node-base)" : "var(--bg-canvas)",
                      color: activePreviewPrompt.trim() ? "var(--text-primary)" : "var(--text-muted)",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: activePreviewPrompt.trim() ? "pointer" : "default",
                      transition: "all 0.18s ease",
                    }}
                  >
                    {isPreviewPromptCopied ? <Check size={14} /> : <Copy size={14} />}
                    {isPreviewPromptCopied ? "복사됨" : "프롬프트 복사"}
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
      {settingsModal}
    </main>
  );
}
