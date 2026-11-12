# 외부 사실 조사 (External Facts)

작성 기준일 **2026-11-01**. 이후 모든 Task는 버전·명령·URL을 이 문서에서 인용한다. 문서에 없는 값은 새로 만들지 않고, 이 문서를 먼저 고친 뒤 인용한다.

## 0. 읽는 법

### 0.1 표기

모든 사실은 `값 | 공식 출처 URL | 확인일 2026-11-01` 형식이다. 확인하지 못한 항목은 `미확인`으로 적고 대안을 함께 적는다. 값 뒤의 `[태그]`는 이번 조사에서 실제로 확인한 경로다.

| 태그 | 뜻 |
| :-- | :-- |
| `[레지스트리]` | `npm view`, `cargo search`/`cargo info`, NuGet flat-container JSON, Docker Hub API, nodejs.org `dist/index.json`처럼 공식 레지스트리를 직접 조회 |
| `[원문]` | 벤더 공식 GitHub 저장소의 원문(문서 소스, 설치 프로그램 스크립트, `package.json`)을 `raw.githubusercontent.com`으로 직접 읽음. 출처 URL은 사람이 읽는 공식 게시 주소이고, 읽은 원문 저장소는 값 옆에 적음 |
| `[검색요약]` | 문서 호스트가 이 환경에서 차단되어, 공식 문서 호스트로 범위를 한정한 웹 검색의 본문 요약으로 확인. 문구를 짧게 인용하되, 실제 구현 전 원문 대조가 필요함 |
| `[실행]` | 이 샌드박스에서 직접 실행해 동작을 확인 |
| `[교차]` | 비공식 커뮤니티 자료로 교차 확인. 단독 근거로 쓰지 않고, 공식 출처와 일치할 때만 보조로 적음 |

### 0.2 이 조사의 한계 (네트워크 제약)

- 이 환경의 프록시는 `code.visualstudio.com`, `learn.microsoft.com`, `git-scm.com`, `docs.github.com`, `obsproject.com`, `docs.docker.com`, `react.dev`, `reactrouter.com`, `vite.dev`, `doc.rust-lang.org`, `docs.rs`, `crates.io`(웹), `chzzk.gitbook.io`, `developers.chzzk.naver.com`, `render.com`, `fly.io` 등을 차단한다. 위 호스트는 직접 열어 보지 못했다.
- 대신 읽을 수 있었던 공식 경로: nodejs.org(`dist/index.json`, 다운로드 페이지), npm/crates.io 인덱스/NuGet/Docker Hub 레지스트리, 벤더 공식 GitHub 저장소 원문(`microsoft/vscode-docs`, `github/docs`, `docker/docs`, `dotnet/core`, `dotnet/AspNetCore.Docs`, `rust-lang/rustup`, `vitejs/vite`, `remix-run/react-router`, `git-for-windows/build-extra`, `obsproject/*`, `docker-library/*`, `wasm-bindgen/*` 등), GitHub 릴리스/winget 매니페스트 목록 페이지.
- CHZZK Open API 공식 문서(GitBook)는 직접 열지 못했고 `[검색요약]`으로 확인했다. 같은 내용을 비공식 SDK(`WisdomIT/chzzk-open-sdk`)의 엔드포인트 표가 "공식 문서 `llms-full.txt` 2026-07-22 기준"이라고 밝히며 정리해 두었고, 그 표와 일치하는 값만 `[교차]`로 보조 표기했다.
- 이 환경에서 실행하지 못한 것: Windows 11 설치 마법사(실기 확인 불가), CHZZK 실서버 연결(계정·네트워크 없음), OBS 실행. 해당 항목은 원문 소스 기준이며 값 옆에 한계를 적었다.
- 샌드박스 도구 버전(참고): Node v22.23.4, npm 10.9.9, Rust 1.97.0, .NET SDK 10.0.114(Ubuntu 패키지). 독자가 설치할 버전(Node 26.13.0, Rust 1.99.1, .NET SDK 10.0.403)과 다르므로, 이 문서의 `[실행]` 항목은 "샌드박스 버전에서 확인"이라는 뜻이다. 이후 Task는 차이를 발견하면 이 문서를 먼저 고친다.

### 0.3 버전 고정표 (이후 Task가 그대로 인용)

| 항목 | 값 | 비고 |
| :-- | :-- | :-- |
| Node.js LTS | **v26.13.0** (npm 11.20.0) | 2026-10-28 LTS 승격. 교재가 지원하는 Node 계열은 **LTS 22.22.2+ / 24.15+ / 26+** (권장: 현재 LTS인 26) |
| .NET SDK / 런타임 | **10.0.403** / 10.0.14 | LTS, 지원 종료 2028-11-14 |
| EF Core Sqlite, Identity.EntityFrameworkCore, OpenApi | **10.0.14** | NuGet |
| `dotnet-ef` | **10.0.14** | `dotnet tool install --global dotnet-ef` |
| Npgsql.EntityFrameworkCore.PostgreSQL | **10.0.3** | NuGet |
| SocketIOClient (.NET) | **4.0.5** | `EIO = EngineIO.V3` 필수 |
| SkiaSharp / SkiaSharp.NativeAssets.Linux.NoDependencies | **4.154.0** / **4.154.0** | 이미지 처리 선택(MIT). ImageSharp는 쓰지 않음(12절, Ruling R28) |
| `@microsoft/signalr` (npm) | **10.0.11** | |
| TypeScript | **7.0.2** | 네이티브 구현. `tsc` 동작 변경 있음(7절) |
| Vite / create-vite | **8.3.5** / **9.3.3** | |
| React / ReactDOM | **19.3.1** | |
| React Router | **8.5.1** (패키지 `react-router`) | |
| Vitest | **5.0.5** | |
| @testing-library/react / dom / jest-dom / user-event | **16.3.3** / **10.4.2** / **7.0.1** / **14.6.8** | |
| jsdom / @vitejs/plugin-react | **30.1.3** / **6.1.2** | |
| socket.io-client (중계 대안용) | **2.0.3** 고정 | 공식 문서의 지원 상한 |
| Rust 안정 버전 | **1.99.1** (2026-10-13) | 샌드박스는 1.97.0. edition 2024 |
| axum / tokio / serde / serde_json | **0.8.9** / **1.54.1** / **1.0.229** / **1.0.154** | |
| sqlx / tracing / tracing-subscriber | **0.9.0** / **0.1.44** / **0.3.23** | sqlx 최소 Rust 1.94 |
| wasm-bindgen / wasm-bindgen-cli | **0.2.130** / **0.2.130** | 두 버전은 반드시 같아야 함 |
| web-sys / js-sys / wasm-bindgen-futures | **0.3.107** / **0.3.107** / **0.4.80** | |
| console_error_panic_hook / rand / getrandom | **0.1.7** / **0.10.3** / **0.4.3** (`wasm_js`) | |
| wasm-pack | 0.15.1 (**교재에서 사용하지 않음**) | 폐기된 도구가 아님. 담당자 1인 + 권고 미정이라 제외(8절) |
| Rust wasm 대상 | `rustup target add wasm32-unknown-unknown` | **기본 설치에 없음.** 빌드 전에 반드시 한 번 실행(8절) |
| PostgreSQL 공식 이미지 | **`postgres:18`** (18.6) | `latest`와 같은 이미지. 19는 `19rc1`(미정식) |
| Git for Windows | **2.56.0.windows.4** (`Git-2.56.0.4-64-bit.exe`) | |
| OBS Studio | **33.0.1** (`OBS-Studio-33.0.1-Windows-x64-Installer.exe`) | |
| marked / highlight.js / esbuild | **18.1.2** / **11.12.0** / **0.28.2** | 다른 에이전트가 `npm view`로 고정 중. 현재 조회값 |
| VS Code, Docker Desktop | 버전 고정 안 함(최신 설치) | 요구 사항만 고정 |

---

## 1. Node.js

- 현재 LTS는 **v26.13.0 "Lithium"**, 릴리스 2026-10-28, Active LTS 시작 2026-10-28 | https://nodejs.org/en/download , https://nodejs.org/dist/index.json | 확인일 2026-11-01 `[레지스트리]`
- 번들 npm **11.20.0**, V8 14.6 | https://nodejs.org/dist/index.json | 확인일 2026-11-01 `[레지스트리]`
- 지원 일정: v26 LTS 2026-10-28 → Maintenance 2027-10-20 → 종료 2029-04-30. v24 "Krypton"(24.22.2)은 2026-10-20부터 Maintenance, 종료 2028-04-30. v22 "Jod"(22.23.4)는 종료 2027-04-30 | https://github.com/nodejs/Release/blob/main/schedule.json | 확인일 2026-11-01 `[원문]`
- Windows 설치 파일: `https://nodejs.org/dist/v26.13.0/node-v26.13.0-x64.msi` (SHA-256 `0e5ee99c7cbf922887f04af268e3665990748945336a44956f47cc0df695b6df`), ZIP도 있음 | https://nodejs.org/dist/v26.13.0/SHASUMS256.txt | 확인일 2026-11-01 `[레지스트리]`
- winget ID **`OpenJS.NodeJS.LTS`** (매니페스트에 26.13.0 존재). Current 계열은 `OpenJS.NodeJS`로 따로 있음 | https://github.com/microsoft/winget-pkgs/tree/master/manifests/o/OpenJS/NodeJS/LTS | 확인일 2026-11-01 `[원문]` 설치 명령 `winget install OpenJS.NodeJS.LTS`
- `.msi` 마법사 화면 순서: Welcome → License → Destination Folder → Custom Setup(Node.js runtime, npm package manager, Online documentation shortcuts, Add to PATH) → **Tools for Native Modules** → Ready → Install. Native Modules 화면의 체크박스 문구는 "Automatically install the necessary tools. Note that this will also install Chocolatey." (Python·Visual Studio Build Tools·Chocolatey를 설치)라서 초보자는 **체크하지 않는다** | https://github.com/nodejs/node/blob/main/tools/msvs/msi/nodemsi/product.wxs (한국어 문구는 이 저장소에 없어 영어 UI 기준) | 확인일 2026-11-01 `[원문]` (실기 화면은 미확인)
- 설치 확인 명령: `node --version`, `npm --version` | 확인일 2026-11-01 `[실행]`
- 이 교재의 다른 도구가 요구하는 Node 범위(`engines`): vite 8.3.5 `^20.19.0 || >=22.12.0`, vitest 5.0.5 `^22.12.0 || ^24.0.0 || >=26.0.0`, jsdom 30.1.3 `^22.22.2 || ^24.15.0 || >=26.0.0`, react-router 8.5.1 `>=22.22.0`, @testing-library/jest-dom 7.0.1 `>=22`, marked 18.1.2 `>=20`, esbuild 0.28.2 `>=18` | `npm view <pkg> engines` | 확인일 2026-11-01 `[레지스트리]`
- `.ts` 파일 직접 실행: Node v22.23.4에서 플래그 없이 `node hello.ts`가 동작함(타입 표기만 있는 단순 파일 기준. enum 등 런타임 구문은 확인하지 않음) | https://nodejs.org/api/typescript.html | 확인일 2026-11-01 `[실행]` (해당 문서 본문은 직접 읽지 못함)
- **PowerShell 실행 정책 (Node 설치 직후 PowerShell에서 `npm`이 막히는 경우)**
  - Node의 Windows 배포(ZIP)에는 `npm`, `npm.cmd`, `npm.ps1`, `npx`, `npx.cmd`, `npx.ps1`이 같은 폴더에 들어 있다(ZIP 목록을 직접 확인). `.ps1`은 PowerShell 스크립트라서 실행 정책의 대상이다 | https://nodejs.org/dist/v26.13.0/node-v26.13.0-win-x64.zip | 확인일 2026-11-01 `[레지스트리]`
  - Windows PowerShell 5.1(Windows 11의 기본 `powershell.exe`) 문서: `Restricted`는 "The default execution policy for Windows client computers." 이고 "Permits individual commands, but doesn't allow scripts."; 모든 범위가 `Undefined`이면 유효 정책은 Windows 클라이언트에서 `Restricted`. PowerShell 7.x 문서는 Windows 클라이언트 기본을 `RemoteSigned`로 적어, `pwsh`에서는 이 문제가 없을 수 있다 | https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies | 확인일 2026-11-01 `[원문: MicrosoftDocs/PowerShell-Docs reference/5.1, reference/7.5 …/about_Execution_Policies.md]`
  - 차단되면 PowerShell이 영어 원문 "File {0} cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https://go.microsoft.com/fwlink/?LinkID=135170." 를 낸다. 한국어 UI에서는 이 문장이 번역되어 `npm.ps1` 경로가 들어간 "이 시스템에서 스크립트를 실행할 수 없으므로 … 파일을 로드할 수 없습니다" 형태로 보인다(검토자 보고 `[교차]`). 오류 분류는 `PSSecurityException`, `FullyQualifiedErrorId : UnauthorizedAccess`(Set-ExecutionPolicy 문서의 오류 예시와 같은 형식) | https://github.com/PowerShell/PowerShell/blob/master/src/System.Management.Automation/resources/Authenticode.resx (`Reason_RestrictedMode`), https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy | 확인일 2026-11-01 `[원문]` (한국어 번역 문구는 공개 저장소에 없어 정확한 표기는 미확인)
  - **공식 해결**: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` (about_Execution_Policies의 예시 그대로). 문서가 "Run as administrator"를 요구하는 것은 `LocalMachine` 범위 변경뿐이므로 `CurrentUser` 범위는 관리자 권한 없이 쓸 수 있다. 현재 값 확인은 `Get-ExecutionPolicy -Scope CurrentUser`(문서 예시) | 위와 같은 문서 | 확인일 2026-11-01 `[원문]`
  - **정책을 바꾸지 않는 대안**: PowerShell 문서는 실행 파일을 확장자까지 적어 정확히 지정해 실행할 수 있다고 설명한다(예: `where` 대신 `where.exe`). 같은 방식으로 `npm.cmd`, `npx.cmd`를 쓰면 `.cmd`는 PowerShell 스크립트가 아니므로 정책 대상이 아닐 것으로 **추정**한다. 명령 프롬프트(cmd.exe)에서 `npm`을 실행하는 경우도 같은 이유로 영향이 없을 것으로 추정 | https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_command_precedence | 확인일 2026-11-01 `[원문]` (확장 없는 `npm`이 `.ps1`을 우선 선택하는 규칙과 `.cmd`가 정책을 받지 않는다는 문장은 공식 문서에서 확인 못 함 → 추정, 실기 미확인. 이 샌드박스에는 Windows PowerShell이 없어 재현하지 못함)

**교재 반영 결정**
- 설치 안내는 nodejs.org의 **LTS 버튼**(작성 기준 v26.13.0, **현재 LTS인 26 계열 권장**)과 `winget install OpenJS.NodeJS.LTS`를 함께 쓴다. 교재가 지원하는 Node는 정확히 **LTS 22.22.2+ / 24.15+ / 26+** 이다(가장 엄격한 jsdom 30.1.3의 `engines` `^22.22.2 || ^24.15.0 || >=26.0.0`에 맞춤. 홀수 계열 23·25는 비LTS라 제외). 설치 직후 `node --version`으로 이 범위를 확인시키고, LTS 승격 4일차이므로 "화면의 LTS 번호가 달라도 정상"이라고 적는다.
- Node 설치를 다루는 Day의 점검 단계에 PowerShell에서 `npm --version`을 실행해 보는 단계를 넣고, 빨간 오류(`npm.ps1` … `UnauthorizedAccess`)가 나면 `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` 한 줄을 안내한다(대안은 `npm.cmd`, 추정 표기). MSI의 "Tools for Native Modules"는 체크하지 않게 안내한다.
- `node 파일.ts` 직접 실행은 보조 팁으로만 쓰고, 본선은 `tsc`/Vite로 간다.

---

## 2. VS Code와 확장

- 설치 방식은 Windows **User setup**(관리자 권한 불필요, 설치 위치 `%LOCALAPPDATA%\Programs\Microsoft VS Code`, 파일명 `VSCodeUserSetup-{version}.exe`)을 권장. System setup은 관리자 권한과 `Program Files`가 필요 | https://code.visualstudio.com/docs/setup/windows | 확인일 2026-11-01 `[원문: microsoft/vscode-docs docs/setup/windows.md, DateApproved 10/28/2026]`
- 설치 옵션(Select Additional Tasks) 기본값: 바탕 화면 아이콘 **해제**, 파일 상황 메뉴 "Code(으)로 열기" **해제**, 디렉터리 상황 메뉴 "Code(으)로 열기" **해제**, 지원 파일 형식의 편집기로 등록 **선택**, **PATH에 추가 선택** | https://github.com/microsoft/vscode/blob/main/build/win32/code.iss (`[Tasks]` 구간) | 확인일 2026-11-01 `[원문]`
- 한국어 설치 화면 문구: `"%1(으)로 열기" 작업을 Windows 탐색기 디렉터리의 상황에 맞는 메뉴에 추가`, `PATH에 추가(다시 시작한 후 사용 가능)`, `기타:` | https://github.com/microsoft/vscode/blob/main/build/win32/i18n/messages.ko.isl | 확인일 2026-11-01 `[원문]`
- 최신 User setup에는 **Copilot CLI 페이지**가 추가됨. 선택지는 "Install … now" / "Install … when I first run copilot" / "Don't add the copilot command". Copilot CLI는 별도 제품이며 별도 약관과 구독이 필요하다고 문서가 적고 있음 | https://code.visualstudio.com/docs/setup/windows | 확인일 2026-11-01 `[원문]` (정확한 한국어 화면 문구는 미확인)
- 설치 후 `%PATH%` 반영을 위해 콘솔을 다시 열고 `code .`로 폴더를 연다 | https://code.visualstudio.com/docs/setup/windows | 확인일 2026-11-01 `[원문]`
- 확장 설치 명령: `code --install-extension <publisher.extension>` | https://code.visualstudio.com/docs/configure/command-line | 확인일 2026-11-01 `[원문: microsoft/vscode-docs docs/configure/command-line.md]`
- 확장 ID (각 확장 저장소의 `package.json`에서 `publisher.name`으로 확인):

| 용도 | 확장 ID | 비고 | 출처 |
| :-- | :-- | :-- | :-- |
| 한국어 팩 | **`MS-CEINTL.vscode-language-pack-ko`** | "Korean Language Pack for Visual Studio Code", VS Code 1.131 이상 필요 | https://github.com/microsoft/vscode-loc |
| Live Preview | **`ms-vscode.live-server`** | Microsoft 제작, "Hosts a local server in your workspace for you to preview your webpages on." 확인됨(맞음) | https://github.com/microsoft/vscode-livepreview |
| C# Dev Kit | **`ms-dotnettools.csdevkit`** | 설치하면 C# 확장(`ms-dotnettools.csharp`)이 필수 의존성으로 같이 설치됨 | https://github.com/microsoft/vscode-dotnettools , https://github.com/dotnet/vscode-csharp |
| rust-analyzer | **`rust-lang.rust-analyzer`** | | https://github.com/rust-lang/rust-analyzer |
| REST Client | **`humao.rest-client`** | 서드파티(Huachao) 확장이지만 가장 널리 쓰는 `.http` 파일 실행기 | https://github.com/Huachao/vscode-restclient |

  확인일은 모두 2026-11-01 `[원문]`.
- **C# Dev Kit 라이선스 주의**: 공식 시작 문서가 "You are required to sign in to a Visual Studio subscription to use C# Dev Kit"라고 적는 반면, 로그인 문서는 "sign in is not required or enforced by the extension, you might need to sign in using your Visual Studio account to comply with the EULA"라고 적어 서로 표현이 다르다 | https://code.visualstudio.com/docs/csharp/get-started , https://code.visualstudio.com/docs/csharp/signing-in | 확인일 2026-11-01 `[원문]` **실제 라이선스 조건(개인 무료 여부)은 미확인.** 대안: C# 확장(`ms-dotnettools.csharp`) 단독 + `dotnet` CLI 조합. 이 확장도 별도 라이선스 파일(`RuntimeLicenses/license.txt`)이 있음.

**교재 반영 결정**
- P1 Day 2(설계서 3.1: 개발 도구 설치)는 User setup에서 "PATH에 추가"는 유지하고 "Code(으)로 열기" 두 항목은 체크하도록 안내한다(폴더 우클릭으로 여는 습관용). Copilot 명령은 "Don't add the copilot command"를 고르게 한다(별도 제품·구독).
- 한국어 팩, Live Preview는 P1에서, rust-analyzer는 P3에서, REST Client는 P2에서 설치한다. C# 지원은 P2에서 **C# 확장 + `dotnet` CLI**를 기본으로 하고, C# Dev Kit은 "선택, 로그인·약관 확인 필요"로 둔다.

---

## 3. Git for Windows

- 최신 릴리스는 **v2.56.0.windows.4**, 릴리스 페이지에 "26 October"(2026) 표기. 64비트 설치 파일 `Git-2.56.0.4-64-bit.exe` | https://github.com/git-for-windows/git/releases/latest | 확인일 2026-11-01 (릴리스 페이지, 연도는 페이지 푸터 기준)
- winget ID **`Git.Git`** (매니페스트 2.56.0.4까지 존재) | https://github.com/microsoft/winget-pkgs/tree/master/manifests/g/Git/Git | 확인일 2026-11-01 `[원문]`
- 설치 마법사 화면과 기본값 (설치 프로그램 스크립트 `install.iss`의 페이지 생성 순서와 기본 선택 기준. 영어 UI. **실기 확인은 못 함**) | https://github.com/git-for-windows/build-extra/blob/main/installer/install.iss | 확인일 2026-11-01 `[원문]`:

| 순서 | 화면 제목 | 설치 프로그램 기본값 | 교재 권장 선택 |
| :-- | :-- | :-- | :-- |
| 1 | Select Components | Windows Explorer integration(Git Bash here, Git GUI here), Git LFS, .git* 설정 파일 연결, .sh 연결, Windows Terminal 프로필 등 | 기본값 유지 |
| 2 | Choosing the default editor used by Git | Vim | **"Use Visual Studio Code as Git's default editor"** (VS Code가 이미 설치되어 있어야 목록에서 선택 가능) |
| 3 | Adjusting the name of the initial branch in new repositories | "Let Git decide"(설치 스크립트의 기본 정의는 `master`, 릴리스 빌드가 쓰는 값은 미확인) | **"Override the default branch name for new repositories" → `main`** (입력칸 기본값이 `main`) |
| 4 | Adjusting your PATH environment | "Git from the command line and also from 3rd-party software" | 기본값 유지. 화면에 **(Recommended)**로 표기됨 |
| 5 | Choosing the SSH executable | Use bundled OpenSSH | 기본값 유지 |
| 6 | Choosing HTTPS transport backend | Use the OpenSSL library(첫 번째 선택지) | 기본값 유지 |
| 7 | Configuring the line ending conversions | **Checkout Windows-style, commit Unix-style line endings** | 기본값 유지 |
| 8 | Configuring the terminal emulator to use with Git Bash | Use MinTTY | 기본값 유지(교재는 PowerShell 사용) |
| 9 | Choose the default behavior of `git pull` | Merge | 기본값 유지 |
| 10 | Choose a credential helper | Git Credential Manager | 기본값 유지 |
| 11 | Configuring extra options | 파일 시스템 캐싱 선택, 심볼릭 링크 자동 판정 | 기본값 유지 |

**교재 반영 결정**
- P1 Day 7(설계서 3.1: Git·GitHub 시작)의 Git 설치는 위 표대로 "VS Code를 먼저 설치한 뒤 Git 설치 → 편집기는 VS Code, 초기 브랜치는 `main`, 나머지는 기본값"으로 쓴다. 설치 직후 `git --version`으로 확인하고, 줄 끝 처리는 기본값을 유지한다고 이유(Windows 체크아웃은 CRLF, 커밋은 LF)를 한 줄로 설명한다.
- 화면 캡처 없이 텍스트 안내만 한다. "화면 문구가 약간 달라도 같은 위치의 선택지를 고르세요"를 `:::info`로 덧붙인다.

---

## 4. GitHub Pages

- 사용 조건: Pages는 **GitHub Free(개인)·Free for organizations에서는 공개(public) 저장소**만, Pro·Team·Enterprise Cloud·Enterprise Server에서는 공개·비공개 저장소 모두 가능 | https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages | 확인일 2026-11-01 `[원문: github/docs data/reusables/gated-features/pages.md]`
- 따라서 **무료 플랜에서 비공개 저장소 Pages는 불가**. 유료 플랜에서도 비공개 저장소의 사이트는 기본적으로 인터넷에 공개되며, 사이트 자체를 비공개로 발행하려면 Enterprise Cloud 조직 등 별도 조건이 필요 | https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site | 확인일 2026-11-01 `[원문: github/docs data/reusables/pages/private_pages_are_public_warning.md]`
- 설정 메뉴 경로: 저장소 → **Settings** → 왼쪽 사이드바 "Code, planning, and automation" 아래 **Pages** → "Build and deployment"의 "Source"에서 **Deploy from a branch** 선택 → 브랜치(`main`)와 폴더(`/ (root)` 또는 `/docs`) 선택 → **Save** | https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site | 확인일 2026-11-01 `[원문: github/docs …/configuring-a-publishing-source-for-your-github-pages-site.md]`
- 진입 파일은 소스 폴더 최상위의 `index.html`(또는 `index.md`, `README.md`). 변경 후 반영까지 **최대 10분** | https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site | 확인일 2026-11-01 `[원문]`
- 설정 변경 권한은 저장소 admin 또는 maintainer | 위와 같은 문서 | 확인일 2026-11-01 `[원문]`
- 사용 한도: 발행 사이트 1 GB 이하, 소스 저장소 권장 1 GB, 배포 10분 초과 시 시간 초과, **월 100 GB 소프트 대역폭**, 시간당 10 빌드 소프트 한도(커스텀 Actions 워크플로로 발행하면 빌드 한도 비적용). 상용 거래·SaaS 용도의 무료 호스팅으로는 허용되지 않음 | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits | 확인일 2026-11-01 `[원문]`

- 러너 이미지(교재 배포 워크플로용): `ubuntu-latest` 레이블은 2026-10-19~2026-11-19 사이 Ubuntu 24.04 → 26.04로 차례로 옮겨 가고, Ubuntu 26.04 이미지는 정식 지원(GA). `runs-on: ubuntu-26.04`로 고정할 수 있다 | https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration | 확인일 2026-11-12 `[원문]`. 이 저장소의 배포 실행 43104398962(2026-11-11)는 이미 `Image: ubuntu-26.04`, `Version: 20261101.186.1`에서 초록 `[측정]`.

**교재 반영 결정**
- P1 Day 마지막 배포 Day는 "공개 저장소 + Deploy from a branch(`main`, `/ (root)`)"를 쓴다. 비공개 저장소 Pages는 유료이므로 안내하지 않고, `index.html`이 저장소 최상위에 있어야 한다고 못 박는다.
- 발행 후 "최대 10분 기다린 뒤 새로고침"을 `:::tip`에 넣는다. SP 같은 서버 앱은 Pages로 배포할 수 없음을 13절 표에서 분리한다.

---

## 5. OBS Studio

- 최신 릴리스 **33.0.1**, 릴리스 페이지 표기 "29 Oct"(연도는 페이지에 없음). 소스 저장소 `libobs/obs-config.h`의 API 버전도 33.0.1이라 일치 | https://github.com/obsproject/obs-studio/releases/latest | 확인일 2026-11-01 (릴리스 페이지 + `[원문]`)
- Windows 설치 파일 `OBS-Studio-33.0.1-Windows-x64-Installer.exe` | https://github.com/obsproject/obs-studio/releases/latest | 확인일 2026-11-01
- winget ID **`OBSProject.OBSStudio`**. 단, winget 매니페스트 최상위 버전은 33.0.0으로 업스트림보다 한 단계 뒤처져 있음 | https://github.com/microsoft/winget-pkgs/tree/master/manifests/o/OBSProject/OBSStudio | 확인일 2026-11-01 `[원문]`
- 브라우저 소스 추가 경로(한국어 UI 문자열): **소스 목록** 도크의 **+** 버튼(`소스 추가`) → **브라우저**(소스 종류 이름 `브라우저`) → 이름 입력 → 속성 창의 **로컬 파일** 체크, **URL**, **너비**, **높이**, **사용자 지정 CSS** | https://github.com/obsproject/obs-studio/blob/master/frontend/data/locale/ko-KR.ini , https://github.com/obsproject/obs-browser/blob/master/data/locale/ko-KR.ini | 확인일 2026-11-01 `[원문]` (버튼 모양은 실기 미확인)
- 브라우저 소스 기본 설정값: 너비 800, 높이 600, FPS 30, 기본 URL `https://obsproject.com/browser-source` | https://github.com/obsproject/obs-browser/blob/master/obs-browser-plugin.cpp (`browser_source_get_defaults`) | 확인일 2026-11-01 `[원문]`
- **투명 배경 동작**: 기본 사용자 지정 CSS가 `body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }`라서 페이지가 자기 배경색을 칠하지 않으면 투명으로 합성됨. 페이지가 `html`/`body`에 불투명 배경을 직접 지정하면 투명이 풀림 | https://github.com/obsproject/obs-browser/blob/master/obs-browser-plugin.cpp (`default_css`) | 확인일 2026-11-01 `[원문]` (OBS 실행 화면 확인은 못 함)
- 브라우저 소스 접근 권한 선택지(한국어): "OBS에 접근 권한 없음"이 가장 낮은 단계 | https://github.com/obsproject/obs-browser/blob/master/data/locale/ko-KR.ini | 확인일 2026-11-01 `[원문]`

**교재 반영 결정**
- SP 오버레이는 `http://localhost:<포트>/overlay` 같은 로컬 URL을 브라우저 소스 **URL**에 넣게 하고, 오버레이 CSS는 `html, body { background: transparent; }`를 명시한다(기본 CSS에만 기대지 않기). 너비·높이는 방송 해상도(1920×1080)로 바꾸게 한다.
- 파일 더블클릭 `file://` 오버레이는 "로컬 파일" 체크 방식으로 P1에서 맛보기만 하고, 핵심 실습은 로컬 서버 URL로 한다.

---

## 6. .NET 10

- .NET 10은 **LTS**, 2025-11-11부터 3년간 지원, **지원 종료 2028-11-14**. 현재 지원 단계 `active` | https://dotnet.microsoft.com/download/dotnet/10.0 | 확인일 2026-11-01 `[원문: dotnet/core release-notes/10.0/README.md, releases-index.json]`
- 최신 SDK **10.0.403**, 최신 런타임 **10.0.14**(2026-10-25 릴리스) | https://dotnet.microsoft.com/download/dotnet/10.0 | 확인일 2026-11-01 `[원문: releases-index.json]`
- 참고: .NET 11은 `11.0.0-rc.3`(go-live, STS)이며 정식 전. 교재는 사용하지 않음. 9.0과 8.0은 2026-11-10 지원 종료 예정 | https://github.com/dotnet/core/blob/main/release-notes/releases-index.json | 확인일 2026-11-01 `[원문]`
- winget ID **`Microsoft.DotNet.SDK.10`** (매니페스트 10.0.403까지 존재) | https://github.com/microsoft/winget-pkgs/tree/master/manifests/m/Microsoft/DotNet/SDK/10 | 확인일 2026-11-01 `[원문]` 설치 명령 `winget install Microsoft.DotNet.SDK.10`, 확인 명령 `dotnet --version` → `10.0.x`
- `dotnet new` 템플릿 이름(샌드박스 SDK 10.0.114에서 `dotnet new list`로 확인. Windows SDK 10.0.403의 목록과 같다는 점은 실기 미확인) | https://learn.microsoft.com/dotnet/core/tools/dotnet-new-sdk-templates | 확인일 2026-11-01 `[실행]`:

| 용도 | 짧은 이름 | 실제 동작 |
| :-- | :-- | :-- |
| 콘솔 | `console` | 최상위 문장(top-level statements) `Program.cs` |
| 빈 ASP.NET Core | `web` | `Microsoft.NET.Sdk.Web`, `MapGet("/", () => "Hello World!")` |
| Web API | `webapi` | **Minimal API** 기본, `AddOpenApi()`/`MapOpenApi()` 포함, `Microsoft.AspNetCore.OpenApi` 10.0.14 참조. 컨트롤러형은 `-controllers`(`--use-controllers`) 옵션 |
| 테스트 | `xunit` | xunit 2.9.3, Microsoft.NET.Test.Sdk 17.14.1 |
| 클래스 라이브러리 | `classlib` | |
| 솔루션 | `sln` | **.NET 10 SDK에서는 `.slnx`가 기본**(`dotnet new sln -n Demo` → `Demo.slnx`). 옛 형식은 `--format sln` |

  모든 템플릿의 `TargetFramework`는 `net10.0`.
- **Minimal API 내장 검증**: `builder.Services.AddValidation();`이 **존재**한다. DataAnnotations 특성으로 쿼리·헤더·본문을 검증하고 실패하면 400을 반환. 레코드에 `[Required]`, `[Range]`를 직접 붙일 수 있음 | https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-10.0 | 확인일 2026-11-01 `[원문: dotnet/AspNetCore.Docs release-notes/aspnetcore-10/includes/ValidationSupportMinAPI.md]` `[실행]`
  - **함정(실행으로 확인)**: 본문 모델 타입이 `internal`(기본 접근 수준)이면 소스 생성기가 타입을 건너뛰어 **검증이 조용히 꺼진다**(잘못된 값도 200). `public record Item(...)`로 선언해야 400이 나오고, 응답은 `{"title":"One or more validation errors occurred.","errors":{"Name":["The field Name must be a string or array type with a minimum length of '2'."],"Qty":[...]}}` 형태. 쿼리 매개변수(`[Range(1,10)] int n`)는 public 여부와 무관하게 동작.
  - 소스 생성기는 `AddValidation`을 호출한 어셈블리에서만 타입을 찾는다.
- **`TypedResults.ServerSentEvents`**: **존재**한다. `TypedResults.ServerSentEvents(IAsyncEnumerable<T>, eventType: "tick")` 호출이 컴파일되고, 응답이 `Content-Type: text/event-stream`, 본문 `event: tick\ndata: 0\n\n…`으로 나옴 | https://learn.microsoft.com/aspnet/core/release-notes/aspnetcore-10.0 | 확인일 2026-11-01 `[원문: includes/sse.md]` `[실행]`
- **`MapIdentityApi` + 쿠키 로그인**: 패키지 `Microsoft.AspNetCore.Identity.EntityFrameworkCore` + EF 공급자 필요. `AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<AppDb>()`, `app.MapIdentityApi<IdentityUser>()`, `AddAuthorization()`, `UseAuthentication()`, `UseAuthorization()` 순서. `POST /register`(`{"email","password"}`)는 200, `POST /login?useCookies=true`는 200과 함께 `Set-Cookie: .AspNetCore.Identity.Application=…; path=/; samesite=lax; httponly`(약 14일 만료)를 내려주고, 그 쿠키로 보호된 엔드포인트가 200. `useCookies`를 빼면 쿠키 대신 JSON(`tokenType: "Bearer"`, `accessToken`…)이 나옴 | https://learn.microsoft.com/aspnet/core/security/authentication/identity-api-authorization | 확인일 2026-11-01 `[실행]` (비밀번호는 `Passw0rd!`처럼 대소문자·숫자·기호 포함이 필요)
- **`dotnet-ef` 설치**: `dotnet tool install --global dotnet-ef` → 버전 **10.0.14**, `dotnet-ef --version`으로 확인. 프로젝트에는 `Microsoft.EntityFrameworkCore.Design`(10.0.14)이 필요 | https://learn.microsoft.com/ef/core/cli/dotnet | 확인일 2026-11-01 `[레지스트리]` `[실행]`
- **Rate Limiting 미들웨어**: **내장**(`Microsoft.AspNetCore.RateLimiting`, 별도 패키지 불필요). `AddRateLimiter(o => o.AddFixedWindowLimiter("fixed", …))` + `app.UseRateLimiter()` + `.RequireRateLimiting("fixed")`; `RejectionStatusCode = 429`로 설정하면 허용 3회 뒤 요청이 429(`200 200 200 429 429`) | https://learn.microsoft.com/aspnet/core/performance/rate-limit | 확인일 2026-11-01 `[실행]`
- 기타 NuGet 최신(정식): `Microsoft.EntityFrameworkCore.Sqlite` 10.0.14, `Microsoft.AspNetCore.Identity.EntityFrameworkCore` 10.0.14, `Microsoft.AspNetCore.OpenApi` 10.0.14, `Npgsql.EntityFrameworkCore.PostgreSQL` 10.0.3, `Microsoft.AspNetCore.SignalR.Client` 10.0.14 | https://www.nuget.org/ (flat-container JSON) | 확인일 2026-11-01 `[레지스트리]`
- `dotnet run`은 `Properties/launchSettings.json`의 `applicationUrl`(템플릿 기본 `http://localhost:5250` 등 무작위 포트)을 쓰며 `ASPNETCORE_URLS` 환경변수보다 우선함. `--urls`로 덮어쓰면 됨 | `[실행]`
- **sqlite3 명령줄 도구 설치(Windows, P2 Day 19)**: winget ID **`SQLite.SQLite`**(최신 매니페스트 3.54.1, 2026-10-16). 설치 명령 `winget install SQLite.SQLite`, 확인 명령 `sqlite3 --version`. 매니페스트는 zip 포터블 형식이고 `sqlite3`(별칭 `sqlite3`), `sqldiff`, `sqlite3_analyzer`, `sqlite3_rsync`를 풀어 `PATH`가 닿는 링크로 등록한다. 설치 파일: `https://www.sqlite.org/2026/sqlite-tools-win-x64-3540100.zip`(x64), `…win-arm64-3540100.zip`(ARM64). 수동 설치는 이 zip을 `C:\dev\tools\sqlite` 같은 폴더에 풀고 그 폴더를 사용자 `Path`에 더한다 | https://github.com/microsoft/winget-pkgs/tree/master/manifests/s/SQLite/SQLite/3.54.1 | 확인일 2026-11-06 `[원문: raw.githubusercontent.com microsoft/winget-pkgs SQLite.SQLite.installer.yaml]` (sqlite.org 호스트는 이 환경에서 차단. Windows 실기 설치와 CLI 3.54.1의 출력 모양은 미확인. 출력 예시는 Linux sqlite3 3.45.1 `[실행]`이므로 `.mode column`과 `.headers on`으로 맞춘다)
- **`Microsoft.EntityFrameworkCore.Sqlite`/`Design` 10.0.14, `dotnet-ef` 10.0.14 설치 흐름(P2 Day 20)**: `dotnet add package <이름> --version 10.0.14`, `dotnet tool install --global dotnet-ef --version 10.0.14`, `dotnet ef migrations add InitialCreate`, `dotnet ef database update`를 Linux SDK 10.0.114에서 실행해 확인 | https://learn.microsoft.com/ef/core/cli/dotnet | 확인일 2026-11-06 `[실행]`

**교재 반영 결정**
- P2 Day 9부터 **.NET 10 SDK(10.0.x)** 를 쓰고, `dotnet new web`/`webapi`/`console`/`xunit`/`sln`(→ `.slnx`) 이름을 그대로 쓴다. `dotnet --version`이 `10.0`으로 시작하는지 확인시킨다.
- 요청 모델 코드는 항상 `public record`로 쓰고 `AddValidation()` 함정을 `:::warn`으로 둔다. 로그인은 `MapIdentityApi` + `?useCookies=true`, 실시간은 `TypedResults.ServerSentEvents`, 남용 방지는 내장 Rate Limiting을 쓴다.

---

## 7. TypeScript · Vite · React · 테스트

- **TypeScript 7.0.2** (`latest`). 네이티브 구현이며 `tsc` 하나만 제공하는 패키지(플랫폼별 `@typescript/typescript-*` 의존성) | https://www.npmjs.com/package/typescript | 확인일 2026-11-01 `[레지스트리]`
  - `npx tsc --init`이 만드는 `tsconfig.json` 기본값: `module: nodenext`, `target: esnext`, `types: []`, `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`, `verbatimModuleSyntax: true`, `isolatedModules: true`, `jsx: react-jsx`, `skipLibCheck: true`, `sourceMap`/`declaration`/`declarationMap: true` `[실행]`
  - **함정**: `tsconfig.json`이 있는 폴더에서 `npx tsc hello.ts`처럼 파일을 지정하면 `error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.`가 난다. 파일을 직접 컴파일하려면 `npx tsc --ignoreConfig hello.ts --outDir out` `[실행]`
  - **함정 2 (`types: []`)**: `tsc --init` 결과는 `"types": []`라서 Node API를 쓰면 ``error TS2591: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.``가 난다(`import … from "node:fs"`도 같은 TS2591). 해결은 `npm i -D @types/node`(새 프로젝트에서 26.6.6이 설치됨)와 tsconfig의 `"types": ["node"]`. 생성된 `tsconfig.json`의 주석(`// For nodejs: … "types": ["node"] … and npm install -D @types/node`)도 같은 안내다 `[실행]`
  - **함정 3 (`verbatimModuleSyntax` + CommonJS)**: 같은 기본 설정에서 `package.json`에 `"type": "module"`이 없으면 `.ts` 파일의 `import`가 `error TS1295: ECMAScript imports and exports cannot be written in a CommonJS file under 'verbatimModuleSyntax'. …`로 막힌다. `npm pkg set type=module`(또는 `package.json`에 `"type": "module"` 추가)로 해결한다. 함정 2·3 조치 후 `npx tsc --noEmit`이 통과함(typescript 7.0.2 + @types/node 26.6.6 새 프로젝트) `[실행]`
- **Vite 8.3.5**, 요구 Node `^20.19.0 || >=22.12.0` | https://vite.dev/guide/ | 확인일 2026-11-01 `[레지스트리]`
- 프로젝트 생성: `npm create vite@latest <이름> -- --template vanilla-ts` (또는 `react-ts`). `create-vite` **9.3.3**이 제공하는 템플릿에 `vanilla`, `vanilla-ts`, `react`, `react-ts`, `react-compiler`, `react-compiler-ts` 등이 있음 | https://vite.dev/guide/#scaffolding-your-first-vite-project | 확인일 2026-11-01 `[레지스트리: create-vite 패키지 README·template-* 폴더]` `[실행]`(비대화 모드 실행으로 생성 확인. 대화형 질문은 아래 하위 항목)
  - `vanilla-ts` 템플릿: devDependencies `typescript ~7.0.2`, `vite ^8.3.5`, 스크립트 `dev`/`build`(`tsc && vite build`)/`preview`. `tsconfig`에 `erasableSyntaxOnly: true`, `allowArbitraryExtensions: true`, `verbatimModuleSyntax: true`, `noUnusedLocals: true`. **`enum`과 매개변수 속성(`constructor(public x)`)은 `error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.`로 막힌다** `[실행]`
  - **`create-vite` 9.3.3 대화형 질문**: 패키지 `dist/index.js` 원문에서 확인했다. 터미널(TTY)에서 실행하면 대화형이고 `--no-interactive`로 끌 수 있다. 화면 렌더링은 TTY가 필요해 실행하지 못했으므로 문구와 순서만 소스 기준이다 | https://vite.dev/guide/#scaffolding-your-first-vite-project | 확인일 2026-11-01 `[레지스트리: npm pack create-vite@9.3.3]`
    - ① 폴더 이름을 인자로 안 주면 `Project name:`
    - ② 대상 폴더가 비어 있지 않으면 `Target directory "<이름>" is not empty. Please choose how to proceed:` (현재 폴더 `.`이면 `Current directory is not empty. …`), 선택지 `Cancel operation` / `Remove existing files and continue` / **`Ignore files and continue`**
    - ③ 폴더 이름이 `package.json` 이름 규칙에 맞지 않으면 `Package name:` (틀리면 `Invalid package.json name`)
    - ④ `--template`을 안 주면 `Select a framework:` → `Select a variant:` (이름이 틀리면 `"<이름>" isn't a valid template. Please choose from below:`)
    - ⑤ React 템플릿(`react`, `react-ts`)이면 `Which linter to use?` — `Oxlint` / `ESLint`
    - ⑥ 마지막에 **`Install with npm and start now?`** (예/아니오). `--template`을 줘도 대화형이면 이 질문이 나온다. `예`면 의존성 설치 후 개발 서버를 바로 시작하고, `아니오`면 `Done. Now run:` 아래에 `cd <폴더>` / `npm install` / `npm run dev`를 보여 준다(마지막 출력은 비대화 실행에서 확인)
    - 옵션: `-t, --template`, `-i, --immediate`(설치 후 개발 서버 시작)/`--no-immediate`, `--eslint`/`--no-eslint`(React만), `--overwrite`(기존 파일 삭제), `--interactive`/`--no-interactive`
  - `react-ts` 템플릿: `react`/`react-dom` `^19.3.1`, `@vitejs/plugin-react ^6.1.2`, `@types/react ^19.3.0`, `@types/node ^24.19.2`, 린터는 ESLint가 아니라 **`oxlint`**, 스크립트 `lint`: `oxlint`, `build`: `tsc -b && vite build`
- **React 19.3.1**, react-dom 19.3.1 (`latest`) | https://react.dev/ | 확인일 2026-11-01 `[레지스트리]`
- **React Router 8.5.1** (패키지명 `react-router`, import도 `"react-router"`에서). `react-router-dom`은 7.18.5로 남아 있으나 교재는 쓰지 않음. 요구: Node `>=22.22.0`, 피어 `react`/`react-dom` `>=19.2.7` | https://reactrouter.com/ | 확인일 2026-11-01 `[레지스트리]`
  - 사용 방식(modes): Declarative(`<BrowserRouter>`), Data(`createBrowserRouter` + `RouterProvider`), Framework(Vite 플러그인 `@react-router/dev`). "라이브러리 모드"는 Framework가 아닌 Declarative/Data를 가리킨다. 설치는 `npm i react-router`, 진입점은 `<BrowserRouter>`로 `<App />`을 감싸는 것 | https://reactrouter.com/start/modes , https://reactrouter.com/start/declarative/installation | 확인일 2026-11-01 `[원문: remix-run/react-router docs/start/modes.md, docs/start/declarative/installation.md]`
- **Vitest 5.0.5** (`latest`; 5.1.0-beta.1은 베타라 사용 안 함), 요구 Node `^22.12.0 || ^24.0.0 || >=26.0.0`, 피어 vite `^6.4 || ^7 || ^8` | https://vitest.dev/ | 확인일 2026-11-01 `[레지스트리]`
- 테스트 라이브러리: `@testing-library/react` **16.3.3**(피어 `@testing-library/dom ^10`, `react` ^18/^19), `@testing-library/dom` **10.4.2**, `@testing-library/jest-dom` **7.0.1**(요구 Node ≥22), `@testing-library/user-event` **14.6.8**, `jsdom` **30.1.3** | https://testing-library.com/ | 확인일 2026-11-01 `[레지스트리]`
- SignalR 클라이언트 `@microsoft/signalr` **10.0.11**(`latest`) | https://www.npmjs.com/package/@microsoft/signalr | 확인일 2026-11-01 `[레지스트리]`

**교재 반영 결정**
- P2 TypeScript 입문은 `npm init -y` → `npm pkg set type=module` → `npm i -D typescript@7.0.2 @types/node` → `npx tsc --init`(+ `"types": ["node"]`)으로 시작하고, "파일 지정 컴파일은 `--ignoreConfig`", "`types: []`면 Node API 오류", "`type: module` 없으면 TS1295" 세 함정을 `:::warn`에 넣는다. Vite 템플릿에서는 `enum` 대신 유니온 타입을 쓰게 한다(`erasableSyntaxOnly`).
- `npm create vite@latest <이름> -- --template vanilla-ts`를 안내할 때는 마지막 질문 `Install with npm and start now?`에 대한 답(예 → 자동 설치·실행, 아니오 → `cd`/`npm install`/`npm run dev`)을 함께 적고, 폴더가 비어 있지 않을 때의 3지선다(`Ignore files and continue` 포함)를 `:::tip`으로 둔다.
- SP React는 `npm create vite@latest image-donation-web -- --template react-ts` 기반, 라우팅은 **Declarative 모드(`BrowserRouter`)** 로 단순하게 간다(Data 모드는 "더 알아보기"). 테스트는 Vitest 5 + Testing Library + jsdom 30 조합을 쓴다.

---

## 8. Rust · WebAssembly

- Windows에서 설치: `https://rustup.rs`(또는 `https://www.rust-lang.org/tools/install`)의 안내 링크 `https://win.rustup.rs/x86_64`로 `rustup-init.exe` 다운로드 | https://rustup.rs | 확인일 2026-11-01 `[원문: rustup.rs 페이지에 링크 표기]` (다운로드 호스트는 이 환경에서 차단되어 직접 받지는 못함). winget ID `Rustlang.Rustup`도 존재 | https://github.com/microsoft/winget-pkgs/tree/master/manifests/r/Rustlang/Rustup | 확인일 2026-11-01 `[원문]`
- **Visual Studio C++ 도구 자동 설치 흐름**: MSVC 링커가 없으면 `rustup-init`이 먼저 `# Rust Visual C++ prerequisites … Rust requires a linker and Windows API libraries but they don't seem to be available.`를 보여 주고 세 선택지를 묻는다. `1) Quick install via the Visual Studio Community installer (free for individuals, academic uses, and open source).` / `2) Manually install the prerequisites (for enterprise and advanced users).` / `3) Don't install the prerequisites (if you're targeting the GNU ABI).` 이후에 일반 설치 화면이 나옴. 1번은 Visual Studio Community를 설치하며 "개인·학술·오픈소스는 무료, 사내 독점 소프트웨어 등은 아님" | https://rust-lang.github.io/rustup/installation/windows-msvc.html | 확인일 2026-11-01 `[원문: rust-lang/rustup src/cli/self_update/windows.rs, doc/user-guide/src/installation/windows-msvc.md]`
- 수동/winget 설치 시 필요한 구성: "Desktop Development with C++" 워크로드(또는 개별 구성요소 `MSVC v143 … x64/x86 build tools (Latest)` + `Windows 11 SDK (10.0.22621.0)`), 언어 팩에 **English 추가 권장**. winget 예: `winget install --id Microsoft.VisualStudio.Community --source winget --force --override "--add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.Windows11SDK.22621 --addProductLang En-us"` (Build Tools 라이선스가 있으면 `Community`를 `BuildTools`로) | 위와 같은 문서 | 확인일 2026-11-01 `[원문]`
- Windows 기본 툴체인은 MSVC ABI(`x86_64-pc-windows-msvc`) | https://rust-lang.github.io/rustup/installation/windows.html | 확인일 2026-11-01 `[원문]`
- **Rust 안정 버전 1.99.1** (rustc 58cf8f9c3 2026-10-13, 채널 날짜 2026-10-15). 샌드박스는 1.97.0 | https://static.rust-lang.org/dist/channel-rust-stable.toml | 확인일 2026-11-01 `[레지스트리]` 확인 명령 `rustc --version`, `cargo --version`
- **wasm32 대상은 기본 설치에 없다. 빌드 전에 `rustup target add wasm32-unknown-unknown`을 한 번 실행해야 한다.** rustup 문서는 툴체인을 처음 설치하면 "it can already compile to that same target, because it comes with the target support for the host tuple preinstalled"라고 적는다. 즉 **호스트 대상만** 들어 있다. 격리된 새 환경에 `rustup toolchain install stable --profile minimal`(rustc 1.99.1)만 설치하고 `cargo build --target wasm32-unknown-unknown --release`를 실행하면 ``error[E0463]: can't find crate for `core` ``, ``note: the `wasm32-unknown-unknown` target may not be installed``, ``help: consider downloading the target with `rustup target add wasm32-unknown-unknown` ``로 실패했고, `rustup target add wasm32-unknown-unknown` 뒤에는 같은 빌드가 성공했다. 이 샌드박스의 기본 환경에는 이 대상이 미리 설치되어 있어 이 공백이 가려져 있었다. 설치 확인은 `rustup target list --installed` | https://rust-lang.github.io/rustup/cross-compilation.html | 확인일 2026-11-01 `[원문: rust-lang/rustup doc/user-guide/src/cross-compilation.md]` `[실행]`
- 크레이트 최신 버전: axum **0.8.9**(최소 Rust 1.80), tokio **1.54.1**(최소 1.85), serde **1.0.229**, serde_json **1.0.154**, sqlx **0.9.0**(최소 Rust **1.94.0**), tracing **0.1.44**, tracing-subscriber **0.3.23**, tower-http 0.7.1, reqwest 0.13.5, wasm-bindgen **0.2.130**(최소 1.81), web-sys/js-sys **0.3.107**, wasm-bindgen-futures **0.4.80**, console_error_panic_hook **0.1.7**, rand **0.10.3**, getrandom **0.4.3** | https://crates.io/ | 확인일 2026-11-01 `[레지스트리: cargo info/search]`
- **위 조합이 컴파일됨**: `axum = { version = "0.8.9", features = ["ws"] }`, `tokio = { version = "1.54.1", features = ["full"] }`, `serde = { version = "1.0.229", features = ["derive"] }`, `serde_json = "1.0.154"`, `sqlx = { version = "0.9.0", features = ["runtime-tokio", "sqlite", "postgres"] }`, `tracing = "0.1.44"`, `tracing-subscriber = "0.3.23"` (edition 2024, Rust 1.97.0과 새로 설치한 1.99.1 모두에서 `cargo check` 통과) `[실행]`
  - sqlx 0.9 기능 이름: 런타임 `runtime-tokio`, DB `sqlite`·`postgres`, TLS `tls-rustls`(= `tls-rustls-ring`) 등. 기본 기능에 `macros`, `migrate`, `json`, `any`가 포함 | `~/.cargo` 크레이트 `Cargo.toml` `[실행]`
- **Axum WebSocket 사용법**: Cargo 기능 이름은 **`ws`** (`axum = { version = "0.8.9", features = ["ws"] }`). 핸들러는 `WebSocketUpgrade`를 받아 `ws.on_upgrade(handle_socket)`을 반환하고, 라우트는 `any(handler)`로 등록(`GET` 업그레이드). 소켓은 `socket.recv().await` / `socket.send(Message::Text(t)).await`. 메시지 타입은 `Message::Text(Utf8Bytes)`. **0.8의 경로 매개변수 문법은 `/items/{id}`** (예전 `/:id`는 패닉) | https://docs.rs/axum/0.8.9/axum/extract/ws/index.html | 확인일 2026-11-01 `[원문: axum-0.8.9 크레이트 소스·CHANGELOG]` `[실행]`
- **wasm-bindgen / wasm-pack 관리 상태**:
  - wasm-bindgen은 `rustwasm` 조직 폐쇄(2025-09 보관 예정 공지)에 맞춰 **`github.com/wasm-bindgen/wasm-bindgen`** 조직으로 이전되어 새 유지보수자(daxpedda, guybedford; 이슈 #4533)가 관리 중이며 크레이트는 0.2.130 | https://blog.rust-lang.org/inside-rust/2025/07/21/sunsetting-the-rustwasm-github-org/ | 확인일 2026-11-01 `[검색요약]` , https://github.com/wasm-bindgen/wasm-bindgen | `[레지스트리]`
  - wasm-pack은 **`github.com/wasm-bindgen/wasm-pack`** 으로 옮겨졌고 크레이트 0.15.1이 현재 최신, 변경 기록에 최근 수정이 이어짐. 저장소는 보관(archived) 상태가 아님. 그러나 README는 "maintained by drager"(개인)라고 하고, **wasm-bindgen 팀은 "not maintained by us and maybe unmaintained, I believe we should not recommend it either way"(2025-09-11)** 라고 적었으며 wasm-pack 담당자는 **"I intend to maintain wasm-pack, but I only spend my limited free time on it currently"(2025-11-25)** 라고 답함. 대체 도구는 아직 확정되지 않음 | https://github.com/wasm-bindgen/wasm-bindgen/issues/4634 , https://github.com/wasm-bindgen/wasm-pack | 확인일 2026-11-01 `[검색요약]`(이슈 본문) `[원문]`(README·CHANGELOG)
  - 결론: wasm-pack은 **폐기(deprecated)된 도구가 아니다.** 저장소는 wasm-bindgen 조직 아래에 있고 보관되지 않았으며 0.15.1이 최근 릴리스이고, wasm-bindgen 가이드 예제에도 아직 `wasm-pack build --target web`이 남아 있다 | https://github.com/wasm-bindgen/wasm-bindgen/blob/main/guide/src/examples/without-a-bundler.md | 확인일 2026-11-01 `[원문]`. 그래도 교재가 쓰지 않는 이유는 두 가지다. ① 유지보수자가 개인 1명이고 본인이 "limited free time"이라고 밝혔다. ② wasm-bindgen 팀의 권장 여부가 정해지지 않았다(이슈 #4634가 열려 있고 대체 도구도 미정). 초보자가 따라 하는 교재는 이 두 불확실성의 영향을 덜 받는 `cargo` + `wasm-bindgen` CLI 조합이 안전하다는 설계 판단이다.
- **권장 도구와 빌드 흐름(실행 검증)**: `rustup target add wasm32-unknown-unknown`(위 항목, 필수) → `cargo build --target wasm32-unknown-unknown --release` 후 `wasm-bindgen --target web --out-dir pkg target/wasm32-unknown-unknown/release/<크레이트>.wasm`. CLI 설치는 `cargo install wasm-bindgen-cli --version 0.2.130`(**크레이트의 `wasm-bindgen` 버전과 정확히 같아야 함**; 이 샌드박스에서 컴파일 약 5분). 출력은 `<이름>.js`, `<이름>.d.ts`, `<이름>_bg.wasm`, `<이름>_bg.wasm.d.ts`. `Cargo.toml`에는 `crate-type = ["cdylib"]` | https://wasm-bindgen.github.io/wasm-bindgen/reference/deployment.html | 확인일 2026-11-01 `[원문: wasm-bindgen guide deployment.md]` `[실행]`
  - `--target` 값: `bundler`(기본, webpack 전제), `web`(번들러 없이 ES 모듈로 직접 로드), `nodejs`, `deno`, `no-modules`, `module`
  - 생성된 `init`은 `init()` 호출 가능, 객체 인자는 `init({ module_or_path })`이며 **`init(url)`처럼 값을 직접 넘기는 방식은 deprecated** 표기 `[실행]`
- **Vite에서 wasm 불러오기(실행 검증)**: `--target web` 출력(`pkg`)을 `src/wasm/`에 복사하고 `import init, { add, greet } from './wasm/hello_wasm.js'; await init();`. Vite 8.3.5 `vite build`가 `_bg.wasm`을 자산(21.5 kB)으로 내보내고 Chromium(Playwright)에서 `안녕, Vite! (from Rust) / add(2,3)=5`가 정상 출력, 콘솔 오류 0건. **개발 서버도 확인**: `npm run dev`와 같은 `vite` 개발 서버(`vite --port 5199`)로 띄운 페이지를 Chromium에서 열어도 같은 문구가 나오고 콘솔 오류 0건, `.wasm`은 `200 application/wasm`으로 서빙됨 `[실행]`. Vite 자체는 `.wasm` 직접 import(ESM 통합)와 `?init`도 지원 | https://vite.dev/guide/features.html#webassembly | 확인일 2026-11-01 `[원문: vitejs/vite docs/guide/features.md]` `[실행]`
- 무작위 수 빌드: `rand = "0.10.3"`(확장 트레이트 `rand::RngExt` 필요: `rand::rng().random_range(1..=6)`) + `getrandom = { version = "0.4.3", features = ["wasm_js"] }`로 `wasm32-unknown-unknown` 빌드가 성공하고, `--target web` 출력을 정적 서버(`python3 -m http.server`)로 서빙해 Chromium(Playwright)에서 `roll()`을 30번 호출하자 모두 1~6 범위에 6가지 값이 모두 나왔고 콘솔 오류 0건이었다 | https://docs.rs/getrandom | 확인일 2026-11-01 `[실행]`

**교재 반영 결정**
- P3는 **wasm-pack을 쓰지 않는다.** 순서는 `rustup target add wasm32-unknown-unknown`(필수, 기본 설치에 없음) → `cargo build --target wasm32-unknown-unknown --release` → `wasm-bindgen-cli`(0.2.130 고정) `--target web` → Vite import이다. 이유는 "폐기돼서"가 아니라 "유지보수자 1인 + 팀의 권고 미정"이라고 `:::info`에 한 줄로 쓴다.
- 첫 Rust Day의 설치 점검에 `rustup target list --installed`에 `wasm32-unknown-unknown`이 보이는지를 넣고, 빌드 오류 `E0463 can't find crate for core`를 "자주 막히는 곳"에 그대로 싣는다(해결: `rustup target add wasm32-unknown-unknown`).
- Rust는 `rustup`이 시키는 대로 설치(MSVC 자동 설치 1번)하고 `rustc --version`이 1.94 이상(sqlx 0.9 요구)인지 확인시킨다. 크레이트는 0.3절 고정표 버전을 `Cargo.toml`에 그대로 쓴다.

---

## 9. Docker Desktop과 PostgreSQL 이미지

- 요구 사항(WSL 2 백엔드, x86_64): **WSL 2.1.5 이상**, Windows 11 64비트는 **Enterprise·Pro·Education 23H2(빌드 22631) 이상**, 64비트 프로세서(SLAT 지원), **RAM 8 GB**, **BIOS/UEFI에서 하드웨어 가상화 활성화**, Windows의 WSL 2 기능 켜기, Windows Server 서비스(LanmanServer)가 자동 시작 | https://docs.docker.com/desktop/setup/install/windows-install/ | 확인일 2026-11-01 `[원문: docker/docs content/manuals/desktop/setup/install/windows-install.md]`
- **Windows 11 Home 지원 여부: 현행 공식 보증은 미확인(간접 근거만 있음)**
  - 현행 설치 문서의 Windows 11 요구 목록은 "Enterprise, Pro, or Education version 23H2 (build 22631) or higher"뿐이고 **Home이 없다**. 같은 문서의 별도 주의는 "Windows Home or Education editions only allow you to run Linux containers" | https://docs.docker.com/desktop/setup/install/windows-install/ | 확인일 2026-11-01 `[원문: docker/docs …/windows-install.md]`
  - 간접 근거(Home이 WSL 2 백엔드·Linux 컨테이너로 동작한다는 전제): 문제 해결 문서에 소제목 "WSL 2 and Windows Home"(필수 기능 Virtual Machine Platform, Windows Subsystem for Linux, BIOS 가상화, 시작 시 하이퍼바이저 활성화 나열) `[원문: docker/docs …/troubleshoot/topics.md]`, 과거 릴리스 노트 "Windows Home users will not be able to start Docker Desktop as WSL 2 is the only supported backend"(4.5.0)와 "If you are running Docker Desktop on Windows Home, installing 4.5.1 will switch it back to WSL 2 automatically" `[원문: docker/docs …/release-notes.md]`, Docker 블로그(2020-03-05) "Docker Desktop for WSL 2 Windows Home is a full version of Docker Desktop for Linux container development" | https://docs.docker.com/desktop/release-notes/ , https://www.docker.com/blog/docker-desktop-for-windows-home-is-here/ | 확인일 2026-11-01
  - WSL 2 자체는 에디션 제한이 없다: Microsoft WSL 설치 문서의 전제 조건은 "Windows 10 version 2004 and higher (Build 19041 and higher) or Windows 11"뿐이다 | https://learn.microsoft.com/en-us/windows/wsl/install | 확인일 2026-11-01 `[원문: MicrosoftDocs/WSL WSL/install.md]`
  - 현재 Docker Desktop 최신 릴리스는 4.97.0(2026-10-26)이다. 이 교재는 버전을 고정하지 않는다 | https://docs.docker.com/desktop/release-notes/ | 확인일 2026-11-01 `[원문]`
  - 결론: Home에서 WSL 2 + Linux 컨테이너로 동작해 왔다는 공식 자료는 있지만, **현행 요구 목록이 Home을 명시하지 않으므로 "지원된다"고 단정하지 않는다.** 안 되는 경우를 위해 Docker 없는 경로(아래)를 반드시 함께 둔다.
- **에디션·버전 확인 방법**: Windows 로고 키+R을 누르고 `winver`를 입력하는 방법은 Windows **버전·빌드** 확인법으로 Microsoft WSL 문서가 안내한다(Docker 요구 사항과 비교: 23H2/빌드 22631 이상). **에디션(Home/Pro)** 은 설정 → 시스템 → 정보의 "Windows 사양 → 에디션"에서 보는 것이 일반적이나, 이 화면을 설명하는 Microsoft 지원 문서를 열지 못해 출처는 미확인이다. 대안으로 PowerShell `(Get-CimInstance Win32_OperatingSystem).Caption`을 쓸 수 있다(`Caption`·`BuildNumber`는 Win32_OperatingSystem 공식 클래스 문서에 있는 속성이며, 출력 문자열 예시는 확인 못 함) | https://learn.microsoft.com/en-us/windows/wsl/compare-versions , https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-operatingsystem | 확인일 2026-11-01 `[원문: MicrosoftDocs/WSL compare-versions.md, MicrosoftDocs/win32 win32-operatingsystem.md]`
- **Docker 없는 경로: PostgreSQL을 Windows에 직접 설치** (공식 다운로드 페이지 `https://www.postgresql.org/download/windows/`는 이 환경에서 직접 열지 못해 `[검색요약]`과 winget 매니페스트로 확인)
  - 공식 안내: Windows 설치 프로그램은 **EDB가 제공**한다("hosted by EDB")고 PostgreSQL 다운로드 페이지가 설명한다 | https://www.postgresql.org/download/windows/ | 확인일 2026-11-01 `[검색요약]`
  - winget ID **`PostgreSQL.PostgreSQL.18`** (최신 매니페스트 `18.6-5`, 설치 파일 `postgresql-18.6-5-windows-x64.exe`를 `https://get.enterprisedb.com/postgresql/`에서 받음, `Scope: machine`이라 **관리자 권한 필요**, 라이선스 PostgreSQL License, 무인 설치 스위치 `--mode unattended`) | https://github.com/microsoft/winget-pkgs/tree/master/manifests/p/PostgreSQL/PostgreSQL/18 | 확인일 2026-11-01 `[원문]` 설치 명령 `winget install PostgreSQL.PostgreSQL.18`
  - 설치 마법사(EDB 문서): 슈퍼유저/관리자 권한 필요, 설치 폴더 선택, 구성 요소 선택(PostgreSQL Server, pgAdmin 4, Stack Builder, Command Line Tools), **슈퍼유저 비밀번호 입력**, **포트 입력(기본 5432)** 순서. Command Line Tools가 `psql` 등을 설치한다 | https://www.enterprisedb.com/docs/supported-open-source/postgresql/installing/windows/ | 확인일 2026-11-01 `[검색요약]`
  - 기본 포트 **5432**: PostgreSQL 공식 문서 "The TCP port the server listens on; 5432 by default." | https://www.postgresql.org/docs/current/runtime-config-connection.html | 확인일 2026-11-01 `[원문: postgres/postgres doc/src/sgml/config.sgml]`
  - `psql` 위치: 설치 프로그램은 **시스템 PATH를 기본적으로 바꾸지 않는다**. EDB 문서의 PATH 예시는 `C:\Program Files\postgresql\<메이저 버전>\bin`(문서 예: 15, 16)이므로 18 설치본은 `C:\Program Files\PostgreSQL\18\bin\psql.exe`일 것으로 **추정**한다. 교재는 PowerShell에서 `& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432`처럼 전체 경로로 안내하거나, 시작 메뉴의 SQL Shell(psql)을 쓰게 한다 | https://www.enterprisedb.com/docs/dev-guides/deploy/windows/ | 확인일 2026-11-01 `[검색요약]` (실제 설치 경로 대소문자·`18` 폴더명은 실기 미확인, 슈퍼유저 이름이 `postgres`라는 점도 EDB PostgreSQL 문서에서 직접 확인 못 함 → 미확인)
- WSL 확인·설치 명령: `wsl --version`, `wsl --install`, `wsl --update` | https://docs.docker.com/desktop/setup/install/windows-install/ | 확인일 2026-11-01 `[원문]`
- 설치 경로: 설치 파일 `Docker Desktop Installer.exe`(문서의 다운로드 링크), 설치 모드는 **per-user(기본·권장)** → `%LOCALAPPDATA%\Programs\DockerDesktop`, 관리자 권한 불필요. all-users는 `C:\Program Files\Docker\Docker`, 관리자 권한 필요. 명령행 설치 `"Docker Desktop Installer.exe" install --user`. 설정 화면의 백엔드 선택은 "**Use WSL 2 instead of Hyper-V**". 4.97 이후 버전은 Configuration 화면에 백엔드를 선택지로 보여 줌 | 위와 같은 문서 | 확인일 2026-11-01 `[원문]` winget ID **`Docker.DockerDesktop`**(매니페스트 존재) | https://github.com/microsoft/winget-pkgs/tree/master/manifests/d/Docker/DockerDesktop `[원문]`
- 개인 사용 무료 조건: Docker Desktop은 개인·교육·비상업 오픈소스·**직원 250명 미만 AND 연매출 1천만 달러 미만** 사업체에서 구독 없이 사용 가능. 직원 250명 초과 **또는** 연매출 1천만 달러 초과 기업의 상업적 사용은 유료 구독(Pro·Team·Business)이 필요. 설치 문서 상단 배너에도 같은 문구 | https://www.docker.com/legal/docker-subscription-service-agreement/ , https://docs.docker.com/desktop/setup/install/windows-install/ | 확인일 2026-11-01 `[검색요약]` `[원문]`
- PostgreSQL 공식 이미지 최신 **정식 주 버전은 18** (`postgres:18`, `latest`, `18.6`이 같은 다이제스트). `19rc1` 태그가 있으나 릴리스 후보라 쓰지 않음. 17.11, 16.15, 15.19, 14.24도 현재 유지 | https://hub.docker.com/_/postgres | 확인일 2026-11-01 `[레지스트리: Docker Hub API]`
- **PostgreSQL 18 이미지 함정**: PGDATA가 버전별 경로(`/var/lib/postgresql/18/docker`)로 바뀌었고 선언된 `VOLUME`이 **`/var/lib/postgresql`** 로 바뀜. 볼륨은 `/var/lib/postgresql`에 마운트해야 하고, 17 이하처럼 `/var/lib/postgresql/data`에 마운트하면 안 된다 | https://github.com/docker-library/docs/blob/master/postgres/content.md | 확인일 2026-11-01 `[원문]`

**교재 반영 결정**
- **Docker가 기본 경로**다. SP Day의 Compose는 `image: postgres:18`, 볼륨 마운트 `- pgdata:/var/lib/postgresql`로 쓰고, Docker Desktop 요구 사항(WSL 2 / 가상화 / 8 GB)을 사전 점검 체크리스트에 넣으며, 개인 학습은 무료임을 한 줄로 밝힌다.
- **Docker에 의존하는 모든 Day에 Docker 없는 경로를 함께 둔다**: PostgreSQL은 `winget install PostgreSQL.PostgreSQL.18`(관리자 권한 필요, 포트 5432, `psql` 전체 경로) 또는 EDB 설치 프로그램으로 직접 설치하고, 서버(ASP.NET Core·Rust)는 컨테이너 없이 `dotnet run`/`cargo run`으로 직접 실행하게 한다.
- Docker 설치 Day는 **에디션·버전 점검으로 시작**한다: Win+R `winver`로 버전·빌드(23H2/22631 이상), 설정 → 시스템 → 정보로 에디션(Home/Pro)을 확인시키고, Home이면 "Docker Desktop이 안 될 수 있으니 안 되면 Docker 없는 경로로 진행"을 `:::warn`으로 두되 지원 여부를 단정하는 문장은 쓰지 않는다.

---

## 10. 치지직(CHZZK) Open API

> 이 절은 가장 위험도가 높다. 공식 문서 호스트(`chzzk.gitbook.io`, `developers.chzzk.naver.com`)는 이 환경에서 직접 열리지 않았다. 모든 항목은 공식 문서 본문을 공식 호스트로 한정한 검색의 요약으로 확인(`[검색요약]`)했고, 비공식 SDK의 정리표와 일치하는 값만 `[교차]`로 표시했다. 공식 문서는 스스로 "가이드에 작성된 API 명세와 인증 플로우는 이후 개발 상황에 따라 변경 될 수 있습니다"라고 밝히므로, **SP Day 집필 전에 접속 가능한 환경에서 `https://chzzk.gitbook.io/chzzk/llms-full.txt`(문서 전체 텍스트)와 대조**해야 한다.

### 10.1 공식 문서·도메인

- 문서 허브: https://chzzk.gitbook.io/chzzk (About CHZZK Developers). 하위: Authorization `/chzzk-api/authorization`, Session `/chzzk-api/session`, Chat `/chzzk-api/chat`, User `/chzzk-api/user`, Channel `/chzzk-api/channel`, Live `/chzzk-api/live`, Category `/chzzk-api/category`, Drops `/chzzk-api/drops`, 참고사항 `/chzzk-api/tips`, 업데이트 `/introduction/updates` | 확인일 2026-11-01 `[검색요약]`
- Open API 도메인 `https://openapi.chzzk.naver.com`, 개발자 센터 `https://developers.chzzk.naver.com`, 인가 코드 요청 도메인 `https://chzzk.naver.com/account-interlock`(Open API와 **다른 도메인**) | https://chzzk.gitbook.io/chzzk/chzzk-api/authorization | 확인일 2026-11-01 `[검색요약]` `[교차]`
- 업데이트 이력: 2024.12 개발자 센터 런칭·Open API 제공, 2025.07 구독(SUBSCRIPTION) 이벤트·채팅 설정(저속 모드·이모티콘 모드) 추가, 2025.12 API Scope 신청 절차 간소화·최근 90일 사용량 0 앱 삭제 정책·`minFollowerMinute` 허용 값 확장, 2026.03 채팅 이벤트 `chatChannelId` 추가·채팅 숨기기·임시 제한 | https://chzzk.gitbook.io/chzzk/introduction/updates | 확인일 2026-11-01 `[검색요약]` (2025.12 항목의 정확한 날짜 표기는 검색 요약에서 확정하지 못함)

### 10.2 앱 등록·심사

- 앱 등록은 **개발자 센터**(`https://developers.chzzk.naver.com`)에서 "애플리케이션을 생성"하는 방식이고, 등록하면 **Client ID/Client Secret**이 발급됨. 등록 시 **로그인 리디렉션 URL**을 입력하고, 이후 인가 요청의 `redirectUri`가 이 값과 일치해야 함 | https://chzzk.gitbook.io/chzzk/chzzk-api/authorization , `/chzzk-api/tips` | 확인일 2026-11-01 `[검색요약]`
- 앱 ID·이름 제약: "애플리케이션 등록 시 ID 및 이름에 'chzzk', '치지직', 'naver', '네이버' 등 공식 서비스명이 포함될 수 없습니다. 또한, 부적절한 단어가 포함될 경우 애플리케이션이 정지될 수 있으니 유의해 주세요." | https://chzzk.gitbook.io/chzzk/chzzk-api/tips | 확인일 2026-11-01 `[검색요약]`
- 90일 미사용 삭제: "최근 90일간 API Scope 사용량이 0인 애플리케이션은 삭제됩니다." | 같은 문서 | 확인일 2026-11-01 `[검색요약]`
- Drops(드롭스) Scope만 "개발자 센터에 로그인된 사용자가 단체 ID로 법인 인증된 사용자"여야 신청 가능. 채팅·후원·구독 등 일반 Scope에 이런 조건은 문서에서 확인되지 않음 | https://chzzk.gitbook.io/chzzk/chzzk-api/drops | 확인일 2026-11-01 `[검색요약]`
- **미확인**: 일반 Scope의 승인(심사) 소요 시간·승인 기준, 개발자 센터 화면의 정확한 메뉴 이름과 Scope 선택 화면, `http://localhost` 리디렉션 URL 허용 여부(비공식 도구는 `http://localhost:8080/callback`을 예시로 사용 `[교차]`). 대안: SP Day는 승인을 기다리지 않아도 진행되도록 **테스트 모드(가짜 후원 이벤트)** 를 기본 경로로 두고, 실제 CHZZK 연동은 "선택 실습"으로 분리.

### 10.3 OAuth (사용자 인증)

- 인가 코드 요청(브라우저 이동): `GET https://chzzk.naver.com/account-interlock?clientId={clientId}&redirectUri={redirectUri}&state={state}`. 파라미터 3개 모두 필수. 인증이 끝나면 `redirectUri`로 `code`와 `state`가 전달됨. **`scope` 파라미터는 없고** Scope는 개발자 센터 앱 설정에서 관리 | https://chzzk.gitbook.io/chzzk/chzzk-api/authorization | 확인일 2026-11-01 `[검색요약]` `[교차]`
- 토큰 발급: `POST https://openapi.chzzk.naver.com/auth/v1/token`, JSON 본문 `{"grantType":"authorization_code","clientId":…,"clientSecret":…,"code":…,"state":…}`. 응답은 `accessToken`, `refreshToken`, `tokenType`("Bearer" 고정), `expiresIn`(예시 86400) | 같은 문서 | 확인일 2026-11-01 `[검색요약]` `[교차]` (비공식 구현은 본문 필드명이 위와 같음 `[교차]`; `expiresIn`은 문서에 문자열로 적혀 있으나 실측은 숫자라는 보고가 있어 두 형태 모두 받도록 구현)
- 토큰 갱신: 같은 경로에 `{"grantType":"refresh_token","refreshToken":…,"clientId":…,"clientSecret":…}` | 같은 문서 | 확인일 2026-11-01 `[검색요약]` `[교차]`
- 토큰 폐기: `POST /auth/v1/token/revoke`, 본문 `{"clientId","clientSecret","token","tokenTypeHint":"access_token"|"refresh_token"}` | 같은 문서 | 확인일 2026-11-01 `[검색요약]` `[교차]` (비공식 보고에 `/auth/v1/revoke`로 동작했다는 관찰이 있으나 문서 경로를 따른다)
- 만료: "Access Token 의 만료기간은 1일, Refresh Token 의 만료기간은 30일 입니다." **Refresh Token은 일회용**(갱신 때마다 새 refresh token을 저장해야 함) | https://chzzk.gitbook.io/chzzk/chzzk-api/authorization , `/chzzk-api/tips` | 확인일 2026-11-01 `[검색요약]`
- 호출 방식 두 가지: **Access Token 인증** → `Authorization: Bearer {accessToken}`(Bearer와 토큰 사이 **공백을 빠뜨리지 않도록** 문서가 주의), **Client 인증** → `Client-Id: {clientId}` + `Client-Secret: {clientSecret}`. 두 경우 모두 `Content-Type: application/json` | https://chzzk.gitbook.io/chzzk/chzzk-api/tips | 확인일 2026-11-01 `[검색요약]` `[교차]`
- 응답 공통 형식: 성공 `{ "code": 200, "message": null, "content": {…} }`, 실패 `{ "code": <int>, "message": <string> }`. 오류: 400 요청 파라미터 오류, 401 `UNAUTHORIZED`/`INVALID_CLIENT`/`INVALID_TOKEN`, 403 `FORBIDDEN`(권한·Scope), 404 `NOT_FOUND`, 429 `TOO_MANY_REQUESTS`(Quota 초과), 500 `INTERNAL_SERVER_ERROR` | https://chzzk.gitbook.io/chzzk/chzzk-api/tips | 확인일 2026-11-01 `[교차]` (공식 문서 직접 대조 필요). **Quota의 구체적 수치는 미확인**

### 10.4 스코프 목록

문서에서 확인된 Scope 이름(한국어): **유저 정보 조회**(`GET /open/v1/users/me`), **채널 관리자 조회**, **채널 팔로워 조회**, **채널 구독자 조회**, **방송 스트림키 조회**, **방송 설정 조회**, **방송 설정 변경**, **채팅 메시지 조회**(채팅 이벤트 구독), **채팅 메시지 쓰기**(`POST /open/v1/chats/send`, 숨기기), **채팅 공지 쓰기**, **채팅 설정 조회**, **채팅 설정 변경**, **후원 조회**(후원 이벤트 구독), **구독 조회**(구독 이벤트 구독), **활동제한 조회**, **활동제한 쓰기**, 드롭스 Scope | https://chzzk.gitbook.io/chzzk/chzzk-api/user , `/session`, `/chat`, `/channel`, `/live` | 확인일 2026-11-01 `[검색요약]` `[교차]` (채널 정보 조회·카테고리·라이브 목록 API는 Client 인증만 필요). SP에 필요한 최소 Scope는 **후원 조회**(+ 로그인 확인용 **유저 정보 조회**, 선택으로 **채팅 메시지 쓰기**)

### 10.5 세션 생성·이벤트 구독

- 세션 생성(클라이언트): `GET /open/v1/sessions/auth/client` — Client 인증, 응답 `url`(소켓 연결용, 일정 시간 동안만 유효), **클라이언트당 최대 10개 연결**
- 세션 생성(유저): `GET /open/v1/sessions/auth` — Access Token 인증, 응답 `url`, 해당 세션은 **생성에 쓴 Access Token의 유저 이벤트만** 구독 가능, **유저당 최대 3개 연결**
- 세션 목록: 유저 `GET /open/v1/sessions`, 클라이언트 `GET /open/v1/sessions/client`
- 이벤트 구독/취소(6개 경로): `POST /open/v1/sessions/events/subscribe/{chat|donation|subscription}` 및 `…/unsubscribe/{…}`, **요청 파라미터(쿼리) `sessionKey`**, Access Token 인증. 후원 구독은 Scope "후원 조회" 필요. "세션당 최대 30개의 이벤트(채팅, 후원, 구독)를 구독할 수 있습니다." 구독 완료 여부는 HTTP 응답이 아니라 **세션으로 오는 `SYSTEM`(`subscribed`) 메시지**로 알려 줌
- 연결 흐름: 소켓 연결이 끝나면 세션으로 연결 완료 메시지(`SYSTEM`/`connected`, `data.sessionKey`)가 오고, 그 `sessionKey`로 구독 API를 호출한다.
- 비공식 실측: 클라이언트 인증으로 만든 세션에 **유저 Access Token으로 구독**하는 조합이 동작(다중 채널 봇의 표준 패턴) `[교차]`. 라이브 방송 중이 아니어도 세션 생성·구독·채팅 수신이 동작 `[교차]`.

위 항목 출처 | https://chzzk.gitbook.io/chzzk/chzzk-api/session | 확인일 2026-11-01 `[검색요약]` `[교차]`

### 10.6 소켓 프로토콜 버전

- 공식 문서 문구(검색 요약 인용): "Socket.IO-client 1.0.0+ 2.0.3 버전까지 지원합니다."(비공식 표는 "1.0.0+ ~ 2.0.3"로 표기). 즉 **Socket.IO 2.x 서버 계열 = Engine.IO 프로토콜 v3(EIO=3)** | https://chzzk.gitbook.io/chzzk/chzzk-api/session | 확인일 2026-11-01 `[검색요약]` `[교차]` — 문서에는 "v4 클라이언트는 비호환 가능"이라는 직접 문구는 확인하지 못했고, 지원 상한이 2.0.3이라는 것만 확인됨
- 연결 URL 형식: `https://ssio{NN}.nchat.naver.com:443?auth={토큰}` (문서 예시 `https://ssio08.nchat.naver.com:443?auth=TOKEN`). 권장 옵션: `reconnection: false`, `'force new connection': true`, `'connect timeout': 3000`, `transports: ['websocket']`. 연결되면 `connect` 핸들러 호출 `[검색요약]`
- 실측(비공식): 핸드셰이크는 `GET {origin}/socket.io/?EIO=3&transport=polling&auth=…`로 성공해 `sid`와 `upgrades:["websocket"]`를 받음. 서버 ping 타임아웃은 약 85초 `[교차]`
- 이벤트 이름: `SYSTEM`, `CHAT`, `DONATION`, `SUBSCRIPTION`. 페이로드는 비공식 자료에서 **JSON 문자열**로 전달된다고 보고된다(`JSON.parse` 필요) `[교차]`. 공식 문서 원문과는 이 점을 직접 대조하지 못했으므로, 구현은 **문자열이면 JSON으로 파싱하고, 이미 객체이면 그대로 쓰는 관대한 파서**로 한다(`payAmount`가 문자열이든 숫자든 받는 것과 같은 이유). 이 조사의 로컬 에뮬레이터는 두 형태를 모두 보내 클라이언트 코드가 둘 다 처리함을 확인했지만(부록 C), 이것은 CHZZK 실서버 동작의 증거가 아니다.
- SYSTEM 메시지: `{ type, data }`, `type`은 `connected`(`{sessionKey}`), `subscribed`/`unsubscribed`/`revoked`(`{eventType, channelId}`; `revoked`는 동의 철회·스코프 변경 등 권한 회수) | 위와 같은 문서 | 확인일 2026-11-01 `[검색요약]` `[교차]`

### 10.7 후원 이벤트(DONATION) 페이로드

| 필드 | 타입 | 설명 |
| :-- | :-- | :-- |
| `donationType` | String | `CHAT` 또는 `VIDEO` |
| `channelId` | String | 이벤트 채널 ID |
| `donatorChannelId` | String | 후원자 채널 ID |
| `donatorNickname` | String | 후원자 닉네임 |
| `payAmount` | **String** | 후원 금액(원 단위). 문서 표기는 문자열 |
| `donationText` | String | 후원 메시지 |
| `emojis` | Map | `{이모티콘 식별자: 이모티콘 URL}`. 이모티콘이 없으면 `{}`로 옴 |

출처 | https://chzzk.gitbook.io/chzzk/chzzk-api/session | 확인일 2026-11-01 `[검색요약]` `[교차]`. `payAmount`가 실제로 문자열인지는 비공식 검증표에서도 "미검증"으로 남아 있어 **숫자/문자열 모두 받는 파서**로 구현한다. 비공식 SDK 문서는 "공식 API에서는 미션 후원을 수신받을 수 없다"고 보고하므로 DONATION의 `donationType`은 `CHAT`/`VIDEO` 두 종류만 가정한다(**미확인**: 공식 문서에서 미션 후원 미지원을 직접 명시한 문장은 확인 못 함).

### 10.8 채팅 전송 API

- `POST /open/v1/chats/send`, Access Token 인증, Scope **채팅 메시지 쓰기**, 본문 `{"message":"…"}`, "메시지 내용은 최대 100자로 제한", 응답 `messageId` | https://chzzk.gitbook.io/chzzk/chzzk-api/chat | 확인일 2026-11-01 `[검색요약]` `[교차]`
- 채팅 공지 등록 `POST /open/v1/chats/notice`(Scope 채팅 공지 쓰기, 최대 100자), 채팅 설정 조회/변경 `GET`/`PUT /open/v1/chats/settings`, 채팅 숨기기 `POST /open/v1/chats/blind-message`(2026.03 추가) | 같은 문서 | 확인일 2026-11-01 `[검색요약]` `[교차]`
- **미확인**: 전송 횟수 제한(rate limit) 수치

### 10.9 이용 약관상 제약

- 공식 문서에서 확인된 제약: 앱 이름에 공식 서비스명 금지(10.2), 90일 미사용 앱 삭제(10.2), Drops 법인 한정(10.2), 429 Quota 제한 존재(10.3)
- **미확인**: 개발자 센터 이용 약관의 조항(후원 데이터의 저장·재가공·재배포 제한, 상업적 이용, 사용자 동의 요건). 약관 페이지 자체를 이 환경에서 열지 못함. 대안: SP는 **결제를 다루지 않고, 후원 이벤트를 화면 표시용으로만 처리하며, 영속 저장은 하지 않는다**는 보수적 설계를 기본으로 하고, 앱 등록 시 보게 되는 약관을 독자가 직접 읽도록 안내한다. Client Secret·Access Token은 서버에만 두고 브라우저에 노출하지 않는다 `[교차: 비공식 SDK 경고, 공식 문서가 요구하는 것은 아님]`.

### 10.10 문서와 실제 응답 불일치(비공식 실측, 참고)

`WisdomIT/chzzk-open-sdk`의 검증표(2026-07-22 실측)는 다음을 보고한다 `[교차]`: `expiresIn`은 문서(String)와 달리 number(86400), CHAT 이벤트의 `userRoleCode`는 최상위가 아니라 `profile` 안, 응답에 문서에 없는 `page`/`totalCount`/`totalPages` 메타가 있음, 세션 목록의 `disconnectedDate`는 연결 중인 세션에는 필드가 없음. SP는 DONATION만 쓰므로 영향은 `payAmount`·`expiresIn` 두 곳이다.

**교재 반영 결정**
- SP의 CHZZK 연동은 "유저 로그인(account-interlock) → 서버가 토큰 발급·보관 → `GET /open/v1/sessions/auth`로 URL 획득 → **EIO=3 소켓 연결** → `SYSTEM connected`의 `sessionKey`로 `subscribe/donation` 호출 → `DONATION` 수신 → SignalR로 오버레이에 중계" 순서로 쓴다. Scope는 후원 조회·유저 정보 조회만 요청한다. 이 소켓 흐름은 **로컬 에뮬레이터에서만 검증했고 실서버 연결은 미확인**이므로, 실제 CHZZK 연동은 선택 실습에서 확인시키고 실패하면 브라우저/Node 중계 대안으로 간다(11절).
- 승인·약관 불확실성(10.2, 10.9)이 남으므로 SP 전체 흐름은 **테스트 모드(가짜 DONATION 이벤트)** 로 완결되게 하고, 실제 CHZZK 연동 Day는 "선택·계정 필요"로 분리한다. 토큰 수명(1일/30일, 일회용 refresh)과 문서 변경 가능성을 `:::warn`에 쓴다.

---

## 11. .NET용 Socket.IO 클라이언트 (EIO v3)

- 선택 패키지 **`SocketIOClient` 4.0.5** (NuGet, 작성자 doghappy, 라이선스 **MIT**, 2026-07-24). README가 "supports socket.io server v2/v3/v4"라고 밝히며, 옵션 표에 "`EIO` — Default `V4` — For Socket.IO server v2.x, please set EIO = 3."이라고 적음. 의존성: `SocketIOClient.Common` 4.0.0, `SocketIOClient.Serializer` 4.0.0.1, `Microsoft.Extensions.*` 10.0.3, `System.Text.Json` 10.0.3. 대상 프레임워크 net8.0과 netstandard2.0 | https://www.nuget.org/packages/SocketIOClient/4.0.5 , https://github.com/doghappy/socket.io-client-csharp | 확인일 2026-11-01 `[레지스트리]` `[원문]`
- **EIO=3은 Socket.IO 2.x 서버 계열이다. 이 패키지는 EIO=3을 지원한다(README 명시 + 실행 확인).** 로컬 Socket.IO 2.5.0 서버(EIO=3, 서버가 `?EIO=3`을 확인)에 `SocketIOClient 4.0.5`를 `EIO = EngineIO.V3`, `Transport = TransportProtocol.WebSocket`으로 연결하자 연결 성공, `SYSTEM`·`DONATION` 이벤트를 수신했다(페이로드가 JSON 문자열일 때와 이미 객체일 때 모두 처리 확인) `[실행]`. **CHZZK 실서버와의 연결은 계정·네트워크가 없어 확인하지 못함(미확인).** 비공식 SDK는 실서버에서 EIO=3 프로토콜 흐름(`40` 네임스페이스 연결 → `42["SYSTEM",…]`)이 동작함을 보고했다 `[교차]`.
- 옵션·네임스페이스 (실행 확인):
  - 네임스페이스 `using SocketIOClient;` + **`using SocketIOClient.Common;`** (`EngineIO`, `TransportProtocol`은 `SocketIOClient.Common` 안에 있음. `SocketIOClient.Transport`라는 네임스페이스는 **없음** → CS0234)
  - `new SocketIO(Uri, SocketIOOptions)`, 옵션: `EIO = EngineIO.V3`, `Transport = TransportProtocol.WebSocket`, `Reconnection = false`, `ConnectionTimeout = TimeSpan.FromSeconds(3)`, `Query = new NameValueCollection { ["auth"] = token }`
  - 이벤트: `client.On("DONATION", ctx => … ctx.GetValue<JsonElement>(0) …)`로 받고 `ValueKind`가 `String`이면 `JsonDocument.Parse(el.GetString()!)`, `Object`이면 그대로 쓴다(두 형태 모두 실행 확인). `payAmount`는 `Number`/`String` 모두 `decimal`로 변환. `ctx.RawText` = `["SYSTEM","{\"type\":\"connected\",…}"]`, 연결 이벤트 `client.OnConnected`, 시작 `await client.ConnectAsync()`, 종료 `await client.DisconnectAsync()`
  - README: `Auth` 옵션은 **EIO=3에서 지원 안 됨** → 인증 토큰은 `Auth`가 아니라 `Query["auth"]`로 보낸다
  - **함정(실행 확인)**: CHZZK가 주는 URL처럼 `Uri`에 쿼리(`/?auth=…`)를 붙여 `new SocketIO(uri, opts)`를 만들면 **쿼리가 서버로 전달되지 않는다**(서버가 `auth=undefined`로 받음). URL을 분해해 origin만 `Uri`에 넣고 `auth` 값을 `Query`에 넣어야 한다.
- 대안(중계): 공식 문서의 지원 상한에 맞춘 **`socket.io-client@2.0.3`** (npm에 존재, 의존성 engine.io-client ~3.1.0). `2.5.0`도 npm `v2-latest`이고 EIO=3(engine.io-client ~3.5.0). 최신 4.8.4(`latest`)는 공식 지원 범위 밖이므로 사용하지 않음 | https://www.npmjs.com/package/socket.io-client | 확인일 2026-11-01 `[레지스트리]`. 다른 대안으로 비공식 SDK는 **의존성 없는 자체 EIO=3 클라이언트**(WebSocket 우선, 폴링 폴백)를 구현해 실서버 e2e를 통과했다고 보고 `[교차]`.

**교재 반영 결정**
- SP 백엔드(C#)는 **`SocketIOClient 4.0.5` + `EIO = V3` + `Transport = WebSocket` + `Query["auth"]`** 로 CHZZK에 연결하는 코드를 쓴다. **로컬 에뮬레이터에서 검증했고 실서버 연결은 미확인**이므로, 실서버 연결은 선택 실습에서 확인시키고 실패하면 브라우저 중계 대안으로 간다. 코드는 위 함정 세 가지(네임스페이스, `Auth` 미지원, URL 쿼리 분해)와 문자열/객체 모두 받는 파서를 반영한다.
- 실서버 연결이 막힐 때를 위해 "Node 또는 브라우저 `socket.io-client@2.0.3` 중계"를 `:::info`에 최소 코드와 함께 소개한다. 테스트 모드 수신기는 로컬 `socket.io@2.5.0` 에뮬레이터(부록 C)로 같은 코드 경로를 검증한다.

---

## 12. 이미지 처리 라이브러리

| 항목 | SixLabors.ImageSharp 4.1.3 | SkiaSharp 4.154.0 | Magick.NET (Q8-AnyCPU) 15.0.0 |
| :-- | :-- | :-- | :-- |
| 라이선스 | **Six Labors Split License 1.0**: 오픈소스/소스 공개 소프트웨어, 전이 의존성, **연 매출 100만 달러 미만 영리 개인·회사**, 비영리는 **Apache-2.0**. 그 외는 유료 상용 라이선스 | **MIT** (`SkiaSharp`, `SkiaSharp.NativeAssets.Linux.NoDependencies` 모두) | **Apache-2.0** |
| 빌드 시 라이선스 키 | **필요(3.2.0+·4.0.0+)**. 키가 없으면 Debug는 경고, **Release는 빌드 오류** `[실행]` | 없음(패키지에 빌드 확인 단계가 없음) `[레지스트리]` | (확인 안 함) |
| 네이티브 바이너리 | 없음(100% 관리 코드) | 필요. net10.0의 `SkiaSharp`가 `SkiaSharp.NativeAssets.Win32`·`.macOS`를 **자동 의존성**으로 받음(Windows는 추가 설치 없음). Linux는 `SkiaSharp.NativeAssets.Linux.NoDependencies`(의존성 없음)를 직접 참조 `[레지스트리]` `[실행]` | 필요(ImageMagick 네이티브, 용량 큼) |
| 매직 넘버(헤더) 기반 형식 판별 | `Image.DetectFormat(bytes)`, `Image.Identify(bytes)` — 확장자를 보지 않고 헤더로 판별. 이미지가 아니면 `UnknownImageFormatException` | `SKCodec.Create(SKData)` → 이미지가 아니면 `null`(텍스트·"`FF D8 FF`+쓰레기" 모두 `null`), `codec.EncodedFormat`·`codec.Info`(폭·높이)를 디코딩 전에 읽음 `[실행]` | `MagickFormatInfo`로 판별(미실행 확인) |
| EXIF 제거 | `image.Metadata.ExifProfile = null` 후 재인코딩 → 출력에 EXIF 없음 | 재인코딩은 픽셀만 씀 → 출력에 `Exif`·`ICCP` 조각 없음(색 공간 없는 비트맵으로 인코딩). EXIF 방향은 `codec.EncodedOrigin`으로 읽고 직접 회전 `[실행]` | `Strip()`(미실행 확인) |
| WebP 인코딩 | `WebpEncoder { Quality = 80 }` 내장 | `SKImage.Encode(SKEncodedImageFormat.Webp, 80)` → `RIFF…WEBPVP8` `[실행]`. JPEG·PNG도 인코딩, **GIF 인코딩은 `null`(미지원)** `[실행]` | 지원(미실행 확인) |
| 확인일 / 출처 | NuGet nuspec·LICENSE·`[실행]` | NuGet nuspec·`[실행]` | NuGet nuspec |

- **ImageSharp 빌드 시 라이선스 키 강제** | https://docs.sixlabors.com/articles/imagesharp/index.html | 확인일 2026-11-01 `[원문: SixLabors/docs articles/imagesharp/index.md]` `[실행]`: 문서 원문 "Projects that directly reference ImageSharp require a valid Six Labors license key at build time from version 3.2.0 in the previous major and 4.0.0 in the current major. Enforcement applies to direct dependencies only." 패키지의 `build/SixLabors.ImageSharp.targets`(`SixLabors_ValidateLicense`, `CoreCompile` 전에 실행)가 확인한다. 4.1.3을 직접 참조한 프로젝트를 키 없이 빌드하면 Debug는 `warning : No Six Labors license found. This Debug build can continue, but Release builds require a valid license.`, **`dotnet build -c Release`와 Docker의 `dotnet publish -c Release`는 `error : No Six Labors license found. Set $(SixLaborsLicenseKey), set $(SixLaborsLicenseFile), or add a 'sixlabors.lic' file to the project/workspace.`로 실패**했다(SDK 10.0.114). 3.1.12 패키지에는 이 `.targets`가 없다 `[레지스트리]`.
- ImageSharp 실행 확인 내용(`[실행]`, 비교용으로 남김): EXIF(`Software`, `Make`)를 넣은 JPEG(839바이트, 매직 `FF-D8-FF`) 생성 → `Image.DetectFormat` = `JPEG (image/jpeg)` → `Image.Identify` = 120x80, EXIF 있음 → HTML 텍스트를 넣으면 `UnknownImageFormatException` → `AutoOrient()` + `ExifProfile = null` + `IccProfile = null` → WebP 인코딩 100바이트, 헤더 `RIFF…WEBP` → 다시 읽으면 EXIF 없음. 4.x에는 `new Image<Rgba32>(width, height, Color)` 생성자가 없다(CS1503).
- **SkiaSharp 4.154.0 실행 확인 내용**(`[실행]`, Linux x64 SDK 10.0.114 + Docker `mcr.microsoft.com/dotnet/aspnet:10.0` Release 이미지, SP 레퍼런스 `ImageProcessor`와 테스트):
  - 패키지 그래프: `SkiaSharp` net10.0 의존성 = `SkiaSharp.NativeAssets.macOS`·`SkiaSharp.NativeAssets.Win32` 4.154.0. `dotnet publish -c Release` 결과에 `runtimes/win-x64/native/libSkiaSharp.dll`(+win-x86, win-arm64)과 `runtimes/linux-x64/native/libSkiaSharp.so`(Linux 패키지에서)가 들어감. Release 빌드 경고 0 `[레지스트리]` `[실행]`. Windows에서 실제 실행은 미확인.
  - 디코딩: `codec.GetPixels(info, bitmap.GetPixels(), new SKCodecOptions(0))` → 3장면 GIF(`codec.FrameCount` = 3)의 **첫 장면만** 디코딩. 정지 WebP는 `FrameCount`가 **0**으로 나온다(1이 아님).
  - EXIF 방향: APP1 EXIF(Orientation=6)를 넣은 JPEG에서 `codec.EncodedOrigin` = `RightTop`. 디코딩은 방향을 적용하지 않으므로 `SKCanvas`의 `Translate`/`RotateDegrees`/`Scale`로 직접 돌려야 한다(200×100 → 100×200, 왼쪽이 위로).
  - 리사이즈: `SKBitmap.Resize(SKImageInfo, new SKSamplingOptions(SKCubicResampler.Mitchell))` 2000×1000 → 1280×640.
  - API 변경 주의: `SKCanvas.DrawBitmap(bitmap, x, y)`(샘플링 옵션 없는 오버로드)는 **CS0618 obsolete** → `DrawBitmap(bitmap, x, y, SKSamplingOptions.Default, null)`.
  - Docker `aspnet:10.0`(Debian 기반)에서 `NativeAssets.Linux.NoDependencies`의 `libSkiaSharp.so`가 추가 패키지 설치 없이 로드되고 업로드 이미지를 WebP로 변환함.
- 출처: https://github.com/SixLabors/ImageSharp/blob/main/LICENSE , https://www.nuget.org/packages/SixLabors.ImageSharp/4.1.3 , https://www.nuget.org/packages/SkiaSharp/4.154.0 , https://www.nuget.org/packages/SkiaSharp.NativeAssets.Linux.NoDependencies/4.154.0 , https://www.nuget.org/packages/Magick.NET-Q8-AnyCPU/15.0.0 | 확인일 2026-11-01 `[원문]` `[레지스트리]`
- 일반 파일 시그니처(표준): JPEG `FF D8 FF`, PNG `89 50 4E 47 0D 0A 1A 0A`, GIF `47 49 46 38`("GIF8"), WebP `52 49 46 46 …(4바이트 크기)… 57 45 42 50`("RIFF"+크기+"WEBP"). 네 형식 모두 SP 레퍼런스 테스트에서 확인

**선택: SkiaSharp 4.154.0 + SkiaSharp.NativeAssets.Linux.NoDependencies 4.154.0** (Ruling R28, 처음 선택이던 ImageSharp 4.1.3을 바꿈)
- 이유: ① **MIT**라 학습자가 나중에 회사를 차려도 매출 기준 상용 라이선스가 걸리지 않음, ② **빌드 시 라이선스 키 단계가 없음**: ImageSharp 3.2+/4.x는 키 없이 Release·Docker 빌드가 실패해서 0% 초보자가 막히는 지점이 됨, ③ 판별(`SKCodec`)·첫 장면 디코딩·EXIF 방향·리사이즈·WebP 인코딩을 모두 실행으로 확인, ④ Windows는 패키지 하나로 네이티브까지 자동, Docker는 Linux 네이티브 패키지 하나만 추가.
- 비용: 네이티브 라이브러리를 쓰므로 `SKData`·`SKCodec`·`SKBitmap`·`SKImage`·`SKCanvas`를 `using`으로 해제해야 하고, EXIF 방향 적용을 직접 코드로 써야 한다(ImageSharp의 `AutoOrient` 같은 한 줄이 없음).

**교재 반영 결정**
- SP 업로드 파이프라인은 "크기 제한 → 매직 넘버 → `SKCodec.Create`(형식·폭·높이 검사, 이미지가 아니면 null) → 첫 장면 디코딩(`SKCodecOptions(0)`, 움직이는 GIF는 첫 장면만) → 긴 변 1280px 리사이즈 → EXIF 방향(`EncodedOrigin`)을 캔버스로 적용 → 색 공간 없는 비트맵을 WebP(품질 80)로 재인코딩해 메타데이터 제거" 순서로 쓰고, 확장자·`Content-Type`을 믿지 않는 이유와 네이티브 객체를 `using`으로 해제하는 습관을 설명한다.
- 라이브러리 선택 Day에 "ImageSharp 3.2+/4.x는 빌드 시 라이선스 키가 필요하고 Split License라 매출 기준이 있다 → 이 교재는 MIT인 SkiaSharp을 쓴다"를 `:::info`로 한 번 설명한다. 테스트용 GIF는 SkiaSharp이 GIF를 저장하지 못하므로 바이트로 직접 만든다.

---

## 13. 배포 옵션 (작성 시점 기준 2026-11)

| 대상 | 1순위(무료/저가) | 카드 등록 | 주요 제약 | 대안 |
| :-- | :-- | :-- | :-- | :-- |
| 정적 사이트(P1) | **GitHub Pages** | 공개 저장소·Free 플랜은 별도 과금 항목 없음. 가입 시 카드 요구 여부는 문서에서 확인 못 함(미확인, 일반적으로 불필요) | 공개 저장소만(Free), 월 100 GB 소프트 대역폭, 사이트 1 GB, 상용 거래·SaaS 목적 불가 | **Cloudflare Pages**: 무료 플랜 월 500 빌드, 사이트당 20,000 파일, 빌드 20분 제한. 카드 필요 여부·대역폭 한도는 미확인 |
| ASP.NET Core 앱(P2) | **Azure App Service 무료(F1)** | **필요**: Azure 무료 계정은 신원 확인용 카드와 전화 인증이 필요(과금 없이 보류 승인만) | 하루 CPU 60분, 스토리지 1 GB, 사용자 지정 도메인 불가(`azurewebsites.net`만), Always On 불가, SLA 없음·프로덕션 용도 비지원. SQLite 파일 영속성은 미확인 | **Render 무료 웹 서비스(Docker)**: 아래 행 참고. 파일시스템 휘발이라 SQLite 파일 보존 불가 |
| Docker 컨테이너(P3 Rust 서버, SP) | **Render 무료 인스턴스** | 공식 문서에서 "카드 불필요" 문장은 확인 못 함(블로그에만 있음 → **미확인**, 가입 시 확인) | 15분 무트래픽이면 **슬립**, 재기동 약 1분, **디스크 휘발**(영속 디스크 불가), 월 750 인스턴스 시간, 단일 인스턴스, SMTP 25/465/587 차단. 무료 Postgres는 **생성 30일 후 만료**(14일 유예), 1 GB | **Google Cloud Run**: 요청 기반 과금에서 월 200만 요청·360,000 GiB-초·180,000 vCPU-초 무료(인스턴스 기반 과금은 240,000 vCPU-초로 표기되어 모드별로 다름), 유휴 시 0까지 축소, 표준 무료 한도는 **결제(청구) 계정 필요**. (대안2 Fly.io: 신규 조직은 무료 티어 없음, 카드 필요) |

출처 | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits , https://developers.cloudflare.com/pages/platform/limits/ , https://learn.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits , https://azure.microsoft.com/pricing/details/app-service/linux/ , https://azure.microsoft.com/pricing/purchase-options/azure-account , https://render.com/docs/free , https://cloud.google.com/run/pricing , https://cloud.google.com/free , https://fly.io/docs/about/free-trial/ , https://fly.io/docs/about/pricing/ | 확인일 2026-11-01 (GitHub Pages 한도는 `[원문]`, 나머지는 `[검색요약]`). 클라우드 요금제는 자주 바뀌므로 집필 시점 문구에 "작성 기준일 2026-11"을 붙인다.

- Fly.io 세부: 신규 조직은 무료 티어가 없고, 카드 없는 체험은 "2시간 머신 실행 또는 7일 중 먼저 오는 쪽"(머신은 5분 실행 후 자동 중지)이며, 이후 카드나 최소 25달러 크레딧이 필요. 최소 머신 `shared-cpu-1x` 256 MB는 월 2.19달러 | https://fly.io/docs/about/free-trial/ , https://fly.io/docs/about/pricing/ | 확인일 2026-11-01 `[검색요약]`
- Render 무료 사용은 공식 문서가 "프로덕션 용도로 쓰지 말라"고 안내함 | https://render.com/docs/free | 확인일 2026-11-01 `[검색요약]`

**교재 반영 결정**
- P1은 GitHub Pages, P2·P3·SP의 배포 Day는 **"선택(카드·슬립·휘발 제약을 이해하고 시도)"** 으로 두고 본선 실습은 모두 **로컬 실행**으로 완결시킨다. SP는 OBS가 같은 PC에서 로컬 URL을 읽으므로 로컬 실행이 오히려 자연스럽다(설계상 판단).
- SQLite·PostgreSQL 데이터는 Render 무료 인스턴스에서 보존되지 않음을 `:::warn`으로 명시한다. 카드가 필요한 서비스는 "카드 필요"를 배포 Day 맨 위에 쓴다.

---

## 14. 빌드 의존성 최신 버전

현재 `npm view <pkg> version` 조회값이다. 다른 에이전트가 같은 값을 고정하는 중이므로, 불일치가 보이면 이 표가 아니라 고정 쪽(`package.json`/`package-lock.json`)이 기준이다.

- **marked 18.1.2** (`latest`, 2026-10-26 게시, 요구 Node ≥20) | https://www.npmjs.com/package/marked | 확인일 2026-11-01 `[레지스트리]`
- **highlight.js 11.12.0** (`latest`, 요구 Node ≥12, 같은 `latest` 태그의 `unsupported`/`previous`는 9.x) | https://www.npmjs.com/package/highlight.js | 확인일 2026-11-01 `[레지스트리]`
- **esbuild 0.28.2** (`latest`, 2026-08-08 게시, 요구 Node ≥18) | https://www.npmjs.com/package/esbuild | 확인일 2026-11-01 `[레지스트리]`. Vite 8.3.5의 선택 피어가 `esbuild ^0.27.0 || ^0.28.0`이라 같은 계열과 호환

**교재 반영 결정**
- 빌드 스크립트는 위 세 패키지를 `devDependencies`에 정확한 버전으로 고정하고(`^` 없이), 빌드 결과물 `index.html`에는 런타임 외부 요청이 없도록 CSS·폰트·스크립트를 모두 인라인한다.

### 14.1 교재 사이트 빌드·배포 (확인일 2026-11-12)

| 항목 | 값 | 근거 |
|---|---|---|
| `actions/checkout` | `v7.0.1` | `[측정]` `gh api repos/actions/checkout/releases/latest --jq .tag_name` |
| `actions/setup-node` | `v7.1.0` | `[측정]` 같은 명령 |
| `actions/setup-python` | `v7.1.0` | `[측정]` 같은 명령 |
| `actions/configure-pages` | `v6.0.0` | `[측정]` 같은 명령 |
| `actions/upload-pages-artifact` | `v5.0.0` | `[측정]` 같은 명령 |
| `actions/deploy-pages` | `v5.0.1` | `[측정]` 같은 명령 |
| `pixelmatch` | `8.0.0`, ESM(`type: module`) | `[레지스트리]` `npm view pixelmatch version type` |
| `pngjs` | `7.0.0`, Node ≥ 14.19.0 | `[레지스트리]` `npm view pngjs version engines.node` |
| 글꼴 서브셋 도구 | Python 3.12.4, fontTools 4.66.1, brotli | `[측정]` 이 PC |
| Pages 배포 job 권한 | `pages: write`, `id-token: write`, 환경 `github-pages` | `[문서]` https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages |
| 프로젝트 사이트 주소 | `https://<소유자>.github.io/<저장소>/` (호스트는 소문자로 쓴다) | `[측정]` `gh api repos/{owner}/{repo} --jq .owner.login,.name` |
| 액션 입력(2026-11-12 README·action.yml) | `setup-node`: `node-version`, `cache`, `cache-dependency-path` / `setup-python`: `python-version` / `configure-pages`: `token`, `enablement`(기본 false, 켜려면 `GITHUB_TOKEN`이 아닌 토큰 필요) / `upload-pages-artifact`: `path`, `name`, `retention-days`, `include-hidden-files` / `deploy-pages`: `token`, `timeout`, `artifact_name` 등. 모두 `node24` 또는 composite | `[원문]` `gh api repos/actions/<이름>/contents/action.yml`, `…/readme` |
| 배포 job 최소 권한 | `pages: write`, `id-token: write` (deploy-pages README "must at minimum have") | `[원문]` https://github.com/actions/deploy-pages |

---

## 부록 A. 미확인 항목과 대안 요약

| 항목 | 상태 | 대안 |
| :-- | :-- | :-- |
| CHZZK 일반 Scope 심사 기준·소요 시간 | 미확인 | 테스트 모드를 본선, 실연동을 선택 실습으로 분리 |
| CHZZK 이용 약관의 데이터 저장·재가공 조항 | 미확인(약관 호스트 차단) | 결제 없음·화면 표시 전용·영속 저장 없음으로 설계, 독자가 약관 직접 확인 |
| CHZZK Quota 수치, 채팅 전송 횟수 제한 | 미확인 | 429 응답에 대한 재시도(지수 백오프) 처리만 교재에 넣음 |
| CHZZK 실서버에 `SocketIOClient 4.0.5` 연결 | 미확인(계정·네트워크 없음) | 로컬 Socket.IO 2.5.0 에뮬레이터로 코드 경로 검증, 대안 `socket.io-client@2.0.3` 중계 |
| CHZZK 리디렉션 URL의 `http://localhost` 허용 여부 | 미확인 | 개발자 센터 입력칸 안내 문구를 독자가 확인 |
| `payAmount`의 실제 타입(문자열/숫자) | 미확인 | 두 타입 모두 파싱 |
| Docker Desktop의 Windows 11 Home 지원 | 현행 요구 목록에 Home 없음. 역사적·간접 공식 근거(WSL 2 백엔드, Linux 컨테이너)만 있어 **현행 보증은 미확인** | Docker 없는 경로(PostgreSQL 직접 설치 + `dotnet run`/`cargo run`)를 모든 Docker Day에 병행, 설치 Day는 에디션 점검으로 시작(9절) |
| PostgreSQL 네이티브 설치: 슈퍼유저 이름, 실제 설치 경로·대소문자, Windows 서비스 등록, SQL Shell 메뉴 이름 | EDB 문서·winget 매니페스트로는 확인 못 함(포트 5432는 확인) | 전체 경로 `psql.exe`를 `Get-ChildItem "C:\Program Files\PostgreSQL"`로 찾게 하고, 설치 마법사에서 입력한 값을 그대로 쓰게 안내 |
| Windows 11 에디션(Home/Pro)을 확인하는 화면의 공식 문서 | 미확인(Microsoft 지원 호스트 차단) | 설정 → 시스템 → 정보 + `(Get-CimInstance Win32_OperatingSystem).Caption` 병기, 출력 예시는 실기 확인 필요 |
| C# Dev Kit 개인 무료 사용 조건 | 미확인(문서 표현 불일치) | C# 확장 + `dotnet` CLI |
| Git for Windows 릴리스 빌드의 "Let Git decide"가 쓰는 기본 브랜치 이름 | 설치 스크립트의 기본 정의는 `master`이나 릴리스 빌드 값은 미확인(3절) | 설치 화면에서 반드시 "Override the default branch name… → `main`"을 고르게 하고, 설치 직후 `git config --global init.defaultBranch`로 확인, 비어 있으면 `git config --global init.defaultBranch main` 실행(Git 2.43.0에서 이 설정이 `git init` 결과 브랜치를 바꾸는 것을 확인, 설정이 없으면 `master`와 안내 힌트가 나옴) |
| CHZZK 공식 문서에서 "미션 후원은 Open API로 받을 수 없다"는 문장 | 미확인(비공식 SDK 문서의 보고뿐, 10.7절) | DONATION의 `donationType`을 `CHAT`/`VIDEO`로만 가정하고 그 외 값은 무시·로그 처리 |
| VS Code User setup의 Copilot CLI 페이지 한국어 문구와 선택지 순서 | 영어 원문 소스 기준, 한국어 문구 미확인(2절) | "Don't add the copilot command" 계열(세 번째 선택지)을 고르라고만 안내하고 문구 의존을 피함 |
| PowerShell 한국어 오류 문구("이 시스템에서 스크립트를 실행할 수 없으므로 … npm.ps1 …")의 정확한 표기, `.cmd`가 실행 정책을 받지 않는다는 공식 문장, 확장자 없는 `npm`이 `.ps1`을 우선 선택하는 규칙 | 미확인(영어 원문·정책 설명만 확인, 1절) | 증상을 `npm.ps1`·`UnauthorizedAccess` 키워드로 설명하고, 해결은 공식 예시의 `Set-ExecutionPolicy … -Scope CurrentUser`를 1순위, `npm.cmd`는 "추정" 표기의 보조 |
| `create-vite` 대화형 화면의 실제 렌더링(색상·커서 이동 방식) | 문구·순서만 소스 기준, TTY 실행은 못 함(7절) | 질문 문구를 그대로 적고 "방향키와 Enter"만 안내 |
| `rand`+`getrandom(wasm_js)`의 브라우저 실행 | **해소**: Chromium에서 `roll()` 30회 실행 확인(8절) | 필요 없음 |
| Vite 개발 서버(`npm run dev`)에서의 wasm 동작 | **해소**: `vite` 개발 서버에서도 확인(8절) | 필요 없음 |
| Windows 설치 마법사 한국어 화면 문구 전반(Git, Node, Docker, VS Code Copilot 페이지) | 영어 원문 소스 기준, 실기 미확인 | 텍스트 안내 + "같은 위치의 선택지" 문구 |
| Render 무료 인스턴스 카드 요구, Cloudflare Pages 카드·대역폭 | 공식 문서 직접 확인 못 함 | 가입 화면에서 확인하도록 안내 |
| Azure F1에서 SQLite 파일 영속성 | 미확인 | P2 배포는 선택 실습, 본선은 로컬 |
| SkiaSharp·Magick.NET의 판별·EXIF·WebP 기능 | **SkiaSharp은 해소**: 판별(`SKCodec`)·첫 장면 디코딩·축소 디코딩·EXIF 방향·WebP 인코딩·Docker(`aspnet:10.0`) 동작을 실행 확인(12절). Windows에서 실제 실행은 미확인(패키지 그래프·게시 결과만 확인). Magick.NET은 미실행 | **SkiaSharp 4.154.0 선택**(MIT, 빌드 시 라이선스 키 없음, Ruling R28). ImageSharp 3.2+/4.x는 Release 빌드에 키가 필요해 쓰지 않음 |
| OBS 실제 화면, 브라우저 소스 투명도 실제 합성 | 소스 코드 기준, 실행 안 함 | 오버레이 CSS에서 배경 투명을 명시 |

## 부록 B. 이 조사에서 실행한 검증 (재현 가능한 요약)

- Node 22.23.4: `npm i -D typescript@7.0.2` → `npx tsc --version` = `Version 7.0.2`, `npx tsc --init`, `npx tsc hello.ts`(→ TS5112), `npx tsc --ignoreConfig hello.ts --outDir out`, `node hello.ts`(네이티브 실행 성공)
- `apt-get install -y dotnet-sdk-10.0` → SDK 10.0.114 / 런타임 10.0.14. `dotnet new list`, `dotnet new sln|web|webapi|console|xunit`, 기능 확인 프로젝트에서 `AddValidation`(public 레코드·쿼리 매개변수 → 400, internal 레코드 → 검증 없음), `TypedResults.ServerSentEvents`, `MapIdentityApi` + `/login?useCookies=true`(쿠키 발급·보호 엔드포인트 200), `AddFixedWindowLimiter`(200 200 200 429 429), `dotnet tool install … dotnet-ef`(10.0.14)
- 로컬 `socket.io@2.5.0` 서버(포트 5099, 서버 로그 `EIO= 3`) ↔ `SocketIOClient 4.0.5` 콘솔 앱: `Query["auth"]` 전달 성공 / `Uri` 쿼리는 전달 안 됨 / `SYSTEM`·`DONATION` JSON 문자열 수신
- `SkiaSharp 4.154.0`(+ `SkiaSharp.NativeAssets.Linux.NoDependencies`): SP 레퍼런스 `ImageProcessor` 테스트와 Docker Release 이미지에서 형식 판별(`SKCodec.Create`가 비이미지에 null), 첫 장면 디코딩, `GetScaledDimensions` 축소 디코딩(JPEG 1/8 단위, 내림), EXIF 방향, EXIF·ICC 없는 WebP 재인코딩, GIF 인코딩 미지원(null) 확인. 처음 선택이던 `SixLabors.ImageSharp 4.1.3` 콘솔 앱(형식 판별, `Identify`, 비이미지 예외, EXIF 제거, WebP 인코딩)은 비교용으로 12절에 남김. ImageSharp 4.1.3을 직접 참조하면 키 없이 `dotnet build -c Release`가 실패함도 확인
- 보정 라운드 추가 실행(2026-11-01): ① 격리된 `RUSTUP_HOME`에 `rustup toolchain install stable --profile minimal`(rustc 1.99.1)만 설치 → `cargo build --target wasm32-unknown-unknown --release`가 `E0463 can't find crate for core`로 실패 → `rustup target add wasm32-unknown-unknown` 후 성공, 같은 환경에서 axum/tokio/serde/sqlx/tracing 조합 `cargo check` 통과 ② 위 wasm 앱을 `vite --port 5199` 개발 서버로 띄워 Playwright Chromium에서 출력 확인, `.wasm`은 `200 application/wasm` ③ `rand`+`getrandom(wasm_js)` wasm을 `python3 -m http.server`로 서빙해 `roll()` 30회 호출(전부 1~6, 6가지 값, 콘솔 오류 0) ④ `socket.io@2.5.0` 에뮬레이터가 문자열·객체 두 형태의 `DONATION`을 보내고 `SocketIOClient 4.0.5`가 `GetValue<JsonElement>(0)`로 둘 다 처리(`payAmount` 문자열 `1000`, 숫자 `2500`) ⑤ TS 7 새 프로젝트: `types: []`에서 TS2591, `type: module` 없을 때 TS1295, `@types/node@26.6.6` + `"types": ["node"]` + `"type": "module"` 후 `tsc --noEmit` 통과 ⑥ `create-vite@9.3.3` `dist/index.js`에서 대화형 질문 문구 추출 ⑦ Node 26.13.0 Windows ZIP 목록에서 `npm.ps1`/`npm.cmd` 확인 ⑧ 스크래치 저장소(프로젝트 밖)에서 `git -c init.defaultBranch=main init` 확인
- Rust 1.97.0: `cargo install wasm-bindgen-cli --version 0.2.130`, `cargo build --target wasm32-unknown-unknown --release`, `wasm-bindgen --target web`, `npm create vite@latest app -- --template vanilla-ts` + `vite build` + Playwright Chromium에서 wasm 출력 확인, `rand 0.10.3` + `getrandom 0.4.3(wasm_js)` wasm32 빌드, axum 0.8.9(ws)/tokio/serde/sqlx 0.9.0/tracing 조합 `cargo check` 통과

## 부록 C. 검증에 쓴 코드 조각 (이후 Task가 인용)

### C.1 .NET: CHZZK 형식의 EIO=3 소켓 수신 (로컬 에뮬레이터에서 실행 확인, 실서버 미확인)

```csharp
using System.Collections.Specialized;
using System.Text.Json;
using SocketIOClient;
using SocketIOClient.Common; // EngineIO, TransportProtocol

// CHZZK가 주는 url 예: https://ssio08.nchat.naver.com:443?auth=TOKEN
// Uri에 쿼리를 붙여 두면 전달되지 않으므로 origin과 auth 값을 분리해서 쓴다.
var opts = new SocketIOOptions
{
    EIO = EngineIO.V3,
    Transport = TransportProtocol.WebSocket,
    Reconnection = false,
    ConnectionTimeout = TimeSpan.FromSeconds(3),
    Query = new NameValueCollection { ["auth"] = authToken },
};
var client = new SocketIO(new Uri(originOnly), opts);

// 페이로드가 JSON 문자열이든 이미 객체든 받는다. payAmount도 문자열/숫자 모두 받는다.
static JsonElement ToObject(JsonElement e) =>
    e.ValueKind == JsonValueKind.String ? JsonDocument.Parse(e.GetString()!).RootElement : e;
static decimal ToAmount(JsonElement e) => e.ValueKind switch
{
    JsonValueKind.Number => e.GetDecimal(),
    JsonValueKind.String => decimal.Parse(e.GetString()!),
    _ => 0m,
};

client.On("SYSTEM", ctx =>
{
    var el = ToObject(ctx.GetValue<JsonElement>(0));
    // el.GetProperty("type") == "connected" 이면 el.GetProperty("data").GetProperty("sessionKey")
    return Task.CompletedTask;
});
client.On("DONATION", ctx =>
{
    var el = ToObject(ctx.GetValue<JsonElement>(0));
    var nickname = el.GetProperty("donatorNickname").GetString();
    var amount = ToAmount(el.GetProperty("payAmount"));
    return Task.CompletedTask;
});
await client.ConnectAsync();
```

### C.2 Node: 로컬 에뮬레이터 (`socket.io@2.5.0`)

```js
// npm i socket.io@2.5.0  (EIO=3)
const io = require('socket.io')(5099, { transports: ['websocket', 'polling'] });
io.on('connection', (socket) => {
  console.log('auth=', socket.handshake.query.auth, 'EIO=', socket.handshake.query.EIO);
  socket.emit('SYSTEM', JSON.stringify({ type: 'connected', data: { sessionKey: 'sess-123' } }));
  const d = {
    donationType: 'CHAT', channelId: 'c1', donatorChannelId: 'd1',
    donatorNickname: '테스터', payAmount: '1000', donationText: '안녕', emojis: {},
  };
  setTimeout(() => socket.emit('DONATION', JSON.stringify(d)), 500);        // JSON 문자열 형태
  setTimeout(() => socket.emit('DONATION', { ...d, payAmount: 2500 }), 800); // 객체 + 숫자 payAmount 형태
});
```

### C.3 Rust → Vite (wasm-bindgen 0.2.130, wasm-pack 없이)

```toml
# Cargo.toml
[lib]
crate-type = ["cdylib"]
[dependencies]
wasm-bindgen = "0.2.130"
```

```powershell
rustup target add wasm32-unknown-unknown   # 기본 설치에는 없다. 없으면 E0463 can't find crate for `core`
cargo install wasm-bindgen-cli --version 0.2.130
cargo build --target wasm32-unknown-unknown --release
wasm-bindgen --target web --out-dir pkg target\wasm32-unknown-unknown\release\hello_wasm.wasm
```

```ts
// src/main.ts (Vite vanilla-ts, pkg를 src/wasm/ 로 복사한 뒤)
import init, { add, greet } from './wasm/hello_wasm.js'
await init()
console.log(greet('Vite'), add(2, 3))
```
