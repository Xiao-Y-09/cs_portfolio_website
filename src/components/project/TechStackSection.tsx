import type { TechCategory } from "@/lib/types";
import SectionTitle from "@/components/ui/SectionTitle";
import IconLink from "@/components/ui/IconLink";
import styles from "./TechStackSection.module.css";

interface TechStackSectionProps {
  categories: TechCategory[];
  github: string | null;
  live: string | null;
}

export default function TechStackSection({
  categories,
  github,
  live,
}: TechStackSectionProps) {
  return (
    <section>
      <SectionTitle title="Tech Stack & Links" />
      <div className={styles.grid}>
        {categories.map((cat) => (
          <div key={cat.category}>
            <h4 className={styles.categoryName}>{cat.category}</h4>
            <ul className={styles.items}>
              {cat.items.map((item) => (
                <li key={item} className={styles.item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {(github || live) && (
        <div className={styles.links}>
          {live && (
            <IconLink
              href={live}
              icon="external"
              label={live}
              className={styles.repoLink}
            />
          )}
          {github && (
            <IconLink
              href={github}
              icon="github"
              label={github}
              className={styles.repoLink}
            />
          )}
        </div>
      )}
    </section>
  );
}
