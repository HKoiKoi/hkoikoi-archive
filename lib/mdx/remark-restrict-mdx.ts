import { ALLOWED_HTML_TAGS, ALLOWED_MDX_COMPONENTS } from "@/lib/mdx/allowed";

/** 이 플러그인이 다루는 mdast 노드의 최소 형태 (mdast 타입에 직접 의존하지 않는다) */
interface MdxAttribute {
  type: string;
  name?: string;
  value?: unknown;
}
interface MdxNode {
  type: string;
  name?: string | null;
  attributes?: MdxAttribute[];
  children?: MdxNode[];
}

const REMOVED_TYPES = new Set([
  "mdxFlowExpression",
  "mdxTextExpression",
  "mdxjsEsm",
]);
const JSX_TYPES = new Set(["mdxJsxFlowElement", "mdxJsxTextElement"]);
const allowed = new Set<string>([
  ...ALLOWED_MDX_COMPONENTS,
  ...ALLOWED_HTML_TAGS,
]);

/** 문자열 값만 남긴 안전한 속성인지 (표현식·이벤트 핸들러·style 제거) */
function isSafeAttribute(attr: MdxAttribute): boolean {
  if (attr.type !== "mdxJsxAttribute") return false; // {...spread} 제거
  if (attr.value !== null && typeof attr.value !== "string") return false; // ={expr} 제거
  const name = (attr.name ?? "").toLowerCase();
  return !name.startsWith("on") && name !== "style";
}

function restrict(node: MdxNode): void {
  if (!node.children) return;

  node.children = node.children.flatMap((child): MdxNode[] => {
    if (REMOVED_TYPES.has(child.type)) return []; // {...} 표현식·import/export 제거

    if (JSX_TYPES.has(child.type)) {
      const name = child.name ?? null; // null = 프래그먼트
      if (name !== null && !allowed.has(name)) {
        // 허용되지 않은 요소: 페이지를 깨지 않고 오류 안내 요소로 치환
        return [
          {
            type: child.type,
            name: "UnsupportedComponent",
            attributes: [
              { type: "mdxJsxAttribute", name: "name", value: name },
            ],
            children: [],
          },
        ];
      }
      child.attributes = (child.attributes ?? []).filter(isSafeAttribute);
    }

    restrict(child);
    return [child];
  });
}

/**
 * MDX 보안 제한 remark 플러그인.
 * 1) `{...}` 표현식(텍스트·블록·속성)과 import/export 제거
 * 2) 허용 목록 밖의 JSX 요소는 UnsupportedComponent 로 치환
 * 3) on* 이벤트 속성, style 속성 제거
 */
export function remarkRestrictMdx() {
  return (tree: MdxNode) => {
    restrict(tree);
  };
}
