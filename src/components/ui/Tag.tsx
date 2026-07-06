import styles from "./Tag.module.css";

interface TagProps {
  label: string;
  className?: string;
}

export default function Tag({ label, className }: TagProps) {
  const combined = className ? `${styles.tag} ${className}` : styles.tag;
  return <span className={combined}>{label}</span>;
}
