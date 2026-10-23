import Link from "next/link";

import { Button } from "@/components/ui/button";

// 관리자 공통 상단 바 (정적 마크업)
export function AdminHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
        <Link href="/admin" className="font-semibold">
          HKoiKoi.dev 관리
        </Link>
        <nav
          aria-label="관리자 메뉴"
          className="flex flex-1 flex-wrap items-center justify-end gap-1"
        >
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/admin" />}
            nativeButton={false}
          >
            대시보드
          </Button>
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/" />}
            nativeButton={false}
          >
            사이트로 돌아가기
          </Button>
          {/* TODO(Phase 3): Better Auth signOut으로 교체한다. 지금은 로그인 화면으로 이동만 한다. */}
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/admin/login" />}
            nativeButton={false}
          >
            로그아웃
          </Button>
        </nav>
      </div>
    </header>
  );
}
