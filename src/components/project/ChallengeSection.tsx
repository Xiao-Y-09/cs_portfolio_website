import type { ProjectChallenge } from "@/lib/types";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./ChallengeSection.module.css";

interface ChallengeSectionProps {
  challenges: ProjectChallenge[];
}

export default function ChallengeSection({
  challenges,
}: ChallengeSectionProps) {
  return (
    <section>
      <SectionTitle title="Challenges & Solutions" />
      <div className={styles.blocks}>
        {challenges.map((challenge) => (
          <div key={challenge.heading}>
            <h4 className={styles.heading}>{challenge.heading}</h4>
            <p className={styles.body}>{challenge.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
