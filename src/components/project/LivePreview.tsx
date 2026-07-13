"use client";

import { useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import IconLink from "@/components/ui/IconLink";
import styles from "./LivePreview.module.css";

interface LivePreviewProps {
  url: string;
  title: string;
  /** Marks bundled demo builds; shows a DEMO badge and footnote. */
  demo?: boolean;
  /** Screenshot shown on mobile and when the iframe fails to load. */
  fallbackImage?: string | null;
  /** Footnote under the preview; overrides the default demo disclaimer. */
  note?: string;
}

// "pending"  — waiting for viewport intersection, nothing mounted yet
// "frame"    — iframe mounted (desktop, in view)
// "static"   — screenshot/link only (mobile, or iframe failed)
type Mode = "pending" | "frame" | "static";
type FrameStatus = "loading" | "loaded";

const LOAD_TIMEOUT_MS = 8000;

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

function StaticFallback({
  url,
  title,
  fallbackImage,
}: {
  url: string;
  title: string;
  fallbackImage?: string | null;
}) {
  if (fallbackImage) {
    return (
      <div className={styles.staticWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export serves plain files */}
        <img
          className={styles.staticImage}
          src={fallbackImage}
          alt={`${title} screenshot`}
          loading="lazy"
        />
        <div className={styles.staticBar}>
          <span className={styles.staticNote}>Static preview</span>
          <IconLink href={url} icon="external" label="Open in new window" />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.fallback}>
      <p className={styles.fallbackText}>
        Preview unavailable here. Visit the site directly →
      </p>
      <IconLink href={url} icon="external" label={title} />
    </div>
  );
}

export default function LivePreview({
  url,
  title,
  demo = false,
  fallbackImage,
  note,
}: LivePreviewProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [frameStatus, setFrameStatus] = useState<FrameStatus>("loading");

  // Decide mobile vs desktop once, then lazy-mount the iframe on intersection.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setMode("static");
      return;
    }
    const node = areaRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      setMode("frame");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMode("frame");
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Give up on a stalled iframe and fall back to the screenshot.
  useEffect(() => {
    if (mode !== "frame" || frameStatus !== "loading") return;
    const timeout = window.setTimeout(() => setMode("static"), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, [mode, frameStatus]);

  return (
    <section>
      <SectionTitle title={demo ? "Interactive Demo" : "Live Preview"} />
      <div className={styles.wrapper}>
        <div className={styles.urlBar}>
          <span className={styles.dots} aria-hidden="true">
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
          <span className={styles.url}>{url}</span>
          {demo && <span className={styles.demoBadge}>Demo</span>}
          <IconLink href={url} icon="external" label="Open" />
        </div>
        <div ref={areaRef} className={styles.frameArea}>
          {mode === "static" ? (
            <StaticFallback url={url} title={title} fallbackImage={fallbackImage} />
          ) : (
            <>
              {mode === "frame" && (
                <iframe
                  className={styles.frame}
                  src={url}
                  title={`${title} ${demo ? "demo" : "live"} preview`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                  onLoad={() => setFrameStatus("loaded")}
                />
              )}
              {frameStatus === "loading" && (
                <div className={styles.overlay}>
                  <LoadingSpinner />
                </div>
              )}
            </>
          )}
        </div>
        {(demo || note) && (
          <p className={styles.demoNote}>
            {note ?? "Demo mode — runs on realistic sample data. Full version on GitHub."}
          </p>
        )}
      </div>
    </section>
  );
}
