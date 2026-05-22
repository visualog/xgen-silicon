"use client";

import { Handle, Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import React from "react";
import { Boxes, ImagePlus, Trash2, X } from "lucide-react";

type ElementSheetStatus = "idle" | "generating" | "ready" | "failed";

type ElementBoardItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  sheetStatus?: ElementSheetStatus;
  sheetImageUrl?: string;
  sheetPrompt?: string;
  sheetGeneratedAt?: string;
};

type ElementBoard = {
  character: string;
  object: string;
  style: string;
  composition: string;
  elements: ElementBoardItem[];
  rules: string[];
};

type ElementBoardNodeData = {
  board: ElementBoard;
  setBoard: React.Dispatch<React.SetStateAction<ElementBoard>>;
  onGenerateSheet: (elementId: string) => void;
  onRemove: () => void;
};

const PORT_COLOR = "var(--port-element-board)";

const nodeStyle = {
  backgroundColor: "color-mix(in srgb, var(--bg-node-base) 5%, transparent)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: "12px",
  border: "none",
  width: "360px",
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

const inputStyle = {
  width: "100%",
  borderRadius: "8px",
  border: "1px solid var(--border-node)",
  backgroundColor: "var(--bg-canvas)",
  color: "var(--text-primary)",
  padding: "7px 8px",
  fontSize: "11px",
  lineHeight: 1.45,
  outline: "none",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "54px",
  resize: "vertical" as const,
};

function getStatusLabel(status: ElementSheetStatus | undefined) {
  if (status === "generating") return "생성 중";
  if (status === "ready") return "전개도 준비";
  if (status === "failed") return "실패";
  return "대기";
}

export function ElementBoardNode({ id, data }: { id: string; data: ElementBoardNodeData }) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = React.useState(false);
  const connections = useNodeConnections({ handleType: "source", handleId: "element-board-out" });
  const isConnected = connections.length > 0;

  const updateElement = (elementId: string, patch: Partial<ElementBoardItem>) => {
    data.setBoard((prev) => ({
      ...prev,
      elements: prev.elements.map((element) =>
        element.id === elementId ? { ...element, ...patch } : element,
      ),
    }));
  };

  const removeElement = (elementId: string) => {
    data.setBoard((prev) => ({
      ...prev,
      elements: prev.elements.filter((element) => element.id !== elementId),
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
          {data.board.elements.length}개
        </span>
        <button type="button" onClick={data.onRemove} className="nodrag" title="앨리먼트 보드 노드 제거" style={{ width: 22, height: 22, borderRadius: 999, border: "none", backgroundColor: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Trash2 size={12} />
        </button>
      </div>

      <div className="nodrag nowheel" style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10, maxHeight: 560, overflowY: "auto" }}>
        {data.board.elements.length === 0 ? (
          <div style={{ padding: "18px 12px", borderRadius: 10, border: "1px dashed var(--border-node)", color: "var(--text-muted)", fontSize: 11, lineHeight: 1.55, textAlign: "center" }}>
            생성 이미지의 일관성 분석 결과에서 앨리먼트 목록을 만든 뒤, 각 앨리먼트의 전개도를 생성합니다.
          </div>
        ) : (
          data.board.elements.map((element) => (
            <div key={element.id} style={{ display: "flex", flexDirection: "column", gap: 8, padding: 10, borderRadius: 12, border: "1px solid var(--border-node)", backgroundColor: "var(--bg-canvas)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                  <input value={element.name} onChange={(event) => updateElement(element.id, { name: event.target.value })} style={{ ...inputStyle, fontWeight: 800 }} />
                  <input value={element.category} onChange={(event) => updateElement(element.id, { category: event.target.value })} style={{ ...inputStyle, color: "var(--text-secondary)" }} />
                </div>
                <button type="button" title="앨리먼트 삭제" onClick={() => removeElement(element.id)} style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: "transparent", color: "var(--text-muted)" }}>
                  <Trash2 size={13} />
                </button>
              </div>

              <textarea value={element.description} onChange={(event) => updateElement(element.id, { description: event.target.value })} style={textareaStyle} />

              {element.sheetImageUrl ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <img src={element.sheetImageUrl} alt={`${element.name} 전개도`} style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border-node)", backgroundColor: "white" }} />
                  <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>전면 · 좌측면 · 우측면 · 후면 기준 이미지</div>
                </div>
              ) : null}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: element.sheetStatus === "ready" ? PORT_COLOR : element.sheetStatus === "failed" ? "var(--port-constraint)" : "var(--text-muted)" }}>
                  {getStatusLabel(element.sheetStatus)}
                </span>
                <button
                  type="button"
                  onClick={() => data.onGenerateSheet(element.id)}
                  disabled={element.sheetStatus === "generating"}
                  style={{
                    height: 30,
                    padding: "0 10px",
                    borderRadius: 999,
                    border: `1px solid color-mix(in srgb, ${PORT_COLOR} 50%, var(--border-node))`,
                    backgroundColor: `color-mix(in srgb, ${PORT_COLOR} 12%, transparent)`,
                    color: "var(--text-primary)",
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: element.sheetStatus === "generating" ? "default" : "pointer",
                  }}
                >
                  <ImagePlus size={13} />
                  {element.sheetStatus === "ready" ? "다시 생성" : "전개도 생성"}
                </button>
              </div>
            </div>
          ))
        )}

        {data.board.rules.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: 10, borderRadius: 10, backgroundColor: "color-mix(in srgb, var(--bg-node-header) 65%, transparent)" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "var(--text-secondary)" }}>유지 규칙</span>
            <span style={{ fontSize: 11, lineHeight: 1.5, color: "var(--text-primary)" }}>{data.board.rules.join(" · ")}</span>
          </div>
        )}

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
