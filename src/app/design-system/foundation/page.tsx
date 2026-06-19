import { BoundaryGrid, InfoGrid, PageHero, SectionIntro } from "../_components/page-sections";
import { FoundationPageContent } from "../_components/foundation-page-content";
import { foundationGroups, runtimeBoundary } from "../_data/design-system";

export const metadata = {
  title: "Foundation | xGen 디자인 시스템",
  description: "xGen UI의 토큰, 타입, 상태 기준.",
};

export default function FoundationPage() {
  return (
    <div className="grid gap-16">
      <PageHero
        label={{ ko: "파운데이션", en: "Foundation" }}
        title={{ ko: "토큰을 먼저 정하고, 예외는 마지막에 둡니다.", en: "Start with tokens. Add exceptions last." }}
        description={{
          ko: "색, 간격, 타입, 상태는 shadcn 변수에서 출발합니다. 화면마다 새 규칙을 만들기 전에 이 기준으로 맞춥니다.",
          en: "Color, spacing, type, and states start from shadcn variables. Check this baseline before adding screen-specific rules.",
        }}
      />

      <FoundationPageContent />

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "기본 규칙", en: "Baseline" }}
          title={{ ko: "새 UI가 따라야 할 기본값입니다.", en: "The defaults every new UI should follow." }}
          description={{
            ko: "문서, 컴포넌트, 프로덕션 화면이 같은 기준을 보도록 정리했습니다. 별도 토큰 체계를 다시 만들지 않습니다.",
            en: "These rules keep docs, components, and production screens aligned without reintroducing a second token system.",
          }}
        />
        <InfoGrid groups={foundationGroups} />
      </section>

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "범위", en: "Scope" }}
          title={{ ko: "무엇을 기준으로 삼을지 분리합니다.", en: "Separate standards from compatibility layers." }}
          description={{
            ko: "활성 기준은 shadcn 변수와 로컬 컴포넌트입니다. 보관 토큰과 wrapper는 마이그레이션 제약을 설명할 때만 사용합니다.",
            en: "Active standards are shadcn variables and local components. Archived tokens and wrappers appear only when explaining migration constraints.",
          }}
        />
        <BoundaryGrid groups={runtimeBoundary} />
      </section>
    </div>
  );
}
