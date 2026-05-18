import { Handle, Position, useEdges, useReactFlow } from '@xyflow/react';
import React, { useState } from 'react';
import { TextSelect, Play, X, Loader2 } from 'lucide-react';

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



const promptTextAreaStyle = {
  width: '100%',
  backgroundColor: 'var(--bg-canvas)',
  borderRadius: '8px',
  border: '1px solid var(--border-node)',
  color: 'var(--text-primary)',
  fontSize: '12px',
  lineHeight: '1.5',
  padding: '12px',
  resize: 'none' as const,
  outline: 'none',
  minHeight: '80px',
  fontFamily: 'monospace',
  cursor: 'default',
  userSelect: 'none' as const,
  pointerEvents: 'none' as const,
};

const labelStyle = {
  fontSize: '11px',
  color: 'var(--text-secondary)',
  marginBottom: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export function OutputNode({ data, isConnectable }: any) {
  const { setEdges } = useReactFlow();
  const { prompt, style, ratio, resolution, englishPrompt, isTranslating, onGenerate, canGenerate, isGenerating } = data;

  const [hoverPrompt, setHoverPrompt] = useState(false);
  const [hoverStyle, setHoverStyle] = useState(false);
  const [hoverRatio, setHoverRatio] = useState(false);
  const [hoverRes, setHoverRes] = useState(false);

  const handleDisconnect = (handleId: string) => {
    setEdges((eds) => eds.filter(e => !(e.target === 'output-node' && e.targetHandle === handleId)));
  };

  const edges = useEdges();
  const id = "output-node";
  
  const isPromptConnected = edges.some(e => e.target === id && e.source === 'prompt-node');
  const isStyleConnected = edges.some(e => e.target === id && e.source === 'style-node');
  const isRatioConnected = edges.some(e => e.target === id && e.source === 'ratio-node');
  const isResConnected = edges.some(e => e.target === id && e.source === 'resolution-node');
  const getMixedColor = () => {
    const activeColors = [];
    if (isPromptConnected) activeColors.push('var(--port-prompt)');
    if (isStyleConnected) activeColors.push('var(--port-style)');
    if (isRatioConnected) activeColors.push('var(--port-ratio)');
    if (isResConnected) activeColors.push('var(--port-resolution)');

    if (activeColors.length === 0) return 'transparent';
    if (activeColors.length === 1) return activeColors[0];

    // Nested color-mix to blend all active colors
    let mixed = activeColors[0];
    for (let i = 1; i < activeColors.length; i++) {
      mixed = `color-mix(in srgb, ${mixed}, ${activeColors[i]})`;
    }
    return mixed;
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleDisconnectAll = () => {
    setEdges((eds) => eds.filter(e => e.target !== id));
  };

  const isAnyConnected = isPromptConnected || isStyleConnected || isRatioConnected || isResConnected;

  return (
    <div style={nodeStyle}>
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
      <div style={headerStyle}>
        <TextSelect size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>프롬프트</span>
      </div>

      <div style={bodyStyle}>
      {/* Left Edge Connection Dot (Merged) */}
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
            border: isAnyConnected ? `4px solid ${isHovered ? 'var(--text-primary)' : 'var(--bg-node-base)'}` : `2px dashed var(--border-node)`,
            boxShadow: isAnyConnected ? 'var(--shadow-node)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isAnyConnected ? 'pointer' : 'crosshair',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative'
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
                top: 'auto'
              }}
            />
          )}
          {/* 시각적 피드백: 연결 안 됐을 때의 작은 점 */}
          {!isAnyConnected && (
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-node)' }} />
          )}
        </div>
      </div>

        {/* Assembled Prompt Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={labelStyle}>
              <span>한글 요약</span>
            </div>
            <textarea
              readOnly
              style={promptTextAreaStyle}
              value={
                (isPromptConnected && prompt ? `[설명] ${prompt}\n` : '') +
                (isStyleConnected && style ? `[스타일] ${style.startsWith('data:image') ? '[이미지 참조 스타일]' : style}\n` : '') +
                (isRatioConnected && ratio ? `[비율] ${ratio}\n` : '') +
                (isResConnected && resolution ? `[해상도] ${resolution}\n` : '') || '입력된 데이터가 없습니다.'
              }
            />
          </div>

          <div>
            <div style={labelStyle}>
              <span>영문 변환 프롬프트 (Exaone 3.5)</span>
              {isTranslating && <Loader2 size={12} className="animate-spin text-muted-foreground" />}
            </div>
            <textarea
              readOnly
              style={{ ...promptTextAreaStyle, minHeight: '100px', borderColor: isAnyConnected && englishPrompt ? 'var(--port-ratio)' : 'var(--border-node)' }}
              value={isAnyConnected ? (englishPrompt || (isTranslating ? '번역 중...' : '번역된 프롬프트 대기 중...')) : '연결된 데이터가 없습니다.'}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' }} className="nodrag">
          <button
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            style={{
              flex: 1,
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
            }}
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
            {isGenerating ? "생성 중..." : "이미지 생성"}
          </button>
        </div>
      </div>
    </div>
  );
}
