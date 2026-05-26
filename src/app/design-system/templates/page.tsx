import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata = {
  title: "템플릿 | xGen 디자인 시스템",
  description: "xGen 사이트와 앱에서 사용하는 화면 템플릿 기준.",
};

type TemplateSpec = {
  name: string;
  route: string;
  purpose: string;
  regions: string[];
  components: string[];
  rules: string[];
};

const templateSpecs: TemplateSpec[] = [
  {
    name: "Home Gallery",
    route: "/",
    purpose: "브랜드 이미지 생성 결과를 탐색하고 새 보드를 시작하는 기본 화면.",
    regions: ["Topbar", "Hero summary", "Library heading", "Gallery masonry", "Empty state"],
    components: [".primary-command", ".secondary-command", ".metric-card", ".gallery-card.studio-card", ".tool-pill"],
    rules: ["섹션 타이틀은 --ui-type-section-title을 사용합니다.", "Library 보조 eyebrow는 쓰지 않습니다.", "결과가 없을 때만 empty-state CTA를 노출합니다."],
  },
  {
    name: "Editor Canvas",
    route: "/ editor state",
    purpose: "이미지 생성 조건을 노드로 조립하고 결과를 생성하는 작업 화면.",
    regions: ["Editor topbar", "Mode toggle", "Node add dock", "React Flow canvas", "Output node"],
    components: [".editor-topbar", ".editor-mode-toggle", ".node-add-popover", "Flow Node", "Port Chip"],
    rules: ["제목바와 모드 토글은 분리합니다.", "설정 노드 추가는 compact popover로 유지합니다.", "노드 색은 포트 토큰과 일치해야 합니다."],
  },
  {
    name: "Image Detail Overlay",
    route: "/ gallery selected image",
    purpose: "생성 결과를 크게 보고 프롬프트와 일관성 앨리먼트를 재사용하는 상세 화면.",
    regions: ["Image preview", "Prompt panel", "Consistency elements", "Download/copy actions"],
    components: [".secondary-command", ".tool-pill", "Consistency action buttons", "Modal panel"],
    rules: ["이미지 검토가 우선이므로 preview 영역이 가장 넓어야 합니다.", "프롬프트 언어 토글은 패널 내부 우측 상단에 둡니다.", "일관성 액션은 생성 흐름으로 바로 연결되어야 합니다."],
  },
  {
    name: "Style Add Modal",
    route: "StyleAddModal",
    purpose: "스타일 참조 이미지를 업로드하거나 분석해 스타일 노드에 연결하는 집중 작업.",
    regions: ["Upload dropzone", "Preview", "Detected tags", "Analysis text", "Footer actions"],
    components: ["StyleAddModal", ".primary-command", ".secondary-command", ".tool-pill"],
    rules: ["모달 폭은 --size-modal-style-width를 사용합니다.", "미리보기 높이는 --size-modal-preview-height를 사용합니다.", "분석 오류는 --port-constraint 색을 사용합니다."],
  },
  {
    name: "Design System",
    route: "/design-system",
    purpose: "토큰, 컴포넌트, 템플릿 기준을 확인하는 문서 화면.",
    regions: ["System topbar", "Token sections", "Component link", "Template link"],
    components: [".secondary-command", ".tool-pill", "Token rows", "Pattern preview"],
    rules: ["문서도 primitive 직접 참조 없이 semantic/component 토큰을 사용합니다.", "실제 앱 클래스와 토큰명을 함께 노출합니다.", "컴포넌트와 템플릿 페이지로 분리해 유지합니다."],
  },
];

const shellStyle: CSSProperties = {
  minHeight: "100vh",
  color: "var(--text-primary)",
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--bg-canvas) 90%, var(--brand-tan) 10%), var(--bg-canvas))",
};

const pageStyle: CSSProperties = {
  width: "min(1180px, calc(100vw - 48px))",
  margin: "0 auto",
  padding: "var(--ui-space-24) 0 var(--ui-space-80)",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--ui-space-20)",
  marginBottom: "var(--ui-space-48)",
};

const templateStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(220px, 0.32fr) minmax(0, 1fr)",
  gap: "var(--ui-space-32)",
  padding: "var(--ui-space-24) 0",
  borderTop: "1px solid var(--border-node)",
};

const previewFrameStyle: CSSProperties = {
  padding: "var(--ui-space-16)",
  border: "1px solid color-mix(in srgb, var(--border-node) 76%, transparent)",
  borderRadius: "var(--ui-radius-2xl)",
  background: "var(--bg-canvas)",
  overflow: "hidden",
};

const codeStyle: CSSProperties = {
  display: "inline-block",
  color: "var(--text-tertiary)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: "var(--ui-type-xs-2-size)",
  lineHeight: 1.4,
};

const introStyle: CSSProperties = {
  maxWidth: 760,
  marginBottom: "var(--ui-space-32)",
};

export default function TemplatesPage() {
  return (
    <main style={shellStyle}>
      <div style={pageStyle}>
        <header className="studio-topbar" style={headerStyle} aria-label="xGen 디자인 시스템 템플릿">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 44 44" focusable="false">
                <rect x="5" y="5" width="34" height="34" rx="7.5" fill="currentColor" />
                <path d="M16.2 16.2 27.8 27.8M27.8 16.2 16.2 27.8" />
              </svg>
            </div>
            <div className="brand-breadcrumb" aria-label="현재 위치">
              <Link className="brand-name" href="/">
                xGen
              </Link>
              <span className="breadcrumb-separator" aria-hidden="true">
                /
              </span>
              <Link className="breadcrumb-link" href="/design-system">
                디자인 시스템
              </Link>
              <span className="breadcrumb-separator" aria-hidden="true">
                /
              </span>
              <span className="breadcrumb-current">템플릿</span>
            </div>
          </div>
          <div className="studio-actions">
            <Link className="secondary-command" href="/design-system/components">
              컴포넌트
            </Link>
          </div>
        </header>

        <section style={introStyle}>
          <h2 style={{ font: "var(--ui-type-section-title)", marginBottom: "var(--ui-space-12)" }}>템플릿 사용 원칙</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
            템플릿은 화면의 정보 구조를 정의합니다. 페이지를 새로 만들 때는 아래 템플릿 중 하나를 기준으로 시작하고,
            필요한 경우 컴포넌트만 교체합니다.
          </p>
        </section>

        <section style={{ marginTop: "var(--ui-space-32)" }}>
          {templateSpecs.map((template) => (
            <article key={template.name} style={templateStyle}>
              <div>
                <code style={codeStyle}>{template.route}</code>
                <h2 style={{ marginTop: "var(--ui-space-8)", font: "var(--ui-type-xl)" }}>{template.name}</h2>
                <p style={{ marginTop: "var(--ui-space-12)", color: "var(--text-secondary)", lineHeight: 1.65 }}>{template.purpose}</p>
              </div>
              <div style={{ display: "grid", gap: "var(--ui-space-16)" }}>
                <TemplatePreview name={template.name} />
                <DefinitionBlock title="영역" items={template.regions} />
                <DefinitionBlock title="사용 컴포넌트" items={template.components} code />
                <DefinitionBlock title="규칙" items={template.rules} />
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function TemplatePreview({ name }: { name: string }) {
  return (
    <div style={previewFrameStyle}>
      {name === "Home Gallery" ? <HomeGalleryPreview /> : null}
      {name === "Editor Canvas" ? <EditorCanvasPreview /> : null}
      {name === "Image Detail Overlay" ? <ImageDetailPreview /> : null}
      {name === "Style Add Modal" ? <StyleModalTemplatePreview /> : null}
      {name === "Design System" ? <DesignSystemPreview /> : null}
    </div>
  );
}

function HomeGalleryPreview() {
  return (
    <div style={{ display: "grid", gap: "var(--ui-space-16)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--ui-space-12)" }}>
        <strong>xGen</strong>
        <span className="tool-pill">새 보드</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "var(--ui-space-16)", alignItems: "end" }}>
        <div>
          <p className="kicker">Visual Identity Lab</p>
          <div style={{ height: 44, marginTop: "var(--ui-space-8)", borderRadius: "var(--ui-radius-xl)", background: "linear-gradient(90deg, var(--ui-ink-primary), transparent)" }} />
          <div style={{ height: 26, width: "72%", marginTop: "var(--ui-space-10)", borderRadius: "var(--ui-radius-xl)", background: "color-mix(in srgb, var(--text-secondary) 18%, transparent)" }} />
        </div>
        <div className="metric-card" style={{ minHeight: 110 }}>
          <span className="metric-label">결과</span>
          <strong style={{ fontSize: 38 }}>8</strong>
          <small>stored renders</small>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ font: "var(--ui-type-section-title)" }}>작업 결과</h3>
        <span className="tool-pill">8 assets</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--ui-space-10)" }}>
        {[0, 1, 2].map((item) => (
          <div key={item} className="gallery-card studio-card" style={{ margin: 0 }}>
            <div className="gallery-card-media" style={{ aspectRatio: "4 / 3", background: "linear-gradient(135deg, var(--brand-warm), var(--brand-ember-soft), var(--brand-mint))" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorCanvasPreview() {
  return (
    <div style={{ position: "relative", minHeight: 300, borderRadius: "var(--ui-radius-2xl)", background: "var(--bg-canvas)", overflow: "hidden" }}>
      <div className="editor-topbar" style={{ position: "absolute", top: "var(--ui-space-12)", left: "var(--ui-space-12)", maxWidth: 320 }}>
        <button className="round-tool back-tool" type="button" aria-label="뒤로가기">←</button>
        <input className="editor-title-input" value="새 브랜드 이미지" readOnly aria-label="이미지 캔버스 제목" />
      </div>
      <div className="editor-mode-toggle" style={{ position: "absolute", top: "var(--ui-space-12)", right: "var(--ui-space-12)" }}>
        <button className="icon-toggle compact" type="button" aria-label="테마">☾</button>
      </div>
      <div style={{ position: "absolute", top: 96, left: 42 }}><MiniNode title="Prompt" port="var(--port-prompt)" /></div>
      <div style={{ position: "absolute", top: 96, left: 300 }}><MiniNode title="Output" port="var(--port-resolution)" /></div>
      <div style={{ position: "absolute", left: 220, top: 150, width: 86, height: 2, background: "var(--text-tertiary)" }} />
    </div>
  );
}

function ImageDetailPreview() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.45fr 0.75fr", gap: "var(--ui-space-12)", minHeight: 260 }}>
      <div style={{ borderRadius: "var(--ui-radius-2xl)", background: "linear-gradient(135deg, var(--brand-warm), var(--brand-mint))" }} />
      <aside style={{ display: "grid", gap: "var(--ui-space-12)" }}>
        <div style={{ borderRadius: "var(--ui-radius-xl)", background: "var(--bg-node-base)", border: "1px solid var(--border-node)", padding: "var(--ui-space-12)" }}>
          <span className="tool-pill">한글</span>
          <p style={{ marginTop: "var(--ui-space-12)", color: "var(--text-secondary)", lineHeight: 1.6 }}>프롬프트와 스타일 설명이 표시됩니다.</p>
        </div>
        <div style={{ borderRadius: "var(--ui-radius-xl)", background: "var(--bg-node-base)", border: "1px solid var(--border-node)", padding: "var(--ui-space-12)" }}>
          <strong style={{ font: "var(--ui-type-sm-8)" }}>일관성 앨리먼트</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ui-space-8)", marginTop: "var(--ui-space-12)" }}>
            <span className="tool-pill">캐릭터</span>
            <span className="tool-pill">스타일</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

function StyleModalTemplatePreview() {
  return (
    <div style={{ width: "min(100%, var(--size-modal-style-width))", margin: "0 auto", borderRadius: "var(--component-panel-radius)", background: "var(--bg-node-base)", border: "1px solid var(--border-node)", overflow: "hidden" }}>
      <div style={{ padding: "var(--ui-space-16) var(--ui-space-20)", borderBottom: "1px solid var(--border-node)", display: "flex", justifyContent: "space-between" }}>
        <strong>스타일 추가</strong>
        <span>×</span>
      </div>
      <div style={{ padding: "var(--ui-space-20)", display: "grid", gap: "var(--ui-space-16)" }}>
        <div style={{ height: "var(--size-modal-preview-height)", borderRadius: "var(--ui-radius-xl)", background: "linear-gradient(135deg, var(--brand-ember-soft), var(--brand-mint))" }} />
        <div style={{ display: "flex", gap: "var(--ui-space-8)" }}>
          <span className="tool-pill">line art</span>
          <span className="tool-pill">pastel</span>
        </div>
        <button className="primary-command" type="button">스타일 적용</button>
      </div>
    </div>
  );
}

function DesignSystemPreview() {
  return (
    <div style={{ display: "grid", gap: "var(--ui-space-20)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>xGen Design System</strong>
        <span className="tool-pill">컴포넌트</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "0.34fr 1fr", gap: "var(--ui-space-24)" }}>
        <div><p className="kicker">System</p><h3 style={{ font: "var(--ui-type-xl)", marginTop: "var(--ui-space-8)" }}>토큰</h3></div>
        <div style={{ display: "grid", gap: "var(--ui-space-8)" }}>
          {[0, 1, 2].map((item) => <div key={item} style={{ height: 42, borderRadius: "var(--ui-radius-xl)", border: "1px solid var(--border-node)", background: "var(--bg-node-base)" }} />)}
        </div>
      </div>
    </div>
  );
}

function MiniNode({ title, port }: { title: string; port: string }) {
  return (
    <div style={{ width: 180, borderRadius: "var(--component-node-radius)", background: "var(--component-node-bg)", boxShadow: "var(--component-node-shadow)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-space-8)", padding: "var(--ui-space-8) var(--ui-space-12)", background: "var(--component-node-header-bg)" }}>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: port }} />
        <strong style={{ font: "var(--component-node-title-type)", color: "var(--text-secondary)" }}>{title}</strong>
      </div>
      <div style={{ padding: "var(--ui-space-12)" }}>
        <div style={{ height: 54, borderRadius: "var(--ui-radius-xl)", background: "var(--bg-canvas)", border: "1px solid var(--border-node)" }} />
      </div>
    </div>
  );
}

function DefinitionBlock({ title, items, code = false }: { title: string; items: string[]; code?: boolean }) {
  return (
    <div>
      <h3 style={{ font: "var(--ui-type-sm-8)", marginBottom: "var(--ui-space-8)" }}>{title}</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ui-space-8)" }}>
        {items.map((item) => (
          code ? (
            <code key={item} style={codeStyle}>{item}</code>
          ) : (
            <span key={item} className="tool-pill">{item}</span>
          )
        ))}
      </div>
    </div>
  );
}
