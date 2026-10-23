import { CircleAlert } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const errorMessages: Record<string, string> = {
  AccessDenied:
    "관리자 계정이 아닙니다. 허용된 GitHub 계정으로 로그인해 주세요.",
  Configuration: "로그인 설정에 문제가 있습니다. 잠시 후 다시 시도해 주세요.",
  OAuthCallback: "GitHub 인증 중 문제가 발생했습니다. 다시 시도해 주세요.",
  SessionExpired: "세션이 만료되었습니다. 다시 로그인해 주세요.",
};

const fallbackMessage = "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.";

/** 알려진 코드만 한국어 문구로 매핑하고, 그 외 값은 일반 문구로 대체한다. */
function resolveErrorMessage(code: string): string {
  return (
    (Object.hasOwn(errorMessages, code) ? errorMessages[code] : undefined) ??
    fallbackMessage
  );
}

interface LoginCardProps {
  /** `?error=` 쿼리 값. 화면에는 매핑된 문구만 출력한다. */
  errorCode?: string;
}

// 관리자 로그인 카드 (정적 마크업)
export function LoginCard({ errorCode }: LoginCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-heading text-xl">관리자 로그인</CardTitle>
        <CardDescription>
          허용된 GitHub 계정으로만 로그인할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {errorCode ? (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>로그인할 수 없습니다</AlertTitle>
            <AlertDescription>
              {resolveErrorMessage(errorCode)}
            </AlertDescription>
          </Alert>
        ) : null}
        {/* TODO(Phase 3): Better Auth GitHub 로그인(signIn.social)으로 교체한다. 지금은 인증 없이 /admin으로 이동한다. */}
        <Button render={<Link href="/admin" />} nativeButton={false} size="lg">
          GitHub로 로그인
        </Button>
      </CardContent>
    </Card>
  );
}
