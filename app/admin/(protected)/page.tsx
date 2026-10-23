import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { LanguageVisibilityCard } from "@/components/admin/language-visibility-card";
import { ResumeUploadCard } from "@/components/admin/resume-upload-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getAdminPosts,
  getAdminProjects,
  getAdminSettings,
} from "@/lib/queries/admin";
import { formatDate } from "@/lib/format";

function SectionHeader({
  title,
  newHref,
  newLabel,
}: {
  title: string;
  newHref: string;
  newLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="font-heading text-xl font-bold tracking-tight">{title}</h2>
      <Button render={<Link href={newHref} />} nativeButton={false} size="sm">
        <Plus data-icon="inline-start" />
        {newLabel}
      </Button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

function ListSkeleton() {
  return <div aria-hidden className="h-24 animate-pulse rounded-lg bg-muted" />;
}

function DeleteButton({ label, name }: { label: string; name: string }) {
  return (
    // TODO(Phase 3): onConfirm에 실제 삭제 Server Action을 연결한다.
    <DeleteConfirmDialog
      title={`${label}을(를) 삭제할까요?`}
      description={`"${name}" 항목을 삭제하면 되돌릴 수 없습니다.`}
    >
      <Button variant="ghost" size="icon-sm" aria-label={`${name} 삭제`}>
        <Trash2 />
      </Button>
    </DeleteConfirmDialog>
  );
}

async function PostsSection() {
  const posts = await getAdminPosts();

  return (
    <section aria-labelledby="admin-posts" className="flex flex-col gap-4">
      <div id="admin-posts">
        <SectionHeader title="글" newHref="/admin/posts/new" newLabel="새 글" />
      </div>
      {posts.length === 0 ? (
        <EmptyState message="아직 작성한 글이 없습니다. 새 글을 작성해 보세요." />
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="flex items-center gap-3 px-3 py-3 md:px-4"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link
                  href={`/admin/posts/${post.slug}`}
                  className="line-clamp-2 font-medium hover:underline"
                >
                  {post.title}
                </Link>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant={
                      post.status === "published" ? "default" : "secondary"
                    }
                  >
                    {post.status === "published" ? "발행" : "임시저장"}
                  </Badge>
                  <span>
                    수정{" "}
                    <time dateTime={post.updatedAt}>
                      {formatDate(post.updatedAt)}
                    </time>
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`/admin/posts/${post.slug}`} />}
                  nativeButton={false}
                >
                  수정
                </Button>
                <DeleteButton label="글" name={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

async function ProjectsSection() {
  const projects = await getAdminProjects();

  return (
    <section aria-labelledby="admin-projects" className="flex flex-col gap-4">
      <div id="admin-projects">
        <SectionHeader
          title="프로젝트"
          newHref="/admin/projects/new"
          newLabel="새 프로젝트"
        />
      </div>
      {projects.length === 0 ? (
        <EmptyState message="아직 등록한 프로젝트가 없습니다. 새 프로젝트를 추가해 보세요." />
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {projects.map((project) => (
            <li
              key={project.slug}
              className="flex items-center gap-3 px-3 py-3 md:px-4"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link
                  href={`/admin/projects/${project.slug}`}
                  className="line-clamp-2 font-medium hover:underline"
                >
                  {project.title}
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={project.isPublished ? "default" : "secondary"}
                  >
                    {project.isPublished ? "공개" : "비공개"}
                  </Badge>
                  {project.isFeatured ? (
                    <Badge variant="outline">대표</Badge>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`/admin/projects/${project.slug}`} />}
                  nativeButton={false}
                >
                  수정
                </Button>
                <DeleteButton label="프로젝트" name={project.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

async function SettingsSection() {
  const settings = await getAdminSettings();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ResumeUploadCard />
      <LanguageVisibilityCard defaultChecked={settings.showLanguageScores} />
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
        대시보드
      </h1>
      <Suspense fallback={<ListSkeleton />}>
        <PostsSection />
      </Suspense>
      <Separator />
      <Suspense fallback={<ListSkeleton />}>
        <ProjectsSection />
      </Suspense>
      <Separator />
      <Suspense fallback={<ListSkeleton />}>
        <SettingsSection />
      </Suspense>
    </div>
  );
}
