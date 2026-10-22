import Link from "next/link";

// TODO(Task 016): 세션 검증과 로그아웃 동작을 연결한다.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <header className="border-b border-border">
        <nav
          aria-label="관리자 메뉴"
          className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4 text-sm"
        >
          <Link href="/admin" className="font-semibold">
            대시보드
          </Link>
          <span className="ml-auto text-muted-foreground">로그아웃</span>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
    </>
  );
}
