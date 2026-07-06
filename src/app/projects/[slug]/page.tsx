import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects";
import PageWrapper from "@/components/layout/PageWrapper";
import ProjectHeader from "@/components/project/ProjectHeader";
import AlgorithmFlow from "@/components/project/AlgorithmFlow";
import ImageGallery from "@/components/project/ImageGallery";
import LivePreview from "@/components/project/LivePreview";
import GeometricDivider from "@/components/ui/GeometricDivider";

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

  return (
    <PageWrapper>
      <div className="animate-fade-in-up">
      <ProjectHeader project={project} />
      <section style={{ marginTop: "var(--space-3xl)" }}>
        <p
          style={{
            fontSize: "var(--text-lg)",
            lineHeight: 1.8,
            color: "var(--color-text-secondary)",
          }}
        >
          {project.description}
        </p>
      </section>
      <GeometricDivider variant="dots" />
      <AlgorithmFlow
        algorithm={project.algorithm}
        projectSlug={project.slug}
      />
      <GeometricDivider variant="triangles" />
      <ImageGallery images={project.images} projectSlug={project.slug} />
      {project.links.live && (
        <>
          <GeometricDivider variant="line" />
          <LivePreview url={project.links.live} title={project.title} />
        </>
      )}
      </div>
    </PageWrapper>
  );
}
