import type { TechCategory } from "@/lib/types";
import SectionTitle from "@/components/ui/SectionTitle";
import IconLink from "@/components/ui/IconLink";
import styles from "./TechStackSection.module.css";

interface TechStackSectionProps {
  categories: TechCategory[];
  github: string | null;
}

export default function TechStackSection({
  categories,
  github,
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
      {github && (
        <div className={styles.links}>
          <IconLink href={github} icon="github" label="GitHub" />
        </div>
      )}
    </section>
  );
}
