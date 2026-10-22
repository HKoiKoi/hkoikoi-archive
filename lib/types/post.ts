export type PostStatus = "draft" | "published";

export interface PostCard {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  /** ISO 8601 */
  publishedAt: string;
}

export interface PostDetail extends PostCard {
  contentMdx: string;
  /** ISO 8601 */
  updatedAt: string;
}
