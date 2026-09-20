import type { CSSProperties } from "react";
import type { Experience } from "@/lib/types";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./ExperienceSection.module.css";

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (experience.length === 0) return null;

  return (
    <section
      id="experience"
      style={{
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-3xl)",
      }}
    >
      <SectionTitle title="Experience" />
      <ol className={styles.list} style={{ marginTop: "var(--space-xl)" }}>
        {experience.map((item, index) => (
          <li
            key={`${item.company}-${item.role}`}
            className={styles.item}
            data-reveal
            style={{ "--rv-i": index } as CSSProperties}
          >
            <div className={styles.head}>
              <h3 className={styles.role}>{item.role}</h3>
              <span className={styles.period}>{item.period}</span>
            </div>
            <p className={styles.company}>{item.company}</p>
            <p className={styles.description}>{item.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
