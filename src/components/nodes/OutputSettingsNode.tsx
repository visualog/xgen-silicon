"use client";

import { Handle, Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import React from "react";
import { Monitor, RectangleHorizontal, RectangleVertical, Square, SlidersHorizontal, X } from "lucide-react";

type OutputSettingsNodeData = {
  ratio: string;
  setRatio: (value: string) => void;
  resolution: string;
  setResolution: (value: string) => void;
};

const PORT_COLOR = "var(--port-resolution)";

const nodeStyle = {
  width: "var(--size-node-output-settings)",
  borderRadius: "var(--ui-radius-xl)",
  border: "none",
  backgroundColor: "color-mix(in srgb, var(--bg-node-base) 5%, transparent)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  boxShadow: "var(--ui-shadow-node)",
  overflow: "hidden",
};

const headerStyle = {
  backgroundColor: "var(--bg-node-header)",
  padding: "var(--ui-space-8) var(--ui-space-12)",
  display: "flex",
  alignItems: "center",
  gap: "var(--ui-space-8)",
};

const titleStyle = {
  color: "var(--text-secondary)",
  fontSize: "var(--ui-type-xs-2-size)",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const bodyStyle = {
  padding: "var(--ui-space-12)",
  display: "flex",
  flexDirection: "column" as const,
  gap: "var(--ui-space-12)",
};

const groupStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "calc(var(--ui-space-unit) * 1.5)",
};

const labelStyle = {
  color: "var(--text-secondary)",
  fontSize: "var(--ui-type-xs-size)",
  fontWeight: 800,
};

const toolbarStyle = {
  display: "flex",
  alignItems: "center",
  gap: "var(--ui-space-4)",
  backgroundColor: "var(--bg-canvas)",
  borderRadius: "var(--ui-radius-xl)",
  padding: "var(--ui-space-4)",
};

const toolbarButtonStyle = (isActive: boolean) => ({
  flex: 1,
  height: "var(--size-control-toolbar)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "var(--ui-space-8)",
  border: "none",
  backgroundColor: isActive ? "var(--bg-node-base)" : "transparent",
  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
  cursor: "pointer",
  fontSize: "var(--ui-type-xs-size)",
  fontWeight: 800,
  transition: "background-color 0.15s ease, color 0.15s ease",
});

export function OutputSettingsNode({ id, data }: { id: string; data: OutputSettingsNodeData }) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = React.useState(false);
  const connections = useNodeConnections({ handleType: "source", handleId: "output-settings-out" });
  const isConnected = connections.length > 0;

  const handleDisconnect = () => {
    setEdges((edges) => edges.filter((edge) => !(edge.source === id && edge.sourceHandle === "output-settings-out")));
  };

  return (
    <div style={nodeStyle}>
      <div style={headerStyle}>
        <SlidersHorizontal size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>출력 설정</span>
      </div>

      <div style={bodyStyle}>
        <div style={groupStyle} className="nodrag">
          <span style={labelStyle}>화면 비율</span>
          <div style={toolbarStyle}>
            <button type="button" style={toolbarButtonStyle(data.ratio === "1:1")} onClick={() => data.setRatio("1:1")} title="1:1">
              <Square size={15} />
            </button>
            <button type="button" style={toolbarButtonStyle(data.ratio === "16:9")} onClick={() => data.setRatio("16:9")} title="16:9">
              <RectangleHorizontal size={16} />
            </button>
            <button type="button" style={toolbarButtonStyle(data.ratio === "9:16")} onClick={() => data.setRatio("9:16")} title="9:16">
              <RectangleVertical size={16} />
            </button>
          </div>
        </div>

        <div style={groupStyle} className="nodrag">
          <span style={labelStyle}>해상도</span>
          <div style={toolbarStyle}>
            {["SD", "HD", "4K", "8K"].map((value) => (
              <button
                key={value}
                type="button"
                style={toolbarButtonStyle(data.resolution === value)}
                onClick={() => data.setResolution(value)}
                title={`${value} 해상도`}
              >
                {value === "HD" ? <Monitor size={14} /> : value}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
          <button
            type="button"
            className="nodrag"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={isConnected ? handleDisconnect : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "calc(var(--ui-space-unit) * 1.5)",
              position: "relative",
              height: "var(--size-control-md)",
              padding: "0 calc(var(--ui-space-unit) * 1.5) 0 var(--ui-space-10)",
              borderRadius: "var(--ui-radius-pill)",
              border: `1px solid ${isConnected ? PORT_COLOR : "var(--border-node)"}`,
              backgroundColor: isConnected
                ? "color-mix(in srgb, var(--port-resolution) 15%, transparent)"
                : "var(--bg-canvas)",
              color: isConnected ? PORT_COLOR : "var(--text-secondary)",
              fontSize: "var(--ui-type-xs-size)",
              fontWeight: 800,
              cursor: isConnected ? "pointer" : "crosshair",
            }}
          >
            {isConnected && isHovered ? "연결 해제" : "출력 설정"}
            <span
              style={{
                width: "var(--size-port-dot)",
                height: "var(--size-port-dot)",
                borderRadius: "50%",
                background: isConnected && isHovered ? "var(--bg-node-base)" : PORT_COLOR,
                border: isConnected && isHovered ? `1px solid ${PORT_COLOR}` : "2px solid var(--bg-node-base)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isConnected && isHovered ? <X size={8} color={PORT_COLOR} strokeWidth={4} /> : null}
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id="output-settings-out"
              isConnectable={true}
              style={{
                ...(isConnected
                  ? {
                      width: "var(--size-port-dot)",
                      height: "var(--size-port-dot)",
                      right: "calc(var(--size-port-dot) / 2)",
                      top: "calc(50% - var(--size-port-dot) / 2)",
                      transform: "none",
                      pointerEvents: "none",
                      background: "transparent",
                      border: "none",
                    }
                  : {
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      background: "transparent",
                      border: "none",
                      opacity: 0,
                      zIndex: 10,
                      cursor: "crosshair",
                      pointerEvents: "auto",
                      transform: "none",
                      right: "auto",
                      top: "auto",
                    }),
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
