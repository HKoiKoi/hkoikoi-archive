import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/layout/section";
import { TechBadgeList } from "@/components/profile/tech-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatYearMonth } from "@/lib/format";
import {
  getCertifications,
  getLanguageScores,
  getTheses,
} from "@/lib/queries/profile";

export const metadata: Metadata = { title: "자격·어학·논문" };

export default async function Page() {
  const [certifications, languageScores, theses] = await Promise.all([
    getCertifications(),
    getLanguageScores(),
    getTheses(),
  ]);

  return (
    <>
      <SectionHeading title="자격·어학·논문" as="h1" className="pt-6" />

      <section className="py-6 md:py-10">
        <SectionHeading title="자격증" as="h2" />
        <ul className="grid gap-3 md:grid-cols-2">
          {certifications.map((c) => (
            <li
              key={c.id}
              className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
            >
              <h3 className="font-heading font-medium break-words">{c.name}</h3>
              <p className="text-sm text-muted-foreground">
                {c.issuer} · {formatYearMonth(c.acquiredAt)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {languageScores ? (
        <section className="py-6 md:py-10">
          <SectionHeading title="어학" as="h2" />
          <ul className="grid gap-3 md:grid-cols-2">
            {languageScores.map((l) => (
              <li
                key={l.id}
                className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
              >
                <h3 className="font-heading font-medium break-words">
                  {l.exam} · {l.score}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {l.organizer} · {formatYearMonth(l.acquiredAt)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="py-6 md:py-10">
        <SectionHeading title="학위 논문" as="h2" />
        <ul className="flex flex-col gap-4">
          {theses.map((t) => (
            <li
              key={t.id}
              className="space-y-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10"
            >
              <h3 className="font-heading font-medium break-words">
                {t.title}
              </h3>
              {t.abstract ? (
                <p className="text-sm text-muted-foreground">{t.abstract}</p>
              ) : null}
              <TechBadgeList items={t.keywords} />
              {t.url ? (
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-primary underline-offset-4 hover:underline"
                >
                  논문 보기
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <div className="py-6">
        <Link
          href="/about"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          소개로 돌아가기
        </Link>
      </div>
    </>
  );
}
