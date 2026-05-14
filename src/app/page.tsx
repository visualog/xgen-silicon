"use client";

import { useState, useRef, useEffect } from "react";
import { CircleCheck } from "lucide-react";
import styles from "./page.module.css";

const STORAGE_KEY = "brandgen_state"; // canonical key
const STYLE_SAMPLES: { id: string; label: string; icon: string }[] = [];

// 이전 키들에서 데이터 마이그레이션
const LEGACY_KEYS = ["brandgen_bento_v1", "brandgen_state_v2", "brandgen_state"];

function loadPersistedState() {
  for (const key of LEGACY_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      // 유효한 데이터가 있으면 canonical key로 통합 저장
      if (parsed.history?.length || parsed.customStyles?.length || parsed.lastImageUrl) {
        localStorage.setItem(STORAGE_KEY, raw);
        // 구 키 정리
        LEGACY_KEYS.forEach(k => { if (k !== STORAGE_KEY) localStorage.removeItem(k); });
        return parsed;
      }
    } catch { /* ignore */ }
  }
  return null;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [customStyles, setCustomStyles] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Persistence: Load ─────────────────────────
  useEffect(() => {
    const saved = loadPersistedState();
    if (!saved) return;
    if (saved.history)      setHistory(saved.history);
    if (saved.customStyles) setCustomStyles(saved.customStyles);
    if (saved.lastImageUrl) setImageUrl(saved.lastImageUrl);
    if (saved.activeStyle)  setActiveStyle(saved.activeStyle);
  }, []);

  // ── Persistence: Save ─────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        history, customStyles, lastImageUrl: imageUrl, activeStyle,
      }));
    } catch { /* ignore */ }
  }, [history, customStyles, imageUrl, activeStyle]);

  // ── Generate ──────────────────────────────────
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(false);
    try {
      const currentCustomStyle = activeStyle?.startsWith("custom-")
        ? customStyles[parseInt(activeStyle.split("-")[1])]
        : null;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style: currentCustomStyle ? "custom" : activeStyle,
          customStyle: currentCustomStyle,
        }),
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        setHistory(prev => [data.url, ...prev].slice(0, 12));
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Download ──────────────────────────────────
  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `brandgen-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── Upload Style ──────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setCustomStyles(prev => {
        const next = [...prev, b64];
        setActiveStyle(`custom-${next.length - 1}`);
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className={styles.bentoGrid}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* ── 1. Header Card ─────────────────────── */}
      <div className={styles.headerCard}>
        <div className={styles.logoContainer}>
          <span className={styles.logo}>BrandGen</span>
          <span className={styles.betaBadge}>Beta</span>
        </div>
      </div>

      {/* ── 2. Canvas Card ─────────────────────── */}
      <div className={styles.canvasCard}>
        {/* Loading */}
        {isGenerating && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            <span className={styles.loadingText}>일러스트 생성 중…</span>
          </div>
        )}

        {/* Error */}
        {error && !isGenerating && (
          <div className={styles.loadingOverlay}>
            <span style={{ fontSize: 13, color: "#ef4444" }}>생성 실패 — 다시 시도해 주세요</span>
            <button
              onClick={handleGenerate}
              style={{
                marginTop: 4,
                padding: "8px 16px",
                borderRadius: 10,
                background: "#09090b",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              재시도
            </button>
          </div>
        )}

        {/* Image */}
        {imageUrl && !error ? (
          <img
            src={imageUrl}
            alt="Generated illustration"
            className={styles.canvasImage}
            style={{ opacity: isGenerating ? 0.2 : 1 }}
            onError={() => setError(true)}
          />
        ) : !isGenerating && !error ? (
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>✦</div>
            <p className={styles.placeholderText}>
              스타일을 선택하고<br />프롬프트를 입력하세요
            </p>
          </div>
        ) : null}
      </div>

      {/* ── 3. Style Card ──────────────────────── */}
      <div className={styles.styleCard}>
        <span className={styles.sectionTitle}>Style</span>
        <div className={styles.styleGrid}>
          {/* Built-in samples */}
          {STYLE_SAMPLES.map(s => (
            <div
              key={s.id}
              className={`${styles.styleItem} ${activeStyle === s.id ? styles.active : ""}`}
              onClick={() => setActiveStyle(prev => prev === s.id ? null : s.id)}
            >
              <span style={{ fontSize: "1.3rem" }}>{s.icon}</span>
              {activeStyle === s.id && (
                <div className={styles.checkIconWrapper}>
                  <CircleCheck fill="var(--color-midnight-ink)" stroke="var(--color-cloud-white)" size={16} />
                </div>
              )}
            </div>
          ))}

          {/* Uploaded custom styles */}
          {customStyles.map((src, i) => {
            const styleId = `custom-${i}`;
            return (
              <div
                key={styleId}
                className={`${styles.styleItem} ${activeStyle === styleId ? styles.active : ""}`}
                onClick={() => setActiveStyle(prev => prev === styleId ? null : styleId)}
              >
                <img src={src} alt={`Style ${i + 1}`} className={styles.styleImage} />
                {activeStyle === styleId && (
                  <div className={styles.checkIconWrapper}>
                    <CircleCheck fill="var(--color-midnight-ink)" stroke="var(--color-cloud-white)" size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Upload button */}
          <div
            className={styles.styleItem}
            onClick={() => fileInputRef.current?.click()}
            title="스타일 이미지 업로드"
          >
            <span className={styles.uploadLabel}>+ Add</span>
          </div>
        </div>
      </div>

      {/* ── 4. Prompt Card ─────────────────────── */}
      <div className={styles.promptCard}>
        <textarea
          className={styles.inputArea}
          placeholder="예: 자전거를 타고 달리는 사람…  ⌘↵ 로 생성"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
          }}
        />
      </div>

      {/* ── 5. Action Card ─────────────────────── */}
      <div className={styles.actionCard}>
        <button
          className={styles.btnGenerate}
          disabled={!prompt.trim() || isGenerating}
          onClick={handleGenerate}
        >
          {isGenerating ? "Generating…" : "Generate"}
        </button>
        <button
          className={styles.btnDownload}
          disabled={!imageUrl || isGenerating}
          onClick={handleDownload}
        >
          Download
        </button>
      </div>

      {/* ── 6. Library Card ────────────────────── */}
      <div className={styles.libraryCard}>
        <span className={styles.libraryLabel}>Library</span>
        {history.length === 0 ? (
          <span className={styles.libraryEmpty}>생성한 이미지가 여기에 쌓입니다</span>
        ) : (
          <div className={styles.libraryScroll}>
            {history.map((url, i) => (
              <div
                key={i}
                className={`${styles.historyThumb} ${imageUrl === url ? styles.activeThumb : ""}`}
                onClick={() => { setImageUrl(url); setError(false); }}
              >
                <img src={url} alt={`History ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
