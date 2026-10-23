import type { PostDetail, PostStatus } from "@/lib/types";

export type DummyPost = PostDetail & { status: PostStatus };

/** TODO: 실제 글은 2차 릴리스에서 DB로 대체된다. */
export const dummyPosts: DummyPost[] = [
  {
    slug: "hello-world",
    title: "첫 번째 글 (더미)",
    summary: "TODO: 글 요약",
    tags: ["회고", "Next.js"],
    publishedAt: "2026-09-01T09:00:00+09:00",
    updatedAt: "2026-09-01T09:00:00+09:00",
    contentMdx: "TODO: 본문(MDX)",
    status: "published",
  },
  {
    slug: "long-title-sample",
    title:
      "아주 긴 제목이 카드 안에서 말줄임 처리되는지 확인하기 위한 더미 글 제목입니다 — 두 줄을 넘어가도 레이아웃이 유지되어야 합니다",
    summary: "태그가 없는 글의 표시를 확인한다.",
    tags: [],
    publishedAt: "2026-09-15T09:00:00+09:00",
    updatedAt: "2026-09-15T09:00:00+09:00",
    contentMdx: "TODO: 본문(MDX)",
    status: "published",
  },
  {
    slug: "181890-left-right",
    title: "[프로그래머스] 왼쪽 오른쪽 (181890)",
    summary:
      "l과 r 중 먼저 나오는 문자열을 기준으로 리스트를 잘라 반환하는 문제 풀이.",
    tags: ["알고리즘", "Python"],
    publishedAt: "2026-10-23T09:00:00+09:00",
    updatedAt: "2026-10-23T09:00:00+09:00",
    contentMdx:
      '# 문제\n\n> [왼쪽 오른쪽](https://school.programmers.co.kr/learn/courses/30/lessons/181890)\n\n## <span style="color: #A78BFA">문제 설명</span>\n\n문자열 리스트 `str_list`에는 "u", "d", "l", "r" 네 개의 문자열이 여러 개 저장되어 있습니다.\n`str_list`에서 "l"과 "r" 중 먼저 나오는 문자열이 "l"이라면 해당 문자열을 기준으로 왼쪽에 있는 문자열들을 순서대로 담은 리스트를, 먼저 나오는 문자열이 "r"이라면 해당 문자열을 기준으로 오른쪽에 있는 문자열들을 순서대로 담은 리스트를 return하도록 `solution` 함수를 완성해주세요.\n"l"이나 "r"이 없다면 빈 리스트를 return합니다.\n\n---\n\n## <span style="color: #A78BFA">제한사항</span>\n\n- $1 \\leq$ `str_list`의 길이 $\\leq 20$\n- `str_list`는 "u", "d", "l", "r" 네 개의 문자열로 이루어져 있습니다.\n\n---\n\n## <span style="color: #A78BFA">입출력 예시</span>\n\n| str_list             | result     |\n| -------------------- | ---------- |\n| ["u", "u", "l", "r"] | ["u", "u"] |\n| ["l"]                | []         |\n\n---\n\n## <span style="color: #A78BFA">문제 풀이</span>\n\n"l"과 "r" 모두 있어야 함.\n\n즉, 둘 중 하나라도 없으면 [] 반환\n\n"l"과 "r" 중 먼저 나오는 것에 따라 분기\n\n```python\ndef solution(str_list):\n    for i, ch in enumerate(str_list):\n        if ch == "l":\n            return str_list[:i]\n        elif ch == "r":\n            return str_list[i + 1:]\n\n    return []\n```\n',
    status: "published",
  },
  {
    slug: "draft-sample",
    title: "임시저장 글 (더미)",
    summary: "공개 목록과 상세에서 보이지 않아야 한다.",
    tags: ["draft"],
    publishedAt: "2026-10-01T09:00:00+09:00",
    updatedAt: "2026-10-01T09:00:00+09:00",
    contentMdx: "",
    status: "draft",
  },
];
