import { TechBadgeList } from "@/components/profile/tech-badge";

export function SkillsStrip({ skills }: { skills: string[] }) {
  if (skills.length === 0) return null;

  return (
    <section aria-label="기술 스택" className="border-y border-border py-5">
      <TechBadgeList
        items={skills}
        className="flex flex-wrap justify-center gap-2"
      />
    </section>
  );
}
