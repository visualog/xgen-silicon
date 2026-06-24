"use client";

import { Handle, Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import React, { useCallback, useMemo, useState } from "react";
import { Check, Image as ImageIcon, Plus, RotateCcw, SlidersHorizontal, Trash2, X } from "lucide-react";
import { StyleAddModal } from "@/components/StyleAddModal";
import type { StyleEntry } from "@/components/StyleAddModal";

type BackgroundRecipeKey = "icon-studio" | "product-studio" | "brand-graphic" | "lifestyle-interior" | "desk-workspace" | "abstract-campaign" | "outdoor-natural" | "urban-architecture";
type EnvironmentKey = "pure" | "studio" | "workspace" | "interior" | "outdoor" | "urban" | "abstract";
type SurfaceKey = "none" | "tabletop" | "floor" | "wall" | "paper" | "fabric" | "concrete" | "metal" | "glass";
type DepthKey = "flat" | "shallow" | "medium" | "deep";
type DetailKey = "none" | "low" | "medium" | "high";
type TreatmentKey = "solid" | "gradient" | "blur" | "pattern" | "shadow" | "bokeh";
type CleanlinessKey = "clean" | "lived-in" | "curated-props" | "busy";
type ChildPresetKey = "surface" | "depth" | "detail" | "treatment" | "cleanliness";

type BackgroundModel = {
  recipe: BackgroundRecipeKey;
  environment: EnvironmentKey;
  surface: SurfaceKey;
  depth: DepthKey;
  detail: DetailKey;
  treatment: TreatmentKey;
  cleanliness: CleanlinessKey;
  extra: string;
};

type EnvironmentPreset = {
  defaults: Omit<BackgroundModel, "recipe" | "environment" | "extra">;
  surfaces: SurfaceKey[];
  depths: DepthKey[];
  details: DetailKey[];
  treatments: TreatmentKey[];
  cleanliness: CleanlinessKey[];
};

export type BackgroundReferenceItem = Omit<StyleEntry, "weight"> & {
  weight: "low" | "medium" | "high";
  enabled?: boolean;
};

type BackgroundNodeData = {
  backgroundPrompt: string;
  setBackgroundPrompt: (value: string) => void;
  backgroundReferences: BackgroundReferenceItem[];
  setBackgroundReferences: React.Dispatch<React.SetStateAction<BackgroundReferenceItem[]>>;
  onRemove: () => void;
};

const DEFAULT_BACKGROUND: BackgroundModel = {
  recipe: "icon-studio",
  environment: "pure",
  surface: "none",
  depth: "flat",
  detail: "none",
  treatment: "solid",
  cleanliness: "clean",
  extra: "",
};

const LEGACY_STUDIO_BACKGROUND: BackgroundModel = {
  recipe: "product-studio",
  environment: "studio",
  surface: "floor",
  depth: "shallow",
  detail: "low",
  treatment: "shadow",
  cleanliness: "clean",
  extra: "keep generous negative space around the subject",
};

const LEGACY_WORKSPACE_BACKGROUND: BackgroundModel = {
  recipe: "desk-workspace",
  environment: "workspace",
  surface: "tabletop",
  depth: "medium",
  detail: "medium",
  treatment: "blur",
  cleanliness: "curated-props",
  extra: "include only a few quiet creative tools in the background",
};

const LEGACY_ABSTRACT_BACKGROUND: BackgroundModel = {
  recipe: "brand-graphic",
  environment: "abstract",
  surface: "none",
  depth: "shallow",
  detail: "low",
  treatment: "gradient",
  cleanliness: "clean",
  extra: "use subtle geometric atmosphere without distracting from the subject",
};

const BACKGROUND_RECIPE_LABEL: Record<BackgroundRecipeKey, string> = {
  "icon-studio": "앱 아이콘",
  "product-studio": "제품 촬영",
  "brand-graphic": "브랜드 그래픽",
  "lifestyle-interior": "실내 라이프",
  "desk-workspace": "작업 데스크",
  "abstract-campaign": "캠페인 추상",
  "outdoor-natural": "자연광",
  "urban-architecture": "도시 건축",
};

const BACKGROUND_RECIPE_DESCRIPTION: Record<BackgroundRecipeKey, string> = {
  "icon-studio": "심볼, 앱 아이콘, 브랜드 마크가 중심인 깨끗한 무대",
  "product-studio": "제품이 떠 보이지 않도록 표면과 그림자를 갖춘 촬영 배경",
  "brand-graphic": "색감과 형태감은 있지만 피사체를 방해하지 않는 그래픽 배경",
  "lifestyle-interior": "자연광과 공간감이 있는 부드러운 실내 배경",
  "desk-workspace": "크리에이티브 작업실, 책상, 종이, 도구가 있는 배경",
  "abstract-campaign": "캠페인 키비주얼용 깊이감 있는 추상 배경",
  "outdoor-natural": "깨끗한 자연광과 열린 공간감을 주는 배경",
  "urban-architecture": "건축적 선, 유리, 콘크리트 무드의 도시 배경",
};

const BACKGROUND_RECIPE_MODEL: Record<BackgroundRecipeKey, Omit<BackgroundModel, "recipe" | "extra">> = {
  "icon-studio": { environment: "abstract", surface: "none", depth: "shallow", detail: "low", treatment: "gradient", cleanliness: "clean" },
  "product-studio": { environment: "studio", surface: "floor", depth: "shallow", detail: "low", treatment: "shadow", cleanliness: "clean" },
  "brand-graphic": { environment: "abstract", surface: "none", depth: "shallow", detail: "low", treatment: "gradient", cleanliness: "clean" },
  "lifestyle-interior": { environment: "interior", surface: "floor", depth: "medium", detail: "medium", treatment: "blur", cleanliness: "clean" },
  "desk-workspace": { environment: "workspace", surface: "tabletop", depth: "medium", detail: "medium", treatment: "blur", cleanliness: "curated-props" },
  "abstract-campaign": { environment: "abstract", surface: "glass", depth: "medium", detail: "medium", treatment: "pattern", cleanliness: "clean" },
  "outdoor-natural": { environment: "outdoor", surface: "none", depth: "deep", detail: "low", treatment: "blur", cleanliness: "clean" },
  "urban-architecture": { environment: "urban", surface: "concrete", depth: "deep", detail: "medium", treatment: "blur", cleanliness: "clean" },
};

const BACKGROUND_RECIPE_EXTRA: Record<BackgroundRecipeKey, string> = {
  "icon-studio": "keep the background quiet enough for a symbol or app icon hero render",
  "product-studio": "use soft product photography shadows and keep the subject dominant",
  "brand-graphic": "allow subtle brand shapes in the far background without readable text",
  "lifestyle-interior": "keep props soft and secondary, with natural light separation",
  "desk-workspace": "include only a few quiet creative tools, no clutter or readable text",
  "abstract-campaign": "create atmospheric depth and brand-safe abstract forms",
  "outdoor-natural": "keep the outdoor context clean, open, and softly blurred",
  "urban-architecture": "use restrained architectural lines and soft background blur",
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

const ENVIRONMENT_CHILD_PRESETS: Record<EnvironmentKey, ChildPresetKey[]> = {
  pure: ["surface", "treatment"],
  studio: ["surface", "depth", "treatment"],
  workspace: ["surface", "detail", "cleanliness"],
  interior: ["depth", "detail", "treatment"],
  outdoor: ["depth", "treatment"],
  urban: ["surface", "depth", "detail"],
  abstract: ["depth", "treatment", "surface"],
};

const CHILD_PRESET_LABEL: Record<ChildPresetKey, string> = {
  surface: "표면 프리셋",
  depth: "공간 깊이",
  detail: "디테일",
  treatment: "처리 프리셋",
  cleanliness: "정돈감",
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

  const recipeField = parseField(value, "Recipe");
  const environmentField = parseField(value, "Environment");
  const surfaceField = parseField(value, "Surface");
  const depthField = parseField(value, "Depth");
  const detailField = parseField(value, "Detail density");
  const treatmentField = parseField(value, "Treatment");
  const cleanlinessField = parseField(value, "Cleanliness");
  const extra = parseField(value, "Additional direction");

  if (recipeField || environmentField || surfaceField || depthField || detailField || treatmentField || cleanlinessField || extra) {
    return {
      recipe: findKey(BACKGROUND_RECIPE_LABEL, recipeField, DEFAULT_BACKGROUND.recipe),
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
    `Recipe: ${model.recipe}, ${BACKGROUND_RECIPE_LABEL[model.recipe]} - ${BACKGROUND_RECIPE_DESCRIPTION[model.recipe]}.`,
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

const BACKGROUND_REFERENCE_WEIGHT_OPTIONS: Array<{ value: BackgroundReferenceItem["weight"]; label: string }> = [
  { value: "low", label: "약" },
  { value: "medium", label: "중" },
  { value: "high", label: "강" },
];

export function BackgroundNode({ id, data }: { id: string; data: BackgroundNodeData }) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const model = useMemo(() => parseBackgroundPrompt(data.backgroundPrompt), [data.backgroundPrompt]);
  const preset = ENVIRONMENT_PRESETS[model.environment];
  const childPresetKeys = ENVIRONMENT_CHILD_PRESETS[model.environment];

  const connections = useNodeConnections({ handleType: "source", handleId: "background-out" });
  const isConnected = connections.length > 0;

  const updateModel = useCallback((patch: Partial<BackgroundModel>) => {
    data.setBackgroundPrompt(formatBackgroundPrompt({ ...model, ...patch }));
  }, [data, model]);

  const handleRecipeChange = useCallback((recipe: BackgroundRecipeKey) => {
    data.setBackgroundPrompt(formatBackgroundPrompt({
      recipe,
      ...BACKGROUND_RECIPE_MODEL[recipe],
      extra: model.extra || BACKGROUND_RECIPE_EXTRA[recipe],
    }));
  }, [data, model.extra]);

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

  const handleAddReference = (entry: StyleEntry) => {
    data.setBackgroundReferences((prev) => [
      ...prev,
      {
        ...entry,
        id: `background-reference-${Date.now()}`,
        weight: "high",
        enabled: true,
      },
    ]);
  };

  const updateReference = (referenceId: string, patch: Partial<BackgroundReferenceItem>) => {
    data.setBackgroundReferences((prev) => prev.map((item) => (
      item.id === referenceId ? { ...item, ...patch } : item
    )));
  };

  const deleteReference = (event: React.MouseEvent, referenceId: string) => {
    event.stopPropagation();
    data.setBackgroundReferences((prev) => prev.filter((item) => item.id !== referenceId));
  };

  const activeReferenceCount = data.backgroundReferences.filter((item) => item.enabled !== false).length;

  const renderChildPreset = (key: ChildPresetKey) => {
    if (key === "surface") {
      return (
        <ControlGroup
          key={key}
          label={CHILD_PRESET_LABEL[key]}
          columns={3}
          items={toControlItems(preset.surfaces, SURFACE_LABEL)}
          activeKey={model.surface}
          onChange={(nextKey) => updateModel({ surface: nextKey as SurfaceKey })}
        />
      );
    }

    if (key === "depth") {
      return (
        <ControlGroup
          key={key}
          label={CHILD_PRESET_LABEL[key]}
          items={toControlItems(preset.depths, DEPTH_LABEL)}
          activeKey={model.depth}
          onChange={(nextKey) => updateModel({ depth: nextKey as DepthKey })}
        />
      );
    }

    if (key === "detail") {
      return (
        <ControlGroup
          key={key}
          label={CHILD_PRESET_LABEL[key]}
          items={toControlItems(preset.details, DETAIL_LABEL)}
          activeKey={model.detail}
          onChange={(nextKey) => updateModel({ detail: nextKey as DetailKey })}
        />
      );
    }

    if (key === "treatment") {
      return (
        <ControlGroup
          key={key}
          label={CHILD_PRESET_LABEL[key]}
          columns={3}
          items={toControlItems(preset.treatments, TREATMENT_LABEL)}
          activeKey={model.treatment}
          onChange={(nextKey) => updateModel({ treatment: nextKey as TreatmentKey })}
        />
      );
    }

    return (
      <ControlGroup
        key={key}
        label={CHILD_PRESET_LABEL[key]}
        items={toControlItems(preset.cleanliness, CLEANLINESS_LABEL)}
        activeKey={model.cleanliness}
        onChange={(nextKey) => updateModel({ cleanliness: nextKey as CleanlinessKey })}
      />
    );
  };

  return (
    <>
      {showReferenceModal && (
        <StyleAddModal
          mode="background"
          onAdd={handleAddReference}
          onClose={() => setShowReferenceModal(false)}
        />
      )}
      <div style={nodeStyle}>
        <div style={headerStyle}>
          <ImageIcon size={16} color="var(--text-secondary)" />
          <span style={titleStyle}>배경</span>
          {activeReferenceCount > 0 && (
            <span style={{ marginLeft: "auto", fontSize: "var(--ui-type-xs-size)", fontWeight: 800, color: "var(--port-background)", backgroundColor: "color-mix(in srgb, var(--port-background) 12%, transparent)", padding: "calc(var(--ui-space-unit) * 0.5) var(--ui-space-8)", borderRadius: "var(--ui-radius-pill)" }}>
              참조 {activeReferenceCount}
            </span>
          )}
          <button
            type="button"
            onClick={data.onRemove}
            className="nodrag"
            title="배경 노드 제거"
            style={{
              marginLeft: activeReferenceCount > 0 ? 0 : "auto",
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
          <RecipeGrid
            activeKey={model.recipe}
            onChange={(recipe) => handleRecipeChange(recipe)}
          />

          <ReferencePanel
            references={data.backgroundReferences}
            onAdd={() => setShowReferenceModal(true)}
            onUpdate={updateReference}
            onDelete={deleteReference}
          />

          <button
            type="button"
            className="nodrag"
            role="switch"
            aria-checked={isDetailOpen}
            onClick={() => setIsDetailOpen((value) => !value)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 34,
              padding: "0 var(--ui-space-10)",
              borderRadius: "var(--ui-space-8)",
              border: "1px solid var(--border-node)",
              backgroundColor: "var(--bg-canvas)",
              color: "var(--text-secondary)",
              fontSize: "var(--ui-type-xs-size)",
              fontWeight: 850,
              cursor: "pointer",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--ui-space-6)" }}>
              <SlidersHorizontal size={12} />
              세부 조정
            </span>
            <span
              aria-hidden="true"
              style={{
                width: 40,
                height: 24,
                borderRadius: "var(--ui-radius-pill)",
                border: `1px solid ${isDetailOpen ? "var(--port-background)" : "var(--border-node)"}`,
                backgroundColor: isDetailOpen
                  ? "color-mix(in srgb, var(--port-background) 24%, transparent)"
                  : "var(--bg-node-header)",
                display: "inline-flex",
                alignItems: "center",
                padding: "var(--ui-space-4)",
                transition: "background-color 0.16s ease, border-color 0.16s ease",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: isDetailOpen ? "var(--port-background)" : "var(--text-muted)",
                  transform: isDetailOpen ? "translateX(16px)" : "translateX(0)",
                  transition: "transform 0.16s ease, background-color 0.16s ease",
                }}
              />
            </span>
          </button>

          {isDetailOpen && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-space-12)" }}>
              <ControlGroup
                label="환경"
                items={(Object.keys(ENVIRONMENT_LABEL) as EnvironmentKey[]).map((key) => ({ key, label: ENVIRONMENT_LABEL[key] }))}
                activeKey={model.environment}
                onChange={(key) => handleEnvironmentChange(key as EnvironmentKey)}
              />

              {childPresetKeys.map((key) => renderChildPreset(key))}
            </div>
          )}

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
    </>
  );
}

function RecipeGrid({
  activeKey,
  onChange,
}: {
  activeKey: BackgroundRecipeKey;
  onChange: (key: BackgroundRecipeKey) => void;
}) {
  return (
    <div className="nodrag" style={{ display: "flex", flexDirection: "column", gap: "var(--ui-space-8)" }}>
      <span style={{ color: "var(--text-secondary)", fontSize: "var(--ui-type-xs-size)", fontWeight: 850 }}>배경 레시피</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--ui-space-8)" }}>
        {(Object.keys(BACKGROUND_RECIPE_LABEL) as BackgroundRecipeKey[]).map((key) => {
          const isActive = activeKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              title={BACKGROUND_RECIPE_DESCRIPTION[key]}
              style={{
                minHeight: 56,
                borderRadius: "var(--ui-space-10)",
                border: `1px solid ${isActive ? "var(--port-background)" : "var(--border-node)"}`,
                backgroundColor: isActive
                  ? "color-mix(in srgb, var(--port-background) 12%, transparent)"
                  : "var(--bg-canvas)",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: "var(--ui-space-4)",
                padding: "var(--ui-space-8) var(--ui-space-10)",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "var(--ui-type-xs-size)", fontWeight: 900, lineHeight: 1.2 }}>
                {BACKGROUND_RECIPE_LABEL[key]}
              </span>
              <span style={{ maxWidth: "100%", color: "var(--text-muted)", fontSize: "var(--ui-type-xs-2-size)", fontWeight: 700, lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                {BACKGROUND_RECIPE_DESCRIPTION[key]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReferencePanel({
  references,
  onAdd,
  onUpdate,
  onDelete,
}: {
  references: BackgroundReferenceItem[];
  onAdd: () => void;
  onUpdate: (referenceId: string, patch: Partial<BackgroundReferenceItem>) => void;
  onDelete: (event: React.MouseEvent, referenceId: string) => void;
}) {
  return (
    <div className="nodrag" style={{ display: "flex", flexDirection: "column", gap: "var(--ui-space-8)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--ui-space-8)" }}>
        <span style={{ color: "var(--text-secondary)", fontSize: "var(--ui-type-xs-size)", fontWeight: 850 }}>배경 참조</span>
        <button
          type="button"
          onClick={onAdd}
          style={{ display: "inline-flex", alignItems: "center", gap: "var(--ui-space-4)", height: 28, padding: "0 var(--ui-space-8)", borderRadius: "var(--ui-radius-pill)", border: "1px solid var(--border-node)", backgroundColor: "var(--bg-canvas)", color: "var(--text-secondary)", fontSize: "var(--ui-type-xs-size)", fontWeight: 850, cursor: "pointer" }}
        >
          <Plus size={12} />
          추가
        </button>
      </div>

      {references.length === 0 ? (
        <div style={{ border: "1px dashed var(--border-node)", borderRadius: "var(--ui-space-10)", padding: "var(--ui-space-12)", color: "var(--text-muted)", fontSize: "var(--ui-type-xs-size)", lineHeight: 1.45 }}>
          이미지 배경을 분석해 색감, 조명, 공간감, 표면감을 참조합니다.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-space-8)" }}>
          {references.map((reference) => {
            const enabled = reference.enabled !== false;
            return (
              <div
                key={reference.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "var(--size-icon-container) minmax(0, 1fr) auto",
                  gap: "var(--ui-space-10)",
                  alignItems: "start",
                  padding: "var(--ui-space-8)",
                  borderRadius: "var(--ui-space-10)",
                  border: `1px solid ${enabled ? "var(--port-background)" : "var(--border-node)"}`,
                  backgroundColor: enabled ? "color-mix(in srgb, var(--port-background) 8%, transparent)" : "var(--bg-canvas)",
                }}
              >
                <button
                  type="button"
                  onClick={() => onUpdate(reference.id, { enabled: !enabled })}
                  title={enabled ? "배경 참조에서 제외" : "배경 참조에 포함"}
                  style={{ width: "var(--size-icon-container)", height: "var(--size-icon-container)", borderRadius: "var(--ui-radius-md)", overflow: "hidden", flexShrink: 0, border: "none", padding: 0, backgroundColor: "var(--bg-node-header)", position: "relative", cursor: "pointer" }}
                >
                  <img src={reference.imageUrl} alt={reference.label} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: enabled ? 1 : 0.38 }} />
                  {enabled && (
                    <span style={{ position: "absolute", right: 4, bottom: 4, width: 16, height: 16, borderRadius: "50%", background: "var(--port-background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={10} color="var(--bg-node-base)" strokeWidth={4} />
                    </span>
                  )}
                </button>

                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: "block", color: "var(--text-primary)", fontSize: "var(--ui-type-xs-size)", fontWeight: 900, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    {reference.label || "배경 참조"}
                  </strong>
                  <p style={{ margin: "var(--ui-space-4) 0 var(--ui-space-8)", color: enabled ? "var(--text-secondary)" : "var(--text-muted)", fontSize: "var(--ui-type-xs-size)", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                    {reference.prompt || "색감, 조명, 공간감, 표면감을 참조합니다."}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--ui-space-4)" }}>
                    {BACKGROUND_REFERENCE_WEIGHT_OPTIONS.map((option) => {
                      const active = reference.weight === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => onUpdate(reference.id, { weight: option.value })}
                          style={{ height: 26, border: `1px solid ${active ? "var(--port-background)" : "var(--border-node)"}`, borderRadius: "var(--ui-space-8)", background: active ? "color-mix(in srgb, var(--port-background) 12%, transparent)" : "var(--bg-canvas)", color: active ? "var(--port-background)" : "var(--text-muted)", fontSize: "var(--ui-type-xs-size)", fontWeight: 800, cursor: "pointer" }}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button type="button" onClick={(event) => onDelete(event, reference.id)} title="배경 참조 제거" style={{ width: "var(--size-control-xs)", height: "var(--size-control-xs)", borderRadius: "50%", border: "none", background: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.7 }}>
                  <Trash2 size={11} />
                </button>
              </div>
            );
          })}
        </div>
      )}
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
