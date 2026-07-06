interface PlaceholderImageProps {
  width?: string;
  height?: string;
  label?: string;
  className?: string;
}

export default function PlaceholderImage({
  width = "100%",
  height = "200px",
  label,
  className,
}: PlaceholderImageProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-sm)",
        color: "var(--color-gray-400)",
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <line x1="24" y1="4" x2="24" y2="44" />
        <line x1="4" y1="24" x2="44" y2="24" />
        <line x1="4" y1="4" x2="44" y2="44" />
        <line x1="44" y1="4" x2="4" y2="44" />
      </svg>
      {label && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-gray-400)",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
