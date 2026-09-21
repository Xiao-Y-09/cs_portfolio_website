import type { CSSProperties } from "react";
import type { Experience } from "@/lib/types";
import SectionTitle from "@/components/ui/SectionTitle";
import styles from "./ExperienceSection.module.css";

interface ExperienceSectionProps {
  experience: Experience[];
}

// "youdescribe.org" 里的点在正则里是通配符，不转义的话
// "youdescribeXorg" 之类的东西也会被当成命中。
const escapeRegExp = (s: string) => s.replace(/[^\w\s]/g, (c) => "\\" + c);

// 把描述按要链接的词切开，命中的那几段包成 <a>。
// 包括分隔符的分组捕获让 split 把匹配到的词也留在结果里。
function linkify(text: string, links?: Record<string, string>) {
  const words = Object.keys(links ?? {});
  if (words.length === 0) return text;
  const pattern = new RegExp(`(${words.map(escapeRegExp).join("|")})`, "g");
  return text.split(pattern).map((part, i) =>
    links?.[part] ? (
      <a key={i} href={links[part]} target="_blank" rel="noopener noreferrer">
        {part}
      </a>
    ) : (
      part
    )
  );
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (experience.length === 0) return null;

  return (
    <section
      id="experience"
      style={{
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-3xl)",
      }}
    >
      <SectionTitle title="Experience" />
      <ol className={styles.list} style={{ marginTop: "var(--space-xl)" }}>
        {experience.map((item, index) => (
          <li
            key={`${item.company}-${item.role}`}
            className={styles.item}
            data-reveal
            style={{ "--rv-i": index } as CSSProperties}
          >
            <div className={styles.head}>
              <h3 className={styles.role}>{item.role}</h3>
              <span className={styles.period}>{item.period}</span>
            </div>
            <p className={styles.company}>{item.company}</p>
            <p className={styles.description}>
              {linkify(item.description, item.links)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
