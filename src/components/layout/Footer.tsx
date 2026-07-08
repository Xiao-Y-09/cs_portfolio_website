import IconLink from "../ui/IconLink";
import styles from "./Footer.module.css";

interface FooterProps {
  name: string;
  contact: {
    email: string;
    github: string;
    linkedin: string;
  };
  className?: string;
}

export default function Footer({ name, contact, className }: FooterProps) {
  const year = new Date().getFullYear();
  const combined = className
    ? `${styles.footer} ${className}`
    : styles.footer;

  return (
    <footer id="contact" className={combined}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <span className={styles.name}>{name}</span>
          <div className={styles.socials}>
            <IconLink
              href={`mailto:${contact.email}`}
              icon="email"
              label={contact.email}
            />
            <IconLink href={contact.github} icon="github" label={contact.github} />
            <IconLink
              href={contact.linkedin}
              icon="linkedin"
              label={contact.linkedin}
            />
          </div>
        </div>
        <p className={styles.copyright}>© {year} All rights reserved.</p>
      </div>
    </footer>
  );
}
