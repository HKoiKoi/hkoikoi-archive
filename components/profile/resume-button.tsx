import { buttonVariants } from "@/components/ui/button";
import { resumeUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type ResumeButtonProps = Omit<React.ComponentProps<"a">, "href" | "download"> &
  Parameters<typeof buttonVariants>[0];

/** 이력서 PDF 다운로드 링크. `resumeUrl`이 없으면 렌더링하지 않는다. */
export function ResumeButton({
  variant = "outline",
  size,
  className,
  children = "이력서",
  ...props
}: ResumeButtonProps) {
  if (!resumeUrl) return null;

  return (
    <a
      href={resumeUrl}
      download
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </a>
  );
}
