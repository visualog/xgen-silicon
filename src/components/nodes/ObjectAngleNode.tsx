"use client";

import { Handle, Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import React from "react";
import { Box, Trash2, X } from "lucide-react";
import { ObjectAngleViewport } from "./ObjectAngleViewport";

const PORT_COLOR = "var(--port-object-angle)";

const nodeStyle = {
  backgroundColor: "color-mix(in srgb, var(--bg-node-base) 5%, transparent)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: "var(--ui-radius-xl)",
  border: "none",
  width: "var(--size-node-lg)",
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

const chipStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "var(--bg-canvas)",
  padding: "var(--ui-space-4) calc(var(--ui-space-unit) * 1.5) var(--ui-space-4) var(--ui-space-10)",
  borderRadius: "var(--ui-radius-pill)",
  border: "1px solid var(--border-node)",
  gap: "calc(var(--ui-space-unit) * 1.5)",
};

type ObjectAngleNodeData = {
  objectAngle: string;
  setObjectAngle: (value: string) => void;
  onRemove: () => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeYaw(value: number) {
  let nextValue = value;
  while (nextValue > 180) nextValue -= 360;
  while (nextValue < -180) nextValue += 360;
  return nextValue;
}

function getFacingDescriptor(yaw: number) {
  if (Math.abs(yaw) >= 150) return "back view, rear side of the object visible";
  if (yaw >= 105) return "right-back three-quarter view";
  if (yaw <= -105) return "left-back three-quarter view";
  if (yaw >= 45) return "right-side three-quarter view";
  if (yaw <= -45) return "left-side three-quarter view";
  return "front view, front side of the object visible";
}

function getPitchDescriptor(pitch: number) {
  if (pitch >= 45) return "steep top-down tilt with top surfaces clearly visible";
  if (pitch >= 18) return "slight top-down tilt with some top surfaces visible";
  if (pitch <= -45) return "steep low-angle tilt with underside cues visible";
  if (pitch <= -18) return "slight low-angle tilt with lower surfaces visible";
  return "level eye-line tilt with no strong vertical pitch";
}

function formatObjectAngle(yaw: number, pitch: number) {
  if (yaw === 0 && pitch === 0) {
    return "object facing forward with neutral object rotation";
  }

  const facing = getFacingDescriptor(yaw);
  const pitchView = getPitchDescriptor(pitch);

  return `OBJECT ORIENTATION LOCK: show the entire subject/object in ${facing}; ${pitchView}; yaw ${yaw} deg, pitch ${pitch} deg. Rotate the subject/object group itself, not just the camera. Use visible perspective cues, foreshortening, and changed silhouettes so it is not a normal front or side profile. Do not ignore this orientation.`;
}

function parseObjectAngle(value: string) {
  const match = value.match(/yaw\s(-?\d+)\sdeg.*pitch\s(-?\d+)\sdeg/i);
  if (!match) return { yaw: 0, pitch: 0 };
  return {
    yaw: normalizeYaw(Number(match[1])),
    pitch: clamp(Number(match[2]), -60, 60),
  };
}

export function ObjectAngleNode({ id, data }: { id: string; data: ObjectAngleNodeData }) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = React.useState(false);
  const connections = useNodeConnections({ handleType: "source", handleId: "object-angle-out" });
  const isConnected = connections.length > 0;
  const { yaw, pitch } = parseObjectAngle(data.objectAngle);
  const facingLabel = Math.abs(yaw) >= 150 ? "후면" : Math.abs(yaw) >= 90 ? "측후면" : "전면";

  const handleDisconnect = () => {
    setEdges((eds) => eds.filter((e) => !(e.source === id && e.sourceHandle === "object-angle-out")));
  };

  return (
    <div style={nodeStyle}>
      <div style={headerStyle}>
        <Box size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>오브젝트 앵글</span>
        <button
          type="button"
          onClick={data.onRemove}
          className="nodrag"
          title="오브젝트 앵글 노드 제거"
          style={{ marginLeft: "auto", width: "var(--size-control-sm)", height: "var(--size-control-sm)", borderRadius: "var(--ui-radius-pill)", border: "none", backgroundColor: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <Trash2 size={12} />
        </button>
      </div>
      <div style={bodyStyle}>
        <ObjectAngleViewport
          yaw={yaw}
          pitch={pitch}
          onChange={(nextYaw, nextPitch) => data.setObjectAngle(formatObjectAngle(nextYaw, nextPitch))}
        />
        <div style={{ fontSize: "calc(var(--ui-type-xs-size) * 1.1)", color: "var(--text-muted)", textAlign: "center", marginTop: -4 }}>
          드래그로 3D 회전 · 방향키로 미세 조정 · 더블클릭 리셋
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "var(--ui-space-8)", fontSize: "calc(var(--ui-type-xs-size) * 1.1)", color: "var(--text-muted)", alignItems: "center" }}>
          <span>Yaw {yaw} deg</span>
          <span style={{ color: PORT_COLOR, fontWeight: 800 }}>{facingLabel}</span>
          <span style={{ textAlign: "right" }}>Pitch {pitch} deg</span>
        </div>
        <div className="nodrag" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "calc(var(--ui-space-unit) * 1.5)" }}>
          {[
            { label: "정면", yaw: 0 },
            { label: "좌측", yaw: -90 },
            { label: "우측", yaw: 90 },
            { label: "후면", yaw: 180 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => data.setObjectAngle(formatObjectAngle(preset.yaw, 0))}
              style={{
                border: `1px solid ${yaw === preset.yaw && pitch === 0 ? PORT_COLOR : "var(--border-node)"}`,
                background: yaw === preset.yaw && pitch === 0 ? `color-mix(in srgb, ${PORT_COLOR} 14%, transparent)` : "var(--bg-canvas)",
                color: yaw === preset.yaw && pitch === 0 ? PORT_COLOR : "var(--text-secondary)",
                borderRadius: "var(--ui-space-10)",
                padding: "8px 0",
                fontSize: "calc(var(--ui-type-xs-size) * 1.1)",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <NodeOutputChip
          label="오브젝트 앵글 출력"
          isConnected={isConnected}
          isHovered={isHovered}
          onHover={setIsHovered}
          onClick={isConnected ? handleDisconnect : undefined}
          handleId="object-angle-out"
        />
      </div>
    </div>
  );
}

function NodeOutputChip({
  label,
  isConnected,
  isHovered,
  onHover,
  onClick,
  handleId,
}: {
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
            ? isHovered ? `color-mix(in srgb, ${PORT_COLOR} 25%, transparent)` : `color-mix(in srgb, ${PORT_COLOR} 15%, transparent)`
            : isHovered ? `color-mix(in srgb, ${PORT_COLOR} 10%, var(--bg-canvas))` : "var(--bg-canvas)",
          borderColor: isConnected ? PORT_COLOR : isHovered ? PORT_COLOR : "var(--border-node)",
          cursor: isConnected ? "pointer" : "crosshair",
          transition: "all 0.2s ease",
          position: "relative" as const,
        }}
        className="nodrag"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onClick={onClick}
      >
        <span style={{ fontSize: "var(--ui-type-xs-size)", fontWeight: 700, color: isConnected ? PORT_COLOR : "var(--text-secondary)", textTransform: "uppercase" as const, letterSpacing: "0.3px", pointerEvents: "none", zIndex: 1, position: "relative" as const }}>
          {isConnected && isHovered ? "연결 해제" : label}
        </span>
        <div style={{ width: "var(--size-port-dot)", height: "var(--size-port-dot)", position: "relative" as const, zIndex: 1 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: isConnected && isHovered ? "var(--bg-node-base)" : PORT_COLOR, border: isConnected && isHovered ? `1px solid ${PORT_COLOR}` : "2px solid var(--bg-node-base)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
            {isConnected && isHovered && <X size={8} color={PORT_COLOR} strokeWidth={4} />}
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
