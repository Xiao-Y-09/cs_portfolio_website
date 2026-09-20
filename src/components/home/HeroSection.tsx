import type { CSSProperties } from "react";
import type { Profile } from "@/lib/types";
import Tag from "@/components/ui/Tag";
import IconLink from "@/components/ui/IconLink";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  profile: Profile;
}

// 技能跑马灯的两个参数都从技能列表算，改 profile.json 时不会失效。
// 字宽按 --text-xs（12px）的等宽字算：0.6em 字宽 + 0.05em 字距 = 7.8px，
// 加上标签左右内边距 32px 和标签间距 8px。
const TAG_CHAR = 7.8;
const TAG_PADDING = 32;
const TAG_GAP = 8;
const SPEED = 22; // px/s，慢到不抢注意力，又能看清每个标签
const CONTAINER = 1152; // --max-width 减掉左右内边距

export default function HeroSection({ profile }: HeroSectionProps) {
  const runWidth =
    profile.skills.reduce((sum, s) => sum + s.length * TAG_CHAR + TAG_PADDING, 0) +
    profile.skills.length * TAG_GAP;
  // 无缝的条件：向左移动一份之后，剩下的内容还能铺满整个容器。
  // 一份 835px 、容器最宽 1152px，所以当前是 3 份；2 份会在一圈末尾露缝。
  const copies = Math.max(2, Math.ceil(CONTAINER / runWidth) + 1);

  return (
    <section
      id="about"
      style={{
        paddingTop: "var(--space-2xl)",
        paddingBottom: "var(--space-3xl)",
      }}
    >
      {/* 居中单列，一路读下来：名字 → 我是什么工程师 → 学历和求职意向 →
          自述 → 技能 → 联系方式。首屏只讲一件事，项目卡片才挤得进来。 */}
      {/* 发音那一行要对准名字里第一个词的中点，偏移量在 CSS 里算（见 .pronunciation） */}
      <div
        className={styles.hero}
        style={
          {
            "--name-chars": profile.name.length,
            "--first-word-chars": profile.name.split(" ")[0].length,
          } as CSSProperties
        }
      >
        <h1
          className={`${styles.name} animate-fade-in-up`}
          style={{ "--rv-i": 0 } as CSSProperties}
        >
          {profile.name}
        </h1>
        <p
          className={`${styles.pronunciation} animate-fade-in-up`}
          style={{ "--rv-i": 1 } as CSSProperties}
        >
          {profile.pronunciation}
        </p>
        <p
          className={`${styles.title} animate-fade-in-up`}
          style={{ "--rv-i": 2 } as CSSProperties}
        >
          {profile.title}
        </p>
        <div
          className={`${styles.tagline} animate-fade-in-up`}
          style={{ "--rv-i": 3 } as CSSProperties}
        >
          {profile.tagline.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {/* 断行和条目都写在 profile.json 里，不靠容器宽度去撞。 */}
        <div
          className={`${styles.bio} animate-fade-in-up`}
          style={{ "--rv-i": 4 } as CSSProperties}
        >
          {profile.bio.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className={styles.bioLead}>{profile.bio.listTitle}</p>
          <ul className={styles.bioList}>
            {profile.bio.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        {/* 三个链接都只显示短标签，真实地址在 href 里 ——
            邮箱全写出来比另两个长一倍，一行里它会把其他两个压下去。 */}
        <div
          className={`${styles.contact} animate-fade-in-up`}
          style={{ "--rv-i": 5 } as CSSProperties}
        >
          <IconLink
            href={`mailto:${profile.contact.email}`}
            icon="email"
            label="E-mail"
          />
          <IconLink href={profile.contact.github} icon="github" label="GitHub" />
          <IconLink
            href={profile.contact.linkedin}
            icon="linkedin"
            label="LinkedIn"
          />
        </div>
        {/* 跑马灯：同一份标签平铺 N 份，轨道向左恰好移动一份的宽度后回到原点，
            所以接缝处看不出来。副本对屏幕阅读器隐藏，不然技能会被读 N 遍。 */}
        <div
          className={`${styles.skills} animate-fade-in-up`}
          style={
            {
              "--rv-i": 6,
              "--marquee-copies": copies,
              "--marquee-duration": `${(runWidth / SPEED).toFixed(1)}s`,
            } as CSSProperties
          }
        >
          <div className={styles.track}>
            {Array.from({ length: copies }, (_, copy) => (
              <div
                key={copy}
                className={styles.run}
                aria-hidden={copy > 0 || undefined}
              >
                {profile.skills.map((skill) => (
                  <Tag key={skill} label={skill} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
