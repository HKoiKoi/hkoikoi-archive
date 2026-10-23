import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ProjectForm } from "@/components/admin/project-form";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">새 프로젝트 작성</h1>
        <Button
          variant="outline"
          render={<Link href="/admin" />}
          nativeButton={false}
        >
          <ArrowLeft data-icon="inline-start" />
          목록으로
        </Button>
      </div>
      <ProjectForm />
    </div>
  );
}
