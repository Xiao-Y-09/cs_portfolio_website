import { getAllProjects, getProfile } from "@/lib/projects";
import PageWrapper from "@/components/layout/PageWrapper";
import HeroSection from "@/components/home/HeroSection";
import ProjectGrid from "@/components/home/ProjectGrid";
import GeometricDivider from "@/components/ui/GeometricDivider";

export default function HomePage() {
  const profile = getProfile();
  const projects = getAllProjects();
  const completed = projects.filter((p) => p.status !== "processing");
  const processing = projects.filter((p) => p.status === "processing");

  return (
    <PageWrapper>
      <HeroSection profile={profile} />
      <ProjectGrid projects={completed} />
      {processing.length > 0 && (
        <>
          <GeometricDivider variant="line" />
          <ProjectGrid
            projects={processing}
            id="processing"
            title="Processing"
            subtitle="Ideas in progress"
          />
        </>
      )}
    </PageWrapper>
  );
}
