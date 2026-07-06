interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  align = "left",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "block",
          width: "16px",
          height: "2px",
          backgroundColor: "var(--color-black)",
          marginBottom: "var(--space-md)",
        }}
      />
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "var(--text-3xl)",
          fontWeight: 700,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: "var(--text-base)",
            color: "var(--color-text-secondary)",
            marginTop: "var(--space-sm)",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
