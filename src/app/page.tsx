import { getAllProjects, getProfile } from "@/lib/projects";
import PageWrapper from "@/components/layout/PageWrapper";
import HeroSection from "@/components/home/HeroSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import ProjectGrid from "@/components/home/ProjectGrid";
import ProjectList from "@/components/home/ProjectList";

export default function HomePage() {
  const profile = getProfile();
  const projects = getAllProjects();
  // 谁进上面那三张大卡，由 lib/projects.ts 的 FEATURED_SLUGS 决定。
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <PageWrapper>
      <HeroSection profile={profile} />
      <ExperienceSection experience={profile.experience} />
      <ProjectGrid
        projects={featured}
        title="Selected Work"
        subtitle="Three projects worth digging into"
      />
      <ProjectList projects={rest} />
    </PageWrapper>
  );
}
