import "server-only";

import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

/**
 * Shiki 하이라이터 (세립 번들).
 * 전체 번들(`shiki`, Oniguruma WASM)을 쓰지 않고 JS 정규식 엔진과
 * 필요한 언어·테마만 정적으로 import 해 서버리스 함수 크기를 줄인다.
 */
let highlighterPromise: ReturnType<typeof createHighlighterCore> | undefined;

function getHighlighter() {
  highlighterPromise ??= createHighlighterCore({
    themes: [
      import("@shikijs/themes/github-light"),
      import("@shikijs/themes/github-dark"),
    ],
    langs: [
      import("@shikijs/langs/java"),
      import("@shikijs/langs/python"),
      import("@shikijs/langs/sql"),
      import("@shikijs/langs/typescript"),
      import("@shikijs/langs/tsx"),
      import("@shikijs/langs/javascript"),
      import("@shikijs/langs/json"),
      import("@shikijs/langs/bash"),
      import("@shikijs/langs/yaml"),
      import("@shikijs/langs/dockerfile"),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighterPromise;
}

type ShikiTransformer = ReturnType<typeof rehypeShikiFromHighlighter>;

/** 비동기로 하이라이터를 준비한 뒤 코드 블록을 변환하는 rehype 플러그인 */
export function rehypeShiki() {
  return async (
    tree: Parameters<ShikiTransformer>[0],
    file: Parameters<ShikiTransformer>[1],
  ) => {
    const highlighter = await getHighlighter();
    const transform = rehypeShikiFromHighlighter(
      // HighlighterCore 는 제네릭 인자 차이로 타입이 맞지 않아 단언한다.
      highlighter as Parameters<typeof rehypeShikiFromHighlighter>[0],
      {
        themes: { light: "github-light", dark: "github-dark" },
        // 목록에 없는 언어는 오류 대신 일반 텍스트로 표시
        fallbackLanguage: "text",
      },
    );
    await transform(tree, file, () => {});
  };
}
