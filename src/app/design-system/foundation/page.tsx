import { BoundaryGrid, InfoGrid, PageHero, SectionIntro } from "../_components/page-sections";
import { foundationGroups, runtimeBoundary } from "../_data/design-system";

export const metadata = {
  title: "Foundation | xGen 디자인 시스템",
  description: "xGen shadcn/ui foundation rules.",
};

export default function FoundationPage() {
  return (
    <div className="grid gap-16">
      <PageHero
        label={{ ko: "파운데이션", en: "Foundation" }}
        title={{ ko: "토큰 먼저, 예외는 마지막.", en: "Tokens first, exceptions last." }}
        description={{
          ko: "파운데이션 페이지는 제품별 스타일을 도입하기 전에 xGen 화면이 재사용해야 할 shadcn 변수와 유틸리티 스케일의 작은 기준을 정의합니다.",
          en: "The foundation page defines the small set of shadcn variables and utility scales that xGen screens should reuse before introducing product-specific styling.",
        }}
      />

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "핵심 규칙", en: "Core rules" }}
          title={{ ko: "새 UI의 기준선.", en: "The baseline for new UI." }}
          description={{
            ko: "이 규칙은 두 번째 토큰 시스템을 되살리지 않으면서 docs site, shadcn 프리미티브, 프로덕션 마이그레이션 작업을 정렬합니다.",
            en: "These rules keep the docs site, shadcn primitives, and production migration work aligned without bringing back a second token system.",
          }}
        />
        <InfoGrid groups={foundationGroups} />
      </section>

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "경계", en: "Boundary" }}
          title={{ ko: "여기에 속하는 것을 구분합니다.", en: "Know what belongs here." }}
          description={{
            ko: "shadcn 변수와 로컬 프리미티브가 활성 기준입니다. 보관 토큰과 호환성 wrapper는 마이그레이션 제약을 문서화할 때만 등장해야 합니다.",
            en: "shadcn variables and local primitives are active. Archived tokens and compatibility wrappers should only appear when documenting migration constraints.",
          }}
        />
        <BoundaryGrid groups={runtimeBoundary} />
      </section>
    </div>
  );
}
