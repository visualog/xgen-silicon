import React, { useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { animate } from 'animejs';
import { Image as ImageIcon, Download, Loader2 } from 'lucide-react';

const nodeStyle = {
  backgroundColor: 'color-mix(in srgb, var(--bg-node-base) 5%, transparent)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '12px',
  border: 'none',
  width: '320px',
  display: 'flex',
  flexDirection: 'column' as const,
  boxShadow: 'var(--shadow-node)',
};

const headerStyle = {
  backgroundColor: 'var(--bg-node-header)',
  padding: '8px 12px',
  borderBottom: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
};

const titleStyle = {
  fontSize: '12px',
  fontWeight: 600 as const,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const bodyStyle = {
  padding: '12px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px',
};

const canvasCardStyle = {
  backgroundColor: 'var(--bg-canvas)',
  borderRadius: '12px',
  border: '1px solid var(--border-node)',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative' as const,
  width: '100%',
  aspectRatio: '1',
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'contain' as const,
  transition: 'opacity 0.4s ease',
};

const placeholderStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '12px',
  userSelect: 'none' as const,
};

const placeholderIconStyle = {
  width: '56px',
  height: '56px',
  backgroundColor: 'var(--bg-node-base)',
  borderRadius: '16px',
  border: '1px solid var(--border-node)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  color: 'var(--text-muted)',
};

function toAspectRatioValue(ratio: string | undefined) {
  if (!ratio || !ratio.includes(':')) return '1 / 1';
  const [width, height] = ratio.split(':').map((value) => value.trim());
  return `${width} / ${height}`;
}

type CanvasNodeData = {
  imageUrl?: string | null;
  isGenerating?: boolean;
  error?: boolean;
  ratio?: string;
  generateElapsedLabel?: string | null;
  lastGenerateDurationLabel?: string | null;
  onPreviewImage?: (imageUrl: string) => void;
};

export function CanvasNode({ data }: { data: CanvasNodeData }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const {
    imageUrl,
    isGenerating = false,
    error = false,
    ratio = '1:1',
    generateElapsedLabel = null,
    lastGenerateDurationLabel = null,
    onPreviewImage,
  } = data;
  const aspectRatio = toAspectRatioValue(ratio);

  useEffect(() => {
    if (nodeRef.current) {
      // User requested animejs with cubic-bezier/inout easing
      animate(nodeRef.current, {
        opacity: [0, 1],
        scale: [0.8, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'inOutCubic',
      });
    }
  }, []);

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `brandgen-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePreview = () => {
    if (!imageUrl || !onPreviewImage) return;
    onPreviewImage(imageUrl);
  };

  return (
    <div ref={nodeRef} style={nodeStyle}>
      <Handle
        type="target"
        position={Position.Left}
        id="canvas-in"
        isConnectable={false}
        style={{
          background: 'var(--text-primary)',
          border: 'none',
          width: '12px',
          height: '12px',
          left: '-6px',
          top: '50%',
        }}
      />
      <div style={headerStyle}>
        <ImageIcon size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>캔버스</span>
        {(isGenerating || lastGenerateDurationLabel) && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isGenerating ? <Loader2 size={12} color="var(--text-secondary)" style={{ animation: 'spin 1s linear infinite' }} /> : null}
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              {isGenerating
                ? `생성 중 ${generateElapsedLabel ?? '0초'}`
                : `완료 ${lastGenerateDurationLabel}`}
            </span>
          </div>
        )}
      </div>

      <div style={bodyStyle}>
        <div style={{ ...canvasCardStyle, aspectRatio }}>
          {isGenerating && (
            <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-node-base)', opacity: 0.8, backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                생성 중… {generateElapsedLabel ?? '0초'}
              </span>
            </div>
          )}

          {error && !isGenerating && (
            <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-node-base)', opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <span style={{ fontSize: '13px', color: '#ef4444' }}>생성 실패</span>
            </div>
          )}

          {imageUrl && !error ? (
            <button
              type="button"
              onClick={handlePreview}
              title="이미지 크게 보기"
              className="nodrag"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                padding: 0,
                background: 'transparent',
                cursor: 'zoom-in',
              }}
            >
              <img src={imageUrl} alt="Result" style={{ ...imageStyle, opacity: isGenerating ? 0.2 : 1 }} />
            </button>
          ) : !isGenerating && !error ? (
            <div style={placeholderStyle}>
              <div style={placeholderIconStyle}>✦</div>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.7' }}>
                결과물이<br />여기에 표시됩니다
              </p>
            </div>
          ) : null}
        </div>

        {imageUrl && !isGenerating && !error && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px', gap: '8px' }}>
            <button
              onClick={handlePreview}
              title="원본 크기로 보기"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-node-base)',
                color: 'var(--text-primary)',
                flex: 1,
                height: '42px',
                borderRadius: '100px',
                border: '1px solid var(--border-node)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              크게 보기
            </button>
            <button
              onClick={handleDownload}
              title="다운로드"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-node-base)',
                color: 'var(--text-primary)',
                flex: 1,
                height: '42px',
                borderRadius: '100px',
                border: '1px solid var(--border-node)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              <Download size={18} /> 이미지 다운로드
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
