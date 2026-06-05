"use client";

import { Handle, Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import React from "react";
import { RectangleHorizontal, RectangleVertical, Square, SlidersHorizontal, X } from "lucide-react";
import { XgenSegmentedControl } from "@/components/ui";

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

const ratioOptions = [
  { value: "1:1", label: <Square size={15} />, ariaLabel: "1:1 화면 비율" },
  { value: "16:9", label: <RectangleHorizontal size={16} />, ariaLabel: "16:9 화면 비율" },
  { value: "9:16", label: <RectangleVertical size={16} />, ariaLabel: "9:16 화면 비율" },
  { value: "4:3", label: "4:3", ariaLabel: "4:3 가로형 화면 비율" },
  { value: "3:4", label: "3:4", ariaLabel: "3:4 세로형 화면 비율" },
];

const resolutionOptions = ["SD", "HD", "4K", "8K"].map((value) => ({
  value,
  label: value,
  ariaLabel: `${value} 해상도`,
}));

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
          <XgenSegmentedControl
            aria-label="화면 비율"
            value={data.ratio}
            onChange={data.setRatio}
            options={ratioOptions}
            size="xs"
            block
          />
        </div>

        <div style={groupStyle} className="nodrag">
          <span style={labelStyle}>해상도</span>
          <XgenSegmentedControl
            aria-label="해상도"
            value={data.resolution}
            onChange={data.setResolution}
            options={resolutionOptions}
            size="xs"
            block
          />
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
