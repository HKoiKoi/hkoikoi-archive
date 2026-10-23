import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/layout/section";
import { Timeline, type TimelineItem } from "@/components/profile/timeline";
import { buttonVariants } from "@/components/ui/button";
import { formatPeriod } from "@/lib/format";
import { formatGpa } from "@/lib/metrics";
import {
  getEducations,
  getExperiences,
  getProfile,
} from "@/lib/queries/profile";

export const metadata: Metadata = { title: "소개" };

export default async function Page() {
  const [profile, experiences, educations] = await Promise.all([
    getProfile(),
    getExperiences(),
    getEducations(),
  ]);

  const careerItems: TimelineItem[] = experiences.map((e) => ({
    id: e.id,
    title: e.company,
    subtitle: [e.department, e.position].filter(Boolean).join(" · "),
    period: formatPeriod(e.startDate, e.endDate),
    details: [...e.duties, ...e.achievements.map((a) => `성과: ${a}`)],
  }));

  const educationItems: TimelineItem[] = educations.map((e) => ({
    id: e.id,
    title: e.school,
    subtitle: `${e.degree} · ${e.major}`,
    period: formatPeriod(e.startDate, e.endDate),
    details: e.gpa ? [`학점 ${formatGpa(e.gpa)}`] : [],
  }));

  return (
    <>
      <section className="py-6 md:py-10">
        <SectionHeading title="소개" as="h1" />
        <p className="max-w-2xl text-pretty whitespace-pre-line">
          {profile.intro}
        </p>
      </section>
      <section className="py-6 md:py-10">
        <SectionHeading title="경력" />
        <Timeline items={careerItems} label="경력" />
      </section>
      <section className="py-6 md:py-10">
        <SectionHeading title="학력" />
        <Timeline items={educationItems} label="학력" />
      </section>
      <div className="flex flex-wrap gap-3 py-6">
        <Link href="/credentials" className={buttonVariants({ size: "lg" })}>
          자격·어학·논문 보기
        </Link>
        <Link
          href="/projects"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          프로젝트 보기
        </Link>
      </div>
    </>
  );
}
