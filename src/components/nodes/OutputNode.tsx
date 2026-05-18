import { Handle, Position, useEdges, useReactFlow } from '@xyflow/react';
import React, { useState } from 'react';
import { Wand2, Play, X, Loader2, Sparkles } from 'lucide-react';

const nodeStyle = {
  backgroundColor: 'color-mix(in srgb, var(--bg-node-base) 5%, transparent)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '12px',
  border: 'none',
  width: '380px',
  display: 'flex',
  flexDirection: 'column' as const,
  boxShadow: 'var(--shadow-node)',
};

const headerStyle = {
  backgroundColor: 'var(--bg-node-header)',
  padding: '8px 12px',
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
  gap: '10px',
};

export function OutputNode({ data }: any) {
  const { setEdges } = useReactFlow();
  const { englishPrompt, isTranslating, onGenerate, canGenerate, isGenerating } = data;

  const [isHovered, setIsHovered] = useState(false);

  const edges = useEdges();
  const id = "output-node";

  const isPromptConnected  = edges.some(e => e.target === id && e.source === 'prompt-node');
  const isStyleConnected   = edges.some(e => e.target === id && e.source === 'style-node');
  const isRatioConnected   = edges.some(e => e.target === id && e.source === 'ratio-node');
  const isResConnected     = edges.some(e => e.target === id && e.source === 'resolution-node');
  const isAnyConnected     = isPromptConnected || isStyleConnected || isRatioConnected || isResConnected;

  const getMixedColor = () => {
    const colors = [];
    if (isPromptConnected) colors.push('var(--port-prompt)');
    if (isStyleConnected)  colors.push('var(--port-style)');
    if (isRatioConnected)  colors.push('var(--port-ratio)');
    if (isResConnected)    colors.push('var(--port-resolution)');
    if (colors.length === 0) return 'transparent';
    if (colors.length === 1) return colors[0];
    let mixed = colors[0];
    for (let i = 1; i < colors.length; i++) {
      mixed = `color-mix(in srgb, ${mixed}, ${colors[i]})`;
    }
    return mixed;
  };

  const handleDisconnectAll = () => {
    setEdges(eds => eds.filter(e => e.target !== id));
  };

  // 연결된 파라미터 태그 목록
  const connectedTags = [
    isPromptConnected && { label: '설명', color: 'var(--port-prompt)' },
    isStyleConnected  && { label: '스타일', color: 'var(--port-style)' },
    isRatioConnected  && { label: '비율', color: 'var(--port-ratio)' },
    isResConnected    && { label: '해상도', color: 'var(--port-resolution)' },
  ].filter(Boolean) as { label: string; color: string }[];

  const hasPrompt = isAnyConnected && !!englishPrompt;

  return (
    <div style={nodeStyle}>
      {/* 오른쪽 출력 핸들 */}
      <Handle
        type="source"
        position={Position.Right}
        id="output-out"
        isConnectable={false}
        style={{
          background: 'var(--text-primary)',
          border: 'none',
          width: '12px',
          height: '12px',
          right: '-6px',
          top: '50%',
        }}
      />

      {/* 헤더 */}
      <div style={headerStyle}>
        <Wand2 size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>프롬프트</span>
        {isTranslating && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Loader2 size={12} color="var(--text-secondary)" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Gemini 생성 중</span>
          </div>
        )}
      </div>

      <div style={bodyStyle}>
        {/* 왼쪽 통합 입력점 */}
        <div
          style={{ position: 'absolute', left: '-12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={isAnyConnected ? handleDisconnectAll : undefined}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: isAnyConnected ? (isHovered ? 'var(--bg-node-base)' : getMixedColor()) : 'var(--bg-canvas)',
              border: isAnyConnected ? `4px solid ${isHovered ? 'var(--text-primary)' : 'var(--bg-node-base)'}` : '2px dashed var(--border-node)',
              boxShadow: isAnyConnected ? 'var(--shadow-node)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isAnyConnected ? 'pointer' : 'crosshair',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
            }}
          >
            {isAnyConnected && isHovered ? (
              <X size={14} color="var(--text-primary)" strokeWidth={3} />
            ) : (
              <Handle
                type="target"
                position={Position.Left}
                id="general-in"
                isConnectable={true}
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                  border: 'none',
                  opacity: 0,
                  cursor: 'crosshair',
                  position: 'absolute',
                  inset: 0,
                  transform: 'none',
                  left: 'auto',
                  top: 'auto',
                }}
              />
            )}
            {!isAnyConnected && (
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-node)' }} />
            )}
          </div>
        </div>

        {/* 연결된 파라미터 태그 */}
        {connectedTags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px' }}>
            {connectedTags.map(tag => (
              <span
                key={tag.label}
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '100px',
                  backgroundColor: `color-mix(in srgb, ${tag.color} 15%, transparent)`,
                  color: tag.color,
                  border: `1px solid color-mix(in srgb, ${tag.color} 40%, transparent)`,
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase' as const,
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {/* 생성된 프롬프트 영역 */}
        <div
          style={{
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: '8px',
            border: `1px solid ${hasPrompt ? `color-mix(in srgb, ${getMixedColor()} 50%, var(--border-node))` : 'var(--border-node)'}`,
            padding: '12px',
            minHeight: '220px',
            position: 'relative',
            transition: 'border-color 0.3s ease',
          }}
        >
          {/* 빈 상태 */}
          {!isAnyConnected && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', height: '196px', gap: '8px' }}>
              <Sparkles size={20} color="var(--text-muted)" />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' as const }}>
                노드를 연결하면<br />AI 프롬프트가 생성됩니다
              </span>
            </div>
          )}

          {/* 생성 중 */}
          {isAnyConnected && isTranslating && !englishPrompt && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', height: '196px', gap: '8px' }}>
              <Loader2 size={20} color="var(--text-secondary)" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Gemini가 프롬프트 생성 중...</span>
            </div>
          )}

          {/* 생성된 영문 프롬프트 */}
          {isAnyConnected && englishPrompt && (
            <p
              style={{
                fontSize: '11px',
                lineHeight: '1.7',
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: 'monospace',
                wordBreak: 'break-word' as const,
                userSelect: 'text' as const,
              }}
            >
              {englishPrompt}
            </p>
          )}

          {/* 연결은 됐지만 아직 프롬프트 없는 경우 */}
          {isAnyConnected && !isTranslating && !englishPrompt && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '196px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>입력을 기다리는 중...</span>
            </div>
          )}
        </div>

        {/* 이미지 생성 버튼 */}
        <button
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className="nodrag"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: (!canGenerate || isGenerating) ? 'var(--bg-node-base)' : 'var(--text-primary)',
            color: (!canGenerate || isGenerating) ? 'var(--text-muted)' : 'var(--bg-node-base)',
            padding: '12px 16px',
            borderRadius: '100px',
            fontWeight: 600,
            fontSize: '14px',
            border: (!canGenerate || isGenerating) ? '1px solid var(--border-node)' : 'none',
            cursor: (!canGenerate || isGenerating) ? 'not-allowed' : 'pointer',
            transition: 'all 0.18s ease',
            width: '100%',
          }}
        >
          {isGenerating
            ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> 생성 중...</>
            : <><Play size={16} fill="currentColor" /> 이미지 생성</>
          }
        </button>
      </div>
    </div>
  );
}
