import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Eye, Layers, Maximize2 } from "lucide-react";

const nodeStyle = {
  backgroundColor: "color-mix(in srgb, var(--bg-node-base) 5%, transparent)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: "var(--ui-radius-xl)",
  border: "none",
  width: "300px",
  display: "flex",
  flexDirection: "column" as const,
  boxShadow: "var(--ui-shadow-node)",
  position: "relative" as const,
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
  fontWeight: 600,
  color: "var(--text-secondary)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

type ImageLayerNodeData = {
  imageUrl?: string | null;
  title?: string;
  layerName?: string;
  onPreviewImage?: (imageUrl: string) => void;
};

export function ImageLayerNode({ data }: { data: ImageLayerNodeData }) {
  const {
    imageUrl,
    title = "생성 이미지 레이어",
    layerName = "Generated layer",
    onPreviewImage,
  } = data;

  const previewImage = () => {
    if (!imageUrl || !onPreviewImage) return;
    onPreviewImage(imageUrl);
  };

  return (
    <div style={nodeStyle}>
      <Handle
        type="target"
        position={Position.Left}
        id="layer-in"
        isConnectable={false}
        style={{
          background: "transparent",
          border: "none",
          width: "var(--size-port-dot)",
          height: "var(--size-port-dot)",
          left: 0,
          top: "calc(50% - var(--size-port-dot) / 2)",
          transform: "none",
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
          background: "var(--port-image-mix)",
          border: "2px solid var(--bg-node-base)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="layer-out"
        isConnectable={true}
        style={{
          background: "transparent",
          border: "none",
          width: "var(--size-port-dot)",
          height: "var(--size-port-dot)",
          right: 0,
          top: "calc(50% - var(--size-port-dot) / 2)",
          transform: "none",
        }}
      />
      {imageUrl ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "calc(var(--size-port-dot) / -2)",
            top: "calc(50% - var(--size-port-dot) / 2)",
            width: "var(--size-port-dot)",
            height: "var(--size-port-dot)",
            borderRadius: "50%",
            background: "var(--port-image-mix)",
            border: "2px solid var(--bg-node-base)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      ) : null}

      <div style={headerStyle}>
        <Layers size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>{title}</span>
      </div>

      <div style={{ padding: "var(--ui-space-12)", display: "grid", gap: "var(--ui-space-10)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px minmax(0, 1fr)",
            gap: "var(--ui-space-10)",
            alignItems: "center",
            border: "1px solid var(--border-node)",
            borderRadius: "var(--ui-space-10)",
            background: "var(--bg-canvas)",
            padding: "var(--ui-space-8)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--ui-space-8)",
              overflow: "hidden",
              background: "var(--bg-node-base)",
              display: "grid",
              placeItems: "center",
            }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Eye size={15} color="var(--text-muted)" />
            )}
          </div>
          <div style={{ minWidth: 0, display: "grid", gap: "calc(var(--ui-space-unit) * 0.75)" }}>
            <span style={{ color: "var(--text-primary)", fontSize: "var(--ui-type-xs-2-size)", fontWeight: 850, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {layerName}
            </span>
            <span style={{ color: "var(--text-secondary)", fontSize: "var(--ui-type-xs-size)", lineHeight: 1.45 }}>
              생성 결과를 다음 작업의 이미지 레이어로 사용합니다.
            </span>
          </div>
        </div>

        <button
          type="button"
          className="nodrag"
          disabled={!imageUrl}
          onClick={previewImage}
          title="레이어 크게 보기"
          style={{
            height: "var(--size-control-input-lg)",
            borderRadius: "var(--ui-radius-pill)",
            border: "1px solid var(--border-node)",
            background: "var(--bg-node-base)",
            color: "var(--text-primary)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--ui-space-8)",
            fontSize: "var(--ui-type-sm-6-size)",
            fontWeight: 750,
            opacity: imageUrl ? 1 : 0.45,
          }}
        >
          <Maximize2 size={15} /> 레이어 보기
        </button>
      </div>
    </div>
  );
}
