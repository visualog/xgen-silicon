# xGen 로컬 클론 및 실행 가이드

이 문서는 `visualog/xgen-silicon` 저장소를 새 Mac에 내려받아 로컬에서 실행하는 방법을 정리한다. 현재 xGen은 Next.js 앱, Electron 데스크톱 앱, 로컬 Codex worker를 함께 사용한다.

## 준비물

- macOS Apple Silicon 환경
- Git
- Node.js 20 이상 권장
- npm
- Codex CLI 설치 및 로그인 상태

Apple Silicon에서는 Node.js와 npm도 arm64 런타임으로 맞추는 것이 좋다. 먼저 현재 터미널이 arm64인지 확인한다.

```bash
uname -m
node -p "process.arch"
```

둘 다 `arm64`로 나와야 한다. `x64`가 나오면 Rosetta 터미널이나 Intel Node.js를 사용 중일 수 있으므로 arm64 터미널과 arm64 Node.js로 다시 준비한다.

## 1. 저장소 클론

```bash
git clone https://github.com/visualog/xgen-silicon.git
cd xgen-silicon
```

## 2. 의존성 설치

```bash
npm install
```

설치 후 arm64 런타임 검사를 실행한다.

```bash
npm run check:arm64
```

## 3. Codex CLI 확인

이미지 생성과 프롬프트 최적화 기능은 앱 내부 API 키가 아니라 로컬 Codex CLI 로그인 상태를 사용한다. 새 컴퓨터에서는 Codex CLI가 설치되어 있고 로그인되어 있어야 한다.

```bash
which codex
codex --version
```

Apple Silicon Homebrew 환경에서는 보통 `/opt/homebrew/bin/codex`가 나온다. Codex CLI가 다른 경로에 있으면 실행 전에 `CODEX_BIN`을 지정한다.

```bash
export CODEX_BIN="$(which codex)"
```

Codex 실행 시 로그인이 필요하다는 안내가 나오면 먼저 로컬 Codex 로그인을 완료한 뒤 xGen을 다시 실행한다.

## 4. 웹 개발 서버만 실행

UI와 일반 화면만 확인할 때는 Next.js 개발 서버만 실행하면 된다.

```bash
npm run dev
```

브라우저에서 다음 주소를 연다.

```text
http://localhost:3000
```

이 방식은 화면 확인에는 충분하지만, Codex 기반 프롬프트 생성과 이미지 생성 기능은 worker가 없으면 실패한다.

## 5. Codex worker까지 실행

이미지 생성, 프롬프트 최적화, 스타일 분석 등 Codex 기반 기능을 확인하려면 터미널을 두 개 사용한다.

터미널 1: Codex worker

```bash
export CODEX_BIN="$(which codex)"
npm run codex-worker
```

터미널 2: Next.js 앱

```bash
export BRANDGEN_CODEX_WORKER_URL="http://127.0.0.1:4317"
npm run dev
```

이후 `http://localhost:3000`에서 xGen을 사용한다.

## 6. Electron 개발 실행

Electron 데스크톱 앱 형태로 실행하려면 다음 명령을 사용한다.

```bash
export CODEX_BIN="$(which codex)"
npm run electron:dev
```

`electron/dev.mjs`는 Next.js 서버와 Codex worker를 함께 띄우고 Electron 창을 연다. 이미 별도 터미널에서 Next.js 서버를 실행 중이라면 다음처럼 기존 서버를 재사용할 수 있다.

```bash
export CODEX_BIN="$(which codex)"
BRANDGEN_ELECTRON_REUSE_NEXT=1 npm run electron:dev
```

## 7. Apple Silicon용 앱 패키징

Apple Silicon용 디렉터리 빌드는 다음 명령으로 실행한다.

```bash
npm run pack:mac
```

빌드 산출물은 `release/` 아래에 생성된다. 이 빌드는 arm64 런타임 검사를 먼저 실행한 뒤 Next.js 빌드와 Electron Builder 패키징을 진행한다.

## 주요 환경 변수

| 변수 | 기본값 | 용도 |
| --- | --- | --- |
| `CODEX_BIN` | `/usr/local/bin/codex` | Codex worker가 실행할 Codex CLI 경로 |
| `BRANDGEN_CODEX_WORKER_PORT` | `4317` | 로컬 Codex worker 포트 |
| `BRANDGEN_CODEX_WORKER_URL` | `http://127.0.0.1:4317` | Next.js API Route가 호출할 worker 주소 |
| `BRANDGEN_CODEX_CWD` | 현재 작업 디렉터리 | `codex exec` 작업 디렉터리 |
| `XGEN_STYLE_REFERENCE_ROOT` | `style-references` | 스타일 레퍼런스 파일 루트 |
| `BRANDGEN_DATA_DIR` | OS별 앱 데이터 디렉터리 | 갤러리와 앱 데이터 저장 위치 |

## 자주 막히는 지점

### `npm run check:arm64`가 실패함

터미널, Node.js, Electron 의존성이 x64로 잡혀 있을 가능성이 크다.

```bash
uname -m
node -p "process.arch"
```

`x64`가 나오면 arm64 터미널과 arm64 Node.js로 다시 설치한다.

### Codex worker에 연결할 수 없음

worker가 실행 중인지 확인한다.

```bash
npm run codex-worker
```

포트를 바꿨다면 앱 실행 쪽에도 같은 URL을 지정한다.

```bash
BRANDGEN_CODEX_WORKER_PORT=4320 npm run codex-worker
BRANDGEN_CODEX_WORKER_URL=http://127.0.0.1:4320 npm run dev
```

### Codex 명령을 찾을 수 없음

Codex CLI 경로를 확인하고 `CODEX_BIN`을 지정한다.

```bash
which codex
export CODEX_BIN="$(which codex)"
npm run codex-worker
```

### 이미지 파일을 찾지 못함

Codex 이미지 생성 결과는 기본적으로 `~/.codex/generated_images/<thread_id>/`에서 회수한다. Codex 작업은 성공했지만 앱이 파일을 찾지 못하면 해당 디렉터리에 실제 이미지가 생성되었는지 확인한다.

```bash
ls ~/.codex/generated_images
```

## 실행 확인 체크리스트

1. `npm install` 완료
2. `npm run check:arm64` 통과
3. `which codex`가 실제 Codex CLI 경로를 출력
4. `npm run codex-worker` 실행
5. `npm run dev` 실행
6. `http://localhost:3000` 접속
7. 이미지 생성 화면에서 프롬프트 생성 또는 이미지 생성 요청 테스트
