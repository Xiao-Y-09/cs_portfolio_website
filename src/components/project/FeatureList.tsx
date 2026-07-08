import type { ProjectFeature } from "@/lib/types";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./FeatureList.module.css";

interface FeatureListProps {
  features: ProjectFeature[];
}

export default function FeatureList({ features }: FeatureListProps) {
  return (
    <section>
      <SectionTitle title="Key Features" />
      <ul className={styles.list}>
        {features.map((feature) => (
          <li key={feature.title}>
            <h4 className={styles.featureTitle}>{feature.title}</h4>
            <p className={styles.featureDescription}>{feature.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
