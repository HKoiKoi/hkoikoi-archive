import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectDetailFooterProps {
  className?: string;
}

// 프로젝트 상세 하단 버튼: 목록으로 / 연락하기
export function ProjectDetailFooter({ className }: ProjectDetailFooterProps) {
  return (
    <footer
      className={cn(
        "flex flex-col gap-2 border-t pt-8 sm:flex-row sm:justify-between",
        className,
      )}
    >
      <Button
        variant="outline"
        render={<Link href="/projects" />}
        nativeButton={false}
      >
        <ArrowLeft data-icon="inline-start" />
        목록으로
      </Button>
      <Button render={<Link href="/contact" />} nativeButton={false}>
        <Mail data-icon="inline-start" />
        연락하기
      </Button>
    </footer>
  );
}
