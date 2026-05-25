"use client";
import { Handle, Position, useNodeConnections } from '@xyflow/react';
import React, { useState } from 'react';
import { Palette, X, Plus, Trash2 } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { StyleAddModal } from '@/components/StyleAddModal';
import type { StyleEntry } from '@/components/StyleAddModal';

type StyleNodeData = {
  styles?: StyleEntry[];
  activeStyleId?: string | null;
  setStyles: React.Dispatch<React.SetStateAction<StyleEntry[]>>;
  setActiveStyleId: (styleId: string | null) => void;
};

const nodeStyle = {
  backgroundColor: 'color-mix(in srgb, var(--bg-node-base) 5%, transparent)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: 'var(--ui-radius-xl)',
  border: 'none',
  width: 'var(--size-node-reference)',
  display: 'flex',
  flexDirection: 'column' as const,
  boxShadow: 'var(--ui-shadow-node)',
  overflow: 'visible' as const,
};

const headerStyle = {
  backgroundColor: 'var(--bg-node-header)',
  padding: 'var(--ui-space-8) var(--ui-space-12)',
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
  gap: 'var(--ui-space-8)',
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

export function StyleNode({ id, data }: { id: string; data: StyleNodeData }) {
  const { setEdges } = useReactFlow();
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { styles = [], activeStyleId, setStyles, setActiveStyleId } = data;

  const connections = useNodeConnections({ handleType: 'source', handleId: 'style-out' });
  const isConnected = connections.length > 0;

  const handleDisconnect = () => {
    setEdges(eds => eds.filter(e => !(e.source === id && e.sourceHandle === 'style-out')));
  };

  const handleAdd = (entry: StyleEntry) => {
    setStyles((prev: StyleEntry[]) => [...prev, entry]);
    setActiveStyleId(entry.id);
  };

  const handleDelete = (e: React.MouseEvent, styleId: string) => {
    e.stopPropagation();
    setStyles((prev: StyleEntry[]) => prev.filter((s: StyleEntry) => s.id !== styleId));
    if (activeStyleId === styleId) setActiveStyleId(null);
  };

  const handleSelect = (styleId: string) => {
    setActiveStyleId(activeStyleId === styleId ? null : styleId);
  };

  const activeStyle = styles.find((s: StyleEntry) => s.id === activeStyleId);

  return (
    <>
      {showModal && (
        <StyleAddModal
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}

      <div style={nodeStyle}>
        {/* 헤더 */}
        <div style={headerStyle}>
          <Palette size={16} color="var(--text-secondary)" />
          <span style={titleStyle}>스타일 참조</span>
          {activeStyle && (
            <span style={{
              marginLeft: 'auto', fontSize: 'var(--ui-type-xs-size)', fontWeight: 700,
              color: 'var(--port-style)',
              backgroundColor: 'color-mix(in srgb, var(--port-style) 12%, transparent)',
              padding: 'calc(var(--ui-space-unit) * 0.5) var(--ui-space-8)', borderRadius: 'var(--ui-radius-pill)',
            }}>
              선택됨
            </span>
          )}
        </div>

        <div style={bodyStyle}>
          {/* 스타일 카드 목록 */}
          {styles.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 'calc(var(--ui-space-unit) * 1.5)' }} className="nodrag">
              {styles.map((s: StyleEntry) => {
                const isActive = s.id === activeStyleId;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelect(s.id)}
                    style={{
                      display: 'flex',
                      gap: 'var(--ui-space-10)',
                      alignItems: 'flex-start',
                      padding: 'var(--ui-space-8)',
                      borderRadius: 'var(--ui-space-8)',
                      border: `1.5px solid ${isActive ? 'var(--port-style)' : 'var(--border-node)'}`,
                      backgroundColor: isActive
                        ? 'color-mix(in srgb, var(--port-style) 8%, transparent)'
                        : 'var(--bg-canvas)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative' as const,
                    }}
                  >
                    {/* 썸네일 */}
                    <div style={{
                      width: 'var(--size-icon-container)', height: 'var(--size-icon-container)', borderRadius: 'var(--ui-radius-md)',
                      overflow: 'hidden', flexShrink: 0,
                      backgroundColor: 'var(--bg-node-header)',
                    }}>
                      <img
                        src={s.imageUrl}
                        alt={s.label}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* 프롬프트 텍스트 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 'var(--ui-type-xs-size)', lineHeight: '1.5',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical' as const,
                        overflow: 'hidden',
                      }}>
                        {s.prompt || '스타일 프롬프트 없음'}
                      </p>
                    </div>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={(e) => handleDelete(e, s.id)}
                      style={{
                        position: 'absolute' as const, top: 'calc(var(--size-port-dot) / 2)', right: 'calc(var(--size-port-dot) / 2)',
                        width: 'var(--size-control-xs)', height: 'var(--size-control-xs)', borderRadius: '50%',
                        border: 'none', backgroundColor: 'transparent',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', opacity: 0.5,
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
                      title="스타일 삭제"
                    >
                      <Trash2 size={11} color="var(--text-secondary)" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* 빈 상태 */}
          {styles.length === 0 && (
            <div style={{
              padding: 'var(--ui-space-20) var(--ui-space-12)', textAlign: 'center' as const,
              color: 'var(--text-muted)', fontSize: 'calc(var(--ui-type-xs-size) * 1.1)',
            }}>
              <Palette size={24} color="var(--border-node)" style={{ marginBottom: '8px' }} />
              <p style={{ margin: 0 }}>추가 버튼으로 참조할<br />스타일 이미지를 등록하세요</p>
            </div>
          )}

          {/* 추가 버튼 */}
          <button
            className="nodrag"
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'calc(var(--ui-space-unit) * 1.5)',
              width: '100%', padding: 'var(--ui-space-8)',
              borderRadius: 'var(--ui-space-8)',
              border: '1.5px dashed var(--border-node)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: 'var(--ui-type-xs-2-size)', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--port-style)';
              e.currentTarget.style.color = 'var(--port-style)';
              e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--port-style) 8%, transparent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-node)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Plus size={14} /> 추가
          </button>

          {/* 출력 핸들 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <div
              style={{
                ...chipStyle,
                backgroundColor: isConnected
                  ? (isHovered ? 'color-mix(in srgb, var(--port-style) 25%, transparent)' : 'color-mix(in srgb, var(--port-style) 15%, transparent)')
                  : (isHovered ? 'color-mix(in srgb, var(--port-style) 10%, var(--bg-canvas))' : 'var(--bg-canvas)'),
                borderColor: isConnected ? 'var(--port-style)' : (isHovered ? 'var(--port-style)' : 'var(--border-node)'),
                cursor: isConnected ? 'pointer' : 'crosshair',
                transition: 'all 0.2s ease',
                position: 'relative' as const,
              }}
              className="nodrag"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={isConnected ? handleDisconnect : undefined}
            >
              <span style={{
                fontSize: 'var(--ui-type-xs-size)', fontWeight: 700,
                color: isConnected ? 'var(--port-style)' : 'var(--text-secondary)',
                textTransform: 'uppercase' as const, letterSpacing: '0.3px',
                pointerEvents: 'none', zIndex: 1, position: 'relative' as const,
              }}>
                {isConnected && isHovered ? '연결 해제' : '스타일 출력'}
              </span>

              <div style={{ width: 'var(--size-port-dot)', height: 'var(--size-port-dot)', position: 'relative' as const, zIndex: 1 }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: isConnected && isHovered ? 'var(--bg-node-base)' : 'var(--port-style)',
                  border: isConnected && isHovered ? '1px solid var(--port-style)' : '2px solid var(--bg-node-base)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}>
                  {isConnected && isHovered && <X size={8} color="var(--port-style)" strokeWidth={4} />}
                </div>
              </div>

              <Handle
                type="source"
                position={Position.Right}
                id="style-out"
                isConnectable={true}
                style={{
                  ...(isConnected
                    ? { width: 'var(--size-port-dot)', height: 'var(--size-port-dot)', right: 'calc(var(--size-port-dot) / 2)', top: 'calc(50% - var(--size-port-dot) / 2)', transform: 'none', pointerEvents: 'none', background: 'transparent', border: 'none' }
                    : { position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', border: 'none', opacity: 0, zIndex: 10, cursor: 'crosshair', pointerEvents: 'auto', transform: 'none', right: 'auto', top: 'auto' }
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
