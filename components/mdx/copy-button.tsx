"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type CopyState = "idle" | "copied" | "failed";

const RESET_DELAY_MS = 2000;

/** 같은 코드 블록 래퍼 안의 `pre` 텍스트를 클립보드에 복사한다. */
export function CopyButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), RESET_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state]);

  async function handleCopy() {
    const code = buttonRef.current
      ?.closest("[data-code-block]")
      ?.querySelector("pre")?.textContent;
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch {
      // 비보안 컨텍스트이거나 권한이 거부된 경우
      setState("failed");
    }
  }

  const label =
    state === "copied"
      ? "복사됨"
      : state === "failed"
        ? "복사하지 못했습니다"
        : "코드 복사";

  return (
    <>
      <Button
        ref={buttonRef}
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={label}
        title={label}
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-card/80 opacity-0 backdrop-blur-sm group-hover/code:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
      >
        {state === "copied" ? <Check /> : <Copy />}
      </Button>
      <span role="status" className="sr-only">
        {state === "idle" ? "" : label}
      </span>
    </>
  );
}
