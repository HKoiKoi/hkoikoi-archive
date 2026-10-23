import type { EducationView, ExperienceView } from "@/lib/types";

export const dummyExperiences: ExperienceView[] = [
  {
    id: "exp-1",
    company: "(주)신나는플랫폼",
    department: "기술연구소",
    position: "주임",
    startDate: "2024-07-15",
    endDate: "2025-12-31",
    duties: [
      "대학 포털 사이트, NCS 웹정보시스템 개발 및 유지보수",
      "국립국제교육원 국외인적자원시스템 클라우드 전환 및 유지보수(WEB·WAS·DB 서버 이관, MsSQL → MariaDB 전환)",
      "사내 개발·운영 환경 AWS → 온프레미스(Linux, Jenkins, Docker) 이관 및 운영",
    ],
    achievements: [
      "한정된 일정 내 클라우드 전환을 마치고 퇴사 전까지 유지보수 전담",
      "AWS 비용 부담 해소를 위한 사내 서버 환경 구축 완료",
      "Cursor로 레거시 JSP를 리팩터링해 약 2~3시간 걸릴 작업을 30분 안팎으로 단축하고, AI가 잘못 바꾼 로직은 E2E 테스트로 바로잡음",
    ],
  },
];

export const dummyEducations: EducationView[] = [
  {
    id: "edu-1",
    school: "서울신학대학교 일반대학원",
    degree: "석사",
    major: "IT융합학과",
    startDate: "2024-09-02",
    endDate: "2026-08-20",
    gpa: { score: 4.2, scale: 4.5 },
  },
  {
    id: "edu-2",
    school: "서울신학대학교",
    degree: "학사",
    major: "기독교교육과 (부전공: IT융합소프트웨어학과)",
    startDate: "2018-02-26",
    endDate: "2024-08-19",
    gpa: { score: 3.87, scale: 4.5 },
  },
];
