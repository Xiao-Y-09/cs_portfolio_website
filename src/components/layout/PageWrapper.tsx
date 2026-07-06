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
        paddingTop: "var(--header-height)",
        paddingBottom: "var(--space-4xl)",
      }}
    >
      {children}
    </main>
  );
}
