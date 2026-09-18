import type { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main
      className={className}
      style={{
        maxWidth: "var(--max-width)",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "var(--space-lg)",
        paddingRight: "var(--space-lg)",
        // 顶栏是 sticky 的，已经占着文档流里的 --header-height，这里再补一次
        // 就成了双份。只留一点让内容不贴着顶栏。
        paddingTop: "var(--space-xl)",
        paddingBottom: "var(--space-4xl)",
      }}
    >
      {children}
    </main>
  );
}
