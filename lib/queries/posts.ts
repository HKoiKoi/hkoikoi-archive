import { dummyPosts, type DummyPost } from "@/lib/dummy/posts";
import type { PostCard, PostDetail } from "@/lib/types";

function toCard({
  slug,
  title,
  summary,
  tags,
  publishedAt,
}: DummyPost): PostCard {
  return { slug, title, summary, tags, publishedAt };
}

function toDetail(post: DummyPost): PostDetail {
  return {
    ...toCard(post),
    contentMdx: post.contentMdx,
    updatedAt: post.updatedAt,
  };
}

const published = () => dummyPosts.filter((p) => p.status === "published");

/** 발행 글, 최신순. tag가 있으면 해당 태그만 */
export async function getPosts(tag?: string): Promise<PostCard[]> {
  return published()
    .filter((p) => (tag ? p.tags.includes(tag) : true))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(toCard);
}

export async function getLatestPosts(limit = 3): Promise<PostCard[]> {
  return (await getPosts()).slice(0, limit);
}

/** 임시저장·없는 slug는 null → 호출 쪽에서 notFound() */
export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const post = published().find((p) => p.slug === slug);
  return post ? toDetail(post) : null;
}

export async function getPostTags(): Promise<string[]> {
  return [...new Set(published().flatMap((p) => p.tags))].sort();
}
