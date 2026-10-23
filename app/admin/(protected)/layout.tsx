import { AdminHeader } from "@/components/admin/admin-header";

// TODO(Phase 3): 세션 검증을 추가한다.
export default function ProtectedAdminLayout({
  children,
}: LayoutProps<"/admin">) {
  return (
    <>
      <AdminHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
    </>
  );
}
