import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Image as ImageIcon, Download, Expand, Loader2 } from 'lucide-react';

const nodeStyle = {
  backgroundColor: 'color-mix(in srgb, var(--bg-node-base) 5%, transparent)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: 'var(--ui-radius-xl)',
  border: 'none',
  width: '420px',
  display: 'flex',
  flexDirection: 'column' as const,
  boxShadow: 'var(--ui-shadow-node)',
  position: 'relative' as const,
  overflow: 'visible' as const,
};

const headerStyle = {
  backgroundColor: 'var(--bg-node-header)',
  padding: 'var(--ui-space-8) var(--ui-space-12)',
  borderBottom: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--ui-space-8)',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
};

const titleStyle = {
  fontSize: 'var(--ui-type-xs-2-size)',
  fontWeight: 600 as const,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const bodyStyle = {
  padding: 'var(--ui-space-12)',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 'var(--ui-space-12)',
};

const canvasCardStyle = {
  backgroundColor: 'var(--bg-canvas)',
  borderRadius: 'var(--ui-radius-xl)',
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
  gap: 'var(--ui-space-12)',
  userSelect: 'none' as const,
};

const placeholderIconStyle = {
  width: 'var(--size-empty-icon)',
  height: 'var(--size-empty-icon)',
  backgroundColor: 'var(--bg-node-base)',
  borderRadius: 'var(--ui-radius-2xl)',
  border: '1px solid var(--border-node)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'calc(var(--ui-type-xl-size) * 1.2)',
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
  errorMessage?: string;
  ratio?: string;
  title?: string;
  generateElapsedLabel?: string | null;
  lastGenerateDurationLabel?: string | null;
  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
    cachedInputTokens: number;
    totalTokens: number;
  } | null;
  tokenUsageBreakdown?: {
    label: string;
    inputTokens: number;
    outputTokens: number;
    cachedInputTokens: number;
    totalTokens: number;
  }[];
  onPreviewImage?: (imageUrl: string) => void;
};

function formatTokenCount(value: number | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString('ko-KR') : '0';
}

export function CanvasNode({ data }: { data: CanvasNodeData }) {
  const {
    imageUrl,
    isGenerating = false,
    error = false,
    errorMessage = "",
    ratio = '1:1',
    title = '캔버스',
    generateElapsedLabel = null,
    lastGenerateDurationLabel = null,
    tokenUsage = null,
    tokenUsageBreakdown = [],
    onPreviewImage,
  } = data;
  const aspectRatio = toAspectRatioValue(ratio);

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `xgen-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePreview = () => {
    if (!imageUrl || !onPreviewImage) return;
    onPreviewImage(imageUrl);
  };

  return (
    <div style={nodeStyle}>
      <Handle
        type="target"
        position={Position.Left}
        id="canvas-in"
        isConnectable={false}
        style={{
          background: 'transparent',
          border: 'none',
          width: 'var(--size-port-dot)',
          height: 'var(--size-port-dot)',
          left: 0,
          top: 'calc(50% - var(--size-port-dot) / 2)',
          transform: 'none',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 'calc(var(--size-port-dot) / -2)',
          top: 'calc(50% - var(--size-port-dot) / 2)',
          width: 'var(--size-port-dot)',
          height: 'var(--size-port-dot)',
          borderRadius: '50%',
          background: 'var(--text-primary)',
          border: '2px solid var(--bg-node-base)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="canvas-out"
        isConnectable={true}
        style={{
          background: 'transparent',
          border: 'none',
          width: 'var(--size-port-dot)',
          height: 'var(--size-port-dot)',
          right: 0,
          top: 'calc(50% - var(--size-port-dot) / 2)',
          transform: 'none',
        }}
      />
      {imageUrl ? (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 'calc(var(--size-port-dot) / -2)',
            top: 'calc(50% - var(--size-port-dot) / 2)',
            width: 'var(--size-port-dot)',
            height: 'var(--size-port-dot)',
            borderRadius: '50%',
            background: 'var(--text-primary)',
            border: '2px solid var(--bg-node-base)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      ) : null}
      <div style={headerStyle}>
        <ImageIcon size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>{title}</span>
        {(isGenerating || lastGenerateDurationLabel) && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'calc(var(--ui-space-unit) * 1.5)' }}>
            {isGenerating ? <Loader2 size={12} color="var(--text-secondary)" style={{ animation: 'spin 1s linear infinite' }} /> : null}
            <span style={{ fontSize: 'var(--ui-type-xs-size)', color: 'var(--text-secondary)' }}>
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
              <span style={{ fontSize: 'var(--ui-type-sm-size)', fontWeight: 500, color: 'var(--text-primary)' }}>
                생성 중… {generateElapsedLabel ?? '0초'}
              </span>
            </div>
          )}

          {error && !isGenerating && (
            <div style={{ position: 'absolute', inset: 0, background: 'color-mix(in srgb, var(--bg-node-base) 94%, transparent)', display: 'flex', flexDirection: 'column', gap: 'var(--ui-space-8)', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: 'var(--ui-space-20)', textAlign: 'center' }}>
              <span style={{ fontSize: 'var(--ui-type-sm-size)', fontWeight: 850, color: 'var(--port-constraint)' }}>생성 실패</span>
              <span style={{ maxWidth: '28ch', fontSize: 'var(--ui-type-xs-2-size)', lineHeight: 1.6, color: 'var(--text-secondary)', wordBreak: 'keep-all', overflowWrap: 'anywhere' }}>
                {errorMessage || '원인을 알 수 없는 오류가 발생했습니다.'}
              </span>
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
              <p style={{ fontSize: 'var(--ui-type-sm-6-size)', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.7' }}>
                결과물이<br />여기에 표시됩니다
              </p>
            </div>
          ) : null}
        </div>

        {imageUrl && !isGenerating && !error && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', gap: 'var(--ui-space-8)' }}>
              <button
                onClick={handlePreview}
                title="원본 크기로 보기"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-node-base)',
                  color: 'var(--text-primary)',
                  flex: '0 0 auto',
                  width: 'max-content',
                  height: 'var(--size-control-input-lg)',
                  borderRadius: 'var(--ui-radius-pill)',
                  border: '1px solid var(--border-node)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  gap: 'var(--ui-space-8)',
                  fontSize: 'var(--ui-type-sm-6-size)',
                  fontWeight: 600,
                  padding: '0 var(--ui-space-16)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Expand size={16} /> 크게 보기
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
                  flex: '1 1 auto',
                  minWidth: 0,
                  height: 'var(--size-control-input-lg)',
                  borderRadius: 'var(--ui-radius-pill)',
                  border: '1px solid var(--border-node)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  gap: 'var(--ui-space-8)',
                  fontSize: 'var(--ui-type-sm-6-size)',
                  fontWeight: 600,
                  padding: '0 var(--ui-space-16)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Download size={18} /> 이미지 다운로드
              </button>
            </div>

            {tokenUsage ? (
              <div
                style={{
                  border: '1px solid var(--border-node)',
                  borderRadius: 'var(--ui-radius-xl)',
                  backgroundColor: 'var(--bg-canvas)',
                  padding: 'var(--ui-space-10)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--ui-space-8)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--ui-space-8)' }}>
                  <span style={{ fontSize: 'var(--ui-type-xs-size)', color: 'var(--text-secondary)', fontWeight: 850 }}>
                    사용 토큰
                  </span>
                  <strong style={{ fontSize: 'var(--ui-type-sm-6-size)', color: 'var(--text-primary)' }}>
                    {formatTokenCount(tokenUsage.totalTokens)}
                  </strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'calc(var(--ui-space-unit) * 1.5)' }}>
                  {[
                    ['입력', tokenUsage.inputTokens],
                    ['출력', tokenUsage.outputTokens],
                    ['캐시', tokenUsage.cachedInputTokens],
                  ].map(([label, value]) => (
                    <div key={label} style={{ borderRadius: 'var(--ui-radius-lg)', backgroundColor: 'var(--bg-node-base)', padding: 'var(--ui-space-6) var(--ui-space-8)' }}>
                      <div style={{ fontSize: 'var(--ui-type-xs-size)', color: 'var(--text-muted)', fontWeight: 700 }}>{label}</div>
                      <div style={{ fontSize: 'var(--ui-type-xs-2-size)', color: 'var(--text-primary)', fontWeight: 850 }}>{formatTokenCount(value as number)}</div>
                    </div>
                  ))}
                </div>
                {tokenUsageBreakdown.length ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-space-4)' }}>
                    {tokenUsageBreakdown.map((item) => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--ui-space-10)', color: 'var(--text-secondary)', fontSize: 'var(--ui-type-xs-size)', lineHeight: 1.45 }}>
                        <span>{item.label}</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{formatTokenCount(item.totalTokens)}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
