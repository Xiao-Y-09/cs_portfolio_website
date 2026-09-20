import Link from "next/link";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
];

// 不再是导航栏：不吸顶、不上底色、没有汉堡菜单，就是页面顶上的三个链接。
// 高度仍占 --header-height，所以去掉 sticky 之后下面的内容位置不动。
export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
