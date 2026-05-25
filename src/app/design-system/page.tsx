import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata = {
  title: "디자인 시스템 | BrandGen",
  description: "BrandGen 인터페이스 토큰과 화면 구성 원칙.",
};

type Token = {
  name: string;
  token: string;
  value: string;
  description: string;
};

const colorTokens: Token[] = [
  { name: "잉크", token: "--color-midnight-ink", value: "#09090b", description: "가장 높은 위계의 텍스트와 단단한 액션" },
  { name: "그래파이트", token: "--color-graphite", value: "#3f3f46", description: "보조 라벨과 설명" },
  { name: "스틸", token: "--color-steel-gray", value: "#71717a", description: "메타 정보와 낮은 위계의 상태" },
  { name: "미스트", token: "--color-silver-mist", value: "#a1a1aa", description: "플레이스홀더와 비활성 힌트" },
  { name: "캔버스", token: "--color-canvas-white", value: "#f4f4f5", description: "작업 배경과 입력 표면" },
  { name: "클라우드", token: "--color-cloud-white", value: "#ffffff", description: "노드와 떠 있는 패널의 기본 표면" },
  { name: "마젠타", token: "--color-vibrant-magenta", value: "#fe45e2", description: "예약된 강한 브랜드 포인트" },
  { name: "엠버", token: "--color-ember-glow", value: "#ff5a00", description: "따뜻한 강조와 생성 흐름" },
];

const surfaceTokens: Token[] = [
  { name: "앱 배경", token: "--bg-canvas", value: "var(--bg-canvas)", description: "갤러리와 에디터의 전체 바탕" },
  { name: "노드 표면", token: "--bg-node-base", value: "var(--bg-node-base)", description: "노드, 툴바, 카드의 기본 표면" },
  { name: "노드 헤더", token: "--bg-node-header", value: "var(--bg-node-header)", description: "작은 헤더 영역과 구획" },
  { name: "기본 보더", token: "--border-node", value: "var(--border-node)", description: "구분선, 입력창, 툴바 외곽" },
  { name: "주요 텍스트", token: "--text-primary", value: "var(--text-primary)", description: "제목과 활성 컨트롤" },
  { name: "보조 텍스트", token: "--text-secondary", value: "var(--text-secondary)", description: "설명, 라벨, 보조 정보" },
];

const portTokens: Token[] = [
  { name: "설명", token: "--port-prompt", value: "var(--port-prompt)", description: "기본 프롬프트 입력" },
  { name: "스타일", token: "--port-style", value: "var(--port-style)", description: "스타일 참조와 따뜻한 액션" },
  { name: "캐릭터", token: "--port-character-reference", value: "var(--port-character-reference)", description: "캐릭터 일관성" },
  { name: "오브젝트", token: "--port-object-reference", value: "var(--port-object-reference)", description: "제품과 소품 일관성" },
  { name: "앨리먼트", token: "--port-element-board", value: "var(--port-element-board)", description: "추출된 반복 요소" },
  { name: "출력 설정", token: "--port-resolution", value: "var(--port-resolution)", description: "비율과 해상도" },
  { name: "구도", token: "--port-composition", value: "var(--port-composition)", description: "프레이밍과 배치" },
  { name: "배경", token: "--port-background", value: "var(--port-background)", description: "환경과 배경 밀도" },
  { name: "제한", token: "--port-constraint", value: "var(--port-constraint)", description: "금지 조건과 실패 상태" },
  { name: "무드", token: "--port-mood", value: "var(--port-mood)", description: "감정 톤" },
  { name: "팔레트", token: "--port-palette", value: "var(--port-palette)", description: "색상 방향" },
  { name: "카메라", token: "--port-camera-angle", value: "var(--port-camera-angle)", description: "보는 시점" },
  { name: "방향", token: "--port-object-angle", value: "var(--port-object-angle)", description: "피사체 회전" },
  { name: "조명", token: "--port-lighting", value: "var(--port-lighting)", description: "빛의 방향과 질감" },
  { name: "제스처", token: "--port-gesture", value: "var(--port-gesture)", description: "표정과 동작" },
  { name: "소품", token: "--port-props", value: "var(--port-props)", description: "보조 오브젝트" },
  { name: "밀도", token: "--port-detail", value: "var(--port-detail)", description: "결과물의 디테일 수준" },
];

const spacingScale = [
  ["4", "--space-4", "작은 아이콘 간격"],
  ["8", "--space-8", "버튼 내부 요소 간격"],
  ["12", "--space-12", "촘촘한 폼 그룹"],
  ["16", "--space-16", "노드 내부 기본 패딩"],
  ["24", "--space-24", "카드와 패널 내부 여백"],
  ["32", "--space-32", "관련 그룹 사이 간격"],
  ["48", "--space-48", "섹션 안의 큰 호흡"],
  ["64", "--space-64", "서로 다른 주제 사이 간격"],
];

const radiusScale = [
  ["6", "--radius-sm", "작은 입력과 칩"],
  ["12", "--radius-md", "노드와 콤팩트 컨트롤"],
  ["16", "--radius-lg", "팝오버와 중간 패널"],
  ["24", "--radius-2xl", "갤러리 카드"],
  ["28", "--radius-3xl", "큰 정보 패널"],
  ["9999", "--radius-pill", "상태 칩과 포트"],
];

const shellStyle: CSSProperties = {
  minHeight: "100vh",
  color: "var(--text-primary)",
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--bg-canvas) 88%, #f2eadf 12%), var(--bg-canvas) 58%, color-mix(in srgb, var(--bg-canvas) 82%, #dce8e2 18%))",
};

const pageStyle: CSSProperties = {
  width: "min(1320px, calc(100vw - 56px))",
  margin: "0 auto",
  padding: "24px 0 96px",
};

const sectionStyle: CSSProperties = {
  padding: "clamp(56px, 8vw, 112px) 0",
  borderTop: "1px solid color-mix(in srgb, var(--border-node) 72%, transparent)",
};

const eyebrowStyle: CSSProperties = {
  color: "color-mix(in srgb, var(--port-style) 70%, var(--text-primary))",
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const leadStyle: CSSProperties = {
  maxWidth: 720,
  color: "var(--text-secondary)",
  fontSize: "clamp(16px, 1.55vw, 20px)",
  lineHeight: 1.75,
  wordBreak: "keep-all",
};

const subtleTextStyle: CSSProperties = {
  color: "var(--text-secondary)",
  lineHeight: 1.65,
  wordBreak: "keep-all",
};

export default function DesignSystemPage() {
  return (
    <main style={shellStyle}>
      <div className="studio-noise" aria-hidden="true" />
      <div style={pageStyle}>
        <header className="studio-topbar" aria-label="BrandGen 디자인 시스템">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 44 44" focusable="false">
                <rect x="5" y="5" width="34" height="34" rx="7.5" fill="currentColor" />
                <path d="M16.2 16.2 27.8 27.8M27.8 16.2 16.2 27.8" />
              </svg>
            </div>
            <div className="brand-breadcrumb" aria-label="현재 위치">
              <Link className="brand-name" href="/">
                BrandGen
              </Link>
              <span className="breadcrumb-separator" aria-hidden="true">
                /
              </span>
              <span className="breadcrumb-current">디자인 시스템</span>
            </div>
          </div>
          <div className="studio-actions">
            <Link className="secondary-command" href="/design-system/components">
              컴포넌트
            </Link>
            <Link className="secondary-command" href="/design-system/templates">
              템플릿
            </Link>
          </div>
        </header>

        <section style={{ padding: "clamp(64px, 10vw, 144px) 0 clamp(56px, 8vw, 104px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.12fr) minmax(280px, 0.58fr)", gap: "clamp(28px, 6vw, 92px)", alignItems: "end" }}>
            <div>
              <p style={eyebrowStyle}>Interface system</p>
              <h1 style={{ maxWidth: 820, marginTop: 14, fontSize: "clamp(38px, 5.8vw, 82px)", lineHeight: 1.04, letterSpacing: 0 }}>
                생성 흐름을 흔들리지 않게 만드는 화면 규칙.
              </h1>
            </div>
            <p style={leadStyle}>
              BrandGen의 디자인 시스템은 장식용 문서가 아니라, 갤러리와 노드 에디터를 같은 언어로 유지하기 위한 기준입니다.
              프레임은 필요한 곳에만 쓰고, 대부분의 정보는 간격과 정렬로 묶습니다.
            </p>
          </div>
        </section>

        <Section
          title="색상"
          description="기본 색은 조용하게 두고, 노드 타입과 생성 흐름을 포트 컬러로 구분합니다."
        >
          <ColorStory />
          <TokenRows title="기본 색" items={colorTokens} />
          <TokenRows title="표면과 텍스트" items={surfaceTokens} />
        </Section>

        <Section
          title="타이포그래피"
          description="큰 제목은 짧고 강하게, 설명은 한국어 문장 리듬이 끊기지 않게 넓은 행간을 둡니다."
        >
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(320px, 1.1fr)", gap: "clamp(28px, 5vw, 72px)", alignItems: "start" }}>
            <div>
              <p style={eyebrowStyle}>Type rhythm</p>
              <h3 style={{ marginTop: 12, fontSize: "clamp(30px, 5vw, 64px)", lineHeight: 0.95, letterSpacing: 0 }}>
                큰 글자는 적게 쓰고, 작은 글자는 단단하게 쓴다.
              </h3>
            </div>
            <div style={{ display: "grid", gap: 18 }}>
              <TypeLine label="히어로" value="38-82px 반응형 / 행간 1.04" sample="작업의 성격을 한 문장으로 고정" />
              <TypeLine label="섹션" value="20px fixed / semantic token" sample="색상, 타이포그래피, 노드 규칙" />
              <TypeLine label="본문" value="16-20px / line-height 1.65-1.75" sample="한국어 설명은 줄이 길어져도 읽히도록 둔다." />
              <TypeLine label="컨트롤" value="10-13px / 800-950" sample="짧은 라벨, 칩, 툴바에 사용" />
            </div>
          </div>
        </Section>

        <Section
          title="간격과 형태"
          description="같은 여백을 반복하지 않습니다. 관련 항목은 촘촘하게, 주제가 바뀌는 지점은 크게 띄웁니다."
        >
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.72fr)", gap: "clamp(32px, 6vw, 88px)", alignItems: "start" }}>
            <ScaleRail title="간격 스케일" items={spacingScale} />
            <RadiusRail items={radiusScale} />
          </div>
        </Section>

        <Section
          title="액션과 컨트롤"
          description="주요 액션은 하나만 강하게 보이고, 나머지는 조용한 도구처럼 배치합니다."
        >
          <ActionSpec />
        </Section>

        <Section
          title="컴포넌트와 템플릿"
          description="실제 사이트에서 쓰는 컴포넌트와 화면 템플릿은 별도 페이지에서 관리합니다."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--ui-space-20)" }}>
            <Link href="/design-system/components" style={linkCardStyle}>
              <span style={eyebrowStyle}>Components</span>
              <strong style={{ display: "block", marginTop: "var(--ui-space-8)", font: "var(--ui-type-xl)" }}>컴포넌트 정의</strong>
              <span style={{ ...subtleTextStyle, display: "block", marginTop: "var(--ui-space-12)" }}>
                버튼, 카드, 노드, 포트, 모달 같은 실제 구현 단위를 정의합니다.
              </span>
            </Link>
            <Link href="/design-system/templates" style={linkCardStyle}>
              <span style={eyebrowStyle}>Templates</span>
              <strong style={{ display: "block", marginTop: "var(--ui-space-8)", font: "var(--ui-type-xl)" }}>템플릿 정의</strong>
              <span style={{ ...subtleTextStyle, display: "block", marginTop: "var(--ui-space-12)" }}>
                홈, 에디터, 상세 오버레이, 스타일 모달의 화면 구조를 정의합니다.
              </span>
            </Link>
          </div>
        </Section>

        <Section
          title="갤러리와 에디터"
          description="이미지를 보는 화면과 노드를 조작하는 화면은 밀도가 다릅니다. 갤러리는 결과 중심, 에디터는 반복 조작 중심입니다."
        >
          <Patterns />
        </Section>

        <Section
          title="노드 포트"
          description="선 색, 포트 점, 추가 메뉴, 연결 배지는 같은 토큰을 공유해야 합니다."
        >
          <PortMap />
        </Section>
      </div>
    </main>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section style={sectionStyle}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 0.32fr) minmax(0, 1fr)", gap: "clamp(24px, 5vw, 72px)" }}>
        <div>
          <p style={eyebrowStyle}>System</p>
          <h2 style={{ marginTop: 10, font: "var(--ui-type-section-title)", lineHeight: "var(--ui-type-section-title-line)", letterSpacing: 0 }}>{title}</h2>
          <p style={{ ...subtleTextStyle, marginTop: 16 }}>{description}</p>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function ColorStory() {
  return (
    <div style={{ marginBottom: 34 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 0.7fr 0.7fr", minHeight: 132, borderRadius: 26, overflow: "hidden", boxShadow: "var(--ui-shadow-node)" }}>
        <div style={{ background: "var(--ui-ink-primary)" }} />
        <div style={{ background: "var(--port-style)" }} />
        <div style={{ background: "var(--port-element-board)" }} />
        <div style={{ background: "var(--bg-node-base)" }} />
      </div>
      <p style={{ ...subtleTextStyle, marginTop: 14 }}>
        전체 화면은 무채색 표면을 중심으로 하고, 생성과 연결의 의미가 있는 지점에만 컬러를 씁니다.
      </p>
    </div>
  );
}

function TokenRows({ title, items }: { title: string; items: Token[] }) {
  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={{ fontSize: 18, marginBottom: 8 }}>{title}</h3>
      <div>
        {items.map((item) => (
          <div key={item.token} style={{ display: "grid", gridTemplateColumns: "42px minmax(130px, 0.42fr) minmax(160px, 0.42fr) minmax(0, 1fr)", gap: 14, alignItems: "center", padding: "14px 0", borderTop: "1px solid color-mix(in srgb, var(--border-node) 64%, transparent)" }}>
            <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: 12, background: item.value, border: "1px solid var(--border-node)" }} />
            <strong style={{ fontSize: 14 }}>{item.name}</strong>
            <code style={codeStyle}>{item.token}</code>
            <span style={{ ...subtleTextStyle, fontSize: 13 }}>{item.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeLine({ label, value, sample }: { label: string; value: string; sample: string }) {
  return (
    <div style={{ padding: "0 0 18px", borderBottom: "1px solid color-mix(in srgb, var(--border-node) 64%, transparent)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
        <strong>{label}</strong>
        <code style={codeStyle}>{value}</code>
      </div>
      <p style={{ marginTop: 8, color: "var(--text-primary)", fontSize: label === "히어로" ? 30 : label === "섹션" ? 24 : 16, lineHeight: 1.25, fontWeight: label === "본문" ? 600 : 900 }}>
        {sample}
      </p>
    </div>
  );
}

function ScaleRail({ title, items }: { title: string; items: string[][] }) {
  return (
    <div>
      <h3 style={{ fontSize: 18, marginBottom: 18 }}>{title}</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {items.map(([size, token, note]) => (
          <div key={token} style={{ display: "grid", gridTemplateColumns: "70px minmax(0, 1fr) 160px", gap: 14, alignItems: "center" }}>
            <code style={codeStyle}>{token}</code>
            <span style={{ width: `min(100%, ${Number(size) * 5}px)`, height: 12, borderRadius: 999, background: "linear-gradient(90deg, var(--port-style), #f7d56f)" }} />
            <span style={{ ...subtleTextStyle, fontSize: 13 }}>{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadiusRail({ items }: { items: string[][] }) {
  return (
    <div style={{ padding: 22, borderRadius: 26, border: "1px solid var(--border-node)", background: "color-mix(in srgb, var(--bg-node-base) 78%, transparent)" }}>
      <h3 style={{ fontSize: 18, marginBottom: 18 }}>형태 스케일</h3>
      <div style={{ display: "grid", gap: 14 }}>
        {items.map(([size, token, note]) => (
          <div key={token} style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 14, alignItems: "center" }}>
            <span aria-hidden="true" style={{ width: 48, height: 32, borderRadius: size === "9999" ? 999 : Number(size), border: "1px solid var(--border-node)", background: "var(--bg-canvas)" }} />
            <span>
              <code style={codeStyle}>{token}</code>
              <small style={{ display: "block", marginTop: 3, color: "var(--text-secondary)" }}>{note}</small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionSpec() {
  return (
    <div style={{ display: "grid", gap: 34 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <button className="primary-command" type="button">이미지 생성</button>
        <Link href="/" className="secondary-command">보조 이동</Link>
        <button className="icon-toggle" type="button" aria-label="테마 변경">☾</button>
        <span className="tool-pill">상태 칩</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 24 }}>
        <Rule title="강한 버튼은 하나만" text="한 화면에서 사용자의 다음 행동이 명확할 때만 그라디언트 버튼을 씁니다." />
        <Rule title="도구는 조용하게" text="확대, 보기 모드, 이동 같은 반복 조작은 보더와 배경을 낮춰 둡니다." />
        <Rule title="라벨은 짧게" text="버튼 안에서 설명하지 않고, 주변 맥락으로 이해되게 배치합니다." />
      </div>
    </div>
  );
}

function Patterns() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 0.85fr) minmax(0, 1.15fr)", gap: "clamp(28px, 5vw, 72px)", alignItems: "start" }}>
      <div className="gallery-card studio-card" style={{ margin: 0, cursor: "default" }}>
        <div className="gallery-card-media" style={{ aspectRatio: "4 / 3", background: "linear-gradient(135deg, #f7d56f, #f19b57 48%, #9ad2bf)" }}>
          <div className="asset-status"><span />locked</div>
        </div>
        <div className="asset-data-strip">
          <span>비율</span>
          <span>해상도</span>
          <span>앨리먼트</span>
        </div>
      </div>
      <div style={{ display: "grid", gap: 22 }}>
        <Rule title="갤러리" text="이미지가 먼저 보이고, 정보는 hover와 하단 칩에서 보조합니다. 카드가 필요한 대표적인 영역입니다." />
        <Rule title="에디터 상단" text="상단 컨트롤은 프레임 안에 묶되 크기를 작게 유지합니다. 제목은 작업명을 빠르게 식별하는 용도입니다." />
        <Rule title="노드" text="노드는 실제 조작 단위이므로 프레임이 필요합니다. 반대로 설명 문서의 모든 항목을 노드처럼 감싸지는 않습니다." />
      </div>
    </div>
  );
}

function PortMap() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0 22px" }}>
      {portTokens.map((item) => (
        <div key={item.token} style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 10, padding: "12px 0", borderTop: "1px solid color-mix(in srgb, var(--border-node) 58%, transparent)" }}>
          <span aria-hidden="true" style={{ width: 12, height: 12, marginTop: 5, borderRadius: 999, background: item.value, border: "2px solid var(--bg-node-base)" }} />
          <span>
            <strong style={{ display: "block", fontSize: 14 }}>{item.name}</strong>
            <code style={codeStyle}>{item.token}</code>
            <small style={{ display: "block", marginTop: 5, color: "var(--text-secondary)", lineHeight: 1.45 }}>{item.description}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

function Rule({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 style={{ fontSize: 17, lineHeight: 1.2 }}>{title}</h3>
      <p style={{ ...subtleTextStyle, marginTop: 8, fontSize: 14 }}>{text}</p>
    </div>
  );
}

const codeStyle: CSSProperties = {
  display: "inline-block",
  color: "var(--text-tertiary)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: 12,
  lineHeight: 1.4,
};

const linkCardStyle: CSSProperties = {
  display: "block",
  padding: "var(--ui-space-20)",
  border: "1px solid var(--border-node)",
  borderRadius: "var(--component-panel-radius)",
  background: "var(--component-panel-bg)",
  color: "var(--text-primary)",
  textDecoration: "none",
  boxShadow: "var(--component-panel-shadow)",
};
