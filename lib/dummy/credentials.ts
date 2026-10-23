import type {
  CertificationView,
  LanguageScoreView,
  ThesisView,
} from "@/lib/types";

/** 등록번호는 저장·노출하지 않는다. */
export const dummyCertifications: CertificationView[] = [
  {
    id: "cert-1",
    name: "TODO: 자격증명 1",
    issuer: "TODO: 발급기관",
    acquiredAt: "2022-06-01",
  },
  {
    id: "cert-2",
    name: "TODO: 자격증명 2",
    issuer: "TODO: 발급기관",
    acquiredAt: "2021-09-01",
  },
];

export const dummyLanguageScores: LanguageScoreView[] = [
  {
    id: "lang-1",
    exam: "TODO: 시험명",
    score: "TODO",
    organizer: "TODO: 주관처",
    acquiredAt: "2020-05-01",
  },
];

/** TODO: 논문 제목·초록·키워드는 PDF를 텍스트로 받은 뒤 교체한다. */
export const dummyTheses: ThesisView[] = [
  {
    id: "thesis-1",
    title: "TODO: 학위 논문 제목",
    keywords: [],
    degreeId: "edu-1",
  },
];

/** 공개 설정 더미. 실제로는 site_settings.showLanguageScores. */
export const dummySiteSettings = {
  showLanguageScores: true,
};
