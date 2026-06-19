import { BoundaryGrid, LinkCardGrid, PageHero, SectionIntro } from "./_components/page-sections";
import { overviewCards, runtimeBoundary } from "./_data/design-system";

export const metadata = {
  title: "디자인 시스템 | xGen",
  description: "xGen UI를 만들 때 참고하는 shadcn/ui 기준.",
};

export default function DesignSystemPage() {
  return (
    <div className="grid gap-16">
      <PageHero
        label={{ ko: "shadcn/ui 기준", en: "shadcn/ui standards" }}
        title={{ ko: "xGen UI 기준을 한곳에서 확인합니다.", en: "One place for xGen UI standards." }}
        description={{
          ko: "색, 타이포그래피, 컴포넌트, 화면 패턴을 shadcn/ui 기준으로 정리했습니다. 새 화면을 만들기 전에 이 흐름을 먼저 확인하세요.",
          en: "Use this guide to check colors, type, components, and screen patterns before building a new xGen interface.",
        }}
        action={{ href: "/design-system/components", label: { ko: "컴포넌트 보기", en: "Browse components" } }}
      />

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "찾는 방법", en: "How to use this" }}
          title={{ ko: "필요한 기준부터 바로 찾으세요.", en: "Start with the standard you need." }}
          description={{
            ko: "Foundation은 토큰과 기본 규칙, Components는 실제로 쓸 UI 요소, Patterns는 생성 흐름의 조합, Templates는 화면 단위 기준을 다룹니다.",
            en: "Foundation covers tokens and rules. Components covers usable UI pieces. Patterns shows generation-flow examples. Templates define page-level standards.",
          }}
        />
        <LinkCardGrid cards={overviewCards} />
      </section>

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "사용 범위", en: "Scope" }}
          title={{ ko: "새 화면은 shadcn 기준에서 시작합니다.", en: "New screens start from shadcn." }}
          description={{
            ko: "기존 xGen 호환 레이어는 이전 화면을 위해 남겨둡니다. 새 문서와 새 UI는 shadcn 토큰과 로컬 컴포넌트를 기준으로 맞춥니다.",
            en: "Legacy xGen layers stay for older screens. New docs and new UI should use shadcn tokens and local components as the source of truth.",
          }}
        />
        <BoundaryGrid groups={runtimeBoundary} />
      </section>
    </div>
  );
}
