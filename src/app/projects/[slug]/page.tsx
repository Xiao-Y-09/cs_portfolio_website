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

  // 首页分栏（大卡 / 列表）跟这里无关。详情页只看内容：写完的出完整案例，
  // 还没写的给占位页。真正没东西的项目在 JSON 里标 draft，根本到不了这。
  const hasWriteUp = Boolean(
    project.techStack?.length ||
      project.features?.length ||
      project.challenges?.length ||
      project.algorithm?.steps?.length
  );

  if (!hasWriteUp) {
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
      {(project.links.demo || project.links.live) && (
        <LivePreview
          url={(project.links.demo ?? project.links.live) as string}
          title={project.title}
          demo={Boolean(project.links.demo)}
          fallbackImage={project.previewImageUrl ?? project.thumbnailUrl}
          fallbackOnLight={
            project.previewImageUrl
              ? project.previewOnLight
              : project.thumbnailOnLight
          }
          note={project.previewNote}
        />
      )}
      {project.techStack && (
        <TechStackSection
          categories={project.techStack}
          github={project.links.github}
          live={project.links.live}
        />
      )}
      {project.features && (
        <FeatureList features={project.features} />
      )}
      <AlgorithmFlow
        algorithm={project.algorithm}
        projectSlug={project.slug}
      />
      {project.challenges && (
        <ChallengeSection challenges={project.challenges} />
      )}
      {project.images.length > 0 && (
        <ImageGallery images={project.images} projectSlug={project.slug} />
      )}
      </div>
    </PageWrapper>
  );
}
