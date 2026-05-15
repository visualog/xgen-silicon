import { Handle, Position, useNodeConnections } from '@xyflow/react';
import React, { useRef } from 'react';
import { Check, CircleCheck, Palette, X } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

const nodeStyle = {
  backgroundColor: 'color-mix(in srgb, var(--bg-node-base) 5%, transparent)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '12px',
  border: 'none',
  width: '280px',
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

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '8px',
};

const itemStyle = (isActive: boolean) => ({
  aspectRatio: '1',
  backgroundColor: 'var(--bg-canvas)',
  border: isActive ? '2px solid var(--text-primary)' : '1.5px solid var(--border-node)',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative' as const,
  minWidth: 0,
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

export function StyleNode({ id, data, isConnectable }: any) {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDisconnect = () => {
    setEdges((eds) => eds.filter(e => !(e.source === id && e.sourceHandle === 'style-out')));
  };

  const {
    activeStyle,
    setActiveStyle,
    customStyles = [],
    setCustomStyles,
    styleSamples = []
  } = data;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setCustomStyles((prev: string[]) => {
        const next = [...prev, b64];
        setActiveStyle(`custom-${next.length - 1}`);
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const connections = useNodeConnections({ handleType: 'source', handleId: 'style-out' });
  const isConnected = connections.length > 0;

  return (
    <div style={nodeStyle}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div style={headerStyle}>
        <Palette size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>스타일 참조</span>
      </div>
      
      <div style={bodyStyle}>
        <div style={gridStyle} className="nodrag">
        {/* Built-in samples */}
        {styleSamples.map((s: any) => (
          <div
            key={s.id}
            style={itemStyle(activeStyle === s.id)}
            onClick={() => setActiveStyle(activeStyle === s.id ? null : s.id)}
          >
            <span style={{ fontSize: "1.3rem" }}>{s.icon}</span>
            {activeStyle === s.id && (
                <div style={{ 
                  position: 'absolute', 
                  top: 4, 
                  right: 4, 
                  backgroundColor: 'var(--text-primary)', 
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  zIndex: 2,
                  border: '1.5px solid var(--bg-node-base)'
                }}>
                  <Check color="var(--bg-node-base)" size={12} strokeWidth={4} />
                </div>
            )}
          </div>
        ))}

        {/* Uploaded custom styles */}
        {customStyles.map((src: string, i: number) => {
          const styleId = `custom-${i}`;
          const isActive = activeStyle === styleId;
          return (
            <div
              key={styleId}
              style={itemStyle(isActive)}
              onClick={() => setActiveStyle(isActive ? null : styleId)}
            >
              <img src={src} alt={`Style ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {isActive && (
                <div style={{ 
                  position: 'absolute', 
                  top: 4, 
                  right: 4, 
                  backgroundColor: 'var(--text-primary)', 
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  zIndex: 2,
                  border: '1.5px solid var(--bg-node-base)'
                }}>
                  <Check color="var(--bg-node-base)" size={12} strokeWidth={4} />
                </div>
              )}
            </div>
          );
        })}

        {/* Upload button */}
        <div
          style={itemStyle(false)}
          onClick={() => fileInputRef.current?.click()}
          title="스타일 이미지 업로드"
        >
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)' }}>+ 추가</span>
        </div>
      </div>

        <div 
          style={portLabelContainerStyle}
        >
          <div 
            style={{ 
              ...chipStyle, 
              backgroundColor: isConnected ? (isHovered ? 'color-mix(in srgb, var(--port-style) 25%, transparent)' : 'color-mix(in srgb, var(--port-style) 15%, transparent)') : (isHovered ? 'color-mix(in srgb, var(--port-style) 10%, var(--bg-canvas))' : 'var(--bg-canvas)'), 
              borderColor: isConnected ? 'var(--port-style)' : (isHovered ? 'var(--port-style)' : 'var(--border-node)'),
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
              color: isConnected ? 'var(--port-style)' : 'var(--text-secondary)',
              pointerEvents: 'none',
              zIndex: 1,
              position: 'relative'
            }}>
              {isConnected && isHovered ? '연결 해제' : '스타일 출력'}
            </span>
            
            {/* 핸들과 점을 위한 컨테이너 (공간 확보) */}
            <div style={{ width: '12px', height: '12px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                background: isConnected && isHovered ? 'var(--bg-node-base)' : 'var(--port-style)', 
                border: isConnected && isHovered ? `1px solid var(--port-style)` : `2px solid var(--bg-node-base)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
                {isConnected && isHovered && <X size={8} color="var(--port-style)" strokeWidth={4} />}
              </div>
            </div>

            <Handle
              type="source"
              position={Position.Right}
              id="style-out"
              isConnectable={1}
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
