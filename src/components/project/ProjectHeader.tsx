import Link from "next/link";
import type { Project } from "@/lib/types";
import Tag from "@/components/ui/Tag";
import IconLink from "@/components/ui/IconLink";
import GeometricDivider from "@/components/ui/GeometricDivider";
import styles from "./ProjectHeader.module.css";

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header>
      <Link href="/" className={styles.backLink}>
        <span aria-hidden="true">←</span>
        <span>Back to Projects</span>
      </Link>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{project.title}</h1>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
        <div className={styles.meta}>
          <span className={styles.date}>{project.date}</span>
          {project.links.github && (
            <IconLink
              href={project.links.github}
              icon="github"
              label="GitHub"
            />
          )}
          {project.links.live && (
            <IconLink
              href={project.links.live}
              icon="external"
              label={project.links.live}
            />
          )}
        </div>
      </div>
      <GeometricDivider variant="line" />
    </header>
  );
}
