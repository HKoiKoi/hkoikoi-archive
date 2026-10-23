export interface FocusArea {
  title: string;
  description: string;
  icon: string;
}

export interface SkillGroup {
  /** 예: 백엔드, 데이터베이스, 인프라 */
  category: string;
  /** 대분류 아이콘 키(focusAreas.icon과 같은 방식) */
  icon: string;
  items: string[];
}

export interface ProfileView {
  name: string;
  role: string;
  intro: string;
  skills: SkillGroup[];
  focusAreas: FocusArea[];
  githubUrl?: string;
  email?: string;
  photoUrl?: string;
}

export interface ExperienceView {
  id: string;
  company: string;
  department?: string;
  position?: string;
  /** YYYY-MM-DD */
  startDate: string;
  /** 재직 중이면 undefined */
  endDate?: string;
  duties: string[];
  achievements: string[];
}

export interface EducationView {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate?: string;
  gpa?: { score: number; scale: number };
}

export interface HomeMetrics {
  /** 총 경력 개월 수 */
  careerMonths: number;
  certificationCount: number;
  /** 석사 학점. 없으면 undefined */
  masterGpa?: { score: number; scale: number };
}
