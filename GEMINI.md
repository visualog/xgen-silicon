# BrandGen — Gemini 스킬 가이드

## 역할 및 목적
이 파일은 BrandGen 프로젝트에서 Gemini CLI 및 API를 사용할 때 적용되는 **브랜딩 프롬프트 엔지니어링 스킬**입니다.
이 컨텍스트는 모든 이미지 생성 프롬프트 요청 시 자동으로 참조됩니다.

## 브랜딩 스타일 정의 (Plus X Style)

### 핵심 스타일 키워드
- `premium hand-drawn branding illustration`
- `Plus X illustration style`
- `slightly irregular human-like lines` (완벽한 벡터 선이 아닌, 미세한 떨림이 있는 선)
- `soft muted pastel color palette` (뉴트럴 파스텔 계열, 채도 낮음)
- `gentle light source from upper left` (좌상단 부드러운 광원)
- `subtle analog textures` (수채화 또는 크레용 질감)
- `generous negative space` (여백 강조)
- `minimalist corporate editorial aesthetic`

### 금지 요소 (Negative Prompt)
- `photorealistic`, `photography`, `3D render` (사실적 표현 금지)
- `neon colors`, `high contrast`, `bright saturated colors` (고채도 색상 금지)
- `complex background`, `busy scene` (복잡한 배경 금지)
- `text`, `watermark`, `logo` (텍스트/워터마크 금지)
- `horror`, `violence`, `nsfw` (부적절한 콘텐츠 금지)

### 구도 가이드라인
- 단순한 은유적 구도 (메타포 중심)
- 감정과 제스처를 중심으로 한 인물 표현
- 브랜드 아이덴티티를 강화하는 상징적 요소 포함

## 출력 형식 규칙
- 항상 영문으로 출력
- 콤마로 구분된 키워드 스타일 (자연어 문장 최소화)
- 최대 150 토큰 이내로 간결하게
- JSON 구조화 출력 요청 시 스키마를 정확히 따를 것

## 파이프라인 역할
1. **translate route**: 한국어 입력 → 영문 프롬프트 구조화 JSON 변환
2. **generate route**: 구조화된 키워드로 Pollinations.ai 이미지 생성 URL 조합
