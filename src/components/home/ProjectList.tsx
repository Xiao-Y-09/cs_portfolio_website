import type { CSSProperties } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./ProjectList.module.css";

interface ProjectListProps {
  projects: Project[];
  id?: string;
  title?: string;
  subtitle?: string;
}

// 次级项目走这条紧凑列表，不走卡片：一行标题 + 一行说明 + 技术栈，没有封面图。
// 上面三张大卡才是要被看进去的，这里只负责证明「还有别的」。
export default function ProjectList({
  projects,
  id = "more-projects",
  title = "More Projects",
  subtitle,
}: ProjectListProps) {
  if (projects.length === 0) return null;

  return (
    <section
      id={id}
      style={{
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-3xl)",
      }}
    >
      <SectionTitle title={title} subtitle={subtitle} />
      <ul className={styles.list} style={{ marginTop: "var(--space-xl)" }}>
        {projects.map((project, index) => (
          <li
            key={project.slug}
            data-reveal
            style={{ "--rv-i": index % 3 } as CSSProperties}
          >
            <Link href={`/projects/${project.slug}`} className={styles.row}>
              <div className={styles.main}>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.summary}>{project.summary}</p>
                <p className={styles.tags}>{project.tags.slice(0, 4).join(" · ")}</p>
              </div>
              <span className={styles.date}>{project.date}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
