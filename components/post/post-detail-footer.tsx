import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostDetailFooterProps {
  className?: string;
}

// 글 상세 하단 버튼: 목록으로
export function PostDetailFooter({ className }: PostDetailFooterProps) {
  return (
    <footer className={cn("border-t pt-8", className)}>
      <Button
        variant="outline"
        render={<Link href="/blog" />}
        nativeButton={false}
      >
        <ArrowLeft data-icon="inline-start" />
        목록으로
      </Button>
    </footer>
  );
}
