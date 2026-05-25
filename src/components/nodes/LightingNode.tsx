"use client";

import { Handle, Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import React from "react";
import { Sun, X, Trash2 } from "lucide-react";

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
  border: `1px solid ${isActive ? "var(--port-lighting)" : "var(--border-node)"}`,
  backgroundColor: isActive
    ? "color-mix(in srgb, var(--port-lighting) 14%, transparent)"
    : "var(--bg-canvas)",
  color: isActive ? "var(--port-lighting)" : "var(--text-secondary)",
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

type LightingNodeData = {
  lighting: string;
  setLighting: (value: string) => void;
  onRemove: () => void;
};

const options = [
  { label: "확산광", value: "soft diffused lighting with gentle even illumination" },
  { label: "측면광", value: "side lighting with subtle directional contrast and depth" },
  { label: "역광", value: "backlit lighting with a restrained silhouette emphasis" },
  { label: "플랫", value: "flat lighting with minimal shadow and clean graphic clarity" },
];

export function LightingNode({ id, data }: { id: string; data: LightingNodeData }) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = React.useState(false);
  const connections = useNodeConnections({ handleType: "source", handleId: "lighting-out" });
  const isConnected = connections.length > 0;

  const handleDisconnect = () => {
    setEdges((eds) => eds.filter((e) => !(e.source === id && e.sourceHandle === "lighting-out")));
  };

  return (
    <div style={nodeStyle}>
      <div style={headerStyle}>
        <Sun size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>조명</span>
        <button type="button" onClick={data.onRemove} className="nodrag" title="조명 노드 제거" style={{ marginLeft: "auto", width: "var(--size-control-sm)", height: "var(--size-control-sm)", borderRadius: "var(--ui-radius-pill)", border: "none", backgroundColor: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Trash2 size={12} />
        </button>
      </div>
      <div style={bodyStyle}>
        <div style={optionGridStyle} className="nodrag">
          {options.map((option) => (
            <button key={option.label} type="button" style={optionButtonStyle(data.lighting === option.value)} onClick={() => data.setLighting(option.value)}>
              {option.label}
            </button>
          ))}
        </div>
        <LightingChip isConnected={isConnected} isHovered={isHovered} onHover={setIsHovered} onClick={isConnected ? handleDisconnect : undefined} />
      </div>
    </div>
  );
}

function LightingChip({ isConnected, isHovered, onHover, onClick }: { isConnected: boolean; isHovered: boolean; onHover: (value: boolean) => void; onClick?: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ ...chipStyle, backgroundColor: isConnected ? (isHovered ? "color-mix(in srgb, var(--port-lighting) 25%, transparent)" : "color-mix(in srgb, var(--port-lighting) 15%, transparent)") : (isHovered ? "color-mix(in srgb, var(--port-lighting) 10%, var(--bg-canvas))" : "var(--bg-canvas)"), borderColor: isConnected ? "var(--port-lighting)" : (isHovered ? "var(--port-lighting)" : "var(--border-node)"), cursor: isConnected ? "pointer" : "crosshair", transition: "all 0.2s ease", position: "relative" as const }} className="nodrag" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)} onClick={onClick}>
        <span style={{ fontSize: "var(--ui-type-xs-size)", fontWeight: 700, color: isConnected ? "var(--port-lighting)" : "var(--text-secondary)", textTransform: "uppercase" as const, letterSpacing: "0.3px", pointerEvents: "none", zIndex: 1, position: "relative" as const }}>
          {isConnected && isHovered ? "연결 해제" : "조명 출력"}
        </span>
        <div style={{ width: "var(--size-port-dot)", height: "var(--size-port-dot)", position: "relative" as const, zIndex: 1 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: isConnected && isHovered ? "var(--bg-node-base)" : "var(--port-lighting)", border: isConnected && isHovered ? "1px solid var(--port-lighting)" : "2px solid var(--bg-node-base)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
            {isConnected && isHovered && <X size={8} color="var(--port-lighting)" strokeWidth={4} />}
          </div>
        </div>
        <Handle type="source" position={Position.Right} id="lighting-out" isConnectable={true} style={{ ...(isConnected ? { width: "var(--size-port-dot)", height: "var(--size-port-dot)", right: "calc(var(--size-port-dot) / 2)", top: "calc(50% - var(--size-port-dot) / 2)", transform: "none", pointerEvents: "none", background: "transparent", border: "none" } : { position: "absolute", inset: 0, width: "100%", height: "100%", background: "transparent", border: "none", opacity: 0, zIndex: 10, cursor: "crosshair", pointerEvents: "auto", transform: "none", right: "auto", top: "auto" }) }} />
      </div>
    </div>
  );
}
