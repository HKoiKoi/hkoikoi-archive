import type {
  CertificationView,
  EducationView,
  ExperienceView,
  HomeMetrics,
} from "@/lib/types";

const DAY_MS = 24 * 60 * 60 * 1000;

/** YYYY-MM-DD → UTC 자정 타임스탬프 */
function toUtc(date: string): number {
  const [y = 0, m = 1, d = 1] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** 두 UTC 시각(from < to) 사이의 완전한 개월 수 */
function wholeMonthsBetween(from: number, to: number): number {
  const a = new Date(from);
  const b = new Date(to);
  let months =
    (b.getUTCFullYear() - a.getUTCFullYear()) * 12 +
    (b.getUTCMonth() - a.getUTCMonth());
  if (b.getUTCDate() < a.getUTCDate()) months -= 1;
  return Math.max(months, 0);
}

/**
 * 경력 개월 수 합산. 종료일이 없으면(재직 중) `referenceDate`까지 계산한다.
 * 종료일은 포함해서 세고, 겹치는 기간은 한 번만 센다.
 */
export function calculateCareerMonths(
  experiences: Pick<ExperienceView, "startDate" | "endDate">[],
  referenceDate: Date,
): number {
  const reference = Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate(),
  );

  const ranges = experiences
    .map(({ startDate, endDate }) => ({
      start: toUtc(startDate),
      end: (endDate ? toUtc(endDate) : reference) + DAY_MS,
    }))
    .filter(({ start, end }) => end > start)
    .sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  for (const range of ranges) {
    const last = merged.at(-1);
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }

  return merged.reduce(
    (sum, { start, end }) => sum + wholeMonthsBetween(start, end),
    0,
  );
}

/** 석사 학점. 학위가 "석사"이고 학점이 있는 첫 항목 */
export function getMasterGpa(
  educations: Pick<EducationView, "degree" | "gpa">[],
): HomeMetrics["masterGpa"] {
  return educations.find((e) => e.degree === "석사" && e.gpa)?.gpa;
}

export function calculateHomeMetrics(
  data: {
    experiences: Pick<ExperienceView, "startDate" | "endDate">[];
    certifications: Pick<CertificationView, "id">[];
    educations: Pick<EducationView, "degree" | "gpa">[];
  },
  referenceDate: Date,
): HomeMetrics {
  return {
    careerMonths: calculateCareerMonths(data.experiences, referenceDate),
    certificationCount: data.certifications.length,
    masterGpa: getMasterGpa(data.educations),
  };
}

/** 개월 수 → "3년 2개월" */
export function formatCareerMonths(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest}개월`;
  return rest === 0 ? `${years}년` : `${years}년 ${rest}개월`;
}

/** 학점 → "4.0 / 4.5" */
export function formatGpa({
  score,
  scale,
}: NonNullable<HomeMetrics["masterGpa"]>): string {
  return `${score} / ${scale}`;
}
