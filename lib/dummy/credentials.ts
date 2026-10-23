import type {
  CertificationView,
  LanguageScoreView,
  ThesisView,
} from "@/lib/types";

/** 등록번호는 저장·노출하지 않는다. */
export const dummyCertifications: CertificationView[] = [
  {
    id: "cert-1",
    name: "정보처리기사",
    issuer: "한국산업인력공단",
    acquiredAt: "2024-03-13",
  },
  {
    id: "cert-2",
    name: "SQL 개발자 (SQLD)",
    issuer: "한국데이터산업진흥원",
    acquiredAt: "2024-12-13",
  },
];

export const dummyLanguageScores: LanguageScoreView[] = [
  {
    id: "lang-1",
    exam: "TOEIC",
    score: "620",
    organizer: "YBM",
    acquiredAt: "2026-08-30",
  },
];

/** TODO: 논문 정확한 제목·초록·키워드는 PDF를 텍스트로 받은 뒤 교체한다. 현재 제목은 포트폴리오의 주제 문구다. */
export const dummyTheses: ThesisView[] = [
  {
    id: "thesis-1",
    title:
      "분산 서버 환경에서 부하에 따라 동시성 제어(락) 방식을 자동 전환하는 프레임워크",
    keywords: [],
    degreeId: "edu-1",
  },
];

/** 공개 설정 더미. 실제로는 site_settings.showLanguageScores. */
export const dummySiteSettings = {
  showLanguageScores: true,
};
