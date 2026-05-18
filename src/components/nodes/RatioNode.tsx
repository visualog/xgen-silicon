import { Handle, Position, useNodeConnections } from '@xyflow/react';
import React from 'react';
import { Square, RectangleHorizontal, RectangleVertical, Ratio, X } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

const nodeStyle = {
  backgroundColor: 'color-mix(in srgb, var(--bg-node-base) 5%, transparent)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '12px',
  border: 'none',
  width: '180px',
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden',
  boxShadow: 'var(--shadow-node)',
};

const headerStyle = {
  backgroundColor: 'var(--bg-node-header)',
  padding: '8px 12px',
  borderBottom: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
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

const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  backgroundColor: 'var(--bg-canvas)',
  borderRadius: '12px',
  padding: '4px',
  border: 'none',
};

const toolbarButtonStyle = (isActive: boolean) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: isActive ? 'var(--bg-node-base)' : 'transparent',
  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
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
  padding: '4px 6px 4px 10px',
  borderRadius: '100px',
  border: '1px solid var(--border-node)',
  gap: '6px',
};

const portLabelStyle = {
  fontSize: '10px',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.3px',
};

export function RatioNode({ id, data, isConnectable }: any) {
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
            <div style={{ width: '12px', height: '12px', position: 'relative', zIndex: 1 }}>
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
                      width: '12px', 
                      height: '12px', 
                      right: '6px', // chip padding-right와 맞춤
                      top: '50%', 
                      transform: 'translateY(-50%)',
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
