import { dummyEducations, dummyExperiences } from "@/lib/dummy/career";
import {
  dummyCertifications,
  dummyLanguageScores,
  dummySiteSettings,
  dummyTheses,
} from "@/lib/dummy/credentials";
import { dummyProfile } from "@/lib/dummy/profile";
import type {
  CertificationView,
  EducationView,
  ExperienceView,
  LanguageScoreView,
  ProfileView,
  ThesisView,
} from "@/lib/types";

/** Phase 3에서 Drizzle 조회로 교체한다. 시그니처는 유지한다. */
export async function getProfile(): Promise<ProfileView> {
  return dummyProfile;
}

/** 최신 시작일 순 */
export async function getExperiences(): Promise<ExperienceView[]> {
  return [...dummyExperiences].sort((a, b) =>
    b.startDate.localeCompare(a.startDate),
  );
}

export async function getEducations(): Promise<EducationView[]> {
  return [...dummyEducations].sort((a, b) =>
    b.startDate.localeCompare(a.startDate),
  );
}

export async function getCertifications(): Promise<CertificationView[]> {
  return [...dummyCertifications].sort((a, b) =>
    b.acquiredAt.localeCompare(a.acquiredAt),
  );
}

/** showLanguageScores가 false면 빈 배열이 아니라 null을 돌려 섹션 숨김을 구분한다. */
export async function getLanguageScores(): Promise<LanguageScoreView[] | null> {
  if (!dummySiteSettings.showLanguageScores) return null;
  return dummyLanguageScores;
}

export async function getTheses(): Promise<ThesisView[]> {
  return dummyTheses;
}
