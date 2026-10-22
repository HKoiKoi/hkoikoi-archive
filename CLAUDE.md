# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

```bash
npm run dev     # 개발 서버 (Turbopack)
npm run build   # 프로덕션 빌드
npm run start   # 빌드 결과 실행
npm run lint    # ESLint 9 (flat config, eslint-config-next)
```

- 테스트 러너가 없다(단일 테스트 실행 명령 없음).
- `.claude/hooks/format-hook.sh`가 Edit/Write 후 `npx --no-install prettier`를 실행한다. Prettier는 의존성에 없으므로 설치되어 있지 않으면 아무 일도 일어나지 않는다.

## Next.js 주의

`AGENTS.md` 규칙: 이 프로젝트의 Next.js(16.4.2)는 학습 데이터와 다르다. 코드를 쓰기 전에 `node_modules/next/dist/docs/`(예: `01-app/`)의 관련 문서를 먼저 읽고 deprecation 안내를 따른다. 라우트 props는 전역 타입을 쓴다(예: `app/layout.tsx`의 `LayoutProps<"/">`).

## 아키텍처

- `src/` 없이 루트에 `app/`(App Router), `components/`, `lib/`를 둔다. 경로 별칭은 `@/*` → `./*`.
- `next.config.ts`: `cacheComponents`, `partialPrefetching`, `experimental.agentFeedback`을 켠다. CSS는 PostCSS가 아니라 Turbopack 규칙으로 `@tailwindcss/turbopack` 로더가 처리한다(PostCSS 설정 없음).
- Tailwind v4 CSS-first: 테마 토큰은 `app/globals.css`(`@theme inline`, `@custom-variant dark`)에 있고 tailwind config 파일은 없다.
- shadcn/ui는 `base-nova` 스타일이며 **Radix가 아니라 Base UI**(`@base-ui/react`) 기반이다. 컴포넌트는 `npx shadcn add <name>`으로 `components/ui/`에 추가하고(현재 `button`만 있음), `components.json`의 별칭을 따른다. `lib/utils.ts`의 `cn`은 `cn` 패키지를 재export한 것이다.

## Claude Code 설정

- 응답·커밋 메시지는 한국어(`.claude/settings.json`의 `language: "ko"`, 커밋은 `타입: 제목` 컨벤셔널 형식).
- `.claude/agents/{dev,docs}/`: 한국어 서브에이전트(코드 리뷰, 로드맵, App Router, UI 마크업, PRD). `.claude/skills/`: git-branch/commit/pr, 그리고 `.agents/skills/`로 연결된 shadcn·migrate-radix-to-base.
- `.mcp.json`: sequential-thinking, shrimp-task-manager. shrimp는 루트 `.env`를 읽으며 `.env.sample`을 복사해 쓴다(`DATA_DIR` 등).
- 상세 규칙은 `docs/guides/`(project-structure, component-patterns, styling-guide, nextjs-16, forms-react-hook-form)를 참고한다.
