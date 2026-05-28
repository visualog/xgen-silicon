# Camera Angle UI RAG Improvement Plan

## 목적

현재 xGen의 `카메라 앵글` 노드는 3D 소프트웨어식 조작을 도입했지만, 사용자가 직관적으로 이해하기에는 아직 어렵다. 이 문서는 Blender, Maya, Unity의 공식 문서를 기준으로 3D 카메라 UI 패턴을 정리하고, xGen에 맞는 개선 방향을 제안한다.

## RAG 소스

| Source | 확인한 개념 | URL |
| --- | --- | --- |
| Blender 4.1 Manual, Cameras | focal length, field of view, orthographic, depth of field, safe areas | https://docs.blender.org/manual/en/4.1/render/cameras.html |
| Autodesk Maya Help, Camera Tools menu | tumble, track, dolly, zoom, roll, azimuth/elevation, yaw/pitch | https://help.autodesk.com/cloudhelp/2023/ENU/Maya-Basics/files/GUID-DDE25A30-0D59-4F92-8150-98DD12EF39DE.htm |
| Unity Manual, Scene view navigation | move, orbit, zoom, center, orientation overlay, flythrough | https://docs.unity3d.com/Manual/SceneViewNavigation.html |

## 리서치 요약

### 1. 3D 툴은 카메라 조작을 역할별로 분리한다

Maya는 카메라 조작을 `Tumble`, `Track`, `Dolly`, `Zoom`, `Roll`, `Yaw-Pitch`처럼 명확히 분리한다. 중요한 점은 `Dolly`와 `Zoom`을 다른 동작으로 본다는 것이다. Dolly는 카메라가 앞뒤로 움직이며 원근감이 달라지고, Zoom은 초점거리 변경에 가까워 프레임 안의 크기만 달라진다.

xGen의 현재 UI는 `distance`와 `lens`가 별도 컨트롤로 있긴 하지만, 사용자는 둘의 차이를 화면에서 바로 이해하기 어렵다.

### 2. Orbit은 대상 기준 조작이어야 한다

Unity와 Maya 모두 orbit/tumble을 “현재 피벗 또는 관심 중심점 기준으로 카메라를 회전”하는 방식으로 설명한다. 사용자는 카메라 수치보다 “대상을 어느 쪽에서 보는가”를 먼저 이해한다.

xGen의 현재 2D 패드는 `LEFT`, `RIGHT`, `HIGH`, `LOW` 축은 보여주지만, 중심 대상과 카메라 위치의 관계가 보이지 않는다. 그래서 숫자는 움직이지만 시점이 머릿속에 그려지지 않는다.

### 3. Focal length는 이미지 인상에 큰 영향을 준다

Blender 문서는 focal length가 보이는 장면의 양을 바꾸며, 긴 초점거리는 좁은 FOV와 줌인된 느낌을 만들고 짧은 초점거리는 더 넓은 장면을 보이게 한다고 설명한다. 즉 `18mm`, `50mm`, `135mm` 숫자는 전문가에게는 익숙하지만 일반 사용자에게는 `광각`, `표준`, `망원` 같은 이미지 효과로 번역되어야 한다.

현재 UI는 `Lens 18mm`처럼 숫자가 먼저 보이고, 의미는 프롬프트 박스 안에만 숨겨져 있다.

### 4. Roll은 보조 기능이다

Maya는 Roll을 별도 도구로 분리한다. Roll은 카메라 위치를 바꾸는 것이 아니라 화면의 수평선을 기울이는 기능이다. 현재 xGen 노드에서는 Roll 슬라이더가 주요 컨트롤처럼 노출되어 있어 초보 사용자에게 yaw/pitch와 같은 급의 조작처럼 보인다.

### 5. 전문 용어와 생성 프롬프트는 분리해야 한다

3D 툴의 UI는 실제 조작과 숫자 값을 다루지만, xGen의 목표는 이미지 생성 프롬프트를 더 잘 만드는 것이다. 따라서 UI는 사용자의 의도를 쉽게 받아야 하고, 내부에서만 yaw/pitch/lens로 변환하는 구조가 더 적합하다.

## 현재 UI 진단

### 문제 1. 상단 프리셋과 하단 정밀 조작의 관계가 약하다

`정면`, `3/4`, `측면`, `로우`, `탑`은 좋은 시작점이지만, 프리셋을 누른 뒤 패드와 슬라이더가 무엇을 어떻게 바꿨는지 바로 이해하기 어렵다.

### 문제 2. 2D 패드가 실제 카메라 궤도처럼 보이지 않는다

현재 패드는 추상 좌표판이다. 3D 소프트웨어에서 사용자가 기대하는 것은 “피사체를 중심으로 카메라가 도는 느낌”이다. 지금 UI는 카메라가 어디에 있는지, 피사체가 어디를 바라보는지, 왼쪽/오른쪽이 결과 이미지에서 어떻게 보일지 충분히 보여주지 못한다.

### 문제 3. 숫자가 너무 빨리 노출된다

`Yaw -77°`, `Pitch 24°`, `Roll 20°`, `Lens 18mm`는 정확하지만, 이미지 생성 사용자에게는 해석 비용이 높다. 결과적으로 사용자는 원하는 구도보다 숫자 조작 자체에 집중하게 된다.

### 문제 4. Lens와 Distance가 둘 다 “가까움/멀어짐”처럼 느껴진다

Maya 기준으로는 Dolly와 Zoom의 차이가 중요하지만, 현재 UI에서는 `와이드`와 `18mm`가 비슷한 의미처럼 보인다. 사용자가 둘을 조합했을 때 어떤 이미지가 나오는지 예측하기 어렵다.

### 문제 5. 결과 프롬프트가 확인용이라기보다 기술 로그처럼 보인다

현재 프롬프트 박스는 정확한 값을 보여주지만, 사용자가 조작을 검증하는 시각적 피드백은 아니다. “현재 선택이 어떤 장면인지”를 짧은 한국어로 먼저 보여주고, 상세 프롬프트는 접는 구조가 더 낫다.

## 개선 방향

## 권장 구조

카메라 노드는 `빠른 선택`, `시점 조정`, `프레이밍`, `고급`의 4단 구조로 재설계한다.

### 1. 빠른 선택

상단 프리셋은 유지하되 이름을 더 구도 중심으로 바꾼다.

- 정면
- 3/4 정면
- 측면
- 로우 앵글
- 탑뷰
- 제품샷
- 인물샷

프리셋은 “완성값”이 아니라 시작점이어야 한다. 선택 후 아래 조작에서 계속 미세 조정할 수 있어야 한다.

### 2. 시점 조정

현재 2D 패드를 `Orbit Mini Viewer`로 바꾼다.

구성:

- 중앙에 피사체 점 또는 간단한 실루엣
- 주변에 원형 orbit ring
- 카메라 위치를 작은 카메라 아이콘으로 표시
- 위쪽/아래쪽은 pitch arc로 표시
- 정면, 좌측, 우측, 후면 방향 라벨 표시

사용 방식:

- 원형 링 드래그: 좌우 시점 변경
- 위/아래 작은 아크 드래그: 하이/로우 앵글 변경
- 더블클릭: 정면 복귀
- Shift 드래그: 15도 단위 스냅

화면 텍스트:

- 숫자 대신 `좌측 3/4`, `높은 시점`, `낮은 시점` 같은 해석 라벨을 먼저 보여준다.
- yaw/pitch 숫자는 고급 토글 안에 둔다.

### 3. 프레이밍

`Distance`와 `Lens`를 분리해서 설명하지 말고, 사용자가 먼저 보는 컨트롤은 프레이밍으로 묶는다.

기본 컨트롤:

- 클로즈업
- 미디엄
- 와이드
- 전경

렌즈 컨트롤:

- 광각
- 표준
- 망원

각 선택지는 짧은 설명을 툴팁으로 가진다.

- 광각: 주변 공간이 넓게 보이고 원근감이 강함
- 표준: 사람 눈에 가까운 자연스러운 시점
- 망원: 배경이 압축되고 피사체 중심이 강해짐

### 4. 고급

기본 화면에서는 Roll을 숨기거나 `수평선 기울기`라는 이름으로 접는다.

고급 항목:

- 수평선 기울기
- 정확한 yaw/pitch 값
- 정확한 lens mm 값
- 직교/원근 모드
- 초점/심도는 별도 `Focus` 노드로 분리 검토

## UI 카피 개선

현재:

```text
Yaw -77°
Pitch 24°
Roll 20°
Lens 18mm
```

권장:

```text
시점: 좌측 측면에 가까운 하이 앵글
프레이밍: 와이드
렌즈감: 광각
수평선: 오른쪽으로 20° 기울어짐
```

상세값은 접힌 섹션에서:

```text
Yaw -77° · Pitch 24° · Roll 20° · Lens 18mm
```

## 프롬프트 생성 전략

이미지 생성 모델에는 숫자만 전달하지 말고, 숫자와 해석 문장을 함께 전달한다.

권장 출력:

```text
Camera: left side-biased high angle, wide framing, wide-angle perspective. Technical camera values: yaw -77 degrees, pitch +24 degrees, roll +20 degrees, lens 18mm. Keep the subject readable and avoid extreme distortion unless requested.
```

극단값 보정:

- `lens <= 24mm`이고 `close`이면 “avoid unflattering distortion” 추가
- `roll >= 15°`이면 “intentional dutch angle” 추가
- `pitch >= 45°`이면 “top-down”으로 단순화
- `pitch <= -35°`이면 “dramatic low angle”로 단순화

## 구현 우선순위

### Phase 1: 이해 가능한 UI로 정리

1. 현재 2D 패드를 원형 orbit viewer로 교체
2. 숫자 요약을 한국어 해석 요약으로 변경
3. Lens 숫자를 `광각/표준/망원` 중심으로 표시
4. Roll을 `수평선 기울기`로 이름 변경하고 보조 컨트롤로 내림
5. 상세 technical values를 접힘 영역으로 이동

### Phase 2: 더 나은 조작감

1. 프리셋 선택 시 orbit viewer의 카메라 아이콘이 자연스럽게 이동
2. Shift 스냅, 더블클릭 리셋 지원
3. 작은 구도 미리보기 아이콘 추가
4. distance와 lens 조합에 대한 경고 또는 추천 표시

### Phase 3: 생성 품질 개선

1. 극단값 보정 문구 추가
2. 이미지 타입별 추천값 추가
3. 인물/제품/캐릭터/로고별 카메라 템플릿 추가
4. 생성 결과와 설정값을 비교해 실패 패턴 기록

## 권장 MVP 설계

이번 개선은 과하게 3D 툴을 복제하지 말고, xGen 사용자에게 필요한 “생성 구도 컨트롤”로 좁힌다.

MVP 구성:

- 상단 프리셋 5개 유지
- 중앙 orbit viewer 도입
- `시점`, `프레이밍`, `렌즈감`, `수평선` 한국어 요약 표시
- Lens는 segmented control로 `광각`, `표준`, `망원` 제공
- 기존 numeric model과 `cameraAngle: string` 파이프라인 유지

## 성공 기준

- 사용자가 숫자를 몰라도 원하는 시점을 조정할 수 있다.
- 좌우/상하 조작이 피사체 중심 orbit으로 이해된다.
- Lens와 Distance의 차이가 UI 텍스트와 배치로 구분된다.
- Roll은 주요 카메라 위치 조작으로 오해되지 않는다.
- 출력 프롬프트는 numeric 값과 자연어 해석을 함께 포함한다.
- 기존 저장된 `cameraAngle` 문자열은 계속 파싱 가능해야 한다.

