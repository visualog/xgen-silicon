import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowLeft,
  Blocks,
  Braces,
  CircleDot,
  FileCode2,
  Image as ImageIcon,
  Info,
  Network,
  Play,
  ServerCog,
} from "lucide-react";

export const metadata = {
  title: "프로젝트 구조와 사용법 | xGen",
  description: "xGen의 Codex CLI 백엔드 구조와 주요 사용 흐름.",
};

const shellStyle: CSSProperties = {
  minHeight: "100vh",
  color: "var(--text-primary)",
  background:
    "radial-gradient(circle at 18% 8%, color-mix(in srgb, var(--port-prompt) 15%, transparent), transparent 32rem), radial-gradient(circle at 82% 14%, color-mix(in srgb, var(--port-element-board) 14%, transparent), transparent 30rem), linear-gradient(135deg, color-mix(in srgb, var(--bg-canvas) 86%, var(--brand-tan) 14%), var(--bg-canvas) 58%, color-mix(in srgb, var(--bg-canvas) 84%, var(--brand-mint) 16%))",
};

const pageStyle: CSSProperties = {
  width: "min(1180px, calc(100vw - 48px))",
  margin: "0 auto",
  padding: "24px 0 96px",
};

const heroStyle: CSSProperties = {
  padding: "clamp(56px, 9vw, 128px) 0 clamp(36px, 7vw, 76px)",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.05fr) minmax(300px, 0.72fr)",
  gap: "clamp(28px, 6vw, 88px)",
  alignItems: "end",
};

const eyebrowStyle: CSSProperties = {
  color: "color-mix(in srgb, var(--port-style) 74%, var(--text-primary))",
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const leadStyle: CSSProperties = {
  maxWidth: 720,
  color: "var(--text-secondary)",
  fontSize: "clamp(16px, 1.45vw, 19px)",
  lineHeight: 1.72,
  wordBreak: "keep-all",
};

const sectionStyle: CSSProperties = {
  padding: "clamp(42px, 7vw, 84px) 0",
  borderTop: "1px solid color-mix(in srgb, var(--border-node) 72%, transparent)",
};

const panelStyle: CSSProperties = {
  border: "1px solid var(--border-node)",
  borderRadius: "var(--ui-radius-3xl)",
  background: "color-mix(in srgb, var(--bg-node-base) 76%, transparent)",
  padding: "clamp(20px, 3vw, 32px)",
};

const cardStyle: CSSProperties = {
  border: "1px solid var(--border-node)",
  borderRadius: "var(--ui-radius-2xl)",
  background: "color-mix(in srgb, var(--bg-node-base) 72%, transparent)",
  padding: "var(--ui-space-20)",
};

const codeStyle: CSSProperties = {
  display: "block",
  marginTop: "var(--ui-space-12)",
  padding: "var(--ui-space-16)",
  borderRadius: "var(--ui-radius-xl)",
  border: "1px solid var(--border-node)",
  background: "color-mix(in srgb, var(--ui-ink-strong) 82%, var(--bg-node-base))",
  color: "var(--ui-surface-white)",
  fontSize: 13,
  lineHeight: 1.75,
  overflowX: "auto",
  whiteSpace: "pre",
};

const files = [
  ["src/app/page.tsx", "홈 갤러리와 React Flow 에디터의 핵심 화면 상태를 관리합니다."],
  ["src/components/nodes/*", "프롬프트, 스타일, 참조 이미지, 출력 설정, 캔버스 같은 노드 UI를 분리합니다."],
  ["src/app/api/*/route.ts", "프론트 요청을 받아 Codex worker로 전달하는 Next.js Route Handler입니다."],
  ["src/lib/codex-worker-client.ts", "Next.js 서버에서 로컬 Codex worker HTTP 서버로 요청을 보내는 클라이언트입니다."],
  ["scripts/codex-worker.mjs", "실제 `codex exec`를 실행하고 JSONL, thread_id, 생성 파일을 해석하는 백엔드 작업자입니다."],
  ["src/lib/gallery-store.ts", "생성 결과 갤러리 저장과 복원 로직을 담당합니다."],
  ["design-md/*", "디자인 토큰과 테마 CSS를 생성하는 원본 디자인 시스템 자료입니다."],
  ["electron/*", "데스크톱 앱 실행과 패키징을 위한 Electron 진입점입니다."],
];

const steps = [
  "홈 갤러리에서 새 이미지를 만들거나 기존 결과를 열어 에디터로 들어갑니다.",
  "프롬프트, 스타일, 캐릭터 참조, 오브젝트 참조, 비율, 해상도 같은 노드 값을 조정합니다.",
  "필요한 설정 노드를 추가해 구도, 배경, 제약, 무드, 팔레트, 조명, 제스처, 소품, 밀도를 세분화합니다.",
  "영문 프롬프트 미리보기를 확인한 뒤 생성하면 worker가 Codex CLI에 작업을 맡깁니다.",
  "Codex가 만든 이미지는 `~/.codex/generated_images/<thread_id>/`에서 찾아 데이터 URL로 변환되고 갤러리에 저장됩니다.",
];

const apiFlows = [
  ["translate", "한국어 입력과 노드 설정을 생성용 영문 프롬프트로 정리합니다."],
  ["analyze-style", "업로드한 이미지의 스타일, 캐릭터, 오브젝트 특징을 재사용 가능한 문장으로 분석합니다."],
  ["analyze-consistency", "생성된 결과에서 반복 유지해야 할 캐릭터, 오브젝트, 스타일, 규칙을 추출합니다."],
  ["generate-title", "프롬프트와 결과 맥락을 바탕으로 갤러리 카드 제목을 만듭니다."],
  ["generate", "최종 이미지 생성 요청을 worker에 보내고 결과 이미지, thread_id, 프롬프트를 반환합니다."],
  ["generate-element-sheet", "선택한 앨리먼트를 별도 시트 이미지로 생성해 일관성 참조에 활용합니다."],
];

export default function GuidePage() {
  return (
    <main style={shellStyle}>
      <div className="studio-noise" aria-hidden="true" />
      <div style={pageStyle}>
        <header className="studio-topbar" aria-label="xGen 프로젝트 가이드">
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 44 44" focusable="false">
                <rect x="5" y="5" width="34" height="34" rx="7.5" fill="currentColor" />
                <path d="M16.2 16.2 27.8 27.8M27.8 16.2 16.2 27.8" />
              </svg>
            </div>
            <div className="brand-breadcrumb" aria-label="현재 위치">
              <Link className="breadcrumb-link" href="/">
                xGen
              </Link>
              <span className="breadcrumb-separator" aria-hidden="true">
                /
              </span>
              <span className="breadcrumb-current">가이드</span>
            </div>
          </div>
          <div className="studio-actions">
            <Link className="secondary-command studio-action-plain" href="/">
              <ArrowLeft size={16} />
              홈
            </Link>
          </div>
        </header>

        <section style={heroStyle}>
          <div>
            <p style={eyebrowStyle}>Codex CLI backend</p>
            <h1 style={{ maxWidth: 760, marginTop: 14, fontSize: "clamp(38px, 5.7vw, 76px)", lineHeight: 1.04, letterSpacing: 0 }}>
              xGen은 Codex를 작업자로 쓰는 이미지 생성 스튜디오입니다.
            </h1>
          </div>
          <div style={panelStyle}>
            <div className="system-pulse" style={{ marginBottom: 18 }}>
              <span aria-hidden="true" />
              로컬 worker + codex exec
            </div>
            <p style={leadStyle}>
              사용자는 API 키를 화면에 등록하지 않습니다. Next.js 앱이 로컬 Codex worker에 요청하고, worker가 `codex exec --json`을 실행해
              프롬프트 정리, 이미지 생성, 분석 결과를 앱이 소비할 수 있는 응답으로 바꿉니다.
            </p>
          </div>
        </section>

        <Section title="전체 구조" description="화면, API 라우트, Codex worker가 역할을 나눠 동작합니다.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--ui-space-12)" }}>
            <FlowCard icon={<Blocks size={18} />} title="Client UI" body="홈 갤러리와 노드 에디터에서 입력값, 참조 이미지, 생성 결과를 관리합니다." />
            <FlowCard icon={<Network size={18} />} title="API Routes" body="브라우저 요청을 받아 worker가 이해하는 payload로 전달합니다." />
            <FlowCard icon={<ServerCog size={18} />} title="Codex Worker" body="요청을 큐에 넣고 `codex exec`를 비대화형 백엔드처럼 실행합니다." />
            <FlowCard icon={<ImageIcon size={18} />} title="Generated Files" body="thread_id 기준 생성 이미지를 찾아 갤러리에서 볼 수 있는 data URL로 변환합니다." />
          </div>
        </Section>

        <Section title="주요 파일" description="수정할 위치를 빠르게 찾기 위한 기준입니다.">
          <div style={{ display: "grid", gap: "var(--ui-space-10)" }}>
            {files.map(([path, description]) => (
              <div key={path} style={{ ...cardStyle, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--ui-space-20)", alignItems: "start" }}>
                <code style={{ color: "var(--text-primary)", fontWeight: 900 }}>{path}</code>
                <span style={{ color: "var(--text-secondary)", lineHeight: 1.65, wordBreak: "keep-all" }}>{description}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="사용 흐름" description="사용자는 복잡한 백엔드를 의식하지 않고 노드 기반으로 생성 조건을 조립합니다.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(24px, 5vw, 64px)" }}>
            <ol style={{ display: "grid", gap: "var(--ui-space-12)", margin: 0, padding: 0, listStyle: "none" }}>
              {steps.map((step, index) => (
                <li key={step} style={{ ...cardStyle, display: "grid", gridTemplateColumns: "34px minmax(0, 1fr)", gap: "var(--ui-space-14)", alignItems: "start" }}>
                  <span className="tool-pill" style={{ width: 34, height: 34, padding: 0 }}>{index + 1}</span>
                  <span style={{ color: "var(--text-secondary)", lineHeight: 1.68, wordBreak: "keep-all" }}>{step}</span>
                </li>
              ))}
            </ol>
            <div style={panelStyle}>
              <Play size={20} />
              <h3 style={{ marginTop: 16, fontSize: 24, lineHeight: 1.15 }}>로컬 실행</h3>
              <p style={{ ...leadStyle, fontSize: 15, marginTop: 12 }}>
                Next.js 개발 서버와 Codex worker를 함께 실행해야 이미지 생성 API가 정상 동작합니다.
              </p>
              <code style={codeStyle}>npm install{"\n"}npm run dev{"\n"}npm run codex-worker</code>
            </div>
          </div>
        </Section>

        <Section title="API와 worker" description="Next.js 라우트는 얇게 유지하고, 긴 작업은 worker 프로세스가 처리합니다.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--ui-space-12)" }}>
            {apiFlows.map(([name, description]) => (
              <div key={name} style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-space-10)" }}>
                  <Braces size={17} />
                  <code style={{ fontWeight: 900 }}>/api/{name}</code>
                </div>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, marginTop: 12, wordBreak: "keep-all" }}>{description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="운영 포인트" description="Codex CLI를 백엔드로 쓸 때 꼭 유지해야 하는 기준입니다.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--ui-space-12)" }}>
            <Principle icon={<CircleDot size={18} />} title="API 키 노출 없음" body="사용자가 서비스 화면에 AI API 키를 넣지 않습니다. 실행 권한과 인증은 로컬 Codex 환경에 모읍니다." />
            <Principle icon={<FileCode2 size={18} />} title="JSONL 파싱" body="worker는 stdout의 Codex JSONL 이벤트에서 최종 메시지와 thread_id를 좁게 추출합니다." />
            <Principle icon={<Info size={18} />} title="세션 추적" body="이미지 생성 결과는 thread_id와 `~/.codex/generated_images` 디렉터리 조회를 함께 써서 찾습니다." />
          </div>
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section style={sectionStyle}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "clamp(24px, 5vw, 72px)", alignItems: "start" }}>
        <div>
          <p style={eyebrowStyle}>Guide</p>
          <h2 style={{ marginTop: 10, fontSize: "clamp(24px, 3vw, 38px)", lineHeight: 1.1 }}>{title}</h2>
          <p style={{ ...leadStyle, fontSize: 15, marginTop: 14 }}>{description}</p>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function FlowCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <article style={cardStyle}>
      <div className="tool-pill" style={{ width: 38, height: 38, padding: 0 }}>
        {icon}
      </div>
      <h3 style={{ marginTop: 18, fontSize: 18, lineHeight: 1.2 }}>{title}</h3>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.62, marginTop: 10, wordBreak: "keep-all" }}>{body}</p>
    </article>
  );
}

function Principle({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <article style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-space-10)" }}>
        {icon}
        <h3 style={{ fontSize: 17, lineHeight: 1.2 }}>{title}</h3>
      </div>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.62, marginTop: 12, wordBreak: "keep-all" }}>{body}</p>
    </article>
  );
}
