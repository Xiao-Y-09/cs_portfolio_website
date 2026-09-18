"use client";

import Link from "next/link";
import type { PointerEvent } from "react";
import type { Project } from "@/lib/types";
import Tag from "@/components/ui/Tag";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
}

// 卡片高光：把鼠标换算成卡片内坐标写进 --cx / --cy，
// CSS 的 ::before / ::after 按它定位（见 ProjectCard.module.css）。
function trackGlow(e: PointerEvent<HTMLElement>) {
  if (e.pointerType === "touch") return;
  const card = e.currentTarget;
  const box = card.getBoundingClientRect();
  card.style.setProperty("--cx", `${e.clientX - box.left}px`);
  card.style.setProperty("--cy", `${e.clientY - box.top}px`);
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const visibleTags = project.tags.slice(0, 3);

  return (
    <Link href={`/projects/${project.slug}`} className={styles.link}>
      <article className={styles.card} onPointerMove={trackGlow}>
        <div className={styles.thumb}>
          {project.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnailUrl}
              alt={project.thumbnailAlt}
              className={`${styles.thumbImg} ${
                project.thumbnailOnLight ? styles.onLight : ""
              }`}
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
