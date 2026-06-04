import React from "react";
import { Handle, Position, useEdges } from "@xyflow/react";
import { Eraser, ScanLine, WandSparkles } from "lucide-react";

export type MaskRegion = "center" | "subject" | "background" | "top" | "bottom" | "left" | "right";

export type MaskEditSettings = {
  enabled: boolean;
  region: MaskRegion;
  instruction: string;
};

const REGION_LABELS: Record<MaskRegion, string> = {
  center: "중앙",
  subject: "주 피사체",
  background: "배경",
  top: "상단",
  bottom: "하단",
  left: "좌측",
  right: "우측",
};

const REGION_RECTS: Record<MaskRegion, { left: string; top: string; width: string; height: string; borderRadius: string }> = {
  center: { left: "30%", top: "28%", width: "40%", height: "44%", borderRadius: "18px" },
  subject: { left: "34%", top: "18%", width: "32%", height: "64%", borderRadius: "999px" },
  background: { left: "6%", top: "6%", width: "88%", height: "88%", borderRadius: "12px" },
  top: { left: "10%", top: "8%", width: "80%", height: "34%", borderRadius: "12px" },
  bottom: { left: "10%", top: "58%", width: "80%", height: "34%", borderRadius: "12px" },
  left: { left: "8%", top: "12%", width: "36%", height: "76%", borderRadius: "12px" },
  right: { left: "56%", top: "12%", width: "36%", height: "76%", borderRadius: "12px" },
};

const nodeStyle = {
  backgroundColor: "color-mix(in srgb, var(--bg-node-base) 5%, transparent)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: "var(--ui-radius-xl)",
  border: "none",
  width: "330px",
  display: "flex",
  flexDirection: "column" as const,
  boxShadow: "var(--ui-shadow-node)",
  position: "relative" as const,
  overflow: "visible" as const,
};

const headerStyle = {
  backgroundColor: "var(--bg-node-header)",
  padding: "var(--ui-space-8) var(--ui-space-12)",
  display: "flex",
  alignItems: "center",
  gap: "var(--ui-space-8)",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
};

type MaskEditNodeData = {
  settings?: MaskEditSettings;
  setSettings?: (settings: MaskEditSettings) => void;
  sourceImageUrl?: string | null;
  onGenerateMaskEdit?: () => void;
  isGenerating?: boolean;
};

export function MaskEditNode({ data }: { data: MaskEditNodeData }) {
  const edges = useEdges();
  const isLayerConnected = edges.some((edge) => edge.target === "mask-edit-node" && edge.source === "image-layer-node");
  const isOutputConnected = edges.some((edge) => edge.source === "mask-edit-node" && edge.target === "output-node");
  const settings = data.settings ?? { enabled: false, region: "subject" as MaskRegion, instruction: "" };
  const regionRect = REGION_RECTS[settings.region];

  const updateSettings = (patch: Partial<MaskEditSettings>) => {
    data.setSettings?.({ ...settings, ...patch });
  };

  return (
    <div style={nodeStyle}>
      <Handle
        type="target"
        position={Position.Left}
        id="mask-in"
        isConnectable={true}
        style={{
          background: "transparent",
          border: "none",
          width: "var(--size-port-dot)",
          height: "var(--size-port-dot)",
          left: 0,
          top: "calc(50% - var(--size-port-dot) / 2)",
          transform: "none",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "calc(var(--size-port-dot) / -2)",
          top: "calc(50% - var(--size-port-dot) / 2)",
          width: "var(--size-port-dot)",
          height: "var(--size-port-dot)",
          borderRadius: "50%",
          background: isLayerConnected ? "var(--port-constraint)" : "var(--bg-canvas)",
          border: isLayerConnected ? "2px solid var(--bg-node-base)" : "2px dashed var(--border-node)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="mask-out"
        isConnectable={true}
        style={{
          background: "transparent",
          border: "none",
          width: "var(--size-port-dot)",
          height: "var(--size-port-dot)",
          right: 0,
          top: "calc(50% - var(--size-port-dot) / 2)",
          transform: "none",
        }}
      />
      {isOutputConnected ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "calc(var(--size-port-dot) / -2)",
            top: "calc(50% - var(--size-port-dot) / 2)",
            width: "var(--size-port-dot)",
            height: "var(--size-port-dot)",
            borderRadius: "50%",
            background: "var(--port-constraint)",
            border: "2px solid var(--bg-node-base)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      ) : null}

      <div style={headerStyle}>
        <ScanLine size={16} color="var(--text-secondary)" />
        <span style={{ fontSize: "var(--ui-type-xs-2-size)", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          마스크 편집
        </span>
      </div>

      <div style={{ padding: "var(--ui-space-12)", display: "grid", gap: "var(--ui-space-10)" }}>
        <label
          className="nodrag"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--ui-space-8)",
            color: "var(--text-primary)",
            fontSize: "var(--ui-type-xs-2-size)",
            fontWeight: 800,
          }}
        >
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(event) => updateSettings({ enabled: event.target.checked })}
          />
          부분 수정 사용
        </label>

        <div
          style={{
            position: "relative",
            aspectRatio: "16 / 10",
            border: "1px solid var(--border-node)",
            borderRadius: "var(--ui-space-10)",
            overflow: "hidden",
            background: "var(--bg-canvas)",
          }}
        >
          {data.sourceImageUrl ? (
            <img src={data.sourceImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.72 }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--text-muted)", fontSize: "var(--ui-type-xs-size)" }}>
              레이어 없음
            </div>
          )}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: regionRect.left,
              top: regionRect.top,
              width: regionRect.width,
              height: regionRect.height,
              borderRadius: regionRect.borderRadius,
              border: "2px solid var(--port-constraint)",
              background: "color-mix(in srgb, var(--port-constraint) 28%, transparent)",
              boxShadow: "0 0 0 999px color-mix(in srgb, var(--bg-canvas) 46%, transparent)",
            }}
          />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ui-space-6)" }}>
          {(Object.keys(REGION_LABELS) as MaskRegion[]).map((region) => (
            <button
              key={region}
              type="button"
              className="nodrag"
              onClick={() => updateSettings({ region })}
              style={{
                height: "calc(var(--ui-space-unit) * 7.5)",
                padding: "0 var(--ui-space-8)",
                borderRadius: "var(--ui-radius-pill)",
                border: `1px solid ${settings.region === region ? "var(--port-constraint)" : "var(--border-node)"}`,
                background: settings.region === region ? "color-mix(in srgb, var(--port-constraint) 14%, transparent)" : "var(--bg-canvas)",
                color: settings.region === region ? "var(--text-primary)" : "var(--text-secondary)",
                fontSize: "var(--ui-type-xs-size)",
                fontWeight: 800,
              }}
            >
              {REGION_LABELS[region]}
            </button>
          ))}
        </div>

        <textarea
          className="nodrag nowheel"
          value={settings.instruction}
          onChange={(event) => updateSettings({ instruction: event.target.value })}
          placeholder="선택 영역에서 바꿀 내용을 입력하세요."
          style={{
            minHeight: 92,
            resize: "vertical",
            border: "1px solid var(--border-node)",
            borderRadius: "var(--ui-space-10)",
            background: "var(--bg-canvas)",
            color: "var(--text-primary)",
            padding: "var(--ui-space-10)",
            fontSize: "var(--ui-type-xs-2-size)",
            lineHeight: 1.65,
            outline: "none",
          }}
        />

        <button
          type="button"
          className="nodrag"
          onClick={data.onGenerateMaskEdit}
          disabled={!settings.enabled || !settings.instruction.trim() || !data.sourceImageUrl || data.isGenerating}
          title="현재 레이어의 마스크 영역만 바꾸는 생성 실행"
          style={{
            height: "var(--size-control-input-lg)",
            borderRadius: "var(--ui-radius-pill)",
            border: "1px solid var(--border-node)",
            background: "var(--text-primary)",
            color: "var(--bg-node-base)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--ui-space-8)",
            fontSize: "var(--ui-type-sm-6-size)",
            fontWeight: 850,
            opacity: settings.enabled && settings.instruction.trim() && data.sourceImageUrl && !data.isGenerating ? 1 : 0.45,
          }}
        >
          {data.isGenerating ? <Eraser size={15} /> : <WandSparkles size={15} />} 마스크 영역 재생성
        </button>
      </div>
    </div>
  );
}
