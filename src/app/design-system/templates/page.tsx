import { PageHero, SectionIntro, TemplateGrid } from "../_components/page-sections";
import { templateCards } from "../_data/design-system";

export const metadata = {
  title: "Templates | xGen 디자인 시스템",
  description: "shadcn/ui 기반 xGen 화면 템플릿 기준.",
};

export default function TemplatesPage() {
  return (
    <div className="grid gap-16">
      <PageHero
        label={{ ko: "템플릿", en: "Templates" }}
        title={{ ko: "템플릿은 화면 계약을 정의합니다.", en: "Templates define screen contracts." }}
        description={{
          ko: "템플릿은 완성된 xGen 화면의 영역과 위계를 설명합니다. 두 번째 컴포넌트나 토큰 시스템을 도입하지 않아야 합니다.",
          en: "Templates describe the regions and hierarchy for finished xGen screens. They should not introduce a second component or token system.",
        }}
        action={{ href: "/design-system/components", label: { ko: "컴포넌트 보기", en: "Browse components" } }}
      />

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "화면 계약", en: "Screen contracts" }}
          title={{ ko: "알려진 영역에서 페이지를 조합합니다.", en: "Compose pages from known regions." }}
          description={{
            ko: "이 템플릿은 이후 구현 작업이 shadcn 프리미티브와 xGen 워크플로 요구에 기반을 두도록 유지합니다.",
            en: "These templates keep future implementation work grounded in shadcn primitives and xGen workflow needs.",
          }}
        />
        <TemplateGrid templates={templateCards} />
      </section>
    </div>
  );
}
