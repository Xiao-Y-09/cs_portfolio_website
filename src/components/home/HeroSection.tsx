import type { CSSProperties } from "react";
import type { Profile } from "@/lib/types";
import Tag from "@/components/ui/Tag";
import IconLink from "@/components/ui/IconLink";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  profile: Profile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section
      id="about"
      style={{
        paddingBottom: "var(--space-4xl)",
      }}
    >
      {/* 四块各自定位到网格区域（见 module.css），而不是嵌在一个左列里 ——
          这样手机上竖排时能把自我介绍排到技能标签前面。 */}
      <div className={styles.hero}>
        <div className={styles.identity}>
          <h1
            className="animate-fade-in-up"
            style={{
              "--rv-i": 0,
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-5xl)",
              fontWeight: 700,
            } as CSSProperties}
          >
            {profile.name}
          </h1>
          <p
            className="animate-fade-in-up"
            style={{
              "--rv-i": 1,
              fontSize: "var(--text-xl)",
              color: "var(--color-text-secondary)",
              marginTop: "var(--space-sm)",
            } as CSSProperties}
          >
            {profile.title}
          </p>
        </div>
        <p
          className={`${styles.bio} animate-fade-in-up`}
          style={{ "--rv-i": 2 } as CSSProperties}
        >
          {profile.bio}
        </p>
        <div
          className={`${styles.skills} animate-fade-in-up`}
          style={{ "--rv-i": 3 } as CSSProperties}
        >
          {profile.skills.map((skill) => (
            <Tag key={skill} label={skill} />
          ))}
        </div>
        <div
          className={`${styles.contact} animate-fade-in-up`}
          style={{ "--rv-i": 4 } as CSSProperties}
        >
          <IconLink
            href={`mailto:${profile.contact.email}`}
            icon="email"
            label={profile.contact.email}
          />
          <IconLink
            href={profile.contact.github}
            icon="github"
            label={profile.contact.github}
          />
          <IconLink
            href={profile.contact.linkedin}
            icon="linkedin"
            label={profile.contact.linkedin}
          />
        </div>
      </div>
    </section>
  );
}
