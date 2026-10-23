import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { MobileNav, MobileNavTrigger } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { ResumeButton } from "@/components/profile/resume-button";
import { isFeatureEnabled, navItems, siteConfig } from "@/lib/site-config";

const visibleNavItems = navItems.filter((item) =>
  isFeatureEnabled(item.feature),
);

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="size-9 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/logo.png"
              alt=""
              width={30}
              height={30}
              className="size-full scale-[1.4] object-cover"
            />
          </span>
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-4">
          <nav
            aria-label="주요 메뉴"
            className="hidden items-center gap-4 md:flex"
          >
            {/* usePathname이 미리 생성되지 않은 동적 라우트에서 suspend 되므로 Suspense가 필요하다 */}
            <Suspense
              fallback={visibleNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground"
                >
                  {item.label}
                </Link>
              ))}
            >
              {visibleNavItems.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
            </Suspense>
          </nav>
          <ResumeButton
            variant="link"
            size="sm"
            className="hidden md:inline-flex"
          />
          <div className="md:hidden">
            <Suspense fallback={<MobileNavTrigger />}>
              <MobileNav items={visibleNavItems} />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
