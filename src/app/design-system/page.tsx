import { BoundaryGrid, LinkCardGrid, PageHero, SectionIntro } from "./_components/page-sections";
import { overviewCards, runtimeBoundary } from "./_data/design-system";

export const metadata = {
  title: "디자인 시스템 | xGen",
  description: "shadcn/ui 기반 xGen 인터페이스 기준.",
};

export default function DesignSystemPage() {
  return (
    <div className="grid gap-16">
      <PageHero
        label={{ ko: "shadcn/ui 파운데이션", en: "shadcn/ui foundation" }}
        title={{ ko: "xGen을 위한 별도 디자인 시스템 사이트.", en: "A separate design system site for xGen." }}
        description={{
          ko: "이 공간은 xGen 제품 UI의 활성 기준을 문서화합니다: shadcn 테마 변수, 로컬 registry 프리미티브, 생성 워크플로를 위한 화면 계약.",
          en: "This space documents the active foundation for xGen product UI: shadcn theme variables, local registry primitives, and screen contracts for generation workflows.",
        }}
        action={{ href: "/design-system/components", label: { ko: "컴포넌트 보기", en: "Browse components" } }}
      />

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "정보 구조", en: "Information architecture" }}
          title={{ ko: "작업에서 시작한 뒤 페이지를 선택합니다.", en: "Start from the job, then choose the page." }}
          description={{
            ko: "Foundation은 규칙을 설명합니다. Components는 프리미티브를 문서화합니다. Templates는 완성 화면 계약을 설명합니다. 워크플로별 예시는 Patterns에 둡니다.",
            en: "Foundation explains rules. Components document primitives. Templates describe finished screen contracts. Workflow-specific examples live in Patterns.",
          }}
        />
        <LinkCardGrid cards={overviewCards} />
      </section>

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "런타임 경계", en: "Runtime boundary" }}
          title={{ ko: "shadcn 문서를 깨끗하게 유지합니다.", en: "Keep shadcn docs clean." }}
          description={{
            ko: "디자인 시스템 페이지는 shadcn 프리미티브와 토큰 클래스를 직접 사용해야 합니다. 기존 xGen 호환 레이어는 오래된 프로덕션 서피스를 위해 남아 있지만 문서의 기준은 아닙니다.",
            en: "Design-system pages should use shadcn primitives and token classes directly. Legacy xGen compatibility layers remain available for older production surfaces, but they are not the docs source of truth.",
          }}
        />
        <BoundaryGrid groups={runtimeBoundary} />
      </section>
    </div>
  );
}
