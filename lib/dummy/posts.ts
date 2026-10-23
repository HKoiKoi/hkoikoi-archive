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
