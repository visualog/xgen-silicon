"use client";

import { Handle, Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import React from "react";
import { Image as ImageIcon, X, Trash2 } from "lucide-react";

const nodeStyle = {
  backgroundColor: "color-mix(in srgb, var(--bg-node-base) 5%, transparent)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: "var(--ui-radius-xl)",
  border: "none",
  width: "var(--size-node-md)",
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

const optionGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "calc(var(--ui-space-unit) * 1.5)",
};

const optionButtonStyle = (isActive: boolean) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "var(--ui-space-10) var(--ui-space-8)",
  borderRadius: "var(--ui-space-10)",
  border: `1px solid ${isActive ? "var(--port-background)" : "var(--border-node)"}`,
  backgroundColor: isActive
    ? "color-mix(in srgb, var(--port-background) 14%, transparent)"
    : "var(--bg-canvas)",
  color: isActive ? "var(--port-background)" : "var(--text-secondary)",
  fontSize: "var(--ui-type-xs-2-size)",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.15s ease",
});

const chipStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "var(--bg-canvas)",
  padding: "var(--ui-space-4) calc(var(--ui-space-unit) * 1.5) var(--ui-space-4) var(--ui-space-10)",
  borderRadius: "var(--ui-radius-pill)",
  border: "1px solid var(--border-node)",
  gap: "calc(var(--ui-space-unit) * 1.5)",
};

type BackgroundNodeData = {
  backgroundPrompt: string;
  setBackgroundPrompt: (value: string) => void;
  onRemove: () => void;
};

const backgroundOptions = [
  { label: "순백", value: "pure white background with no environmental details" },
  { label: "미니멀", value: "minimal studio-like background with only a few subtle contextual cues" },
  { label: "오피스", value: "minimal office setting suggested with sparse simplified props" },
  { label: "야외", value: "clean outdoor context with only a few simplified environmental shapes" },
];

export function BackgroundNode({ id, data }: { id: string; data: BackgroundNodeData }) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = React.useState(false);

  const connections = useNodeConnections({ handleType: "source", handleId: "background-out" });
  const isConnected = connections.length > 0;

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
        <div style={optionGridStyle} className="nodrag">
          {backgroundOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              style={optionButtonStyle(data.backgroundPrompt === option.value)}
              onClick={() => data.setBackgroundPrompt(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              ...chipStyle,
              backgroundColor: isConnected
                ? (isHovered
                    ? "color-mix(in srgb, var(--port-background) 25%, transparent)"
                    : "color-mix(in srgb, var(--port-background) 15%, transparent)")
                : (isHovered
                    ? "color-mix(in srgb, var(--port-background) 10%, var(--bg-canvas))"
                    : "var(--bg-canvas)"),
              borderColor: isConnected ? "var(--port-background)" : (isHovered ? "var(--port-background)" : "var(--border-node)"),
              cursor: isConnected ? "pointer" : "crosshair",
              transition: "all 0.2s ease",
              position: "relative" as const,
            }}
            className="nodrag"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={isConnected ? handleDisconnect : undefined}
          >
            <span style={{ fontSize: "var(--ui-type-xs-size)", fontWeight: 700, color: isConnected ? "var(--port-background)" : "var(--text-secondary)", textTransform: "uppercase" as const, letterSpacing: "0.3px", pointerEvents: "none", zIndex: 1, position: "relative" as const }}>
              {isConnected && isHovered ? "연결 해제" : "배경 출력"}
            </span>

            <div style={{ width: "var(--size-port-dot)", height: "var(--size-port-dot)", position: "relative" as const, zIndex: 1 }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: isConnected && isHovered ? "var(--bg-node-base)" : "var(--port-background)", border: isConnected && isHovered ? "1px solid var(--port-background)" : "2px solid var(--bg-node-base)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                {isConnected && isHovered && <X size={8} color="var(--port-background)" strokeWidth={4} />}
              </div>
            </div>

            <Handle
              type="source"
              position={Position.Right}
              id="background-out"
              isConnectable={true}
              style={{
                ...(isConnected
                  ? { width: "var(--size-port-dot)", height: "var(--size-port-dot)", right: "calc(var(--size-port-dot) / 2)", top: "calc(50% - var(--size-port-dot) / 2)", transform: "none", pointerEvents: "none", background: "transparent", border: "none" }
                  : { position: "absolute", inset: 0, width: "100%", height: "100%", background: "transparent", border: "none", opacity: 0, zIndex: 10, cursor: "crosshair", pointerEvents: "auto", transform: "none", right: "auto", top: "auto" }),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
