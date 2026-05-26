# xGen 실행 가이드

집 컴퓨터에서 GitHub 저장소를 클론해서 xGen을 실행하는 방법입니다. 실행 환경이 macOS인지 Windows인지에 따라 앱 실행 방식이 조금 다릅니다.

## 공통 준비

```bash
git clone https://github.com/visualog/brand-gen.git
cd brand-gen
git switch feature/element-board-consistency
npm install
```

이미지 생성과 분석 기능은 로컬 Codex CLI를 사용합니다. 새 컴퓨터에 Codex CLI가 설치되어 있고 로그인되어 있어야 합니다.

```bash
codex --version
codex login
```

## macOS에서 웹 실행

터미널 1에서 Codex worker를 실행합니다.

```bash
BRANDGEN_CODEX_WORKER_PORT=4317 node scripts/codex-worker.mjs
```

터미널 2에서 웹 서버를 실행합니다.

```bash
PORT=3000 BRANDGEN_CODEX_WORKER_URL=http://127.0.0.1:4317 npm run dev
```

브라우저에서 엽니다.

```text
http://localhost:3000
```

포트가 이미 사용 중이면 예를 들어 이렇게 바꿉니다.

```bash
BRANDGEN_CODEX_WORKER_PORT=4318 node scripts/codex-worker.mjs
PORT=3001 BRANDGEN_CODEX_WORKER_URL=http://127.0.0.1:4318 npm run dev
```

이 경우 브라우저 주소는 `http://localhost:3001`입니다.

## macOS에서 앱 실행

개발 모드 앱 실행은 아래 명령 하나로 충분합니다.

```bash
npm run electron:dev
```

이 명령은 내부적으로 Codex worker, Next 웹 서버, Electron 앱을 함께 실행합니다. 포트가 이미 사용 중이면 근처의 빈 포트를 자동으로 찾아 실행합니다.

macOS 앱 번들로 패키징하려면 다음을 실행합니다.

```bash
npm run pack:mac
open release/mac/xGen.app
```

## Windows에서 웹 실행

Windows PowerShell 기준입니다.

터미널 1:

```powershell
$env:BRANDGEN_CODEX_WORKER_PORT="4317"
node scripts/codex-worker.mjs
```

터미널 2:

```powershell
$env:PORT="3000"
$env:BRANDGEN_CODEX_WORKER_URL="http://127.0.0.1:4317"
npm run dev
```

브라우저에서 엽니다.

```text
http://localhost:3000
```

포트 충돌이 있으면 3001/4318처럼 바꿉니다.

```powershell
$env:BRANDGEN_CODEX_WORKER_PORT="4318"
node scripts/codex-worker.mjs
```

```powershell
$env:PORT="3001"
$env:BRANDGEN_CODEX_WORKER_URL="http://127.0.0.1:4318"
npm run dev
```

## Windows에서 앱 실행

개발 모드 앱은 macOS와 동일하게 실행할 수 있습니다.

```powershell
npm run electron:dev
```

현재 `package.json`의 패키징 스크립트는 macOS용 `pack:mac`만 준비되어 있습니다. Windows 설치 파일이나 Windows 앱 번들이 필요하면 `electron-builder` 설정에 Windows target을 추가해야 합니다.

예상 방향:

```json
"win": {
  "target": ["nsis"]
}
```

그 후 별도 스크립트 예시:

```json
"pack:win": "npm run build:next && electron-builder --win"
```

## 추천 실행 순서

처음 집 컴퓨터에서는 먼저 웹보다 앱 개발 모드로 확인하는 것이 가장 간단합니다.

```bash
npm install
npm run electron:dev
```

웹만 확인하고 싶다면 worker와 웹 서버를 따로 실행합니다.

macOS:

```bash
BRANDGEN_CODEX_WORKER_PORT=4317 node scripts/codex-worker.mjs
PORT=3000 BRANDGEN_CODEX_WORKER_URL=http://127.0.0.1:4317 npm run dev
```

Windows PowerShell:

```powershell
$env:BRANDGEN_CODEX_WORKER_PORT="4317"
node scripts/codex-worker.mjs
```

```powershell
$env:PORT="3000"
$env:BRANDGEN_CODEX_WORKER_URL="http://127.0.0.1:4317"
npm run dev
```

## 문제 해결

화면이 안 뜨거나 검정 화면에서 로딩만 돌면 먼저 포트 충돌을 확인합니다.

macOS:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
lsof -nP -iTCP:4317 -sTCP:LISTEN
```

Windows PowerShell:

```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :4317
```

포트가 이미 사용 중이면 3001/4318 같은 다른 포트로 실행합니다.

이미지 생성이 안 되면 Codex CLI 로그인 상태를 확인합니다.

```bash
codex --version
codex login
```

웹 실행 중 이미지 생성/분석이 실패하면 `BRANDGEN_CODEX_WORKER_URL`이 실제 worker 주소와 같은지 확인합니다.
