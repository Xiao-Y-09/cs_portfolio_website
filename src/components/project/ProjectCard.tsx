import Link from "next/link";
import type { Project } from "@/lib/types";
import Tag from "@/components/ui/Tag";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const visibleTags = project.tags.slice(0, 3);

  return (
    <Link href={`/projects/${project.slug}`} className={styles.link}>
      <article className={styles.card}>
        <div className={styles.thumb}>
          {project.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnailUrl}
              alt={project.thumbnailAlt}
              className={styles.thumbImg}
            />
          ) : (
            <PlaceholderImage width="100%" height="100%" />
          )}
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.summary}>{project.summary}</p>
          <div className={styles.tags}>
            {visibleTags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
          <p className={styles.date}>{project.date}</p>
        </div>
      </article>
    </Link>
  );
}
