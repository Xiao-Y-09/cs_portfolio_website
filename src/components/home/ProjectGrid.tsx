import type { Project } from "@/lib/types";
import ProjectCard from "@/components/project/ProjectCard";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./ProjectGrid.module.css";

interface ProjectGridProps {
  projects: Project[];
  id?: string;
  title?: string;
  subtitle?: string;
}

export default function ProjectGrid({
  projects,
  id = "projects",
  title = "Projects",
  subtitle = "Selected works and experiments",
}: ProjectGridProps) {
  return (
    <section
      id={id}
      style={{
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-3xl)",
      }}
    >
      <SectionTitle title={title} subtitle={subtitle} />
      <div className={styles.grid} style={{ marginTop: "var(--space-2xl)" }}>
        {projects.map((project, index) => (
          <div
            key={project.slug}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
