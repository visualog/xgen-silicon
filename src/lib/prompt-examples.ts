export type PromptExampleCategory =
  | "product"
  | "character"
  | "brand"
  | "editorial"
  | "environment"
  | "concept";

export type PromptExample = {
  id: string;
  category: PromptExampleCategory;
  title: string;
  summary: string;
  prompt: string;
};

export const PROMPT_EXAMPLE_CATEGORY_LABELS: Record<PromptExampleCategory, string> = {
  product: "제품",
  character: "캐릭터",
  brand: "브랜드",
  editorial: "에디토리얼",
  environment: "공간",
  concept: "컨셉",
};

export const PROMPT_EXAMPLES: PromptExample[] = [
  {
    id: "product-premium-device",
    category: "product",
    title: "프리미엄 디바이스",
    summary: "소재, 형태, 사용 맥락이 분명한 제품 이미지",
    prompt:
      "무광 알루미늄과 반투명 유리로 만들어진 프리미엄 데스크 디바이스. 둥근 모서리의 얇은 직사각형 본체, 전면에는 작은 상태 표시등 하나만 있고 불필요한 로고는 없다. 조용한 작업실 책상 위에 놓여 있으며, 제품의 두께와 소재 질감이 잘 보이는 깔끔한 상업 사진.",
  },
  {
    id: "product-packaging-system",
    category: "product",
    title: "패키지 시스템",
    summary: "브랜드 패키지, 라벨, 구성품을 한 장면에 정리",
    prompt:
      "친환경 스킨케어 브랜드의 패키지 시스템. 재활용 종이 박스, 미니멀한 라벨의 유리 병, 리필 파우치가 한 세트로 정돈되어 있다. 색상은 따뜻한 화이트, 세이지 그린, 다크 그레이 중심. 제품명은 읽히지 않게 추상적인 라벨 구조만 표현하고, 소재감과 정돈된 배열을 강조한다.",
  },
  {
    id: "product-hero-closeup",
    category: "product",
    title: "제품 히어로 클로즈업",
    summary: "핵심 디테일을 크게 보여주는 상세 컷",
    prompt:
      "고성능 러닝화를 위한 제품 히어로 클로즈업. 니트 어퍼의 촘촘한 질감, 반투명 쿠션 미드솔, 작은 반사 디테일이 선명하게 보인다. 신발 전체가 아니라 앞쪽 3/4 영역을 크게 잡고, 배경은 부드러운 콘크리트 톤으로 절제한다.",
  },
  {
    id: "character-consistent-protagonist",
    category: "character",
    title: "일관성 있는 주인공",
    summary: "반복 생성에 적합한 캐릭터 기준 설명",
    prompt:
      "20대 후반의 차분한 여성 탐험가 캐릭터. 짧은 검은 단발머리, 작은 은색 귀걸이, 올리브색 유틸리티 재킷, 낡은 가죽 크로스백을 착용했다. 표정은 침착하고 호기심이 있으며, 과장된 판타지 장식 없이 현실적인 비율과 실용적인 의상을 유지한다.",
  },
  {
    id: "character-expression-sheet",
    category: "character",
    title: "표정 시트",
    summary: "같은 캐릭터의 감정 변주를 정리",
    prompt:
      "동일한 캐릭터의 표정 시트. 기본 얼굴형, 헤어스타일, 의상은 유지하고 8개의 표정만 다르게 보여준다: 평온, 집중, 놀람, 의심, 미소, 걱정, 결심, 피곤함. 흰 배경 위에 균일한 크기의 얼굴 중심 컷으로 정리한다.",
  },
  {
    id: "character-action-pose",
    category: "character",
    title: "액션 포즈",
    summary: "움직임과 실루엣이 강한 캐릭터 컷",
    prompt:
      "가벼운 방어구를 입은 미래형 택배 라이더가 비 오는 골목에서 급하게 방향을 바꾸는 순간. 몸은 앞으로 기울어져 있고 한 손에는 작은 배송 케이스를 단단히 들고 있다. 실루엣이 명확하고 동작선이 살아 있어야 하며, 얼굴보다 자세와 장면의 속도감을 우선한다.",
  },
  {
    id: "brand-app-icon",
    category: "brand",
    title: "앱 아이콘 탐색",
    summary: "작은 크기에서도 읽히는 앱 아이콘 방향",
    prompt:
      "AI 작업 도구를 위한 앱 아이콘 탐색. 복잡한 로봇, 뇌, 카메라, 채팅 말풍선은 피한다. 3개의 입력 노드가 하나의 이미지 코어로 모이는 추상적인 기하 심볼을 만든다. 흑백에서도 강하게 보이고, 24px 크기에서도 식별되는 단순한 실루엣이어야 한다.",
  },
  {
    id: "brand-logo-sheet",
    category: "brand",
    title: "로고 탐색판",
    summary: "여러 방향을 한 번에 비교하는 로고 시트",
    prompt:
      "브랜드 로고 마크 탐색판. 하나의 최종 로고가 아니라 20개의 서로 다른 흑백 심볼 아이디어를 5x4 그리드로 보여준다. 각 심볼은 구조가 달라야 하며, 단순한 반짝이, 로봇, 카메라, 브러시, 말풍선은 사용하지 않는다. 강한 실루엣, 명확한 네거티브 스페이스, 벡터화 가능한 형태를 우선한다.",
  },
  {
    id: "brand-identity-board",
    category: "brand",
    title: "브랜드 무드 보드",
    summary: "제품/색/그래픽 시스템을 한 화면에 정리",
    prompt:
      "조용하고 정밀한 크리에이티브 소프트웨어 브랜드를 위한 무드 보드. 다크 인터페이스 조각, 흑백 심볼, 얇은 그리드, 작은 컬러 포인트, 제품 스크린 일부, 추상적인 노드 그래픽을 정돈된 보드로 구성한다. 장식적 그라디언트보다 구조와 질서를 강조한다.",
  },
  {
    id: "editorial-tech-cover",
    category: "editorial",
    title: "테크 매거진 커버",
    summary: "강한 주제와 편집 디자인이 있는 커버",
    prompt:
      "AI 시대의 개인 창작 도구를 다루는 테크 매거진 커버 이미지. 중앙에는 거대한 반투명 워크플로우 구조가 있고, 작은 작업 노드들이 하나의 결과 이미지로 수렴한다. 실제 텍스트는 만들지 말고, 제목 영역과 보조 기사 영역처럼 보이는 추상적인 레이아웃 블록만 배치한다.",
  },
  {
    id: "editorial-still-life",
    category: "editorial",
    title: "에디토리얼 정물",
    summary: "오브젝트 관계와 분위기를 강조",
    prompt:
      "창작자의 책상 위 정물 이미지. 작은 스케치북, 검은색 스타일러스, 반쯤 열린 노트북, 유리컵, 작은 금속 오브젝트가 비대칭으로 놓여 있다. 모든 물건은 실제로 사용할 법해야 하며, 과도한 장식 없이 조용한 집중감과 물성의 대비를 보여준다.",
  },
  {
    id: "editorial-human-story",
    category: "editorial",
    title: "인물 스토리 컷",
    summary: "광고보다 자연스러운 생활 장면",
    prompt:
      "새벽 작업실에서 한 디자이너가 큰 모니터 앞에 앉아 마지막 시안을 검토하는 장면. 화면의 내용은 추상적으로만 보이고, 인물의 옆얼굴과 손, 주변의 정돈된 도구들이 자연스럽게 드러난다. 극적인 연출보다 실제 업무의 조용한 긴장감을 강조한다.",
  },
  {
    id: "environment-studio",
    category: "environment",
    title: "크리에이티브 스튜디오",
    summary: "서비스 분위기에 맞는 작업 공간",
    prompt:
      "작고 정돈된 크리에이티브 스튜디오 공간. 벽면에는 여러 이미지 프린트와 색상 샘플이 낮은 밀도로 붙어 있고, 중앙에는 넓은 책상과 모니터, 간결한 조명이 있다. 공간은 따뜻하지만 산만하지 않고, 반복 작업과 시각 실험을 위한 실제 작업실처럼 보여야 한다.",
  },
  {
    id: "environment-retail-display",
    category: "environment",
    title: "리테일 디스플레이",
    summary: "브랜드 제품이 놓인 실제 매장 환경",
    prompt:
      "미니멀한 라이프스타일 브랜드의 리테일 디스플레이. 낮은 목재 선반, 간접 조명, 제품을 설명하는 작은 카드, 여백이 많은 벽면 구성이 있다. 장면은 실제 매장처럼 기능적이어야 하며, 제품보다 장식이 더 눈에 띄지 않게 한다.",
  },
  {
    id: "environment-future-workspace",
    category: "environment",
    title: "미래형 워크스페이스",
    summary: "과장되지 않은 미래 업무 공간",
    prompt:
      "가까운 미래의 개인 작업 공간. 얇은 투명 디스플레이, 작은 물리 컨트롤러, 정돈된 케이블, 부드러운 벽면 조명이 있는 책상 환경. 공상과학 영화처럼 과장하지 말고, 현재 제품 디자인의 연장선처럼 실용적이고 조용하게 표현한다.",
  },
  {
    id: "concept-node-to-image",
    category: "concept",
    title: "노드에서 이미지로",
    summary: "xGen의 핵심 은유를 시각화",
    prompt:
      "여러 개의 작은 입력 노드가 선으로 연결되어 하나의 완성된 이미지 프레임으로 수렴하는 추상적인 컨셉 이미지. 각 노드는 프롬프트, 스타일, 참조, 구도, 출력 설정을 상징하지만 텍스트는 사용하지 않는다. 기술적인 다이어그램과 감성적인 이미지 사이의 균형을 유지한다.",
  },
  {
    id: "concept-consistency-system",
    category: "concept",
    title: "일관성 시스템",
    summary: "반복 생성과 기준 이미지를 표현",
    prompt:
      "하나의 기준 이미지에서 여러 변형 이미지가 질서 있게 파생되는 컨셉 이미지. 중앙에는 기준이 되는 시각 요소가 있고 주변에는 색, 자세, 구도만 조금씩 다른 결과물이 배열된다. 복잡한 UI 캡처가 아니라 일관성과 변주라는 아이디어를 직관적으로 보여준다.",
  },
  {
    id: "concept-human-ai-collab",
    category: "concept",
    title: "사람과 AI 협업",
    summary: "과장된 로봇 없이 협업 감각 표현",
    prompt:
      "사람과 AI가 함께 시각 아이디어를 다듬는 장면을 추상적으로 표현한다. 로봇이나 인간형 AI는 등장하지 않는다. 한 사람의 손이 여러 이미지 조각을 정리하고, 화면 안에서는 부드러운 연결선과 선택된 후보들이 체계적으로 배열된다. 협업은 조용하고 정밀한 도구감으로 표현한다.",
  },
];
