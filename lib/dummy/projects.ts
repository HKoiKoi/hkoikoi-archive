import type { ProjectDetail } from "@/lib/types";

/** 공개 여부는 저장용 필드라 View 타입에 없다. queries가 View로 변환한다. */
export type DummyProject = ProjectDetail & { isPublished: boolean };

/** TODO: 실제 프로젝트 역할·기술·성과를 받으면 교체한다. */
export const dummyProjects: DummyProject[] = [
  {
    slug: "sample-featured-project",
    title: "대표 프로젝트 (더미)",
    summary: "TODO: 한 줄 요약을 제공받아 교체한다.",
    period: "2023.03 - 2024.02",
    techStack: ["Java", "Spring Boot", "PostgreSQL"],
    isFeatured: true,
    isPublished: true,
    role: "TODO: 역할",
    links: {},
    contentMdx: "## 개요\n\nTODO: 프로젝트 본문(MDX)",
  },
  {
    slug: "sample-project",
    title: "일반 프로젝트 (더미)",
    summary: "TODO: 한 줄 요약을 제공받아 교체한다.",
    period: "2021.01 - 2022.12",
    techStack: [],
    isFeatured: false,
    isPublished: true,
    links: {},
    contentMdx: "TODO: 프로젝트 본문(MDX)",
  },
  {
    slug: "sample-private-project",
    title: "비공개 프로젝트 (더미)",
    summary: "공개 목록과 상세에서 보이지 않아야 한다.",
    techStack: ["Docker"],
    isFeatured: false,
    isPublished: false,
    links: {},
    contentMdx: "",
  },
];
