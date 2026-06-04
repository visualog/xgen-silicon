import { Handle, Position, useNodeConnections } from '@xyflow/react';
import React from 'react';
import { Square, RectangleHorizontal, RectangleVertical, Ratio, X } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

type RatioNodeData = {
  ratio: string;
  setRatio: (value: string) => void;
};

const nodeStyle = {
  backgroundColor: 'color-mix(in srgb, var(--bg-node-base) 5%, transparent)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: 'var(--ui-radius-xl)',
  border: 'none',
  width: 'var(--size-node-sm)',
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

const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--ui-space-4)',
  backgroundColor: 'var(--bg-canvas)',
  borderRadius: 'var(--ui-radius-xl)',
  padding: '4px',
  border: 'none',
};

const toolbarButtonStyle = (isActive: boolean) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'var(--size-control-toolbar)',
  padding: 'var(--ui-space-6)',
  borderRadius: 'var(--ui-space-8)',
  border: 'none',
  backgroundColor: isActive ? 'var(--bg-node-base)' : 'transparent',
  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
  fontSize: 'var(--ui-type-xs-size)',
  fontWeight: 800,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
});

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

export function RatioNode({ id, data }: { id: string; data: RatioNodeData }) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = React.useState(false);
  const { ratio, setRatio } = data;

  const handleDisconnect = () => {
    setEdges((eds) => eds.filter(e => !(e.source === id && e.sourceHandle === 'ratio-out')));
  };

  const connections = useNodeConnections({ handleType: 'source', handleId: 'ratio-out' });
  const isConnected = connections.length > 0;

  return (
    <div style={nodeStyle}>
      <div style={headerStyle}>
        <Ratio size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>화면 비율</span>
      </div>

      <div style={bodyStyle}>
        <div style={toolbarStyle} className="nodrag">
          <button style={toolbarButtonStyle(ratio === '1:1')} onClick={() => setRatio('1:1')} title="1:1 화면비"><Square size={16} /></button>
          <button style={toolbarButtonStyle(ratio === '16:9')} onClick={() => setRatio('16:9')} title="16:9 화면비"><RectangleHorizontal size={16} /></button>
          <button style={toolbarButtonStyle(ratio === '9:16')} onClick={() => setRatio('9:16')} title="9:16 화면비"><RectangleVertical size={16} /></button>
          <button style={toolbarButtonStyle(ratio === '4:3')} onClick={() => setRatio('4:3')} title="4:3 가로형 화면비">4:3</button>
          <button style={toolbarButtonStyle(ratio === '3:4')} onClick={() => setRatio('3:4')} title="4:3 세로형 화면비">3:4</button>
        </div>

        <div 
          style={{ ...portLabelContainerStyle, marginTop: '8px' }}
        >
          <div 
            style={{ 
              ...chipStyle, 
              backgroundColor: isConnected ? (isHovered ? 'color-mix(in srgb, var(--port-ratio) 25%, transparent)' : 'color-mix(in srgb, var(--port-ratio) 15%, transparent)') : (isHovered ? 'color-mix(in srgb, var(--port-ratio) 10%, var(--bg-canvas))' : 'var(--bg-canvas)'), 
              borderColor: isConnected ? 'var(--port-ratio)' : (isHovered ? 'var(--port-ratio)' : 'var(--border-node)'),
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
              color: isConnected ? 'var(--port-ratio)' : 'var(--text-secondary)',
              pointerEvents: 'none',
              zIndex: 1,
              position: 'relative'
            }}>
              {isConnected && isHovered ? '연결 해제' : '비율 출력'}
            </span>
            
            {/* 핸들과 점을 위한 컨테이너 (공간 확보) */}
            <div style={{ width: 'var(--size-port-dot)', height: 'var(--size-port-dot)', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                background: isConnected && isHovered ? 'var(--bg-node-base)' : 'var(--port-ratio)', 
                border: isConnected && isHovered ? `1px solid var(--port-ratio)` : `2px solid var(--bg-node-base)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
                {isConnected && isHovered && <X size={8} color="var(--port-ratio)" strokeWidth={4} />}
              </div>
            </div>

            <Handle
              type="source"
              position={Position.Right}
              id="ratio-out"
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
