import { Suspense } from "react";

import { LoginCard } from "@/components/admin/login-card";

async function LoginContent({
  searchParams,
}: {
  searchParams: PageProps<"/admin/login">["searchParams"];
}) {
  const { error } = await searchParams;
  const errorCode = Array.isArray(error) ? error[0] : error;

  return <LoginCard errorCode={errorCode} />;
}

export default function Page({ searchParams }: PageProps<"/admin/login">) {
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-12">
      <Suspense fallback={<LoginCard />}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
