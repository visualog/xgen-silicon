import { Handle, Position, useEdges, useConnection, useReactFlow } from '@xyflow/react';
import React from 'react';
import { Check, Copy, RefreshCw, Wand2, Play, Loader2, Sparkles } from 'lucide-react';

const nodeStyle = {
  backgroundColor: 'color-mix(in srgb, var(--bg-node-base) 5%, transparent)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: 'var(--ui-radius-xl)',
  border: 'none',
  width: 'var(--size-node-output)',
  display: 'flex',
  flexDirection: 'column' as const,
  boxShadow: 'var(--ui-shadow-node)',
  position: 'relative' as const,
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
  gap: 'var(--ui-space-10)',
};

type OutputNodeData = {
  englishPrompt?: string;
  koreanPrompt?: string;
  setKoreanPrompt?: (value: string) => void;
  onRegenerateEnglishPrompt?: () => void;
  isTranslating?: boolean;
  translateElapsedLabel?: string | null;
  lastTranslateDurationLabel?: string | null;
  onGenerate?: () => void;
  canGenerate?: boolean;
  isGenerating?: boolean;
  generateElapsedLabel?: string | null;
  lastGenerateDurationLabel?: string | null;
  styleReferenceSummary?: {
    label: string;
    weight: "subtle" | "medium" | "strong";
    hasImage: boolean;
  } | null;
};

export function OutputNode({ data }: { data: OutputNodeData }) {
  const connection = useConnection();
  const { getNode, setCenter } = useReactFlow();
  const [showExecutionPrompt, setShowExecutionPrompt] = React.useState(false);
  const [isExecutionPromptCopied, setIsExecutionPromptCopied] = React.useState(false);
  const koreanPromptTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const isDragging = connection.inProgress; // 다른 노드에서 연결선을 드래그 중

  const {
    englishPrompt = "",
    koreanPrompt = "",
    setKoreanPrompt,
    onRegenerateEnglishPrompt,
    isTranslating = false,
    translateElapsedLabel = null,
    onGenerate,
    canGenerate = false,
    isGenerating = false,
    generateElapsedLabel = null,
    styleReferenceSummary = null,
  } = data;

  const edges = useEdges();
  const id = "output-node";

  const isPromptConnected  = edges.some(e => e.target === id && e.source === 'prompt-node');
  const isStyleConnected   = edges.some(e => e.target === id && e.source === 'style-node');
  const isCharacterReferenceConnected = edges.some(e => e.target === id && e.source === 'character-reference-node');
  const isObjectReferenceConnected = edges.some(e => e.target === id && e.source === 'object-reference-node');
  const isOutputSettingsConnected = edges.some(e => e.target === id && e.source === 'output-settings-node');
  const isCompositionConnected = edges.some(e => e.target === id && e.source === 'composition-node');
  const isBackgroundConnected = edges.some(e => e.target === id && e.source === 'background-node');
  const isConstraintConnected = edges.some(e => e.target === id && e.source === 'constraint-node');
  const isMoodConnected = edges.some(e => e.target === id && e.source === 'mood-node');
  const isPaletteConnected = edges.some(e => e.target === id && e.source === 'palette-node');
  const isCameraAngleConnected = edges.some(e => e.target === id && e.source === 'camera-angle-node');
  const isObjectAngleConnected = edges.some(e => e.target === id && e.source === 'object-angle-node');
  const isLightingConnected = edges.some(e => e.target === id && e.source === 'lighting-node');
  const isGestureConnected = edges.some(e => e.target === id && e.source === 'gesture-node');
  const isPropsConnected = edges.some(e => e.target === id && e.source === 'props-node');
  const isDetailConnected = edges.some(e => e.target === id && e.source === 'detail-node');
  const isMaskEditConnected = edges.some(e => e.target === id && e.source === 'mask-edit-node');
  const isAnyConnected     = isPromptConnected || isStyleConnected || isCharacterReferenceConnected || isObjectReferenceConnected || isOutputSettingsConnected || isCompositionConnected || isBackgroundConnected || isConstraintConnected || isMoodConnected || isPaletteConnected || isCameraAngleConnected || isObjectAngleConnected || isLightingConnected || isGestureConnected || isPropsConnected || isDetailConnected || isMaskEditConnected;
  const isCanvasConnected  = edges.some(e => e.source === id);

  const getMixedColor = () => {
    const colors = [];
    if (isPromptConnected) colors.push('var(--port-prompt)');
    if (isStyleConnected)  colors.push('var(--port-style)');
    if (isCharacterReferenceConnected) colors.push('var(--port-character-reference)');
    if (isObjectReferenceConnected) colors.push('var(--port-object-reference)');
    if (isOutputSettingsConnected) colors.push('var(--port-resolution)');
    if (isCompositionConnected) colors.push('var(--port-composition)');
    if (isBackgroundConnected) colors.push('var(--port-background)');
    if (isConstraintConnected) colors.push('var(--port-constraint)');
    if (isMoodConnected) colors.push('var(--port-mood)');
    if (isPaletteConnected) colors.push('var(--port-palette)');
    if (isCameraAngleConnected) colors.push('var(--port-camera-angle)');
    if (isObjectAngleConnected) colors.push('var(--port-object-angle)');
    if (isLightingConnected) colors.push('var(--port-lighting)');
    if (isGestureConnected) colors.push('var(--port-gesture)');
    if (isPropsConnected) colors.push('var(--port-props)');
    if (isDetailConnected) colors.push('var(--port-detail)');
    if (isMaskEditConnected) colors.push('var(--port-constraint)');
    if (colors.length === 0) return 'transparent';
    if (colors.length === 1) return colors[0];
    let mixed = colors[0];
    for (let i = 1; i < colors.length; i++) {
      mixed = `color-mix(in srgb, ${mixed}, ${colors[i]})`;
    }
    return mixed;
  };

  // 입력 dot 표시 조건: 연결됐거나, 드래그 중일 때
  const showInputDot = isAnyConnected || isDragging;
  // 출력 dot 표시 조건: 캔버스 노드가 연결됐을 때만
  const showOutputDot = isCanvasConnected;

  const connectedTags = [
    isPromptConnected && { label: '설명', color: 'var(--port-prompt)', nodeId: 'prompt-node' },
    isStyleConnected  && { label: '스타일', color: 'var(--port-style)', nodeId: 'style-node' },
    isCharacterReferenceConnected && { label: '캐릭터', color: 'var(--port-character-reference)', nodeId: 'character-reference-node' },
    isObjectReferenceConnected && { label: '오브젝트', color: 'var(--port-object-reference)', nodeId: 'object-reference-node' },
    isOutputSettingsConnected && { label: '출력 설정', color: 'var(--port-resolution)', nodeId: 'output-settings-node' },
    isCompositionConnected && { label: '구도', color: 'var(--port-composition)', nodeId: 'composition-node' },
    isBackgroundConnected && { label: '배경', color: 'var(--port-background)', nodeId: 'background-node' },
    isConstraintConnected && { label: '제한', color: 'var(--port-constraint)', nodeId: 'constraint-node' },
    isMoodConnected && { label: '무드', color: 'var(--port-mood)', nodeId: 'mood-node' },
    isPaletteConnected && { label: '팔레트', color: 'var(--port-palette)', nodeId: 'palette-node' },
    isCameraAngleConnected && { label: '앵글', color: 'var(--port-camera-angle)', nodeId: 'camera-angle-node' },
    isObjectAngleConnected && { label: '오브젝트 앵글', color: 'var(--port-object-angle)', nodeId: 'object-angle-node' },
    isLightingConnected && { label: '조명', color: 'var(--port-lighting)', nodeId: 'lighting-node' },
    isGestureConnected && { label: '제스처', color: 'var(--port-gesture)', nodeId: 'gesture-node' },
    isPropsConnected && { label: '소품', color: 'var(--port-props)', nodeId: 'props-node' },
    isDetailConnected && { label: '밀도', color: 'var(--port-detail)', nodeId: 'detail-node' },
    isMaskEditConnected && { label: '마스크', color: 'var(--port-constraint)', nodeId: 'mask-edit-node' },
  ].filter(Boolean) as { label: string; color: string; nodeId: string }[];

  const focusNode = (nodeId: string) => {
    const node = getNode(nodeId);
    if (!node) return;
    const width = node.measured?.width ?? node.width ?? 260;
    const height = node.measured?.height ?? node.height ?? 180;
    void setCenter(
      node.position.x + width / 2,
      node.position.y + height / 2,
      { zoom: 1, duration: 450 },
    );
  };

  const hasDisplayPrompt = isAnyConnected && !!koreanPrompt;
  const hasExecutionPrompt = isAnyConnected && !!englishPrompt;

  React.useEffect(() => {
    const textarea = koreanPromptTextareaRef.current;
    if (!textarea || showExecutionPrompt) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  }, [koreanPrompt, showExecutionPrompt]);

  React.useEffect(() => {
    if (!isExecutionPromptCopied) return;
    const timeoutId = window.setTimeout(() => setIsExecutionPromptCopied(false), 1400);
    return () => window.clearTimeout(timeoutId);
  }, [isExecutionPromptCopied]);

  const copyExecutionPrompt = async () => {
    if (!englishPrompt.trim()) return;
    try {
      await navigator.clipboard.writeText(englishPrompt);
      setIsExecutionPromptCopied(true);
    } catch {
      setIsExecutionPromptCopied(false);
    }
  };

  return (
    <div style={nodeStyle}>
      <Handle
        type="target"
        position={Position.Left}
        id="general-in"
        isConnectable={true}
        style={{
          width: 'var(--size-port-dot)',
          height: 'var(--size-port-dot)',
          background: 'transparent',
          border: 'none',
          opacity: 0,
          left: 'calc(var(--size-port-dot) / -2)',
          top: 'calc(50% - var(--size-port-dot) / 2)',
          transform: 'none',
          cursor: 'crosshair',
        }}
      />

      {/* 오른쪽 출력 핸들 — 항상 렌더링 (Edge 라우팅에 필요), 시각적 dot은 조건부 */}
      <Handle
        type="source"
        position={Position.Right}
        id="output-out"
        isConnectable={false}
        style={{
          background: 'transparent',
          border: 'none',
          width: 'var(--size-port-dot)',
          height: 'var(--size-port-dot)',
          right: 'calc(var(--size-port-dot) / -2)',
          top: 'calc(50% - var(--size-port-dot) / 2)',
          transform: 'none',
          transition: 'background 0.2s ease',
        }}
      />
      {showOutputDot ? (
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
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      ) : null}

      {/* 헤더 */}
      <div style={headerStyle}>
        <Wand2 size={16} color="var(--text-secondary)" />
        <span style={titleStyle}>프롬프트</span>
        {isTranslating && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--ui-space-4)' }}>
            <Loader2 size={12} color="var(--text-secondary)" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 'var(--ui-type-xs-size)', color: 'var(--text-secondary)' }}>
              Codex 생성 중 {translateElapsedLabel ? `· ${translateElapsedLabel}` : ''}
            </span>
          </div>
        )}
      </div>

      <div style={bodyStyle}>
        {/* 왼쪽 통합 입력점 장식 — 실제 Handle은 위에서 항상 고정 렌더링 */}
        {showInputDot && (
          <div style={{ position: 'absolute', left: 'calc(var(--size-port-dot) / -2)', top: 'calc(50% - var(--size-port-dot) / 2)', zIndex: 10 }}>
            <div
              style={{
                width: 'var(--size-port-dot)',
                height: 'var(--size-port-dot)',
                borderRadius: '50%',
                background: isAnyConnected ? getMixedColor() : 'var(--bg-canvas)',
                border: isAnyConnected
                  ? '2px solid var(--bg-node-base)'
                  : '2px dashed var(--border-node)',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'crosshair',
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
            >
              {!isAnyConnected && (
                <div style={{ width: 'var(--size-status-dot)', height: 'var(--size-status-dot)', borderRadius: '50%', background: 'var(--text-muted)' }} />
              )}
            </div>
          </div>
        )}

        {/* 연결된 파라미터 태그 */}
        {connectedTags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 'var(--ui-space-4)' }}>
            {connectedTags.map(tag => (
              <button
                key={tag.label}
                type="button"
                className="nodrag"
                onClick={(event) => {
                  event.stopPropagation();
                  focusNode(tag.nodeId);
                }}
                title={`${tag.label} 노드로 이동`}
                style={{
                  fontSize: 'var(--ui-type-xs-size)',
                  fontWeight: 700,
                  padding: 'calc(var(--ui-space-unit) * 0.5) var(--ui-space-8)',
                  borderRadius: 'var(--ui-radius-pill)',
                  backgroundColor: `color-mix(in srgb, ${tag.color} 15%, transparent)`,
                  color: tag.color,
                  border: `1px solid color-mix(in srgb, ${tag.color} 40%, transparent)`,
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase' as const,
                  cursor: 'pointer',
                  transition: 'transform 0.16s ease, background-color 0.16s ease',
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>
        )}

        {/* 생성된 프롬프트 영역 */}
        <div
          style={{
            backgroundColor: 'var(--bg-canvas)',
            borderRadius: 'var(--ui-space-8)',
            border: `1px solid ${hasDisplayPrompt || hasExecutionPrompt ? `color-mix(in srgb, ${getMixedColor()} 50%, var(--border-node))` : 'var(--border-node)'}`,
            padding: 'var(--ui-space-12)',
            minHeight: !isAnyConnected || (isTranslating && !koreanPrompt && !englishPrompt) || showExecutionPrompt ? '220px' : 'auto',
            position: 'relative',
            transition: 'border-color 0.3s ease',
          }}
        >
          {/* 빈 상태 */}
          {!isAnyConnected && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', height: 'var(--size-preview-height)', gap: 'var(--ui-space-8)' }}>
              <Sparkles size={20} color="var(--text-muted)" />
              <span style={{ fontSize: 'calc(var(--ui-type-xs-size) * 1.1)', color: 'var(--text-muted)', textAlign: 'center' as const }}>
                노드를 연결하면<br />AI 프롬프트가 생성됩니다
              </span>
            </div>
          )}

          {/* 생성 중 */}
          {isAnyConnected && isTranslating && !koreanPrompt && !englishPrompt && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', height: 'var(--size-preview-height)', gap: 'var(--ui-space-8)' }}>
              <Loader2 size={20} color="var(--text-secondary)" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 'calc(var(--ui-type-xs-size) * 1.1)', color: 'var(--text-secondary)' }}>
                Codex가 프롬프트 생성 중... {translateElapsedLabel ?? '0초'}
              </span>
            </div>
          )}

          {/* 한국어 표시 브리프 */}
          {isAnyConnected && (koreanPrompt || englishPrompt) && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--ui-space-10)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--ui-space-10)' }}>
                <span style={{ fontSize: 'calc(var(--ui-type-xs-size) * 1.1)', fontWeight: 800, color: 'var(--text-secondary)' }}>
                  프롬프트
                </span>
                {englishPrompt ? (
                  <button
                    type="button"
                    className="nodrag"
                    onClick={() => setShowExecutionPrompt((prev) => !prev)}
                    aria-label={showExecutionPrompt ? '영문 프롬프트 숨기기' : '영문 프롬프트 표시'}
                    title={showExecutionPrompt ? '영문 프롬프트 숨기기' : '영문 프롬프트 표시'}
                    style={{
                      height: "var(--size-control-md)",
                      padding: '0 var(--ui-space-10)',
                      borderRadius: "var(--ui-radius-pill)",
                      border: '1px solid var(--border-node)',
                      backgroundColor: showExecutionPrompt ? 'var(--bg-node-base)' : 'transparent',
                      color: 'var(--text-secondary)',
                      fontSize: "calc(var(--ui-type-xs-size) * 1.1)",
                      fontWeight: 850,
                      cursor: 'pointer',
                    }}
                  >
                    {showExecutionPrompt ? '한글' : '영문'}
                  </button>
                ) : null}
              </div>
              {styleReferenceSummary ? (
                <div
                  style={{
                    display: 'grid',
                    gap: 'var(--ui-space-4)',
                    border: '1px solid color-mix(in srgb, var(--port-style) 36%, var(--border-node))',
                    borderRadius: 'var(--ui-space-10)',
                    backgroundColor: 'color-mix(in srgb, var(--port-style) 8%, transparent)',
                    padding: 'var(--ui-space-8) var(--ui-space-10)',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', fontSize: 'var(--ui-type-xs-size)', fontWeight: 850 }}>
                    스타일 참조 이미지: {styleReferenceSummary.label}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--ui-type-xs-size)', lineHeight: 1.55 }}>
                    영향도: {styleReferenceSummary.weight === 'strong' ? '강하게' : styleReferenceSummary.weight === 'subtle' ? '약하게' : '보통'} · 스타일만 반영, 주제와 구도는 설명/설정 노드가 우선합니다.
                  </span>
                  {!styleReferenceSummary.hasImage ? (
                    <span style={{ color: 'var(--port-constraint)', fontSize: 'var(--ui-type-xs-size)', fontWeight: 800 }}>
                      참조 이미지가 없어 텍스트 스타일만 전달됩니다.
                    </span>
                  ) : null}
                </div>
              ) : null}
              {!showExecutionPrompt ? (
                <textarea
                  ref={koreanPromptTextareaRef}
                  className="nodrag nowheel"
                  value={koreanPrompt || ''}
                  onChange={(event) => setKoreanPrompt?.(event.target.value)}
                  placeholder="한국어 생성 브리프를 직접 다듬으세요."
                  style={{
                    width: '100%',
                    minHeight: 'var(--size-output-text-min-height)',
                    maxHeight: '180px',
                    boxSizing: 'border-box',
                    resize: 'none',
                    overflow: 'auto',
                    border: '1px solid var(--border-node)',
                    borderRadius: 'var(--ui-space-10)',
                    backgroundColor: 'color-mix(in srgb, var(--bg-node-base) 42%, transparent)',
                    padding: 'var(--ui-space-10)',
                    fontSize: 'var(--ui-type-xs-2-size)',
                    lineHeight: '1.75',
                    color: 'var(--text-primary)',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word' as const,
                    userSelect: 'text' as const,
                    outline: 'none',
                  }}
                />
              ) : null}

              {englishPrompt && showExecutionPrompt ? (
                <div style={{ position: 'relative' }}>
                  <p
                    style={{
                      margin: 0,
                      minHeight: "var(--size-output-text-min-height)",
                      maxHeight: "240px",
                      overflow: 'auto',
                      padding: '10px 10px 48px',
                      borderRadius: 'var(--ui-space-8)',
                      backgroundColor: 'var(--bg-node-base)',
                      border: '1px solid var(--border-node)',
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--ui-type-xs-size)',
                      lineHeight: '1.65',
                      fontFamily: 'monospace',
                      wordBreak: 'break-word' as const,
                      userSelect: 'text' as const,
                    }}
                  >
                    {englishPrompt}
                  </p>
                  <div style={{ position: 'absolute', right: "var(--ui-space-8)", bottom: "var(--ui-space-8)", display: 'flex', gap: "calc(var(--ui-space-unit) * 1.5)" }}>
                    <button
                      type="button"
                      className="nodrag"
                      onClick={onRegenerateEnglishPrompt}
                      disabled={isTranslating || !koreanPrompt.trim()}
                      aria-label="영문 프롬프트 재생성"
                      title="영문 프롬프트 재생성"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: "var(--size-control-lg)",
                        height: "var(--size-control-lg)",
                        borderRadius: "var(--ui-radius-pill)",
                        border: '1px solid var(--border-node)',
                        backgroundColor: 'var(--text-primary)',
                        color: 'var(--bg-node-base)',
                        cursor: isTranslating || !koreanPrompt.trim() ? 'not-allowed' : 'pointer',
                        opacity: isTranslating || !koreanPrompt.trim() ? 0.45 : 1,
                      }}
                    >
                      {isTranslating ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={13} />}
                    </button>
                    <button
                      type="button"
                      className="nodrag"
                      onClick={copyExecutionPrompt}
                      aria-label="영문 프롬프트 복사"
                      title={isExecutionPromptCopied ? '복사됨' : '영문 프롬프트 복사'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: "var(--size-control-lg)",
                        height: "var(--size-control-lg)",
                        borderRadius: "var(--ui-radius-pill)",
                        border: '1px solid var(--border-node)',
                        backgroundColor: 'var(--bg-canvas)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      {isExecutionPromptCopied ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* 연결은 됐지만 아직 프롬프트 없는 경우 */}
          {isAnyConnected && !isTranslating && !koreanPrompt && !englishPrompt && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'var(--size-preview-height)' }}>
              <span style={{ fontSize: 'calc(var(--ui-type-xs-size) * 1.1)', color: 'var(--text-muted)' }}>입력을 기다리는 중...</span>
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
            gap: 'var(--ui-space-8)',
            backgroundColor: (!canGenerate || isGenerating) ? 'var(--bg-node-base)' : 'var(--text-primary)',
            color: (!canGenerate || isGenerating) ? 'var(--text-muted)' : 'var(--bg-node-base)',
            padding: '12px 16px',
            borderRadius: 'var(--ui-radius-pill)',
            fontWeight: 600,
            fontSize: 'var(--ui-type-sm-6-size)',
            border: (!canGenerate || isGenerating) ? '1px solid var(--border-node)' : 'none',
            cursor: (!canGenerate || isGenerating) ? 'not-allowed' : 'pointer',
            transition: 'all 0.18s ease',
            width: '100%',
          }}
        >
          {isGenerating
            ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> 생성 중... {generateElapsedLabel ?? '0초'}</>
            : isTranslating
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> 프롬프트 생성 중... {translateElapsedLabel ?? '0초'}</>
            : <><Play size={16} fill="currentColor" /> 이미지 생성</>
          }
        </button>

        {hasExecutionPrompt && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 'calc(var(--ui-type-xs-size) * 1.1)', fontWeight: 700 }}>
              이미지 생성에는 영문 실행 프롬프트가 전달됩니다.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
