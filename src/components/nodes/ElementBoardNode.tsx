"use client";

import { Handle, Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import React from "react";
import { Boxes, Trash2, X } from "lucide-react";

type ElementBoard = {
  character: string;
  object: string;
  style: string;
  composition: string;
  rules: string[];
  objectViews: {
    front: string;
    left: string;
    right: string;
    back: string;
  };
};

type ElementBoardNodeData = {
  board: ElementBoard;
  setBoard: React.Dispatch<React.SetStateAction<ElementBoard>>;
  onRemove: () => void;
};

const PORT_COLOR = "var(--port-element-board)";

const nodeStyle = {
  backgroundColor: "color-mix(in srgb, var(--bg-node-base) 5%, transparent)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: "12px",
  border: "none",
  width: "320px",
  display: "flex",
  flexDirection: "column" as const,
  boxShadow: "var(--shadow-node)",
  overflow: "visible" as const,
};

const headerStyle = {
  backgroundColor: "var(--bg-node-header)",
  padding: "8px 12px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
};

const titleStyle = {
  fontSize: "12px",
  fontWeight: 600 as const,
  color: "var(--text-secondary)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const fieldLabelStyle = {
  fontSize: "10px",
  fontWeight: 800 as const,
  color: "var(--text-secondary)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.4px",
};

const textareaStyle = {
  width: "100%",
  minHeight: "48px",
  resize: "vertical" as const,
  borderRadius: "8px",
  border: "1px solid var(--border-node)",
  backgroundColor: "var(--bg-canvas)",
  color: "var(--text-primary)",
  padding: "8px",
  fontSize: "11px",
  lineHeight: 1.45,
  outline: "none",
};

function countFilledFields(board: ElementBoard) {
  return [
    board.character,
    board.object,
    board.style,
    board.composition,
    ...Object.values(board.objectViews),
    ...board.rules,
  ].filter((value) => value.trim()).length;
}

export function ElementBoardNode({ id, data }: { id: string; data: ElementBoardNodeData }) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = React.useState(false);
  const connections = useNodeConnections({ handleType: "source", handleId: "element-board-out" });
  const isConnected = connections.length > 0;
  const filledCount = countFilledFields(data.board);

  const updateField = (field: keyof Pick<ElementBoard, "character" | "object" | "style" | "composition">, value: string) => {
    data.setBoard((prev) => ({ ...prev, [field]: value }));
  };

  const updateObjectView = (field: keyof ElementBoard["objectViews"], value: string) => {
    data.setBoard((prev) => ({
      ...prev,
      objectViews: {
        ...prev.objectViews,
        [field]: value,
      },
    }));
  };

  const updateRules = (value: string) => {
    data.setBoard((prev) => ({
      ...prev,
      rules: value.split("\n").map((rule) => rule.trim()).filter(Boolean),
    }));
  };

  const handleDisconnect = () => {
    setEdges((eds) => eds.filter((edge) => !(edge.source === id && edge.sourceHandle === "element-board-out")));
  };

  return (
    <div style={nodeStyle}>
      <div style={headerStyle}>
        <Boxes size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>앨리먼트 보드</span>
        <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 800, color: PORT_COLOR, backgroundColor: `color-mix(in srgb, ${PORT_COLOR} 12%, transparent)`, padding: "2px 8px", borderRadius: 999 }}>
          {filledCount}개
        </span>
        <button type="button" onClick={data.onRemove} className="nodrag" title="앨리먼트 보드 노드 제거" style={{ width: 22, height: 22, borderRadius: 999, border: "none", backgroundColor: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Trash2 size={12} />
        </button>
      </div>

      <div className="nodrag nowheel" style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10, maxHeight: 470, overflowY: "auto" }}>
        {([
          ["character", "캐릭터"],
          ["object", "오브젝트"],
          ["style", "스타일"],
          ["composition", "구도"],
        ] as const).map(([field, label]) => (
          <label key={field} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={fieldLabelStyle}>{label}</span>
            <textarea value={data.board[field]} onChange={(event) => updateField(field, event.target.value)} style={textareaStyle} />
          </label>
        ))}

        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 2 }}>
          <span style={fieldLabelStyle}>오브젝트 방향 정의</span>
          {([
            ["front", "정면"],
            ["left", "좌측면"],
            ["right", "우측면"],
            ["back", "후면"],
          ] as const).map(([field, label]) => (
            <label key={field} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-tertiary)" }}>{label}</span>
              <textarea value={data.board.objectViews[field]} onChange={(event) => updateObjectView(field, event.target.value)} style={{ ...textareaStyle, minHeight: "42px" }} />
            </label>
          ))}
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={fieldLabelStyle}>유지 규칙</span>
          <textarea value={data.board.rules.join("\n")} onChange={(event) => updateRules(event.target.value)} style={{ ...textareaStyle, minHeight: "64px" }} />
        </label>

        <NodeOutputChip isConnected={isConnected} isHovered={isHovered} onHover={setIsHovered} onClick={isConnected ? handleDisconnect : undefined} />
      </div>
    </div>
  );
}

function NodeOutputChip({ isConnected, isHovered, onHover, onClick }: { isConnected: boolean; isHovered: boolean; onHover: (value: boolean) => void; onClick?: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
      <div className="nodrag" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)} onClick={onClick} style={{ display: "flex", alignItems: "center", padding: "4px 6px 4px 10px", borderRadius: 999, border: `1px solid ${isConnected ? PORT_COLOR : isHovered ? PORT_COLOR : "var(--border-node)"}`, backgroundColor: isConnected ? `color-mix(in srgb, ${PORT_COLOR} 15%, transparent)` : "var(--bg-canvas)", gap: 6, cursor: isConnected ? "pointer" : "crosshair", position: "relative" }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: isConnected ? PORT_COLOR : "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.3, pointerEvents: "none", zIndex: 1 }}>
          {isConnected && isHovered ? "연결 해제" : "보드 출력"}
        </span>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: isConnected && isHovered ? "var(--bg-node-base)" : PORT_COLOR, border: isConnected && isHovered ? `1px solid ${PORT_COLOR}` : "2px solid var(--bg-node-base)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
          {isConnected && isHovered && <X size={8} color={PORT_COLOR} strokeWidth={4} />}
        </span>
        <Handle type="source" position={Position.Right} id="element-board-out" isConnectable={true} style={{ ...(isConnected ? { width: 12, height: 12, right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", background: "transparent", border: "none" } : { position: "absolute", inset: 0, width: "100%", height: "100%", background: "transparent", border: "none", opacity: 0, zIndex: 10, cursor: "crosshair", pointerEvents: "auto", transform: "none", right: "auto", top: "auto" }) }} />
      </div>
    </div>
  );
}
