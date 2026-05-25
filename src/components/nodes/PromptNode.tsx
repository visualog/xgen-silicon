import { Handle, Position, useNodeConnections } from '@xyflow/react';
import React, { useCallback } from 'react';
import { MessageSquareText, X } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

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
  minHeight: 'var(--size-prompt-min-height)',
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

  const onChange = useCallback((value: string) => {
    data.onChange(value);
  }, [data]);

  const handleDisconnect = useCallback(() => {
    setEdges((eds) => eds.filter(e => !(e.source === id && e.sourceHandle === 'prompt-out')));
  }, [id, setEdges]);

  const connections = useNodeConnections({ handleType: 'source', handleId: 'prompt-out' });
  const isConnected = connections.length > 0;

  return (
    <div style={nodeStyle}>
      <div style={headerStyle}>
        <MessageSquareText size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>설명</span>
      </div>
      
      <div style={bodyStyle}>
        <textarea
          style={textareaStyle}
          value={data.prompt || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예: 자전거를 타고 달리는 사람..."
          className="nodrag"
        />

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
