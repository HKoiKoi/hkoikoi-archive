export const siteConfig = {
  name: "HKoiKoi.dev",
  description: "HKoiKoi의 포트폴리오와 개발 기록",
} as const;

/** 릴리스 플래그. 1차 릴리스에서는 블로그와 관리자를 끈다. */
export const features = {
  blog: false,
  admin: false,
} as const;

export type FeatureKey = keyof typeof features;

export type NavItem = {
  label: string;
  href: string;
  feature?: FeatureKey;
};

export const navItems: readonly NavItem[] = [
  { label: "소개", href: "/about" },
  { label: "프로젝트", href: "/projects" },
  { label: "블로그", href: "/blog", feature: "blog" },
  { label: "연락", href: "/contact" },
];

export const contactLinks = {
  github: "https://github.com/HKoiKoi",
  email: "koikoilove99@gmail.com",
} as const;

/** 이력서 PDF 경로. 1차에서는 비어 있다. */
export const resumeUrl: string | undefined = undefined;

export function isFeatureEnabled(feature?: FeatureKey): boolean {
  return feature === undefined || features[feature];
}
