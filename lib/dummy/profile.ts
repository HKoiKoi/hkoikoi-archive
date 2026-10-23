import type { ProfileView } from "@/lib/types";

/**
 * intro는 빈 줄로 문단을 나눈다. 홈 히어로는 첫 문단만, 소개 페이지는 전체를 보여 준다.
 * TODO: 프로필 사진(photoUrl)은 파일이 정해지면 추가한다.
 */
export const dummyProfile: ProfileView = {
  name: "함상현",
  role: "백엔드 개발자",
  intro: [
    "대학 포털과 공공기관 ERP를 개발·운영하고, 클라우드 전환과 온프레미스 서버 구축을 직접 해 봤습니다. 석사 논문에서는 접속이 몰리는 분산 서버 환경의 동시성 제어를 연구했습니다.",
    "기독교교육과에서 학부를 시작했지만, 부전공으로 IT융합소프트웨어를 공부하면서 개발로 방향을 바꾸었습니다. 정보처리기사와 SQLD를 취득하고, (주)신나는플랫폼 기술연구소에서 약 1년 6개월간 대학 포털과 NCS 웹정보시스템을 개발·유지보수했습니다.",
    "국립국제교육원 국외인적자원시스템을 NIRS 대구센터 클라우드로 옮기며 MsSQL을 MariaDB로 전환했고, 이후 유지보수를 주 담당으로 맡았습니다. 경험이 없던 JBoss 서버 환경은 서버 관리자와 계속 확인하며 배포를 마쳤습니다. AWS 비용 부담 때문에 개발·운영 환경을 사내 Linux 서버로 옮기는 일도 했습니다.",
    "석사 과정(IT융합학과)에서는 분산 서버 환경에서 부하에 따라 락 방식을 자동 전환하는 프레임워크를 연구해 학회에서 발표했습니다. 최근에는 Claude Code로 개인 프로젝트를 만들며 PRD 작성, 작업 분해, 결과 검토까지 AI와 함께 일하는 방식을 익히고 있습니다.",
  ].join("\n\n"),
  skills: [
    { category: "백엔드", icon: "code", items: ["Java", "Spring Boot"] },
    {
      category: "데이터베이스",
      icon: "database",
      items: ["Oracle", "MySQL", "MariaDB", "MsSQL", "Redis"],
    },
    {
      category: "인프라",
      icon: "cloud",
      items: ["AWS", "Jenkins", "Docker", "Linux"],
    },
  ],
  focusAreas: [
    {
      title: "웹정보시스템 개발·유지보수",
      description:
        "대학 포털과 NCS 웹정보시스템의 기능 개발·유지보수. Cursor로 레거시 JSP를 리팩터링하고 결과는 E2E 테스트로 직접 검증했습니다.",
      icon: "code",
    },
    {
      title: "클라우드 전환",
      description:
        "국립국제교육원 시스템을 NIRS 대구센터 클라우드로 이관하고 MsSQL에서 MariaDB로 전환한 뒤 유지보수를 맡았습니다.",
      icon: "cloud",
    },
    {
      title: "온프레미스 인프라",
      description:
        "AWS 개발·운영 환경을 사내 Linux 서버(Jenkins, Docker)로 이관하고, 운영 중 장애는 재기동으로 대응했습니다.",
      icon: "server",
    },
  ],
  githubUrl: "https://github.com/HKoiKoi",
  email: "koikoilove99@gmail.com",
};
