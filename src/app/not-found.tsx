import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "var(--font-heading)",
        textAlign: "center",
        padding: "var(--space-lg)",
      }}
    >
      <p style={{ fontSize: "var(--text-5xl)", fontWeight: 700 }}>404</p>
      <p
        style={{
          fontSize: "var(--text-lg)",
          color: "var(--color-text-secondary)",
          marginTop: "var(--space-md)",
        }}
      >
        Page not found
      </p>
      <Link
        href="/"
        style={{
          marginTop: "var(--space-xl)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-sm)",
          borderBottom: "1px solid var(--color-border)",
          paddingBottom: "var(--space-xs)",
        }}
      >
        ← Back to Home
      </Link>
    </main>
  );
}
