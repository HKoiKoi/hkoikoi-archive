import type { EducationView, ExperienceView } from "@/lib/types";

/** TODO: 실제 경력·성과는 제공받은 뒤 교체한다. 성과 수치는 지어내지 않는다. */
export const dummyExperiences: ExperienceView[] = [
  {
    id: "exp-1",
    company: "더미 회사 A",
    department: "개발팀",
    position: "사원",
    startDate: "2023-03-01",
    duties: ["TODO: 담당업무 1", "TODO: 담당업무 2"],
    achievements: ["TODO: 성과 자리표시자"],
  },
  {
    id: "exp-2",
    company: "더미 회사 B",
    department: "인프라팀",
    position: "사원",
    startDate: "2021-01-01",
    endDate: "2023-02-28",
    duties: ["TODO: 담당업무 1"],
    achievements: [],
  },
];

export const dummyEducations: EducationView[] = [
  {
    id: "edu-1",
    school: "더미 대학원",
    degree: "석사",
    major: "TODO: 전공",
    startDate: "2019-03-01",
    endDate: "2021-02-28",
    gpa: { score: 4.0, scale: 4.5 },
  },
  {
    id: "edu-2",
    school: "더미 대학교",
    degree: "학사",
    major: "TODO: 전공",
    startDate: "2013-03-01",
    endDate: "2019-02-28",
  },
];
