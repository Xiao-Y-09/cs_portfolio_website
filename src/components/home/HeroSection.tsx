import type { Profile } from "@/lib/types";
import Tag from "@/components/ui/Tag";
import IconLink from "@/components/ui/IconLink";
import GeometricDivider from "@/components/ui/GeometricDivider";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  profile: Profile;
}

function HeroDecoration() {
  return (
    <svg
      width="280"
      height="280"
      viewBox="0 0 280 280"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <circle cx="140" cy="140" r="130" />
      <circle cx="140" cy="140" r="100" />
      <circle cx="140" cy="140" r="70" />
      <circle cx="140" cy="140" r="40" />
      <line x1="0" y1="140" x2="280" y2="140" />
      <line x1="140" y1="0" x2="140" y2="280" />
      <line x1="20" y1="20" x2="260" y2="260" />
      <line x1="260" y1="20" x2="20" y2="260" />
    </svg>
  );
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section
      id="about"
      style={{
        paddingTop: "var(--space-4xl)",
        paddingBottom: "var(--space-4xl)",
      }}
    >
      <div className={styles.hero}>
        <div>
          <h1
            className="animate-fade-in-up"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-5xl)",
              fontWeight: 700,
            }}
          >
            {profile.name}
          </h1>
          <p
            className="animate-fade-in-up animate-delay-1"
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--color-text-secondary)",
              marginTop: "var(--space-sm)",
            }}
          >
            {profile.title}
          </p>
          <p
            className="animate-fade-in-up animate-delay-2"
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-text-secondary)",
              marginTop: "var(--space-lg)",
              maxWidth: "600px",
              lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}
          >
            {profile.bio}
          </p>
          <div className={`${styles.skills} animate-fade-in-up animate-delay-3`}>
            {profile.skills.map((skill) => (
              <Tag key={skill} label={skill} />
            ))}
          </div>
          <div className={`${styles.contact} animate-fade-in-up animate-delay-4`}>
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
        <div className={styles.decoration}>
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className={styles.decorationImg}
            />
          ) : (
            <HeroDecoration />
          )}
        </div>
      </div>
      <GeometricDivider variant="dots" />
    </section>
  );
}
