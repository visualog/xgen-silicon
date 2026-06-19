import { PageHero, SectionIntro, TemplateGrid } from "../_components/page-sections";
import { templateCards } from "../_data/design-system";

export const metadata = {
  title: "Templates | xGen 디자인 시스템",
  description: "xGen 화면을 조립할 때 쓰는 페이지 기준.",
};

export default function TemplatesPage() {
  return (
    <div className="grid gap-16">
      <PageHero
        label={{ ko: "템플릿", en: "Templates" }}
        title={{ ko: "화면은 같은 뼈대에서 시작합니다.", en: "Screens start from shared page patterns." }}
        description={{
          ko: "템플릿은 주요 화면의 영역, 위계, 반복 구조를 정리합니다. 새 토큰이나 별도 컴포넌트 체계를 만들기 위한 곳이 아닙니다.",
          en: "Templates define regions, hierarchy, and repeatable structure for key screens. They are not a place to introduce new tokens or component systems.",
        }}
        action={{ href: "/design-system/components", label: { ko: "컴포넌트 보기", en: "Browse components" } }}
      />

      <section className="grid gap-6">
        <SectionIntro
          label={{ ko: "화면 기준", en: "Page standards" }}
          title={{ ko: "알려진 영역을 조합해 화면을 만듭니다.", en: "Build pages from known regions." }}
          description={{
            ko: "템플릿은 구현자가 어디에 헤더, 작업 영역, 결과, 문서 영역을 배치해야 하는지 빠르게 판단하게 합니다.",
            en: "Templates help builders place headers, work areas, results, and documentation regions with less guesswork.",
          }}
        />
        <TemplateGrid templates={templateCards} />
      </section>
    </div>
  );
}
