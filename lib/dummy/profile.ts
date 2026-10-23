import type { ProfileView } from "@/lib/types";

/** TODO: 실제 소개·기술 스택·담당 영역 문구를 받으면 교체한다. 현재는 더미 값이다. */
export const dummyProfile: ProfileView = {
  name: "함상현",
  role: "백엔드 개발자",
  intro: "TODO: 자기소개와 IT 전환 스토리를 제공받아 교체한다.",
  skills: ["Java", "Spring Boot", "PostgreSQL", "Docker", "AWS"],
  focusAreas: [
    {
      title: "웹정보시스템 개발·유지보수",
      description: "TODO: 담당 영역 설명을 제공받아 교체한다.",
      icon: "code",
    },
    {
      title: "클라우드 전환",
      description: "TODO: 담당 영역 설명을 제공받아 교체한다.",
      icon: "cloud",
    },
    {
      title: "온프레미스 인프라",
      description: "TODO: 담당 영역 설명을 제공받아 교체한다.",
      icon: "server",
    },
  ],
  githubUrl: "https://github.com/hkoikoi",
  email: "hello@example.com",
};
