import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects";
import PageWrapper from "@/components/layout/PageWrapper";
import ProjectHeader from "@/components/project/ProjectHeader";
import TechStackSection from "@/components/project/TechStackSection";
import FeatureList from "@/components/project/FeatureList";
import ChallengeSection from "@/components/project/ChallengeSection";
import AlgorithmFlow from "@/components/project/AlgorithmFlow";
import ImageGallery from "@/components/project/ImageGallery";
import LivePreview from "@/components/project/LivePreview";
import GeometricDivider from "@/components/ui/GeometricDivider";
import SectionTitle from "@/components/ui/SectionTitle";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  if (project.status === "processing") {
    return (
      <PageWrapper>
        <div className="animate-fade-in-up">
          <ProjectHeader project={project} />
          <section style={{ marginTop: "var(--space-3xl)" }}>
            <SectionTitle title="Project Overview" />
            <p
              style={{
                fontSize: "var(--text-lg)",
                lineHeight: 1.8,
                color: "var(--color-text-secondary)",
                marginTop: "var(--space-lg)",
              }}
            >
              {project.description}
            </p>
          </section>
          <GeometricDivider variant="dots" />
          <div style={{ margin: "var(--space-3xl) 0" }}>
            <PlaceholderImage height="280px" label="Work in progress" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="animate-fade-in-up">
      <ProjectHeader project={project} />
      <section style={{ marginTop: "var(--space-3xl)" }}>
        <SectionTitle title="Project Overview" />
        <p
          style={{
            fontSize: "var(--text-lg)",
            lineHeight: 1.8,
            color: "var(--color-text-secondary)",
            marginTop: "var(--space-lg)",
          }}
        >
          {project.description}
        </p>
      </section>
      {project.links.live && (
        <>
          <GeometricDivider variant="line" />
          <LivePreview url={project.links.live} title={project.title} />
        </>
      )}
      <GeometricDivider variant="dots" />
      {project.techStack && (
        <>
          <TechStackSection
            categories={project.techStack}
            github={project.links.github}
            live={project.links.live}
          />
          <GeometricDivider variant="line" />
        </>
      )}
      {project.features && (
        <>
          <FeatureList features={project.features} />
          <GeometricDivider variant="triangles" />
        </>
      )}
      <AlgorithmFlow
        algorithm={project.algorithm}
        projectSlug={project.slug}
      />
      {project.challenges && (
        <>
          <GeometricDivider variant="dots" />
          <ChallengeSection challenges={project.challenges} />
        </>
      )}
      {project.images.length > 0 && (
        <>
          <GeometricDivider variant="triangles" />
          <ImageGallery images={project.images} projectSlug={project.slug} />
        </>
      )}
      </div>
    </PageWrapper>
  );
}
