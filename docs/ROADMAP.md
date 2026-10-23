# HKoiKoi.dev 개발 로드맵

채용 담당자가 3분 안에 주니어 백엔드 개발자 함상현의 경력·프로젝트·자격을 확인하고 이력서를 받거나 연락할 수 있게 하는 포트폴리오 겸 기술 블로그.

## 개요

HKoiKoi.dev는 채용 담당자·면접관(방문자)과 관리자 1인(본인)을 위한 포트폴리오 사이트로, 다음 기능을 제공합니다.

- **포트폴리오 공개 (1차)**: 홈 소개 화면, 경력·학력 타임라인, 프로젝트 목록·MDX 케이스 스터디, 자격·어학·논문 (F001~F005, F015)
- **채용 접점 (1차)**: 연락 폼(검증·Turnstile·DB 저장·이메일 알림)과 이력서 PDF 다운로드 (F008, F009)
- **기술 블로그 (2차)**: 태그 필터 블로그 목록, DB 저장 MDX 글 상세, GitHub 1인 관리자 인증과 글 CRUD (F006, F007, F010, F011)
- **관리 편의 (3차)**: 프로젝트 CRUD, 이력서 업로드·교체, 어학 노출 설정 (F012, F013, F014)

기준 문서: `docs/PRD.md`. 프로젝트 규약: `CLAUDE.md`, `AGENTS.md`, `docs/guides/`.

## 기능 ID ↔ Task 매핑

| 기능 ID | 기능명                | 릴리스                    | UI Task            | 기능/연동 Task     |
| ------- | --------------------- | ------------------------- | ------------------ | ------------------ |
| F001    | 홈 소개 화면          | 1차 (최신 글 영역은 2차)  | Task 006           | Task 012, Task 017 |
| F002    | 경력·학력 타임라인    | 1차                       | Task 006           | Task 012           |
| F003    | 프로젝트 목록         | 1차                       | Task 007           | Task 012           |
| F004    | 프로젝트 상세 (MDX)   | 1차                       | Task 007           | Task 012           |
| F005    | 자격·어학·논문        | 1차                       | Task 006           | Task 012           |
| F006    | 블로그 목록·태그 필터 | 2차                       | Task 009           | Task 017           |
| F007    | 블로그 글 상세 (MDX)  | 2차                       | Task 009           | Task 017           |
| F008    | 연락 폼 + 이메일 알림 | 1차                       | Task 008           | Task 013           |
| F009    | 이력서 다운로드       | 1차 (정적) / 3차 (업로드) | Task 008           | Task 014, Task 021 |
| F010    | 관리자 인증           | 2차                       | Task 010           | Task 016           |
| F011    | 블로그 글 CRUD        | 2차                       | Task 010           | Task 018           |
| F012    | 프로젝트 CRUD         | 3차                       | Task 010           | Task 020           |
| F013    | 이력서 업로드·교체    | 3차                       | Task 010           | Task 021           |
| F014    | 공개 설정 (어학 노출) | 3차                       | Task 010           | Task 022           |
| F015    | 공통 레이아웃         | 1차                       | Task 003, Task 004 | Task 015           |

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 별도 작업 파일(`tasks/`)은 만들지 않고 ROADMAP.md의 Task 항목에 직접 작성(추후 shrimp task manager로 이관)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 사항 포함
   - **API/비즈니스 로직 작업 시 "테스트 체크리스트"를 정상/오류/엣지로 나눠 필수 포함 (`도구 → 입력 → 기대 결과` 형식)**
   - 새 작업의 체크박스는 비워 두고 `테스트 결과` 줄은 `(미수행)`으로 둔다. 완료된 작업만 체크 표시와 결과 요약을 반영한다.

3. **작업 구현**
   - ROADMAP.md의 Task 명세를 따름
   - 코드를 쓰기 전에 `node_modules/next/dist/docs/`와 `docs/guides/nextjs-16.md`의 관련 문서를 먼저 확인
   - **API 연동 및 비즈니스 로직 구현 시 E2E 테스트 수행 필수** (아래 "테스트 도구 안내" 참고)
   - 각 단계 후 ROADMAP.md의 Task 진행 상황 업데이트
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시하고 `테스트 결과` 줄에 결과를 기록

### 테스트 도구 안내

- 현재 `.mcp.json`에는 Playwright MCP 서버가 없다(sequential-thinking, shrimp-task-manager만 정의). 따라서 각 시나리오의 도구는 **수동 확인**(브라우저에서 직접 조작)으로 표기했다. Playwright MCP를 추가하면 같은 시나리오를 그대로 Playwright MCP로 실행한다.
- 테스트 러너가 설정돼 있지 않으므로 정적 검증은 **명령**으로 표기하고 `npm run check`(lint + typecheck + format:check)와 `npm run build`를 사용한다. 모든 Task의 공통 완료 조건은 두 명령의 통과다.
- 외부 서비스(Resend, Turnstile, GitHub OAuth, Supabase)는 테스트 키·테스트 계정으로 검증하고, 결과는 Supabase 대시보드(테이블 조회)나 수신 메일함으로 확인한다.

### 표기 규칙

- Phase 제목 끝의 ✅: 완료된 Phase
- Task 제목 끝의 `✅ - 완료`: 테스트를 통과한 작업, `- 우선순위`: 즉시 시작할 작업, 표기 없음: 대기
- 구현 사항의 `✅`: 완료된 세부 항목, `-`만 있는 항목: 미완료
- 테스트 체크리스트의 `[ ]`: 미수행, `[x]`: 통과

## 선행 확인 사항

구현 중 막히지 않도록 아래 항목을 먼저 확보한다. 해당 Task에서 값이 없으면 더미 값으로 진행하고 TODO로 남긴다.

- **콘텐츠 제공 필요** (Task 011 시드 전까지): 프로젝트별 역할·기술·성과와 고객사 공개 범위, 학위 논문 제목·초록·키워드, 주력 기술 스택, 프로필 사진, GitHub·이메일 주소, 정제된 이력서 PDF(생년월일·주소 제외)
- **외부 계정** (Task 011, 013, 015 전까지): Supabase 프로젝트, Resend, Cloudflare Turnstile, Vercel. GitHub OAuth App은 Task 016, Supabase Storage는 Task 021 전까지
- **PoC 확인** (각 Task 안에서 수행): Shiki 연동과 Vercel 함수 크기(Task 007), Base UI `Switch`/`Select`와 react-hook-form 연결(Task 010), GitHub OAuth 콜백 URL 환경별 처리(Task 016), `drizzle-kit` 최신 버전(Task 011), Pretendard 배포 방식(Task 004), `hkoikoi.dev` 도메인 구매 여부(Task 015)
- **개인정보 원칙**: 연봉, 자격증 등록번호, 퇴직사유, 고등학교 정보는 스키마·시드·화면 어디에도 넣지 않는다. 원본 이력 자료는 저장소 밖에 두고 저장소에는 정제된 시드만 커밋한다.

## 개발 단계

### Phase 0: 개발 환경 기반 구축 ✅

- **Task 000: 프로젝트 초기 설정 및 개발 도구 구성** ✅ - 완료
  - ✅ Next.js 16.4.2 + React 19.3 + Tailwind v4(`@tailwindcss/turbopack`) 초기화, `cacheComponents`·`partialPrefetching` 활성화
  - ✅ shadcn/ui `base-nova`(Base UI) 초기 설정과 `components/ui/button.tsx` 추가
  - ✅ ESLint 9, Prettier(Tailwind 클래스 정렬), Husky(pre-commit·commit-msg·pre-push), lint-staged, commitlint 설정
  - ✅ GitHub Actions CI(`check` + `build`) 구성
  - ✅ `docs/guides/` 개발 가이드, Claude Code 에이전트·스킬·훅, MCP 서버 설정
  - ✅ MVP PRD(`docs/PRD.md`) 작성
  - **테스트 체크리스트**
    - [x] 정상: 명령 → `npm run check` → lint·typecheck·format:check 모두 통과
  - **테스트 결과**: 2026-10-22 `npm run check` 통과 (커밋 `4476791` 기준)

### Phase 1: 애플리케이션 골격 구축

- **Task 001: 스타터 정리 및 전체 라우트 구조 생성** ✅ - 우선순위
  - 관련 기능: F015(구조), 전 페이지 / 관련 파일: `app/**`, `lib/site-config.ts`, `public/`
  - create-next-app 기본 화면(`app/page.tsx`)과 `public/*.svg` 제거, 루트 레이아웃 `lang="ko"` 및 사이트 메타데이터(제목 템플릿 `%s | HKoiKoi.dev`, 설명) 설정
  - 공개 라우트 그룹 `app/(site)/` 아래 빈 페이지 생성: `/`, `/about`, `/projects`, `/projects/[slug]`, `/credentials`(자격·어학·논문), `/blog`, `/blog/[slug]`, `/contact`
  - 관리자 라우트 빈 페이지 생성: `/admin/login`, `app/admin/(protected)/` 아래 `/admin`(대시보드), `/admin/posts/new`, `/admin/posts/[id]`, `/admin/projects/new`, `/admin/projects/[id]`
  - 각 라우트에 `PageProps<"/경로">` 전역 타입 사용, 동적 라우트는 `params`를 `await`, `not-found.tsx`(공개 그룹) 추가
  - 릴리스 플래그 `lib/site-config.ts` 작성: `features.blog`, `features.admin`(1차 false), 내비게이션 메뉴 정의, 이력서 경로(`resumeUrl`) 설정. 플래그가 꺼지면 블로그·관리자 라우트는 `notFound()` 처리
  - **수락 기준**: 모든 경로가 404 없이 제목만 있는 빈 페이지로 열리고, 플래그를 끄면 블로그·관리자 경로는 404를 반환한다
  - **테스트 체크리스트**
    - [x] 정상: 수동 확인 → `/`, `/about`, `/projects`, `/projects/sample`, `/credentials`, `/contact` 접속 → 각 페이지 제목 표시
    - [x] 오류: 수동 확인 → 존재하지 않는 `/foo` 접속 → 루트 `app/not-found.tsx` 화면 표시(404). 공개 그룹 `(site)/not-found.tsx`는 그룹 안에서 `notFound()`가 던져질 때 쓰임
    - [x] 엣지: 수동 확인 → `features.blog=false` 상태에서 `/blog`, `/admin/login` 접속 → 404 표시
    - [x] 정상: 명령 → `npm run check && npm run build` → 통과, 빌드 출력에 모든 라우트 표시
  - **테스트 결과**: 통과 (2026-10-22)
    - `npm run check && npm run build` 통과, 빌드 출력에 공개 8개·관리자 7개 라우트 표시
    - 공개 6개 경로 200 + 제목 확인, `/foo` 404, 플래그 off에서 `/blog`, `/blog/x`, `/admin/*` 전부 404
    - 플래그를 임시로 true로 바꿔 재빌드하면 블로그·관리자 경로가 모두 200으로 열림 확인 후 false로 원복
    - 플래그 가드는 `app/(site)/blog/layout.tsx`, `app/admin/layout.tsx` 두 곳에서 처리(정적 플래그라 세션 검사와 달리 부분 렌더링 문제 없음)
    - `[slug]`/`[id]` 페이지는 cacheComponents 빌드 오류 때문에 `params` await를 `<Suspense>` 안에서 수행

- **Task 002: 도메인 타입 및 데이터베이스 스키마 설계** ✅
  - 관련 기능: F001~F014 데이터 / 관련 파일: `lib/types/`, `lib/db/schema.ts`, `lib/schemas/`
  - PRD 데이터 모델 10종(Profile, Experience, Education, Certification, LanguageScore, Thesis, Project, Post, ContactMessage, SiteSetting)을 Drizzle `pgTable` 스키마로 정의(마이그레이션 실행은 Task 011)
  - 목록형 필드(`duties`, `achievements`, `keywords`, `techStack`, `tags`)는 `text[]`, `skills`(카테고리별 그룹)·`focusAreas`·`links`·`gpa`는 `jsonb` 타입 지정, `Post.status`는 `draft | published` enum, `Project.slug`·`Post.slug`는 unique
  - 화면에서 쓰는 뷰 타입(`ProjectCard`, `ProjectDetail`, `PostCard`, `PostDetail`, `HomeMetrics` 등)을 `lib/types/`에 정의해 UI와 DB를 분리
  - 연락 폼 zod 스키마 `lib/schemas/contact.ts`(이름·이메일 형식·내용 길이 제한) 정의
  - 개인정보 제외 필드(연봉, 등록번호, 퇴직사유, 고등학교)가 스키마에 없는지 검토
  - **수락 기준**: 스키마·타입 파일이 타입 검사를 통과하고, Phase 2 더미 데이터가 이 타입을 그대로 사용할 수 있다
  - **테스트 체크리스트**
    - [x] 정상: 명령 → `npm run typecheck` → 통과
    - [x] 오류: 명령 → zod 스키마에 잘못된 이메일·빈 이름을 넣는 임시 스크립트 실행 → 필드별 오류 반환
    - [x] 엣지: 수동 확인 → 스키마 파일 검토 → 금지된 개인정보 필드 0개
  - **테스트 결과**: 통과 (2026-10-22)
    - `npm run check && npm run build` 통과, `drizzle-orm ^0.45.4`·`zod ^4.6.7` 직접 의존성 추가
    - 임시 검증: 빈 이름·잘못된 이메일·짧은 내용 입력 시 `z.flattenError`가 필드별 오류 반환, 정상 입력은 통과
    - 개인정보 키워드 grep 결과 `lib/` 0건
    - 마이그레이션·DB 연결(`lib/db/index.ts`, `drizzle.config.ts`)은 Task 011 범위라 만들지 않음

- **Task 003: 공통 레이아웃 골격 구현** ✅
  - 관련 기능: F015 / 관련 파일: `app/(site)/layout.tsx`, `app/admin/(protected)/layout.tsx`, `components/layout/`
  - `components/layout/site-header.tsx`(로고, 메뉴: 소개·프로젝트·블로그·연락, 이력서 CTA 자리), `site-footer.tsx`(자격·어학·논문, GitHub·이메일, 관리자 링크) 골격 작성
  - 메뉴 항목은 `lib/site-config.ts`에서 읽고, `features.blog`·`features.admin`이 꺼지면 블로그 메뉴·관리자 링크를 렌더링하지 않음
  - 관리자 레이아웃 골격(사이드 또는 상단 메뉴: 대시보드·로그아웃 자리) 작성
  - 현재 경로 강조가 필요한 내비 부분만 클라이언트 컴포넌트로 분리
  - **수락 기준**: 모든 공개 페이지에 같은 헤더·푸터가 보이고 메뉴로 각 페이지 간 이동이 된다
  - **테스트 체크리스트**
    - [x] 정상: 수동 확인 → 헤더 메뉴 각 항목 클릭 → 해당 페이지로 이동하고 현재 메뉴 강조
    - [x] 엣지: 수동 확인 → 1차 플래그 상태에서 헤더·푸터 확인 → 블로그 메뉴와 관리자 링크 미표시
  - **테스트 결과**: 통과 (2026-10-22)
    - `npm run check && npm run build` 통과
    - 공개 6개 경로 모두 같은 헤더·푸터 확인, `aria-current="page"`로 현재 메뉴 강조(`/projects/sample`에서는 프로젝트 메뉴 강조)
    - 플래그 off: 블로그 메뉴·푸터 관리자 링크 미표시 / 임시로 true로 재빌드하면 둘 다 표시 후 false로 원복
    - 클라이언트 컴포넌트는 `components/layout/nav-link.tsx` 하나뿐. cacheComponents에서 `usePathname`이 동적 라우트에서 suspend 되므로 헤더 내비를 `<Suspense>`로 감쌈
    - GitHub·이메일은 `lib/site-config.ts`의 더미 값(TODO)

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- **Task 004: 디자인 시스템 및 반응형 공통 레이아웃 완성** ✅ - 완료
  - 관련 기능: F015 / 관련 파일: `app/globals.css`, `app/layout.tsx`, `components/layout/`
  - `app/globals.css`의 `@theme inline` 토큰을 다크 네이비 배경 + 코랄(#F26B50 계열) 포인트로 재정의하고, 다크를 기본 테마로 고정(`<html className="dark">`, 라이트 전환 없음)
  - ✅ Pretendard 적용: jsDelivr CDN의 `pretendardvariable-dynamic-subset` CSS(v1.3.9)를 `app/layout.tsx`의 `<link>`로 로드(OFL, 동적 서브셋으로 필요한 글리프만 내려받음), `--font-sans` 순환 참조 제거. Geist Mono는 코드용으로 유지
  - ✅ 모바일 햄버거 메뉴 구현(`components/layout/mobile-nav.tsx`, features 플래그 필터 적용): `npx shadcn@latest add sheet`(Base UI Dialog 기반)로 추가 후 헤더에 연결
  - ✅ 공통 `Container`·`Section`·`SectionHeading`(`components/layout/section.tsx`), 전역 `:focus-visible` 링 추가, 다크 토큰 대비 점검
  - **수락 기준**: 360px~1440px 폭에서 레이아웃이 깨지지 않고, 모바일에서는 햄버거 메뉴로 모든 메뉴에 접근할 수 있다
  - **테스트 체크리스트**
    - [x] 정상: 수동 확인 → 375px 폭에서 햄버거 버튼 클릭 → 메뉴 시트 열림, 항목 선택 시 이동 후 닫힘
    - [x] 엣지: 수동 확인 → 키보드 Tab/Esc로 메뉴 조작 → 포커스 이동과 닫기 동작
    - [x] 엣지: 수동 확인 → 1440px 폭 → 데스크톱 메뉴 표시, 햄버거 미표시
  - **테스트 결과**: 통과 — Playwright로 375px에서 햄버거 클릭 시 시트 열림, 항목 선택 시 이동 후 닫힘, Esc로 닫힘, 1440px에서 햄버거 미표시·데스크톱 메뉴 표시, 가로 오버플로 없음 확인. `npm run check && npm run build` 통과.

- **Task 005: 더미 데이터 및 공통 도메인 컴포넌트 구현** ✅ - 완료
  - 관련 기능: F001~F007 / 관련 파일: `lib/dummy/`, `components/project/`, `components/post/`, `components/profile/`, `components/ui/`
  - Task 002 타입을 따르는 더미 데이터 모듈 `lib/dummy/*.ts` 작성(프로필, 경력 2건 이상, 학력, 자격증, 어학, 논문, 프로젝트 3건(대표 1건·비공개 1건 포함), 글 3건(임시저장 1건 포함))
  - 필요한 shadcn 컴포넌트 추가: `npx shadcn@latest add card badge separator`
  - `components/project/project-card.tsx`, `components/post/post-card.tsx`, `components/profile/timeline.tsx`, 기술 태그 `tech-badge.tsx` 구현
  - 더미 데이터 접근은 `lib/queries/` 함수 시그니처(예: `getFeaturedProjects()`)로 감싸서 Phase 3에서 구현만 교체하도록 구성
  - **수락 기준**: 카드·타임라인 컴포넌트가 props만으로 동작하고, 페이지는 더미 쿼리 함수만 호출한다
  - **테스트 체크리스트**
    - [x] 정상: 수동 확인 → 임시 페이지에 카드·타임라인 렌더링 → 제목·요약·기간·태그 표시
    - [x] 엣지: 수동 확인 → 태그 0개, 아주 긴 제목 데이터 → 레이아웃 깨짐 없음(말줄임 처리)
  - **테스트 결과**: 통과 — 임시 페이지(확인 후 삭제)에서 대표·일반 프로젝트 카드, 글 카드, 경력 타임라인(재직 중 "현재" 표시)이 제목·요약·기간·태그를 표시. 비공개 프로젝트·임시저장 글은 쿼리에서 제외됨. 태그 0개 카드는 태그 영역 없이 렌더링되고, 긴 제목은 `line-clamp-2`로 말줄임 처리되며 360px에서 가로 오버플로 없음(Playwright). 더미는 TODO 자리표시자만 사용(가짜 성과·개인정보 없음). `npm run check && npm run build`

- **Task 006: 홈·소개·자격 페이지 UI 완성** ✅ - 완료
  - 관련 기능: F001, F002, F005 / 관련 파일: `app/(site)/page.tsx`, `app/(site)/about/`, `app/(site)/credentials/`, 각 `_components/`
  - 홈: 히어로(이름·직무·원형 링 프로필 사진·`< >` 장식, **[연락하기]**·**[이력서]** 버튼), 기술 스택 띠, 담당 영역 3종, 핵심 수치(경력 기간·자격증 수·석사 학점), 대표 프로젝트 카드, 최신 글 영역(`features.blog`가 꺼지면 숨김)
  - 핵심 수치 계산 함수 `lib/metrics.ts`(경력 개월 수 합산, 자격증 수, 학점 표시) 작성. 임의 수치는 쓰지 않음
  - 소개: 자기소개·전환 스토리, 경력 타임라인(회사·부서·직급·기간·담당업무·성과), 학력 타임라인, **[자격·어학·논문 보기]**·**[프로젝트 보기]** 링크
  - 자격·어학·논문: 자격증 목록, 어학 목록(`showLanguageScores`가 false면 섹션 숨김), 논문(제목·초록·키워드·링크), **[소개로 돌아가기]**
  - **수락 기준**: 세 페이지가 더미 데이터로 PRD의 모든 섹션을 표시하고, 모바일에서도 읽기 쉽다
  - **테스트 체크리스트**
    - [x] 정상: 수동 확인 → 홈 접속 → 히어로·기술 띠·담당 영역 3종·수치·대표 프로젝트 표시
    - [x] 정상: 수동 확인 → 소개 → **[자격·어학·논문 보기]** 클릭 → `/credentials` 이동
    - [x] 엣지: 수동 확인 → 더미 `showLanguageScores=false` → 어학 섹션 미표시
    - [x] 엣지: 명령 → `lib/metrics.ts`에 종료일 없는(재직 중) 경력 입력 → 현재 날짜까지 개월 수 계산
  - **테스트 결과**: 통과 — `next start`에서 curl로 세 페이지의 섹션 렌더링 확인(홈: 히어로·기술 띠·담당 영역 3종·경력 5년 9개월·자격증 2개·석사 학점 4.0 / 4.5·대표 프로젝트, 최신 글은 `features.blog=false`라 미표시). 소개에 경력·학력 타임라인과 `/credentials` 링크, 자격 페이지에 자격증·어학·논문·소개로 돌아가기 표시. `showLanguageScores=false`로 재빌드하면 어학 섹션이 사라지고(원복함), `calculateCareerMonths`는 재직 중 경력을 기준일까지 계산(2021-01 ~ 2026-10-23 → 69개월, 겹치는 기간은 한 번만 계산). 브라우저 시각 확인(360px 가로 오버플로)은 하지 않았다. `npm run check && npm run build` 통과.
    - 프로필 사진(`photoUrl`)이 없어 이름 첫 글자 자리표시 원형 링으로 대체. 이력서 버튼은 `resumeUrl`이 없어 숨김(Task 008에서 `resume-button.tsx`로 통합)
    - 핵심 수치는 `"use cache"` + `cacheLife("days")`로 현재 날짜 계산을 캐시

- **Task 007: 프로젝트 목록·상세 UI 및 MDX 렌더러 구축** ✅ - 완료
  - 관련 기능: F003, F004(F007 공용) / 관련 파일: `app/(site)/projects/`, `components/mdx/`
  - 프로젝트 목록: 대표 프로젝트 우선 정렬, 카드(제목·한 줄 요약·기간·기술 태그)
  - 프로젝트 상세: 메타 정보(기간·역할·기술 스택·저장소·배포 링크), MDX 본문, **[목록으로]**·**[연락하기]** 버튼
  - `components/mdx/mdx-content.tsx`: `next-mdx-remote-client` v2 RSC 렌더러. import/export 비활성화, `{...}` 표현식 제거 플러그인, 허용 컴포넌트 맵(`components/mdx/mdx-components.tsx` 한 파일에 고정) 적용, 컴파일 오류 객체 반환
  - Shiki 4 rehype 연동으로 코드 블록 하이라이트 PoC, `npm run build` 후 서버 함수 크기 확인(결과를 이 Task에 기록)
  - 비공개·존재하지 않는 slug는 `notFound()` 처리(더미 기준)
  - **수락 기준**: 더미 MDX 본문(제목·목록·코드 블록·표)이 스타일과 하이라이트가 적용돼 렌더링되고, 금지 문법은 렌더링되지 않는다
  - **테스트 체크리스트**
    - [x] 정상: 수동 확인 → `/projects`에서 대표 프로젝트 카드 클릭 → 상세 이동, 코드 블록 하이라이트 표시
    - [x] 오류: 수동 확인 → 본문에 `import x from "y"` 또는 `{process.env}` 포함 더미 → 실행되지 않고 오류 또는 제거 처리
    - [x] 오류: 수동 확인 → 비공개 프로젝트 slug, 없는 slug 접속 → 404
    - [x] 엣지: 수동 확인 → 허용되지 않은 컴포넌트 `<Foo />` 포함 본문 → 페이지 전체가 깨지지 않고 오류 안내
  - **테스트 결과**: 통과 — `next start`에서 `/projects`는 대표 우선 카드 그리드, `/projects/sample-featured-project`는 메타 헤더·`prose-mdx` 본문·목록으로·연락하기를 표시. 없는 slug는 not-found UI. 구현 중 임시 MDX 본문으로 `{1+1}` 표현식·import 제거, `<Callout>` 렌더링, `<Evil onClick>`·`<script>`는 "허용되지 않은 컴포넌트" 안내로 치환, 닫히지 않은 JSX는 본문 영역에만 `role="alert"` 오류(페이지 유지), java 코드 블록 Shiki 하이라이트와 미지원 언어 텍스트 폴백을 확인하고 원복함. 최종 더미 본문에는 코드 블록이 없어 통합 상태의 하이라이트·표 렌더링은 브라우저로 재확인하지 않았다. 브라우저 시각 확인(360px)도 하지 않았다. `npm run check && npm run build` 통과.
    - **Shiki 서버 함수 크기**(로컬 `next build`의 `page.js.nft.json` 추적 파일 합계, 압축 전): `/projects/[slug]` 4,134,462B(약 3.94MiB, 252개 파일), `/projects` 2,246,729B(약 2.14MiB). Shiki 관련 28개 파일 857,284B(언어 9개 약 0.65MB, 테마 2개 각 약 11KB), mdx·micromark·remark 18개 약 43.7KB. `shiki/core` + JS 정규식 엔진만 사용해 Oniguruma WASM(약 652KB)은 제외. Vercel 실제 배포 크기는 측정하지 않았다.
    - 설계 메모: Shiki가 프리렌더 중 `Date.now()`를 호출해 `MdxContent`에 `"use cache"` 적용(기본 revalidate 15분). Task 010 미리보기는 `compileMdx`를 직접 호출한다. `@shikijs/langs`·`@shikijs/themes`는 Shiki 하위 패키지로 PRD에 별도 기재가 없다. Suspense 안의 `notFound()`라 HTTP 상태는 200(404 상태가 필요하면 후속 검토). 상세 `generateMetadata`는 미작성

- **Task 008: 연락 페이지 및 이력서 버튼 UI 완성** ✅ - 완료
  - 관련 기능: F008(UI), F009(UI) / 관련 파일: `app/(site)/contact/`, `components/profile/resume-button.tsx`
  - shadcn 컴포넌트 추가: `npx shadcn@latest add input textarea label field`
  - 연락 폼 UI(이름·이메일·내용, **[보내기]**, Turnstile 위젯 자리, 필드별 오류 메시지 자리, 완료 메시지 영역) 작성. 상태는 `useActionState` 패턴을 전제로 목 액션 연결
  - GitHub·이메일 링크 영역
  - `resume-button.tsx`: `download` 속성 링크, `resumeUrl`이 없으면 렌더링하지 않음. 홈 히어로·헤더 CTA·연락 페이지에서 재사용
  - **수락 기준**: 목 액션으로 성공·실패 상태가 같은 페이지에서 표시되고, 이력서 버튼은 경로가 없을 때 숨겨진다
  - **테스트 체크리스트**
    - [x] 정상: 수동 확인 → 목 성공 액션으로 제출 → 완료 메시지 표시, 페이지 이동 없음
    - [x] 오류: 수동 확인 → 목 실패 액션 → 오류 메시지 표시, 입력값 유지
    - [x] 엣지: 수동 확인 → `resumeUrl` 비움 → 홈·헤더·연락의 이력서 버튼 미표시
  - **테스트 결과**: 통과 — dev 서버 + Playwright로 `/contact`에서 확인. 이름·이메일·내용 검증 오류(잘못된 이메일, 10자 미만)는 필드별 메시지와 함께 입력값이 유지되고, 내용에 `[mock:fail]`을 넣은 목 실패는 오류 안내 후 입력값 유지, 정상 입력은 같은 페이지(`/contact`)에서 완료 메시지 표시 후 폼 초기화. `resumeUrl`을 임시로 `/resume.pdf`로 두면 홈(히어로·헤더)·연락(헤더·본문)에 `download` 링크가 나타나고 `undefined`(원복)면 모두 사라진다. 모바일 시트 메뉴의 이력서 링크와 360px 시각 확인은 하지 않았다. `npm run check && npm run build` 통과.
    - 목 액션은 `app/(site)/contact/actions.ts`(Task 011에서 교체), 상태 타입·초기값은 `state.ts`("use server" 파일은 비동기 함수만 export 가능). Turnstile은 점선 자리표시자. `shadcn add`가 만든 `field.tsx`의 `==`는 lint 규칙에 맞춰 `===`로 수정

- **Task 009: 블로그 목록·상세 UI 완성**
  - 관련 기능: F006, F007 / 관련 파일: `app/(site)/blog/`
  - 블로그 목록: 글 카드(제목·요약·발행일·태그), 태그 필터(`?tag=` 검색 파라미터, 요청 시점 데이터이므로 `<Suspense>` 경계 안에서 읽음), 발행 글만 대상
  - 블로그 상세: 제목·발행일·태그, Task 007 MDX 렌더러 재사용, **[목록으로]**
  - 개발 중에는 `features.blog`를 로컬에서만 켜고 확인
  - **수락 기준**: 더미 글 기준으로 태그 필터와 상세 이동이 동작하고, 임시저장 글은 목록·상세 어디에도 나오지 않는다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → `/blog`에서 태그 클릭 → URL `?tag=` 반영, 해당 태그 글만 표시
    - [ ] 오류: 수동 확인 → 임시저장 글 slug로 `/blog/<slug>` 접속 → 404
    - [ ] 엣지: 수동 확인 → 존재하지 않는 태그 `?tag=none` → 빈 상태 안내와 전체 보기 링크
  - **테스트 결과**: (미수행)

- **Task 010: 관리자 화면 UI 완성**
  - 관련 기능: F010~F014(UI) / 관련 파일: `app/admin/**`, `components/admin/`
  - 관리자 로그인: **[GitHub로 로그인]** 버튼, 실패 안내 영역(`?error=` 기준)
  - 대시보드: 글 목록(임시저장/발행 상태)·프로젝트 목록(공개/비공개, 대표)과 삭제 확인 다이얼로그, **[새 글]**·**[새 프로젝트]**, 이력서 PDF 업로드 영역, 어학 노출 토글, **[로그아웃]**
  - `components/admin/mdx-editor.tsx`: 글·프로젝트 편집이 공유하는 MDX 입력 + 미리보기 패널 + 문법 오류 표시 영역
  - 글 편집 폼(제목·slug·요약·태그·본문, **[임시저장]**·**[발행]**·**[삭제]**), 프로젝트 편집 폼(제목·slug·요약·기간·역할·기술 태그·링크·본문, 공개·대표 스위치, **[저장]**·**[삭제]**)
  - react-hook-form + zod + `@hookform/resolvers` 설치, `docs/guides/forms-react-hook-form.md` 패턴 적용. shadcn `switch select dialog alert-dialog table` 추가 후 Base UI `Switch`/`Select`와 `Controller` 연결 PoC
  - **수락 기준**: 더미 데이터로 모든 관리자 화면 간 이동이 되고, 폼 클라이언트 검증 오류가 필드별로 표시된다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 대시보드 **[새 글]** → 글 편집 이동, 본문 입력 → 미리보기 갱신(목)
    - [ ] 오류: 수동 확인 → 제목·slug 비우고 **[발행]** → 필드별 오류 표시, 제출 안 됨
    - [ ] 엣지: 수동 확인 → 공개·대표 `Switch` 토글 후 제출 → react-hook-form 값에 boolean으로 반영
    - [ ] 엣지: 수동 확인 → 삭제 버튼 → 확인 다이얼로그에서 취소 시 아무 변화 없음
  - **테스트 결과**: (미수행)

### Phase 3: 핵심 기능 구현 (1차 공개 릴리스)

- **Task 011: Supabase·Drizzle 연결 및 시드 데이터 입력**
  - 관련 기능: F001~F005, F008 데이터 / 관련 파일: `lib/db/index.ts`, `drizzle.config.ts`, `drizzle/`, `scripts/seed.ts`, `.env.sample`
  - `drizzle-orm`, `postgres`, `drizzle-kit`(최신 버전 확인) 설치
  - `lib/db/index.ts`: `import "server-only"`, 트랜잭션 풀러(6543) `DATABASE_URL` + `prepare: false`, 모듈 스코프 클라이언트 1개
  - `drizzle.config.ts`: 세션 풀러(5432) `DIRECT_URL`로 마이그레이션 생성·적용, `package.json`에 `db:generate`·`db:migrate`·`db:seed` 스크립트 추가
  - `scripts/seed.ts`: 정제된 이력 데이터(저장소 내 시드 파일)를 멱등(upsert)으로 입력. SiteSetting 1건(`showLanguageScores=true`) 포함
  - `.env.sample`에 `DATABASE_URL`, `DIRECT_URL` 키 추가
  - **수락 기준**: 빈 DB에 마이그레이션과 시드를 적용하면 모든 테이블과 시드 행이 생성되고, 시드를 두 번 실행해도 중복이 생기지 않는다
  - **테스트 체크리스트**
    - [ ] 정상: 명령 → `npm run db:migrate && npm run db:seed` → 성공, Supabase 대시보드에서 행 확인
    - [ ] 오류: 명령 → 잘못된 `DATABASE_URL`로 시드 실행 → 명확한 연결 오류 후 종료 코드 1
    - [ ] 엣지: 명령 → 시드 2회 실행 → 행 수 동일
  - **테스트 결과**: (미수행)

- **Task 012: 공개 조회 쿼리 및 캐시 계층 구현**
  - 관련 기능: F001~F005 / 관련 파일: `lib/queries/*.ts`, `app/(site)/**`
  - Task 005의 더미 쿼리 함수를 Drizzle 조회로 교체: 프로필, 경력·학력, 자격·어학·논문, 공개 프로젝트 목록(대표 우선), 프로젝트 상세(공개만)
  - 모든 공개 읽기 함수에 `'use cache'` + `cacheTag`(`profile`, `projects`, `settings`) + `cacheLife` 적용. 홈 핵심 수치(경력 기간 등 날짜 계산)는 `use cache` 함수 안에서 계산
  - 프로젝트 상세는 `generateStaticParams`로 공개 slug를 미리 생성하고, 그 외 slug는 `notFound()`
  - 어학 섹션은 SiteSetting `showLanguageScores`를 읽어 노출 결정
  - Cache Components 규칙 준수: 캐시 함수 안에서 `cookies()`/`headers()` 미사용, 요청 시점 데이터는 `<Suspense>` 안에서만 사용
  - **수락 기준**: 더미 import가 공개 페이지에서 모두 사라지고, `npm run build` 시 공개 페이지가 정적 셸로 생성된다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 홈·소개·프로젝트·자격 페이지 → 시드 데이터 표시, 핵심 수치가 시드에서 계산된 값과 일치
    - [ ] 오류: 수동 확인 → DB에서 프로젝트 `isPublished=false`로 변경 후 재배포 → 목록에서 사라지고 상세 404
    - [ ] 엣지: 수동 확인 → DB에서 `showLanguageScores=false` 후 재배포 → 어학 섹션 숨김
    - [ ] 정상: 명령 → `npm run build` → Cache Components 관련 오류 없음
  - **테스트 결과**: (미수행)

- **Task 013: 연락 폼 서버 처리 및 이메일 알림 구현**
  - 관련 기능: F008 / 관련 파일: `app/(site)/contact/actions.ts`, `lib/turnstile.ts`, `lib/mail.ts`, `.env.sample`
  - `resend` 설치, Turnstile 위젯 연결(`NEXT_PUBLIC_TURNSTILE_SITE_KEY`), 토큰을 FormData로 전달
  - Server Action `sendContactMessage`: zod 서버 검증 → Turnstile siteverify 검증(서버 필수) → ContactMessage 저장 → `after()`로 Resend 알림 발송(실패는 로그만 남기고 사용자 응답은 저장 결과 기준)
  - 실패 응답 시 클라이언트에서 Turnstile 위젯 재설정(토큰 1회용·5분 유효), 입력값 유지
  - 환경 변수: `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`(도메인 확보 전 테스트 발신 주소)
  - **수락 기준**: 유효한 문의는 DB에 저장되고 본인 메일함에 알림이 오며, 검증·봇 확인 실패 시 저장되지 않는다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 이름·이메일·내용 입력 후 **[보내기]** → 완료 메시지, DB에 1행 추가, 알림 메일 수신
    - [ ] 오류: 수동 확인 → 이메일 형식 오류·빈 내용 제출 → 필드별 오류, DB 저장 없음
    - [ ] 오류: 수동 확인 → Turnstile 테스트 실패 키 사용 → "봇 확인 실패" 오류, DB 저장 없음, 위젯 재설정
    - [ ] 엣지: 수동 확인 → 내용 최대 길이 초과, 같은 토큰 재사용 제출 → 거부
    - [ ] 엣지: 수동 확인 → `RESEND_API_KEY`를 잘못된 값으로 설정 → 사용자에게는 완료 표시, DB 저장됨, 서버 로그에 발송 실패 기록
  - **테스트 결과**: (미수행)

- **Task 014: 이력서 정적 제공 및 1차 공개 설정 적용**
  - 관련 기능: F009(1차), F001(최신 글 숨김), F015 / 관련 파일: `public/resume/`, `lib/site-config.ts`, `public/profile.*`
  - 개인정보를 뺀 이력서 PDF를 `public/resume/` 아래 버전 파일명으로 두고 `resumeUrl` 설정, 프로필 사진도 정적 파일로 배치
  - 1차 플래그 최종 확인: 헤더 블로그 메뉴, 푸터 관리자 링크, 홈 최신 글 영역 숨김, 블로그·관리자 라우트 404
  - 사이트 메타데이터·Open Graph 기본값(이름·직무·설명) 정리
  - **수락 기준**: 홈·헤더·연락의 **[이력서]** 버튼이 페이지 이동 없이 PDF를 내려받고, 1차에서 숨겨야 할 요소가 모두 보이지 않는다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 홈 **[이력서]** 클릭 → PDF 다운로드, 현재 페이지 유지
    - [ ] 엣지: 수동 확인 → `/blog`, `/admin`, 푸터 관리자 링크 → 404 또는 미표시
    - [ ] 엣지: 수동 확인 → PDF 열어 생년월일·주소 미포함 확인
  - **테스트 결과**: (미수행)

- **Task 015: 1차 통합 테스트 및 Vercel 배포**
  - 관련 기능: 1차 전체(F001~F005, F008, F009, F015) / 관련 파일: `app/api/cron/keepalive/route.ts`, `vercel.json`
  - Vercel 프로젝트 연결과 환경 변수(Production/Preview) 등록, 도메인 연결(확보 시)
  - Supabase 일시정지 방지 Cron: `app/api/cron/keepalive/route.ts`(`CRON_SECRET` 헤더 검증 후 가벼운 `select 1`), `vercel.json`에 일 1회 스케줄
  - 1차 사용자 여정 전체 E2E 확인(데스크톱·모바일 폭), 리팩터 필요 항목 기록
  - **수락 기준**: 배포 URL에서 1차 사용자 여정이 모두 동작하고, 지원서에 링크를 넣을 수 있는 상태가 된다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 홈 → 대표 프로젝트 → 상세 → **[연락하기]** → 문의 전송 → 완료 메시지
    - [ ] 정상: 수동 확인 → 홈 → 소개 → 자격·어학·논문 → 소개로 돌아가기
    - [ ] 오류: 수동 확인 → `CRON_SECRET` 없이 `/api/cron/keepalive` 호출 → 401
    - [ ] 정상: 수동 확인 → Vercel Cron 실행 로그 → 200 응답 기록
    - [ ] 엣지: 수동 확인 → 375px 모바일 폭에서 위 여정 반복 → 햄버거 메뉴로 모든 이동 가능
  - **테스트 결과**: (미수행)

### Phase 4: 블로그 및 관리자 기능 구현 (2차 릴리스)

- **Task 016: 관리자 인증 시스템 구축 (Better Auth + GitHub)**
  - 관련 기능: F010 / 관련 파일: `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`, `proxy.ts`, `lib/auth/require-admin.ts`
  - `better-auth` 설치, Drizzle 어댑터 연결, 라이브러리 생성 스키마(user·session·account·verification)로 마이그레이션
  - GitHub 소셜 로그인 설정, 허용 계정은 `ADMIN_GITHUB_ID`(GitHub 숫자 user id)와 비교해 불일치 시 로그인 거부 후 `/admin/login?error=forbidden` 리디렉션
  - 루트 `proxy.ts`: `/admin/**`(로그인 제외)에서 세션 쿠키가 없으면 로그인으로 낙관적 리디렉션만 수행
  - `requireAdmin()`: 관리자 페이지 레이아웃·각 Server Action 시작부에서 세션을 다시 검증(`import "server-only"`)
  - 로그아웃 → 홈 이동, 환경별 OAuth 콜백 URL(로컬·Preview·Production) 처리 PoC, `.env.sample`에 `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ADMIN_GITHUB_ID` 추가
  - **수락 기준**: 허용 계정만 대시보드에 들어갈 수 있고, 프록시를 우회해도 페이지·액션에서 다시 차단된다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 푸터 관리자 링크 → **[GitHub로 로그인]** (허용 계정) → `/admin` 대시보드 표시
    - [ ] 오류: 수동 확인 → 허용되지 않은 GitHub 계정으로 로그인 → 로그인 실패 안내, 세션 없음
    - [ ] 오류: 수동 확인 → 비로그인 상태로 `/admin/posts/new` 접속 → `/admin/login` 리디렉션
    - [ ] 엣지: 수동 확인 → 비로그인 상태로 관리자 Server Action 직접 호출(개발자 도구로 요청 재전송) → 거부 응답
    - [ ] 정상: 수동 확인 → **[로그아웃]** → 홈 이동, 이후 `/admin` 접근 시 로그인으로 이동
  - **테스트 결과**: (미수행)

- **Task 017: 블로그 공개 조회 연동 및 홈 최신 글 활성화**
  - 관련 기능: F006, F007, F001(최신 글) / 관련 파일: `lib/queries/posts.ts`, `app/(site)/blog/`, `app/(site)/page.tsx`
  - 발행 글 목록(최신순)·태그 목록·태그별 목록·slug 상세 쿼리 구현, `'use cache'` + `cacheTag("posts")`·`cacheTag("post:<slug>")`
  - 공개 상세는 `status=published`만 조회, 임시저장·없는 slug는 `notFound()`
  - 홈 최신 글 카드(최신 3건) 연결
  - **수락 기준**: 시드로 넣은 발행 글이 목록·상세·홈에 표시되고 임시저장 글은 어디에도 나오지 않는다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 홈 최신 글 카드 클릭 → 블로그 상세 이동, 코드 하이라이트 표시
    - [ ] 정상: 수동 확인 → `/blog?tag=<태그>` → 해당 태그의 발행 글만 최신순 표시
    - [ ] 오류: 수동 확인 → 임시저장 글 slug 접속 → 404
    - [ ] 엣지: 수동 확인 → 발행 글 0건 → 블로그 목록 빈 상태 안내, 홈 최신 글 영역 숨김
  - **테스트 결과**: (미수행)

- **Task 018: 블로그 글 CRUD 및 MDX 미리보기 구현**
  - 관련 기능: F011 / 관련 파일: `app/admin/(protected)/posts/actions.ts`, `lib/schemas/post.ts`, `components/admin/mdx-editor.tsx`
  - zod 스키마 `lib/schemas/post.ts`(제목·slug 형식·요약·태그·본문) 작성, 편집 폼과 서버 액션이 공유
  - Server Action: 생성·수정·임시저장·발행·삭제. 각 액션은 `requireAdmin()` 후 실행, slug 중복 검사, 최초 발행 시 `publishedAt` 기록, `updatedAt` 갱신
  - 저장 후 `updateTag("posts")`·`updateTag("post:<slug>")` 호출, slug 변경 시 이전 태그도 갱신, 완료 후 대시보드로 이동
  - 미리보기 Server Action: 서버에서 MDX 컴파일 후 결과 또는 오류 객체(줄·메시지)를 반환, 임시저장 글도 미리보기 가능
  - 대시보드 글 목록 실제 데이터 연결(상태 표시, 삭제 확인)
  - **수락 기준**: 관리자가 웹에서 글을 작성·임시저장·발행·수정·삭제할 수 있고, 발행 즉시 공개 목록에 반영된다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 새 글 작성 → **[발행]** → 대시보드 이동, `/blog` 목록 맨 위에 표시
    - [ ] 정상: 수동 확인 → 본문에 코드 블록 입력 → 미리보기에 하이라이트 표시
    - [ ] 오류: 수동 확인 → 이미 있는 slug로 저장 → "이미 사용 중인 주소" 오류, 저장 안 됨
    - [ ] 오류: 수동 확인 → 닫히지 않은 JSX 태그 입력 → 미리보기에 문법 오류 위치 표시, 발행 차단
    - [ ] 엣지: 수동 확인 → 발행 글을 임시저장으로 되돌림 → 공개 목록에서 즉시 사라지고 상세 404
    - [ ] 엣지: 수동 확인 → 발행 글 수정 후 재발행 → `publishedAt` 유지, `updatedAt` 갱신
  - **테스트 결과**: (미수행)

- **Task 019: 2차 통합 테스트 및 블로그 공개 전환**
  - 관련 기능: 2차 전체(F001 최신 글, F006, F007, F010, F011)
  - `features.blog`, `features.admin`을 켜고 헤더 블로그 메뉴·푸터 관리자 링크·홈 최신 글 영역 노출
  - Production GitHub OAuth App 콜백 URL 등록, 환경 변수 반영 후 배포
  - 관리자 글 발행부터 방문자 열람까지 전체 여정 확인
  - **수락 기준**: 배포 환경에서 관리자가 글을 발행하면 재배포 없이 방문자가 볼 수 있다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 관리자 로그인 → 새 글 발행 → 로그아웃 → 홈 최신 글 → 상세 열람
    - [ ] 오류: 수동 확인 → 배포 환경에서 허용 외 계정 로그인 → 실패 안내
    - [ ] 엣지: 수동 확인 → 글 삭제 → 목록·상세·홈에서 즉시 사라짐
  - **테스트 결과**: (미수행)

### Phase 5: 관리 편의 기능 구현 (3차 릴리스)

- **Task 020: 프로젝트 CRUD 구현**
  - 관련 기능: F012 / 관련 파일: `app/admin/(protected)/projects/actions.ts`, `lib/schemas/project.ts`
  - zod 스키마 `lib/schemas/project.ts`(제목·slug·요약·기간·역할·기술 태그·링크 URL·본문·공개·대표)
  - Server Action 생성·수정·삭제(`requireAdmin()`, slug 중복 검사), 저장 후 `updateTag("projects")`
  - 글 편집과 같은 `mdx-editor`·미리보기 재사용, 대시보드 프로젝트 목록 실제 데이터 연결
  - 동적 slug가 새로 생기므로 프로젝트 상세의 미리 생성되지 않은 slug 처리 확인(Suspense·캐시 동작)
  - **수락 기준**: 배포 없이 프로젝트를 추가·수정·비공개·대표 지정할 수 있고 공개 화면에 즉시 반영된다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 새 프로젝트 저장(공개·대표) → 홈 대표 프로젝트와 목록 맨 앞에 표시
    - [ ] 오류: 수동 확인 → 링크에 URL 형식이 아닌 값 → 필드 오류, 저장 안 됨
    - [ ] 엣지: 수동 확인 → 기존 프로젝트를 비공개로 전환 → 목록에서 사라지고 상세 404
    - [ ] 엣지: 수동 확인 → 새로 만든 slug 상세 접속 → 재배포 없이 정상 표시
  - **테스트 결과**: (미수행)

- **Task 021: 이력서 업로드·교체 구현**
  - 관련 기능: F013, F009(3차) / 관련 파일: `lib/storage.ts`, `app/admin/(protected)/actions.ts`, `components/profile/resume-button.tsx`
  - `@supabase/supabase-js` 설치, 서버 전용 클라이언트(`import "server-only"`, 서비스 키)로 서명 업로드 URL만 발급하고 브라우저가 직접 업로드
  - 파일명에 버전(타임스탬프)을 붙여 업로드 후 `SiteSetting.resumeFilePath` 갱신, `updateTag("settings")`
  - 이력서 버튼이 `resumeFilePath`(공개 URL)를 우선 사용하고, 값이 없으면 버튼 숨김. 정적 파일 경로는 제거 또는 대체 경로로만 유지
  - 업로드 검증: PDF MIME·확장자, 최대 크기(예: 5MB), 관리자 세션
  - `.env.sample`에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, 버킷 이름 추가
  - **수락 기준**: 관리자가 PDF를 올리면 재배포 없이 공개 이력서가 새 파일로 바뀌고, 이전 파일 캐시가 남지 않는다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 대시보드에서 PDF 업로드 → 성공 안내, 홈 **[이력서]**가 새 파일 다운로드
    - [ ] 오류: 수동 확인 → `.png` 또는 5MB 초과 파일 업로드 → 거부 안내, `resumeFilePath` 변화 없음
    - [ ] 오류: 수동 확인 → 비로그인 상태로 서명 URL 발급 액션 호출 → 거부
    - [ ] 엣지: 수동 확인 → `resumeFilePath` 비움 → 모든 이력서 버튼 숨김
  - **테스트 결과**: (미수행)

- **Task 022: 어학 노출 설정 토글 구현**
  - 관련 기능: F014, F005 / 관련 파일: `app/admin/(protected)/actions.ts`, `app/admin/(protected)/_components/`
  - 대시보드 어학 노출 `Switch`를 Server Action과 연결(`requireAdmin()`, `showLanguageScores` 갱신, `updateTag("settings")`)
  - `useOptimistic`으로 토글 즉시 반영, 실패 시 원래 값으로 복원하고 오류 안내
  - **수락 기준**: 토글을 끄면 재배포 없이 자격·어학·논문 페이지에서 어학 섹션이 사라진다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 토글 끔 → `/credentials`에서 어학 섹션 미표시, 다시 켜면 표시
    - [ ] 오류: 수동 확인 → 액션 실패 상황(DB 연결 끊김 시뮬레이션) → 토글이 원래 값으로 복원, 오류 안내
    - [ ] 엣지: 수동 확인 → 토글 빠르게 연속 클릭 → 최종 상태와 DB 값 일치
  - **테스트 결과**: (미수행)

- **Task 023: 3차 통합 테스트**
  - 관련 기능: 3차 전체(F012, F013, F014)와 1·2차 회귀
  - 관리자 대시보드에서 프로젝트·이력서·공개 설정을 모두 수정한 뒤 공개 화면 반영 확인
  - 1차·2차 핵심 여정 회귀 테스트
  - **수락 기준**: 배포 없이 PRD 3차 범위의 주요 콘텐츠를 모두 수정할 수 있다
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 프로젝트 수정 → 이력서 교체 → 어학 끔 → 로그아웃 → 공개 화면에서 세 변경 모두 확인
    - [ ] 오류: 수동 확인 → 세션 만료 후 대시보드 액션 실행 → 로그인 페이지로 이동
    - [ ] 엣지: 수동 확인 → 1차 여정(Task 015)과 2차 여정(Task 019) 반복 → 회귀 없음
  - **테스트 결과**: (미수행)

### Phase 6: 최적화 및 운영 안정화

- **Task 024: 성능·접근성 최적화**
  - 관련 기능: 전 페이지 / 관련 파일: `app/**`, `next.config.ts`
  - Lighthouse(모바일) 성능·접근성 점검, 목표: 각 90점 이상
  - 프로필 사진 `next/image` 최적화, 폰트 서브셋·`display` 설정, 클라이언트 컴포넌트 범위 축소
  - `<Link>` prefetch 정책 점검(partialPrefetching 기본 동작 유지, 필요한 링크만 `prefetch={true}`)
  - `sitemap.ts`, `robots.ts` 추가(관리자 경로 제외)
  - **수락 기준**: 주요 공개 페이지가 Lighthouse 모바일 기준 성능·접근성 90점 이상
  - **테스트 체크리스트**
    - [ ] 정상: 수동 확인 → 홈·프로젝트 상세·블로그 상세 Lighthouse 실행 → 90점 이상
    - [ ] 엣지: 수동 확인 → `/robots.txt` → `/admin` 차단, `/sitemap.xml` → 공개 페이지·발행 글·공개 프로젝트만 포함
  - **테스트 결과**: (미수행)

- **Task 025: E2E 테스트 자동화 및 운영 모니터링 구성**
  - 관련 기능: 전체 품질 보증
  - Playwright MCP 서버를 `.mcp.json`에 추가하고, 이 로드맵의 "수동 확인" 시나리오를 Playwright MCP로 재실행
  - (선택) `@playwright/test`로 핵심 여정(1차·2차) 스모크 테스트를 작성하고 CI에 추가
  - Vercel 로그·Cron 실행 결과, Resend 발송 실패 로그를 주기적으로 확인하는 운영 체크리스트 작성
  - **수락 기준**: 핵심 사용자 여정이 자동 테스트로 재현되고, 운영 중 장애(Cron 실패, 메일 발송 실패)를 확인할 경로가 있다
  - **테스트 체크리스트**
    - [ ] 정상: Playwright MCP → Task 015·019·023 시나리오 실행 → 모두 통과
    - [ ] 오류: 명령 → 의도적으로 깨뜨린 빌드로 CI 실행 → 실패로 표시
  - **테스트 결과**: (미수행)

## MVP 이후 (범위 외)

PRD에서 제외한 항목이다. 필요해지면 위 워크플로우에 따라 새 Task로 추가한다.

- 경력·학력·자격증·어학·논문·프로필 편집 폼(MVP는 시드 입력)
- 사회활동 노출, 문의 내역 관리자 열람 화면
- 댓글, 조회수·좋아요, 검색, 시리즈, RSS
- 영문 지원, 라이트 모드 전환, 이력서 PDF 자동 생성
