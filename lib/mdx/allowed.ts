/**
 * MDX 허용 목록 (단일 출처).
 * - components/mdx/mdx-components.tsx 의 컴포넌트 맵 키와 반드시 일치시킨다.
 * - 목록에 없는 JSX 요소는 remark 플러그인이 오류 안내 요소로 치환한다.
 */
export const ALLOWED_MDX_COMPONENTS = [
  "Callout",
  "UnsupportedComponent",
] as const;

/** 본문에서 직접 쓸 수 있는 HTML 태그 (스크립트·폼·임베드 계열은 제외) */
export const ALLOWED_HTML_TAGS = [
  "a",
  "abbr",
  "b",
  "br",
  "code",
  "del",
  "details",
  "div",
  "em",
  "figcaption",
  "figure",
  "i",
  "img",
  "kbd",
  "mark",
  "p",
  "pre",
  "small",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
] as const;
