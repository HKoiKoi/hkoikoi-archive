export interface CertificationView {
  id: string;
  name: string;
  issuer: string;
  /** YYYY-MM-DD */
  acquiredAt: string;
}

export interface LanguageScoreView {
  id: string;
  exam: string;
  score: string;
  organizer: string;
  acquiredAt: string;
}

export interface ThesisView {
  id: string;
  title: string;
  abstract?: string;
  keywords: string[];
  degreeId: string;
  url?: string;
}
