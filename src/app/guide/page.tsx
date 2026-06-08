import Link from "next/link";
import type { ReactNode } from "react";
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

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui";

export const metadata = {
  title: "프로젝트 구조와 사용법 | xGen",
  description: "xGen의 Codex CLI 백엔드 구조와 주요 사용 흐름.",
};

const files = [
  ["src/app/page.tsx", "홈 갤러리와 React Flow 에디터의 핵심 화면 상태를 관리합니다."],
  ["src/components/nodes/*", "프롬프트, 스타일, 참조 이미지, 출력 설정, 캔버스 같은 노드 UI를 분리합니다."],
  ["src/app/api/*/route.ts", "프론트 요청을 받아 Codex worker로 전달하는 Next.js Route Handler입니다."],
  ["src/lib/codex-worker-client.ts", "Next.js 서버에서 로컬 Codex worker HTTP 서버로 요청을 보내는 클라이언트입니다."],
  ["scripts/codex-worker.mjs", "실제 `codex exec`를 실행하고 JSONL, thread_id, 생성 파일을 해석하는 백엔드 작업자입니다."],
  ["src/lib/gallery-store.ts", "생성 결과 갤러리 저장과 복원 로직을 담당합니다."],
  ["design-md/*", "이전 디자인 토큰 자료입니다. 현재 런타임 스타일의 기준은 shadcn foundation입니다."],
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
    <main className="min-h-screen bg-background text-foreground">
      <div className="shadcn-guide-rail flex flex-col gap-16 py-6">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <Link className="inline-flex items-center gap-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" href="/">
            <span className="flex size-9 items-center justify-center rounded-md border border-border bg-card text-card-foreground">
              xG
            </span>
            <span>xGen / 가이드</span>
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="size-4" />
              홈으로
            </Link>
          </Button>
        </header>

        <section className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:py-20">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit">
              Codex CLI backend
            </Badge>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              xGen은 Codex를 작업자로 쓰는 이미지 생성 스튜디오입니다.
            </h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ServerCog className="size-4" />
                로컬 worker + codex exec
              </CardTitle>
              <CardDescription className="text-pretty leading-7">
                사용자는 API 키를 화면에 등록하지 않습니다. Next.js 앱이 로컬 Codex worker에 요청하고, worker가 `codex exec --json`을 실행해
                프롬프트 정리, 이미지 생성, 분석 결과를 앱이 소비할 수 있는 응답으로 바꿉니다.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <GuideSection title="전체 구조" description="화면, API 라우트, Codex worker가 역할을 나눠 동작합니다.">
          <div className="grid gap-4 sm:grid-cols-2">
            <FlowCard icon={<Blocks className="size-4" />} title="Client UI" body="홈 갤러리와 노드 에디터에서 입력값, 참조 이미지, 생성 결과를 관리합니다." />
            <FlowCard icon={<Network className="size-4" />} title="API Routes" body="브라우저 요청을 받아 worker가 이해하는 payload로 전달합니다." />
            <FlowCard icon={<ServerCog className="size-4" />} title="Codex Worker" body="요청을 큐에 넣고 `codex exec`를 비대화형 백엔드처럼 실행합니다." />
            <FlowCard icon={<ImageIcon className="size-4" />} title="Generated Files" body="thread_id 기준 생성 이미지를 찾아 갤러리에서 볼 수 있는 data URL로 변환합니다." />
          </div>
        </GuideSection>

        <GuideSection title="주요 파일" description="수정할 위치를 빠르게 찾기 위한 기준입니다.">
          <div className="grid gap-3">
            {files.map(([path, description]) => (
              <Card key={path}>
                <CardContent className="grid gap-4 p-5 sm:grid-cols-[minmax(220px,0.42fr)_1fr] sm:items-start">
                  <code className="rounded-md bg-muted px-2 py-1 font-mono text-sm font-medium text-foreground">{path}</code>
                  <p className="text-sm leading-6 text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </GuideSection>

        <GuideSection title="사용 흐름" description="사용자는 복잡한 백엔드를 의식하지 않고 노드 기반으로 생성 조건을 조립합니다.">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <ol className="grid gap-3">
              {steps.map((step, index) => (
                <li key={step}>
                  <Card>
                    <CardContent className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4 p-5">
                      <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-6 text-muted-foreground">{step}</p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="size-4" />
                  로컬 실행
                </CardTitle>
                <CardDescription className="leading-6">Next.js 개발 서버와 Codex worker를 함께 실행해야 이미지 생성 API가 정상 동작합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-foreground p-4 text-sm leading-7 text-background">
                  <code>{"npm install\nnpm run dev\nnpm run codex-worker"}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </GuideSection>

        <GuideSection title="API와 worker" description="Next.js 라우트는 얇게 유지하고, 긴 작업은 worker 프로세스가 처리합니다.">
          <div className="grid gap-4 sm:grid-cols-2">
            {apiFlows.map(([name, description]) => (
              <Card key={name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Braces className="size-4" />
                    <code>/api/{name}</code>
                  </CardTitle>
                  <CardDescription className="leading-6">{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </GuideSection>

        <GuideSection title="운영 포인트" description="Codex CLI를 백엔드로 쓸 때 꼭 유지해야 하는 기준입니다.">
          <div className="grid gap-4 sm:grid-cols-3">
            <Principle icon={<CircleDot className="size-4" />} title="API 키 노출 없음" body="사용자가 서비스 화면에 AI API 키를 넣지 않습니다. 실행 권한과 인증은 로컬 Codex 환경에 모읍니다." />
            <Principle icon={<FileCode2 className="size-4" />} title="JSONL 파싱" body="worker는 stdout의 Codex JSONL 이벤트에서 최종 메시지와 thread_id를 좁게 추출합니다." />
            <Principle icon={<Info className="size-4" />} title="세션 추적" body="이미지 생성 결과는 thread_id와 `~/.codex/generated_images` 디렉터리 조회를 함께 써서 찾습니다." />
          </div>
        </GuideSection>
      </div>
    </main>
  );
}

function GuideSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-8 border-t border-border py-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
      <div className="space-y-3">
        <Badge variant="outline">Guide</Badge>
        <h2 className="text-3xl font-semibold tracking-tight text-balance">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

function FlowCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex size-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">{icon}</div>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="leading-6">{body}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function Principle({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
        <Separator />
        <CardDescription className="leading-6">{body}</CardDescription>
      </CardHeader>
    </Card>
  );
}
