"use client";
// src/components/StyleAddModal.tsx
import React, { useRef, useState, useCallback, useEffect } from "react";
import { Upload, Link, X, Sparkles, Loader2, ImageIcon, Check, Search, Library, Tags } from "lucide-react";

export interface StyleEntry {
  id: string;
  imageUrl: string;
  prompt: string;
  label: string;
  weight?: "subtle" | "medium" | "strong";
  mode?: "style-only";
  referenceMode?: "text-only" | "image-reference";
  requiresImage?: boolean;
  source?: "upload" | "url" | "library" | "consistency";
}

type StyleReferenceLibraryItem = {
  id: string;
  collection: string;
  title: string;
  imageUrl: string;
  prompt: string;
  primaryCategory: string;
  styleTags: string[];
  subjectTags: string[];
  productionTags: string[];
  reviewStatus: string;
  conversionStatus: string;
};

type StyleReferenceLibraryResponse = {
  totalItems: number;
  collections: { id: string; label: string; count: number }[];
  categoryCounts: Record<string, number>;
  styleTagCounts: Record<string, number>;
  items: StyleReferenceLibraryItem[];
};

type AddTab = "upload" | "url" | "library";
type ScrollAreaAxis = "x" | "y";

interface Props {
  onAdd: (entry: StyleEntry) => void;
  onClose: () => void;
  mode?: "style" | "character" | "object";
  initialTab?: AddTab;
}

const MODAL_COPY = {
  style: {
    title: "스타일 추가",
    promptLabel: "스타일 프롬프트",
    fallbackLabel: "사용자 스타일",
    alt: "Style reference",
    helper: "Codex가 스타일을 분석 중입니다",
    placeholder: "스타일을 직접 설명하거나 'Codex 자동 분석'으로 제안을 받으세요...",
  },
  character: {
    title: "캐릭터 참조 추가",
    promptLabel: "캐릭터 고정 프롬프트",
    fallbackLabel: "캐릭터 참조",
    alt: "Character reference",
    helper: "Codex가 캐릭터 특징을 분석 중입니다",
    placeholder: "캐릭터의 외형, 의상, 비율, 특징을 직접 입력하거나 자동 분석하세요...",
  },
  object: {
    title: "오브젝트 참조 추가",
    promptLabel: "오브젝트 고정 프롬프트",
    fallbackLabel: "오브젝트 참조",
    alt: "Object reference",
    helper: "Codex가 오브젝트 형태를 분석 중입니다",
    placeholder: "오브젝트의 형태, 구조, 색상, 소재를 직접 입력하거나 자동 분석하세요...",
  },
} as const;

function formatDurationLabel(totalSeconds: number | null) {
  if (totalSeconds === null) return null;
  if (totalSeconds < 60) return `${totalSeconds}초`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds === 0 ? `${minutes}분` : `${minutes}분 ${seconds}초`;
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

function topEntries(counts: Record<string, number>, limit: number) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}

function ScrollArea({
  axis,
  children,
  style,
}: {
  axis: ScrollAreaAxis;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleScroll = () => {
    setIsScrolling(true);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
      timeoutRef.current = null;
    }, 700);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (axis !== "x") return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const target = scrollRef.current;
    if (!target) return;
    target.scrollLeft += event.deltaY;
    handleScroll();
    event.preventDefault();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className={[
        "style-modal-scrollarea",
        axis === "x" ? "style-modal-scrollarea-x" : "style-modal-scrollarea-y",
        isScrolling ? "is-scrolling" : "",
      ].filter(Boolean).join(" ")}
      onScroll={handleScroll}
      onWheel={handleWheel}
      style={style}
    >
      {children}
    </div>
  );
}

export function StyleAddModal({ onAdd, onClose, mode = "style", initialTab }: Props) {
  const copy = MODAL_COPY[mode];
  const [activeTab, setActiveTab] = useState<AddTab>(() => (
    mode === "style" && initialTab === "library" ? "library" : "upload"
  ));
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [prompt, setPrompt] = useState<string>("");
  const [useImageReference, setUseImageReference] = useState(false);
  const [urlInput, setUrlInput] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string>("");
  const [analyzeElapsedSeconds, setAnalyzeElapsedSeconds] = useState(0);
  const [lastAnalyzeDurationSeconds, setLastAnalyzeDurationSeconds] = useState<number | null>(null);
  const [library, setLibrary] = useState<StyleReferenceLibraryResponse | null>(null);
  const [isLibraryLoading, setIsLibraryLoading] = useState(() => (
    mode === "style" && initialTab === "library"
  ));
  const [libraryError, setLibraryError] = useState("");
  const [libraryQuery, setLibraryQuery] = useState("");
  const [libraryCategory, setLibraryCategory] = useState("all");
  const [libraryTag, setLibraryTag] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analyzeStartedAtRef = useRef<number | null>(null);
  const nextEntryIdRef = useRef(0);

  const createEntryId = (prefix: string) => {
    nextEntryIdRef.current += 1;
    return `${prefix}-${nextEntryIdRef.current}`;
  };

  // 파일 → base64 변환
  const loadFile = (file: File) => {
    const mime = file.type || "image/jpeg";
    setMimeType(mime);
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setImageBase64(b64);
      setImageUrl(b64);
    };
    reader.readAsDataURL(file);
  };

  // 외부 URL → canvas → base64 변환
  const loadFromUrl = (url: string) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      const b64 = canvas.toDataURL("image/jpeg", 0.85);
      setImageBase64(b64);
      setImageUrl(url);
      setMimeType("image/jpeg");
    };
    img.onerror = () => {
      // CORS 실패 시 URL 그대로 사용
      setImageUrl(url);
      setImageBase64("");
    };
    img.src = url;
  };

  // 드래그 & 드롭
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      loadFile(file);
      return;
    }
    // URL 드롭 시도
    const text = e.dataTransfer.getData("text/plain") || e.dataTransfer.getData("text/uri-list");
    if (text && (text.startsWith("http") || text.startsWith("https"))) {
      loadFromUrl(text);
    }
  }, []);

  // URL 입력 확인
  const handleUrlSubmit = () => {
    const url = urlInput.trim();
    if (!url) return;
    loadFromUrl(url);
    setUrlInput("");
  };

  const handleTabChange = (tab: AddTab) => {
    setActiveTab(tab);
    setAnalyzeError("");
    if (tab === "library") {
      setImageUrl("");
      setImageBase64("");
      setPrompt("");
      setUseImageReference(false);
      if (!library) {
        setIsLibraryLoading(true);
        setLibraryError("");
      }
    }
  };

  // Codex 이미지 분석
  const handleAnalyze = async () => {
    if (!imageBase64 && !imageUrl) return;
    setIsAnalyzing(true);
    setAnalyzeError("");
    try {
      const res = await fetch("/api/analyze-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imageBase64 || imageUrl, mimeType, mode }),
      });
      const data = await res.json();
      if (data.suggestedPrompt) {
        setPrompt(data.suggestedPrompt);
      } else {
        setAnalyzeError(data.error || "분석 실패");
      }
    } catch (error: unknown) {
      setAnalyzeError(error instanceof Error ? error.message : "분석 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (!isAnalyzing) {
      if (analyzeStartedAtRef.current !== null) {
        const elapsed = Math.max(1, Math.round((Date.now() - analyzeStartedAtRef.current) / 1000));
        setLastAnalyzeDurationSeconds(elapsed);
        setAnalyzeElapsedSeconds(0);
        analyzeStartedAtRef.current = null;
      }
      return;
    }

    analyzeStartedAtRef.current = Date.now();
    setAnalyzeElapsedSeconds(0);
    const intervalId = window.setInterval(() => {
      if (analyzeStartedAtRef.current === null) return;
      setAnalyzeElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - analyzeStartedAtRef.current) / 1000)),
      );
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAnalyzing]);

  // 스타일 추가
  const handleAdd = () => {
    if (!imageUrl) return;
    onAdd({
      id: createEntryId("style"),
      imageUrl,
      prompt: prompt.trim(),
      label: prompt.trim().slice(0, 30) || copy.fallbackLabel,
      weight: "medium",
      mode: "style-only",
      referenceMode: mode === "character" && useImageReference ? "image-reference" : "text-only",
      requiresImage: mode === "style",
      source: activeTab === "url" ? "url" : "upload",
    });
    onClose();
  };

  const handleLibraryAdd = (item: StyleReferenceLibraryItem) => {
    onAdd({
      id: createEntryId(`library-${item.collection}-${item.id}`),
      imageUrl: item.imageUrl,
      prompt: item.prompt,
      label: item.title,
      weight: "medium",
      mode: "style-only",
      requiresImage: item.productionTags.includes("needs-reference-image"),
      source: "library",
    });
    onClose();
  };

  useEffect(() => {
    if (mode !== "style" || activeTab !== "library" || library || !isLibraryLoading) return;

    let cancelled = false;
    fetch("/api/style-references")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "스타일 라이브러리를 불러오지 못했습니다.");
        return payload as StyleReferenceLibraryResponse;
      })
      .then((payload) => {
        if (!cancelled) setLibrary(payload);
      })
      .catch((error: unknown) => {
        if (!cancelled) setLibraryError(error instanceof Error ? error.message : "스타일 라이브러리를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!cancelled) setIsLibraryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, isLibraryLoading, library, mode]);

  const canAdd = !!imageUrl;
  const hasImage = !!imageUrl;
  const canUseImageReference = mode === "character" && hasImage;
  const showLibraryTab = mode === "style";
  const availableTabs: { id: AddTab; label: string }[] = showLibraryTab
    ? [
      { id: "upload", label: "업로드" },
      { id: "url", label: "URL" },
      { id: "library", label: "라이브러리" },
    ]
    : [
      { id: "upload", label: "업로드" },
      { id: "url", label: "URL" },
    ];
  const query = normalizeSearchText(libraryQuery);
  const filteredLibraryItems = (library?.items || []).filter((item) => {
    if (libraryCategory !== "all" && item.primaryCategory !== libraryCategory) return false;
    if (libraryTag !== "all" && !item.styleTags.includes(libraryTag)) return false;
    if (!query) return true;
    const searchable = [
      item.title,
      item.prompt,
      item.primaryCategory,
      ...item.styleTags,
      ...item.subjectTags,
      ...item.productionTags,
    ].join(" ").toLowerCase();
    return searchable.includes(query);
  });
  const renderedLibraryItems = filteredLibraryItems.slice(0, 80);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* 오버레이 */}
      <div
        style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)", zIndex: 1000, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}
        onClick={onClose}
      />

      {/* 모달 */}
      <div
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001, width: "var(--size-modal-style-width)", maxWidth: "95vw",
          backgroundColor: "var(--bg-node-base)",
          border: "1px solid var(--border-node)",
          borderRadius: "var(--ui-radius-2xl)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          overflow: "hidden",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 헤더 */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "var(--ui-space-16) var(--ui-space-20)",
          borderBottom: "1px solid var(--border-node)",
          backgroundColor: "var(--bg-node-header)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-space-8)" }}>
            <ImageIcon size={16} color="var(--text-secondary)" />
            <span style={{ fontSize: "var(--ui-type-sm-6-size)", fontWeight: 700, color: "var(--text-primary)" }}>
              {copy.title}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "var(--ui-radius-md)", display: "flex" }}>
            <X size={16} color="var(--text-secondary)" />
          </button>
        </div>

        {/* 바디 */}
        <div style={{ padding: "var(--ui-space-20)", display: "flex", flexDirection: "column", gap: "16px", minHeight: 0, flex: "1 1 auto", overflow: activeTab === "library" ? "hidden" : "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${availableTabs.length}, minmax(0, 1fr))`, gap: "var(--ui-space-6)", padding: "var(--ui-space-4)", borderRadius: "var(--ui-radius-pill)", backgroundColor: "var(--bg-canvas)", border: "1px solid var(--border-node)" }}>
            {availableTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    border: "none",
                    borderRadius: "var(--ui-radius-pill)",
                    minHeight: 30,
                    backgroundColor: isActive ? "var(--text-primary)" : "transparent",
                    color: isActive ? "var(--bg-node-base)" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "var(--ui-type-xs-2-size)",
                    fontWeight: 800,
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 이미지 첨부 영역 */}
          {activeTab === "library" && showLibraryTab ? (
            <div style={{ display: "grid", gridTemplateRows: "auto auto auto minmax(0, 1fr) auto", gap: "var(--ui-space-12)", minHeight: 0, height: "100%" }}>
              <div style={{ display: "flex", gap: "var(--ui-space-8)" }}>
                <div style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--ui-space-8)",
                  backgroundColor: "var(--bg-canvas)",
                  border: "1px solid var(--border-node)",
                  borderRadius: "var(--ui-space-8)",
                  padding: "0 var(--ui-space-12)",
                }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="제목, 프롬프트, 태그 검색..."
                    value={libraryQuery}
                    onChange={(event) => setLibraryQuery(event.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      background: "none",
                      border: "none",
                      outline: "none",
                      fontSize: "var(--ui-type-xs-2-size)",
                      color: "var(--text-primary)",
                      padding: "10px 0",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gap: "var(--ui-space-8)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--ui-space-8)", color: "var(--text-muted)", fontSize: "var(--ui-type-xs-size)", fontWeight: 800 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--ui-space-6)" }}>
                    <Library size={12} />
                    카테고리
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 800 }}>가로 스크롤</span>
                </div>
                <ScrollArea axis="x" style={{ display: "flex", gap: "var(--ui-space-6)", paddingBottom: 4, WebkitMaskImage: "linear-gradient(90deg, black 88%, transparent)" }}>
                  <FilterPill label="전체" active={libraryCategory === "all"} onClick={() => setLibraryCategory("all")} />
                  {topEntries(library?.categoryCounts || {}, 12).map(([category, count]) => (
                    <FilterPill
                      key={category}
                      label={`${category.replace(/-/g, " ")} ${count}`}
                      active={libraryCategory === category}
                      onClick={() => setLibraryCategory(category)}
                    />
                  ))}
                </ScrollArea>
              </div>

              <div style={{ display: "grid", gap: "var(--ui-space-8)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--ui-space-8)", color: "var(--text-muted)", fontSize: "var(--ui-type-xs-size)", fontWeight: 800 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--ui-space-6)" }}>
                    <Tags size={12} />
                    스타일 태그
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 800 }}>가로 스크롤</span>
                </div>
                <ScrollArea axis="x" style={{ display: "flex", gap: "var(--ui-space-6)", paddingBottom: 4, WebkitMaskImage: "linear-gradient(90deg, black 88%, transparent)" }}>
                  <FilterPill label="전체" active={libraryTag === "all"} onClick={() => setLibraryTag("all")} />
                  {topEntries(library?.styleTagCounts || {}, 14).map(([tag, count]) => (
                    <FilterPill
                      key={tag}
                      label={`${tag.replace(/-/g, " ")} ${count}`}
                      active={libraryTag === tag}
                      onClick={() => setLibraryTag(tag)}
                    />
                  ))}
                </ScrollArea>
              </div>

              <ScrollArea axis="y" style={{ minHeight: 0, height: "100%", border: "1px solid var(--border-node)", borderRadius: "var(--ui-radius-xl)", backgroundColor: "var(--bg-canvas)", padding: "var(--ui-space-8)" }}>
                {isLibraryLoading && (
                  <div style={{ minHeight: 260, display: "grid", placeItems: "center", color: "var(--text-secondary)", fontSize: "var(--ui-type-xs-2-size)", fontWeight: 700 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "var(--ui-space-8)" }}>
                      <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                      스타일 라이브러리 불러오는 중
                    </span>
                  </div>
                )}

                {libraryError && !isLibraryLoading && (
                  <div style={{ minHeight: 260, display: "grid", placeItems: "center", textAlign: "center", color: "var(--port-constraint)", fontSize: "var(--ui-type-xs-2-size)", lineHeight: 1.6, padding: "var(--ui-space-20)" }}>
                    {libraryError}
                  </div>
                )}

                {!isLibraryLoading && !libraryError && filteredLibraryItems.length === 0 && (
                  <div style={{ minHeight: 260, display: "grid", placeItems: "center", textAlign: "center", color: "var(--text-muted)", fontSize: "var(--ui-type-xs-2-size)", lineHeight: 1.6 }}>
                    조건에 맞는 스타일 참조가 없습니다.
                  </div>
                )}

                {!isLibraryLoading && !libraryError && filteredLibraryItems.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--ui-space-8)" }}>
                    {renderedLibraryItems.map((item) => (
                      <button
                        key={`${item.collection}-${item.id}`}
                        type="button"
                        onClick={() => handleLibraryAdd(item)}
                        style={{
                          border: "1px solid var(--border-node)",
                          borderRadius: "var(--ui-space-10)",
                          backgroundColor: "var(--bg-node-base)",
                          color: "var(--text-secondary)",
                          cursor: "pointer",
                          padding: 0,
                          textAlign: "left",
                          overflow: "hidden",
                          display: "grid",
                          gridTemplateRows: "118px 1fr",
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", backgroundColor: "var(--bg-node-header)" }}
                          loading="lazy"
                        />
                        <span style={{ display: "grid", gap: "var(--ui-space-6)", padding: "var(--ui-space-8)" }}>
                          <span style={{ color: "var(--text-primary)", fontSize: "var(--ui-type-xs-2-size)", fontWeight: 850, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.title}
                          </span>
                          <span style={{ color: "var(--port-style)", fontSize: "var(--ui-type-xs-size)", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.primaryCategory.replace(/-/g, " ")}
                          </span>
                          <span style={{ color: "var(--text-muted)", fontSize: "var(--ui-type-xs-size)", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                            {item.prompt}
                          </span>
                          <span style={{ display: "flex", gap: "var(--ui-space-4)", flexWrap: "wrap", maxHeight: 22, overflow: "hidden" }}>
                            {item.styleTags.slice(0, 3).map((tag) => (
                              <span key={tag} style={{ borderRadius: "var(--ui-radius-pill)", border: "1px solid var(--border-node)", padding: "1px var(--ui-space-6)", color: "var(--text-muted)", fontSize: "10px", fontWeight: 750 }}>
                                {tag.replace(/-/g, " ")}
                              </span>
                            ))}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {library && (
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--ui-type-xs-size)", lineHeight: 1.5 }}>
                  {renderedLibraryItems.length}개 표시 · 검색 결과 {filteredLibraryItems.length}개 · 전체 {library.totalItems}개. 카드를 선택하면 스타일 참조 노드에 바로 추가됩니다.
                </p>
              )}
            </div>
          ) : activeTab === "upload" && !hasImage ? (
            <div>
              {/* 드롭존 */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? "var(--port-style)" : "var(--border-node)"}`,
                  borderRadius: "var(--ui-radius-xl)",
                  padding: "var(--ui-space-32) var(--ui-space-20)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: "var(--ui-space-12)",
                  cursor: "pointer",
                  backgroundColor: isDragging ? "color-mix(in srgb, var(--port-style) 8%, transparent)" : "var(--bg-canvas)",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                }}
              >
                <div style={{
                  width: "var(--size-icon-container)", height: "var(--size-icon-container)", borderRadius: "var(--ui-radius-xl)",
                  backgroundColor: "color-mix(in srgb, var(--port-style) 15%, transparent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Upload size={22} color="var(--port-style)" />
                </div>
                <div>
                  <p style={{ fontSize: "var(--ui-type-sm-size)", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px" }}>
                    이미지를 드래그해서 놓기
                  </p>
                  <p style={{ fontSize: "calc(var(--ui-type-xs-size) * 1.1)", color: "var(--text-muted)", margin: 0 }}>
                    또는 클릭해서 파일 선택 · PNG, JPG, WEBP
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }}
              />

            </div>
          ) : activeTab === "url" && !hasImage ? (
            <div>
              <div style={{ display: "flex", gap: "var(--ui-space-8)", marginTop: "10px" }}>
                <div style={{
                  flex: 1, display: "flex", alignItems: "center", gap: "var(--ui-space-8)",
                  backgroundColor: "var(--bg-canvas)", border: "1px solid var(--border-node)",
                  borderRadius: "var(--ui-space-8)", padding: "0 var(--ui-space-12)",
                }}>
                  <Link size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="이미지 URL 붙여넣기..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleUrlSubmit(); }}
                    style={{
                      flex: 1, background: "none", border: "none", outline: "none",
                      fontSize: "var(--ui-type-xs-2-size)", color: "var(--text-primary)", padding: "10px 0",
                    }}
                  />
                </div>
                <button
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                  style={{
                    padding: "0 var(--ui-space-16)", borderRadius: "var(--ui-space-8)", fontSize: "var(--ui-type-xs-2-size)", fontWeight: 600,
                    border: "1px solid var(--border-node)", cursor: urlInput.trim() ? "pointer" : "not-allowed",
                    backgroundColor: urlInput.trim() ? "var(--text-primary)" : "var(--bg-canvas)",
                    color: urlInput.trim() ? "var(--bg-node-base)" : "var(--text-muted)",
                    transition: "all 0.15s",
                  }}
                >
                  확인
                </button>
              </div>
            </div>
          ) : activeTab !== "library" ? (
            /* 이미지 미리보기 */
            <div style={{ position: "relative", borderRadius: "var(--ui-radius-xl)", overflow: "hidden", height: "var(--size-modal-preview-height)" }}>
              <img
                src={imageUrl}
                alt={copy.alt}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                onClick={() => { setImageUrl(""); setImageBase64(""); setPrompt(""); setUseImageReference(false); }}
                style={{
                  position: "absolute", top: "var(--ui-space-8)", right: "var(--ui-space-8)",
                  width: "var(--size-control-md)", height: "var(--size-control-md)", borderRadius: "50%",
                  backgroundColor: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={14} color="white" />
              </button>
            </div>
          ) : null}

          {activeTab !== "library" && (
            <>
              {/* 스타일 프롬프트 입력 */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "var(--ui-type-xs-2-size)", fontWeight: 600, color: "var(--text-secondary)" }}>
                    {copy.promptLabel}
                  </label>
                  <button
                    onClick={handleAnalyze}
                    disabled={!hasImage || isAnalyzing}
                    style={{
                      display: "flex", alignItems: "center", gap: "calc(var(--ui-space-unit) * 1.5)",
                      padding: "var(--ui-space-4) var(--ui-space-10)", borderRadius: "var(--ui-radius-pill)", fontSize: "calc(var(--ui-type-xs-size) * 1.1)", fontWeight: 700,
                      border: "1px solid var(--port-style)",
                      backgroundColor: hasImage && !isAnalyzing
                        ? "color-mix(in srgb, var(--port-style) 15%, transparent)"
                        : "transparent",
                      color: hasImage ? "var(--port-style)" : "var(--text-muted)",
                      cursor: hasImage && !isAnalyzing ? "pointer" : "not-allowed",
                      transition: "all 0.15s",
                    }}
                  >
                    {isAnalyzing
                      ? <><Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> 분석 중... {formatDurationLabel(analyzeElapsedSeconds) ?? "0초"}</>
                      : <><Sparkles size={11} /> Codex 자동 분석</>
                    }
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={hasImage
                    ? copy.placeholder
                    : "이미지를 먼저 첨부하세요."}
                  rows={4}
                  style={{
                    width: "100%", boxSizing: "border-box" as const,
                    backgroundColor: "var(--bg-canvas)",
                    border: "1px solid var(--border-node)",
                    borderRadius: "var(--ui-space-8)", padding: "var(--ui-space-12)",
                    fontSize: "var(--ui-type-xs-2-size)", lineHeight: "1.6",
                    color: "var(--text-primary)", resize: "vertical" as const, outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                {(isAnalyzing || lastAnalyzeDurationSeconds) && (
                  <p style={{ fontSize: "calc(var(--ui-type-xs-size) * 1.1)", color: "var(--text-secondary)", marginTop: "6px" }}>
                    {isAnalyzing
                      ? `${copy.helper} · ${formatDurationLabel(analyzeElapsedSeconds) ?? "0초"}`
                      : `마지막 분석 완료 · ${formatDurationLabel(lastAnalyzeDurationSeconds)}`}
                  </p>
                )}
                {analyzeError && (
                  <p style={{ fontSize: "calc(var(--ui-type-xs-size) * 1.1)", color: "var(--port-constraint)", marginTop: "4px" }}>{analyzeError}</p>
                )}
              </div>

              {mode === "character" && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--ui-space-8)",
                    padding: "var(--ui-space-10) var(--ui-space-12)",
                    borderRadius: "var(--ui-space-8)",
                    border: `1px solid ${useImageReference ? "var(--port-character-reference)" : "var(--border-node)"}`,
                    backgroundColor: useImageReference
                      ? "color-mix(in srgb, var(--port-character-reference) 8%, transparent)"
                      : "var(--bg-canvas)",
                    color: canUseImageReference ? "var(--text-primary)" : "var(--text-muted)",
                    cursor: canUseImageReference ? "pointer" : "not-allowed",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={useImageReference}
                    disabled={!canUseImageReference}
                    onChange={(event) => setUseImageReference(event.target.checked)}
                    style={{ marginTop: 2, accentColor: "var(--port-character-reference)" }}
                  />
                  <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: "var(--ui-type-xs-2-size)", fontWeight: 800 }}>
                      첨부 이미지를 실제 캐릭터 참조로 사용
                    </span>
                    <span style={{ fontSize: "var(--ui-type-xs-size)", lineHeight: 1.45, color: "var(--text-secondary)" }}>
                      {hasImage ? "체크하면 얼굴, 헤어, 의상 같은 정체성 정보를 이미지 입력으로 함께 보냅니다." : "이미지를 업로드하면 선택할 수 있습니다."}
                    </span>
                  </span>
                </label>
              )}

              {/* 액션 버튼 */}
              <div style={{ display: "flex", gap: "var(--ui-space-8)", justifyContent: "flex-end" }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: "var(--ui-space-10) var(--ui-space-20)", borderRadius: "var(--ui-space-8)", fontSize: "var(--ui-type-sm-size)",
                    border: "1px solid var(--border-node)", backgroundColor: "var(--bg-canvas)",
                    color: "var(--text-secondary)", cursor: "pointer",
                  }}
                >
                  취소
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!canAdd}
                  style={{
                    display: "flex", alignItems: "center", gap: "calc(var(--ui-space-unit) * 1.5)",
                    padding: "var(--ui-space-10) var(--ui-space-20)", borderRadius: "var(--ui-space-8)", fontSize: "var(--ui-type-sm-size)", fontWeight: 700,
                    border: "none",
                    backgroundColor: canAdd ? "var(--text-primary)" : "var(--bg-node-base)",
                    color: canAdd ? "var(--bg-node-base)" : "var(--text-muted)",
                    cursor: canAdd ? "pointer" : "not-allowed",
                    transition: "all 0.15s",
                  }}
                >
                  <Check size={14} />
                  스타일 추가
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: "0 0 auto",
        border: `1px solid ${active ? "var(--port-style)" : "var(--border-node)"}`,
        borderRadius: "var(--ui-radius-pill)",
        backgroundColor: active ? "color-mix(in srgb, var(--port-style) 14%, transparent)" : "var(--bg-node-base)",
        color: active ? "var(--port-style)" : "var(--text-secondary)",
        cursor: "pointer",
        fontSize: "var(--ui-type-xs-size)",
        fontWeight: 800,
        padding: "var(--ui-space-4) var(--ui-space-8)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
