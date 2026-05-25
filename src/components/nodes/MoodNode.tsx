"use client";

import { Handle, Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import React from "react";
import { Smile, X, Trash2 } from "lucide-react";

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
  border: `1px solid ${isActive ? "var(--port-mood)" : "var(--border-node)"}`,
  backgroundColor: isActive
    ? "color-mix(in srgb, var(--port-mood) 14%, transparent)"
    : "var(--bg-canvas)",
  color: isActive ? "var(--port-mood)" : "var(--text-secondary)",
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

type MoodNodeData = {
  mood: string;
  setMood: (value: string) => void;
  onRemove: () => void;
};

const moodOptions = [
  { label: "차분함", value: "calm and understated mood with controlled energy" },
  { label: "긴장감", value: "tense and urgent mood with subtle pressure and motion" },
  { label: "유쾌함", value: "playful and lighthearted mood with approachable charm" },
  { label: "고급감", value: "refined and premium mood with polished restraint" },
];

export function MoodNode({ id, data }: { id: string; data: MoodNodeData }) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = React.useState(false);
  const connections = useNodeConnections({ handleType: "source", handleId: "mood-out" });
  const isConnected = connections.length > 0;

  const handleDisconnect = () => {
    setEdges((eds) => eds.filter((e) => !(e.source === id && e.sourceHandle === "mood-out")));
  };

  return (
    <div style={nodeStyle}>
      <div style={headerStyle}>
        <Smile size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>무드</span>
        <button type="button" onClick={data.onRemove} className="nodrag" title="무드 노드 제거" style={{ marginLeft: "auto", width: "var(--size-control-sm)", height: "var(--size-control-sm)", borderRadius: "var(--ui-radius-pill)", border: "none", backgroundColor: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Trash2 size={12} />
        </button>
      </div>
      <div style={bodyStyle}>
        <div style={optionGridStyle} className="nodrag">
          {moodOptions.map((option) => (
            <button key={option.label} type="button" style={optionButtonStyle(data.mood === option.value)} onClick={() => data.setMood(option.value)}>
              {option.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ ...chipStyle, backgroundColor: isConnected ? (isHovered ? "color-mix(in srgb, var(--port-mood) 25%, transparent)" : "color-mix(in srgb, var(--port-mood) 15%, transparent)") : (isHovered ? "color-mix(in srgb, var(--port-mood) 10%, var(--bg-canvas))" : "var(--bg-canvas)"), borderColor: isConnected ? "var(--port-mood)" : (isHovered ? "var(--port-mood)" : "var(--border-node)"), cursor: isConnected ? "pointer" : "crosshair", transition: "all 0.2s ease", position: "relative" as const }} className="nodrag" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={isConnected ? handleDisconnect : undefined}>
            <span style={{ fontSize: "var(--ui-type-xs-size)", fontWeight: 700, color: isConnected ? "var(--port-mood)" : "var(--text-secondary)", textTransform: "uppercase" as const, letterSpacing: "0.3px", pointerEvents: "none", zIndex: 1, position: "relative" as const }}>
              {isConnected && isHovered ? "연결 해제" : "무드 출력"}
            </span>
            <div style={{ width: "var(--size-port-dot)", height: "var(--size-port-dot)", position: "relative" as const, zIndex: 1 }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: isConnected && isHovered ? "var(--bg-node-base)" : "var(--port-mood)", border: isConnected && isHovered ? "1px solid var(--port-mood)" : "2px solid var(--bg-node-base)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                {isConnected && isHovered && <X size={8} color="var(--port-mood)" strokeWidth={4} />}
              </div>
            </div>
            <Handle type="source" position={Position.Right} id="mood-out" isConnectable={true} style={{ ...(isConnected ? { width: "var(--size-port-dot)", height: "var(--size-port-dot)", right: "calc(var(--size-port-dot) / 2)", top: "calc(50% - var(--size-port-dot) / 2)", transform: "none", pointerEvents: "none", background: "transparent", border: "none" } : { position: "absolute", inset: 0, width: "100%", height: "100%", background: "transparent", border: "none", opacity: 0, zIndex: 10, cursor: "crosshair", pointerEvents: "auto", transform: "none", right: "auto", top: "auto" }) }} />
          </div>
        </div>
      </div>
    </div>
  );
}
