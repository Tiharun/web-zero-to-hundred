## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- HTTP 요청과 응답이 어떤 부분(시작줄, 헤더, 빈 줄, 본문)으로 이루어졌는지 그림으로 설명할 수 있어요.
- GET/POST/PUT/DELETE와 상태 코드(200, 201, 204, 400, 401, 403, 404, 429, 500)가 각각 무엇을 뜻하는지 말할 수 있어요.
- VS Code의 REST Client 확장으로 `.http` 파일에서 실제 요청을 보내고 응답 창을 읽을 수 있어요.
- 스트리머 허브가 쓸 API 설계 표를 `README.md`에 쓰고 GitHub에 올릴 수 있어요.

**예상 시간: 90분** (개념 이해 22분 · 따라하기 46분 · 과제 15분 · 정리 7분)

:::path 📂 시작 상태
[Day 15](#/day/p2-d15)가 끝난 상태예요. 오늘은 프로젝트 폴더의 `README.md`와, 연습 폴더 `C:\dev\http-practice`를 써요. 연습 폴더는 1단계에서 만들어요.

- `C:\dev\streamer-hub\README.md`와 `C:\dev\streamer-hub\.git\` (Git 저장소, GitHub에 올라가 있어요)
- `C:\dev\streamer-hub\client\` 폴더의 `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
- `C:\dev\streamer-hub\client\public\` 의 `favicon.svg`, 같은 곳 `data\` 폴더의 `streamers.json`, `schedules.json`
- `C:\dev\streamer-hub\client\src\` 의 `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
- 내 P1 사이트가 GitHub Pages(`https://내아이디.github.io/my-creator-site/`)에 올라가 있으면 좋아요. 없거나 인터넷이 없으면 아래 🧯의 "응답이 `Error: getaddrinfo ENOTFOUND …`이거나 아무것도 안 와요" 항목처럼 Live Preview 주소를 써요.
- Git: `git --version`이 `git version 2.…`를 보여 주고 `git push`가 되어요([P1 Day 7](#/day/p1-d07), [Day 2](#/day/p2-d02)).
- 켜 두어야 할 프로그램은 없어요.
:::

## 📖 개념 이해

### 브라우저와 서버는 어떤 말로 대화할까요?

**비유부터 볼게요.** 음식점에 주문서를 내면 영수증과 음식이 돌아와요. 주문서에는 "무엇을 주세요"가, 영수증에는 "주문이 잘 됐어요"가 적혀 있어요. 정해진 양식이 있으면 가게마다 달라도 서로 알아볼 수 있어요.

**정확한 정의는 이래요.** **[[HTTP]]**(에이치티티피)는 브라우저(클라이언트)와 서버가 요청과 응답을 주고받는 약속(양식)이에요. Day 1에서 본 요청과 응답이 바로 이 양식을 따라요. 요청 하나는 이런 모양이에요.

```text
GET /data/videos.json HTTP/1.1
Host: example.github.io
Accept: application/json
(빈 줄)
```

- 첫 줄이 **시작줄**이에요. `무엇을(메서드) 어디에(주소) 어떤 규격으로`예요.
- 그 아래가 **헤더**예요. `이름: 값` 한 줄씩이에요.
- **빈 줄** 하나가 헤더의 끝이에요.
- 그 아래가 본문이에요. GET은 보통 본문이 없어요.

서버가 돌려주는 응답도 같은 구조예요.

```text
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 810
(빈 줄)
[ { "id": "v001", … } ]
```

- 첫 줄이 **상태 줄**이에요. 규격, 상태 코드(`200`), 상태 이름(`OK`)이에요.
- 헤더 몇 줄, 빈 줄, 그리고 본문이에요. 이 본문이 JSON이에요([[JSON]]).

용어를 정리할게요.

- **[[HTTP 메서드]]**(method)는 요청이 하고 싶은 일의 종류예요. `GET`(읽기), `POST`(새로 만들기), `PUT`(통째로 고치기), `DELETE`(지우기)를 써요. 브라우저 주소창에 주소를 치면 `GET`이에요.
- **[[HTTP 헤더]]**(header)는 요청이나 응답에 붙는 추가 정보 한 줄(`이름: 값`)이에요. 꼭 알아야 할 것은 아래 셋이에요. 이 헤더는 문서의 `<header>` 태그와 달라요.
- **[[HTTP 본문]]**(body)는 실제로 주고받는 내용이에요. 응답의 JSON, 요청으로 보내는 글쓰기 내용이 본문이에요.
- **[[Content-Type]]**(콘텐츠 타입)은 본문이 어떤 종류인지 알려 주는 헤더예요. JSON이면 `application/json`이에요. 서버로 JSON을 보낼 때는 요청에도 이 헤더를 꼭 붙여요.
- **[[HTTPS]]**(에이치티티피에스)는 HTTP에 암호화를 더한 것이에요. 주소가 `https://`로 시작하고 주소창에 자물쇠가 보여요. 중간에서 누가 훔쳐봐도 내용을 읽지 못해요.

그 밖에 알아 둘 헤더는 이래요. 응답의 `Location`은 새로 만든 자원의 주소를 알려 줘요(Day 18). `Set-Cookie`는 로그인 정보를 브라우저에 맡기는 헤더예요. Day 25에서 써요.

### 상태 코드: 서버가 보내는 한 줄 결과

**[[상태 코드]]**(status code)는 응답의 첫 줄에 있는 세 자리 숫자로, 요청이 어떻게 됐는지를 알려 줘요. 첫 숫자가 큰 갈래를 나타내요.

| 묶음 | 뜻 | 예 |
|---|---|---|
| 2xx | 성공 | 200, 201, 204 |
| 4xx | 요청한 쪽 잘못 | 400, 401, 403, 404, 429 |
| 5xx | 서버 잘못 | 500 |

이 프로젝트에서 쓸 코드예요.

| 코드 | 이름 | 이럴 때 |
|---|---|---|
| 200 | OK | 읽기 성공 |
| 201 | Created | 새로 만들기 성공 (`Location` 헤더 포함) |
| 204 | No Content | 성공했지만 돌려줄 내용 없음 |
| 400 | Bad Request | 보낸 값이 틀림 |
| 401 | Unauthorized | 로그인하지 않았음 |
| 403 | Forbidden | 로그인했지만 권한이 없음 |
| 404 | Not Found | 그 주소에 아무것도 없음 |
| 429 | Too Many Requests | 너무 자주 요청함 |
| 500 | Internal Server Error | 서버 코드가 터짐 |

401과 403은 자주 헷갈려요. 401은 "누구신지 모르겠어요"(로그인 안 함), 403은 "누구인지 알지만 안 돼요"(권한 없음)예요.

### REST: 주소는 명사, 할 일은 메서드

**비유:** 도서관에서 "도서 7번"이라는 번호 위치는 그대로 두고, 빌리기·반납하기·폐기하기 같은 동작만 바꿔서 말해요.

**[[REST]]**(레스트)는 서버의 데이터를 **자원**(스트리머, 게시글 같은 명사)으로 보고, 자원마다 주소를 하나 정하고, 할 일은 HTTP 메서드로 표현하는 설계 방식이에요. 같은 주소라도 메서드에 따라 일이 달라져요.

```text
GET    /api/streamers      목록 보기
GET    /api/streamers/3    3번 보기
POST   /api/streamers      새로 만들기
PUT    /api/streamers/3    3번 고치기
DELETE /api/streamers/3    3번 지우기
```

주소에 동사를 넣지 않아요(`/api/deleteStreamer` 같은 주소는 쓰지 않아요). `/api`는 "화면이 아니라 데이터 주소"라는 표시고, 복수형 명사(`streamers`)를 써요.

**[[엔드포인트]]**(endpoint)는 서버가 요청을 받는 주소 하나(메서드와 짝)예요. `GET /api/streamers`가 엔드포인트 하나예요. 이 주소들을 표로 모은 것이 API 설계예요. 서버를 만들기 전에 표부터 쓰면 화면과 서버가 같은 약속을 보고 일해요.

### .http 파일: 요청을 글로 적어 두기

**[[.http 파일]]**(에이치티티피 파일)은 HTTP 요청을 글로 적어 둔 파일이에요. VS Code의 REST Client 확장이 요청을 보내고 응답을 보여 줘요. 요청을 여러 개 적고 `###` 줄로 구분해요. 맨 위에 `@host = 주소`로 변수를 정하고 `{{host}}`로 가져다 써요.

```http
@host = https://example.com

### 목록 보기
GET {{host}}/api/streamers
```

브라우저 주소창으로는 GET만 보낼 수 있어요. POST, PUT, DELETE를 보내려면 이런 도구가 필요해요. 오늘 만드는 `practice.http`는 연습 파일이고, 프로젝트용 `.http` 파일은 Day 17에 만들어요.

:::info 실무에서는
회사에서는 Postman 같은 앱이나 `.http` 파일로 서버를 시험해요. `.http`는 파일이라서 코드와 함께 Git에 올려 팀이 같은 요청을 공유할 수 있어요. 레퍼런스 `StreamerHub.Api.http`가 그 예예요.
:::

## 🛠️ 따라하기

5단계예요. 연습 요청 3개를 보내 보고 API 설계 표를 README에 올려요.

### 1단계 · REST Client 확장 설치 (6분)

**어디서:** VS Code 창 (아무 폴더나 열려 있어도 돼요)

**무엇을:**

1. 왼쪽 맨 아래쪽 줄의 **확장** 아이콘(네모 4개 모양)을 클릭해요. 단축키는 `Ctrl + Shift + X`예요.
2. 위쪽 검색 칸에 `REST Client`를 입력해요.
3. 결과 중 이름이 **REST Client**이고 만든 사람이 **Huachao Mao**인 것을 찾아 **설치** 버튼을 클릭해요. 확장 ID가 `humao.rest-client`인지 상세 화면에서 확인해요.

PowerShell에서 한 줄로 설치할 수도 있어요.

```powershell
code --install-extension humao.rest-client
```

예상 출력(문구와 버전은 달라도 돼요. 이미 설치되어 있으면 그렇다고 알려 줘요):

```text
Installing extensions...
Extension 'humao.rest-client' was successfully installed.
```

:::success
확장 목록에서 **REST Client**에 **설치됨** 표시가 있거나, 버튼이 **제거**(또는 톱니바퀴)로 바뀌어요. 다음 단계에서 `.http` 파일을 열면 확장이 켜져요.
:::

### 2단계 · 연습 폴더와 practice.http 만들기 (10분)

**어디서:** PowerShell (위치는 어디든 괜찮아요)

**무엇을:**

1. 연습 폴더를 만들어요.

```powershell
mkdir C:\dev\http-practice
```

예상 출력(날짜는 달라요):

```text
    Directory: C:\dev


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        2026-11-06   오후 2:30                http-practice
```

2. VS Code로 그 폴더를 열어요.

```powershell
code C:\dev\http-practice
```

아무것도 나오지 않고 `http-practice` 폴더가 열린 VS Code 창이 떠요.

3. 왼쪽 탐색기의 폴더 이름 줄에 마우스를 올리고 **새 파일** 아이콘을 눌러 `practice.http`를 만들어요.
4. 아래 코드를 붙여 넣어요. `내아이디`는 P1 Day 14에서 쓴 **내 GitHub 아이디**로 바꿔요(철자와 대소문자까지 같게 써요).

📄 C:\dev\http-practice\practice.http
```http
# 스트리머 허브 연습 파일 (Day 16)
# 요청 위의 Send Request를 누르면 요청이 가요.
# 내아이디를 내 GitHub 아이디로 바꿔요.
@host = https://내아이디.github.io/my-creator-site

### 영상 목록 JSON 가져오기 (200이 와요)
GET {{host}}/data/videos.json

### 없는 주소 (404가 와요)
GET {{host}}/data/nope.json

### 홈페이지 HTML (200이 와요)
GET {{host}}/
```

5. `Ctrl + S`로 저장해요.

각 부분의 뜻이에요.

- `#`으로 시작하는 줄은 설명이에요. 서버로 가지 않아요.
- `@host = …`는 변수를 정해요. `{{host}}`가 그 값으로 바뀌어요.
- `###`가 요청 사이의 경계예요. 뒤에 쓴 글자는 요청 이름 설명이에요. 이 줄이 없으면 요청 두 개가 붙어서 하나로 가요.
- `GET {{host}}/data/videos.json`이 요청의 시작줄이에요.

:::success
`GET …` 줄 위에 **Send Request**라는 작은 회색 글씨가 요청마다 하나씩 보여요. 안 보이면 VS Code 오른쪽 아래 상태 표시줄의 언어 이름이 `HTTP`인지 확인하세요. 다르면 그 글자를 눌러 `HTTP`를 골라요. 그래도 안 보이면 아래 🧯의 첫 항목을 보세요.
:::

### 3단계 · 첫 요청 보내고 응답 읽기 (10분)

**어디서:** VS Code → `C:\dev\http-practice\practice.http`

**무엇을:**

1. `### 영상 목록 JSON 가져오기` 아래 `GET {{host}}/data/videos.json` 줄 바로 위의 **Send Request**를 클릭해요. 키보드로는 그 요청 줄에 커서를 두고 `Ctrl + Alt + R`을 눌러도 돼요.
2. 오른쪽에 새 탭이 열려요. 제목에 응답 시간이 보여요.
3. 탭 위쪽부터 읽어요.

예상 화면(헤더 줄과 숫자는 달라도 돼요. 첫 줄과 `content-type` 줄을 보세요):

```text
HTTP/1.1 200 OK
Server: GitHub.com
Content-Type: application/json; charset=utf-8
Content-Length: 810
…(헤더 몇 줄이 더 있어요)

[
  { "id": "v001", "title": "기타로 연주하는 신청곡", … },
  …
]
```

읽는 법이에요.

- 첫 줄 `HTTP/1.1 200 OK`가 상태 줄이에요. 200은 성공이에요.
- `Content-Type: application/json…`은 본문이 JSON이라는 뜻이에요(REST Client가 이름을 소문자로 보여 줄 수 있어요).
- 빈 줄 아래가 본문이에요. P1 사이트의 `data/videos.json` 내용이에요.

:::success
응답 창 첫 줄이 `HTTP/1.1 200 OK`이고, 헤더에 `application/json`이 있고, 아래에 `[ { "id": "v001", …` 로 시작하는 JSON이 보여요. 다른 결과가 나오면 아래 🧯 자주 막히는 곳을 보세요.
:::

### 4단계 · 없는 주소 404 확인하기 (6분)

**어디서:** VS Code → `C:\dev\http-practice\practice.http`

**무엇을:**

1. `### 없는 주소 (404가 와요)` 아래 `GET {{host}}/data/nope.json` 줄 위의 **Send Request**를 클릭해요.
2. 응답 창의 첫 줄을 읽어요.

예상 화면의 첫 줄(나머지는 달라도 돼요):

```text
HTTP/1.1 404 Not Found
```

:::success
`HTTP/1.1 404 Not Found`가 보여요. 서버가 "그 주소에는 아무것도 없어요"라고 응답한 거예요. 요청 자체는 성공적으로 서버에 닿았어요.
:::

### 5단계 · README에 API 설계 표 쓰고 올리기 (14분)

서버를 만들기 전에 "어떤 주소가 어떤 일을 하는지" 표부터 써 둬요. 오늘 쓰는 표는 초안이고, 게시판 줄은 과제로 채워요.

**어디서:** PowerShell (위치는 어디든 괜찮아요)

**무엇을:**

1. 프로젝트 폴더를 VS Code로 열어요. 이미 다른 창에 열려 있으면 그 창으로 이동해요.

```powershell
code C:\dev\streamer-hub
```

2. 왼쪽 탐색기에서 `README.md`를 열어요.
3. `## 개발 환경` 줄을 찾아요. 그 줄 **바로 위**에 빈 줄을 하나 두고 아래 내용을 붙여 넣어요.

📄 C:\dev\streamer-hub\README.md (일부)
```md
## API 설계

주소 앞의 `/api`는 "화면이 아니라 데이터 주소"라는 표시예요. 지금은 초안이에요.

| 메서드 | 주소 | 누가 | 응답 |
|---|---|---|---|
| GET | /api/streamers?q= | 누구나 | 200 스트리머 목록 |
| GET | /api/streamers/{id} | 누구나 | 200 상세, 없으면 404 |
| POST | /api/streamers | 관리자 | 201, 값이 틀리면 400 |
| PUT, DELETE | /api/streamers/{id} | 관리자 | 204, 없으면 404 |
| GET | /api/schedules?from=&to= | 누구나 | 200 일정 목록 |
| GET | /api/notices/current | 누구나 | 200 최근 공지, 없으면 204 |
| POST | /api/notices | 관리자 | 201 |
| POST | /api/auth/register, /api/auth/login | 누구나 | 가입과 로그인 |
| GET | /api/me | 누구나 | 로그인했으면 200, 아니면 204 |

```

4. `Ctrl + S`로 저장해요. `Ctrl + Shift + V`를 누르면 표가 보이는 미리보기가 열려요.
5. VS Code 터미널(`` Ctrl + ` ``)에서 프롬프트가 `PS C:\dev\streamer-hub>`인지 확인하고 아래 명령을 한 줄씩 실행해요.

```powershell
git add -A
```

```powershell
git commit -m "day16: API 설계 초안"
```

예상 출력(해시는 달라요. 줄바꿈 안내 `warning: in the working copy of 'README.md', LF will be replaced by CRLF…`가 나와도 무시해도 되는 안내예요):

```text
[main 3f2e1a0] day16: API 설계 초안
 1 file changed, 16 insertions(+)
```

```powershell
git push
```

예상 출력(숫자는 달라도 돼요):

```text
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 1.10 KiB | 1.10 MiB/s, done.
Total 3 (delta 1), reused 0 (delta 0), pack-reused 0 (from 0)
To https://github.com/내아이디/streamer-hub.git
   9d8c7b6..3f2e1a0  main -> main
```

:::success
미리보기에 표가 보이고, `git push` 마지막 줄이 `main -> main`으로 끝나요. GitHub 저장소 페이지의 README에도 `API 설계` 표가 보여요. 연습 폴더 `C:\dev\http-practice`는 프로젝트 밖이라 Git에 올라가지 않아요.
:::

## ✍️ 과제

### 과제 1 · 팬 게시판 API를 REST로 설계하기 (보통 ⭐⭐, 6분)

- README의 API 설계 표에 팬 게시판 줄을 넣어요. 목록(쪽 번호와 쪽 크기 쿼리 포함), 상세, 글쓰기, 고치기, 지우기예요.
- 글쓰기는 로그인해야 하고, 고치기·지우기는 글쓴이 또는 관리자만 할 수 있어요.
- 힌트: 목록 주소는 `/api/posts?page=1&pageSize=20` 모양이에요. 주소에 `delete` 같은 동사를 넣지 않아요.
- 고쳤으면 `git add -A`, `git commit -m "day16: 게시판 API 설계"`, `git push`로 올려요.

### 과제 2 · 상황별 상태 코드 맞히기 (쉬움 ⭐, 4분)

아래 상황에 어울리는 상태 코드를 적어 보세요(코드 번호만).

1. 로그인하지 않았는데 글쓰기를 눌렀어요.
2. 로그인했지만 남의 글을 고치려고 했어요.
3. 없는 글 번호를 열었어요.
4. 새 글이 잘 저장됐어요.
5. 글을 지웠고 돌려줄 내용은 없어요.
6. 1분에 요청을 수백 번 보냈어요.

### 과제 3 · curl.exe로 같은 요청 보내기 (쉬움 ⭐, 5분)

- PowerShell에서 `curl.exe -i 내 주소/data/videos.json`을 실행해 첫 줄과 헤더를 읽어요.
- 확인: 첫 줄이 `HTTP/1.1 200 OK` 또는 `HTTP/2 200`이에요. `-i`는 응답 헤더까지 함께 보여 달라는 옵션이에요.
- 힌트: PowerShell 5.1에서 `curl`만 쓰면 다른 명령(`Invoke-WebRequest`)이 실행돼요. 꼭 `curl.exe`로 써요.

## ✅ 정답

:::answer 과제 1 정답 · 팬 게시판 API
📄 C:\dev\streamer-hub\README.md (일부)
```md
| GET | /api/posts?page=1&pageSize=20 | 누구나 | 200 글 목록 |
| GET | /api/posts/{id} | 누구나 | 200 상세, 없으면 404 |
| POST | /api/posts | 로그인 | 201, 로그인 안 하면 401 |
| PUT, DELETE | /api/posts/{id} | 글쓴이 또는 관리자 | 204, 남의 글이면 403 |
```

위 네 줄은 표에서 `GET /api/schedules?from=&to=` 줄 **바로 아래**에 붙여 넣어요.

**왜 이렇게 하나요?** 자원은 `posts`(명사)이고 할 일은 메서드가 말해요. `GET`이면 읽기, `POST`이면 새로 만들기예요. 같은 `/api/posts/{id}` 주소를 `GET`, `PUT`, `DELETE`가 함께 써요. 목록에 `page`·`pageSize`를 쿼리로 붙이는 것은 P1 Day 27의 URL 파라미터와 같은 방식이에요.
:::

:::answer 과제 2 정답 · 상태 코드
1. 401 (로그인하지 않았어요)
2. 403 (로그인했지만 권한이 없어요)
3. 404 (그 번호에 글이 없어요)
4. 201 (새로 만들었어요. 새 글 주소가 `Location` 헤더로 와요)
5. 204 (성공했지만 돌려줄 내용이 없어요)
6. 429 (너무 많은 요청이에요)

**왜 이렇게 하나요?** 숫자만 보고도 누구 잘못인지 알 수 있어요. 4xx는 요청한 쪽 사정이고 5xx는 서버 사정이에요. 그래서 서버 코드는 상황마다 알맞은 코드를 돌려주게 만들어요. 200 하나로 모든 것을 답하지 않아요.
:::

:::answer 과제 3 정답 · curl.exe
```powershell
curl.exe -i https://내아이디.github.io/my-creator-site/data/videos.json
```

예상 출력(헤더 줄과 값은 달라도 돼요. 뒤에는 JSON 본문이 이어져요):

```text
HTTP/2 200
server: GitHub.com
content-type: application/json; charset=utf-8
…
```

**왜 이렇게 하나요?** `curl.exe`는 Windows에 들어 있는 요청 도구예요. REST Client와 같은 일을 터미널에서 해요. 첫 줄이 `HTTP/2 200`으로 보이는 것은 같은 HTTP를 더 새 규격(HTTP/2)으로 보냈기 때문이에요. 내용(200, 헤더, 본문)은 같아요. 서버 쪽 `.http` 파일은 서버를 켜기 전에도 이런 요청을 미리 적어 둘 수 있다는 점이 편해요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 두 파일을 같은 내용으로 맞추고 Day 17을 시작하세요. `README.md`의 `API 설계` 위쪽과 `## 개발 환경`은 Day 2·3의 내용 그대로이고, 개발 환경의 버전 숫자는 내 컴퓨터의 값이어도 괜찮아요.

```text
C:\dev\http-practice\
└─ practice.http       (오늘 새로, 프로젝트 밖의 연습 파일)

C:\dev\streamer-hub\
├─ .git\
├─ README.md           (오늘 바꿈: API 설계 추가)
└─ client\             (그대로)
```

📄 C:\dev\http-practice\practice.http
```http
# 스트리머 허브 연습 파일 (Day 16)
# 요청 위의 Send Request를 누르면 요청이 가요.
# 내아이디를 내 GitHub 아이디로 바꿔요.
@host = https://내아이디.github.io/my-creator-site

### 영상 목록 JSON 가져오기 (200이 와요)
GET {{host}}/data/videos.json

### 없는 주소 (404가 와요)
GET {{host}}/data/nope.json

### 홈페이지 HTML (200이 와요)
GET {{host}}/
```

📄 C:\dev\streamer-hub\README.md
```md
# 스트리머 허브

좋아하는 스트리머의 방송 일정을 확인하고 팬끼리 이야기를 나누는 웹사이트예요.
TypeScript로 화면을, C#으로 서버를, SQLite로 데이터를 만들어요.

## 만들 화면 7개

1. 홈
2. 스트리머 목록·상세
3. 주간 방송 일정
4. 팬 게시판
5. 로그인·가입
6. 관리자 화면
7. OBS 공지 오버레이

## 기술 스택

| 맡은 일 | 기술 |
|---|---|
| 화면 | TypeScript, Vite |
| 서버 | C#, ASP.NET Core |
| 데이터 | SQLite, EF Core |
| 로그인 | ASP.NET Core Identity |
| 테스트 | xUnit |

## 앞으로 채울 것

- 개발 환경 정리 (Day 2~3)
- 실행 방법
- 테스트와 배포 방법

## 요청 살펴보기

| 이름 | 방법 | 상태 | 종류 |
|---|---|---|---|
| contents.html | GET | 200 | document |
| style.css | GET | 200 | stylesheet |
| videos.json | GET | 200 | fetch |
| nope.html | GET | 404 | document |

404는 서버가 그 주소에는 아무것도 없다고 응답했다는 뜻이에요.

## 화면별 역할

| 화면 | 프론트엔드가 그리는 것 | 백엔드에 물어볼 것 |
|---|---|---|
| 홈 | 큰 소개, 버튼, 목록 틀 | 다가오는 방송, 새 글 |
| 스트리머 | 카드, 검색 칸, 배지 | 목록, 이름 검색, 상세 |
| 방송 일정 | 주간 표, 이전·다음 버튼 | 그 주의 일정 목록 |
| 팬 게시판 | 글 목록, 쪽 번호, 글쓰기 칸 | 글 저장, 글 목록, 지우기 |
| 로그인·가입 | 입력칸, 오류 문장 | 비밀번호 확인, 로그인 여부 |
| 관리자 | 등록·수정 칸, 삭제 버튼 | 관리자 권한 확인, 저장 |
| 공지 오버레이 | 투명 배경, 공지 글자 | 새 공지가 올라왔는지 |

## API 설계

주소 앞의 `/api`는 "화면이 아니라 데이터 주소"라는 표시예요. 지금은 초안이에요.

| 메서드 | 주소 | 누가 | 응답 |
|---|---|---|---|
| GET | /api/streamers?q= | 누구나 | 200 스트리머 목록 |
| GET | /api/streamers/{id} | 누구나 | 200 상세, 없으면 404 |
| POST | /api/streamers | 관리자 | 201, 값이 틀리면 400 |
| PUT, DELETE | /api/streamers/{id} | 관리자 | 204, 없으면 404 |
| GET | /api/schedules?from=&to= | 누구나 | 200 일정 목록 |
| GET | /api/posts?page=1&pageSize=20 | 누구나 | 200 글 목록 |
| GET | /api/posts/{id} | 누구나 | 200 상세, 없으면 404 |
| POST | /api/posts | 로그인 | 201, 로그인 안 하면 401 |
| PUT, DELETE | /api/posts/{id} | 글쓴이 또는 관리자 | 204, 남의 글이면 403 |
| GET | /api/notices/current | 누구나 | 200 최근 공지, 없으면 204 |
| POST | /api/notices | 관리자 | 201 |
| POST | /api/auth/register, /api/auth/login | 누구나 | 가입과 로그인 |
| GET | /api/me | 누구나 | 로그인했으면 200, 아니면 204 |

## 개발 환경

- 운영 체제: Windows 11 (버전 24H2)
- PowerShell: 5.1
- Git: git version 2.56.0.windows.4
- Node.js: v26.13.0
- npm: 11.20.0
```

과제 1을 풀고 올렸다면 `git log --oneline`에 `day16: API 설계 초안`과 `day16: 게시판 API 설계`가 보여요. 터미널 위치는 `C:\dev\streamer-hub`이고 `git status`는 `nothing to commit, working tree clean`이에요.
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### `Send Request` 글자가 안 보여요

**원인:** REST Client 확장이 설치되지 않았거나, 파일 이름이 `practice.http`가 아니거나(`practice.http.txt`), 언어 모드가 `HTTP`가 아니에요.

**해결:**

1. 파일 탐색기에서 파일 확장명을 켜 놓고([P1 Day 1](#/day/p1-d01)) 이름이 정확히 `practice.http`인지 확인해요. 열려 있는 파일은 VS Code의 **파일 → 다른 이름으로 저장**으로 이름을 고쳐요.
2. 1단계의 확장 목록에서 REST Client가 **설치됨**인지 확인해요.
3. VS Code 오른쪽 아래 상태 표시줄의 언어 이름을 눌러 `HTTP`를 골라요.

### 요청 두 개가 붙어서 하나로 가요

**원인:** 요청 사이에 `###` 줄이 없거나 `##`처럼 `#`이 3개가 아니에요. 확장은 `###`로 요청을 나눠요.

**해결:** 요청과 요청 사이에 빈 줄과 `###` 줄을 넣어요.

### 응답이 `Error: getaddrinfo ENOTFOUND …`이거나 아무것도 안 와요

**원인:** `@host`의 아이디나 저장소 이름이 틀렸거나(대소문자 포함), 인터넷이 끊겼어요. 주소 중간의 `my-creator-site`는 P1에서 만든 GitHub 저장소 이름이에요.

**해결:**

1. 브라우저에서 `https://내아이디.github.io/my-creator-site/`가 열리는지 먼저 확인해요. 열리면 주소는 맞아요.
2. 인터넷 없이 연습하려면 VS Code로 `C:\dev\my-creator-site`를 열고 Live Preview로 사이트를 열어요(P1 Day 2). 브라우저 주소 표시줄에 `http://127.0.0.1:3000/`처럼 보이는 주소(포트 숫자는 달라질 수 있어요)가 있어요. `@host = http://127.0.0.1:3000`으로 바꾸면 돼요.

### 헤더와 본문 사이 빈 줄 규칙

**원인:** POST처럼 본문이 있는 요청은 요청 줄, 헤더, **빈 줄 하나**, 본문 순서여야 해요. 빈 줄이 없으면 본문이 헤더로 읽혀요. (오늘 요청은 모두 GET이라 본문이 없어요. Day 18부터 만나요.)

**해결:** 헤더(`Content-Type: …`) 아래에 빈 줄을 하나 두고 그다음에 JSON을 써요.

### PowerShell에서 `curl -i …`이 이상한 오류를 내요

```text
Invoke-WebRequest : A parameter cannot be found that matches parameter name 'i'.
```

**원인:** Windows PowerShell 5.1에서 `curl`은 `Invoke-WebRequest`의 별명(alias)이라서 옵션이 달라요. 문구는 PowerShell 버전과 언어에 따라 조금 다를 수 있어요.

**해결:** `curl.exe -i 주소`처럼 `.exe`를 붙여요.

## 📝 오늘의 체크리스트

- [ ] REST Client 확장이 설치되어 있고 `practice.http`에 **Send Request**가 보여요.
- [ ] `videos.json` 요청의 응답 첫 줄이 `HTTP/1.1 200 OK`이고 본문이 JSON이에요.
- [ ] 없는 주소 요청의 응답 첫 줄이 `HTTP/1.1 404 Not Found`예요.
- [ ] 401과 403, 200과 201과 204의 차이를 내 말로 말할 수 있어요.
- [ ] README에 `API 설계` 표가 있고 GitHub에도 올라갔어요(`git push` 끝줄이 `main -> main`).
- [ ] 과제 1을 풀어 게시판 줄 4개를 표에 넣고 올렸어요. 과제 2·3의 답을 정답과 비교했어요.
- [ ] PowerShell 위치가 `C:\dev\streamer-hub`이고 `git status`가 `working tree clean`이에요.

## 📚 더 알아보기

- [HTTP 개요 (MDN)](https://developer.mozilla.org/ko/docs/Web/HTTP/Overview): 요청과 응답의 구조를 한국어로 설명한 문서
- [HTTP 응답 상태 코드 (MDN)](https://developer.mozilla.org/ko/docs/Web/HTTP/Status): 모든 상태 코드의 뜻을 찾아볼 수 있는 문서
- [REST Client 확장 (GitHub)](https://github.com/Huachao/vscode-restclient): `.http` 파일 문법과 변수 사용법을 보여 주는 확장 저장소

➡️ **다음 Day 예고:** [Day 17 · 첫 웹 API](#/day/p2-d17)에서는 C#으로 진짜 서버를 처음 켜고, 오늘 배운 `.http` 파일로 내 서버에 요청을 보내 봐요.
