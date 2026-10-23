"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ResumeButton } from "@/components/profile/resume-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavItem } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function MobileNavTrigger() {
  return (
    <Button variant="ghost" size="icon" aria-label="메뉴 열기" disabled>
      <MenuIcon />
    </Button>
  );
}

export function MobileNav({
  items,
}: {
  items: readonly Pick<NavItem, "label" | "href">[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="메뉴 열기" />}
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>메뉴</SheetTitle>
          <SheetDescription className="sr-only">
            사이트의 주요 페이지로 이동합니다.
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="모바일 메뉴" className="flex flex-col px-2">
          {items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-3 text-base transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <ResumeButton
            variant="ghost"
            onClick={() => setOpen(false)}
            className="h-auto justify-start px-3 py-3 text-base font-medium text-primary"
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
