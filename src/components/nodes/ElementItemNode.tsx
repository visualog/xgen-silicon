"use client";

import { Handle, Position } from "@xyflow/react";
import { Box, ImagePlus, Loader2 } from "lucide-react";

type ElementSheetStatus = "idle" | "generating" | "ready" | "failed";

type ElementItemNodeData = {
  name?: string;
  category?: string;
  description?: string;
  enabled?: boolean;
  sheetStatus?: ElementSheetStatus;
  onUpdate?: (patch: {
    name?: string;
    category?: string;
    description?: string;
    enabled?: boolean;
  }) => void;
  onGenerateSheet?: () => void;
};

const PORT_COLOR = "var(--port-element-board)";

export function ElementItemNode({ data }: { data: ElementItemNodeData }) {
  const status = data.sheetStatus || "idle";
  const isGenerating = status === "generating";
  const isEnabled = data.enabled !== false;

  return (
    <div
      style={{
        width: "var(--size-node-lg)",
        borderRadius: "var(--ui-radius-xl)",
        border: `1px solid ${isEnabled ? "color-mix(in srgb, var(--port-element-board) 32%, var(--border-node))" : "var(--border-node)"}`,
        background: "color-mix(in srgb, var(--bg-node-base) 8%, transparent)",
        backdropFilter: "blur(16px)",
        boxShadow: "var(--ui-shadow-node)",
        opacity: isEnabled ? 1 : 0.58,
        position: "relative",
        overflow: "visible",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="element-in"
        isConnectable={true}
        style={{
          width: "var(--size-port-dot)",
          height: "var(--size-port-dot)",
          left: 0,
          top: "calc(50% - var(--size-port-dot) / 2)",
          transform: "none",
          background: "transparent",
          border: "none",
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
          background: isEnabled ? PORT_COLOR : "var(--text-muted)",
          border: "2px solid var(--bg-node-base)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="element-out"
        isConnectable={true}
        style={{
          width: "var(--size-port-dot)",
          height: "var(--size-port-dot)",
          right: 0,
          top: "calc(50% - var(--size-port-dot) / 2)",
          transform: "none",
          background: "transparent",
          border: "none",
        }}
      />
      {status === "ready" ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "calc(var(--size-port-dot) / -2)",
            top: "calc(50% - var(--size-port-dot) / 2)",
            width: "var(--size-port-dot)",
            height: "var(--size-port-dot)",
            borderRadius: "50%",
            background: isEnabled ? PORT_COLOR : "var(--text-muted)",
            border: "2px solid var(--bg-node-base)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      ) : null}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--ui-space-8)",
          padding: "var(--ui-space-8) var(--ui-space-12)",
          background: "var(--bg-node-header)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Box size={15} color={PORT_COLOR} />
        <input
          className="nodrag"
          value={data.name || ""}
          onChange={(event) => data.onUpdate?.({ name: event.target.value })}
          placeholder="앨리먼트 이름"
          style={{
            minWidth: 0,
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "var(--text-secondary)",
            fontSize: "var(--ui-type-xs-2-size)",
            fontWeight: 800,
          }}
        />
        <input
          className="nodrag"
          value={data.category || ""}
          onChange={(event) => data.onUpdate?.({ category: event.target.value })}
          placeholder="type"
          style={{
            width: "var(--size-element-thumb-width)",
            border: "none",
            outline: "none",
            background: "transparent",
            color: PORT_COLOR,
            fontSize: "var(--ui-type-xs-size)",
            fontWeight: 900,
            textAlign: "right",
          }}
        />
      </div>

      <div className="nodrag nowheel" style={{ padding: "var(--ui-space-12)", display: "flex", flexDirection: "column", gap: "var(--ui-space-10)" }}>
        <textarea
          value={data.description || ""}
          onChange={(event) => data.onUpdate?.({ description: event.target.value })}
          placeholder="앨리먼트 설명"
          style={{
            width: "100%",
            minHeight: "var(--size-element-card-min-height)",
            resize: "vertical",
            border: "1px solid var(--border-node)",
            borderRadius: "var(--ui-space-10)",
            background: "var(--bg-canvas)",
            padding: "calc(var(--ui-space-unit) * 2.25)",
            color: "var(--text-primary)",
            fontSize: "calc(var(--ui-type-xs-size) * 1.1)",
            lineHeight: 1.55,
            outline: "none",
          }}
        />
        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--ui-space-8)", fontSize: "var(--ui-type-xs-size)", fontWeight: 850, color: "var(--text-secondary)" }}>
          다음 생성에 포함
          <input
            className="nodrag"
            type="checkbox"
            checked={isEnabled}
            onChange={(event) => data.onUpdate?.({ enabled: event.target.checked })}
          />
        </label>
        <button
          type="button"
          onClick={data.onGenerateSheet}
          disabled={isGenerating || !isEnabled}
          style={{
            height: "var(--size-control-toolbar)",
            borderRadius: "var(--ui-radius-pill)",
            border: `1px solid color-mix(in srgb, ${PORT_COLOR} 50%, var(--border-node))`,
            background: `color-mix(in srgb, ${PORT_COLOR} 12%, transparent)`,
            color: "var(--text-primary)",
            fontSize: "calc(var(--ui-type-xs-size) * 1.1)",
            fontWeight: 900,
            cursor: isGenerating || !isEnabled ? "default" : "pointer",
            opacity: isEnabled ? 1 : 0.48,
          }}
        >
          {isGenerating ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <ImagePlus size={13} />}
          {status === "ready" ? "전개도 다시 생성" : "전개도 생성"}
        </button>
      </div>
    </div>
  );
}
