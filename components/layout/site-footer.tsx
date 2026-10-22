import Link from "next/link";

import { contactLinks, features, siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground">
        <p>© {siteConfig.name}</p>
        <nav
          aria-label="푸터 메뉴"
          className="flex flex-wrap items-center gap-4"
        >
          <Link href="/credentials" className="hover:text-foreground">
            자격·어학·논문
          </Link>
          <a href={contactLinks.github} className="hover:text-foreground">
            GitHub
          </a>
          <a
            href={`mailto:${contactLinks.email}`}
            className="hover:text-foreground"
          >
            이메일
          </a>
          {features.admin ? (
            <Link href="/admin/login" className="hover:text-foreground">
              관리자
            </Link>
          ) : null}
        </nav>
      </div>
    </footer>
  );
}
