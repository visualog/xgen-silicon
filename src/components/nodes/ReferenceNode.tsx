"use client";

import { Handle, Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import React, { useState } from "react";
import { Cuboid, Plus, Trash2, UserRound, X } from "lucide-react";
import { StyleAddModal } from "@/components/StyleAddModal";
import type { StyleEntry } from "@/components/StyleAddModal";

type ReferenceKind = "character" | "object";

type ReferenceNodeData = {
  references: StyleEntry[];
  activeReferenceId: string | null;
  setReferences: React.Dispatch<React.SetStateAction<StyleEntry[]>>;
  setActiveReferenceId: (value: string | null) => void;
  onRemove: () => void;
  kind: ReferenceKind;
};

const COPY = {
  character: {
    title: "캐릭터 참조",
    empty: "일관성을 유지할 캐릭터 이미지를 등록하세요",
    output: "캐릭터 출력",
    selected: "선택됨",
    handleId: "character-reference-out",
    color: "var(--port-character-reference)",
    icon: UserRound,
  },
  object: {
    title: "오브젝트 참조",
    empty: "반복 등장할 제품이나 소품 이미지를 등록하세요",
    output: "오브젝트 출력",
    selected: "선택됨",
    handleId: "object-reference-out",
    color: "var(--port-object-reference)",
    icon: Cuboid,
  },
} as const;

const nodeStyle = {
  backgroundColor: "color-mix(in srgb, var(--bg-node-base) 5%, transparent)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: "var(--ui-radius-xl)",
  border: "none",
  width: "var(--size-node-reference)",
  display: "flex",
  flexDirection: "column" as const,
  boxShadow: "var(--ui-shadow-node)",
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

const titleStyle = {
  fontSize: "var(--ui-type-xs-2-size)",
  fontWeight: 600 as const,
  color: "var(--text-secondary)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

export function ReferenceNode({ id, data }: { id: string; data: ReferenceNodeData }) {
  const copy = COPY[data.kind];
  const Icon = copy.icon;
  const { setEdges } = useReactFlow();
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const connections = useNodeConnections({ handleType: "source", handleId: copy.handleId });
  const isConnected = connections.length > 0;
  const activeReference = data.references.find((entry) => entry.id === data.activeReferenceId);

  const handleAdd = (entry: StyleEntry) => {
    data.setReferences((prev) => [...prev, entry]);
    data.setActiveReferenceId(entry.id);
  };

  const handleDelete = (event: React.MouseEvent, referenceId: string) => {
    event.stopPropagation();
    data.setReferences((prev) => prev.filter((entry) => entry.id !== referenceId));
    if (data.activeReferenceId === referenceId) data.setActiveReferenceId(null);
  };

  const handleReferenceModeChange = (
    event: React.SyntheticEvent,
    referenceId: string,
    useImageReference: boolean,
  ) => {
    event.stopPropagation();
    data.setReferences((prev) =>
      prev.map((entry) =>
        entry.id === referenceId
          ? { ...entry, referenceMode: useImageReference ? "image-reference" : "text-only" }
          : entry,
      ),
    );
    data.setActiveReferenceId(referenceId);
  };

  const handleDisconnect = () => {
    setEdges((eds) => eds.filter((edge) => !(edge.source === id && edge.sourceHandle === copy.handleId)));
  };

  return (
    <>
      {showModal && (
        <StyleAddModal
          mode={data.kind}
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}
      <div style={nodeStyle}>
        <div style={headerStyle}>
          <Icon size={16} color="var(--text-secondary)" />
          <span style={titleStyle}>{copy.title}</span>
          {activeReference && (
            <span style={{ marginLeft: "auto", fontSize: "var(--ui-type-xs-size)", fontWeight: 700, color: copy.color, backgroundColor: `color-mix(in srgb, ${copy.color} 12%, transparent)`, padding: "calc(var(--ui-space-unit) * 0.5) var(--ui-space-8)", borderRadius: "var(--ui-radius-pill)" }}>
              {copy.selected}
            </span>
          )}
          <button type="button" onClick={data.onRemove} className="nodrag" title={`${copy.title} 노드 제거`} style={{ width: "var(--size-control-sm)", height: "var(--size-control-sm)", borderRadius: "var(--ui-radius-pill)", border: "none", backgroundColor: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Trash2 size={12} />
          </button>
        </div>
        <div style={{ padding: "var(--ui-space-12)", display: "flex", flexDirection: "column", gap: "var(--ui-space-8)" }}>
          {data.references.length > 0 ? (
            <div className="nodrag" style={{ display: "flex", flexDirection: "column", gap: "calc(var(--ui-space-unit) * 1.5)" }}>
              {data.references.map((entry) => {
                const isActive = entry.id === data.activeReferenceId;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => data.setActiveReferenceId(isActive ? null : entry.id)}
                    style={{ display: "grid", gridTemplateColumns: "var(--size-icon-container) minmax(0, 1fr)", gap: "var(--ui-space-10)", alignItems: "flex-start", padding: "var(--ui-space-8)", paddingRight: "var(--ui-space-24)", borderRadius: "var(--ui-space-8)", border: `1.5px solid ${isActive ? copy.color : "var(--border-node)"}`, backgroundColor: isActive ? `color-mix(in srgb, ${copy.color} 8%, transparent)` : "var(--bg-canvas)", color: "inherit", cursor: "pointer", textAlign: "left", position: "relative" }}
                  >
                    <span style={{ width: "var(--size-icon-container)", height: "var(--size-icon-container)", borderRadius: "var(--ui-radius-md)", overflow: "hidden", flexShrink: 0, backgroundColor: "var(--bg-node-header)" }}>
                      <img src={entry.imageUrl} alt={entry.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </span>
                    <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--ui-space-6)" }}>
                      <span style={{ minWidth: 0, fontSize: "var(--ui-type-xs-size)", lineHeight: 1.5, color: isActive ? "var(--text-primary)" : "var(--text-secondary)", display: "-webkit-box", WebkitLineClamp: data.kind === "character" ? 2 : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {entry.prompt || "참조 프롬프트 없음"}
                      </span>
                      {data.kind === "character" && (
                        <label
                          className="nodrag"
                          title={entry.imageUrl ? "체크하면 첨부 이미지를 실제 캐릭터 참조로 함께 보냅니다" : "이미지가 있어야 활성화됩니다"}
                          onClick={(event) => event.stopPropagation()}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--ui-space-6)",
                            width: "fit-content",
                            minHeight: 24,
                            padding: "var(--ui-space-4) var(--ui-space-8)",
                            borderRadius: "var(--ui-radius-pill)",
                            border: `1px solid ${(entry.referenceMode || "text-only") === "image-reference" ? copy.color : "var(--border-node)"}`,
                            backgroundColor: (entry.referenceMode || "text-only") === "image-reference"
                              ? `color-mix(in srgb, ${copy.color} 10%, transparent)`
                              : "var(--bg-node-header)",
                            color: entry.imageUrl ? "var(--text-secondary)" : "var(--text-muted)",
                            cursor: entry.imageUrl ? "pointer" : "not-allowed",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={(entry.referenceMode || "text-only") === "image-reference"}
                            disabled={!entry.imageUrl}
                            onChange={(event) => handleReferenceModeChange(event, entry.id, event.target.checked)}
                            style={{ margin: 0, accentColor: copy.color }}
                          />
                          <span style={{ fontSize: "calc(var(--ui-type-xs-size) * 0.96)", fontWeight: 800, color: (entry.referenceMode || "text-only") === "image-reference" ? copy.color : "var(--text-secondary)", whiteSpace: "nowrap" }}>
                            이미지 참조
                          </span>
                        </label>
                      )}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) => handleDelete(event, entry.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") handleDelete(event as unknown as React.MouseEvent, entry.id);
                      }}
                      style={{ position: "absolute", top: "calc(var(--size-port-dot) / 2)", right: "calc(var(--size-port-dot) / 2)", width: "var(--size-control-xs)", height: "var(--size-control-xs)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.58 }}
                    >
                      <Trash2 size={11} color="var(--text-secondary)" />
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: "calc(var(--ui-space-unit) * 4.5) var(--ui-space-12)", textAlign: "center", color: "var(--text-muted)", fontSize: "calc(var(--ui-type-xs-size) * 1.1)", lineHeight: 1.5 }}>
              <Icon size={24} color="var(--border-node)" style={{ marginBottom: 8 }} />
              <p style={{ margin: 0 }}>{copy.empty}</p>
            </div>
          )}
          <button type="button" className="nodrag" onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "calc(var(--ui-space-unit) * 1.5)", width: "100%", padding: "var(--ui-space-8)", borderRadius: "var(--ui-space-8)", border: "1.5px dashed var(--border-node)", backgroundColor: "transparent", color: "var(--text-secondary)", fontSize: "var(--ui-type-xs-2-size)", fontWeight: 600, cursor: "pointer" }}>
            <Plus size={14} /> 추가
          </button>
          <NodeOutputChip color={copy.color} label={copy.output} handleId={copy.handleId} isConnected={isConnected} isHovered={isHovered} onHover={setIsHovered} onClick={isConnected ? handleDisconnect : undefined} />
        </div>
      </div>
    </>
  );
}

function NodeOutputChip({ color, label, handleId, isConnected, isHovered, onHover, onClick }: { color: string; label: string; handleId: string; isConnected: boolean; isHovered: boolean; onHover: (value: boolean) => void; onClick?: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
      <div className="nodrag" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)} onClick={onClick} style={{ display: "flex", alignItems: "center", padding: "var(--ui-space-4) calc(var(--ui-space-unit) * 1.5) var(--ui-space-4) var(--ui-space-10)", borderRadius: "var(--ui-radius-pill)", border: `1px solid ${isConnected ? color : isHovered ? color : "var(--border-node)"}`, backgroundColor: isConnected ? `color-mix(in srgb, ${color} 15%, transparent)` : "var(--bg-canvas)", gap: "calc(var(--ui-space-unit) * 1.5)", cursor: isConnected ? "pointer" : "crosshair", position: "relative" }}>
        <span style={{ fontSize: "var(--ui-type-xs-size)", fontWeight: 700, color: isConnected ? color : "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.3, pointerEvents: "none", zIndex: 1 }}>
          {isConnected && isHovered ? "연결 해제" : label}
        </span>
        <span style={{ width: "var(--size-port-dot)", height: "var(--size-port-dot)", borderRadius: "50%", background: isConnected && isHovered ? "var(--bg-node-base)" : color, border: isConnected && isHovered ? `1px solid ${color}` : "2px solid var(--bg-node-base)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
          {isConnected && isHovered && <X size={8} color={color} strokeWidth={4} />}
        </span>
        <Handle type="source" position={Position.Right} id={handleId} isConnectable={true} style={{ ...(isConnected ? { width: "var(--size-port-dot)", height: "var(--size-port-dot)", right: "calc(var(--size-port-dot) / 2)", top: "calc(50% - var(--size-port-dot) / 2)", transform: "none", pointerEvents: "none", background: "transparent", border: "none" } : { position: "absolute", inset: 0, width: "100%", height: "100%", background: "transparent", border: "none", opacity: 0, zIndex: 10, cursor: "crosshair", pointerEvents: "auto", transform: "none", right: "auto", top: "auto" }) }} />
      </div>
    </div>
  );
}
