import { cacheLife } from "next/cache";

import { SectionHeading } from "@/components/layout/section";
import {
  calculateHomeMetrics,
  formatCareerMonths,
  formatGpa,
} from "@/lib/metrics";
import {
  getCertifications,
  getEducations,
  getExperiences,
} from "@/lib/queries/profile";

/** 현재 날짜 기준 계산이라 하루 단위로 캐시한다. */
export async function HomeMetrics() {
  "use cache";
  cacheLife("days");

  const [experiences, certifications, educations] = await Promise.all([
    getExperiences(),
    getCertifications(),
    getEducations(),
  ]);
  const metrics = calculateHomeMetrics(
    { experiences, certifications, educations },
    new Date(),
  );

  const items = [
    { label: "경력", value: formatCareerMonths(metrics.careerMonths) },
    { label: "자격증", value: `${metrics.certificationCount}개` },
    ...(metrics.masterGpa
      ? [{ label: "석사 학점", value: formatGpa(metrics.masterGpa) }]
      : []),
  ];

  return (
    <section className="py-10 md:py-14">
      <SectionHeading title="핵심 수치" />
      <dl className="grid gap-4 sm:grid-cols-3">
        {items.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl bg-card p-5 text-card-foreground ring-1 ring-foreground/10"
          >
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-heading text-3xl font-bold text-primary">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
