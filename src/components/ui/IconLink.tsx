import styles from "./IconLink.module.css";

interface IconLinkProps {
  href: string;
  icon: "github" | "external" | "email" | "linkedin";
  label: string;
  className?: string;
}

function GithubIcon() {
  return (
    <svg
      className={styles.icon}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      className={styles.icon}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M9 1h6v6" />
      <path d="M15 1L7 9" />
      <path d="M13 8v6H2V3h6" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      className={styles.icon}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1" y="3" width="14" height="10" />
      <path d="M1 4l7 5 7-5" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      className={styles.icon}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.632 13.635h-2.37V9.922c0-.886-.018-2.025-1.234-2.025-1.235 0-1.424.965-1.424 1.961v3.777h-2.37V6h2.276v1.04h.032c.317-.6 1.091-1.233 2.246-1.233 2.4 0 2.845 1.58 2.845 3.637v4.191zM3.558 4.955a1.376 1.376 0 1 1 0-2.751 1.376 1.376 0 0 1 0 2.751zm1.187 8.68h-2.37V6h2.37v7.635zM14.816 0H1.18C.528 0 0 .516 0 1.153v13.694C0 15.484.528 16 1.18 16h13.635c.652 0 1.185-.516 1.185-1.153V1.153C16 .516 15.467 0 14.815 0h.001z" />
    </svg>
  );
}

const ICONS = {
  github: GithubIcon,
  external: ExternalIcon,
  email: EmailIcon,
  linkedin: LinkedinIcon,
};

export default function IconLink({ href, icon, label, className }: IconLinkProps) {
  const Icon = ICONS[icon];
  const combined = className ? `${styles.iconLink} ${className}` : styles.iconLink;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={combined}>
      <Icon />
      <span>{label}</span>
    </a>
  );
}
