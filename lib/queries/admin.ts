import { dummySiteSettings } from "@/lib/dummy/credentials";
import { dummyPosts, type DummyPost } from "@/lib/dummy/posts";
import { dummyProjects, type DummyProject } from "@/lib/dummy/projects";

/** 관리자 전용 조회. 임시저장·비공개를 포함한다. Phase 3에서 DB 조회로 교체한다. */
export async function getAdminPosts(): Promise<DummyPost[]> {
  return [...dummyPosts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** 더미 단계에서는 slug를 id로 쓴다. */
export async function getAdminPost(id: string): Promise<DummyPost | null> {
  return dummyPosts.find((p) => p.slug === id) ?? null;
}

export async function getAdminProjects(): Promise<DummyProject[]> {
  return [...dummyProjects];
}

export async function getAdminProject(
  id: string,
): Promise<DummyProject | null> {
  return dummyProjects.find((p) => p.slug === id) ?? null;
}

export async function getAdminSettings(): Promise<{
  showLanguageScores: boolean;
}> {
  return dummySiteSettings;
}
