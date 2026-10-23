import { Suspense } from "react";

import { FeaturedProjects } from "./_components/featured-projects";
import { FocusAreas } from "./_components/focus-areas";
import { Hero } from "./_components/hero";
import { HomeMetrics } from "./_components/home-metrics";
import { LatestPosts } from "./_components/latest-posts";
import { SkillsStrip } from "./_components/skills-strip";
import { getProfile } from "@/lib/queries/profile";

export default async function Page() {
  const profile = await getProfile();

  return (
    <>
      <Hero profile={profile} />
      <SkillsStrip skills={profile.skills} />
      <FocusAreas areas={profile.focusAreas} />
      <Suspense>
        <HomeMetrics />
      </Suspense>
      <FeaturedProjects />
      <LatestPosts />
    </>
  );
}
