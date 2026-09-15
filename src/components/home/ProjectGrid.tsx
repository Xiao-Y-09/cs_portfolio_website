import type { CSSProperties } from "react";
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
        {/* 卡片几乎总在首屏外，加载时就播完等于没人看见 —— 改成滚到了才揭示。
            延迟按每行三个循环，同一排之间错开、下一排重新开始。 */}
        {projects.map((project, index) => (
          <div
            key={project.slug}
            data-reveal
            style={{ "--rv-i": index % 3 } as CSSProperties}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
