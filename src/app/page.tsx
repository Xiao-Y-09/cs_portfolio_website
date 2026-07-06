import { getAllProjects, getProfile } from "@/lib/projects";
import PageWrapper from "@/components/layout/PageWrapper";
import HeroSection from "@/components/home/HeroSection";
import ProjectGrid from "@/components/home/ProjectGrid";

export default function HomePage() {
  const profile = getProfile();
  const projects = getAllProjects();

  return (
    <PageWrapper>
      <HeroSection profile={profile} />
      <ProjectGrid projects={projects} />
    </PageWrapper>
  );
}
