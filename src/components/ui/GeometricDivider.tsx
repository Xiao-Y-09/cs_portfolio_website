interface GeometricDividerProps {
  variant?: "dots" | "line" | "triangles";
  className?: string;
}

export default function GeometricDivider({
  variant = "line",
  className,
}: GeometricDividerProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "var(--color-black)",
        marginTop: "var(--space-2xl)",
        marginBottom: "var(--space-2xl)",
      }}
    >
      {variant === "dots" && (
        <svg
          width="100"
          height="4"
          viewBox="0 0 100 4"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="2" cy="2" r="2" />
          <circle cx="18" cy="2" r="2" />
          <circle cx="34" cy="2" r="2" />
          <circle cx="50" cy="2" r="2" />
          <circle cx="66" cy="2" r="2" />
          <circle cx="82" cy="2" r="2" />
          <circle cx="98" cy="2" r="2" />
        </svg>
      )}
      {variant === "line" && (
        <svg
          width="200"
          height="8"
          viewBox="0 0 200 8"
          fill="currentColor"
          aria-hidden="true"
        >
          <polygon points="0,4 6,0 6,8" />
          <line
            x1="8"
            y1="4"
            x2="192"
            y2="4"
            stroke="currentColor"
            strokeWidth="1"
          />
          <polygon points="200,4 194,0 194,8" />
        </svg>
      )}
      {variant === "triangles" && (
        <svg
          width="56"
          height="7"
          viewBox="0 0 56 7"
          fill="currentColor"
          aria-hidden="true"
        >
          <polygon points="0,7 8,7 4,0" />
          <polygon points="24,7 32,7 28,0" />
          <polygon points="48,7 56,7 52,0" />
        </svg>
      )}
    </div>
  );
}
