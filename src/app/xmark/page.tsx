"use client";

import "@xyflow/react/dist/style.css";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import {
  ArrowLeft,
  Brain,
  Check,
  Download,
  FolderOpen,
  Grid3X3,
  Image as ImageIcon,
  ImagePlus,
  Layers3,
  Loader2,
  MessageSquareText,
  Network,
  RefreshCcw,
  Settings,
  Sparkles,
  Target,
  Workflow,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type ReferenceRole = "good" | "avoid" | "competitor" | "shape" | "mood" | "app-icon";
type XmarkMode = "explore" | "refine" | "usage-test";
type MemoryKey = "prefers" | "avoids" | "successfulPatterns" | "rejectedPatterns";

type ReferenceItem = {
  id: string;
  label: string;
  role: ReferenceRole;
  notes: string;
  imageUrl: string;
};

type XmarkResult = {
  id: string;
  mode: XmarkMode;
  url: string;
  imagePath?: string;
  prompt: string;
  title: string;
  createdAt: string;
};

type XmarkMemory = Record<MemoryKey, string[]>;

type XmarkWorkspaceDraft = {
  brandName: string;
  brandDescription: string;
  audience: string;
  personality: string;
  values: string;
  mustAvoid: string;
  metaphors: string;
  references: ReferenceItem[];
  memory: XmarkMemory;
  results: XmarkResult[];
  activeResultId: string | null;
  selectedConcept: string;
  nodes?: FlowNode[];
  edges?: FlowEdge[];
};

type FlowNode = Node<Record<string, unknown>, string>;
type FlowEdge = Edge;

const STORAGE_KEY = "xmark_workspace_v2";

const DEFAULT_MEMORY: XmarkMemory = {
  prefers: ["monochrome-first", "bold silhouette", "strong negative space"],
  avoids: ["generic sparkle-only mark", "robot/brain/camera metaphor", "thin decorative orbit"],
  successfulPatterns: ["connected elements converging into one memorable mark"],
  rejectedPatterns: [],
};

const DEFAULT_WORKSPACE: XmarkWorkspaceDraft = {
  brandName: "xGen",
  brandDescription: "Local AI image generation workspace built around a node-based canvas.",
  audience: "Designers, founders, and visual creators who need controlled image generation.",
  personality: "Precise, inventive, premium, calm, system-minded.",
  values: "Controlled creativity, modular visual thinking, reusable consistency, local ownership, fast iteration.",
  mustAvoid: "Generic AI sparkle, robot, brain, camera, brush, pencil, chat bubble, copied reference silhouettes.",
  metaphors: "Connected creative nodes, graph flowing into an image, aperture made from modules, reusable visual seed.",
  references: [],
  memory: DEFAULT_MEMORY,
  results: [],
  activeResultId: null,
  selectedConcept: "Strongest direction: connected creative nodes converging into one image core.",
};

const ROLE_LABEL: Record<ReferenceRole, string> = {
  good: "좋은 참조",
  avoid: "피할 참조",
  competitor: "경쟁사",
  shape: "형태",
  mood: "무드",
  "app-icon": "앱 아이콘",
};

const MODE_LABEL: Record<XmarkMode, string> = {
  explore: "탐색판",
  refine: "리파인",
  "usage-test": "사용성 테스트",
};

const initialNodes: FlowNode[] = [
  { id: "brand-brief-node", type: "brandBriefNode", position: { x: 40, y: 40 }, data: {} },
  { id: "reference-board-node", type: "referenceBoardNode", position: { x: 40, y: 390 }, data: {} },
  { id: "principles-node", type: "principlesNode", position: { x: 420, y: 40 }, data: {} },
  { id: "metaphor-node", type: "metaphorNode", position: { x: 420, y: 320 }, data: {} },
  { id: "memory-node", type: "memoryNode", position: { x: 420, y: 585 }, data: {} },
  { id: "xmark-output-node", type: "xmarkOutputNode", position: { x: 790, y: 150 }, data: {} },
  { id: "xmark-canvas-node", type: "xmarkCanvasNode", position: { x: 1240, y: 120 }, data: {} },
];

const initialEdges: FlowEdge[] = [
  { id: "e-brand-principles", source: "brand-brief-node", sourceHandle: "brand-out", target: "principles-node", targetHandle: "principles-in", style: { stroke: "var(--port-prompt)", strokeWidth: 3 } },
  { id: "e-ref-principles", source: "reference-board-node", sourceHandle: "reference-out", target: "principles-node", targetHandle: "principles-in", style: { stroke: "var(--port-image-mix)", strokeWidth: 3 } },
  { id: "e-principles-output", source: "principles-node", sourceHandle: "principles-out", target: "xmark-output-node", targetHandle: "xmark-in", style: { stroke: "var(--port-style)", strokeWidth: 3 } },
  { id: "e-metaphor-output", source: "metaphor-node", sourceHandle: "metaphor-out", target: "xmark-output-node", targetHandle: "xmark-in", style: { stroke: "var(--port-composition)", strokeWidth: 3 } },
  { id: "e-memory-output", source: "memory-node", sourceHandle: "memory-out", target: "xmark-output-node", targetHandle: "xmark-in", style: { stroke: "var(--port-element-board)", strokeWidth: 3 } },
  { id: "e-output-canvas", source: "xmark-output-node", sourceHandle: "xmark-out", target: "xmark-canvas-node", targetHandle: "canvas-in", style: { stroke: "var(--text-primary)", strokeWidth: 3 } },
];

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function memoryToPrompt(memory: XmarkMemory) {
  return [
    `Prefer: ${memory.prefers.join(", ") || "none yet"}`,
    `Avoid: ${memory.avoids.join(", ") || "none yet"}`,
    `Successful patterns: ${memory.successfulPatterns.join("; ") || "none yet"}`,
    `Rejected patterns: ${memory.rejectedPatterns.join("; ") || "none yet"}`,
  ].join("\n");
}

function loadWorkspaceDraft(): XmarkWorkspaceDraft {
  if (typeof window === "undefined") return DEFAULT_WORKSPACE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WORKSPACE;
    const parsed = JSON.parse(raw) as Partial<XmarkWorkspaceDraft>;
    return {
      ...DEFAULT_WORKSPACE,
      ...parsed,
      references: Array.isArray(parsed.references) ? parsed.references : [],
      memory: parsed.memory || DEFAULT_MEMORY,
      results: Array.isArray(parsed.results) ? parsed.results : [],
      nodes: Array.isArray(parsed.nodes) ? parsed.nodes : initialNodes,
      edges: Array.isArray(parsed.edges) ? parsed.edges : initialEdges,
    };
  } catch {
    return DEFAULT_WORKSPACE;
  }
}

const nodeFrameStyle = {
  backgroundColor: "color-mix(in srgb, var(--bg-node-base) 5%, transparent)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: "var(--ui-radius-xl)",
  border: "none",
  boxShadow: "var(--ui-shadow-node)",
  overflow: "hidden",
} satisfies CSSProperties;

const nodeHeaderStyle = {
  backgroundColor: "var(--bg-node-header)",
  padding: "var(--ui-space-8) var(--ui-space-12)",
  display: "flex",
  alignItems: "center",
  gap: "var(--ui-space-8)",
} satisfies CSSProperties;

const nodeTitleStyle = {
  fontSize: "var(--ui-type-xs-2-size)",
  fontWeight: 700,
  color: "var(--text-secondary)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
} satisfies CSSProperties;

const nodeBodyStyle = {
  padding: "var(--ui-space-12)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--ui-space-10)",
} satisfies CSSProperties;

const fieldLabelStyle = {
  color: "var(--text-secondary)",
  fontSize: "var(--ui-type-xs-size)",
  fontWeight: 850,
} satisfies CSSProperties;

const inputStyle = {
  width: "100%",
  minHeight: "var(--size-control-input-lg)",
  padding: "0 var(--ui-space-12)",
  border: "1px solid var(--border-node)",
  borderRadius: "var(--ui-space-8)",
  backgroundColor: "var(--bg-canvas)",
  color: "var(--text-primary)",
  font: "inherit",
  fontSize: "var(--ui-type-sm-6-size)",
  outline: "none",
} satisfies CSSProperties;

const textareaStyle = {
  ...inputStyle,
  minHeight: "76px",
  padding: "var(--ui-space-10) var(--ui-space-12)",
  lineHeight: 1.5,
  resize: "vertical",
} satisfies CSSProperties;

const chipStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "calc(var(--ui-space-unit) * 1.5)",
  minHeight: 30,
  padding: "0 var(--ui-space-10)",
  borderRadius: "var(--ui-radius-pill)",
  border: "1px solid var(--border-node)",
  backgroundColor: "var(--bg-canvas)",
  color: "var(--text-secondary)",
  fontSize: "var(--ui-type-xs-size)",
  fontWeight: 800,
} satisfies CSSProperties;

function PortHandle({
  id,
  type,
  position,
  color = "var(--text-primary)",
}: {
  id: string;
  type: "source" | "target";
  position: Position;
  color?: string;
}) {
  const isLeft = position === Position.Left;
  return (
    <>
      <Handle
        type={type}
        position={position}
        id={id}
        style={{
          background: "transparent",
          border: "none",
          width: "var(--size-port-dot)",
          height: "var(--size-port-dot)",
          left: isLeft ? "calc(var(--size-port-dot) / -2)" : undefined,
          right: isLeft ? undefined : "calc(var(--size-port-dot) / -2)",
          top: "calc(50% - var(--size-port-dot) / 2)",
          transform: "none",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: isLeft ? "calc(var(--size-port-dot) / -2)" : undefined,
          right: isLeft ? undefined : "calc(var(--size-port-dot) / -2)",
          top: "calc(50% - var(--size-port-dot) / 2)",
          width: "var(--size-port-dot)",
          height: "var(--size-port-dot)",
          borderRadius: "50%",
          background: color,
          border: "2px solid var(--bg-node-base)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function NodeFrame({
  width,
  icon,
  title,
  children,
  target,
  source,
  color,
}: {
  width: number;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  target?: string;
  source?: string;
  color?: string;
}) {
  return (
    <div style={{ ...nodeFrameStyle, width, position: "relative" }}>
      {target ? <PortHandle id={target} type="target" position={Position.Left} color={color} /> : null}
      {source ? <PortHandle id={source} type="source" position={Position.Right} color={color} /> : null}
      <div style={nodeHeaderStyle}>
        {icon}
        <span style={nodeTitleStyle}>{title}</span>
      </div>
      <div style={nodeBodyStyle}>{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="nodrag" style={{ display: "flex", flexDirection: "column", gap: "var(--ui-space-6)" }}>
      <span style={fieldLabelStyle}>{label}</span>
      {children}
    </label>
  );
}

function BrandBriefNode({ data }: { data: Record<string, unknown> }) {
  return (
    <NodeFrame width={320} icon={<MessageSquareText size={16} color="var(--text-secondary)" />} title="브랜드 브리프" source="brand-out" color="var(--port-prompt)">
      <Field label="브랜드 이름">
        <input className="nodrag" style={inputStyle} value={String(data.brandName || "")} onChange={(event) => (data.setBrandName as (value: string) => void)(event.target.value)} />
      </Field>
      <Field label="서비스 설명">
        <textarea className="nodrag" style={textareaStyle} value={String(data.brandDescription || "")} onChange={(event) => (data.setBrandDescription as (value: string) => void)(event.target.value)} />
      </Field>
      <Field label="대상 사용자">
        <textarea className="nodrag" style={textareaStyle} value={String(data.audience || "")} onChange={(event) => (data.setAudience as (value: string) => void)(event.target.value)} />
      </Field>
      <Field label="브랜드 성격">
        <textarea className="nodrag" style={textareaStyle} value={String(data.personality || "")} onChange={(event) => (data.setPersonality as (value: string) => void)(event.target.value)} />
      </Field>
    </NodeFrame>
  );
}

function ReferenceBoardNode({ data }: { data: Record<string, unknown> }) {
  const localFileInputRef = useRef<HTMLInputElement | null>(null);
  const references = data.references as ReferenceItem[];
  return (
    <NodeFrame width={320} icon={<ImagePlus size={16} color="var(--text-secondary)" />} title="레퍼런스 보드" source="reference-out" color="var(--port-image-mix)">
      <input
        ref={localFileInputRef}
        className="nodrag"
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(event) => void (data.handleReferenceFiles as (files: FileList | null) => Promise<void>)(event.target.files)}
      />
      <button type="button" className="secondary-command nodrag" onClick={() => localFileInputRef.current?.click()}>
        <ImagePlus size={15} />
        레퍼런스 추가
      </button>
      <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "var(--ui-type-xs-size)", lineHeight: 1.6 }}>
        이미지는 복사용이 아니라 단순성, 대비, 구조, 여백 원칙을 분석하기 위한 참조입니다.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-space-8)", maxHeight: 390, overflow: "auto" }}>
        {references.length === 0 ? (
          <div style={{ ...chipStyle, justifyContent: "flex-start", color: "var(--text-muted)" }}>참조 없음</div>
        ) : (
          references.map((reference) => (
            <div key={reference.id} style={{ display: "grid", gridTemplateColumns: "54px minmax(0, 1fr)", gap: "var(--ui-space-8)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={reference.imageUrl} alt={reference.label} style={{ width: 54, height: 54, objectFit: "cover", borderRadius: "var(--ui-space-8)", border: "1px solid var(--border-node)" }} />
              <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--ui-space-6)" }}>
                <input
                  className="nodrag"
                  style={{ ...inputStyle, minHeight: 32, fontSize: "var(--ui-type-xs-2-size)" }}
                  value={reference.label}
                  onChange={(event) => (data.updateReference as (id: string, patch: Partial<ReferenceItem>) => void)(reference.id, { label: event.target.value })}
                />
                <select
                  className="nodrag"
                  style={{ ...inputStyle, minHeight: 32, fontSize: "var(--ui-type-xs-2-size)" }}
                  value={reference.role}
                  onChange={(event) => (data.updateReference as (id: string, patch: Partial<ReferenceItem>) => void)(reference.id, { role: event.target.value as ReferenceRole })}
                >
                  {Object.entries(ROLE_LABEL).map(([role, label]) => (
                    <option key={role} value={role}>{label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="nodrag"
                  onClick={() => (data.deleteReference as (id: string) => void)(reference.id)}
                  style={{ ...chipStyle, width: "max-content", minHeight: 26, cursor: "pointer" }}
                >
                  <X size={11} />
                  제거
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </NodeFrame>
  );
}

function PrinciplesNode({ data }: { data: Record<string, unknown> }) {
  const references = data.references as ReferenceItem[];
  return (
    <NodeFrame width={300} icon={<Layers3 size={16} color="var(--text-secondary)" />} title="원칙 추출" target="principles-in" source="principles-out" color="var(--port-style)">
      {[
        "흑백 우선",
        "24px 식별성",
        "굵은 실루엣",
        "명확한 네거티브 스페이스",
        "벡터화 가능한 단순 기하",
        references.length > 0 ? `${references.length}개 참조에서 원칙만 반영` : "참조 추가 시 원칙 강화",
      ].map((item) => (
        <span key={item} style={{ ...chipStyle, justifyContent: "flex-start" }}>
          <Check size={12} />
          {item}
        </span>
      ))}
    </NodeFrame>
  );
}

function MetaphorNode({ data }: { data: Record<string, unknown> }) {
  return (
    <NodeFrame width={300} icon={<Network size={16} color="var(--text-secondary)" />} title="은유 / 제한" source="metaphor-out" color="var(--port-composition)">
      <Field label="핵심 가치">
        <textarea className="nodrag" style={textareaStyle} value={String(data.values || "")} onChange={(event) => (data.setValues as (value: string) => void)(event.target.value)} />
      </Field>
      <Field label="시각 은유">
        <textarea className="nodrag" style={textareaStyle} value={String(data.metaphors || "")} onChange={(event) => (data.setMetaphors as (value: string) => void)(event.target.value)} />
      </Field>
      <Field label="피해야 할 요소">
        <textarea className="nodrag" style={textareaStyle} value={String(data.mustAvoid || "")} onChange={(event) => (data.setMustAvoid as (value: string) => void)(event.target.value)} />
      </Field>
    </NodeFrame>
  );
}

function MemoryNode({ data }: { data: Record<string, unknown> }) {
  const memory = data.memory as XmarkMemory;
  const removeMemoryItem = data.removeMemoryItem as (key: MemoryKey, item: string) => void;
  const rows: { key: MemoryKey; label: string }[] = [
    { key: "prefers", label: "선호" },
    { key: "avoids", label: "회피" },
    { key: "successfulPatterns", label: "성공 패턴" },
    { key: "rejectedPatterns", label: "실패 패턴" },
  ];
  return (
    <NodeFrame width={300} icon={<Brain size={16} color="var(--text-secondary)" />} title="브랜드 메모리" source="memory-out" color="var(--port-element-board)">
      {rows.map((row) => (
        <div key={row.key} style={{ display: "flex", flexDirection: "column", gap: "var(--ui-space-6)" }}>
          <span style={fieldLabelStyle}>{row.label}</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ui-space-6)" }}>
            {memory[row.key].map((item) => (
              <button key={item} type="button" className="nodrag" onClick={() => removeMemoryItem(row.key, item)} style={{ ...chipStyle, cursor: "pointer" }}>
                {item}
                <X size={11} />
              </button>
            ))}
          </div>
        </div>
      ))}
    </NodeFrame>
  );
}

function XmarkOutputNode({ data }: { data: Record<string, unknown> }) {
  const canRefine = Boolean(data.activeResult);
  const isGenerating = Boolean(data.isGenerating);
  const status = String(data.status || "브리프와 참조를 연결한 뒤 탐색판을 생성하세요.");
  return (
    <NodeFrame width={370} icon={<Sparkles size={16} color="var(--text-secondary)" />} title="xMark 실행" target="xmark-in" source="xmark-out" color="var(--text-primary)">
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--ui-space-8)" }}>
        <button type="button" className="primary-command nodrag" onClick={() => (data.generate as (mode: XmarkMode) => Promise<void>)("explore")} disabled={isGenerating}>
          {isGenerating ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Grid3X3 size={16} />}
          탐색판 생성
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--ui-space-8)" }}>
          <button type="button" className="secondary-command nodrag" onClick={() => (data.generate as (mode: XmarkMode) => Promise<void>)("refine")} disabled={isGenerating || !canRefine} title={canRefine ? "선택 방향을 리파인합니다" : "탐색판 결과가 먼저 필요합니다"}>
            <RefreshCcw size={15} />
            리파인
          </button>
          <button type="button" className="secondary-command nodrag" onClick={() => (data.generate as (mode: XmarkMode) => Promise<void>)("usage-test")} disabled={isGenerating || !canRefine} title={canRefine ? "실사용 테스트 시트를 만듭니다" : "탐색판 결과가 먼저 필요합니다"}>
            <Target size={15} />
            테스트
          </button>
        </div>
      </div>
      <div style={{ minHeight: 76, border: "1px solid var(--border-node)", borderRadius: "var(--ui-space-10)", backgroundColor: "var(--bg-canvas)", padding: "var(--ui-space-10)", color: data.error ? "var(--port-constraint)" : "var(--text-secondary)", fontSize: "var(--ui-type-xs-2-size)", lineHeight: 1.6 }}>
        {String(data.error || status)}
      </div>
      <Field label="선택 방향 메모">
        <textarea className="nodrag" style={textareaStyle} value={String(data.selectedConcept || "")} onChange={(event) => (data.setSelectedConcept as (value: string) => void)(event.target.value)} />
      </Field>
      <button type="button" className="secondary-command nodrag" onClick={() => (data.addMemoryItem as (key: MemoryKey, value: string) => void)("prefers", String(data.selectedConcept || ""))}>
        <Check size={15} />
        현재 방향을 선호로 저장
      </button>
    </NodeFrame>
  );
}

function XmarkCanvasNode({ data }: { data: Record<string, unknown> }) {
  const activeResult = data.activeResult as XmarkResult | null;
  const results = data.results as XmarkResult[];
  const canUseNativeFileActions = Boolean(data.canUseNativeFileActions);
  return (
    <NodeFrame width={420} icon={<ImageIcon size={16} color="var(--text-secondary)" />} title="로고 결과" target="canvas-in" color="var(--text-primary)">
      <div style={{ width: "100%", aspectRatio: "1", border: "1px solid var(--border-node)", borderRadius: "var(--ui-radius-xl)", backgroundColor: "var(--bg-canvas)", overflow: "hidden", display: "grid", placeItems: "center", position: "relative" }}>
        {data.isGenerating ? (
          <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "grid", placeItems: "center", backgroundColor: "color-mix(in srgb, var(--bg-node-base) 82%, transparent)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--ui-space-8)", color: "var(--text-primary)", fontSize: "var(--ui-type-sm-6-size)", fontWeight: 800 }}>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              생성 중
            </span>
          </div>
        ) : null}
        {activeResult?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeResult.url} alt={activeResult.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--ui-space-10)", color: "var(--text-muted)", textAlign: "center" }}>
            <Workflow size={30} />
            <span style={{ fontSize: "var(--ui-type-sm-6-size)", lineHeight: 1.6 }}>탐색판 결과가<br />여기에 표시됩니다</span>
          </div>
        )}
      </div>
      {activeResult ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--ui-space-8)" }}>
          <button type="button" className="secondary-command nodrag" onClick={() => (data.downloadActive as () => void)()}>
            <Download size={15} />
            저장
          </button>
          <button type="button" className="secondary-command nodrag" disabled={!activeResult.imagePath || !canUseNativeFileActions} onClick={() => (data.showInFolder as () => Promise<void>)()}>
            <FolderOpen size={15} />
            폴더
          </button>
        </div>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-space-6)", maxHeight: 180, overflow: "auto" }}>
        {results.length === 0 ? (
          <span style={{ ...chipStyle, justifyContent: "flex-start" }}>결과 라이브러리 비어 있음</span>
        ) : (
          results.slice(0, 6).map((result) => (
            <button key={result.id} type="button" className="nodrag" onClick={() => (data.setActiveResultId as (id: string) => void)(result.id)} style={{ ...chipStyle, justifyContent: "space-between", cursor: "pointer", color: activeResult?.id === result.id ? "var(--text-primary)" : "var(--text-secondary)" }}>
              <span>{MODE_LABEL[result.mode]}</span>
              <span>{new Date(result.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</span>
            </button>
          ))
        )}
      </div>
    </NodeFrame>
  );
}

function XmarkPageInner() {
  const initialDraft = useMemo(() => loadWorkspaceDraft(), []);
  const [brandName, setBrandName] = useState(initialDraft.brandName);
  const [brandDescription, setBrandDescription] = useState(initialDraft.brandDescription);
  const [audience, setAudience] = useState(initialDraft.audience);
  const [personality, setPersonality] = useState(initialDraft.personality);
  const [values, setValues] = useState(initialDraft.values);
  const [mustAvoid, setMustAvoid] = useState(initialDraft.mustAvoid);
  const [metaphors, setMetaphors] = useState(initialDraft.metaphors);
  const [references, setReferences] = useState<ReferenceItem[]>(initialDraft.references);
  const [memory, setMemory] = useState<XmarkMemory>(initialDraft.memory);
  const [results, setResults] = useState<XmarkResult[]>(initialDraft.results);
  const [activeResultId, setActiveResultId] = useState<string | null>(initialDraft.activeResultId);
  const [selectedConcept, setSelectedConcept] = useState(initialDraft.selectedConcept);
  const [nodes, setNodes] = useState<FlowNode[]>(initialDraft.nodes || initialNodes);
  const [edges, setEdges] = useState<FlowEdge[]>(initialDraft.edges || initialEdges);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [canUseNativeFileActions] = useState(() => typeof window !== "undefined" && Boolean(window.xgen?.showItemInFolder));

  const activeResult = useMemo(
    () => results.find((result) => result.id === activeResultId) || results[0] || null,
    [activeResultId, results],
  );

  useEffect(() => {
    const payload: XmarkWorkspaceDraft = {
      brandName,
      brandDescription,
      audience,
      personality,
      values,
      mustAvoid,
      metaphors,
      references,
      memory,
      results,
      activeResultId,
      selectedConcept,
      nodes,
      edges,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Large reference data URLs can exceed localStorage; xMark keeps persistence best effort.
    }
  }, [activeResultId, audience, brandDescription, brandName, edges, memory, metaphors, mustAvoid, nodes, personality, references, results, selectedConcept, values]);

  const addMemoryItem = useCallback((key: MemoryKey, value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    setMemory((prev) => ({ ...prev, [key]: [...new Set([...prev[key], normalized])] }));
  }, []);

  const removeMemoryItem = useCallback((key: MemoryKey, value: string) => {
    setMemory((prev) => ({ ...prev, [key]: prev[key].filter((item) => item !== value) }));
  }, []);

  const handleReferenceFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    const nextItems: ReferenceItem[] = [];
    for (const file of Array.from(files).slice(0, 8)) {
      nextItems.push({
        id: uid("ref"),
        label: file.name.replace(/\.[^.]+$/, ""),
        role: "good",
        notes: "Analyze simplicity, contrast, geometry, negative space, and icon readability only.",
        imageUrl: await fileToDataUrl(file),
      });
    }
    setReferences((prev) => [...nextItems, ...prev].slice(0, 16));
  }, []);

  const updateReference = useCallback((id: string, patch: Partial<ReferenceItem>) => {
    setReferences((prev) => prev.map((reference) => (reference.id === id ? { ...reference, ...patch } : reference)));
  }, []);

  const deleteReference = useCallback((id: string) => {
    setReferences((prev) => prev.filter((reference) => reference.id !== id));
  }, []);

  const generate = useCallback(
    async (mode: XmarkMode) => {
      setIsGenerating(true);
      setError("");
      setStatus(mode === "explore" ? "탐색판 생성 중" : mode === "refine" ? "선택 방향 리파인 중" : "사용성 테스트 생성 중");
      try {
        const res = await fetch("/api/xmark/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            brandName,
            brandDescription,
            audience,
            personality,
            values,
            mustAvoid,
            metaphors,
            memory: memoryToPrompt(memory),
            selectedConcept,
            selectedImage: activeResult?.url,
            references,
          }),
        });
        const data = (await res.json()) as Partial<XmarkResult> & { error?: string };
        if (!res.ok || !data.url || !data.mode) throw new Error(data.error || "xMark 생성에 실패했습니다.");
        const result: XmarkResult = {
          id: uid("xmark-result"),
          mode: data.mode as XmarkMode,
          url: data.url,
          imagePath: data.imagePath,
          prompt: data.prompt || "",
          title: data.title || `${brandName} ${mode}`,
          createdAt: data.createdAt || new Date().toISOString(),
        };
        setResults((prev) => [result, ...prev]);
        setActiveResultId(result.id);
        addMemoryItem("successfulPatterns", `${MODE_LABEL[mode]}: ${selectedConcept}`);
        setStatus(`${MODE_LABEL[mode]} 완료`);
      } catch (generationError) {
        setError(generationError instanceof Error ? generationError.message : "xMark 생성에 실패했습니다.");
        setStatus("");
      } finally {
        setIsGenerating(false);
      }
    },
    [activeResult, addMemoryItem, audience, brandDescription, brandName, memory, metaphors, mustAvoid, personality, references, selectedConcept, values],
  );

  const downloadActive = useCallback(() => {
    if (!activeResult?.url) return;
    const a = document.createElement("a");
    a.href = activeResult.url;
    a.download = `${brandName || "xmark"}-${activeResult.mode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [activeResult, brandName]);

  const showInFolder = useCallback(async () => {
    if (!activeResult?.imagePath || !window.xgen?.showItemInFolder) return;
    await window.xgen.showItemInFolder(activeResult.imagePath);
  }, [activeResult]);

  const nodeTypes = useMemo(
    () => ({
      brandBriefNode: BrandBriefNode,
      referenceBoardNode: ReferenceBoardNode,
      principlesNode: PrinciplesNode,
      metaphorNode: MetaphorNode,
      memoryNode: MemoryNode,
      xmarkOutputNode: XmarkOutputNode,
      xmarkCanvasNode: XmarkCanvasNode,
    }),
    [],
  );

  const finalNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          brandName,
          setBrandName,
          brandDescription,
          setBrandDescription,
          audience,
          setAudience,
          personality,
          setPersonality,
          values,
          setValues,
          mustAvoid,
          setMustAvoid,
          metaphors,
          setMetaphors,
          references,
          handleReferenceFiles,
          updateReference,
          deleteReference,
          memory,
          addMemoryItem,
          removeMemoryItem,
          results,
          activeResult,
          activeResultId,
          setActiveResultId,
          selectedConcept,
          setSelectedConcept,
          generate,
          isGenerating,
          status,
          error,
          downloadActive,
          showInFolder,
          canUseNativeFileActions,
        },
      })),
    [
      activeResult,
      activeResultId,
      addMemoryItem,
      audience,
      brandDescription,
      brandName,
      canUseNativeFileActions,
      deleteReference,
      downloadActive,
      error,
      generate,
      handleReferenceFiles,
      isGenerating,
      memory,
      metaphors,
      mustAvoid,
      nodes,
      personality,
      references,
      removeMemoryItem,
      results,
      selectedConcept,
      showInFolder,
      status,
      updateReference,
      values,
    ],
  );

  const onNodesChange = useCallback((changes: NodeChange<FlowNode>[]) => setNodes((current) => applyNodeChanges(changes, current)), []);
  const onEdgesChange = useCallback((changes: EdgeChange<FlowEdge>[]) => setEdges((current) => applyEdgeChanges(changes, current)), []);
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((current) =>
        addEdge(
          {
            ...connection,
            style: { stroke: "var(--text-primary)", strokeWidth: 3 },
          },
          current,
        ),
      ),
    [],
  );

  return (
    <main className="editor-shell">
      <ReactFlow
        nodes={finalNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{ type: "default", animated: false, style: { strokeWidth: 3 } }}
        connectionLineStyle={{ stroke: "var(--text-tertiary)", strokeWidth: 3 }}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        minZoom={0.45}
        colorMode="dark"
      >
        <Background color="var(--border-node)" gap={24} size={1} />
      </ReactFlow>

      <div className="editor-topbar">
        <Link href="/" className="round-tool back-tool" title="xGen으로 돌아가기" aria-label="xGen으로 돌아가기">
          <ArrowLeft size={16} />
        </Link>
        <input className="editor-title-input" value="xMark · 로고 생성" readOnly size={16} aria-label="xMark 제목" />
      </div>

      <div className="editor-mode-toggle" aria-label="xMark controls">
        <Controls
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
        <button type="button" title="저장 설정은 xGen 홈에서 변경" className="icon-toggle compact" aria-label="저장 설정 안내">
          <Settings size={14} />
        </button>
      </div>

      <div className="node-add-dock">
        <div className="node-add-trigger" aria-label="xMark 작업 순서">
          <Sparkles size={14} />
          <span>브리프</span>
          <strong>1</strong>
        </div>
        <div className="node-add-trigger" aria-label="xMark 작업 순서">
          <ImagePlus size={14} />
          <span>참조</span>
          <strong>2</strong>
        </div>
        <div className="node-add-trigger" aria-label="xMark 작업 순서">
          <Grid3X3 size={14} />
          <span>탐색</span>
          <strong>3</strong>
        </div>
        <div className="node-add-trigger" aria-label="xMark 작업 순서">
          <RefreshCcw size={14} />
          <span>리파인</span>
          <strong>4</strong>
        </div>
        <div className="node-add-trigger" aria-label="xMark 작업 순서">
          <Target size={14} />
          <span>테스트</span>
          <strong>5</strong>
        </div>
      </div>
    </main>
  );
}

export default function XmarkPage() {
  return (
    <ReactFlowProvider>
      <XmarkPageInner />
    </ReactFlowProvider>
  );
}
