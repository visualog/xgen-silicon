import { Handle, Position, useNodeConnections } from '@xyflow/react';
import React, { useCallback } from 'react';
import { Check, Library, MessageSquareText, Plus, X } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

import {
  PROMPT_EXAMPLE_CATEGORY_LABELS,
  PROMPT_EXAMPLES,
  type PromptExampleCategory,
} from '@/lib/prompt-examples';

type PromptNodeData = {
  prompt?: string;
  onChange: (value: string) => void;
};

const nodeStyle = {
  backgroundColor: 'color-mix(in srgb, var(--bg-node-base) 5%, transparent)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: 'var(--ui-radius-xl)',
  border: 'none',
  width: 'var(--size-node-canvas)',
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden',
  boxShadow: 'var(--ui-shadow-node)',
};

const headerStyle = {
  backgroundColor: 'var(--bg-node-header)',
  padding: 'var(--ui-space-8) var(--ui-space-12)',
  borderBottom: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--ui-space-8)',
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

const textareaStyle = {
  width: '100%',
  minHeight: 'calc(var(--size-prompt-min-height) * 0.82)',
  padding: 'var(--ui-space-12)',
  borderRadius: 'var(--ui-space-8)',
  border: 'none',
  backgroundColor: 'var(--bg-canvas)',
  color: 'var(--text-primary)',
  fontSize: 'var(--ui-type-sm-6-size)',
  resize: 'vertical' as const,
  outline: 'none',
  lineHeight: '1.5',
};

const examplePanelStyle = {
  border: '1px solid var(--border-node)',
  borderRadius: 'var(--ui-space-10)',
  backgroundColor: 'var(--bg-canvas)',
  overflow: 'hidden',
};

const exampleHeaderStyle = {
  width: '100%',
  minHeight: 'var(--size-control-input-lg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--ui-space-8)',
  padding: '0 var(--ui-space-10)',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
};

const categoryRowStyle = {
  display: 'flex',
  flexWrap: 'nowrap' as const,
  gap: 'calc(var(--ui-space-unit) * 1.5)',
  padding: 'var(--ui-space-10) var(--ui-space-10) var(--ui-space-6)',
  borderTop: '1px solid var(--border-node)',
  overflowX: 'auto' as const,
};

const exampleListStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 'var(--ui-space-8)',
  maxHeight: '320px',
  overflow: 'auto',
  padding: 'var(--ui-space-10)',
};

const exampleCardStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 'var(--ui-space-8)',
  padding: 'var(--ui-space-10)',
  border: '1px solid var(--border-node)',
  borderRadius: 'var(--ui-space-10)',
  backgroundColor: 'color-mix(in srgb, var(--bg-node-base) 42%, transparent)',
};

const expandedPromptNodeStyle = {
  ...nodeStyle,
  height: '420px',
};

const expandedBodyStyle = {
  ...bodyStyle,
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr) auto',
  height: '383px',
  minHeight: 0,
  overflow: 'hidden',
};

const expandedTextareaStyle = {
  ...textareaStyle,
  minHeight: '64px',
  maxHeight: '72px',
  resize: 'none' as const,
};

const expandedExamplePanelStyle = {
  ...examplePanelStyle,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column' as const,
};

const expandedExampleListStyle = {
  ...exampleListStyle,
  flex: 1,
  minHeight: 0,
  maxHeight: 'none',
};

const smallButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'calc(var(--ui-space-unit) * 1.5)',
  minHeight: 'var(--size-control-md)',
  padding: '0 var(--ui-space-10)',
  borderRadius: 'var(--ui-radius-pill)',
  border: '1px solid var(--border-node)',
  backgroundColor: 'var(--bg-canvas)',
  color: 'var(--text-secondary)',
  fontSize: 'var(--ui-type-xs-size)',
  fontWeight: 800,
  cursor: 'pointer',
};

const portLabelContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingTop: '8px',
  marginTop: '4px',
  borderTop: 'none',
};

const chipStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'var(--bg-canvas)',
  padding: 'var(--ui-space-4) calc(var(--ui-space-unit) * 1.5) var(--ui-space-4) var(--ui-space-10)',
  borderRadius: 'var(--ui-radius-pill)',
  border: '1px solid var(--border-node)',
  gap: 'calc(var(--ui-space-unit) * 1.5)',
};

const portLabelStyle = {
  fontSize: 'var(--ui-type-xs-size)',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.3px',
};

export function PromptNode({ id, data }: { id: string; data: PromptNodeData }) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isExampleOpen, setIsExampleOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<PromptExampleCategory | "all">("all");
  const [appliedExampleId, setAppliedExampleId] = React.useState<string | null>(null);

  const onChange = useCallback((value: string) => {
    data.onChange(value);
  }, [data]);

  const visibleExamples = React.useMemo(
    () => activeCategory === "all" ? PROMPT_EXAMPLES : PROMPT_EXAMPLES.filter((example) => example.category === activeCategory),
    [activeCategory],
  );

  const applyExample = useCallback((prompt: string, exampleId: string) => {
    data.onChange(prompt);
    setAppliedExampleId(exampleId);
  }, [data]);

  const appendExample = useCallback((prompt: string, exampleId: string) => {
    const currentPrompt = data.prompt?.trim();
    data.onChange(currentPrompt ? `${currentPrompt}\n\n${prompt}` : prompt);
    setAppliedExampleId(exampleId);
  }, [data]);

  const handleDisconnect = useCallback(() => {
    setEdges((eds) => eds.filter(e => !(e.source === id && e.sourceHandle === 'prompt-out')));
  }, [id, setEdges]);

  const connections = useNodeConnections({ handleType: 'source', handleId: 'prompt-out' });
  const isConnected = connections.length > 0;

  return (
    <div style={isExampleOpen ? expandedPromptNodeStyle : nodeStyle}>
      <div style={headerStyle}>
        <MessageSquareText size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>설명</span>
      </div>
      
      <div style={isExampleOpen ? expandedBodyStyle : bodyStyle}>
        <textarea
          style={isExampleOpen ? expandedTextareaStyle : textareaStyle}
          value={data.prompt || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="무엇을 만들지 적거나, 아래 예시 프롬프트에서 시작하세요."
          className="nodrag"
        />

        <div style={isExampleOpen ? expandedExamplePanelStyle : examplePanelStyle} className="nodrag">
          <button
            type="button"
            style={exampleHeaderStyle}
            onClick={() => setIsExampleOpen((prev) => !prev)}
            aria-expanded={isExampleOpen}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--ui-space-8)', fontSize: 'var(--ui-type-xs-2-size)', fontWeight: 850 }}>
              <Library size={14} />
              예시 프롬프트
            </span>
            <span style={{ fontSize: 'var(--ui-type-xs-size)', fontWeight: 800 }}>
              {isExampleOpen ? '닫기' : `${PROMPT_EXAMPLES.length}개`}
            </span>
          </button>

          {isExampleOpen && (
            <>
              <div style={categoryRowStyle}>
                <button
                  type="button"
                  style={{
                    ...smallButtonStyle,
                    borderColor: activeCategory === "all" ? "var(--port-prompt)" : "var(--border-node)",
                    color: activeCategory === "all" ? "var(--port-prompt)" : "var(--text-secondary)",
                  }}
                  onClick={() => setActiveCategory("all")}
                >
                  전체
                </button>
                {(Object.keys(PROMPT_EXAMPLE_CATEGORY_LABELS) as PromptExampleCategory[]).map((category) => (
                  <button
                    key={category}
                    type="button"
                    style={{
                      ...smallButtonStyle,
                      borderColor: activeCategory === category ? "var(--port-prompt)" : "var(--border-node)",
                      color: activeCategory === category ? "var(--port-prompt)" : "var(--text-secondary)",
                    }}
                    onClick={() => setActiveCategory(category)}
                  >
                    {PROMPT_EXAMPLE_CATEGORY_LABELS[category]}
                  </button>
                ))}
              </div>

              <div style={isExampleOpen ? expandedExampleListStyle : exampleListStyle}>
                {visibleExamples.map((example) => (
                  <div key={example.id} style={exampleCardStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-space-4)' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: 'var(--ui-type-xs-2-size)' }}>{example.title}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: 'var(--ui-type-xs-size)', lineHeight: 1.45 }}>{example.summary}</span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--ui-type-xs-size)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                      {example.prompt}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'calc(var(--ui-space-unit) * 1.5)' }}>
                      <button type="button" style={smallButtonStyle} onClick={() => appendExample(example.prompt, example.id)}>
                        <Plus size={12} />
                        추가
                      </button>
                      <button
                        type="button"
                        style={{
                          ...smallButtonStyle,
                          backgroundColor: appliedExampleId === example.id ? 'color-mix(in srgb, var(--port-prompt) 14%, transparent)' : 'var(--text-primary)',
                          color: appliedExampleId === example.id ? 'var(--port-prompt)' : 'var(--bg-node-base)',
                          borderColor: appliedExampleId === example.id ? 'var(--port-prompt)' : 'var(--text-primary)',
                        }}
                        onClick={() => applyExample(example.prompt, example.id)}
                      >
                        {appliedExampleId === example.id ? <Check size={12} /> : null}
                        적용
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div 
          style={portLabelContainerStyle}
        >
          <div 
            style={{ 
              ...chipStyle, 
              backgroundColor: isConnected ? (isHovered ? 'color-mix(in srgb, var(--port-prompt) 25%, transparent)' : 'color-mix(in srgb, var(--port-prompt) 15%, transparent)') : (isHovered ? 'color-mix(in srgb, var(--port-prompt) 10%, var(--bg-canvas))' : 'var(--bg-canvas)'), 
              borderColor: isConnected ? 'var(--port-prompt)' : (isHovered ? 'var(--port-prompt)' : 'var(--border-node)'),
              cursor: isConnected ? 'pointer' : 'crosshair',
              transition: 'all 0.2s ease',
              position: 'relative'
            }} 
            className="nodrag"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={isConnected ? handleDisconnect : undefined}
          >
            <span style={{ 
              ...portLabelStyle, 
              color: isConnected ? 'var(--port-prompt)' : 'var(--text-secondary)',
              pointerEvents: 'none',
              zIndex: 1,
              position: 'relative'
            }}>
              {isConnected && isHovered ? '연결 해제' : '설명 출력'}
            </span>
            
            {/* 핸들과 점을 위한 컨테이너 (공간 확보) */}
            <div style={{ width: 'var(--size-port-dot)', height: 'var(--size-port-dot)', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                background: isConnected && isHovered ? 'var(--bg-node-base)' : 'var(--port-prompt)', 
                border: isConnected && isHovered ? `1px solid var(--port-prompt)` : `2px solid var(--bg-node-base)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
                {isConnected && isHovered && <X size={8} color="var(--port-prompt)" strokeWidth={4} />}
              </div>
            </div>

            <Handle
              type="source"
              position={Position.Right}
              id="prompt-out"
              isConnectable={true}
              style={{
                ...(isConnected
                  ? {
                      width: 'var(--size-port-dot)',
                      height: 'var(--size-port-dot)',
                      right: 'calc(var(--size-port-dot) / 2)', // chip padding-right와 맞춤
                      top: 'calc(50% - var(--size-port-dot) / 2)',
                      transform: 'none',
                      pointerEvents: 'none',
                      background: 'transparent',
                      border: 'none',
                    }
                  : {
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      background: 'transparent',
                      border: 'none',
                      opacity: 0,
                      zIndex: 10,
                      cursor: 'crosshair',
                      pointerEvents: 'auto',
                      transform: 'none',
                      right: 'auto',
                      top: 'auto'
                    }
                ),
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
