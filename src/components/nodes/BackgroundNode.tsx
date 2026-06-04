"use client";

import { Handle, Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import React, { useCallback, useMemo, useState } from "react";
import { Image as ImageIcon, RotateCcw, Trash2, X } from "lucide-react";

type EnvironmentKey = "pure" | "studio" | "workspace" | "interior" | "outdoor" | "urban" | "abstract";
type SurfaceKey = "none" | "tabletop" | "floor" | "wall" | "paper" | "fabric" | "concrete" | "metal" | "glass";
type DepthKey = "flat" | "shallow" | "medium" | "deep";
type DetailKey = "none" | "low" | "medium" | "high";
type TreatmentKey = "solid" | "gradient" | "blur" | "pattern" | "shadow" | "bokeh";
type CleanlinessKey = "clean" | "lived-in" | "curated-props" | "busy";

type BackgroundModel = {
  environment: EnvironmentKey;
  surface: SurfaceKey;
  depth: DepthKey;
  detail: DetailKey;
  treatment: TreatmentKey;
  cleanliness: CleanlinessKey;
  extra: string;
};

type EnvironmentPreset = {
  defaults: Omit<BackgroundModel, "environment" | "extra">;
  surfaces: SurfaceKey[];
  depths: DepthKey[];
  details: DetailKey[];
  treatments: TreatmentKey[];
  cleanliness: CleanlinessKey[];
};

type BackgroundNodeData = {
  backgroundPrompt: string;
  setBackgroundPrompt: (value: string) => void;
  onRemove: () => void;
};

const DEFAULT_BACKGROUND: BackgroundModel = {
  environment: "pure",
  surface: "none",
  depth: "flat",
  detail: "none",
  treatment: "solid",
  cleanliness: "clean",
  extra: "",
};

const LEGACY_STUDIO_BACKGROUND: BackgroundModel = {
  environment: "studio",
  surface: "floor",
  depth: "shallow",
  detail: "low",
  treatment: "shadow",
  cleanliness: "clean",
  extra: "keep generous negative space around the subject",
};

const LEGACY_WORKSPACE_BACKGROUND: BackgroundModel = {
  environment: "workspace",
  surface: "tabletop",
  depth: "medium",
  detail: "medium",
  treatment: "blur",
  cleanliness: "curated-props",
  extra: "include only a few quiet creative tools in the background",
};

const LEGACY_ABSTRACT_BACKGROUND: BackgroundModel = {
  environment: "abstract",
  surface: "none",
  depth: "shallow",
  detail: "low",
  treatment: "gradient",
  cleanliness: "clean",
  extra: "use subtle geometric atmosphere without distracting from the subject",
};

const ENVIRONMENT_LABEL: Record<EnvironmentKey, string> = {
  pure: "순백",
  studio: "스튜디오",
  workspace: "작업실",
  interior: "실내",
  outdoor: "야외",
  urban: "도시",
  abstract: "추상",
};

const SURFACE_LABEL: Record<SurfaceKey, string> = {
  none: "없음",
  tabletop: "테이블",
  floor: "바닥",
  wall: "벽",
  paper: "종이",
  fabric: "패브릭",
  concrete: "콘크리트",
  metal: "금속",
  glass: "유리",
};

const DEPTH_LABEL: Record<DepthKey, string> = {
  flat: "평면",
  shallow: "얕음",
  medium: "중간",
  deep: "깊음",
};

const DETAIL_LABEL: Record<DetailKey, string> = {
  none: "없음",
  low: "낮음",
  medium: "중간",
  high: "높음",
};

const TREATMENT_LABEL: Record<TreatmentKey, string> = {
  solid: "단색",
  gradient: "소프트",
  blur: "흐림",
  pattern: "패턴",
  shadow: "그림자",
  bokeh: "보케",
};

const CLEANLINESS_LABEL: Record<CleanlinessKey, string> = {
  clean: "깨끗함",
  "lived-in": "생활감",
  "curated-props": "소품",
  busy: "복잡함",
};

const ENVIRONMENT_PRESETS: Record<EnvironmentKey, EnvironmentPreset> = {
  pure: {
    defaults: { surface: "none", depth: "flat", detail: "none", treatment: "solid", cleanliness: "clean" },
    surfaces: ["none", "paper", "glass"],
    depths: ["flat", "shallow"],
    details: ["none", "low"],
    treatments: ["solid", "gradient", "shadow"],
    cleanliness: ["clean"],
  },
  studio: {
    defaults: { surface: "floor", depth: "shallow", detail: "low", treatment: "shadow", cleanliness: "clean" },
    surfaces: ["floor", "wall", "paper", "fabric", "tabletop"],
    depths: ["flat", "shallow", "medium"],
    details: ["none", "low", "medium"],
    treatments: ["solid", "gradient", "shadow", "blur"],
    cleanliness: ["clean", "curated-props"],
  },
  workspace: {
    defaults: { surface: "tabletop", depth: "medium", detail: "medium", treatment: "blur", cleanliness: "curated-props" },
    surfaces: ["tabletop", "paper", "fabric", "wall", "metal"],
    depths: ["shallow", "medium", "deep"],
    details: ["low", "medium", "high"],
    treatments: ["blur", "shadow", "bokeh"],
    cleanliness: ["clean", "lived-in", "curated-props"],
  },
  interior: {
    defaults: { surface: "floor", depth: "medium", detail: "medium", treatment: "blur", cleanliness: "clean" },
    surfaces: ["floor", "wall", "fabric", "tabletop", "glass"],
    depths: ["shallow", "medium", "deep"],
    details: ["low", "medium", "high"],
    treatments: ["blur", "shadow", "bokeh"],
    cleanliness: ["clean", "lived-in", "curated-props"],
  },
  outdoor: {
    defaults: { surface: "none", depth: "medium", detail: "low", treatment: "blur", cleanliness: "clean" },
    surfaces: ["none", "floor", "concrete", "tabletop"],
    depths: ["medium", "deep"],
    details: ["low", "medium"],
    treatments: ["blur", "bokeh", "shadow"],
    cleanliness: ["clean", "curated-props"],
  },
  urban: {
    defaults: { surface: "concrete", depth: "deep", detail: "medium", treatment: "blur", cleanliness: "clean" },
    surfaces: ["concrete", "metal", "glass", "wall", "floor"],
    depths: ["medium", "deep"],
    details: ["low", "medium", "high"],
    treatments: ["blur", "bokeh", "shadow", "pattern"],
    cleanliness: ["clean", "lived-in", "curated-props", "busy"],
  },
  abstract: {
    defaults: { surface: "none", depth: "shallow", detail: "low", treatment: "gradient", cleanliness: "clean" },
    surfaces: ["none", "paper", "glass", "metal"],
    depths: ["flat", "shallow", "medium"],
    details: ["none", "low", "medium"],
    treatments: ["gradient", "pattern", "solid", "shadow"],
    cleanliness: ["clean"],
  },
};

const ENVIRONMENT_PROMPT: Record<EnvironmentKey, string> = {
  pure: "pure white background with no environmental details",
  studio: "minimal warm studio environment with a matte off-white backdrop",
  workspace: "quiet creative workspace background",
  interior: "natural-light interior background",
  outdoor: "clean outdoor environment with restrained natural context",
  urban: "soft urban background with broad spatial context",
  abstract: "abstract brand-safe background with subtle geometric atmosphere",
};

const SURFACE_PROMPT: Record<SurfaceKey, string> = {
  none: "no visible surface, only clean negative space",
  tabletop: "light tabletop surface under the subject",
  floor: "simple floor plane with soft grounding",
  wall: "matte wall plane behind the subject",
  paper: "warm paper surface with very subtle fiber texture",
  fabric: "soft fabric surface with restrained texture",
  concrete: "light concrete surface with minimal texture",
  metal: "muted metal surface with soft reflections",
  glass: "subtle glass surface with controlled reflections",
};

const DEPTH_PROMPT: Record<DepthKey, string> = {
  flat: "flat background depth, graphic and simple",
  shallow: "shallow spatial depth with clean negative space",
  medium: "medium spatial depth, subject clearly separated from the background",
  deep: "deep spatial background, environment recedes behind the subject",
};

const DETAIL_PROMPT: Record<DetailKey, string> = {
  none: "no background props or secondary details",
  low: "low detail density with no distracting props",
  medium: "medium detail density with a few controlled contextual cues",
  high: "high detail density while keeping the subject dominant",
};

const TREATMENT_PROMPT: Record<TreatmentKey, string> = {
  solid: "solid clean background treatment",
  gradient: "soft tonal gradient treatment without decorative glare",
  blur: "softly blurred background treatment, subject remains dominant",
  pattern: "subtle low-contrast pattern treatment, no busy motifs",
  shadow: "background defined mainly by soft contact shadows",
  bokeh: "soft bokeh treatment with no readable lights or signs",
};

const CLEANLINESS_PROMPT: Record<CleanlinessKey, string> = {
  clean: "clean and uncluttered",
  "lived-in": "lightly lived-in but still organized",
  "curated-props": "a few curated props, restrained and purposeful",
  busy: "visually rich but still controlled, avoid chaotic clutter",
};

const nodeStyle = {
  backgroundColor: "color-mix(in srgb, var(--bg-node-base) 5%, transparent)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: "var(--ui-radius-xl)",
  border: "none",
  width: "340px",
  display: "flex",
  flexDirection: "column" as const,
  overflow: "hidden",
  boxShadow: "var(--ui-shadow-node)",
};

const headerStyle = {
  backgroundColor: "var(--bg-node-header)",
  padding: "var(--ui-space-8) var(--ui-space-12)",
  borderBottom: "none",
  display: "flex",
  alignItems: "center",
  gap: "var(--ui-space-8)",
};

const titleStyle = {
  fontSize: "var(--ui-type-xs-2-size)",
  fontWeight: 600 as const,
  color: "var(--text-secondary)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const bodyStyle = {
  padding: "var(--ui-space-12)",
  display: "flex",
  flexDirection: "column" as const,
  gap: "var(--ui-space-12)",
};

const chipStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "var(--bg-canvas)",
  padding: "var(--ui-space-4) calc(var(--ui-space-unit) * 1.5) var(--ui-space-4) var(--ui-space-10)",
  borderRadius: "var(--ui-radius-pill)",
  border: "1px solid var(--border-node)",
  gap: "calc(var(--ui-space-unit) * 1.5)",
};

function parseField(value: string, label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return value.match(new RegExp(`${escaped}:\\s*([^\\n.]+)`, "i"))?.[1]?.trim() || "";
}

function findKey<T extends string>(labels: Record<T, string>, value: string, fallback: T) {
  const normalized = value.toLowerCase();
  const match = (Object.keys(labels) as T[]).find((key) => normalized.includes(key) || normalized.includes(labels[key].toLowerCase()));
  return match || fallback;
}

function parseBackgroundPrompt(value: string): BackgroundModel {
  if (!value.trim()) return DEFAULT_BACKGROUND;

  const environmentField = parseField(value, "Environment");
  const surfaceField = parseField(value, "Surface");
  const depthField = parseField(value, "Depth");
  const detailField = parseField(value, "Detail density");
  const treatmentField = parseField(value, "Treatment");
  const cleanlinessField = parseField(value, "Cleanliness");
  const extra = parseField(value, "Additional direction");

  if (environmentField || surfaceField || depthField || detailField || treatmentField || cleanlinessField || extra) {
    return {
      environment: findKey(ENVIRONMENT_LABEL, environmentField, DEFAULT_BACKGROUND.environment),
      surface: findKey(SURFACE_LABEL, surfaceField, DEFAULT_BACKGROUND.surface),
      depth: findKey(DEPTH_LABEL, depthField, DEFAULT_BACKGROUND.depth),
      detail: findKey(DETAIL_LABEL, detailField, DEFAULT_BACKGROUND.detail),
      treatment: findKey(TREATMENT_LABEL, treatmentField, DEFAULT_BACKGROUND.treatment),
      cleanliness: findKey(CLEANLINESS_LABEL, cleanlinessField, DEFAULT_BACKGROUND.cleanliness),
      extra,
    };
  }

  const lower = value.toLowerCase();
  if (lower.includes("office") || lower.includes("workspace")) return LEGACY_WORKSPACE_BACKGROUND;
  if (lower.includes("outdoor")) return { ...DEFAULT_BACKGROUND, environment: "outdoor", depth: "medium", detail: "low", treatment: "blur" };
  if (lower.includes("studio") || lower.includes("minimal")) return LEGACY_STUDIO_BACKGROUND;
  if (lower.includes("abstract")) return LEGACY_ABSTRACT_BACKGROUND;
  return { ...DEFAULT_BACKGROUND, extra: value };
}

function formatBackgroundPrompt(model: BackgroundModel) {
  return [
    `Environment: ${model.environment}, ${ENVIRONMENT_PROMPT[model.environment]}.`,
    `Surface: ${model.surface}, ${SURFACE_PROMPT[model.surface]}.`,
    `Depth: ${model.depth}, ${DEPTH_PROMPT[model.depth]}.`,
    `Detail density: ${model.detail}, ${DETAIL_PROMPT[model.detail]}.`,
    `Treatment: ${model.treatment}, ${TREATMENT_PROMPT[model.treatment]}.`,
    `Cleanliness: ${model.cleanliness}, ${CLEANLINESS_PROMPT[model.cleanliness]}.`,
    "Safety: no readable text, logos, signage, clutter, or distracting busy patterns.",
    model.extra.trim() ? `Additional direction: ${model.extra.trim()}.` : "",
  ].filter(Boolean).join(" ");
}

function toControlItems<T extends string>(keys: T[], labels: Record<T, string>) {
  return keys.map((key) => ({ key, label: labels[key] }));
}

export function BackgroundNode({ id, data }: { id: string; data: BackgroundNodeData }) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const model = useMemo(() => parseBackgroundPrompt(data.backgroundPrompt), [data.backgroundPrompt]);
  const preset = ENVIRONMENT_PRESETS[model.environment];

  const connections = useNodeConnections({ handleType: "source", handleId: "background-out" });
  const isConnected = connections.length > 0;

  const updateModel = useCallback((patch: Partial<BackgroundModel>) => {
    data.setBackgroundPrompt(formatBackgroundPrompt({ ...model, ...patch }));
  }, [data, model]);

  const handleEnvironmentChange = useCallback((environment: EnvironmentKey) => {
    const nextPreset = ENVIRONMENT_PRESETS[environment];
    data.setBackgroundPrompt(formatBackgroundPrompt({
      ...model,
      ...nextPreset.defaults,
      environment,
      extra: model.extra,
    }));
  }, [data, model]);

  const handleDisconnect = () => {
    setEdges((eds) => eds.filter((e) => !(e.source === id && e.sourceHandle === "background-out")));
  };

  return (
    <div style={nodeStyle}>
      <div style={headerStyle}>
        <ImageIcon size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>배경</span>
        <button
          type="button"
          onClick={data.onRemove}
          className="nodrag"
          title="배경 노드 제거"
          style={{
            marginLeft: "auto",
            width: "var(--size-control-sm)",
            height: "var(--size-control-sm)",
            borderRadius: "var(--ui-radius-pill)",
            border: "none",
            backgroundColor: "transparent",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div style={bodyStyle}>
        <ControlGroup
          label="환경"
          items={(Object.keys(ENVIRONMENT_LABEL) as EnvironmentKey[]).map((key) => ({ key, label: ENVIRONMENT_LABEL[key] }))}
          activeKey={model.environment}
          onChange={(key) => handleEnvironmentChange(key as EnvironmentKey)}
        />

        <ControlGroup
          label="표면 프리셋"
          columns={3}
          items={toControlItems(preset.surfaces, SURFACE_LABEL)}
          activeKey={model.surface}
          onChange={(key) => updateModel({ surface: key as SurfaceKey })}
        />

        <ControlGroup
          label="공간 깊이"
          items={toControlItems(preset.depths, DEPTH_LABEL)}
          activeKey={model.depth}
          onChange={(key) => updateModel({ depth: key as DepthKey })}
        />

        <ControlGroup
          label="디테일"
          items={toControlItems(preset.details, DETAIL_LABEL)}
          activeKey={model.detail}
          onChange={(key) => updateModel({ detail: key as DetailKey })}
        />

        <ControlGroup
          label="처리 프리셋"
          columns={3}
          items={toControlItems(preset.treatments, TREATMENT_LABEL)}
          activeKey={model.treatment}
          onChange={(key) => updateModel({ treatment: key as TreatmentKey })}
        />

        <ControlGroup
          label="정돈감"
          items={toControlItems(preset.cleanliness, CLEANLINESS_LABEL)}
          activeKey={model.cleanliness}
          onChange={(key) => updateModel({ cleanliness: key as CleanlinessKey })}
        />

        <label className="nodrag" style={{ display: "flex", flexDirection: "column", gap: "var(--ui-space-6)" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "var(--ui-type-xs-size)", fontWeight: 850 }}>추가 배경 설명</span>
          <textarea
            value={model.extra}
            onChange={(event) => updateModel({ extra: event.target.value })}
            placeholder="예: 창가에서 들어오는 부드러운 빛, 소품은 최소화"
            style={{
              minHeight: 68,
              resize: "vertical",
              border: "1px solid var(--border-node)",
              borderRadius: "var(--ui-space-8)",
              backgroundColor: "var(--bg-canvas)",
              color: "var(--text-primary)",
              padding: "var(--ui-space-10)",
              font: "inherit",
              fontSize: "var(--ui-type-xs-2-size)",
              lineHeight: 1.5,
              outline: "none",
            }}
          />
        </label>

        <div style={{ border: "1px solid var(--border-node)", borderRadius: "var(--ui-space-10)", backgroundColor: "var(--bg-canvas)", padding: "var(--ui-space-10)", color: "var(--text-secondary)", fontSize: "var(--ui-type-xs-size)", lineHeight: 1.55 }}>
          {formatBackgroundPrompt(model)}
        </div>

        <button
          type="button"
          className="nodrag"
          onClick={() => data.setBackgroundPrompt(formatBackgroundPrompt(DEFAULT_BACKGROUND))}
          style={{
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--ui-space-6)",
            height: 30,
            padding: "0 var(--ui-space-10)",
            borderRadius: "var(--ui-radius-pill)",
            border: "1px solid var(--border-node)",
            backgroundColor: "var(--bg-canvas)",
            color: "var(--text-secondary)",
            fontSize: "var(--ui-type-xs-size)",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={12} />
          리셋
        </button>

        <NodeOutputChip
          colorVar="var(--port-background)"
          label="배경 출력"
          isConnected={isConnected}
          isHovered={isHovered}
          onHover={setIsHovered}
          onClick={isConnected ? handleDisconnect : undefined}
          handleId="background-out"
        />
      </div>
    </div>
  );
}

function ControlGroup({
  label,
  items,
  activeKey,
  onChange,
  columns = 4,
}: {
  label?: string;
  items: { key: string; label: string }[];
  activeKey: string;
  onChange: (key: string) => void;
  columns?: number;
}) {
  return (
    <div className="nodrag" style={{ display: "flex", flexDirection: "column", gap: "var(--ui-space-6)" }}>
      {label ? <span style={{ color: "var(--text-secondary)", fontSize: "var(--ui-type-xs-size)", fontWeight: 850 }}>{label}</span> : null}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: "calc(var(--ui-space-unit) * 1.5)" }}>
        {items.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              style={{
                minHeight: 30,
                borderRadius: "var(--ui-radius-pill)",
                border: `1px solid ${isActive ? "var(--port-background)" : "var(--border-node)"}`,
                backgroundColor: isActive
                  ? "color-mix(in srgb, var(--port-background) 14%, transparent)"
                  : "var(--bg-canvas)",
                color: isActive ? "var(--port-background)" : "var(--text-secondary)",
                fontSize: "var(--ui-type-xs-size)",
                fontWeight: 800,
                cursor: "pointer",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NodeOutputChip({
  colorVar,
  label,
  isConnected,
  isHovered,
  onHover,
  onClick,
  handleId,
}: {
  colorVar: string;
  label: string;
  isConnected: boolean;
  isHovered: boolean;
  onHover: (value: boolean) => void;
  onClick?: () => void;
  handleId: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div
        style={{
          ...chipStyle,
          backgroundColor: isConnected
            ? (isHovered ? `color-mix(in srgb, ${colorVar} 25%, transparent)` : `color-mix(in srgb, ${colorVar} 15%, transparent)`)
            : (isHovered ? `color-mix(in srgb, ${colorVar} 10%, var(--bg-canvas))` : "var(--bg-canvas)"),
          borderColor: isConnected ? colorVar : (isHovered ? colorVar : "var(--border-node)"),
          cursor: isConnected ? "pointer" : "crosshair",
          transition: "all 0.2s ease",
          position: "relative" as const,
        }}
        className="nodrag"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onClick={onClick}
      >
        <span style={{ fontSize: "var(--ui-type-xs-size)", fontWeight: 700, color: isConnected ? colorVar : "var(--text-secondary)", textTransform: "uppercase" as const, letterSpacing: "0.3px", pointerEvents: "none", zIndex: 1, position: "relative" as const }}>
          {isConnected && isHovered ? "연결 해제" : label}
        </span>

        <div style={{ width: "var(--size-port-dot)", height: "var(--size-port-dot)", position: "relative" as const, zIndex: 1 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: isConnected && isHovered ? "var(--bg-node-base)" : colorVar, border: isConnected && isHovered ? `1px solid ${colorVar}` : "2px solid var(--bg-node-base)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
            {isConnected && isHovered && <X size={8} color={colorVar} strokeWidth={4} />}
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Right}
          id={handleId}
          isConnectable={true}
          style={{
            ...(isConnected
              ? { width: "var(--size-port-dot)", height: "var(--size-port-dot)", right: "calc(var(--size-port-dot) / 2)", top: "calc(50% - var(--size-port-dot) / 2)", transform: "none", pointerEvents: "none", background: "transparent", border: "none" }
              : { position: "absolute", inset: 0, width: "100%", height: "100%", background: "transparent", border: "none", opacity: 0, zIndex: 10, cursor: "crosshair", pointerEvents: "auto", transform: "none", right: "auto", top: "auto" }),
          }}
        />
      </div>
    </div>
  );
}
