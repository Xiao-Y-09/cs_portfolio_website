"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import IconLink from "@/components/ui/IconLink";
import styles from "./LivePreview.module.css";

interface LivePreviewProps {
  url: string;
  title: string;
}

type Status = "loading" | "loaded" | "error";

function LoadingSpinner() {
  return (
    <svg
      className={styles.spinner}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="16,4 28,28 4,28" />
    </svg>
  );
}

export default function LivePreview({ url, title }: LivePreviewProps) {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setStatus((current) => (current === "loading" ? "error" : current));
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section>
      <SectionTitle title="Live Preview" />
      <div className={styles.wrapper}>
        <div className={styles.urlBar}>
          <span className={styles.dots} aria-hidden="true">
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
          <span className={styles.url}>{url}</span>
          <IconLink href={url} icon="external" label="Open" />
        </div>
        <div className={styles.frameArea}>
          {status === "error" ? (
            <div className={styles.fallback}>
              <p className={styles.fallbackText}>
                Preview unavailable. Visit the site directly →
              </p>
              <IconLink href={url} icon="external" label={title} />
            </div>
          ) : (
            <>
              <iframe
                className={styles.frame}
                src={url}
                title={`${title} live preview`}
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
                onLoad={() => setStatus("loaded")}
                onError={() => setStatus("error")}
              />
              {status === "loading" && (
                <div className={styles.overlay}>
                  <LoadingSpinner />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
