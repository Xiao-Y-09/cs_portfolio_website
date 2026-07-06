import type { Algorithm } from "@/lib/types";
import SectionTitle from "@/components/ui/SectionTitle";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import styles from "./AlgorithmFlow.module.css";

interface AlgorithmFlowProps {
  algorithm: Algorithm;
  projectSlug: string;
}

export default function AlgorithmFlow({ algorithm }: AlgorithmFlowProps) {
  return (
    <section>
      <SectionTitle title="Algorithm Flow" />
      <p className={styles.overview} style={{ marginTop: "var(--space-lg)" }}>
        {algorithm.overview}
      </p>
      <ol className={styles.steps}>
        {algorithm.steps.map((step, index) => {
          const isLast = index === algorithm.steps.length - 1;
          return (
            <li key={step.step} className={styles.step}>
              <div className={styles.railColumn}>
                <div className={styles.badge}>{step.step}</div>
                {!isLast && <div className={styles.connector} />}
              </div>
              <div className={styles.body}>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDescription}>{step.description}</p>
                {step.image && (
                  <div className={styles.stepImage}>
                    <PlaceholderImage height="220px" />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
